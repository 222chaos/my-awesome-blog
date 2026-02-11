将 ProfileCard 组件的颜色替换为网站主题色：

**颜色映射方案**:
- 底部面板背景: `#fbb9b6` → `bg-tech-cyan` (或 `bg-tech-deepblue`)
- 悬停强调色: `#f55d56` → `hover:bg-tech-lightcyan`
- 邮件图标描边: `stroke-[#fbb9b6]` → `stroke-tech-cyan`
- 邮件图标悬停: `hover:stroke-[#f55d56]` → `hover:stroke-tech-lightcyan`
- 社交图标填充: `fill-white` → `fill-white` (保持)
- 社交图标悬停: `hover:fill-[#f55d56]` → `hover:fill-tech-lightcyan`
- Contact Me 按钮: 保持白色背景，文字使用 `text-tech-cyan`
- 卡片背景: `bg-white` → 支持深浅主题

**调整内容**:
- 卡片使用 `bg-background` 代替白色，适配深浅模式
- 添加主题上下文支持
- 调整阴影颜色以匹配主题