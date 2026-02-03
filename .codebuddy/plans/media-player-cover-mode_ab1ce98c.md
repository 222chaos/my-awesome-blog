---
name: media-player-cover-mode
overview: 将文章页面 MediaPlayer 的 fitMode 从 contain 改为 cover，使视频横向填满页面宽度
todos:
  - id: change-fitmode
    content: 将 MediaPlayer 的 fitMode 从 contain 改为 cover
    status: completed
---

## 用户需求

将文章页面的视频组件横向拉伸，使其充满页面左右两侧，达到全宽显示效果。

## 当前状态

- 文章页面路径：`frontend/src/app/articles/page.tsx`
- 当前 MediaPlayer 组件使用 `fitMode="contain"`，视频保持比例居中显示，可能产生黑边

## 目标效果

视频填满整个容器宽度，左右两侧无留白

## 技术方案

### 修改内容

将 `fitMode` 从 `contain` 改为 `cover`

### 各模式效果对比

| 模式 | 效果 |
| --- | --- |
| contain | 保持比例，完整显示，可能有黑边 |
| cover | 保持比例，填满容器，可能裁剪上下 |
| fill | 拉伸变形，完全填满 |


选择 `cover` 模式，在保持视频比例的同时填满页面宽度。

### 修改文件

```
frontend/src/app/articles/page.tsx  [MODIFY]
  - Line 198: fitMode="contain" → fitMode="cover"
```