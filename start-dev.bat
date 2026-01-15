@echo off
REM Map network drive if not already mapped
net use Z: "\\192.168.168.182\Folder Redirection\Ccooper\Desktop" /persistent:no >nul 2>&1

REM Change to project directory on mapped drive
cd /d Z:\NoxShift

REM Set PATH to include portable node
set PATH=Z:\PortableNode\node-v20.11.0-win-x64;%PATH%

REM Check if vite is installed, if not install it
if not exist "node_modules\vite\bin\vite.js" (
    echo Installing Vite...
    call Z:\PortableNode\node-v20.11.0-win-x64\npm.cmd install vite @vitejs/plugin-react --save-dev
)

REM Run dev server
echo Starting NoxShift Development Server...
call Z:\PortableNode\node-v20.11.0-win-x64\npm.cmd run dev

pause
