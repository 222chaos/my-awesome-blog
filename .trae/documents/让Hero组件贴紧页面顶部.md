修改 HeroSection 组件，添加负上边距 `-mt-16` 来抵消 layout.tsx 中的 `pt-16`，使 Hero 组件的视觉内容延伸到页面顶部，同时保持导航栏的功能正常。

**具体修改**:
- 在 HeroSection.tsx 的 section 元素上添加 `-mt-16` 类
- 保持现有的 glassmorphism 设计和响应式布局不变