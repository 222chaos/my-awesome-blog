修改 `frontend/src/components/home/HeroSection.tsx` 文件中的 section 元素的 className：

**当前：**
```
className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
```

**修改为：**
```
className="relative h-screen flex flex-col items-center justify-start overflow-hidden"
```

**修改说明：**
- 将 `justify-center` 改为 `justify-start`，使内容从顶部开始排列而不是垂直居中
- 保持 `h-screen` 确保组件占满整个视口高度
- 保持其他样式不变以确保视觉效果一致