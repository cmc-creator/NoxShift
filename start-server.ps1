# NoxShift Development Server Starter
Set-Location Z:\NoxShift
$env:PATH = "Z:\PortableNode\node-v24.12.0-win-x64;$env:PATH"

Write-Host "Starting NoxShift Development Server..." -ForegroundColor Cyan
Write-Host "Please wait while Vite starts up..." -ForegroundColor Yellow

& Z:\PortableNode\node-v24.12.0-win-x64\node.exe Z:\NoxShift\node_modules\vite\bin\vite.js

Write-Host "`nServer stopped. Press any key to exit..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
