import React, { useState } from 'react';
import { Upload, X, Cloud, Loader2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string) => Promise<void>;
    initialName?: string;
    language: Language;
}

export const UploadModal: React.FC<UploadModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialName = '',
    language
}) => {
    const [name, setName] = useState(initialName);
    const [loading, setLoading] = useState(false);
    const t = TRANSLATIONS[language];

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await onConfirm(name);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3 text-slate-800">
                        <div className="bg-sky-100 p-2 rounded-xl text-sky-600">
                            <Cloud size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{t.uploadTitle}</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                            {t.modelName}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t.namePlaceholder}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                            autoFocus
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 active:translate-y-0.5 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>{t.uploading}</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    <span>{t.uploadBtn}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};
