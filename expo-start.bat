@echo off
echo Starting Expo in current directory...

REM Wejdź do folderu, gdzie leży plik .bat
cd /d "%~dp0"

echo Starting JSON Server...
start cmd /k "npm run api"

REM Uruchom Expo
npx expo start --tunnel

pause
