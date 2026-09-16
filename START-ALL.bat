@echo off
title UniApply - Start Login Module
color 0A
CLS

echo ============================================================
echo   UniApply - Login Module
echo   Starting login backend and frontend... please wait
echo ============================================================
echo.

SET BASE=%~dp0

REM ============================================================
REM  1.  START MYSQL ON PORT 3307 (if not already running)
REM ============================================================
echo [1/6] Checking MySQL on port 3307...
netstat -an | find ":3307" >nul 2>&1
if %errorlevel%==0 goto mysqldone

echo        MySQL not found. Starting XAMPP MariaDB on 3307...
if not exist "C:\xampp\mysql\bin\mysqld.exe" goto noxampp
start "UniApply-MySQL" /min "C:\xampp\mysql\bin\mysqld.exe" --port=3307 --basedir=C:\xampp\mysql --datadir=C:\xampp\mysql\data
echo        Waiting for MySQL to start...
set /a tries=0

:waitdb
set /a tries+=1
if %tries% GTR 30 goto nodb
netstat -an | find ":3307" >nul 2>&1
if %errorlevel%==0 goto mysqldone
timeout /t 1 /nobreak >nul
goto waitdb

:nodb
echo        *** ERROR: MySQL did not start on port 3307 in time.
pause
exit /b 1

:noxampp
echo        *** ERROR: XAMPP not found at C:\xampp.
echo        *** Install XAMPP or start your MySQL on port 3307, then run this again.
pause
exit /b 1

:mysqldone
echo        MySQL is ready.

REM ============================================================
REM  2.  INSTALL DEPENDENCIES IF MISSING (first run only)
REM ============================================================
echo.
echo [2/4] Checking dependencies...

if not exist "%BASE%sections\login\backend\node_modules" (
  echo        Installing login backend dependencies...
  pushd "%BASE%sections\login\backend"
  call npm install
  popd
)
if not exist "%BASE%sections\login\frontend\node_modules" (
  echo        Installing login frontend dependencies...
  pushd "%BASE%sections\login\frontend"
  call npm install
  popd
)
echo        Login dependencies up to date.

REM ============================================================
REM  3.  SET UP THE DATABASE (safe - never deletes data)
REM ============================================================
echo.
echo [3/4] Setting up the login database...
pushd "%BASE%sections\login\backend"
call npm run db:setup >nul 2>&1
popd
echo        Database ready.

REM ============================================================
REM  4.  START BACKENDS
REM ============================================================
echo.
echo [4/4] Starting login servers...
start "UniApply Login API (3006)" /min cmd /k "cd /d ""%BASE%sections\login\backend"" && node server.js"
echo        Backends starting on ports 3002, 3003 and 3006.

REM ============================================================
REM  5.  START FRONTENDS (Vite)
REM ============================================================
echo.
echo        Starting login website...
start "UniApply Login Site (3007)" /min cmd /k "cd /d ""%BASE%sections\login\frontend"" && npm run dev"

REM ============================================================
REM  6.  OPEN BROWSER
REM ============================================================
echo.
echo Opening your browser...
set /a tries=0

:waitsite
set /a tries+=1
if %tries% GTR 60 goto siteup
netstat -an | find ":3007" >nul 2>&1
if %errorlevel%==0 goto siteup
timeout /t 1 /nobreak >nul
goto waitsite

:siteup
start http://localhost:3007

echo.
echo ============================================================
echo   Login module ready! Just use the browser window that opened.
echo.
echo   Login site        : http://localhost:3007
echo.
echo   Demo student      : thabo@email.com / password123
echo   Admin account     : admin@uniapply.co.za / admin123
echo.
echo   Need to stop? Run STOP-ALL.bat from this folder.
echo ============================================================
echo.
pause