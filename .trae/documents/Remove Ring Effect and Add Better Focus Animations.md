## 移除外边框效果并更换为优美动画

### 修改内容
移除聚焦时的 `ring` 外边框效果，改为：
1. 柔和的发光效果
2. 轻微的缩放动画
3. 背景渐变

### 修改文件
`frontend/src/components/chat/ChatInput.tsx`

### 主要改动
- 移除 `ring-cyan-500/30 ring-offset-0 ring-2` 类
- 添加聚焦时的缩放和发光效果
- 改进背景动画