# WasherLab 自动化内容生成系统

## 系统架构

1. **Cloudflare Workers 定时触发器** - 每天自动运行内容生成
2. **Node.js 内容生成器** - 调用 AI API 生成高质量文章
3. **自动部署脚本** - 生成完成后自动部署到 Cloudflare
4. **Windows 任务调度器** - 备用定时任务方案

## 使用方法

### 方法 1: Cloudflare Workers 定时触发器 (推荐)
1. 确保 wrangler.toml 中包含触发器配置
2. 部署 Worker:
   `powershell
   cd "C:\Users\Administrator\Documents\Codex\yuanwenj\washerlab"
   npx wrangler deploy
   `
3. Worker 会自动每天在指定时间运行内容生成

### 方法 2: Windows 任务调度器
1. 以管理员身份运行 PowerShell
2. 执行:
   `powershell
   cd "C:\Users\Administrator\Documents\Codex\yuanwenj\washerlab\scripts"
   .\setup-daily-schedule.ps1
   `
3. 任务将在每天上午 9:00 自动运行

### 方法 3: 手动触发
`powershell
cd "C:\Users\Administrator\Documents\Codex\yuanwenj\washerlab"
node scripts/advanced-content-generator.js
npx wrangler deploy
`

## 内容生成配置

- 每日生成文章数量: 3 篇
- 每篇最少字数: 2000 字
- 内容类型: 深度分析、专业指南、行业报告
- 作者: Alex Tester
- 目标网站: washerlab.top

## 监控和日志

- 生成日志保存在: data/advanced-publish-tracker.json
- 部署日志保存在: data/deploy-log.txt
- 错误日志保存在: data/error-log.txt

## 故障排除

如果自动任务不工作:
1. 检查 API 密钥是否正确配置
2. 验证网络连接是否正常
3. 查看日志文件了解具体错误
4. 手动运行生成脚本测试