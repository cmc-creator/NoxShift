@echo off
echo ========================================
echo Starting NoxShift from C:\Temp
echo ========================================
echo.

cd /d C:\Temp\NoxShift
if errorlevel 1 (
    echo ERROR: C:\Temp\NoxShift folder not found!
    echo Please run SETUP-LOCAL.bat first!
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

set NODE_PATH=Z:\PortableNode\node-v20.11.0-win-x64
set PATH=%NODE_PATH%;%PATH%

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    "%NODE_PATH%\npm.cmd" install
    if errorlevel 1 (
        echo.
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
)

echo.
echo Starting development server...
echo Open browser to: http://localhost:5173
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

"%NODE_PATH%\npm.cmd" run dev

if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start!
    echo.
)

pause
