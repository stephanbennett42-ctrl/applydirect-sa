@echo off
title UniApply - Stop Login Module
color 0C
CLS

echo ============================================================
echo   UniApply - Stop login servers
echo ============================================================
echo.

echo Stopping the login servers...
taskkill /F /FI "WINDOWTITLE eq UniApply Login API (3006)*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq UniApply Login Site (3007)*" >nul 2>&1

echo Stopping any node processes for this project...
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -and ($_.CommandLine -match 'sections\\login') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

echo.
echo Login servers stopped.
echo (MySQL on port 3307 is left running - close it from XAMPP if needed.)
echo.
pause