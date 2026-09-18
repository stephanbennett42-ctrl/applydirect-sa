@echo off
title ApplyDirect SA - Start Everything
color 0A
CLS

echo ============================================================
echo   ApplyDirect SA - Subscription + Admin Modules
echo   Starting everything for you... please wait
echo ============================================================
echo.

cd /d "%~dp0"

node start.js %*

if errorlevel 1 (
  echo.
  echo *** Something went wrong - see the messages above.
  pause
  exit /b 1
)

echo.
pause