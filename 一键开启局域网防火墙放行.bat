@echo off
chcp 65001 >nul
title 🍅 番茄ToDo Pro - 允许同一WiFi下手机直接访问

echo ========================================================
echo   🍅 番茄ToDo Pro - 一键放行局域网 5173 端口
echo ========================================================
echo.
echo 正在检查管理员权限以向 Windows 防火墙添加放行规则...

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [提示] 正在弹出 Windows 管理员授权窗口，请点击【是】以允许放行...
    powershell -Command "Start-Process cmd -ArgumentList '/c netsh advfirewall firewall add rule name=\"Pomodoro-5173\" dir=in action=allow protocol=TCP localport=5173 profile=any && echo. && echo ======================================== && echo  [成功] 局域网防火墙已放行 5173 端口！ && echo  同一WiFi下的手机现在可以畅通访问了！ && echo ======================================== && timeout /t 5' -Verb RunAs"
    exit /b
)

netsh advfirewall firewall add rule name="Pomodoro-5173" dir=in action=allow protocol=TCP localport=5173 profile=any
echo.
echo [成功] 局域网防火墙已放行 5173 端口！同一WiFi下的手机可直接访问！
echo.
pause
