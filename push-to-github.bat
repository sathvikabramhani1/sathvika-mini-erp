@echo off
echo ======================================================================
echo  SathvikaOps Mini ERP + CRM - GitHub Sync Utility
echo  Target Account: sathvikabramhani1 (Swayampakam Sathvika Bramhani)
echo ======================================================================

git remote remove origin 2>nul
git remote add origin https://github.com/sathvikabramhani1/mini-erp-crm.git
git branch -M main
git add .
git commit -m "feat: SathvikaOps Mini ERP + CRM full stack release" 2>nul

echo.
echo Pushing code to https://github.com/sathvikabramhani1/mini-erp-crm.git...
git push -u origin main

echo.
echo ======================================================================
echo  Sync process completed!
echo ======================================================================
pause
