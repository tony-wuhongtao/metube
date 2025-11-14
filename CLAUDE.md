# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

MeTube 是一个基于 Web 的 GUI 应用，用于 youtube-dl（使用 yt-dlp 分支），支持播放列表功能。它允许用户从 YouTube 和其他数十个网站下载视频。

## 项目架构

### 后端 (Python)
- 主应用文件: `app/main.py` - 包含 Web 服务器、路由和 Socket.IO 配置
- 下载逻辑: `app/ytdl.py` - 处理下载队列、下载管理和 yt-dlp 集成
- 格式配置: `app/dl_formats.py` - 定义下载格式和选项

### 前端 (Angular/TypeScript)
- 源代码目录: `ui/src/`
- 构建输出: `ui/dist/metube/browser/`

### 构建和部署
- Docker 多阶段构建: `Dockerfile`
- 依赖管理: 
  - Python: `pyproject.toml` 和 `uv.lock`
  - Node.js: `ui/package.json` 和 `ui/package-lock.json`

## 常用命令

### 开发环境
```bash
# 构建前端
cd ui
npm install
node_modules/.bin/ng build

# 安装 Python 依赖
cd ..
curl -LsSf https://astral.sh/uv/install.sh | sh
uv sync

# 运行应用
uv run python3 app/main.py
```

### Docker 构建和运行
```bash
# 构建 Docker 镜像
docker build -t metube .

# 运行容器
docker run -d -p 8081:8081 -v /path/to/downloads:/downloads metube
```

### 测试和质量保证
```bash
# Python 代码检查
uv run pylint app/

# Angular 代码检查
cd ui
npm run lint
```

## 配置选项

应用通过环境变量进行配置，主要配置项包括：
- DOWNLOAD_DIR: 下载目录
- AUDIO_DOWNLOAD_DIR: 音频下载目录
- DOWNLOAD_MODE: 下载模式 (sequential, concurrent, limited)
- MAX_CONCURRENT_DOWNLOADS: 最大并发下载数
- YTDL_OPTIONS: 传递给 yt-dlp 的额外选项

## 核心功能模块

1. 下载队列管理 (DownloadQueue): 管理下载任务的排队、执行和状态跟踪
2. WebSocket 通知 (Socket.IO): 实时向客户端推送下载状态更新
3. 持久化存储: 使用 shelve 模块保存下载历史和队列状态
4. 自定义目录支持: 允许用户指定下载子目录
5. 播放列表处理: 支持下载整个播放列表或限制项目数量