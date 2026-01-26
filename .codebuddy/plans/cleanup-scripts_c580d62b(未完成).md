---
name: cleanup-scripts
overview: 删除 scripts 目录中不必要的临时和重复脚本，保留核心工具。
todos:
  - id: identify-unnecessary-scripts
    content: 识别并列出需要删除的临时和重复脚本文件
    status: pending
  - id: delete-temp-scripts
    content: 删除临时和重复的数据库初始化脚本文件
    status: pending
    dependencies:
      - identify-unnecessary-scripts
  - id: verify-cleanup
    content: 验证清理后 scripts 目录仅包含核心工具脚本
    status: pending
    dependencies:
      - delete-temp-scripts
---

## 产品概述

清理 backend/scripts 目录，删除不必要的临时和重复脚本文件，保留核心工具脚本以保持代码库整洁。

## 核心功能

- 识别并删除临时和重复的数据库初始化脚本
- 保留核心的诊断、修复、配置更新和主初始化工具脚本
- 确保 scripts 目录只包含必要且功能明确的核心工具