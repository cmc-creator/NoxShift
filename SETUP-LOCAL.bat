@echo off
echo ========================================
echo NoxShift - Local Setup Script
echo ========================================
echo.
echo This will:
echo 1. Copy project to C:\Temp\NoxShift
echo 2. Delete broken node_modules
echo 3. Install dependencies properly
echo 4. Start the dev server
echo.
echo This may take 5-10 minutes...
echo.
pause

REM Set paths
set SOURCE=Z:\NoxShift
set DEST=C:\Temp\NoxShift
set NODE_PATH=Z:\PortableNode\node-v20.11.0-win-x64

echo Step 1: Creating local directory...
if not exist "C:\Temp" mkdir "C:\Temp"
if exist "%DEST%" (
    echo Removing old installation...
    rmdir /s /q "%DEST%" 2>nul
)

echo.
echo Step 2: Copying project files (this may take a few minutes)...
echo Source: %SOURCE%
echo Destination: %DEST%
echo.

REM Use robocopy to copy files, excluding node_modules
robocopy "%SOURCE%" "%DEST%" /E /XD node_modules .git /NFL /NDL /NJH /NJS /nc /ns /np
if errorlevel 8 (
    echo ERROR: Copy failed
    pause
    exit /b 1
)

echo.
echo Step 3: Files copied successfully!
echo.

REM Change to local directory
cd /d "%DEST%"
if errorlevel 1 (
    echo ERROR: Cannot access %DEST%
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

REM Set up Node.js in PATH
set PATH=%NODE_PATH%;%PATH%

echo Step 4: Installing dependencies...
echo This will take 3-5 minutes on a local drive...
echo.

"%NODE_PATH%\npm.cmd" install
if errorlevel 1 (
    echo.
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Dependencies installed!
echo ========================================
echo.
echo Step 5: Starting development server...
echo.
echo The app will open at: http://localhost:5173
echo Press Ctrl+C to stop the server
echo ========================================
echo.

"%NODE_PATH%\npm.cmd" run dev

echo.
echo ========================================
echo Server stopped
echo ========================================
pause
