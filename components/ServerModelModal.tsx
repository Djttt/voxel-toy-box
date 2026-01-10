import React, { useEffect, useState } from 'react';
import { X, Server, Download, Calendar, Box, Search } from 'lucide-react';
import { api, ServerModelInfo } from '../services/api';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ServerModelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectModel: (id: string) => void;
    language: Language;
}

export const ServerModelModal: React.FC<ServerModelModalProps> = ({
    isOpen,
    onClose,
    onSelectModel,
    language
}) => {
    const [models, setModels] = useState<ServerModelInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const t = TRANSLATIONS[language];

    useEffect(() => {
        if (isOpen) {
            loadModels();
            setSearchTerm('');
        }
    }, [isOpen]);

    const loadModels = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.listModels();
            setModels(data);
        } catch (err) {
            setError(t.loadFail); // Use translation
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredModels = models.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white/95 backdrop-blur-md w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] border border-white/20">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/50 gap-4">
                    <div className="flex items-center gap-4 text-slate-800 shrink-0">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                            <Server size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">{t.serverModels}</h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{t.browseLoad}</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-100/50 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-20"></div>
                                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">{t.loadingLibrary}</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-rose-500 gap-2">
                            <div className="bg-rose-100 p-3 rounded-full">
                                <X size={32} />
                            </div>
                            <div className="font-bold">{error}</div>
                        </div>
                    ) : filteredModels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                            <Search size={48} strokeWidth={1.5} className="opacity-50" />
                            <div className="font-bold">{t.noModels}</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredModels.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => onSelectModel(model.id)}
                                    className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:ring-4 hover:ring-indigo-500/10 transition-all text-left relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 duration-300"
                                >
                                    {/* Card Header */}
                                    <div className="p-5 flex flex-col gap-1 z-10 w-full">
                                        <div className="flex justify-between items-start w-full">
                                            <span className="font-extrabold text-lg text-slate-700 group-hover:text-indigo-600 truncate pr-2 w-full transition-colors">
                                                {model.name}
                                            </span>
                                        </div>

                                        {/* Metadata Badges */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                <Box size={12} strokeWidth={2.5} />
                                                <span>{model.voxel_count || '?'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                                                <Calendar size={12} strokeWidth={2.5} />
                                                <span>{new Date(model.timestamp * 1000).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center z-10 group-hover:bg-indigo-50/50 transition-colors">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-400 transition-colors">#{model.id.substring(0, 8)}...</span>
                                        <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600 group-hover:bg-indigo-100 transition-all shadow-sm">
                                            <Download size={14} strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    {/* Thumbnail or Placeholder */}
                                    {model.thumbnail ? (
                                        <div className="absolute top-0 right-0 h-full w-1/2 -z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none">
                                            <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover mask-image-linear-to-l" style={{ maskImage: 'linear-gradient(to left, black, transparent)' }} />
                                        </div>
                                    ) : (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-[100px] -z-0 opacity-50 group-hover:scale-110 group-hover:from-indigo-50 group-hover:to-violet-50 transition-transform duration-500 pointer-events-none" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-between items-center">
                    <div className="text-xs font-bold text-slate-400">
                        {filteredModels.length} {filteredModels.length === 1 ? 'Model' : 'Models'} Available
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors bg-slate-50"
                    >
                        {t.close}
                    </button>
                </div>

            </div>
        </div>
    );
};

