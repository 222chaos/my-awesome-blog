## 临时绕过Pillow依赖问题以启动服务器

**问题**:
- `Pillow` 包由于权限问题无法安装到 `D:\python\python312\Lib\site-packages`
- `image_service.py` 被多个模块导入，导致服务器无法启动

**临时解决方案**:
将 ImageService 导入改为可选导入，在不使用图片处理功能的端点中忽略错误，让服务器能够启动。

**修改文件**:
1. [backend/app/api/v1/endpoints/users.py](e:\project\my-awesome-blog\backend\app\api\v1\endpoints\users.py)
   - 将 ImageService 导入改为可选导入
   - 在使用 ImageService 的地方添加 try-except，返回友好的错误消息

**这样做的效果**:
- 服务器可以正常启动
- albums API 可以正常访问
- 头像上传功能会暂时禁用（返回友好错误）
- 其他API不受影响

**长期解决方案**:
用户需要以管理员权限重新安装 Pillow 或修复 Python 环境权限问题。