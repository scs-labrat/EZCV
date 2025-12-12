import React, { useState } from 'react';
import { CareerProfile, Tone } from '../types';
import { IconSparkles, IconMore, IconPlus, IconTrash, IconUndo, IconRedo } from './ui/Icons';
import { optimizeSection } from '../services/geminiService';

interface EditorProps {
  profile: CareerProfile;
  setProfile: (p: CareerProfile) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Editor: React.FC<EditorProps> = ({ profile, setProfile, onUndo, onRedo, canUndo, canRedo }) => {
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const handleOptimization = async (sectionId: string, currentText: string, context: string) => {
    setOptimizingId(sectionId);
    // Pass the linkedinContext if available
    const newText = await optimizeSection(
        currentText, 
        "Senior Software Engineer", 
        Tone.Modern, 
        ["concise", "outcome-oriented"],
        profile.linkedinContext
    );
    
    if (sectionId === 'summary') {
        setProfile({ ...profile, summary: newText });
    }
    // Note: Experience optimization logic would go here, simplified for this snippet
    setOptimizingId(null);
  };

  const addItem = (section: keyof CareerProfile, item: any) => {
    setProfile({
      ...profile,
      [section]: [...(profile[section] as any[]), item]
    });
  };

  const removeItem = (section: keyof CareerProfile, index: number) => {
    const newList = [...(profile[section] as any[])];
    newList.splice(index, 1);
    setProfile({ ...profile, [section]: newList });
  };

  const addHighlight = (experienceIndex: number) => {
    const newExperience = [...profile.experience];
    newExperience[experienceIndex].highlights.push({
      id: `hl-${Date.now()}`,
      text: "New achievement or responsibility"
    });
    setProfile({ ...profile, experience: newExperience });
  };

  const removeHighlight = (experienceIndex: number, highlightIndex: number) => {
    const newExperience = [...profile.experience];
    newExperience[experienceIndex].highlights.splice(highlightIndex, 1);
    setProfile({ ...profile, experience: newExperience });
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar pb-20">
      <div className="px-8 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-serif font-semibold text-slate-900">Career Profile</h2>
            <p className="text-sm text-slate-500">Manage your structured data</p>
        </div>
        
        <div className="flex items-center gap-4">
            {profile.linkedinContext && (
                <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100 flex items-center gap-1">
                    LinkedIn Active
                </div>
            )}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button 
                    onClick={onUndo} 
                    disabled={!canUndo}
                    className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-500 disabled:opacity-30 transition-all"
                    title="Undo"
                >
                    <IconUndo size={16} />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button 
                    onClick={onRedo} 
                    disabled={!canRedo}
                    className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-500 disabled:opacity-30 transition-all"
                    title="Redo"
                >
                    <IconRedo size={16} />
                </button>
            </div>
        </div>
      </div>

      <div className="px-8 py-6 flex flex-col gap-8">
        
        {/* Basics Block */}
        <div className="group relative bg-white border border-slate-200 rounded-xl p-6 transition-all hover:shadow-md hover:border-slate-300">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">Basics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
              <input 
                value={profile.basics.name} 
                onChange={e => setProfile({...profile, basics: {...profile.basics, name: e.target.value}})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Current Title</label>
              <input 
                value={profile.basics.title}
                onChange={e => setProfile({...profile, basics: {...profile.basics, title: e.target.value}})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none transition-all"
              />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input 
                    value={profile.basics.email} 
                    onChange={e => setProfile({...profile, basics: {...profile.basics, email: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
                <input 
                    value={profile.basics.location} 
                    onChange={e => setProfile({...profile, basics: {...profile.basics, location: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none"
                />
            </div>
          </div>
        </div>

        {/* Summary Block */}
        <div className="group relative bg-white border border-slate-200 rounded-xl p-6 transition-all hover:shadow-md hover:border-slate-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Executive Summary</h3>
            <button 
                onClick={() => handleOptimization('summary', profile.summary, 'summary')}
                disabled={!!optimizingId}
                className="flex items-center gap-1.5 text-xs font-medium text-accent-600 bg-accent-50 hover:bg-accent-100 px-2 py-1 rounded-md transition-colors"
            >
               {optimizingId === 'summary' ? <span className="animate-pulse">Optimising...</span> : <><IconSparkles /> Enhance</>}
            </button>
          </div>
          <textarea 
            rows={4}
            value={profile.summary}
            onChange={e => setProfile({...profile, summary: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm leading-relaxed focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 outline-none resize-none"
          />
        </div>

        {/* Experience Blocks */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Professional Experience</h3>
            <button 
                onClick={() => addItem('experience', { id: `exp-${Date.now()}`, company: 'New Company', role: 'Role', startDate: '', endDate: '', location: '', highlights: [] })}
                className="text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
            >
                <IconPlus size={14} /> Add Role
            </button>
          </div>
          
          {profile.experience.map((exp, index) => (
            <div key={exp.id} className="relative bg-white border border-slate-200 rounded-xl p-6 transition-all hover:shadow-md hover:border-slate-300 group">
              <button 
                onClick={() => removeItem('experience', index)}
                className="absolute top-4 right-4 p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
              >
                <IconTrash size={14} />
              </button>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input 
                  value={exp.company}
                  onChange={(e) => {
                      const newExp = [...profile.experience];
                      newExp[index].company = e.target.value;
                      setProfile({...profile, experience: newExp});
                  }}
                  className="font-serif font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-accent-500 outline-none pb-1"
                  placeholder="Company"
                />
                <div className="text-right">
                    <input 
                        value={exp.endDate}
                        onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[index].endDate = e.target.value;
                            setProfile({...profile, experience: newExp});
                        }}
                        className="text-xs text-slate-400 text-right bg-transparent border-b border-transparent hover:border-slate-200 focus:border-accent-500 outline-none pb-1 w-20"
                        placeholder="Dates"
                    />
                </div>
              </div>
              <input 
                  value={exp.role} 
                  onChange={(e) => {
                    const newExp = [...profile.experience];
                    newExp[index].role = e.target.value;
                    setProfile({...profile, experience: newExp});
                  }}
                  className="w-full text-sm font-medium text-accent-600 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-accent-500 outline-none pb-1 mb-4"
                  placeholder="Role Title"
              />

              <div className="space-y-3 mb-4">
                {exp.highlights.map((hl, hIndex) => (
                  <div key={hl.id} className="flex gap-3 group/bullet">
                    <div className="pt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/bullet:bg-accent-400"></div>
                    </div>
                    <textarea 
                        rows={2}
                        value={hl.text}
                        onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[index].highlights[hIndex].text = e.target.value;
                            setProfile({...profile, experience: newExp});
                        }}
                        className="w-full text-sm text-slate-600 bg-transparent rounded px-2 -ml-2 hover:bg-slate-50 focus:bg-white focus:shadow-sm outline-none resize-none"
                    />
                     <button 
                        onClick={() => removeHighlight(index, hIndex)}
                        className="opacity-0 group-hover/bullet:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
                    >
                        <IconTrash size={12}/>
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => addHighlight(index)}
                className="text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1 ml-1"
              >
                  <IconPlus size={12} /> Add Dot Point
              </button>
            </div>
          ))}
        </div>

        {/* Education Blocks */}
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Education</h3>
                <button 
                    onClick={() => addItem('education', { id: `edu-${Date.now()}`, institution: 'New Institution', degree: 'Degree', year: 'Year' })}
                    className="text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
                >
                    <IconPlus size={14} /> Add Education
                </button>
            </div>
            {profile.education.map((edu, index) => (
                <div key={edu.id} className="relative bg-white border border-slate-200 rounded-xl p-4 group">
                    <button 
                        onClick={() => removeItem('education', index)}
                        className="absolute top-4 right-4 p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                    >
                        <IconTrash size={14} />
                    </button>
                    <div className="grid grid-cols-1 gap-2">
                        <input 
                            value={edu.institution} 
                            onChange={(e) => {
                                const newEdu = [...profile.education];
                                newEdu[index].institution = e.target.value;
                                setProfile({...profile, education: newEdu});
                            }}
                            className="font-semibold text-sm text-slate-900 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-accent-500"
                            placeholder="Institution"
                        />
                         <input 
                            value={edu.degree} 
                            onChange={(e) => {
                                const newEdu = [...profile.education];
                                newEdu[index].degree = e.target.value;
                                setProfile({...profile, education: newEdu});
                            }}
                            className="text-sm text-slate-600 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-accent-500"
                            placeholder="Degree"
                        />
                         <input 
                            value={edu.year} 
                            onChange={(e) => {
                                const newEdu = [...profile.education];
                                newEdu[index].year = e.target.value;
                                setProfile({...profile, education: newEdu});
                            }}
                            className="text-xs text-slate-400 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-accent-500"
                            placeholder="Year"
                        />
                    </div>
                </div>
            ))}
        </div>

        {/* Skills Block */}
        <div className="group relative bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Skills</h3>
                <button 
                    onClick={() => addItem('skills', { name: 'New Category', items: [] })}
                    className="text-xs font-medium text-accent-600 hover:text-accent-700"
                >
                    + Add Category
                </button>
            </div>
            <div className="flex flex-col gap-4">
                {profile.skills.map((group, index) => (
                    <div key={index} className="flex flex-col gap-2">
                         <div className="flex justify-between items-center">
                            <input 
                                value={group.name}
                                onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[index].name = e.target.value;
                                    setProfile({...profile, skills: newSkills});
                                }}
                                className="text-sm font-bold text-slate-700 bg-transparent outline-none focus:text-accent-600"
                            />
                             <button onClick={() => removeItem('skills', index)} className="text-slate-300 hover:text-red-500"><IconTrash size={12}/></button>
                         </div>
                        <input 
                            value={group.items.join(', ')}
                            onChange={(e) => {
                                const newSkills = [...profile.skills];
                                newSkills[index].items = e.target.value.split(',').map(s => s.trim());
                                setProfile({...profile, skills: newSkills});
                            }}
                            className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded px-2 py-1 focus:border-accent-500 outline-none"
                            placeholder="Java, Python, React..."
                        />
                    </div>
                ))}
            </div>
        </div>

         {/* Optional Section: Projects */}
         <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Projects</h3>
                <button 
                    onClick={() => addItem('projects', { id: `proj-${Date.now()}`, name: 'Project Name', description: 'Description', highlights: [] })}
                    className="text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
                >
                    <IconPlus size={14} /> Add Project
                </button>
            </div>
            {profile.projects && profile.projects.map((proj, index) => (
                <div key={proj.id} className="relative bg-white border border-slate-200 rounded-xl p-4 group">
                     <button onClick={() => removeItem('projects', index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><IconTrash size={14}/></button>
                     <input value={proj.name} onChange={e => {
                         const newP = [...profile.projects]; newP[index].name = e.target.value; setProfile({...profile, projects: newP});
                     }} className="block font-semibold text-sm mb-1 outline-none w-full bg-transparent" placeholder="Project Name" />
                     <textarea value={proj.description} onChange={e => {
                         const newP = [...profile.projects]; newP[index].description = e.target.value; setProfile({...profile, projects: newP});
                     }} className="w-full text-sm text-slate-600 outline-none bg-transparent resize-none" rows={2} placeholder="Project Description" />
                </div>
            ))}
         </div>
         
         {/* Optional Section: Certifications */}
         <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Certifications</h3>
                <button 
                    onClick={() => addItem('certifications', { id: `cert-${Date.now()}`, name: 'Certification', issuer: 'Issuer', date: '' })}
                    className="text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
                >
                    <IconPlus size={14} /> Add Cert
                </button>
            </div>
            {profile.certifications && profile.certifications.map((cert, index) => (
                <div key={cert.id} className="relative bg-white border border-slate-200 rounded-xl p-4 group">
                     <button onClick={() => removeItem('certifications', index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><IconTrash size={14}/></button>
                     <input value={cert.name} onChange={e => {
                         const newC = [...profile.certifications]; newC[index].name = e.target.value; setProfile({...profile, certifications: newC});
                     }} className="block font-semibold text-sm mb-1 outline-none w-full bg-transparent" placeholder="Certification Name" />
                     <input value={cert.issuer} onChange={e => {
                         const newC = [...profile.certifications]; newC[index].issuer = e.target.value; setProfile({...profile, certifications: newC});
                     }} className="block text-xs text-slate-500 mb-1 outline-none w-full bg-transparent" placeholder="Issuer" />
                     <input value={cert.date} onChange={e => {
                         const newC = [...profile.certifications]; newC[index].date = e.target.value; setProfile({...profile, certifications: newC});
                     }} className="block text-xs text-slate-400 outline-none w-full bg-transparent" placeholder="Date" />
                </div>
            ))}
         </div>

         {/* Optional Section: Publications & Conferences */}
         <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Publications & Conferences</h3>
                <button 
                    onClick={() => addItem('publications', { id: `pub-${Date.now()}`, title: 'Title', publisher: 'Publisher/Event', date: '' })}
                    className="text-xs font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1"
                >
                    <IconPlus size={14} /> Add Item
                </button>
            </div>
            {profile.publications && profile.publications.map((pub, index) => (
                <div key={pub.id} className="relative bg-white border border-slate-200 rounded-xl p-4 group">
                     <button onClick={() => removeItem('publications', index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><IconTrash size={14}/></button>
                     <input value={pub.title} onChange={e => {
                         const newP = [...profile.publications]; newP[index].title = e.target.value; setProfile({...profile, publications: newP});
                     }} className="block font-semibold text-sm mb-1 outline-none w-full bg-transparent" placeholder="Title / Talk" />
                     <input value={pub.publisher} onChange={e => {
                         const newP = [...profile.publications]; newP[index].publisher = e.target.value; setProfile({...profile, publications: newP});
                     }} className="block text-xs text-slate-500 outline-none w-full bg-transparent" placeholder="Publisher / Event" />
                </div>
            ))}
         </div>

      </div>
    </div>
  );
};

export default Editor;