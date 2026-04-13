import { claude, CLAUDE_MODEL } from '../lib/claude.js';
import { supabase } from '../lib/supabase.js';

type LetterStyle = 'formal' | 'conversational' | 'creative';
type Language = 'pl' | 'en';

/** Generate a cover letter for a specific job (Pro feature) */
export async function generateLetter(
  userId: string,
  jobId: string,
  style: LetterStyle,
  language: Language,
): Promise<string> {
  // Fetch CV profile
  const { data: cv } = await supabase
    .from('cv_profiles')
    .select('skills, experience, education, raw_text')
    .eq('user_id', userId)
    .single();

  if (!cv) throw new Error('No CV profile found');

  // Fetch job listing
  const { data: job } = await supabase
    .from('job_listings')
    .select('title, company, description, requirements')
    .eq('id', jobId)
    .single();

  if (!job) throw new Error('Job not found');

  const styleGuide = {
    formal: 'professional, formal tone suitable for corporate environments',
    conversational: 'friendly, engaging tone that feels authentic and personable',
    creative: 'creative, memorable tone that stands out – suitable for marketing, design, or startup roles',
  }[style];

  const langInstruction = language === 'pl'
    ? 'Write the cover letter in Polish.'
    : 'Write the cover letter in English.';

  const message = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: `You are an expert cover letter writer specializing in the Polish job market.
Write a compelling cover letter using a ${styleGuide}.
${langInstruction}
- Use keywords from the job description naturally
- Highlight the most relevant skills and experience
- Keep it to 3-4 paragraphs
- Do NOT include placeholders like [Your Name] – write the letter as if from the candidate
- Return ONLY the letter text, no title, no metadata`,
    messages: [{
      role: 'user',
      content: `
Job: ${job.title} at ${job.company ?? 'the company'}
Job description: ${job.description ?? ''}
Requirements: ${(job.requirements as string[] ?? []).join(', ')}

Candidate skills: ${(cv.skills as string[]).join(', ')}
Experience: ${JSON.stringify(cv.experience)}
Education: ${JSON.stringify(cv.education)}
`,
    }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response from Claude');
  return content.text;
}
