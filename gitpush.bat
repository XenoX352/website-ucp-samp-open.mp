@echo off
cd /d "C:\Users\Administrator\Downloads\Morch-Community\ucp-morch"
git add .
git commit -m "auto commit %date% %time%"
git push
echo.
echo Push selesai.
pause