$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-XlsxSharedStrings {
    param([Parameter(Mandatory = $true)][string]$Path)
    $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
    try {
        $entry = $zip.GetEntry('xl/sharedStrings.xml')
        if (-not $entry) { return @() }
        $reader = [IO.StreamReader]::new($entry.Open())
        try { [xml]$xml = $reader.ReadToEnd() } finally { $reader.Close() }
        $ns = [System.Xml.XmlNamespaceManager]::new($xml.NameTable)
        $ns.AddNamespace('d', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main')
        $values = New-Object System.Collections.Generic.List[string]
        foreach ($si in $xml.SelectNodes('//d:si', $ns)) {
            $text = (($si.SelectNodes('.//d:t', $ns) | ForEach-Object { $_.InnerText }) -join '')
            $values.Add($text)
        }
        return $values
    }
    finally {
        $zip.Dispose()
    }
}

function Get-XlsxRows {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string[]]$SharedStrings
    )
    $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
    try {
        $entry = $zip.GetEntry('xl/worksheets/sheet1.xml')
        if (-not $entry) { throw 'Worksheet sheet1.xml tidak ditemukan.' }
        $reader = [IO.StreamReader]::new($entry.Open())
        try { [xml]$xml = $reader.ReadToEnd() } finally { $reader.Close() }
        $ns = [System.Xml.XmlNamespaceManager]::new($xml.NameTable)
        $ns.AddNamespace('d', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main')

        function Get-CellValue {
            param($Cell)
            if (-not $Cell) { return '' }
            $type = [string]$Cell.t
            $valueNode = $Cell.SelectSingleNode('d:v', $ns)
            if (-not $valueNode) { return '' }
            $raw = [string]$valueNode.InnerText
            if ($type -eq 's') {
                $index = [int]$raw
                if ($index -ge 0 -and $index -lt $SharedStrings.Count) { return $SharedStrings[$index] }
            }
            return $raw
        }

        $rows = $xml.SelectNodes('//d:sheetData/d:row', $ns)
        if (-not $rows -or $rows.Count -lt 2) { return @() }

        $headerMap = [ordered]@{}
        foreach ($cell in $rows[0].SelectNodes('d:c', $ns)) {
            $ref = [string]$cell.r
            $col = ($ref -replace '\d', '')
            $headerMap[$col] = Get-CellValue $cell
        }

        $data = New-Object System.Collections.Generic.List[object]
        foreach ($row in ($rows | Select-Object -Skip 1)) {
            $obj = [ordered]@{}
            foreach ($cell in $row.SelectNodes('d:c', $ns)) {
                $ref = [string]$cell.r
                $col = ($ref -replace '\d', '')
                $header = [string]$headerMap[$col]
                if (-not $header) { continue }
                $obj[$header] = Get-CellValue $cell
            }
            if ($obj['PRODUCT CODE']) {
                $data.Add([pscustomobject]$obj)
            }
        }
        return $data
    }
    finally {
        $zip.Dispose()
    }
}

function To-DecimalOrZero {
    param([string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value)) { return 0 }
    $parsed = 0.0
    if ([double]::TryParse($Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$parsed)) {
        return [math]::Round($parsed, 6)
    }
    return 0
}

$workspace = $PSScriptRoot
$bomWorkbook = 'C:\Users\Mandalika\OneDrive\Documents\bom.xlsx'
$masterPath = Join-Path $workspace 'master-data.js'

$sharedStrings = Get-XlsxSharedStrings -Path $bomWorkbook
$rows = Get-XlsxRows -Path $bomWorkbook -SharedStrings $sharedStrings

$raw = Get-Content -Path $masterPath -Raw
$json = $raw -replace '^\s*window\.MASTER_DATA\s*=\s*', '' -replace ';\s*$', ''
$data = $json | ConvertFrom-Json

$fgCodes = @{}
foreach ($fg in $data.fg_items) { $fgCodes[[string]$fg.fg_code] = $true }
$rmCodes = @{}
foreach ($rm in $data.rm_items) { $rmCodes[[string]$rm.rm_code] = $true }

$headerMap = [ordered]@{}
$details = New-Object System.Collections.Generic.List[object]
$headerSequence = New-Object System.Collections.Generic.List[string]

foreach ($row in $rows) {
    $productCode = [string]$row.'PRODUCT CODE'
    $productName = [string]$row.'PRODUCT NAME'
    $type = [string]$row.TYPE
    $gender = [string]$row.GENDER
    $size = [string]$row.SIZE
    $uom = [string]$row.UOM
    $materialCode = [string]$row.'MATERIAL CODE'
    $materialName = [string]$row.'MATERIAL NAME'
    $qty = To-DecimalOrZero ([string]$row.QUANTITY)
    $bomCode = "BOM-$productCode"
    $isPercent = ($qty -gt 0 -and $qty -lt 1)
    $qtyPercent = if ($isPercent) { [math]::Round($qty * 100, 4) } else { $null }

    if (-not $headerMap.Contains($bomCode)) {
        $headerMap[$bomCode] = [pscustomobject]@{
            bom_code = $bomCode
            fg_code = $productCode
            fg_name = $productName
            variant_type = $type
            gender = $gender
            pack_size = $size
            output_uom = $uom
            version = 'V1'
            status = 'Aktif'
            matched_fg = [bool]$fgCodes.ContainsKey($productCode)
            match_note = if ($fgCodes.ContainsKey($productCode)) { '' } else { 'FG belum match di master' }
        }
        $headerSequence.Add($bomCode) | Out-Null
    }

    $details.Add([pscustomobject]@{
        bom_code = $bomCode
        fg_code = $productCode
        material_code = $materialCode
        material_name = $materialName
        qty = $qty
        qty_is_percent = $isPercent
        qty_percent = $qtyPercent
        uom = if ($isPercent) { '%' } else { $uom }
        matched_rm = [bool]$rmCodes.ContainsKey($materialCode)
        match_note = if ($rmCodes.ContainsKey($materialCode)) { '' } else { 'RM belum match di master' }
    }) | Out-Null
}

$bomHeaders = @($headerSequence | ForEach-Object { $headerMap[$_] })
$bomDetails = $details.ToArray()
$syncTime = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$baseText = Get-Content -Path $masterPath -Raw
$baseText = [regex]::Replace($baseText, "(?s)// BOM_SYNC_START.*?// BOM_SYNC_END\s*", "")
$append = @"

// BOM_SYNC_START
window.MASTER_DATA.bom_headers = $($bomHeaders | ConvertTo-Json -Depth 20 -Compress);
window.MASTER_DATA.bom_details = $($bomDetails | ConvertTo-Json -Depth 20 -Compress);
window.MASTER_DATA.meta.bom_sync = "$syncTime";
window.MASTER_DATA.meta.bom_source = "$bomWorkbook";
// BOM_SYNC_END
"@
Set-Content -Path $masterPath -Value ($baseText.TrimEnd() + "`r`n" + $append + "`r`n") -Encoding UTF8

$unmatchedFg = @($bomHeaders | Where-Object { -not $_.matched_fg }).Count
$unmatchedRm = @($bomDetails | Where-Object { -not $_.matched_rm }).Count
Write-Output "Updated master-data.js with BOM data. Unmatched FG=$unmatchedFg, Unmatched RM=$unmatchedRm"
