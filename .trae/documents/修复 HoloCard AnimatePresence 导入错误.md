# 修复 HoloCard 组件 AnimatePresence 未定义错误

## 问题分析
`HoloCard.tsx` 文件中使用了 `AnimatePresence` 组件，但没有从 `framer-motion` 中导入。

## 修复方案
在 `HoloCard.tsx` 第 4 行的 framer-motion 导入语句中添加 `AnimatePresence`：
```tsx
// 修改前：
import { motion, useMotionValue, useTransform } from 'framer-motion';

// 修改后：
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
```

这将修复运行时错误，使 HoloCard 组件的模态框动画正常工作。