## 将 LogoLoop 组件应用到标签云

### 需要执行的步骤：

1. **创建 LogoLoop 组件**
   - 创建 `frontend/src/components/ui/LogoLoop.tsx`
   - 基于 `docs/logo.md` 中的完整代码实现

2. **修改 TagCloud 组件**
   - 保留现有的 `Tag` 接口和 `TagCloudProps` 接口
   - 删除原有的静态标签按钮代码
   - 使用 LogoLoop 组件替代，配置：
     - 横向滚动 (`direction="left"`)
     - 适当的滚动速度
     - 悬停暂停
     - 边缘渐隐效果
   - 将标签数据转换为 LogoLoop 的 `LogoItem` 格式

3. **主要改动点**
   - 从静态按钮布局 → 横向无限滚动动画
   - 保留标签名称和数量显示
   - 添加玻璃拟态样式适配主题

### 文件清单：
- 新建：`frontend/src/components/ui/LogoLoop.tsx`
- 修改：`frontend/src/components/home/TagCloud.tsx`