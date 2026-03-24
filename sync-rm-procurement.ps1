$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-XlsxSheetRows {
    param(
        [Parameter(Mandatory = $true)][string]$Path
    )

    $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
    try {
        $sheetEntry = $zip.GetEntry('xl/worksheets/sheet1.xml')
        if (-not $sheetEntry) {
            throw "Worksheet xl/worksheets/sheet1.xml tidak ditemukan."
        }

        $reader = [System.IO.StreamReader]::new($sheetEntry.Open())
        try {
            $sheetXml = $reader.ReadToEnd()
        } finally {
            $reader.Close()
        }

        [xml]$xml = $sheetXml
        $ns = [System.Xml.XmlNamespaceManager]::new($xml.NameTable)
        $ns.AddNamespace('d', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main')

        function Get-CellValue {
            param($Cell)
            if (-not $Cell) { return '' }
            $inlineNode = $Cell.SelectSingleNode('d:is/d:t', $ns)
            if ($inlineNode) { return [string]$inlineNode.InnerText }
            $valueNode = $Cell.SelectSingleNode('d:v', $ns)
            if ($valueNode) { return [string]$valueNode.InnerText }
            return ''
        }

        $rows = $xml.SelectNodes('//d:sheetData/d:row', $ns)
        if (-not $rows -or $rows.Count -lt 2) {
            return @()
        }

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
            if ($obj['Kode Barang']) {
                $data.Add([pscustomobject]$obj)
            }
        }

        return $data
    }
    finally {
        $zip.Dispose()
    }
}

function Normalize-Name {
    param([string]$Value)
    if (-not $Value) { return '' }
    return (($Value -replace '\s+', ' ').Trim()).ToUpperInvariant()
}

function To-DecimalOrNull {
    param([string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value)) { return $null }
    $parsed = 0.0
    if ([double]::TryParse($Value, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$parsed)) {
        return [math]::Round($parsed, 6)
    }
    return $null
}

$workspace = $PSScriptRoot
$itemWorkbook = 'C:\Users\Mandalika\Downloads\daftar-barang (2).xlsx'
$masterPath = Join-Path $workspace 'master-data.js'

$rows = Get-XlsxSheetRows -Path $itemWorkbook

$rowByCode = @{}
foreach ($row in $rows) {
    $code = [string]$row.'Kode Barang'
    if ($code) {
        $rowByCode[$code] = $row
    }
}

$raw = Get-Content -Path $masterPath -Raw
$json = $raw -replace '^\s*//.*?\r?\n', '' -replace '^\s*window\.MASTER_DATA\s*=\s*', '' -replace ';\s*$', ''
$data = $json | ConvertFrom-Json

$vendorByName = @{}
foreach ($vendor in $data.vendors) {
    $key = Normalize-Name $vendor.vendor_name
    if ($key -and -not $vendorByName.ContainsKey($key)) {
        $vendorByName[$key] = $vendor
    }
}

foreach ($rm in $data.rm_items) {
    $row = $rowByCode[$rm.rm_code]
    if (-not $row) { continue }

    $primarySupplier = [string]$row.'Pemasok Utama'
    $purchasePrice = To-DecimalOrNull ([string]$row.'Harga Beli')
    $minimumBuy = To-DecimalOrNull ([string]$row.'Minimum Beli')
    $minStock = To-DecimalOrNull ([string]$row.'Batas Minimum Stok')
    $buyUom = [string]$row.'Satuan Beli'

    $rm | Add-Member -NotePropertyName primary_supplier -NotePropertyValue $primarySupplier -Force
    $rm | Add-Member -NotePropertyName purchase_price -NotePropertyValue $purchasePrice -Force
    $rm | Add-Member -NotePropertyName minimum_buy -NotePropertyValue $minimumBuy -Force
    $rm | Add-Member -NotePropertyName min_stock -NotePropertyValue $minStock -Force
    $rm | Add-Member -NotePropertyName purchase_uom -NotePropertyValue $buyUom -Force

    if ($primarySupplier) {
        $matchedVendor = $vendorByName[(Normalize-Name $primarySupplier)]
        if ($matchedVendor) {
            $rm.default_vendor_code = $matchedVendor.vendor_code
            if (-not $rm.default_vendor_category) {
                $rm.default_vendor_category = $matchedVendor.vendor_category
            }
        }
    }
}

$data.meta | Add-Member -NotePropertyName rm_procurement_sync -NotePropertyValue (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') -Force
$output = 'window.MASTER_DATA = ' + ($data | ConvertTo-Json -Depth 100 -Compress) + ';'
Set-Content -Path $masterPath -Value $output -Encoding UTF8

Write-Output "Updated master-data.js with RM procurement fields from daftar-barang (2).xlsx"
