
import React, { useState } from 'react';
import { X, Copy, Terminal, ExternalLink, Check } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, language }) => {
    const t = TRANSLATIONS[language];
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedCmd, setCopiedCmd] = useState(false);

    if (!isOpen) return null;

    const basePrompt = `Task: Generate a 3D voxel art model of: "[YOUR PROMPT]".

Strict Rules:
1. Use approximately 150 to 600 voxels.
2. The model must be centered at x=0, z=0.
3. The bottom of the model must be at y=0 or slightly higher.
4. Ensure the structure is physically plausible (connected).
5. Coordinates should be integers.

Return ONLY a JSON array of objects in this format:
[
  {"x": 0, "y": 0, "z": 0, "color": "#FF0000"}
]`;

    const ollamaCmd = `OLLAMA_ORIGINS="*" ollama serve`;

    const handleCopy = (text: string, setFn: (v: boolean) => void) => {
        navigator.clipboard.writeText(text);
        setFn(true);
        setTimeout(() => setFn(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/50 max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white/50 backdrop-blur">
                    <h2 className="text-2xl font-black text-slate-800">{t.helpTitle}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Section 1: External Generation */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <ExternalLink size={20} />
                            <h3 className="text-lg font-bold uppercase tracking-wide">{t.helpExternalTitle}</h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {t.helpExternalDesc}
                        </p>

                        <div className="relative group">
                            <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-slate-800">
                                {basePrompt}
                            </pre>
                            <button
                                onClick={() => handleCopy(basePrompt, setCopiedPrompt)}
                                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
                                title="Copy Prompt"
                            >
                                {copiedPrompt ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Section 2: Ollama Setup */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-rose-600">
                            <Terminal size={20} />
                            <h3 className="text-lg font-bold uppercase tracking-wide">{t.helpOllamaTitle}</h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {t.helpOllamaDesc}
                        </p>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between gap-4">
                            <code className="text-amber-900 font-mono font-bold text-sm select-all">
                                {ollamaCmd}
                            </code>
                            <button
                                onClick={() => handleCopy(ollamaCmd, setCopiedCmd)}
                                className="shrink-0 p-2 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors"
                            >
                                {copiedCmd ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-transform active:scale-[0.98]"
                    >
                        {t.close}
                    </button>
                </div>

            </div>
        </div>
    );
};
