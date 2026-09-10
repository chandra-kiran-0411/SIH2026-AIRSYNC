@echo off
title AirSync Launcher

echo ========================================
echo          STARTING AIRSYNC
echo ========================================

cd /d "C:\Users\GUNAVARDHAN\.gemini\antigravity\scratch\airsync"

echo.
echo Starting development server...

start "" cmd /k "npm.cmd run dev"

echo Waiting for AirSync to start...
timeout /t 5 /nobreak >nul

echo Opening AirSync...
start "" "http://localhost:3000/"

exit