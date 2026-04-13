import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { claude, CLAUDE_MODEL } from '../lib/claude.js';
import { supabase } from '../lib/supabase.js';
import type { CVProfile, ATSSuggestion, ExperienceEntry, EducationEntry } from '../types/index.js';

/** Parse raw text from PDF or DOCX buffer */
async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    const result = await pdf(buffer);
    return result.text;
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error('Unsupported file type. Please upload PDF or DOCX.');
}

interface ParsedCV {
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  ats_score: number;
  suggestions: ATSSuggestion[];
}

/** Use Claude to extract structured data and score the CV */
async function parseWithClaude(rawText: string): Promise<ParsedCV> {
  const message = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: `You are an expert ATS (Applicant Tracking System) analyzer for the Polish job market.
Analyze the provided CV text and return a JSON object with this exact structure:
{
  "skills": ["skill1", "skill2", ...],          // top 20 technical and soft skills
  "experience": [                                // work experience entries
    { "company": "", "role": "", "start": "", "end": "", "description": "" }
  ],
  "education": [                                 // education entries
    { "institution": "", "degree": "", "field": "", "graduation": "" }
  ],
  "ats_score": 75,                              // 0-100, ATS readability score
  "suggestions": [                              // top 3 improvement suggestions
    { "issue": "", "fix": "", "impact": "high|medium|low" }
  ]
}
Return ONLY valid JSON, no markdown, no explanation.`,
    messages: [{ role: 'user', content: `CV text:\n\n${rawText}` }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response from Claude');

  return JSON.parse(content.text) as ParsedCV;
}

/** Main agent function: parse CV → store in Supabase → return profile */
export async function analyzeCV(
  buffer: Buffer,
  mimeType: string,
  userId: string,
): Promise<CVProfile> {
  const rawText = await extractText(buffer, mimeType);
  const parsed = await parseWithClaude(rawText);

  // TODO: generate embedding using Claude or OpenAI text-embedding-3-small
  // const embedding = await generateEmbedding(rawText);

  const { data, error } = await supabase
    .from('cv_profiles')
    .upsert(
      {
        user_id: userId,
        raw_text: rawText,
        skills: parsed.skills,
        experience: parsed.experience,
        education: parsed.education,
        ats_score: parsed.ats_score,
        suggestions: parsed.suggestions,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) throw error;
  return data as CVProfile;
}
