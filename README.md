# Voxel Toy Box

**Voxel Toy Box** is an interactive, AI-powered voxel art playground. Generate 3D models using text prompts, dismantle them physics-style, and watch AI rebuild them into new shapes!

[English](./README.md) | [中文](./README_zh.md)

</div>

## ✨ Key Features

- **AI Voxel Generation**: 
    - **Google Gemini**: High-speed cloud generation.
    - **Local Ollama**: Privacy-focused local generation with support for models like `llama3`, `mistral`, etc.
    - **Model Discovery**: Automatically fetch and select available Ollama models.
- **Interactive Physics**: unexpected "Dismantle" physics effects.
- **AI Morphing**: Rebuild your scattered voxels into completely new objects while preserving the color palette.
- **Model Gallery**: 
    - Browse community models stored on the server.
    - Upload your creations.
    - **Admin Mode**: Manage and delete models directly from the UI.
- **Multi-Language**: Full support for English and Chinese.

## 🚀 Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- [Ollama](https://ollama.com/) (Optional, for local AI)

### 1. Backend Setup (Flask)
Start the Python backend server for model storage.

```bash
# Create virtual env (optional but recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install flask flask-cors

# Run the server
python server/app.py
```
> The server runs on `http://localhost:5001`.

### 2. Frontend Setup (React)
Start the main application.

```bash
# Install dependencies
npm install

# Run the app
npm run dev
```
> The app runs on `http://localhost:5173`.

### 3. Local Ollama Setup (Optional)
To use local AI models, you must start Ollama with CORS enabled to allow the browser to connect.

```bash
# Stop any running Ollama instance first
# Then run:
OLLAMA_ORIGINS="*" ollama serve
```

## 🛠️ Usage Guide

### AI Providers
- **Gemini**: Requires a valid API Key in the UI (or `.env` if configured).
- **Ollama**: 
    1. Ensure Ollama is running with `OLLAMA_ORIGINS="*"`.
    2. In the "Create" or "Rebuild" modal, click the **Settings** (gear) icon.
    3. Select "Ollama".
    4. Click the **Refresh** icon to discover your installed models.

### Admin Features
To delete models from the server gallery:
1. Open the **Server Gallery** (Cloud icon).
2. Click the **Lock** icon in the header.
3. Enter password: **`admin123`**.
4. Use the **Trash** icon on model cards to delete them.

## 📦 Tech Stack
- **Frontend**: React, TypeScript, Vite, Three.js (Fiber), Lucide React
- **Backend**: Flask
- **AI**: Google Gemini API, Ollama (Local LLM)
