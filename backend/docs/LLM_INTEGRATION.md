# LLM 集成文档

## 概述

本项目集成了多个 LLM 提供商，支持 DeepSeek、GLM-4.7 (智谱AI) 和 Qwen (通义千问) 等模型。

## 架构设计

```
backend/app/
├── llm/                          # LLM 模块
│   ├── __init__.py               # 模块初始化，自动注册 Providers
│   ├── base.py                   # 抽象基类定义
│   ├── provider_factory.py        # 工厂类，负责创建 Provider 实例
│   ├── deepseek_provider.py      # DeepSeek 实现
│   ├── glm_provider.py           # GLM 实现
│   └── qwen_provider.py         # Qwen 实现
├── services/
│   └── llm_service.py           # LLM 服务层
├── schemas/
│   └── llm.py                  # LLM API 数据模型
└── api/v1/endpoints/
    └── llm.py                  # LLM API 端点
```

## 配置

在 `.env` 文件中配置 LLM 相关环境变量：

```bash
# LLM 通用配置
LLM_DEFAULT_MODEL=deepseek-chat    # 默认模型
LLM_TIMEOUT=120                    # API 请求超时时间（秒）
LLM_MAX_RETRIES=3                  # 最大重试次数
LLM_STREAM_ENABLED=true            # 是否启用流式响应

# DeepSeek 配置
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat

# GLM (智谱AI) 配置
GLM_API_KEY=your_api_key_here
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
GLM_MODEL=glm-4-plus

# Qwen (通义千问) 配置
QWEN_API_KEY=your_api_key_here
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
```

## API 接口

### 1. 获取可用模型列表

```http
GET /api/v1/llm/models
Authorization: Bearer {access_token}
```

**响应示例：**

```json
{
  "models": [
    {
      "provider": "deepseek",
      "name": "deepseek-chat",
      "display_name": "DeepSeek",
      "is_available": true
    },
    {
      "provider": "glm",
      "name": "glm-4-plus",
      "display_name": "智谱 GLM",
      "is_available": true
    },
    {
      "provider": "qwen",
      "name": "qwen-plus",
      "display_name": "通义千问",
      "is_available": true
    }
  ],
  "default_provider": "deepseek-chat"
}
```

### 2. 普通聊天

```http
POST /api/v1/llm/chat
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "messages": [
    {
      "role": "system",
      "content": "你是一个有用的助手"
    },
    {
      "role": "user",
      "content": "你好，请介绍一下你自己"
    }
  ],
  "provider": "deepseek",
  "model": "deepseek-chat",
  "temperature": 0.7,
  "max_tokens": 2000,
  "top_p": 1.0
}
```

**响应示例：**

```json
{
  "message": {
    "role": "assistant",
    "content": "你好！我是一个AI助手，可以帮助你回答问题..."
  },
  "model": "deepseek-chat",
  "provider": "deepseek",
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 50,
    "total_tokens": 70
  }
}
```

### 3. 流式聊天

```http
POST /api/v1/llm/chat/stream
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "请写一首关于春天的诗"
    }
  ],
  "provider": "glm"
}
```

**响应格式 (SSE):**

```
data: {"content": "春", "finish_reason": null}

data: {"content": "风", "finish_reason": null}

data: {"content": "拂", "finish_reason": null}

data: {"content": "面", "finish_reason": null}

data: [DONE]
```

## 参数说明

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| messages | array | 是 | 消息列表 |
| provider | string | 否 | 提供商，不指定则使用默认 |
| model | string | 否 | 模型名称 |
| temperature | float | 否 | 温度参数 (0.0-2.0)，默认 0.7 |
| max_tokens | int | 否 | 最大生成 token 数 |
| top_p | float | 否 | 核采样参数 (0.0-1.0)，默认 1.0 |

### 消息对象

| 字段 | 类型 | 说明 |
|------|------|------|
| role | string | 角色: system, user, assistant |
| content | string | 消息内容 |

## 扩展新的 Provider

1. 在 `app/llm/` 目录下创建新的 provider 文件，如 `new_provider.py`
2. 继承 `LLMProvider` 抽象基类
3. 实现 `chat()` 和 `stream_chat()` 方法
4. 在 `app/llm/__init__.py` 中注册新的 provider

**示例：**

```python
from .base import LLMProvider
from .provider_factory import LLMProviderFactory

class NewProvider(LLMProvider):
    def __init__(self, api_key: str, base_url: str, model: str):
        super().__init__(api_key, base_url, model)

    async def chat(self, request: ChatCompletionRequest) -> ChatCompletionResponse:
        # 实现聊天逻辑
        pass

    async def stream_chat(self, request: ChatCompletionRequest) -> AsyncIterator[ChatStreamChunk]:
        # 实现流式聊天逻辑
        pass

    def get_model_name(self) -> str:
        return self.model

    def get_provider_name(self) -> str:
        return 'new_provider'

LLMProviderFactory.register('new_provider', NewProvider)
```

## 注意事项

1. 所有 API 接口都需要用户认证
2. API Key 存储在环境变量中，不要提交到代码仓库
3. 流式响应使用 SSE (Server-Sent Events) 格式
4. 请求失败会自动重试（默认 3 次）
5. 建议在生产环境配置合理的超时时间和重试策略
