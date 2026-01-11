/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useRef, useState } from 'react';
import { VoxelEngine } from './services/VoxelEngine';
import { UIOverlay } from './components/UIOverlay';
import { JsonModal } from './components/JsonModal';
import { PromptModal } from './components/PromptModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ServerModelModal } from './components/ServerModelModal';
import { UploadModal } from './components/UploadModal';
import { HelpModal } from './components/HelpModal';
import { api } from './services/api';
import { Generators } from './utils/voxelGenerators';
import { AppState, VoxelData, SavedModel, GenConfig } from './types';
import { llm } from './services/llm';
import { TRANSLATIONS, Language } from './utils/translations';

const App: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<VoxelEngine | null>(null);

    const [appState, setAppState] = useState<AppState>(AppState.STABLE);
    const [voxelCount, setVoxelCount] = useState<number>(0);

    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
    const [jsonModalMode, setJsonModalMode] = useState<'view' | 'import'>('view');

    const [isServerModalOpen, setIsServerModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const [promptMode, setPromptMode] = useState<'create' | 'morph'>('create');

    const [showWelcome, setShowWelcome] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const [jsonData, setJsonData] = useState('');
    const [isAutoRotate, setIsAutoRotate] = useState(true);

    // --- State for Custom Models ---
    const [currentBaseModel, setCurrentBaseModel] = useState<string>('Eagle');
    const [customBuilds, setCustomBuilds] = useState<SavedModel[]>([]);
    const [customRebuilds, setCustomRebuilds] = useState<SavedModel[]>([]);

    // --- Language State ---
    const [language, setLanguage] = useState<Language>('zh');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Engine
        const engine = new VoxelEngine(
            containerRef.current,
            (newState) => setAppState(newState),
            (count) => setVoxelCount(count)
        );

        engineRef.current = engine;

        // Initial Model Load
        engine.loadInitialModel(Generators.Eagle());

        // Resize Listener
        const handleResize = () => engine.handleResize();
        window.addEventListener('resize', handleResize);

        // Auto-hide welcome screen after interaction
        const timer = setTimeout(() => setShowWelcome(false), 5000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
            engine.cleanup();
        };
    }, []);

    const handleDismantle = () => {
        engineRef.current?.dismantle();
    };

    const handleNewScene = (type: 'Eagle') => {
        const generator = Generators[type];
        if (generator && engineRef.current) {
            engineRef.current.loadInitialModel(generator());
            setCurrentBaseModel('Eagle');
        }
    };

    const handleSelectCustomBuild = (model: SavedModel) => {
        if (engineRef.current) {
            engineRef.current.loadInitialModel(model.data);
            setCurrentBaseModel(model.name);
        }
    };

    const handleRebuild = (type: 'Eagle' | 'Cat' | 'Rabbit' | 'Twins') => {
        const generator = Generators[type];
        if (generator && engineRef.current) {
            engineRef.current.rebuild(generator());
        }
    };

    const handleSelectCustomRebuild = (model: SavedModel) => {
        if (engineRef.current) {
            engineRef.current.rebuild(model.data);
        }
    };

    const handleShowJson = () => {
        if (engineRef.current) {
            setJsonData(engineRef.current.getJsonData());
            setJsonModalMode('view');
            setIsJsonModalOpen(true);
        }
    };

    const handleImportClick = () => {
        setJsonModalMode('import');
        setIsJsonModalOpen(true);
    };

    const handleJsonImport = (jsonStr: string) => {
        try {
            const rawData = JSON.parse(jsonStr);
            if (!Array.isArray(rawData)) throw new Error("JSON must be an array");

            const voxelData: VoxelData[] = rawData.map((v: any) => {
                let colorVal = v.c || v.color;
                let colorInt = 0xCCCCCC;

                if (typeof colorVal === 'string') {
                    if (colorVal.startsWith('#')) colorVal = colorVal.substring(1);
                    colorInt = parseInt(colorVal, 16);
                } else if (typeof colorVal === 'number') {
                    colorInt = colorVal;
                }

                return {
                    x: Number(v.x) || 0,
                    y: Number(v.y) || 0,
                    z: Number(v.z) || 0,
                    color: isNaN(colorInt) ? 0xCCCCCC : colorInt
                };
            });

            if (engineRef.current) {
                engineRef.current.loadInitialModel(voxelData);
                setCurrentBaseModel('Imported Build');
            }
        } catch (e) {
            console.error("Failed to import JSON", e);
            alert(TRANSLATIONS[language].alertImportFail);
        }
    };

    const openPrompt = (mode: 'create' | 'morph') => {
        setPromptMode(mode);
        setIsPromptModalOpen(true);
    }

    const handleToggleRotation = () => {
        const newState = !isAutoRotate;
        setIsAutoRotate(newState);
        if (engineRef.current) {
            engineRef.current.setAutoRotate(newState);
        }
    }

    const handlePromptSubmit = async (prompt: string, config: GenConfig) => {
        config.apiKey = process.env.API_KEY; // Inject API Key if using Gemini

        setIsGenerating(true);
        // Close modal immediately so we can show the main loading indicator
        setIsPromptModalOpen(false);

        try {
            const contextColors = engineRef.current ? engineRef.current.getUniqueColors() : [];
            const voxelData = await llm.generate(prompt, promptMode, config, contextColors);

            if (engineRef.current) {
                if (promptMode === 'create') {
                    engineRef.current.loadInitialModel(voxelData);
                    setCustomBuilds(prev => [...prev, { name: prompt, data: voxelData }]);
                    setCurrentBaseModel(prompt);
                } else {
                    engineRef.current.rebuild(voxelData);
                    // Store baseModel to scope this rebuild to the current scene
                    setCustomRebuilds(prev => [...prev, {
                        name: prompt,
                        data: voxelData,
                        baseModel: currentBaseModel
                    }]);
                }
            }
        } catch (err) {
            console.error("Generation failed", err);
            alert(TRANSLATIONS[language].alertGenFail);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUploadToServer = () => {
        setIsUploadModalOpen(true);
    };

    const handleConfirmUpload = async (name: string) => {
        if (!engineRef.current) return;

        const jsonData = engineRef.current.getJsonData();
        const voxels = JSON.parse(jsonData);
        const snapshot = engineRef.current.getSnapshot();

        try {
            const voxelData: VoxelData[] = voxels.map((v: any) => {
                let colorInt = 0xCCCCCC;
                if (v.c && typeof v.c === 'string' && v.c.startsWith('#')) {
                    colorInt = parseInt(v.c.substring(1), 16);
                }
                return {
                    x: v.x, y: v.y, z: v.z,
                    color: colorInt
                };
            });

            await api.uploadModel(name, voxelData, snapshot);
            // alert(TRANSLATIONS[language].uploadSuccess); // Modal handles loading/closing, maybe show toast?
            // For now, let's just update the current base model to the new name
            setCurrentBaseModel(name);
        } catch (e) {
            console.error("Upload failed", e);
            throw e; // Rethrow so modal can handle error if needed, or we alert here
            // Modal checks catch for errors, so rethrow is good if modal handles it.
            // Our modal just logs error. Let's alert here for safety or let modal handle?
            // Modal code: try { await onConfirm(name); onClose(); } catch (err) { console.error(err) }
            // So if we throw, modal catches and stops loading but stays open.
            alert(TRANSLATIONS[language].uploadFail);
            throw e;
        }
    };

    const handleSelectServerModel = async (id: string) => {
        try {
            const model = await api.getModel(id);
            setIsServerModalOpen(false);

            if (engineRef.current && model.data) {
                const voxelData: VoxelData[] = model.data.map((v: any) => ({
                    x: v.x,
                    y: v.y,
                    z: v.z,
                    color: v.color // API returns color as number from our upload transform
                }));

                engineRef.current.loadInitialModel(voxelData);
                setCurrentBaseModel(model.name);
            }
        } catch (e) {
            console.error("Failed to load model", e);
            alert("Failed to load model from server.");
        }
    };

    // Filter rebuilds to only show those relevant to the current base model
    const relevantRebuilds = customRebuilds.filter(
        r => r.baseModel === currentBaseModel
    );

    const handleRestore = () => {
        if (engineRef.current) {
            engineRef.current.restoreOriginal();
        }
    };

    return (
        <div className="relative w-full h-screen bg-[#f0f2f5] overflow-hidden">
            {/* 3D Container */}
            <div ref={containerRef} className="absolute inset-0 z-0" />

            {/* UI Overlay */}
            <UIOverlay
                voxelCount={voxelCount}
                appState={appState}
                currentBaseModel={currentBaseModel}
                customBuilds={customBuilds}
                customRebuilds={relevantRebuilds}
                isAutoRotate={isAutoRotate}
                isInfoVisible={showWelcome}
                isGenerating={isGenerating}
                language={language}
                onDismantle={handleDismantle}
                onRebuild={handleRebuild}
                onRestore={handleRestore}
                onNewScene={handleNewScene}
                onSelectCustomBuild={handleSelectCustomBuild}
                onSelectCustomRebuild={handleSelectCustomRebuild}
                onPromptCreate={() => openPrompt('create')}
                onPromptMorph={() => openPrompt('morph')}
                onShowJson={handleShowJson}
                onImportJson={handleImportClick}
                onUpload={handleUploadToServer}
                onBrowseServer={() => setIsServerModalOpen(true)}
                onToggleRotation={handleToggleRotation}
                onToggleInfo={() => setShowWelcome(!showWelcome)}
                onToggleLanguage={toggleLanguage}
            />

            {/* Modals & Screens */}

            <WelcomeScreen visible={showWelcome} language={language} />

            <JsonModal
                isOpen={isJsonModalOpen}
                onClose={() => setIsJsonModalOpen(false)}
                data={jsonData}
                isImport={jsonModalMode === 'import'}
                onImport={handleJsonImport}
                language={language}
            />

            <ServerModelModal
                isOpen={isServerModalOpen}
                onClose={() => setIsServerModalOpen(false)}
                onSelectModel={handleSelectServerModel}
                language={language}
            />

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onConfirm={handleConfirmUpload}
                initialName={currentBaseModel}
                language={language}
            />

            <PromptModal
                isOpen={isPromptModalOpen}
                mode={promptMode}
                onClose={() => setIsPromptModalOpen(false)}
                onSubmit={handlePromptSubmit}
                language={language}
            />

            <HelpModal
                isOpen={showWelcome}
                onClose={() => setShowWelcome(false)}
                language={language}
            />
        </div>
    );
};

export default App;