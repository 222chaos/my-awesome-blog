## 多 LLM 接入架构实现计划

### 架构设计概述
采用 **策略模式 + 工厂模式** 实现多 LLM 接入，支持 DeepSeek、GLM-4.7、Qwen 等模型，并预留扩展接口。

### 实施步骤

#### 1. 配置管理
- 在 `config.py` 中添加 LLM 相关配置：
  - DeepSeek API Key、Base URL、模型名称
  - GLM-4.7 API Key、Base URL、模型名称
  - Qwen API Key、Base URL、模型名称
  - 默认模型选择、超时时间、重试次数

#### 2. 依赖安装
- 在 `requirements.txt` 中添加：
  - `httpx`（异步 HTTP 客户端，用于调用各 LLM API）
  - `tenacity`（重试机制）

#### 3. 核心抽象层设计
- 创建 `app/llm/` 目录
- 实现 `base.py`：定义 `LLMProvider` 抽象基类
  - `chat()` 方法：通用聊天接口
  - `stream_chat()` 方法：流式聊天接口
- 创建 `provider_factory.py`：工厂类，根据配置创建对应 provider

#### 4. 具体实现
- 实现 `deepseek_provider.py`：DeepSeek API 调用逻辑
- 实现 `glm_provider.py`：智谱 GLM-4.7 API 调用逻辑
- 实现 `qwen_provider.py`：阿里通义 Qwen API 调用逻辑

#### 5. 数据模型设计
- Schema 层：
  - `ChatMessage`：消息结构（role, content）
  - `ChatRequest`：请求模型（messages, model, temperature, max_tokens）
  - `ChatResponse`：响应模型（message, usage, model）
  - `ChatStreamChunk`：流式响应模型

#### 6. Service 层
- 创建 `app/services/llm_service.py`：
  - 统一的聊天服务入口
  - 支持同步和流式调用
  - 对话历史管理（可选）
  - 错误处理和日志记录

#### 7. API 端点
- 创建 `app/api/v1/endpoints/llm.py`：
  - `POST /api/v1/llm/chat`：普通对话接口
  - `POST /api/v1/llm/chat/stream`：流式对话接口（SSE）
  - `GET /api/v1/llm/models`：获取可用模型列表

#### 8. 路由注册
- 在 `app/api/v1/router.py` 中注册 LLM 路由

#### 9. 可选：对话历史存储
- 创建数据库模型 `Conversation` 和 `Message`
- 实现对话历史的 CRUD 操作

### 技术要点
- 使用 `httpx.AsyncClient` 进行异步 HTTP 请求
- 统一的错误处理和日志记录
- 支持流式响应（SSE）
- 配置化模型参数（temperature, max_tokens 等）
- 便于扩展新的 LLM Provider