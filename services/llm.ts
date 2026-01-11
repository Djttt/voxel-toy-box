import { GoogleGenAI, Type } from "@google/genai";
import { VoxelData, GenConfig } from "../types";

const SYSTEM_CONTEXT_CREATE = `
CONTEXT: You are creating a brand new voxel art scene from scratch.
Be creative with colors.
`;

const SYSTEM_CONTEXT_MORPH = (colors: string) => `
CONTEXT: You are re-assembling an existing pile of lego-like voxels.
The current pile consists of these colors: [${colors}].
TRY TO USE THESE COLORS if they fit the requested shape.
If the requested shape absolutely requires different colors, you may use them, but prefer the existing palette to create a "rebuilding" effect.
The model should be roughly the same volume as the previous one.
`;

const BASE_PROMPT = (prompt: string) => `
Task: Generate a 3D voxel art model of: "${prompt}".

Strict Rules:
1. Use approximately 150 to 600 voxels.
2. The model must be centered at x=0, z=0.
3. The bottom of the model must be at y=0 or slightly higher.
4. Ensure the structure is physically plausible (connected).
5. Coordinates should be integers.

Return ONLY a JSON array of objects.
`;

export const llm = {
    async generate(prompt: string, mode: 'create' | 'morph', config: GenConfig, contextColors: string[] = []): Promise<VoxelData[]> {
        const systemContext = mode === 'morph' ? SYSTEM_CONTEXT_MORPH(contextColors.join(', ')) : SYSTEM_CONTEXT_CREATE;
        const fullPrompt = `${systemContext}\n${BASE_PROMPT(prompt)}`;

        if (config.provider === 'gemini') {
            return generateWithGemini(fullPrompt, config.apiKey || '');
        } else {
            return generateWithOllama(fullPrompt, config);
        }
    },

    async listModels(baseUrl: string): Promise<string[]> {
        const url = `${baseUrl}/api/tags`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
            const data = await res.json();
            return data.models.map((m: any) => m.name);
        } catch (err) {
            console.error("Failed to fetch models", err);
            throw err;
        }
    }
};

async function generateWithGemini(prompt: string, apiKey: string): Promise<VoxelData[]> {
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        x: { type: Type.INTEGER },
                        y: { type: Type.INTEGER },
                        z: { type: Type.INTEGER },
                        color: { type: Type.STRING, description: "Hex color code e.g. #FF5500" }
                    },
                    required: ["x", "y", "z", "color"]
                }
            }
        }
    });

    if (response.text) {
        return parseVoxelJson(response.text);
    }
    throw new Error("No response from Gemini");
}

async function generateWithOllama(prompt: string, config: GenConfig): Promise<VoxelData[]> {
    const url = `${config.ollamaUrl || 'http://172.23.252.114:11434'}/api/chat`;
    const model = config.ollamaModel || 'gemini-3-flash-preview:cloud';

    // Ollama might not support JSON schema enforcement as strictly as Gemini, 
    // so we emphasize JSON in the prompt.
    // However, recent Ollama versions support 'format': 'json'.

    const body = {
        model: model,
        messages: [
            { role: 'user', content: prompt + "\n\nIMPORTANT: Return ONLY valid JSON array. No markdown, no explanations." }
        ],
        stream: false,
        format: 'json'
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`Ollama error: ${res.statusText}`);
        }

        const data = await res.json();
        const content = data.message?.content;

        if (content) {
            return parseVoxelJson(content);
        }
        throw new Error("No content in Ollama response");
    } catch (err) {
        console.error("Ollama API call failed", err);
        throw err;
    }
}

function parseVoxelJson(jsonStr: string): VoxelData[] {
    try {
        // Handle potential markdown wrapping
        const cleaned = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const rawData = JSON.parse(cleaned);

        if (!Array.isArray(rawData)) throw new Error("Response is not an array");

        return rawData.map((v: any) => {
            let colorStr = v.color;
            if (colorStr && colorStr.startsWith('#')) colorStr = colorStr.substring(1);
            const colorInt = parseInt(colorStr, 16);

            return {
                x: Number(v.x),
                y: Number(v.y),
                z: Number(v.z),
                color: isNaN(colorInt) ? 0xCCCCCC : colorInt
            };
        });
    } catch (e) {
        console.error("Failed to parse JSON", e);
        throw new Error("Invalid JSON response from AI");
    }
}
