@echo off
REM Plano B: abre o portal em um computador que nao tem Node instalado.
REM Mais lento e precisa de internet, mas nao instala nada.
title Portal Duo Marketing (sem Node)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"
