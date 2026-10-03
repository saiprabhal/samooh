@echo off
echo ========================================================
echo Starting Samooh AI Group Procurement Platform...
echo ========================================================

:: Detect Python binary (prefer D:\samooh_venv)
set "PY_BIN=python"
if exist "D:\samooh_venv\Scripts\python.exe" set "PY_BIN=D:\samooh_venv\Scripts\python.exe"

:: Start FastAPI Backend in new window
start "Samooh Backend API (Port 8000)" cmd /k "cd /d %~dp0 && %PY_BIN% -m uvicorn backend.main:app --reload"

:: Start React Frontend in new window
start "Samooh React Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers launching!
echo Backend: http://127.0.0.1:8000/docs
echo Frontend: http://localhost:3000
echo ========================================================
