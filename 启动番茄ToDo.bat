@echo off
chcp 65001 >nul
title 🍅 番茄ToDo PRO - 启动器
echo ==================================================
echo         🍅 番茄ToDo PRO 正在启动中...
echo ==================================================
echo.
echo 正在打开本地开发服务，请稍候...
echo 服务就绪后，将在浏览器中自动为您开启！
echo.

start "" "http://localhost:5173"
npm run dev
pause
