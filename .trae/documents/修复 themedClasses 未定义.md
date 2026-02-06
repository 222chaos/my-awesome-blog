# 修复 themedClasses 未定义错误

## 问题分析

错误信息：`themedClasses is not defined` 在 `src/app/albums/page.tsx (269:160)`

## 根本原因

在之前的修改中，我删除了 `AlbumsPage` 中的 `themedClasses` 定义行，但新代码中仍在使用它。

## 解决方案

重新添加 `themedClasses` 的定义：

```tsx
const { themedClasses } = useThemedClasses();
```

需要将其添加回 `AlbumsPage` 组件中，在 state 定义之后。