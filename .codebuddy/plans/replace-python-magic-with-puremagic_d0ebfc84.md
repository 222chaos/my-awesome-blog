---
name: replace-python-magic-with-puremagic
overview: 将 python-magic 替换为 puremagic，解决 Windows 开发环境和 Linux 生产环境的跨平台兼容性问题
todos:
  - id: update-requirements
    content: 修改 requirements.txt，将 python-magic-bin 替换为 puremagic
    status: completed
  - id: update-file-validation
    content: 修改 file_validation.py，替换 magic 导入和 MIME 检测逻辑
    status: completed
    dependencies:
      - update-requirements
  - id: verify-startup
    content: 验证后端服务能正常启动无 ImportError
    status: completed
    dependencies:
      - update-file-validation
---

## 问题背景

后端启动时因 `python-magic` 在 Windows 上缺少 `libmagic` 库而失败。用户选择使用纯 Python 方案 `puremagic` 替代，确保在 Windows 开发和 Linux 生产环境都能正常运行。

## 核心需求

- 替换 `python-magic-bin` 为 `puremagic`，消除系统级依赖
- 修改文件验证逻辑，使用 `puremagic` API 检测文件 MIME 类型
- 保持原有文件验证功能不变（扩展名验证、MIME 验证、大小限制等）

## 影响范围

- `backend/requirements.txt`：依赖包替换
- `backend/app/utils/file_validation.py`：导入语句和 MIME 检测逻辑修改

## 技术方案

### 依赖替换

- 移除：`python-magic-bin==0.4.14`
- 添加：`puremagic==1.28`

### API 差异处理

`puremagic` 与 `python-magic` 的 API 不同，需要适配：

| python-magic | puremagic 等效方案 |
| --- | --- |
| `magic.from_file(path, mime=True)` | `puremagic.from_file(path, mime=True)` |


注意：`puremagic.from_file()` 返回 MIME 类型字符串，与原有 `magic.from_file()` 行为一致。

### 跨平台优势

- `puremagic` 完全基于 Python 实现，无需编译依赖
- Windows 和 Linux 均可直接安装使用
- 部署到 Linux 服务器时无需安装 `libmagic1` 系统包