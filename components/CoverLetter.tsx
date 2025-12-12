import React, { useState } from 'react';
import { AppState, JobBrief } from '../types';
import { IconMagic, IconSparkles, IconChevronDown } from './ui/Icons';
import { analyzeJobDescription, generateCoverLetter } from '../services/geminiService';

interface CoverLetterProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const TONE_OPTIONS: JobBrief['tone'][] = [
    'Professional',
    'Relaxed',
    'Corporate',
    'Light Hearted',
    'Technical',
    'Founder',
    'Formal',
    'Punchy'
];

const CoverLetter: React.FC<CoverLetterProps> = ({ appState, setAppState }) => {
  const [jdText, setJdText] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<JobBrief['tone']>('Professional');

  const handleAnalyzeAndGenerate = async () => {
    if (!jdText) return;
    setLoading(true);

    // 1. Analyze JD
    const analysis = await analyzeJobDescription(jdText);
    
    // 2. Update Job Brief State
    const newBrief: JobBrief = {
        id: 'new-job',
        roleTitle: analysis.roleTitle || 'Role',
        companyName: analysis.companyName || 'Company',
        rawDescription: jdText,
        extractedKeywords: analysis.extractedKeywords || [],
        seniority: analysis.seniority || 'Mid',
        tone: selectedTone
    };

    setAppState(prev => ({ ...prev, jobBrief: newBrief }));

    // 3. Generate Letter
    const letter = await generateCoverLetter(appState.profile, newBrief);
    setGeneratedLetter(letter);
    setLoading(false);
  };

  return (
    <div className="flex h-full">
      {/* Input Side */}
      <div className="w-1/2 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-serif font-semibold text-slate-900">Job Context</h2>
            <p className="text-xs text-slate-500">Paste the job description to tailor your application</p>
        </div>
        <div className="flex-1 p-6 flex flex-col gap-4">
            <textarea
                placeholder="Paste Job Description here..."
                className="flex-1 w-full bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none resize-none shadow-sm"
                value={jdText}
                onChange={e => setJdText(e.target.value)}
            />
            
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Writing Style</label>
                <div className="relative">
                    <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value as JobBrief['tone'])}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none transition-all shadow-sm hover:border-slate-300 cursor-pointer"
                    >
                        {TONE_OPTIONS.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                        <IconChevronDown size={16} />
                    </div>
                </div>
            </div>

            <button 
                onClick={handleAnalyzeAndGenerate}
                disabled={loading || !jdText}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-sm font-medium flex justify-center items-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-900/10 mt-2"
            >
                {loading ? (
                    <span className="animate-pulse">Analyzing & Drafting...</span>
                ) : (
                    <>
                        <IconMagic /> Analyze & Draft Letter
                    </>
                )}
            </button>
        </div>
      </div>

      {/* Output Side */}
      <div className="w-1/2 bg-slate-50 p-8 flex flex-col items-center overflow-y-auto">
        {generatedLetter ? (
            <div className="w-full max-w-lg bg-white shadow-xl p-10 min-h-[500px] animate-in slide-in-from-bottom-4 duration-500 rounded-sm">
                <div className="mb-8 text-right border-b border-slate-100 pb-4">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Application For</p>
                    <h3 className="font-serif text-lg text-slate-900">{appState.jobBrief?.roleTitle}</h3>
                    <p className="text-sm text-slate-500 font-medium">{appState.jobBrief?.companyName}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 uppercase tracking-wide">
                        {appState.jobBrief?.tone} Style
                    </div>
                </div>
                
                <div className="prose prose-sm prose-slate font-serif leading-relaxed whitespace-pre-line text-slate-800">
                    {generatedLetter}
                </div>
            </div>
        ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-slate-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <IconSparkles size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-400">Ready to draft your application</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetter;