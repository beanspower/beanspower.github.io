---
sidebar_position: 1
---

> 整理时间：2026-03-06

# ClaudeCode 接入联通数智 GLM-5 模型指南

## 1）安装 Claude Code

推荐使用 npm 安装，其他安装方式：[Claude Code 快速入门](https://code.claude.com/docs/zh-CN/quickstart)

### 安装或更新 Node.js（v18.0 或更高版本）

**Windows/Linux:**

在终端中执行下列命令，安装 Claude Code：

```sh
npm install -g @anthropic-ai/claude-code
```

运行以下命令验证。若有版本号输出，则表示安装成功：

```sh
claude --version
```

### 跳过 Anthropic 检查拦截

参考官方文档和网上教程，根据所在地区确认是否需要进行 Anthropic 检查。

跳过检查拦截的方法：编辑 `~/.claude.json`，在里面增加 `"hasCompletedOnboarding": true` 字段

```json
{
  "hasCompletedOnboarding": true
}
```

---

## 2）关联联通数智 GLM-5 模型

### 方法1：手动添加配置文件（推荐）

#### 1. 创建并打开配置文件

根据您的操作系统，选择对应的路径和方法：

**Windows 系统：**

- **配置文件路径：** `C:\Users\您的用户名\.claude\settings.json`
- **操作步骤：**
  a. 创建目录（如果目录已存在可跳过）：

  ```sh
  if not exist "%USERPROFILE%\.claude" mkdir "%USERPROFILE%\.claude"
  ```

  b. 使用记事本创建并打开文件：

  ```sh
  notepad "%USERPROFILE%\.claude\settings.json"
  ```

**macOS / Linux 系统：**

- **配置文件路径：** `~/.claude/settings.json`
- **操作步骤：**
  a. 创建目录（如果目录已存在可跳过）：

  ```sh
  mkdir -p ~/.claude
  ```

  b. 使用编辑器（如 nano）创建并打开文件：

  ```sh
  nano ~/.claude/settings.json
  ```

#### 2. 编辑配置文件

将以下内容复制到配置文件中，并将 `YOUR_API_KEY` 替换为您在 CodingPlan 获取的专属 API Key。

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "YOUR_API_KEY",
    "ANTHROPIC_BASE_URL": "https://maas-api.ai-yuanjing.com/openapi/compatible-mode/",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1,
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-5"
  }
}
```

> **注意：** 请确保 JSON 格式正确，保存文件后即可生效。

---

### 方法2：配置环境变量

这里以 Linux Ubuntu 环境变量设置来举例。Windows 系统设置方法，可以同理参考：

```sh
export ANTHROPIC_API_KEY="sk-xx"
export ANTHROPIC_BASE_URL="https://maas-api.ai-yuanjing.com/openapi/compatible-mode/"
export ANTHROPIC_MODEL="glm-5"
```

---

## 3）启动 Claude Code

配置完成后，在终端运行 `claude` 即可启动。

---

*来源：元景大模型MaaS平台文档中心*
*[https://maas.ai-yuanjing.com/doc/pages/216556943/](https://maas.ai-yuanjing.com/doc/pages/216556943/)*
