# WasherLab 自动化内容生成系统 - 完整配置

## 系统组件

1. **Cloudflare Worker 定时触发器** - 每天自动运行
2. **Node.js 内容生成器** - 调用 AI API 生成高质量文章
3. **自动部署脚本** - 生成完成后自动部署
4. **监控和日志系统** - 跟踪生成状态

## 部署状态

- ✅ Worker 已部署: https://washerlab.renhongtao2.workers.dev
- ✅ 域名绑定: washerlab.top
- ✅ 定时任务: 每天 9:00 AM UTC 自动运行
- ✅ 内容生成: 每日 3 篇高质量文章 (2000+ 字)

## 使用方法

### 自动模式 (推荐)
Worker 会自动每天在 9:00 AM UTC 运行内容生成和部署

### 手动触发
`powershell
# 触发内容生成
Invoke-RestMethod -Uri "https://washerlab.renhongtao2.workers.dev/api/generate-content" -Method POST

# 检查健康状态
Invoke-RestMethod -Uri "https://washerlab.renhongtao2.workers.dev/health"
`

### 查看日志
- 生成日志: data/advanced-publish-tracker.json
- 部署日志: data/deploy-log.txt
- 错误日志: data/error-log.txt

## 内容生成配置

- 每日文章数量: 3 篇
- 每篇最少字数: 2000 字
- 内容类型: 深度分析、专业指南、行业报告
- 作者: Alex Tester
- 目标网站: washerlab.top

## 故障排除

如果自动任务不工作:
1. 检查 Cloudflare Worker 状态
2. 验证 API 密钥配置
3. 查看日志文件了解错误详情
4. 手动触发内容生成测试