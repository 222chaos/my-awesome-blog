## 移除放大效果和聚焦边框动画

### 修改内容
1. 移除 `scale-[1.02]` 放大效果
2. 移除 `border-cyan-500/30` 青色边框

### 修改文件
`frontend/src/components/chat/ChatInput.tsx`

### 主要改动
- 移除聚焦时的缩放
- 移除聚焦时的边框颜色变化
- 保留其他动画效果