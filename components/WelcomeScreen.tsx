/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface WelcomeScreenProps {
  visible: boolean;
  language: Language;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ visible, language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className={`
        absolute top-24 left-0 w-full pointer-events-none flex justify-center z-10 select-none
        transition-all duration-500 ease-out transform font-sans
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
    `}>
      <div className="text-center flex flex-col items-center gap-4 bg-slate-50/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 shadow-lg">
        <div>
            <h1 className="text-4xl font-black text-slate-800 uppercase tracking-widest mb-2">
                {t.title}
            </h1>
            <div className="text-sm font-extrabold text-indigo-600 uppercase tracking-[0.3em]">
                {t.poweredBy}
            </div>
        </div>
        
        <div className="space-y-3 mt-2">
            <p className="text-lg font-bold text-slate-700">{t.feature1}</p>
            <p className="text-lg font-bold text-slate-700">{t.feature2}</p>
            <p className="text-lg font-bold text-slate-700">{t.feature3}</p>
        </div>
      </div>
    </div>
  );
};
