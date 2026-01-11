import { VoxelData } from '../types';

const API_BASE_URL = 'http://localhost:5002/api';

export interface ServerModelInfo {
    id: string;
    name: string;
    voxel_count: number;
    thumbnail?: string;
    timestamp: number;
}

export interface ServerModelDetail {
    name: string;
    data: VoxelData[];
    created_at: number;
}

export const api = {
    async listModels(): Promise<ServerModelInfo[]> {
        const res = await fetch(`${API_BASE_URL}/models`);
        if (!res.ok) throw new Error('Failed to fetch models');
        return res.json();
    },

    async getModel(id: string): Promise<ServerModelDetail> {
        const res = await fetch(`${API_BASE_URL}/models/${id}`);
        if (!res.ok) throw new Error('Failed to fetch model');
        return res.json();
    },

    async uploadModel(name: string, data: VoxelData[], thumbnail?: string): Promise<{ success: boolean, id: string }> {
        const res = await fetch(`${API_BASE_URL}/models`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, data, thumbnail })
        });
        if (!res.ok) throw new Error('Failed to upload model');
        return res.json();
    },

    async deleteModel(id: string): Promise<boolean> {
        const res = await fetch(`${API_BASE_URL}/models/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete model');
        return true;
    }
};
