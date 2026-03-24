param(
  [int]$Port = 8123,
  [string]$Root = (Split-Path -Parent $MyInvocation.MyCommand.Path)
)

$ErrorActionPreference = 'Stop'

function Get-ContentType([string]$Path) {
  switch ([IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    '.html' { 'text/html; charset=utf-8' }
    '.js'   { 'application/javascript; charset=utf-8' }
    '.css'  { 'text/css; charset=utf-8' }
    '.json' { 'application/json; charset=utf-8' }
    '.md'   { 'text/plain; charset=utf-8' }
    '.svg'  { 'image/svg+xml' }
    '.png'  { 'image/png' }
    '.jpg'  { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.gif'  { 'image/gif' }
    default { 'application/octet-stream' }
  }
}

function Get-LiveStamp([string]$BasePath) {
  $files = Get-ChildItem -Path $BasePath -File -Include *.html,*.js,*.css
  if (-not $files) { return [DateTime]::UtcNow.Ticks }
  return ($files | Measure-Object -Property LastWriteTimeUtc -Maximum).Maximum.Ticks
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host "Live preview aktif di http://localhost:$Port/erp-master.html"

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    try {
      $path = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart('/'))
      if ([string]::IsNullOrWhiteSpace($path)) {
        $path = 'erp-master.html'
      }

      if ($path -eq '__live') {
        $bytes = [Text.Encoding]::UTF8.GetBytes((Get-LiveStamp $Root).ToString())
        $response.ContentType = 'text/plain; charset=utf-8'
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.Close()
        continue
      }

      $fullPath = Join-Path $Root $path
      if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $response.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes("Not found: $path")
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.Close()
        continue
      }

      $response.ContentType = Get-ContentType $fullPath
      $bytes = [IO.File]::ReadAllBytes($fullPath)
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
    } catch {
      $response.StatusCode = 500
      $bytes = [Text.Encoding]::UTF8.GetBytes($_.Exception.Message)
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
      $response.Close()
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
