import React, { useState, useCallback, useEffect } from 'react';
import { CareerProfile, AppState, Tone, TemplateId } from './types';
import Editor from './components/Editor';
import ResumePreview from './components/ResumePreview';
import CoverLetter from './components/CoverLetter';
import { 
  IconFile, IconBriefcase, IconLayout, IconDownload, IconUpload, IconX, IconMagic, IconLinkedin,
  IconSave, IconMaximize, IconMinimize, IconGrid, IconCheck, IconMore, IconFileCode, IconFile as IconHtml
} from './components/ui/Icons';
import { parseResumeFromText, extractInsightsFromLinkedIn } from './services/geminiService';
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition, BorderStyle } from "docx";
import { renderToStaticMarkup } from 'react-dom/server';

// Mock Initial Data
const INITIAL_PROFILE: CareerProfile = {
  profileVersion: "1.0",
  basics: {
    name: "Alex Sterling",
    title: "Senior Product Engineer",
    location: "Sydney, AU",
    email: "alex.sterling@example.com",
    phone: "+61 400 123 456",
    links: [{ label: "LinkedIn", url: "#" }, { label: "GitHub", url: "#" }]
  },
  summary: "Design-focused Product Engineer with 8+ years experience building scalable SaaS platforms. Specialist in React architectures and design systems. Proven track record of reducing technical debt by 40% while accelerating feature delivery speed.",
  experience: [
    {
      id: "exp-1",
      company: "Linear Orbital",
      role: "Senior Frontend Engineer",
      startDate: "2021",
      endDate: "Present",
      location: "Remote, AU",
      highlights: [
        { id: "h1", text: "Architected the core design system used by 20+ engineering squads, reducing UI shipping time by 30%." },
        { id: "h2", text: "Led the migration of legacy Redux state to React Query, improving application performance score from 65 to 98." },
        { id: "h3", text: "Mentored 4 junior developers through to mid-level promotion cycles." }
      ]
    },
    {
      id: "exp-2",
      company: "Atlassian",
      role: "Software Engineer II",
      startDate: "2018",
      endDate: "2021",
      location: "Sydney",
      highlights: [
        { id: "h4", text: "Developed key features for Jira Cloud next-gen projects using React and GraphQL." },
        { id: "h5", text: "Optimized CI/CD pipelines, cutting build times by 15 minutes per deploy." }
      ]
    }
  ],
  skills: [
    { name: "Languages", items: ["TypeScript", "JavaScript", "Rust", "Python"] },
    { name: "Frontend", items: ["React", "Next.js", "Tailwind", "Three.js"] },
    { name: "Infrastructure", items: ["AWS", "Terraform", "Docker"] }
  ],
  education: [
    { id: "edu-1", institution: "UNSW Sydney", degree: "Bachelor of Computer Science", year: "2017" }
  ],
  projects: [],
  certifications: [],
  publications: [],
  conferences: [],
  linkedinContext: ""
};

const App: React.FC = () => {
  // Main Application State
  const [appState, setAppState] = useState<AppState>({
    profile: INITIAL_PROFILE,
    jobBrief: null,
    activeView: 'editor',
    isGenerating: false,
    selectedTemplate: 'modern'
  });

  // History State for Undo/Redo
  const [history, setHistory] = useState<CareerProfile[]>([INITIAL_PROFILE]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modals & Processing States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [linkedinText, setLinkedinText] = useState('');
  const [isProcessingLinkedin, setIsProcessingLinkedin] = useState(false);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('careerProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setAppState(prev => ({ ...prev, profile: parsed }));
        setHistory([parsed]);
        setHistoryIndex(0);
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  // --- History Management ---
  const updateProfile = useCallback((newProfile: CareerProfile) => {
    setAppState(prev => ({ ...prev, profile: newProfile }));
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newProfile);
    if (newHistory.length > 50) newHistory.shift();

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setAppState(prev => ({ ...prev, profile: history[newIndex] }));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setAppState(prev => ({ ...prev, profile: history[newIndex] }));
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // --- Actions ---

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
        localStorage.setItem('careerProfile', JSON.stringify(appState.profile));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.profile, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `resume_profile_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadMarkdown = () => {
    const { profile } = appState;
    let md = `# ${profile.basics.name}\n\n`;
    md += `**${profile.basics.title}**\n\n`;
    md += `${profile.basics.location} • ${profile.basics.email} • ${profile.basics.phone}\n\n`;
    
    if (profile.basics.links.length > 0) {
        md += `${profile.basics.links.map(l => `[${l.label}](${l.url})`).join(' • ')}\n\n`;
    }

    if (profile.summary) {
        md += `## Summary\n\n${profile.summary}\n\n`;
    }

    if (profile.experience.length > 0) {
        md += `## Experience\n\n`;
        profile.experience.forEach(exp => {
            md += `### ${exp.role}\n`;
            md += `**${exp.company}** | ${exp.startDate} – ${exp.endDate} | ${exp.location}\n\n`;
            exp.highlights.forEach(hl => {
                md += `- ${hl.text}\n`;
            });
            md += `\n`;
        });
    }

    if (profile.education.length > 0) {
        md += `## Education\n\n`;
        profile.education.forEach(edu => {
            md += `**${edu.institution}**\n`;
            md += `${edu.degree}, ${edu.year}\n\n`;
        });
    }

    if (profile.skills.length > 0) {
        md += `## Skills\n\n`;
        profile.skills.forEach(grp => {
            md += `- **${grp.name}:** ${grp.items.join(', ')}\n`;
        });
        md += `\n`;
    }

    if (profile.projects && profile.projects.length > 0) {
        md += `## Projects\n\n`;
        profile.projects.forEach(proj => {
            md += `### ${proj.name}\n`;
            if (proj.url) md += `[Link](${proj.url})\n\n`;
            md += `${proj.description}\n\n`;
        });
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.basics.name.replace(/\s+/g, '_')}_Resume.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDOCX = async () => {
    const { profile } = appState;

    // Helper to create a section heading
    const createHeading = (text: string) => {
        return new Paragraph({
            text: text.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            border: {
                bottom: { color: "auto", space: 1, value: BorderStyle.SINGLE, size: 6 }
            },
            spacing: { before: 200, after: 100 },
        });
    };

    // Construct the document
    const doc = new DocxDocument({
        styles: {
            paragraphStyles: [
                {
                    id: "Normal",
                    name: "Normal",
                    run: { font: "Calibri", size: 22 }, // 11pt
                    paragraph: { spacing: { line: 240 } }, // 1.0 line spacing roughly
                },
                {
                    id: "Heading1",
                    name: "Heading 1",
                    run: { font: "Calibri", size: 48, bold: true }, // 24pt
                    paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 100 } },
                },
                {
                    id: "Heading2",
                    name: "Heading 2",
                    run: { font: "Calibri", size: 24, bold: true, allCaps: true }, // 12pt
                }
            ]
        },
        sections: [{
            children: [
                // Name
                new Paragraph({
                    text: profile.basics.name,
                    heading: HeadingLevel.HEADING_1,
                }),
                // Title
                new Paragraph({
                    text: profile.basics.title,
                    alignment: AlignmentType.CENTER,
                    run: { size: 28, color: "555555" }, // 14pt
                    spacing: { after: 200 },
                }),
                // Contact
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun(`${profile.basics.location} | ${profile.basics.email} | ${profile.basics.phone}`),
                        ...(profile.basics.links.length ? [new TextRun(` | ${profile.basics.links.map(l => l.label).join(' | ')}`)] : [])
                    ],
                    spacing: { after: 400 },
                }),

                // Summary
                ...(profile.summary ? [
                    createHeading("Professional Summary"),
                    new Paragraph({ text: profile.summary })
                ] : []),

                // Experience
                ...(profile.experience.length ? [
                    createHeading("Experience"),
                    ...profile.experience.flatMap(exp => [
                        new Paragraph({
                            children: [
                                new TextRun({ text: exp.company, bold: true, size: 24 }),
                                new TextRun({ 
                                    text: `\t${exp.location}  |  ${exp.startDate} – ${exp.endDate}`, 
                                    bold: false 
                                })
                            ],
                            tabStops: [
                                { type: TabStopType.RIGHT, position: TabStopPosition.MAX }
                            ],
                            spacing: { before: 100 }
                        }),
                        new Paragraph({
                            text: exp.role,
                            run: { italics: true, color: "333333" },
                            spacing: { after: 100 }
                        }),
                        ...exp.highlights.map(hl => new Paragraph({
                            text: hl.text,
                            bullet: { level: 0 }
                        }))
                    ])
                ] : []),

                // Education
                ...(profile.education.length ? [
                    createHeading("Education"),
                    ...profile.education.map(edu => new Paragraph({
                        children: [
                            new TextRun({ text: edu.institution, bold: true }),
                            new TextRun({ text: `\t${edu.year}` }),
                            new TextRun({ text: `\n${edu.degree}`, italics: true })
                        ],
                        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                        spacing: { before: 100, after: 100 }
                    }))
                ] : []),

                // Skills
                ...(profile.skills.length ? [
                    createHeading("Skills"),
                    ...profile.skills.map(skill => new Paragraph({
                        children: [
                            new TextRun({ text: `${skill.name}: `, bold: true }),
                            new TextRun(skill.items.join(", "))
                        ]
                    }))
                ] : []),

                 // Projects (Optional)
                ...(profile.projects && profile.projects.length ? [
                    createHeading("Projects"),
                    ...profile.projects.map(proj => new Paragraph({
                        children: [
                            new TextRun({ text: proj.name, bold: true }),
                            new TextRun(proj.url ? ` (${proj.url})` : ""),
                            new TextRun({ text: `\n${proj.description}` })
                        ],
                         spacing: { before: 100, after: 100 }
                    }))
                ] : []),
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.basics.name.replace(/\s+/g, "_")}_Resume.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    const htmlContent = renderToStaticMarkup(
        <ResumePreview profile={appState.profile} template={appState.selectedTemplate} />
    );
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appState.profile.basics.name} - Resume</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    },
                    colors: {
                        accent: {
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            500: '#0ea5e9',
                            600: '#0284c7',
                            900: '#0c4a6e',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-white p-8">
    <div class="max-w-[800px] mx-auto">
        ${htmlContent}
    </div>
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appState.profile.basics.name.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Ensure we are in a printable state. 
    // In strict print CSS, we hide the editor, so we just trigger print.
    window.print();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTemplateChange = (template: TemplateId) => {
    setAppState(prev => ({ ...prev, selectedTemplate: template }));
    setShowTemplateModal(false);
  };

  const handleImport = async () => {
    if (!importText.trim()) return;
    setIsParsing(true);
    const parsedData = await parseResumeFromText(importText);
    
    const existingLinkedinContext = appState.profile.linkedinContext;

    const newProfile: CareerProfile = {
        ...INITIAL_PROFILE,
        ...parsedData,
        basics: { ...INITIAL_PROFILE.basics, ...parsedData.basics },
        experience: parsedData.experience || [],
        skills: parsedData.skills || [],
        education: parsedData.education || [],
        projects: parsedData.projects || [],
        certifications: parsedData.certifications || [],
        publications: parsedData.publications || [],
        conferences: parsedData.conferences || [],
        linkedinContext: existingLinkedinContext || parsedData.linkedinContext || "" 
    };

    updateProfile(newProfile);
    setIsParsing(false);
    setShowImportModal(false);
    setImportText('');
  };

  const handleLinkedinSave = () => {
    updateProfile({
        ...appState.profile,
        linkedinContext: linkedinText
    });
    setShowLinkedinModal(false);
  };

  const handleLinkedinAnalyze = async () => {
    if(!linkedinText.trim()) return;
    setIsProcessingLinkedin(true);
    const insights = await extractInsightsFromLinkedIn(linkedinText);
    
    const currentProfile = appState.profile;
    const updatedProfile: CareerProfile = {
        ...currentProfile,
        linkedinContext: linkedinText,
        skills: [...(currentProfile.skills || []), ...(insights.skills || [])],
        projects: [...(currentProfile.projects || []), ...(insights.projects || [])]
    };

    updateProfile(updatedProfile);
    setIsProcessingLinkedin(false);
    setShowLinkedinModal(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm no-print">
            <div className="bg-white rounded-2xl w-[600px] max-h-[80vh] shadow-2xl flex flex-col p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-serif font-semibold text-slate-900">Import Resume</h2>
                    <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600"><IconX /></button>
                </div>
                <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg mb-4">
                    Paste your entire resume text below. Our AI will parse it into the structured format automatically.
                </div>
                <textarea 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-mono focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none resize-none mb-4"
                    placeholder="Paste resume content here..."
                    value={importText}
                    onChange={e => setImportText(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                    <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button 
                        onClick={handleImport} 
                        disabled={isParsing || !importText}
                        className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isParsing ? 'Parsing...' : <><IconMagic size={16}/> Import & Parse</>}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* LinkedIn Context Modal */}
      {showLinkedinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm no-print">
            <div className="bg-white rounded-2xl w-[600px] max-h-[80vh] shadow-2xl flex flex-col p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-serif font-semibold text-slate-900 flex items-center gap-2"><IconLinkedin className="text-blue-700"/> Add LinkedIn Context</h2>
                    <button onClick={() => setShowLinkedinModal(false)} className="text-slate-400 hover:text-slate-600"><IconX /></button>
                </div>
                <div className="bg-slate-50 text-slate-600 text-sm p-4 rounded-lg mb-4">
                    Paste content from your LinkedIn profile (About, recent Posts, Articles). 
                </div>
                <textarea 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-mono focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none resize-none mb-4 min-h-[200px]"
                    placeholder="Paste LinkedIn content here..."
                    value={linkedinText}
                    onChange={e => setLinkedinText(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                    <button onClick={() => setShowLinkedinModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button 
                        onClick={handleLinkedinSave} 
                        disabled={!linkedinText}
                        className="px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >
                        Use as Context
                    </button>
                    <button 
                        onClick={handleLinkedinAnalyze}
                        disabled={isProcessingLinkedin || !linkedinText}
                        className="px-4 py-2 text-sm font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isProcessingLinkedin ? 'Analyzing...' : <><IconMagic size={16}/> Extract & Merge</>}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm no-print">
             <div className="bg-white rounded-2xl w-[800px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-semibold text-slate-900">Choose Template</h2>
                    <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-slate-600"><IconX /></button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button 
                        onClick={() => handleTemplateChange('modern')}
                        className={`group relative p-3 rounded-xl border-2 transition-all ${appState.selectedTemplate === 'modern' ? 'border-accent-500 bg-accent-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className="aspect-[1/1.4] bg-white shadow-sm border border-slate-100 mb-3 p-2 overflow-hidden flex gap-1 pointer-events-none">
                            <div className="w-2/3 h-full bg-slate-50 flex flex-col gap-1 p-1">
                                <div className="h-1.5 w-1/2 bg-slate-200 mb-0.5"></div>
                                <div className="h-1 w-full bg-slate-100"></div>
                                <div className="h-1 w-full bg-slate-100"></div>
                            </div>
                            <div className="w-1/3 h-full bg-slate-100"></div>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm text-slate-800">Modern Sidebar</span>
                            {appState.selectedTemplate === 'modern' && <IconCheck className="text-accent-600" size={14}/>}
                        </div>
                    </button>

                    <button 
                        onClick={() => handleTemplateChange('classic')}
                        className={`group relative p-3 rounded-xl border-2 transition-all ${appState.selectedTemplate === 'classic' ? 'border-accent-500 bg-accent-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className="aspect-[1/1.4] bg-white shadow-sm border border-slate-100 mb-3 p-2 overflow-hidden flex flex-col gap-1 pointer-events-none">
                            <div className="w-full text-center mb-1">
                                <div className="h-1.5 w-1/3 bg-slate-300 mx-auto mb-0.5"></div>
                            </div>
                            <div className="h-px w-full bg-slate-200 my-1"></div>
                            <div className="h-1 w-full bg-slate-50"></div>
                            <div className="h-1 w-full bg-slate-50"></div>
                        </div>
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm text-slate-800">Classic Serif</span>
                             {appState.selectedTemplate === 'classic' && <IconCheck className="text-accent-600" size={14}/>}
                        </div>
                    </button>

                    <button 
                        onClick={() => handleTemplateChange('minimal')}
                        className={`group relative p-3 rounded-xl border-2 transition-all ${appState.selectedTemplate === 'minimal' ? 'border-accent-500 bg-accent-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className="aspect-[1/1.4] bg-white shadow-sm border border-slate-100 mb-3 p-3 overflow-hidden flex flex-col gap-2 pointer-events-none">
                            <div className="w-full text-center mb-2">
                                <div className="h-2 w-16 bg-slate-800 mx-auto mb-1 rounded-sm"></div>
                                <div className="h-0.5 w-8 bg-slate-300 mx-auto"></div>
                            </div>
                            <div className="space-y-1">
                                <div className="h-0.5 w-full bg-slate-100"></div>
                                <div className="h-0.5 w-3/4 bg-slate-100"></div>
                            </div>
                        </div>
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm text-slate-800">Minimal</span>
                             {appState.selectedTemplate === 'minimal' && <IconCheck className="text-accent-600" size={14}/>}
                        </div>
                    </button>

                    <button 
                        onClick={() => handleTemplateChange('creative')}
                        className={`group relative p-3 rounded-xl border-2 transition-all ${appState.selectedTemplate === 'creative' ? 'border-accent-500 bg-accent-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                         <div className="aspect-[1/1.4] bg-white shadow-sm border border-slate-100 mb-3 overflow-hidden flex flex-col pointer-events-none">
                            <div className="w-full h-8 bg-slate-800 mb-2"></div>
                            <div className="flex-1 px-2 flex gap-1">
                                <div className="w-2/3 space-y-1">
                                    <div className="h-1 w-full bg-slate-100"></div>
                                    <div className="h-1 w-full bg-slate-100"></div>
                                </div>
                                <div className="w-1/3 h-full bg-blue-50"></div>
                            </div>
                        </div>
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm text-slate-800">Creative</span>
                             {appState.selectedTemplate === 'creative' && <IconCheck className="text-accent-600" size={14}/>}
                        </div>
                    </button>
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm text-slate-500 flex items-start gap-3">
                    <IconMagic size={16} className="mt-0.5 text-accent-600"/>
                    <p>All templates are optimized for ATS readability. Content automatically reflows to fit the layout. Use density controls (coming soon) to adjust spacing.</p>
                </div>
             </div>
        </div>
      )}

      {/* 1. Left Sidebar Navigation */}
      <nav className={`w-[260px] flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 ${isFullScreen ? '-ml-[260px]' : ''} no-print`}>
        <div className="p-6">
          <div className="flex items-center gap-3 text-white mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-accent-500/20">
              <span className="font-serif font-bold text-lg">S</span>
            </div>
            <span className="font-medium tracking-wide">Studio</span>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Workspace</p>
            <button 
              onClick={() => setAppState(prev => ({ ...prev, activeView: 'editor' }))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${appState.activeView === 'editor' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
            >
              <IconFile /> Resume Editor
            </button>
            <button 
              onClick={() => setAppState(prev => ({ ...prev, activeView: 'cover-letter' }))}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${appState.activeView === 'cover-letter' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'}`}
            >
              <IconBriefcase /> Job & Cover Letter
            </button>
          </div>

          <div className="mt-8 space-y-2">
             <button 
                onClick={() => setShowImportModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-accent-400 hover:bg-slate-800/50 hover:text-accent-300 transition-all border border-dashed border-slate-700 hover:border-accent-500/50"
             >
                <IconUpload size={16} /> Import Resume
             </button>
             <button 
                onClick={() => setShowLinkedinModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-blue-400 hover:bg-slate-800/50 hover:text-blue-300 transition-all border border-dashed border-slate-700 hover:border-blue-500/50"
             >
                <IconLinkedin size={16} /> Add LinkedIn Data
             </button>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
           <button 
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
            >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : <><IconSave size={16}/> Save Progress</>}
            </button>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">Target Role</p>
            <div className="text-sm font-medium text-white mb-1">
                {appState.jobBrief ? appState.jobBrief.roleTitle : "General Profile"}
            </div>
            {appState.jobBrief && <div className="text-xs text-slate-500">{appState.jobBrief.companyName}</div>}
          </div>
        </div>
      </nav>

      {/* 2. Main Canvas */}
      <main className="flex-1 flex flex-col relative transition-all duration-300">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-sm flex items-center justify-between px-6 z-20 no-print">
          <div className="flex items-center gap-4">
            {isFullScreen && (
                <button onClick={toggleFullScreen} className="text-slate-500 hover:text-slate-900" title="Exit Full Screen">
                    <IconMinimize />
                </button>
            )}
             <span className="text-sm text-slate-500">
                {isFullScreen ? 'Preview Mode' : 'Editing Mode'}
             </span>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
                <IconGrid size={16}/> Template: <span className="capitalize">{appState.selectedTemplate}</span>
             </button>
             
             {/* Combined Export Menu / Buttons */}
             <div className="flex items-center gap-2">
                 <button 
                    onClick={handleDownloadHTML}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                    title="Export HTML"
                >
                    <IconHtml size={16} /> HTML
                </button>
                 <button 
                    onClick={handleDownloadDOCX}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                    title="Export DOCX"
                >
                    <IconFile size={16} /> DOCX
                </button>
                 <button 
                    onClick={handleDownloadMarkdown}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                    title="Export Markdown"
                >
                    <IconFileCode size={16} /> MD
                </button>
                 <button 
                    onClick={handleDownloadJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                    title="Export JSON Data"
                >
                    <IconFile size={16} /> JSON
                </button>
                 <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                    <IconDownload size={16} /> PDF
                </button>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          
          {appState.activeView === 'editor' ? (
             <div className="flex h-full">
                {/* Editor Panel */}
                <div className={`h-full border-r border-slate-200 bg-white z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden editor-panel ${isFullScreen ? 'w-0 border-none' : 'w-1/2'}`}>
                   <div className="w-full h-full min-w-[500px]">
                       <Editor 
                          profile={appState.profile} 
                          setProfile={updateProfile} 
                          onUndo={undo} 
                          onRedo={redo} 
                          canUndo={canUndo} 
                          canRedo={canRedo} 
                        />
                   </div>
                </div>
                {/* Live Preview Panel */}
                <div className={`h-full bg-slate-100/50 transition-all duration-300 preview-panel ${isFullScreen ? 'w-full' : 'w-1/2'}`}>
                    <div className="absolute top-4 right-4 z-20 no-print">
                        {!isFullScreen && (
                            <button onClick={toggleFullScreen} className="p-2 bg-white rounded-full shadow-md text-slate-500 hover:text-slate-900 hover:scale-110 transition-all" title="Full Screen Preview">
                                <IconMaximize size={18} />
                            </button>
                        )}
                    </div>
                    <ResumePreview profile={appState.profile} template={appState.selectedTemplate} />
                </div>
             </div>
          ) : (
             <CoverLetter appState={appState} setAppState={setAppState} />
          )}

        </div>
      </main>
    </div>
  );
};

export default App;