## 修复相册API错误的根本原因

**问题诊断**:
后端服务器无法启动，因为缺少 `PIL` (Pillow) 模块。这导致前端请求 `/api/albums` 时返回错误。

**错误信息**:
```
ModuleNotFoundError: No module named 'PIL'
File: app/services/image_service.py, line 5
```

**修复步骤**:

1. **停止当前失败的服务器进程**
   - 终止正在运行的 uvicorn 命令

2. **安装缺失的依赖包**
   - 在 backend 目录运行: `pip install Pillow`
   - 或者重新安装所有依赖: `pip install -r requirements.txt`

3. **重新启动后端服务器**
   - 运行: `python -m uvicorn app.main:app --reload --port 8989`

4. **验证服务器正常运行**
   - 确认服务器启动成功
   - 测试 `/api/v1/albums` 端点是否可访问

**注意**: requirements.txt 中已包含 `Pillow==10.0.1`，可能之前安装不完整或环境不一致。