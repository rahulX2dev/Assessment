@echo off
setlocal

set VSDEV="C:\Program Files\Microsoft Visual Studio\18\Community\Common7\Tools\VsDevCmd.bat"
if not exist %VSDEV% (
  echo Visual Studio developer command prompt not found.
  echo Edit VSDEV in this script or build with the Makefile instead.
  exit /b 1
)

call %VSDEV% -arch=x64 -host_arch=x64 >nul
if errorlevel 1 exit /b 1

if not exist bin mkdir bin
if not exist build mkdir build

cl /nologo /TC /std:c11 /O2 /W4 /D_CRT_SECURE_NO_WARNINGS /Iinclude ^
   src\*.c ^
   /Fobuild\ /Febin\hubflow_fileops.exe
if errorlevel 1 exit /b 1

echo.
echo Built bin\hubflow_fileops.exe
endlocal
