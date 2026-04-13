import { supabase } from '../lib/supabase.js';
import { claude, CLAUDE_MODEL } from '../lib/claude.js';
import type { MatchScore } from '../types/index.js';

interface MatchResult {
  score: number;
  missing_skills: string[];
  matching_skills: string[];
  recommendation: string;
}

/** Use Claude to compute semantic match between CV and job description */
async function computeMatch(cvSkills: string[], jobDescription: string): Promise<MatchResult> {
  const message = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 512,
    system: `You are a job match analyzer for the Polish job market.
Compare the candidate's skills with the job description and return JSON:
{
  "score": 75,                         // 0-100 match percentage
  "missing_skills": ["skill1", ...],   // skills required but candidate doesn't have
  "matching_skills": ["skill2", ...],  // skills candidate has that match requirements
  "recommendation": "short text"       // 1-2 sentence recommendation in Polish
}
Return ONLY valid JSON.`,
    messages: [{
      role: 'user',
      content: `Candidate skills: ${cvSkills.join(', ')}\n\nJob description:\n${jobDescription}`,
    }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response');
  return JSON.parse(content.text) as MatchResult;
}

/** Compute match scores for all new job listings for a given user */
export async function computeMatches(userId: string): Promise<number> {
  // Get user's CV profile
  const { data: cv } = await supabase
    .from('cv_profiles')
    .select('skills, raw_text')
    .eq('user_id', userId)
    .single();

  if (!cv) throw new Error('No CV profile found for user');

  // Get jobs not yet scored for this user
  const { data: scored } = await supabase
    .from('match_scores')
    .select('job_id')
    .eq('user_id', userId);

  const scoredIds = (scored ?? []).map(s => s.job_id as string);

  let query = supabase
    .from('job_listings')
    .select('id, description, requirements')
    .eq('is_active', true)
    .limit(50);

  if (scoredIds.length > 0) {
    query = query.not('id', 'in', `(${scoredIds.join(',')})`);
  }

  const { data: jobs } = await query;
  if (!jobs || jobs.length === 0) return 0;

  let count = 0;
  for (const job of jobs) {
    try {
      const jobText = [job.description ?? '', ...(job.requirements ?? [])].join('\n');
      const result = await computeMatch(cv.skills as string[], jobText);

      await supabase.from('match_scores').upsert({
        user_id: userId,
        job_id: job.id,
        score: result.score,
        missing_skills: result.missing_skills,
        matching_skills: result.matching_skills,
        recommendation: result.recommendation,
        computed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,job_id' });

      count++;
    } catch (err) {
      console.error(`[matchAgent] Failed for job ${job.id}:`, err);
    }
  }

  return count;
}
