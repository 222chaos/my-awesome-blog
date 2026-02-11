## 修复LLM API 401认证错误

### 问题分析
- 后端`/api/v1/llm/models`端点需要用户登录认证
- 前端调用时可能没有有效的`auth_token`或用户未登录
- 获取模型列表只是查询配置信息，不涉及实际LLM调用消耗

### 解决方案：修改后端API，让获取模型列表变为公开端点

修改文件：`backend/app/api/v1/endpoints/llm.py`

**修改第82-93行**，移除`current_user`依赖，改为公开端点：

```python
# 修改前
@router.get("/models", response_model=LLMModelsResponse, status_code=status.HTTP_200_OK)
async def get_models(
    current_user: User = Depends(get_current_active_user),
) -> LLMModelsResponse:
    """
    获取可用的 LLM 模型列表

    返回所有已配置且可用的 LLM 提供商和模型信息
    """
    app_logger.info(f"User {current_user.username} requested available LLM models")
    response = await llm_service.get_available_models()
    return response

# 修改后
@router.get("/models", response_model=LLMModelsResponse, status_code=status.HTTP_200_OK)
async def get_models() -> LLMModelsResponse:
    """
    获取可用的 LLM 模型列表

    返回所有已配置且可用的 LLM 提供商和模型信息
    """
    response = await llm_service.get_available_models()
    return response
```

### 预期效果
- 任何用户（包括未登录用户）都可以获取可用的LLM模型列表
- 聊天和流式聊天接口仍然需要登录认证，确保资源使用可追踪