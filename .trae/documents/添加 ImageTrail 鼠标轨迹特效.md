# 为相册标题添加 ImageTrail 鼠标轨迹特效

## 特效说明

`UPDATE.md` 文件提供了一个完整的 `ImageTrail` 组件，它使用 GSAP 实现 8 种不同的鼠标轨迹图片特效：

**8 种变体：**
1. Variant 1 - 基础缩放淡出效果
2. Variant 2 - 内部图片缩放 + 亮度变化
3. Variant 3 - 图片向随机方向飞出
4. Variant 4 - 根据鼠标速度调整亮度和对比度
5. Variant 5 - 根据移动方向旋转图片
6. Variant 6 - 根据速度调整大小、亮度、模糊和灰度
7. Variant 7 - 同时显示多个图片（队列效果）
8. Variant 8 - 3D 透视效果

## 实施方案

### 1. 创建 ImageTrail 组件
- 将 `UPDATE.md` 中的代码转换为独立的 React 组件
- 保存到 `e:\project\my-awesome-blog\frontend\src\components\ui\ImageTrail.tsx`

### 2. 集成到相册标题
- 在标题卡片中添加 ImageTrail 组件
- 使用相册封面图片作为图片源
- 选择 Variant 3（向随机方向飞出）作为默认效果
- 将 ImageTrail 作为背景层，z-index 设置为较低值

### 3. 优化样式
- 确保特效不会干扰文字可读性
- 调整透明度和混合模式
- 确保在移动设备上也能正常工作

## 注意事项

- 项目已安装 `gsap: ^3.14.2` 和 `@gsap/react: ^2.1.2`
- 需要使用 TypeScript 编写组件
- 需要适配现有的主题系统