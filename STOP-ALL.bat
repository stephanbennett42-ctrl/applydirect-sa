@echo off
title ApplyDirect SA - Stop Everything
color 0C
CLS

echo ============================================================
echo   ApplyDirect SA - Stop all servers
echo ============================================================
echo.

cd /d "%~dp0"

node stop.js

echo.
echo MySQL on port 3307 is left running - close it from XAMPP if needed.
echo.
pause