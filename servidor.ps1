# Servidor local do Portal Duo.
# Serve os arquivos desta pasta em http://localhost:5173 usando so o que o
# Windows ja tem. Nao instala nada. Para parar, feche a janela ou aperte Ctrl+C.

param([switch]$NaoAbrirNavegador)

$ErrorActionPreference = "Stop"
$raiz = $PSScriptRoot
$porta = 5173

$tipos = @{
  ".html" = "text/html; charset=utf-8"
  ".jsx"  = "text/plain; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".ico"  = "image/x-icon"
  ".md"   = "text/plain; charset=utf-8"
}

$ouvinte = New-Object System.Net.HttpListener
$ouvinte.Prefixes.Add("http://localhost:$porta/")

try {
  $ouvinte.Start()
} catch {
  Write-Host ""
  Write-Host "Nao consegui abrir a porta $porta." -ForegroundColor Red
  Write-Host "Quase sempre e uma destas duas coisas:" -ForegroundColor Yellow
  Write-Host "  1. Ja existe outra janela do servidor aberta. Feche a outra."
  Write-Host "  2. Algum outro programa esta usando a porta 5173."
  Write-Host ""
  Read-Host "Aperte Enter para fechar"
  exit 1
}

Write-Host ""
Write-Host "  Portal Duo no ar em  http://localhost:$porta" -ForegroundColor Green
Write-Host "  Pasta servida: $raiz" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Deixe esta janela aberta enquanto usa o portal." -ForegroundColor Yellow
Write-Host "  Para desligar, feche a janela." -ForegroundColor Yellow
Write-Host ""

if (-not $NaoAbrirNavegador) { Start-Process "http://localhost:$porta/" }

while ($ouvinte.IsListening) {
  try {
    $ctx = $ouvinte.GetContext()
  } catch {
    break
  }

  $req = $ctx.Request
  $res = $ctx.Response

  try {
    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart("/")
    # A raiz abre a versao que roda sem instalar nada. O index.html da pasta
    # pertence ao projeto Vite e so funciona depois que o Node estiver instalado.
    if ([string]::IsNullOrWhiteSpace($rel) -or $rel -eq "index.html") { $rel = "sem-instalar.html" }

    $alvo = Join-Path $raiz $rel
    $completo = [System.IO.Path]::GetFullPath($alvo)

    # Impede que um pedido tipo ../../ leia arquivos fora da pasta do projeto.
    if (-not $completo.StartsWith([System.IO.Path]::GetFullPath($raiz), [StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
      $res.Close()
      continue
    }

    if (-not (Test-Path -LiteralPath $completo -PathType Leaf)) {
      $res.StatusCode = 404
      $corpo = [System.Text.Encoding]::UTF8.GetBytes("404 - nao encontrei: $rel")
      $res.ContentType = "text/plain; charset=utf-8"
      $res.ContentLength64 = $corpo.Length
      $res.OutputStream.Write($corpo, 0, $corpo.Length)
      $res.Close()
      Write-Host "  404  $rel" -ForegroundColor DarkYellow
      continue
    }

    $ext = [System.IO.Path]::GetExtension($completo).ToLowerInvariant()
    $ct = $tipos[$ext]
    if (-not $ct) { $ct = "application/octet-stream" }

    $bytes = [System.IO.File]::ReadAllBytes($completo)
    $res.ContentType = $ct
    $res.Headers.Add("Cache-Control", "no-store")
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    Write-Host "  200  $rel" -ForegroundColor DarkGray
  } catch {
    Write-Host "  erro: $_" -ForegroundColor Red
    try { $res.StatusCode = 500 } catch {}
  } finally {
    try { $res.Close() } catch {}
  }
}

$ouvinte.Stop()
