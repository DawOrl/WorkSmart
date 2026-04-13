import { claude, CLAUDE_MODEL } from '../lib/claude.js';
import { supabase } from '../lib/supabase.js';
import { DEMO_CV, store } from '../demo/data.js';

type LetterStyle = 'formal' | 'conversational' | 'creative';
type Language = 'pl' | 'en';

/** Generate a cover letter for a specific job (Pro feature) */
export async function generateLetter(
  userId: string,
  jobId: string,
  style: LetterStyle,
  language: Language,
): Promise<string> {
  if (process.env.DEMO_MODE === 'true') {
    console.log('[demo] letterWriter → returning pre-written cover letter');
    await new Promise(r => setTimeout(r, 1500));
    const job = (store.job_listings as any[]).find(j => j.id === jobId);
    const company = job?.company ?? 'firmę';
    const title = job?.title ?? 'stanowisko';
    if (language === 'en') {
      return `Dear Hiring Team,

I am writing to express my strong interest in the ${title} position at ${company}. With over 5 years of experience in software development and a proven track record of delivering high-quality solutions, I am confident that my skills align well with your requirements.

Throughout my career I have worked extensively with TypeScript, React, and Node.js — technologies that are central to this role. I have contributed to products used by millions of users and thrive in collaborative, fast-paced environments. At my previous company I led a team that reduced API response times by 40% through thoughtful architectural decisions.

What excites me most about ${company} is your commitment to innovation and user-centric design. I would love to bring my expertise to your team and help build products that make a real difference.

I look forward to the opportunity to discuss how my background can contribute to your goals.

Kind regards,
Jan Kowalski`;
    }
    return `Szanowni Państwo,

Z dużym zainteresowaniem przesyłam swoją kandydaturę na stanowisko ${title} w ${company}. Posiadam ponad 5 lat doświadczenia w tworzeniu oprogramowania i jestem przekonany/a, że moje umiejętności doskonale odpowiadają Państwa wymaganiom.

W trakcie swojej kariery intensywnie pracowałem/am z TypeScript, React i Node.js — technologiami kluczowymi dla tej roli. Uczestniczyłem/am w budowie produktów używanych przez miliony użytkowników i dobrze odnajduję się w dynamicznym środowisku pracy. W poprzedniej firmie poprowadziłem/am zespół, który dzięki przemyślanym decyzjom architektonicznym skrócił czas odpowiedzi API o 40%.

Szczególnie interesuje mnie możliwość dołączenia do ${company} ze względu na Państwa podejście do innowacji i skupienie na potrzebach użytkownika. Chętnie wniosę swoje doświadczenie do zespołu i przyczynię się do tworzenia produktów, które realnie zmieniają życie ludzi.

Będę wdzięczny/a za możliwość rozmowy o tym, w jaki sposób moje doświadczenie może wesprzeć Państwa cele.

Z poważaniem,
Jan Kowalski`;
  }

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
