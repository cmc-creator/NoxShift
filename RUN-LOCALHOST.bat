@echo off
echo ========================================
echo Starting NoxShift Development Server
echo ========================================
echo.

REM Change to Z: drive (mapped network drive)
Z:
if errorlevel 1 (
    echo ERROR: Cannot access Z: drive
    pause
    exit /b 1
)

cd Z:\NoxShift
if errorlevel 1 (
    echo ERROR: Cannot find Z:\NoxShift folder
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

set PATH=Z:\PortableNode\node-v20.11.0-win-x64;%PATH%

echo Checking Node.js...
Z:\PortableNode\node-v20.11.0-win-x64\node.exe --version
if errorlevel 1 (
    echo ERROR: Node.js not found
    pause
    exit /b 1
)
echo.

echo Checking if vite is installed...
if not exist "node_modules\vite" (
    echo ERROR: vite is not installed in node_modules
    echo You need to run npm install first
    pause
    exit /b 1
)
echo vite found in node_modules
echo.

echo Starting Vite dev server...
echo The app will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

Z:\PortableNode\node-v20.11.0-win-x64\npm.cmd run dev

echo.
echo ========================================
echo Server stopped
echo ========================================
pause
