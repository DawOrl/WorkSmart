import { useEffect, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { useCV } from '@/hooks/useCV';

export default function CVPage() {
  const { cvProfile, uploading, error, uploadCV, loadCV } = useCV();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadCV(); }, []);

  const handleFile = (file: File) => {
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      alert('Obsługiwane formaty: PDF, DOCX');
      return;
    }
    uploadCV(file);
  };

  const impactColor = (impact: string) =>
    impact === 'high' ? 'text-red-600 bg-red-50' :
    impact === 'medium' ? 'text-yellow-600 bg-yellow-50' :
    'text-green-600 bg-green-50';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Moje CV</h1>
        <p className="text-muted-foreground">Prześlij CV, aby AI przeanalizowało je i obliczyło dopasowania.</p>
      </div>

      {/* Upload zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors ${uploading ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'}`}
      >
        <Upload className={`h-10 w-10 ${uploading ? 'animate-bounce text-primary' : 'text-muted-foreground'}`} />
        <div className="text-center">
          <p className="font-semibold">{uploading ? 'Analizuję CV...' : 'Przeciągnij plik lub kliknij'}</p>
          <p className="text-sm text-muted-foreground">PDF lub DOCX, max. 10 MB</p>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* CV Analysis results */}
      {cvProfile && (
        <div className="space-y-4">
          {/* ATS Score */}
          <div className="rounded-xl border bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">ATS Score</h2>
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-bold ${cvProfile.ats_score >= 70 ? 'text-green-600' : cvProfile.ats_score >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {cvProfile.ats_score}%
                </span>
              </div>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all ${cvProfile.ats_score >= 70 ? 'bg-green-500' : cvProfile.ats_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${cvProfile.ats_score}%` }}
              />
            </div>
          </div>

          {/* Suggestions */}
          {cvProfile.suggestions.length > 0 && (
            <div className="rounded-xl border bg-background p-6">
              <h2 className="mb-3 font-semibold">Sugestie poprawek</h2>
              <div className="space-y-3">
                {cvProfile.suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">{s.issue}</p>
                      <p className="text-sm text-muted-foreground">{s.fix}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${impactColor(s.impact)}`}>
                        {s.impact === 'high' ? 'Wysoki wpływ' : s.impact === 'medium' ? 'Średni wpływ' : 'Niski wpływ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvProfile.skills.length > 0 && (
            <div className="rounded-xl border bg-background p-6">
              <h2 className="mb-3 font-semibold">Wykryte umiejętności ({cvProfile.skills.length})</h2>
              <div className="flex flex-wrap gap-2">
                {cvProfile.skills.map(skill => (
                  <span key={skill} className="flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-xs font-medium">
                    <Star className="h-3 w-3 text-yellow-500" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle className="h-4 w-4 shrink-0" />
            CV przeanalizowane. Przejdź do ofert, by zobaczyć swoje dopasowania.
          </div>
        </div>
      )}
    </div>
  );
}
