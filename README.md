# CV Studio AI

**CV Studio AI** is a next-generation, design-forward resume and application platform. It ingests existing resumes, structures them into a canonical "Career Profile" JSON, and uses Generative AI (Google Gemini 2.5) to rewrite content for specific roles, analyze job descriptions, and generate tailored cover letters.

## 🚀 Key Features

### 1. Resume Ingestion & Normalization
- **Import**: Parses text-based resumes into structured JSON data.
- **LinkedIn Integration**: Contextualizes profiles using pasted LinkedIn about/posts/activity data.
- **Single Source of Truth**: Edits are made to the data, not the document, ensuring consistency across all exports.

### 2. AI-Powered Optimization
- **Section Rewriting**: Optimizes Summaries and Experience bullets for specific target roles using Google Gemini.
- **Tone Control**: Switch between "Modern Professional", "Executive", "Startup/Founder", and "Technical" voices.
- **Constraint Handling**: Enforces concise writing and outcome-oriented language without fabricating facts.

### 3. Job Market Intelligence
- **JD Analysis**: Extracts keywords, seniority levels, and core requirements from raw Job Descriptions.
- **Cover Letter Generation**: Drafts highly specific cover letters that bridge the candidate's profile with the job's needs.

### 4. Dynamic Rendering & Templates
- **Live Preview**: Real-time visual feedback as you edit.
- **Templates**:
  - **Modern**: Two-column, sidebar layout (clean & efficient).
  - **Classic**: Single-column, serif typography (traditional & ATS-safe).
  - **Minimal**: Centered, high-whitespace (design-focused).
  - **Creative**: Bold headers, accent colors, and distinct hierarchy.

### 5. Multi-Format Export
- **PDF**: Print-perfect layout using browser print engine.
- **DOCX**: Native Word document generation for editable sharing.
- **HTML**: Standalone web resume for hosting or email attachment.
- **Markdown**: Plain text formatting for technical roles.
- **JSON**: Portable data export for backup or transfer.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (Utility-first architecture)
- **AI/LLM**: Google GenAI SDK (`@google/genai`) targeting `gemini-2.5-flash`
- **Document Generation**: 
  - `docx` for Word documents
  - `react-dom/server` for HTML export
- **Icons**: `lucide-react`
- **Build/Runtime**: ES Modules (via `esm.sh` imports)

## 📦 Data Model

The application revolves around a `CareerProfile` interface:

```typescript
interface CareerProfile {
  basics: { name, title, contacts... };
  summary: string;
  experience: ExperienceItem[];
  skills: SkillGroup[];
  // ... projects, education, certs
  linkedinContext?: string; // Background data for AI context
}
```

## 🎨 Design System

- **Typography**: Inter (UI/Sans) + Playfair Display (Headings/Serif).
- **Color Palette**: Slate (Neutrals) + Sky/Blue (Accents).
- **Layout**: Fluid split-pane interface (Editor + Preview).
- **Interactions**: Glassmorphism headers, subtle shadows, and fluid transitions.

## 📝 Usage

1. **Import**: Click "Import Resume" and paste your current resume text.
2. **Edit**: Use the structured editor to refine bullets and details.
3. **Target**: Paste a Job Description in the "Job & Cover Letter" view.
4. **Optimize**: Use the "Enhance" AI tools to tailor your summary.
5. **Export**: Choose your template and download in PDF, DOCX, or HTML.

---
*Built with ❤️ by CV Studio Engineering*
