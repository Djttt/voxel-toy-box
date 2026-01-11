/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type Language = 'en' | 'zh';

export const TRANSLATIONS = {
  en: {
    // UIOverlay
    builds: "Builds",
    newBuilds: "NEW BUILDS",
    yourCreations: "YOUR CREATIONS",
    importJson: "Import JSON",
    voxels: "Voxels",
    info: "Help",
    pauseCam: "Pause Cam",
    playCam: "Play Cam",
    share: "Share",
    break: "BREAK",
    rebuild: "Rebuild",
    rebuildMenu: "REBUILD",
    customRebuilds: "CUSTOM REBUILDS",
    newBuild: "New build",
    newRebuild: "AI Morph",
    restoreOriginal: "Restore Original",
    eagle: "Eagle",
    cat: "Cat",
    rabbit: "Rabbit",
    twins: "Eagles x2",
    langName: "中文", // Label to switch TO
    // Loading
    loadingMessages: [
      "Crafting voxels...",
      "Designing structure...",
      "Calculating physics...",
      "Mixing colors...",
      "Assembling geometry...",
      "Applying polish..."
    ],
    geminiBuilding: "Gemini is Building...",
    // WelcomeScreen
    title: "Voxel Toy Box",
    poweredBy: "Powered by Gemini 3",
    feature1: "Build amazing voxel models",
    feature2: "Break them down and rebuild them",
    feature3: "Share your creations with friends",
    // PromptModal
    createTitle: "New Build",
    rebuildTitle: "Rebuild blocks",
    createPrompt: "What new creation should we build?",
    rebuildPrompt: "How should we rebuild the current voxels?",
    createPlaceholder: "e.g., A medieval castle, a giant robot, a fruit basket...",
    rebuildPlaceholder: "e.g., Turn it into a car, make a pyramid, build a smiley face...",
    thinking: "Thinking...",
    generate: "Generate",
    error: "The magic failed! Please try again.",
    poweredByGemini: "POWERED BY GEMINI 3",
    // JsonModal
    importTitle: "Import Blueprint",
    shareTitle: "Copy and share your model",
    jsonFormat: "JSON Format",
    pasteLabel: "Paste your voxel JSON data here...",
    cancel: "Cancel",
    importBuild: "Import Build",
    emptyJson: "Please paste JSON data first.",
    // App Alerts
    alertGenFail: "Oops! Something went wrong generating the model.",
    alertImportFail: "Invalid JSON format. Please check your data.",
    // Server
    server: "Server",
    uploadToServer: "Upload to Server",
    browseServer: "Browse Server",
    enterModelName: "Enter model name:",
    uploadSuccess: "Uploaded successfully!",
    uploadFail: "Failed to upload model.",
    loadFail: "Failed to load model from server.",
    serverModels: "Server Models",
    browseLoad: "Browse & Load",
    loadingLibrary: "Loading Library...",
    noModels: "No models found on server.",
    // UploadModal
    uploadTitle: "Save to Cloud",
    modelName: "Model Name",
    namePlaceholder: "e.g., Cool Spaceship",
    uploadBtn: "Upload",
    uploading: "Uploading...",
    searchPlaceholder: "Search models...",
    // PromptModal
    aiProvider: "AI Provider",
    providerGemini: "Google Gemini",
    providerOllama: "Ollama (Local)",
    ollamaUrl: "Ollama URL",
    ollamaModel: "Model Name",
    apiKeyMissing: "API Key Missing",
    invalidUrl: "Invalid URL",
    // HelpModal
    helpTitle: "Documentation & Help",
    helpExternalTitle: "Generate Elsewhere",
    helpExternalDesc: "Use this prompt on any other AI site (ChatGPT, Gemini, etc.) to generate models, then copy the JSON response and import it here using the 'Import JSON' button.",
    helpOllamaTitle: "Local Ollama Setup",
    helpOllamaDesc: "To allow this app to connect to your local Ollama instance, you must start the server with CORS allowed:",
    close: "Close"
  },
  zh: {
    // UIOverlay
    builds: "模型库",
    newBuilds: "新建模型",
    yourCreations: "你的创作",
    importJson: "导入 JSON",
    voxels: "体素",
    info: "帮助",
    pauseCam: "暂停",
    playCam: "播放",
    share: "分享",
    break: "拆解",
    rebuild: "重组",
    rebuildMenu: "重组选项",
    customRebuilds: "自定义重组",
    newBuild: "新创作",
    newRebuild: "AI 变形",
    restoreOriginal: "复原及重组",
    eagle: "老鹰",
    cat: "猫咪",
    rabbit: "兔子",
    twins: "双鹰",
    langName: "English", // Label to switch TO
    // Loading
    loadingMessages: [
      "正在制作体素...",
      "正在设计结构...",
      "正在计算物理...",
      "正在混合颜色...",
      "正在组装几何体...",
      "正在打磨细节..."
    ],
    geminiBuilding: "Gemini 正在构建...",
    // WelcomeScreen
    title: "体素玩具盒",
    poweredBy: "由 Gemini 3 驱动",
    feature1: "构建惊人的体素模型",
    feature2: "拆解并重新组合它们",
    feature3: "与朋友分享你的创作",
    // PromptModal
    createTitle: "新建模型",
    rebuildTitle: "重组方块",
    createPrompt: "我们应该建造什么新东西？",
    rebuildPrompt: "我们应该如何重组当前的体素？",
    createPlaceholder: "例如：中世纪城堡，巨型机器人，水果篮...",
    rebuildPlaceholder: "例如：把它变成一辆车，做一个金字塔，造一个笑脸...",
    thinking: "思考中...",
    generate: "生成",
    error: "魔法失败了！请重试。",
    poweredByGemini: "由 Gemini 3 驱动",
    // JsonModal
    importTitle: "导入蓝图",
    shareTitle: "复制并分享你的模型",
    jsonFormat: "JSON 格式",
    pasteLabel: "在此粘贴体素 JSON 数据...",
    cancel: "取消",
    importBuild: "导入构建",
    emptyJson: "请先粘贴 JSON 数据。",
    // App Alerts
    alertImportFail: "无法导入 JSON。请确保格式正确。",
    alertGenFail: "哎呀！生成模型时出了点问题。",
    // Server
    server: "服务器",
    uploadToServer: "上传到服务器",
    browseServer: "浏览服务器",
    enterModelName: "请输入模型名称：",
    uploadSuccess: "上传成功！",
    uploadFail: "上传模型失败。",
    loadFail: "从服务器加载模型失败。",
    serverModels: "服务器模型",
    browseLoad: "浏览与加载",
    loadingLibrary: "正在加载库...",
    noModels: "服务器上没有找到模型。",
    // UploadModal
    uploadTitle: "保存到云端",
    modelName: "模型名称",
    namePlaceholder: "例如：炫酷飞船",
    uploadBtn: "上传",
    uploading: "正在上传...",
    searchPlaceholder: "搜索模型...",
    // PromptModal
    aiProvider: "AI 提供商",
    providerGemini: "Google Gemini",
    providerOllama: "Ollama (本地)",
    ollamaUrl: "Ollama 地址",
    ollamaModel: "模型名称",
    apiKeyMissing: "缺少 API Key",
    invalidUrl: "无效的 URL",
    // HelpModal
    helpTitle: "文档与帮助",
    helpExternalTitle: "在其他地方生成",
    helpExternalDesc: "在其他 AI 网站（ChatGPT, Gemini 等）上使用此提示词生成模型，然后复制 JSON 响应并使用“导入数据”按钮导入。",
    helpOllamaTitle: "本地 Ollama 设置",
    helpOllamaDesc: "为了允许此应用连接到您的本地 Ollama 实例，您必须允许跨域请求 (CORS) 并启动服务器：",
    close: "关闭"
  }
};
