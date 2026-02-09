@echo off
setlocal

echo ========================================
echo My Awesome Blog - 数据库初始化
echo ========================================
echo.

REM 检查是否在项目根目录
if not exist "app" (
    echo 错误: 未在项目根目录中找到'app'文件夹
    echo 请在backend目录中运行此脚本
    pause
    exit /b 1
)

echo 正在激活虚拟环境...
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    if errorlevel 1 (
        echo 警告: 无法激活虚拟环境，尝试直接运行Python
    )
) else (
    echo 警告: 未找到虚拟环境，请确保已创建并激活虚拟环境
)

echo.
echo 正在运行数据库初始化...
python scripts\init_db_simple.py

if %errorlevel% neq 0 (
    echo.
    echo 错误: 数据库初始化失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo 数据库初始化完成！
echo ========================================
echo.
echo 重要信息：
echo - 数据库表结构已创建
echo - 管理员用户已创建 (用户名: admin, 密码: admin123)
echo - 请在生产环境中修改默认密码
echo.
echo 下一步操作：
echo   1. 启动应用: uvicorn app.main:app --reload --port 8000
echo   2. 访问API文档: http://localhost:8000/docs
echo   3. 登录管理后台开始使用
echo.
pause