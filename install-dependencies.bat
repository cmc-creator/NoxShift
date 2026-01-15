@echo off
echo Mapping network drive...
net use Z: "\\192.168.168.182\Folder Redirection\Ccooper\Desktop" /persistent:no >nul 2>&1

echo Changing to project directory...
cd /d Z:\NoxShift

echo Installing dependencies (this may take several minutes)...
Z:\..\PortableNode\node-v24.12.0-win-x64\npm.cmd install

echo.
echo Installation complete!
echo Press any key to close...
pause >nul
