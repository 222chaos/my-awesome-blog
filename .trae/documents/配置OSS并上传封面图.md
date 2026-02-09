## 配置OSS并上传图片到阿里云

### 问题分析
1. `.env` 文件中缺少 OSS 的 bucket 名称和 endpoint 配置
2. 部分 Unsplash 图片 URL 返回 404 错误

### 执行步骤

1. **更新 .env 配置文件**
   添加缺少的 OSS 配置项：
   - `ALIBABA_CLOUD_OSS_BUCKET_NAME`: OSS 存储桶名称
   - `ALIBABA_CLOUD_OSS_ENDPOINT`: OSS 访问域名
   - `ALIBABA_CLOUD_OSS_CDN_DOMAIN`: CDN 域名（可选）

2. **更新图片下载脚本**
   - 修正 Unsplash 图片 URL（使用有效的图片ID）
   - 增加重试机制

3. **重启后端服务**
   - 让配置生效

4. **执行上传脚本**
   - 下载图片
   - 上传到 OSS
   - 更新文章封面图

### 需要的OSS配置信息
- **Bucket名称**：例如 `my-awesome-blog`
- **Endpoint**：例如 `https://oss-cn-hangzhou.aliyuncs.com`
- **Region**：例如 `oss-cn-hangzhou`
- **CDN域名**：可选，例如 `cdn.example.com`