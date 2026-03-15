---
sidebar_position: 2
---
# OpenClaw Git 备份使用指南

> 整理时间：2026-03-06
> 适用版本：OpenClaw 2026.3.2

仓库位置：`~/.openclaw/.git`

---

## 🔄 日常使用

```bash
# 1. 改配置前，先看看有什么改动
cd ~/.openclaw
git status

# 2. 改完后提交
git add -A && git commit -m "改了模型配置"

# 3. 查看历史
git log --oneline
```

---

## ⏪ 回滚操作

```bash
# 查看某个文件的改动历史
git log --oneline openclaw.json

# 只恢复某个文件到上一个版本
git checkout HEAD~1 -- openclaw.json

# 完全回滚到上一次提交（危险！会丢失当前改动）
git reset --hard HEAD~1

# 回滚到指定版本
git reset --hard 6aeee7e
```

---

## 🔍 查看改动

```bash
# 查看当前未提交的改动
git diff

# 查看某个文件的改动
git diff openclaw.json

# 查看某次提交改了什么
git show 9fde7fe
```

---

## 📤 可选：推送到远程仓库

如果想云端备份：

```bash
# 创建 GitHub 私有仓库后
git remote add origin git@github.com:你的用户名/openclaw-backup.git
git push -u origin main

# 以后同步
git push
```

> ⚠️ **注意：** 推送到 GitHub 前确认 `.gitignore` 排除了 `.env`（含 API keys），已默认排除。

---

## 🛠 快捷命令

加到 `~/.zshrc` 或 `~/.bashrc`：

```bash
alias gc='cd ~/.openclaw && git add -A && git commit -m'
alias gs='cd ~/.openclaw && git status'
alias gl='cd ~/.openclaw && git log --oneline -10'
```

然后就可以：

```bash
gc "改了配置"  # 快速提交
gs            # 查看状态
gl            # 查看历史
```

---

## 📁 追踪的文件

| 目录/文件 | 内容 |
|----------|------|
| `workspace/` | 人格、记忆、skills |
| `openclaw.json` | 主配置 |
| `config.json/yaml` | 辅助配置 |
| `agents/` | Agent 配置 |
| `skills/` | 链接的 skills |
| `hooks/` | 自定义 hooks |

---

## 🚫 已排除的内容

- `node_modules/` - 依赖文件太大
- `.env` - 敏感信息（API keys）
- `sessions.json`, `logs/` - 运行时数据
- `*.bak`, `*.save` - 自动备份文件
- `memory/` - 每日笔记（可通过 `.gitignore` 调整）

---

## 💡 总结

- 改东西 → `git add -A && git commit -m "说明"`
- 崩了 → `git reset --hard HEAD~1`
- 查看历史 → `git log --oneline`
