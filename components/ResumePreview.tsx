import React from 'react';
import { CareerProfile, TemplateId } from '../types';

interface ResumePreviewProps {
  profile: CareerProfile;
  template: TemplateId;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ profile, template }) => {
  
  // --- Modern Template (The original Design) ---
  const ModernTemplate = () => (
    <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-slate-900 mb-2 tracking-tight">
            {profile.basics.name}
          </h1>
          <p className="text-lg text-slate-500 font-medium mb-4">{profile.basics.title}</p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <span>{profile.basics.location}</span>
            <span>{profile.basics.email}</span>
            <span>{profile.basics.phone}</span>
            {profile.basics.links.map(link => (
              <a key={link.label} href={link.url} className="text-accent-600 hover:underline">
                {link.label}
              </a>
            ))}
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-12 gap-8 h-full">
          
          {/* Main Column */}
          <div className="col-span-8 flex flex-col gap-8">
            
            {/* Summary */}
            {profile.summary && (
              <section>
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">Summary</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {profile.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {profile.experience.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Experience</h2>
                <div className="flex flex-col gap-6">
                  {profile.experience.map(job => (
                    <div key={job.id} className="group">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-serif font-semibold text-lg text-slate-800">{job.company}</h3>
                        <span className="text-xs text-slate-400 tabular-nums">{job.startDate} — {job.endDate}</span>
                      </div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-sm font-medium text-accent-600">{job.role}</h4>
                        <span className="text-xs text-slate-400">{job.location}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-1">
                        {job.highlights.map(hl => (
                          <li key={hl.id} className="text-sm text-slate-600 leading-snug pl-1">
                            {hl.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

             {/* Projects (Optional) */}
             {profile.projects && profile.projects.length > 0 && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Selected Projects</h2>
                  <div className="flex flex-col gap-4">
                    {profile.projects.map(proj => (
                      <div key={proj.id}>
                        <div className="flex items-baseline gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-slate-800">{proj.name}</h4>
                          {proj.url && <a href={proj.url} className="text-xs text-accent-600 hover:underline">Link ↗</a>}
                        </div>
                        <p className="text-sm text-slate-600 leading-snug">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
             )}
          </div>

          {/* Sidebar Column */}
          <div className="col-span-4 flex flex-col gap-8 border-l border-slate-100 pl-8">
            
            {/* Skills */}
            {profile.skills.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Expertise</h2>
                <div className="flex flex-col gap-4">
                  {profile.skills.map(group => (
                    <div key={group.name}>
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">{group.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {profile.education.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Education</h2>
                <div className="flex flex-col gap-4">
                  {profile.education.map((edu, i) => (
                    <div key={i}>
                      <div className="text-sm font-semibold text-slate-800">{edu.institution}</div>
                      <div className="text-sm text-slate-600">{edu.degree}</div>
                      <div className="text-xs text-slate-400 mt-1">{edu.year}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications (Optional) */}
            {profile.certifications && profile.certifications.length > 0 && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Certifications</h2>
                  <div className="flex flex-col gap-3">
                    {profile.certifications.map(cert => (
                      <div key={cert.id}>
                        <div className="text-sm font-semibold text-slate-800 leading-tight">{cert.name}</div>
                        <div className="text-xs text-slate-500">{cert.issuer}</div>
                      </div>
                    ))}
                  </div>
                </section>
            )}

            {/* Publications/Conferences (Optional) */}
            {profile.publications && profile.publications.length > 0 && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">Speaking & Writing</h2>
                  <div className="flex flex-col gap-3">
                    {profile.publications.map(pub => (
                      <div key={pub.id}>
                        <div className="text-sm font-medium text-slate-800 leading-tight italic">"{pub.title}"</div>
                        <div className="text-xs text-slate-500 mt-1">{pub.publisher}</div>
                      </div>
                    ))}
                  </div>
                </section>
            )}

          </div>
        </div>
    </div>
  );

  // --- Classic Template (Single Column, Serif Headings) ---
  const ClassicTemplate = () => (
    <div className="flex flex-col gap-6 text-slate-900">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
        <h1 className="text-3xl font-serif font-bold tracking-wide uppercase mb-2">{profile.basics.name}</h1>
        <p className="text-md font-medium mb-2">{profile.basics.title}</p>
        <div className="flex justify-center flex-wrap gap-4 text-sm text-slate-600">
             <span>{profile.basics.location}</span>
            <span>{profile.basics.email}</span>
            <span>{profile.basics.phone}</span>
             {profile.basics.links.map(link => (
              <a key={link.label} href={link.url} className="text-slate-900 hover:underline">
                {link.label}
              </a>
            ))}
        </div>
      </header>

      {/* Summary */}
      {profile.summary && (
        <section>
          <h2 className="text-md font-serif font-bold uppercase border-b border-slate-300 pb-1 mb-3">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-justify">{profile.summary}</p>
        </section>
      )}

      {/* Experience */}
       {profile.experience.length > 0 && (
        <section>
          <h2 className="text-md font-serif font-bold uppercase border-b border-slate-300 pb-1 mb-3">Experience</h2>
          <div className="flex flex-col gap-5">
            {profile.experience.map(job => (
              <div key={job.id}>
                <div className="flex justify-between font-bold text-sm mb-1">
                  <span>{job.company}</span>
                  <span>{job.startDate} – {job.endDate}</span>
                </div>
                <div className="flex justify-between italic text-sm mb-2 text-slate-700">
                  <span>{job.role}</span>
                  <span>{job.location}</span>
                </div>
                <ul className="list-disc list-outside ml-5 space-y-1">
                    {job.highlights.map(hl => (
                      <li key={hl.id} className="text-sm leading-snug">{hl.text}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {profile.education.length > 0 && (
        <section>
          <h2 className="text-md font-serif font-bold uppercase border-b border-slate-300 pb-1 mb-3">Education</h2>
          <div className="flex flex-col gap-3">
             {profile.education.map((edu, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <span className="font-bold block">{edu.institution}</span>
                    <span className="text-slate-700">{edu.degree}</span>
                  </div>
                  <span className="text-slate-600">{edu.year}</span>
                </div>
             ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <section>
          <h2 className="text-md font-serif font-bold uppercase border-b border-slate-300 pb-1 mb-3">Skills</h2>
          <div className="text-sm leading-relaxed">
            {profile.skills.map(group => (
              <div key={group.name} className="mb-1">
                <span className="font-bold">{group.name}: </span>
                <span>{group.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
       {profile.projects && profile.projects.length > 0 && (
          <section>
            <h2 className="text-md font-serif font-bold uppercase border-b border-slate-300 pb-1 mb-3">Projects</h2>
             <div className="flex flex-col gap-3">
                {profile.projects.map(proj => (
                  <div key={proj.id}>
                    <div className="text-sm font-bold mb-1">
                      {proj.name} {proj.url && <a href={proj.url} className="font-normal text-slate-500 ml-2 no-underline">({proj.url})</a>}
                    </div>
                    <p className="text-sm">{proj.description}</p>
                  </div>
                ))}
             </div>
          </section>
       )}

    </div>
  );

  // --- Minimal Template (Clean, Centered, Airy) ---
  const MinimalTemplate = () => (
    <div className="flex flex-col gap-10 text-slate-800">
        <header className="text-center">
             <h1 className="text-5xl font-light tracking-wide mb-3 text-slate-900">{profile.basics.name.toUpperCase()}</h1>
             <p className="text-sm tracking-[0.2em] uppercase text-slate-500 mb-6">{profile.basics.title}</p>
             <div className="flex justify-center gap-4 text-xs text-slate-400 uppercase tracking-widest">
                <span>{profile.basics.location}</span>
                <span>•</span>
                <span>{profile.basics.email}</span>
                <span>•</span>
                <span>{profile.basics.phone}</span>
             </div>
             {profile.basics.links.length > 0 && (
                 <div className="flex justify-center gap-4 text-xs text-slate-400 uppercase tracking-widest mt-2">
                     {profile.basics.links.map(link => (
                        <a key={link.label} href={link.url} className="hover:text-slate-800 transition-colors">{link.label}</a>
                     ))}
                 </div>
             )}
        </header>

        {profile.summary && (
            <div className="px-8 text-center max-w-2xl mx-auto">
                <p className="text-sm leading-7 text-slate-600">{profile.summary}</p>
            </div>
        )}

        <div className="space-y-12">
            {/* Experience */}
            {profile.experience.length > 0 && (
                <section>
                    <h2 className="text-xs uppercase tracking-[0.2em] text-center text-slate-400 mb-8">Experience</h2>
                    <div className="space-y-8">
                        {profile.experience.map(job => (
                            <div key={job.id} className="grid grid-cols-12 gap-4">
                                <div className="col-span-3 text-right">
                                    <div className="text-sm font-semibold text-slate-900">{job.company}</div>
                                    <div className="text-xs text-slate-400 mt-1">{job.startDate} — {job.endDate}</div>
                                    <div className="text-xs text-slate-400">{job.location}</div>
                                </div>
                                <div className="col-span-9 border-l border-slate-100 pl-6 pb-2">
                                    <div className="text-sm font-medium text-slate-800 mb-2">{job.role}</div>
                                    <ul className="space-y-2">
                                        {job.highlights.map(hl => (
                                            <li key={hl.id} className="text-sm text-slate-600 leading-relaxed pl-0">{hl.text}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills (3 Column Grid) */}
            {profile.skills.length > 0 && (
                <section>
                    <h2 className="text-xs uppercase tracking-[0.2em] text-center text-slate-400 mb-8">Expertise</h2>
                    <div className="grid grid-cols-3 gap-8 text-center">
                        {profile.skills.map(grp => (
                            <div key={grp.name}>
                                <h3 className="text-xs font-bold uppercase text-slate-700 mb-2">{grp.name}</h3>
                                <div className="text-sm text-slate-500 leading-6">
                                    {grp.items.join(' • ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

             {/* Education & Projects Split */}
             <div className="grid grid-cols-2 gap-12">
                {profile.education.length > 0 && (
                    <section>
                         <h2 className="text-xs uppercase tracking-[0.2em] text-center text-slate-400 mb-6">Education</h2>
                         <div className="space-y-4">
                            {profile.education.map((edu, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-sm font-semibold text-slate-900">{edu.institution}</div>
                                    <div className="text-sm text-slate-600">{edu.degree}</div>
                                    <div className="text-xs text-slate-400 mt-1">{edu.year}</div>
                                </div>
                            ))}
                         </div>
                    </section>
                )}

                 {profile.projects && profile.projects.length > 0 && (
                    <section>
                         <h2 className="text-xs uppercase tracking-[0.2em] text-center text-slate-400 mb-6">Projects</h2>
                         <div className="space-y-4">
                            {profile.projects.map(proj => (
                                <div key={proj.id} className="text-center">
                                    <div className="text-sm font-semibold text-slate-900">{proj.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{proj.description}</div>
                                </div>
                            ))}
                         </div>
                    </section>
                )}
             </div>
        </div>
    </div>
  );

  // --- Creative Template (Bold Header, 2-Col, Accent Colors) ---
  const CreativeTemplate = () => (
    <div className="h-full flex flex-col">
        {/* Bold Colored Header */}
        <header className="bg-slate-900 text-white p-12 -mx-12 -mt-12 mb-12 flex justify-between items-start">
            <div>
                 <h1 className="text-5xl font-bold tracking-tight mb-2">{profile.basics.name}</h1>
                 <p className="text-xl text-accent-400 font-medium">{profile.basics.title}</p>
            </div>
            <div className="text-right text-sm text-slate-300 space-y-1">
                <div>{profile.basics.location}</div>
                <div>{profile.basics.email}</div>
                <div>{profile.basics.phone}</div>
                <div className="flex gap-3 justify-end mt-2">
                    {profile.basics.links.map(link => (
                        <a key={link.label} href={link.url} className="text-white hover:text-accent-400 underline decoration-accent-500/50 hover:decoration-accent-400">{link.label}</a>
                    ))}
                </div>
            </div>
        </header>

        <div className="grid grid-cols-12 gap-12 flex-1">
             {/* Left Column (Main Content) */}
             <div className="col-span-8 space-y-10">
                {profile.summary && (
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-accent-500 rounded-sm inline-block"></span>
                            Profile
                        </h2>
                        <p className="text-base leading-relaxed text-slate-700">{profile.summary}</p>
                    </section>
                )}

                 {profile.experience.length > 0 && (
                    <section>
                         <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-accent-500 rounded-sm inline-block"></span>
                            Experience
                        </h2>
                        <div className="space-y-8">
                             {profile.experience.map(job => (
                                <div key={job.id} className="relative pl-6 border-l-2 border-slate-100">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-accent-500 rounded-full"></div>
                                    <div className="mb-2">
                                        <h3 className="text-lg font-bold text-slate-800">{job.role}</h3>
                                        <div className="text-sm font-medium text-accent-600">{job.company} | {job.startDate} - {job.endDate}</div>
                                    </div>
                                    <ul className="space-y-2">
                                        {job.highlights.map(hl => (
                                            <li key={hl.id} className="text-sm text-slate-600 leading-snug">{hl.text}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {profile.projects && profile.projects.length > 0 && (
                    <section>
                         <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-accent-500 rounded-sm inline-block"></span>
                            Projects
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {profile.projects.map(proj => (
                                <div key={proj.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-1">{proj.name}</h4>
                                    <p className="text-sm text-slate-600">{proj.description}</p>
                                    {proj.url && <a href={proj.url} className="text-xs text-accent-600 hover:underline mt-2 block">View Project →</a>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
             </div>

             {/* Right Column (Sidebar) */}
             <div className="col-span-4 space-y-10">
                 {profile.skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-200 pb-2">Skills</h2>
                        <div className="space-y-6">
                            {profile.skills.map(grp => (
                                <div key={grp.name}>
                                    <h3 className="font-bold text-slate-800 mb-2">{grp.name}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {grp.items.map(skill => (
                                            <span key={skill} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                 )}

                 {profile.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-200 pb-2">Education</h2>
                        <div className="space-y-4">
                            {profile.education.map((edu, i) => (
                                <div key={i}>
                                    <div className="font-bold text-slate-800">{edu.institution}</div>
                                    <div className="text-sm text-slate-600">{edu.degree}</div>
                                    <div className="text-xs text-accent-600 font-medium mt-1">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                 )}

                  {profile.publications && profile.publications.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-200 pb-2">Publications</h2>
                        <div className="space-y-3">
                            {profile.publications.map(pub => (
                                <div key={pub.id}>
                                    <div className="text-sm font-semibold text-slate-800 italic">"{pub.title}"</div>
                                    <div className="text-xs text-slate-500">{pub.publisher}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                 )}
             </div>
        </div>
    </div>
  );

  const getTemplate = () => {
      switch(template) {
          case 'modern': return <ModernTemplate />;
          case 'classic': return <ClassicTemplate />;
          case 'minimal': return <MinimalTemplate />;
          case 'creative': return <CreativeTemplate />;
          default: return <ModernTemplate />;
      }
  }

  const getFontFamily = () => {
       switch(template) {
          case 'modern': return "'Inter', sans-serif";
          case 'classic': return "'Times New Roman', serif";
          case 'minimal': return "'Inter', sans-serif";
          case 'creative': return "'Inter', sans-serif"; // Creative mixes fonts inside
          default: return "'Inter', sans-serif";
      }
  }

  return (
    <div className="w-full h-full flex items-start justify-center p-8 bg-slate-100/50 overflow-y-auto custom-scrollbar print:p-0 print:bg-white print:overflow-visible">
      <div 
        id="resume-preview"
        className={`w-full max-w-[800px] min-h-[1132px] bg-white shadow-2xl ${template === 'creative' ? 'p-12' : 'p-12'} text-slate-800 flex flex-col gap-8 transition-all duration-300 origin-top scale-95 sm:scale-100 print:shadow-none print:w-[210mm] print:h-auto print:min-h-0 print:p-0 print:m-0 print:scale-100`}
        style={{ fontFamily: getFontFamily() }}
      >
        {getTemplate()}
      </div>
    </div>
  );
};

export default ResumePreview;