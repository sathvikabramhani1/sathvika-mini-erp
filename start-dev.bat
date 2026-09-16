@echo off
echo ======================================================================
echo   Sathvika Mini ERP + CRM - Development Launcher
echo ======================================================================
echo.
echo Starting Backend API on http://localhost:5000...
start "Sathvika ERP Backend (Port 5000)" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend Web App on http://localhost:5173...
start "Sathvika ERP Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================================
echo  Both services launched in separate terminal windows:
echo    - Frontend: http://localhost:5173
echo    - Backend:  http://localhost:5000
echo    - Health:   http://localhost:5000/health
echo ======================================================================
pause
