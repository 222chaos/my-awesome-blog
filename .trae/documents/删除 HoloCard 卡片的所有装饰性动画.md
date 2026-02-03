## 删除 HoloCard 卡片动画效果

**目标**：移除所有装饰性动画效果，保留基本交互功能

**具体修改**：`frontend/src/components/articles/HoloCard.tsx`

### 删除的动画：
1. **背景旋转动画**（第151-170行）
   - 删除整个双层旋转渐变的 div

2. **3D 倾斜效果**（第40-44行）
   - 删除 `useMotionValue` 和 `useTransform` 相关代码
   - 移除 `style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}`

3. **hover 缩放效果**（第52行）
   - 移除 `whileHover={{ scale: 1.02 }}`
   - 替换为 CSS transition 效果

4. **按钮动画**（第136-142行）
   - 移除 `whileHover` 和 `whileTap`
   - 替换为 CSS hover 效果

### 保留的功能：
- ✅ 展开/关闭模态框的动画（功能性动画）
- ✅ 基本的 CSS hover 过渡效果
- ✅ 所有交互功能正常工作

### 技术改动：
- 将 `motion.div` 改为普通 `div`
- 简化导入，移除不需要的 framer-motion hooks
- 添加 CSS `transition-all duration-200` 替代 Framer Motion 动画