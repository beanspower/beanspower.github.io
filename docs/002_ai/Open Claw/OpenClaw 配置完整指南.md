---
sidebar_position: 1
---

# OpenClaw 配置完整指南

> 整理时间：2026-03-06
> 适用版本：OpenClaw 2026.3.2

---

## 目录

1. [系统要求](#一系统要求)
2. [安装 OpenClaw](#二安装-openclaw)
3. [初始化配置](#三初始化配置)
4. [模型配置](#四模型配置)
5. [Gateway 服务](#五gateway-服务)
6. [环境变量配置](#六环境变量配置)
7. [Skills 技能包](#七skills-技能包)
8. [插件配置](#八插件配置)
9. [消息渠道配置](#九消息渠道配置)
10. [斜杠命令速查](#十斜杠命令速查)
11. [工作空间文件](#十一下作空间文件)
12. [验证安装](#十二验证安装)
13. [故障排查](#十三故障排查)
14. [安全修改流程](#十四安全修改流程)
15. [备份建议](#十五备份建议)

---

## 一、系统要求

### 支持的操作系统

| 系统 | 支持情况 |
|------|----------|
| macOS | ✅ 完全支持（推荐） |
| Linux | ✅ 完全支持 |
| Windows | ⚠️ 通过 WSL2 支持 |

### 必需软件

| 软件 | 版本要求 | 检查命令 |
|------|----------|----------|
| Node.js | ≥ 18.x | `node --version` |
| npm | ≥ 9.x | `npm --version` |
| Git | 任意 | `git --version` |

### 安装 Node.js（如果未安装）

**方法 1：使用官方安装包**

从 [Node.js 官网](https://nodejs.org) 下载 LTS 版本安装

**方法 2：使用 Homebrew（macOS）**

```bash
brew install node
```

**方法 3：使用 nvm（推荐）**

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js
nvm install --lts
nvm use --lts
```

---

## 二、安装 OpenClaw

### 安装命令

```bash
npm install -g openclaw
```

### 验证安装

```bash
openclaw --version
# 输出：2026.3.2 或类似版本号
```

### 更新 OpenClaw

```bash
npm update -g openclaw
```

---

## 三、初始化配置

### 运行配置向导

```bash
openclaw configure
```

### 配置向导步骤

#### Step 1: 选择 Gateway 运行位置

| 选项 | 说明 |
|------|------|
| Local (this machine) | 本机运行（推荐） |
| Remote | 连接远程 Gateway |

#### Step 2: 选择要配置的部分

| 选项 | 说明 | 是否必需 |
|------|------|----------|
| Workspace | 工作空间目录 | 默认即可 |
| Model | 模型提供商 | **必需** |
| Web tools | 网页搜索/抓取 | 可选 |
| Gateway | 端口、认证 | 默认即可 |
| Daemon | 系统服务 | 推荐 |
| Channels | 消息渠道 | 可选 |
| Skills | 技能包 | 可选 |
| Health check | 健康检查 | 可选 |

#### Step 3: 配置模型

选择模型提供商：

| 提供商 | 说明 |
|--------|------|
| OpenAI | GPT-4、GPT-4o 等 |
| Anthropic | Claude 系列 |
| unicom/glm | 智谱 GLM（当前使用） |
| 其他 | 支持 OpenAI 兼容 API 的提供商 |

输入 API Key 后完成配置。

---

## 四、模型配置

### 查看当前模型配置

```bash
openclaw configure
# 选择 Model 部分
```

或直接查看配置文件：

```bash
cat ~/.openclaw/openclaw.json | grep -A 20 '"models"'
```

### 手动配置模型（openclaw.json）

```json
{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "https://api.openai.com/v1",
        "apiKey": "sk-xxx",
        "api": "openai-completions",
        "models": [
          { "id": "gpt-4o", "name": "GPT-4o" }
        ]
      },
      "anthropic": {
        "baseUrl": "https://api.anthropic.com",
        "apiKey": "sk-ant-xxx",
        "api": "anthropic",
        "models": [
          { "id": "claude-sonnet-4-20250514", "name": "Claude Sonnet 4" }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai/gpt-4o"
      }
    }
  }
}
```

### 切换模型

在对话中使用：

```
/model              # 显示可用模型列表
/model 1            # 选择编号 1 的模型
/model claude       # 模糊匹配
/model openai/gpt-4 # 指定提供商和模型
```

### 获取 API Key

| 提供商 | 获取地址 |
|--------|----------|
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) |
| 智谱 GLM | [open.bigmodel.cn](https://open.bigmodel.cn/) |
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com/) |
| Moonshot | [platform.moonshot.cn](https://platform.moonshot.cn/) |

---

## 五、Gateway 服务

### 什么是 Gateway？

Gateway 是 OpenClaw 的核心服务，负责：

- 处理消息渠道连接
- 管理会话和上下文
- 执行工具调用
- 协调 Agent 运行

### 启动 Gateway

**手动启动：**

```bash
openclaw gateway start
```

**安装为系统服务（推荐）：**

```bash
# macOS / Linux (systemd)
openclaw gateway install
openclaw gateway start
```

### Gateway 状态管理

```bash
# 查看状态
openclaw gateway status

# 启动
openclaw gateway start

# 停止
openclaw gateway stop

# 重启
openclaw gateway restart

# 卸载系统服务
openclaw gateway uninstall
```

### 访问 Web 界面

Gateway 启动后，访问：

```
http://127.0.0.1:18789/
```

可以查看状态、发送消息、管理会话。

### Gateway 配置（openclaw.json）

```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-token-here"
    }
  }
}
```

| 配置项 | 说明 |
|--------|------|
| `port` | Gateway 端口，默认 18789 |
| `mode` | 运行模式：local / remote |
| `bind` | 绑定地址：loopback（仅本机）/ 0.0.0.0（所有接口） |
| `auth.mode` | 认证模式：token / none |
| `auth.token` | 访问令牌 |

---

## 六、环境变量配置

### 问题说明

Gateway 作为系统服务启动时，**不会自动加载** `~/.openclaw/.env` 文件。

环境变量必须配置在 LaunchAgent plist 中才能生效。

### 配置步骤

#### Step 1: 编辑 LaunchAgent plist

```bash
# macOS
nano ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

#### Step 2: 添加环境变量

找到 `<key>EnvironmentVariables</key>` 部分，添加：

```xml
<key>EnvironmentVariables</key>
<dict>
    <!-- 已有变量 -->
    <key>HOME</key>
    <string>/Users/你的用户名</string>
    
    <!-- 添加新的环境变量 -->
    <key>TAVILY_API_KEY</key>
    <string>tvly-dev-xxx</string>
    
    <key>BRAVE_API_KEY</key>
    <string>你的Brave搜索API Key</string>
    
    <key>OPENAI_API_KEY</key>
    <string>sk-xxx</string>
</dict>
```

#### Step 3: 重启 Gateway

```bash
# 方法 1：使用 openclaw 命令
openclaw gateway restart

# 方法 2：使用 launchctl（macOS）
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

#### Step 4: 验证环境变量

```bash
# 查看 Gateway 进程的环境变量
ps eww -p $(pgrep -f "openclaw.*gateway") | tr ' ' '\n' | grep TAVILY
```

### 常用环境变量

| 变量名 | 用途 | 获取地址 |
|--------|------|----------|
| `TAVILY_API_KEY` | Tavily 搜索 | [tavily.com](https://tavily.com) |
| `BRAVE_API_KEY` | Brave 搜索 | [brave.com/search/api](https://brave.com/search/api) |
| `OPENAI_API_KEY` | OpenAI API | [platform.openai.com](https://platform.openai.com) |
| `ANTHROPIC_API_KEY` | Claude API | [console.anthropic.com](https://console.anthropic.com) |

---

## 七、Skills 技能包

### 什么是 Skills？

Skills 是扩展 Agent 能力的技能包，提供：

- 搜索能力（Tavily、Brave）
- 文档处理（PDF、Notion、Obsidian）
- 自动化（n8n、GitHub）
- 设备控制（Sonos）
- 天气查询
- 等等...

### 已安装的 Skills

当前工作空间安装的技能（`~/.openclaw/workspace/skills/`）：

| Skill | 用途 | 需要配置 |
|-------|------|----------|
| `github` | GitHub 操作（issue、PR、CI） | 需要 `gh` CLI 登录 |
| `gog` | Google Workspace | 需要 OAuth 授权 |
| `healthcheck` | 主机安全检查 | 无 |
| `mcporter` | MCP 服务器调用 | 按需配置 |
| `nano-pdf` | PDF 编辑 | 无 |
| `notion` | Notion API | 需要 API Key |
| `obsidian` | Obsidian 笔记 | 指定 vault 路径 |
| `openai-whisper` | 语音转文字 | 无（本地运行） |
| `skill-creator` | 创建新技能 | 无 |
| `sonoscli` | Sonos 音箱控制 | 无 |
| `summarize` | 网页/文件摘要 | 无 |
| `trello` | Trello 看板管理 | 需要 API Key |
| `weather` | 天气查询 | 无 |
| `find-skills` | 发现技能 | 无 |
| `self-improvement` | 自我学习 | 无 |
| `research` | 多源研究 | 无 |
| `filesystem-mcp` | 文件系统 MCP | 无 |
| `n8n-workflow-automation` | n8n 工作流 | 无 |
| `skill-vetter` | 技能安全审查 | 无 |
| `tavily-search` | Tavily 搜索 | 需要 `TAVILY_API_KEY` |

### 发现和安装 Skill

**方法 1：使用 find-skills**

```
/find-skills 搜索
```

**方法 2：从 ClawHub 安装**

访问 [ClawHub](https://clawhub.com) 搜索技能，然后：

```bash
openclaw skill install <skill-name>
```

**方法 3：手动安装**

```bash
cd ~/.openclaw/workspace/skills
git clone <skill-repo-url>
```

### Skill 配置

大多数 Skill 需要配置环境变量或 API Key，参考 Skill 目录下的 `SKILL.md` 文件。

例如 `tavily-search`：

```bash
# 查看 Skill 说明
cat ~/.openclaw/workspace/skills/tavily-search/SKILL.md
```

### 创建自定义 Skill

在 `~/.openclaw/workspace/skills/` 下创建目录：

```
my-skill/
├── SKILL.md      # 必需：技能说明和使用指南
├── scripts/      # 可选：可执行脚本
│   └── main.mjs
└── tools.md      # 可选：工具定义
```

SKILL.md 示例：

```markdown
---
name: my-skill
description: 我的自定义技能
---

# My Skill

使用说明...

## 可用命令

- `node {baseDir}/scripts/main.mjs` - 执行主脚本
```

---

## 八、插件配置

### 当前已安装插件

| 插件 | 用途 |
|------|------|
| `@m1heng-clawd/feishu` | 飞书集成（文档、聊天、多维表格等） |

### 飞书插件提供的工具

| 工具 | 功能 |
|------|------|
| `feishu_doc` | 文档读写操作 |
| `feishu_chat` | 聊天操作 |
| `feishu_wiki` | 知识库操作 |
| `feishu_drive` | 云盘操作 |
| `feishu_bitable_*` | 多维表格操作 |

### 安装插件

```bash
openclaw plugin install <package-name>
```

### 插件配置

插件配置在 `openclaw.json` 的 `plugins` 部分：

```json
{
  "plugins": {
    "load": {
      "paths": ["~/.openclaw/extensions"]
    },
    "entries": {
      "feishu": { "enabled": true }
    },
    "installs": {
      "feishu": {
        "source": "npm",
        "spec": "@m1heng-clawd/feishu"
      }
    }
  }
}
```

---

## 九、消息渠道配置

### 飞书（Feishu）

#### Step 1: 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/app)
2. 点击「创建企业自建应用」
3. 填写应用名称和描述
4. 记录 `App ID` 和 `App Secret`

#### Step 2: 配置权限

在应用管理页面，添加以下权限：

| 权限 | 用途 |
|------|------|
| `contact:user.base:readonly` | 获取用户信息 |
| `im:message` | 接收和发送消息 |
| `im:message:send_as_bot` | 以机器人身份发消息 |
| `docx:document` | 文档操作 |
| `drive:drive` | 云盘操作 |
| `wiki:wiki` | 知识库操作 |
| `bitable:app` | 多维表格操作 |

#### Step 3: 配置事件订阅

1. 在应用管理页面，找到「事件订阅」
2. 选择「使用 WebSocket」模式
3. 无需配置服务器地址

#### Step 4: 发布版本并申请上线

1. 在「版本管理与发布」创建版本
2. 申请上线
3. 管理员审批通过

#### Step 5: 配置 OpenClaw

```bash
openclaw configure
# 选择 Channels → Feishu
# 输入 App ID 和 App Secret
```

或手动编辑 `openclaw.json`：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxx",
      "appSecret": "xxx",
      "connectionMode": "websocket",
      "domain": "feishu",
      "groupPolicy": "open",
      "dmPolicy": "pairing",
      "allowFrom": ["*"]
    }
  }
}
```

#### Step 6: 重启 Gateway

```bash
openclaw gateway restart
```

### Telegram

#### Step 1: 创建 Bot

1. 在 Telegram 中搜索 @BotFather
2. 发送 `/newbot`
3. 按提示设置 Bot 名称
4. 记录返回的 `Token`

#### Step 2: 配置 OpenClaw

```bash
openclaw configure
# 选择 Channels → Telegram
# 输入 Bot Token
```

或手动编辑：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
    }
  }
}
```

### Discord

#### Step 1: 创建 Discord 应用

1. 访问 [Discord 开发者门户](https://discord.com/developers/applications)
2. 点击「New Application」
3. 填写应用名称
4. 在「Bot」页面创建 Bot
5. 记录 `Token`
6. 在「OAuth2 → URL Generator」生成邀请链接

#### Step 2: 配置权限

Bot 需要以下权限：

- Send Messages
- Read Messages
- Read Message History
- Add Reactions
- Use Slash Commands

#### Step 3: 邀请 Bot 加入服务器

使用生成的 OAuth2 URL 邀请 Bot 加入服务器。

#### Step 4: 配置 OpenClaw

```bash
openclaw configure
# 选择 Channels → Discord
# 输入 Bot Token
```

或手动编辑：

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "token": "your-bot-token",
      "intents": ["Guilds", "GuildMessages", "MessageContent"]
    }
  }
}
```

### 其他渠道

| 渠道 | 配置方法 |
|------|----------|
| WhatsApp | 需要配置 WhatsApp Business API |
| Signal | 需要配置 Signald |
| Slack | 需要创建 Slack App |
| iMessage | 仅限 macOS，需要 AppleScript 权限 |

---

## 十、斜杠命令速查

### 会话控制

| 命令 | 说明 |
|------|------|
| `/new` 或 `/reset` | 开始新会话，清空上下文 |
| `/new <model>` | 新会话 + 切换模型 |
| `/stop` | 停止当前运行 |
| `/restart` | 重启 Gateway |
| `/compact [instructions]` | 压缩上下文 |

### 状态查看

| 命令 | 说明 |
|------|------|
| `/status` | 显示当前状态、模型、用量 |
| `/whoami` 或 `/id` | 显示发送者 ID |
| `/context list` | 显示上下文文件列表 |
| `/context detail` | 显示详细的上下文信息 |
| `/usage off\|tokens\|full\|cost` | 控制用量显示 |

### 模型切换

| 命令 | 说明 |
|------|------|
| `/model` | 显示可用模型列表 |
| `/model list` | 同上 |
| `/model <#>` | 选择编号对应的模型 |
| `/model <provider>/<model>` | 指定模型 |
| `/model status` | 显示模型详情 |

### 思考模式

| 命令 | 说明 |
|------|------|
| `/think off\|minimal\|low\|medium\|high\|xhigh` | 调整思考深度 |
| `/thinking` 或 `/t` | `/think` 的别名 |
| `/reasoning on\|off\|stream` | 显示推理过程 |
| `/verbose on\|full\|off` | 调试模式 |

### 权限与执行

| 命令 | 说明 |
|------|------|
| `/elevated on\|off\|ask\|full` | 控制命令执行权限 |
| `/exec` | 显示当前执行设置 |
| `/approve <id> allow-once\|allow-always\|deny` | 审批待决命令 |
| `/allowlist` | 管理白名单 |

### 子智能体

| 命令 | 说明 |
|------|------|
| `/subagents list` | 列出子智能体 |
| `/subagents kill <id>` | 终止子智能体 |
| `/subagents steer <id> <msg>` | 发送指令 |
| `/kill <id\|all>` | 立即终止 |
| `/steer <id> <msg>` | 操控子智能体 |

### 配置（需启用）

| 命令 | 说明 |
|------|------|
| `/config show` | 显示配置 |
| `/config get <key>` | 获取配置项 |
| `/config set <key> <value>` | 设置配置项 |
| `/debug show` | 显示调试信息 |

### 其他

| 命令 | 说明 |
|------|------|
| `/help` | 帮助 |
| `/commands` | 显示命令列表 |
| `/skill <name>` | 运行指定技能 |
| `/export-session` | 导出会话到 HTML |
| `/tts off\|always\|tagged` | 控制 TTS |

### Shell 命令（需启用）

| 命令 | 说明 |
|------|------|
| `! <command>` | 执行主机 shell 命令 |
| `!poll` | 检查后台任务状态 |
| `!stop` | 停止后台任务 |

---

## 十一、工作空间文件

`~/.openclaw/workspace/` 目录结构：

| 文件/目录 | 用途 | 说明 |
|-----------|------|------|
| `AGENTS.md` | Agent 行为准则 | 定义安全规则、群聊礼仪等 |
| `MEMORY.md` | 长期记忆 | 存储重要事件、偏好、决策 |
| `USER.md` | 用户信息 | 名字、时区、备注等 |
| `IDENTITY.md` | 身份定义 | 名字、emoji、主题等 |
| `HEARTBEAT.md` | 心跳任务 | 定期检查项 |
| `TOOLS.md` | 工具备注 | 设备名、SSH 信息等 |
| `BOOTSTRAP.md` | 初始化引导 | 首次运行后删除 |
| `memory/` | 每日日志 | `YYYY-MM-DD.md` 格式 |
| `skills/` | 安装的技能包 | 自定义和安装的 Skills |

### 重要文件说明

#### AGENTS.md

定义 Agent 的行为准则，包括：

- 安全规则
- 群聊行为规范
- 心跳任务处理
- 记忆管理

**重要：修改此文件会立即影响 Agent 行为。**

#### MEMORY.md

Agent 的长期记忆，存储：

- 用户偏好
- 重要决策
- 关键事件
- 教训和经验

**注意：此文件仅在主会话中加载，不会泄露到群聊。**

#### IDENTITY.md

定义 Agent 身份：

```markdown
# IDENTITY.md - 我是谁？

- **Name:** 猪头
- **Creature:** AI 助手
- **Vibe:** 温暖、靠谱、有点幽默
- **Emoji:** 🐷
- **Avatar:** pictures/pig.jpg
```

---

## 十二、验证安装

### 检查清单

#### 1. 检查 Gateway 状态

```bash
openclaw gateway status
```

期望输出：

```
Service: LaunchAgent (loaded)
Runtime: running (pid xxx)
RPC probe: ok
Listening: 127.0.0.1:18789
```

#### 2. 检查 Web 界面

访问 [http://127.0.0.1:18789/](http://127.0.0.1:18789/)

应该看到 OpenClaw 控制界面。

#### 3. 检查模型连接

在 Web 界面发送消息，验证模型能否正常响应。

或使用命令行：

```bash
# 检查模型配置
openclaw status --usage
```

#### 4. 检查环境变量

```bash
# 检查 TAVILY_API_KEY 是否加载
ps eww -p $(pgrep -f "openclaw.*gateway") | tr ' ' '\n' | grep TAVILY
```

应该输出：`TAVILY_API_KEY=tvly-dev-xxx`

#### 5. 测试 Skills

在对话中测试：

```
# 测试天气
今天北京天气怎么样？

# 测试搜索（需要 Tavily API Key）
搜索一下 OpenClaw 是什么
```

#### 6. 检查渠道连接

如果配置了飞书/Telegram/Discord：

1. 在对应平台找到 Bot
2. 发送消息
3. 验证能否收到回复

---

## 十三、故障排查

### Gateway 无法启动

**症状：** `openclaw gateway start` 失败或立即退出

**排查步骤：**

```bash
# 1. 检查端口占用
lsof -i :18789

# 2. 查看错误日志
cat ~/.openclaw/logs/gateway.err.log

# 3. 查看临时日志
cat /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# 4. 检查配置语法
openclaw gateway status
```

**常见原因：**

- 端口被占用 → 修改端口或关闭占用进程
- 配置文件语法错误 → 检查 `openclaw.json`
- Node.js 版本过低 → 升级 Node.js

### 环境变量不生效

**症状：** Tavily 等服务报 API Key 错误

**排查步骤：**

```bash
# 1. 检查 plist 中是否配置
cat ~/Library/LaunchAgents/ai.openclaw.gateway.plist | grep -A 1 TAVILY

# 2. 检查进程环境变量
ps eww -p $(pgrep -f "openclaw.*gateway") | tr ' ' '\n' | grep TAVILY

# 3. 重启 Gateway
openclaw gateway restart
```

### 模型调用失败

**症状：** 对话报错或无响应

**排查步骤：**

```bash
# 1. 检查 API Key 配置
cat ~/.openclaw/openclaw.json | grep -A 5 '"providers"'

# 2. 检查 Gateway 日志
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# 3. 测试 API 连接
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**常见原因：**

- API Key 错误或过期
- 余额不足
- 网络问题
- baseUrl 配置错误

### 飞书 Bot 无响应

**症状：** 发消息给 Bot 无回复

**排查步骤：**

1. 检查应用是否已发布上线
2. 检查事件订阅是否启用
3. 检查 Gateway 是否运行
4. 检查 `openclaw.json` 中 `channels.feishu.enabled` 是否为 `true`

```bash
# 查看飞书连接日志
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log | grep -i feishu
```

### Skill 不工作

**症状：** 使用技能时报错

**排查步骤：**

```bash
# 1. 检查 Skill 是否存在
ls ~/.openclaw/workspace/skills/<skill-name>/

# 2. 检查 SKILL.md
cat ~/.openclaw/workspace/skills/<skill-name>/SKILL.md

# 3. 检查环境变量
ps eww -p $(pgrep -f "openclaw.*gateway") | tr ' ' '\n' | grep <API_KEY_NAME>
```

### 配置修改后无变化

**排查步骤：**

```bash
# 1. 确认配置文件语法
cat ~/.openclaw/openclaw.json | python3 -m json.tool

# 2. 重启 Gateway
openclaw gateway restart

# 3. 清除会话缓存（在对话中）
/new
```

---

## 十四、安全修改流程

### 原则

**涉及系统配置的修改，必须遵守以下流程：**

1. **提出方案** — 说明要做什么
2. **分析原因** — 解释为什么需要，有什么风险
3. **请求授权** — 等待用户明确批准
4. **备份原文件** — 创建 `.bak` 或带时间戳的备份
5. **获得授权后再操作**

### 禁止擅自操作的文件

| 文件 | 风险 |
|------|------|
| `~/.openclaw/openclaw.json` | 可能导致 Gateway 无法启动 |
| `~/Library/LaunchAgents/ai.openclaw.gateway.plist` | 可能导致服务无法加载 |
| `~/.openclaw/.env` | 可能影响环境变量 |
| 任何 `openclaw gateway` 命令 | 可能中断服务 |

### 备份示例

```bash
# 备份配置文件
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak.$(date +%Y%m%d_%H%M%S)

# 备份 LaunchAgent
cp ~/Library/LaunchAgents/ai.openclaw.gateway.plist ~/Library/LaunchAgents/ai.openclaw.gateway.plist.bak.$(date +%Y%m%d_%H%M%S)
```

### 恢复示例

```bash
# 恢复配置
cp ~/.openclaw/openclaw.json.bak.20260306_230000 ~/.openclaw/openclaw.json

# 重启服务
openclaw gateway restart
```

---

## 十五、备份建议

### 重要文件清单

```bash
# 核心配置
~/.openclaw/openclaw.json
~/.openclaw/.env

# 系统服务（macOS）
~/Library/LaunchAgents/ai.openclaw.gateway.plist

# 工作空间
~/.openclaw/workspace/AGENTS.md
~/.openclaw/workspace/MEMORY.md
~/.openclaw/workspace/USER.md
~/.openclaw/workspace/IDENTITY.md
~/.openclaw/workspace/TOOLS.md
~/.openclaw/workspace/skills/
```

### 快速备份脚本

```bash
#!/bin/bash
# 保存为 backup-openclaw.sh

BACKUP_DIR=~/Backups/openclaw-$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# 备份核心配置
cp ~/.openclaw/openclaw.json "$BACKUP_DIR/"
cp ~/.openclaw/.env "$BACKUP_DIR/" 2>/dev/null

# 备份系统服务
cp ~/Library/LaunchAgents/ai.openclaw.gateway.plist "$BACKUP_DIR/"

# 备份工作空间
cp -r ~/.openclaw/workspace "$BACKUP_DIR/"

echo "备份完成: $BACKUP_DIR"
```

### 恢复步骤

```bash
# 1. 停止服务
openclaw gateway stop

# 2. 恢复文件
cp ~/Backups/openclaw-xxx/openclaw.json ~/.openclaw/
cp ~/Backups/openclaw-xxx/ai.openclaw.gateway.plist ~/Library/LaunchAgents/

# 3. 重启服务
openclaw gateway start
```

---

## 附录：配置文件完整示例

### openclaw.json 示例

```json
{
  "meta": {
    "lastTouchedVersion": "2026.3.2",
    "lastTouchedAt": "2026-03-06T00:00:00.000Z"
  },
  "wizard": {
    "lastRunAt": "2026-03-06T00:00:00.000Z",
    "lastRunVersion": "2026.3.2",
    "lastRunCommand": "configure",
    "lastRunMode": "local"
  },
  "models": {
    "providers": {
      "unicom": {
        "baseUrl": "https://maas-api.ai-yuanjing.com/openapi/compatible-mode/v1",
        "apiKey": "your-api-key",
        "api": "openai-completions",
        "models": [
          { "id": "glm-5", "name": "GLM 5" }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "unicom/glm-5"
      },
      "workspace": "~/.openclaw/workspace"
    },
    "list": [
      {
        "id": "main",
        "identity": {
          "name": "助手",
          "theme": "AI 助手",
          "emoji": "🤖"
        }
      }
    ]
  },
  "tools": {
    "profile": "full",
    "web": {
      "search": { "enabled": false },
      "fetch": { "enabled": true }
    }
  },
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxx",
      "appSecret": "xxx",
      "connectionMode": "websocket",
      "groupPolicy": "open",
      "dmPolicy": "pairing"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-token"
    }
  },
  "plugins": {
    "entries": {
      "feishu": { "enabled": true }
    }
  }
}
```

---

*本文档由 OpenClaw Agent 生成*
*最后更新：2026-03-06*
