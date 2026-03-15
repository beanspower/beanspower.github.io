---
sidebar_position: 3
---

# MacBook Pro (Retina, Mid 2012) 安装 OpenClaw 注意事项

> 本文档记录在 2012 款 MacBook Pro 上安装 OpenClaw 的踩坑经历，帮助后来者少走弯路。本意是想让旧电脑重焕新生，去电脑城更换了电池，谁知路上却困难重重，便由此记。

---

## 一、硬件与系统环境

| 项目 | 配置 |
|------|------|
| 机型 | MacBook Pro (Retina, Mid 2012) |
| 系统 | macOS 10.15.8 Catalina（最终支持版本） |
| 架构 | x86_64 (Intel) |
| 处理器 | Intel Core i7 (Ivy Bridge) |

**重要提示：** 此机型最高只能升级到 macOS 10.15 Catalina，无法运行 Big Sur 及以上版本。这会影响部分软件的最新版本。

---

## 二、前置依赖安装

### 2.1 Xcode Command Line Tools

**必须先安装！** 很多编译工具依赖它。

```bash
# 检查是否已安装
xcode-select -p
# 应输出: /Library/Developer/CommandLineTools

# 如果未安装，运行：
xcode-select --install
```

**踩坑：** 如果之前安装过 Xcode 但后来删除，可能需要重置：

```bash
sudo xcode-select --reset
sudo xcode-select --switch /Library/Developer/CommandLineTools
```

### 2.2 Homebrew

```bash
# 安装（使用国内镜像加速）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 国内用户建议配置镜像（阿里云）
export HOMEBREW_API_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles/api
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles
eval $(/usr/local/Homebrew/bin/brew shellenv)
```

**踩坑（真实经历）：**

- 即使配置了镜像，Homebrew 在老机型上安装 Node.js 仍然很慢
- 因为很多包需要从源码编译，老机器 CPU 慢
- **建议：如果 brew 安装超过 10 分钟，直接放弃，用官网 .pkg 安装包**

### 2.3 Node.js

**关键点：** 选择正确的 Node.js 版本！

#### 方案 A：使用 nvm（推荐）

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重启终端后安装 Node.js 22（OpenClaw 推荐）
nvm install 22
nvm use 22
nvm alias default 22
```

#### 方案 B：使用 Homebrew 直接安装

```bash
brew install node@22
```

**踩坑记录（真实经历）：**

- **Homebrew 在此机型上非常慢**，因为要编译很多依赖
- MacPorts 也试过，但与 Homebrew 会冲突，不推荐混用
- 此机型不要用 `volta` 或 `fnm` 安装 Node.js，可能遇到兼容性问题
- Node.js 22 LTS 是 OpenClaw 当前推荐版本
- 确保安装后 `node --version` 能正常输出，而不是报错

#### 方案 C：官网手动下载安装（推荐用于老机型）

**如果 Homebrew 太慢，直接去官网下载安装包最快！**

1. 访问 Node.js 官网下载页：[https://nodejs.org/en/download/](https://nodejs.org/en/download/)
2. 选择 **LTS 版本**（长期支持版，当前是 v22.x）
3. 选择 **macOS Installer (.pkg)**，注意架构：
   - **x64**：Intel 芯片（2012 款 MacBook Pro 用这个）
   - **ARM64**：Apple Silicon（M1/M2/M3 芯片）
4. 下载后双击 .pkg 文件安装

**验证安装：**

```bash
node --version   # 应输出 v22.x.x
npm --version    # 应输出 10.x.x
which node       # 应输出 /usr/local/bin/node（pkg 安装的默认位置）
```

**版本选择注意：**

- ✅ Node.js 20 LTS - 推荐，稳定
- ✅ Node.js 22 LTS - 推荐，最新 LTS
- ⚠️ Node.js 23+ - 可能有问题，不建议
- ❌ Node.js 24+ - 不要用，太新可能有兼容性问题

#### 验证 Node.js 安装

```bash
node --version   # 应输出 v22.x.x
npm --version    # 应输出 10.x.x
which node       # 应该是一个有效路径
```

### 2.4 配置 npm 全局目录

**重要！** 避免权限问题：

```bash
# 创建全局目录
mkdir -p ~/.npm-global

# 配置 npm 使用该目录
npm config set prefix '~/.npm-global'

# 添加到 PATH（添加到 ~/.zprofile 或 ~/.zshrc）
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zprofile

# 重新加载配置
source ~/.zprofile
```

---

## 三、安装 OpenClaw

### 3.1 全局安装

```bash
npm install -g openclaw
```

**踩坑：** 如果遇到 `EACCES` 权限错误，说明 npm 全局目录配置有问题，回到 2.4 重新配置。

### 3.2 运行配置向导

```bash
openclaw configure
```

按提示完成：

1. 选择模型提供商（如 GLM-5、Claude 等）
2. 配置 API Key
3. 选择是否开机启动

### 3.3 验证安装

```bash
# 查看版本
openclaw --version

# 查看状态
openclaw status

# 测试网关
curl http://127.0.0.1:18789/health
```

---

## 四、开机自启动配置

### 4.1 使用 LaunchAgent（macOS 推荐）

OpenClaw 配置时会自动创建 LaunchAgent，但如果需要手动操作：

```bash
# 安装服务
openclaw gateway install

# 启动服务
openclaw gateway start

# 查看状态
openclaw gateway status
```

### 4.2 LaunchAgent 文件位置

```
~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

### 4.3 手动创建 LaunchAgent（如果自动生成失败）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>ai.openclaw.gateway</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>ProgramArguments</key>
    <array>
      <string>/usr/local/bin/node</string>
      <string>/Users/你的用户名/.npm-global/lib/node_modules/openclaw/dist/entry.js</string>
      <string>gateway</string>
      <string>--port</string>
      <string>18789</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
      <key>HOME</key>
      <string>/Users/你的用户名</string>
      <key>PATH</key>
      <string>/Users/你的用户名/.npm-global/bin:/usr/local/bin:/usr/bin:/bin</string>
    </dict>
  </dict>
</plist>
```

**踩坑：**

- `ProgramArguments` 中的 `node` 路径必须用绝对路径
- `PATH` 环境变量必须包含 npm 全局 bin 目录

---

## 五、常见问题与解决方案

### 5.1 Node.js 安装后找不到命令

**症状：** `node: command not found`

**解决：**

```bash
# 检查 node 实际安装位置
find /usr/local -name "node" 2>/dev/null
find ~/.nvm -name "node" 2>/dev/null

# 确保 PATH 包含 node 所在目录
echo $PATH
```

### 5.2 npm 全局包安装失败（EACCES）

**解决：** 回到 2.4 重新配置 npm 全局目录，**不要使用 sudo**。

### 5.3 LaunchAgent 无法启动

**诊断步骤：**

```bash
# 检查 LaunchAgent 是否加载
launchctl list | grep openclaw

# 查看错误日志
cat ~/.openclaw/logs/gateway.err.log

# 手动测试
openclaw gateway start
```

**常见原因：**

- PATH 环境变量不正确
- node 路径不是绝对路径
- 权限问题

### 5.4 端口被占用

```bash
# 查看占用 18789 端口的进程
lsof -i :18789

# 杀掉进程
kill -9 <PID>
```

### 5.5 证书问题

如果在访问某些 API 时遇到 SSL 证书问题，可以设置：

```bash
# 临时禁用 SSL 验证（不推荐长期使用）
export NODE_TLS_REJECT_UNAUTHORIZED=0

# 或添加系统证书
export NODE_EXTRA_CA_CERTS=/etc/ssl/cert.pem
export NODE_USE_SYSTEM_CA=1
```

---

## 六、针对此机型的特殊建议

### 6.1 性能优化

此机型较老，建议：

- 不要同时运行过多 subagent
- 适当降低 `maxConcurrent` 配置（默认 4 已合适）
- 定期清理日志文件：`rm ~/.openclaw/logs/*.log`

### 6.2 系统维护

```bash
# 定期清理 Homebrew 缓存
brew cleanup

# 检查磁盘空间
df -h /

# 清理 npm 缓存
npm cache clean --force
```

### 6.3 不要安装的东西

在此机型上**不建议**：

- MacPorts（与 Homebrew 冲突，如果已安装考虑移除）
  - **真实踩坑：** 尝试用 MacPorts 安装 Node.js，结果与 Homebrew 冲突
  - 如果已经装了，建议移除或至少不要用它装 Node.js
- 多个 Node 版本管理器混用（nvm + volta + fnm 选一个）
- Docker Desktop（资源消耗大，老机器跑不动）

**包管理器选择建议：**

- 首选：**官网 .pkg 安装包**（最直接，最省事）
- 次选：**nvm**（需要多版本切换时用）
- 备选：**Homebrew**（耐心等待，或用国内镜像加速）
- 不推荐：MacPorts（与 Homebrew 冲突风险大）

---

## 七、验证清单

安装完成后，逐项检查：

- [ ] `node --version` 输出 v22.x.x
- [ ] `npm --version` 输出 10.x.x
- [ ] `openclaw --version` 输出版本号
- [ ] `curl http://127.0.0.1:18789/health` 返回 OK
- [ ] `launchctl list | grep openclaw` 有输出
- [ ] 重启后 OpenClaw 自动启动

---

## 八、参考链接

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [ClawdHub 技能市场](https://clawhub.com)
- [OpenClaw Discord 社区](https://discord.com/invite/clawd)

---

*文档创建日期：2026-03-15*
*适用机型：MacBook Pro (Retina, Mid 2012)*
*系统版本：macOS 10.15.8 Catalina*
