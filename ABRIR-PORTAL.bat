@echo off
title Portal Duo Marketing
cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo.
  echo   Nao encontrei o Node.js neste computador.
  echo.
  echo   Use o atalho ABRIR-SEM-NODE.bat, que funciona sem instalar nada,
  echo   ou peca para o Claude instalar o Node de novo.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo.
  echo   Primeira vez nesta pasta: baixando as pecas do projeto.
  echo   Isso leva uns 40 segundos e so acontece uma vez.
  echo.
  call npm install --no-fund --no-audit
)

echo.
echo   Abrindo o portal. O navegador abre sozinho em alguns segundos.
echo   Deixe esta janela aberta enquanto usa. Para desligar, feche-a.
echo.
call npm run dev
