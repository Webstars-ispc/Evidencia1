@echo off
cd /d "%~dp0"
echo ====================================
echo  Libreria Nazareth - Inicio Rapido
echo ====================================
echo.
echo Iniciando servidores...
echo.
start "Django Backend" cmd /k "cd /d %~dp0Backend && python manage.py runserver"
timeout /t 4 /nobreak >nul
start "Angular Frontend" cmd /k "cd /d %~dp0Frontend && npx ng serve --open"
echo.
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:4200
echo.
echo  Para detener: cerrar las ventanos de cada servidor.
echo.
pause
