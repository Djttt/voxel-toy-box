<div align="center">
# Voxel Toy Box

**Voxel Toy Box** 是一个基于 AI 的体素艺术互动游乐场。通过文本提示生成 3D 模型，以物理方式拆解它们，并观看 AI 将它们重建成全新的形状！

[English](./README.md) | [中文](./README_zh.md)

</div>

## ✨ 核心特性

- **AI 体素生成**: 
    - **Google Gemini**: 高速云端生成。
    - **本地 Ollama**: 注重隐私的本地生成，支持 `llama3`, `mistral` 等模型。
    - **模型发现**: 自动获取并选择可用的 Ollama 模型。
- **互动物理**: 意想不到的“拆解”物理特效。
- **AI 变形**: 将散落的体素重建成全新的物体，同时保留原有的配色方案。
- **模型画廊**: 
    - 浏览服务器上存储的社区模型。
    - 上传你的作品。
    - **管理员模式**: 直接在 UI 中管理和删除模型。
- **多语言**: 全面支持中文和英文。

## 🚀 本地运行

### 前置条件
- Node.js (v18+)
- Python (v3.9+)
- [Ollama](https://ollama.com/) (可选，用于本地 AI)

### 1. 后端设置 (Flask)
启动用于模型存储的 Python 后端服务器。

```bash
# 创建虚拟环境 (可选但推荐)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install flask flask-cors

# 运行服务器
python server/app.py
```
> 服务器运行在 `http://localhost:5001`.

### 2. 前端设置 (React)
启动主应用程序。

```bash
# 安装依赖
npm install

# 运行应用
npm run dev
```
> 应用运行在 `http://localhost:5173`.

### 3. 本地 Ollama 设置 (可选)
使用本地 AI 模型时，必须启用 CORS 启动 Ollama，以允许浏览器连接。

```bash
# 首先停止任何正在运行的 Ollama 实例
# 然后运行:
OLLAMA_ORIGINS="*" ollama serve
```

## 🛠️ 使用指南

### AI 提供商
- **Gemini**: 需要在 UI 中（或 `.env` 配置中）输入有效的 API Key。
- **Ollama**: 
    1. 确保 Ollama 已使用 `OLLAMA_ORIGINS="*" ` 启动。
    2. 在“创建”或“重建”模态框中，点击 **设置** (齿轮) 图标。
    3. 选择 "Ollama"。
    4. 点击 **刷新** 图标以发现已安装的模型。

### 管理员功能
要从服务器画廊中删除模型：
1. 打开 **服务器画廊** (云图标)。
2. 点击标题栏中的 **锁** 图标。
3. 输入密码: **`admin123`**。
4. 使用模型卡片上的 **垃圾桶** 图标进行删除。

## 📦 技术栈
- **前端**: React, TypeScript, Vite, Three.js (Fiber), Lucide React
- **后端**: Flask
- **AI**: Google Gemini API, Ollama (Local LLM)
