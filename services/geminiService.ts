import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CareerProfile, JobBrief, Tone } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants
const MODEL_TEXT = 'gemini-2.5-flash';

export const optimizeSection = async (
  text: string,
  targetRole: string,
  tone: Tone,
  constraints: string[],
  additionalContext?: string
): Promise<string> => {
  try {
    const contextPrompt = additionalContext 
      ? `Additional Context (from user's LinkedIn/Background): "${additionalContext}"\nUse this context to enrich the content where relevant (e.g. adding specific metrics or project details mentioned in the context).` 
      : '';

    const prompt = `
      You are a world-class executive resume editor.
      Rewrite the following resume section content to be more impactful for a "${targetRole}" role.

      Original Content:
      "${text}"

      ${contextPrompt}

      Style & Constraints:
      - Tone: ${tone}
      - Use Australian English spelling (e.g., 'optimise', 'specialise').
      - Constraints: ${constraints.join(', ')}.
      - Do not fabricate numbers. If a claim is strong, keep it.
      - Output ONLY the rewritten text, no conversational filler.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini Optimization Failed:", error);
    return text; // Fallback to original
  }
};

export const analyzeJobDescription = async (
  description: string
): Promise<Partial<JobBrief>> => {
  try {
    const prompt = `
      Analyze the following job description and extract key structured data.
      Return a pure JSON object (no markdown formatting).

      Job Description:
      "${description.slice(0, 3000)}"

      Schema:
      {
        "roleTitle": "string",
        "companyName": "string",
        "extractedKeywords": ["string", "string"],
        "seniority": "Junior" | "Mid" | "Senior" | "Lead" | "Executive"
      }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text;
    if (!text) return {};
    return JSON.parse(text);
  } catch (error) {
    console.error("Job Analysis Failed:", error);
    return {
      roleTitle: "Unknown Role",
      companyName: "Unknown Company",
      extractedKeywords: [],
      seniority: "Mid"
    };
  }
};

export const generateCoverLetter = async (
  profile: CareerProfile,
  jobBrief: JobBrief
): Promise<string> => {
  try {
    const linkedinContext = profile.linkedinContext 
      ? `Additional Background (LinkedIn Posts/Articles): "${profile.linkedinContext}"\nUse insights from this background to add unique personal hooks or professional philosophy if relevant.`
      : '';

    const prompt = `
      Write a tailored cover letter for:
      Candidate: ${profile.basics.name} (${profile.basics.title})
      Target Role: ${jobBrief.roleTitle} at ${jobBrief.companyName}
      Tone: ${jobBrief.tone}

      Resume Summary: ${profile.summary}
      Key Skills: ${profile.skills.map(g => g.items.join(', ')).join(', ')}

      ${linkedinContext}

      Job Context:
      Keywords: ${jobBrief.extractedKeywords.join(', ')}

      Rules:
      - Use Australian English.
      - 300 words maximum.
      - No cliches like "I am writing to apply". Start with a hook.
      - Focus on value delivery.
      - Return only the body of the letter (no address header needed).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
    });

    return response.text || "Could not generate cover letter.";
  } catch (error) {
    console.error("Cover Letter Generation Failed:", error);
    return "Error generating cover letter. Please try again.";
  }
};

export const parseResumeFromText = async (text: string): Promise<Partial<CareerProfile>> => {
  try {
    const prompt = `
      You are an expert resume parser. Extract structured data from the following resume text into a JSON object matching this schema.
      
      Schema:
      {
        "basics": {
          "name": "string", "title": "string", "location": "string", "email": "string", "phone": "string",
          "links": [{ "label": "string", "url": "string" }]
        },
        "summary": "string",
        "experience": [{
          "id": "string", "company": "string", "role": "string", "startDate": "string", "endDate": "string", "location": "string",
          "highlights": [{ "id": "string", "text": "string" }]
        }],
        "skills": [{ "name": "string", "items": ["string"] }],
        "education": [{ "id": "string", "institution": "string", "degree": "string", "year": "string" }],
        "projects": [{ "id": "string", "name": "string", "description": "string", "url": "string", "highlights": ["string"] }],
        "certifications": [{ "id": "string", "name": "string", "issuer": "string", "date": "string" }],
        "publications": [{ "id": "string", "title": "string", "publisher": "string", "date": "string", "url": "string" }],
        "conferences": [{ "id": "string", "name": "string", "event": "string", "date": "string" }]
      }

      Rules:
      - Generate unique IDs (e.g., "exp-1", "edu-1") for array items.
      - If a field is missing, omit it or return empty array.
      - Use Australian English spelling.
      
      Resume Text:
      "${text.slice(0, 15000)}"
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Resume Parsing Failed:", error);
    return {};
  }
};

export const extractInsightsFromLinkedIn = async (text: string): Promise<{ skills?: {name:string, items:string[]}[], projects?: any[] }> => {
  try {
    const prompt = `
      Analyze the following LinkedIn activity text (posts, articles, about section) and extract structured Skills and Projects that are mentioned.

      Schema:
      {
        "skills": [{ "name": "string", "items": ["string"] }],
        "projects": [{ "id": "string", "name": "string", "description": "string", "highlights": ["string"] }]
      }

      Context Text:
      "${text.slice(0, 10000)}"
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("LinkedIn Extraction Failed:", error);
    return {};
  }
};