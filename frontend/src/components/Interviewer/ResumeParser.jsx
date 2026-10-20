import React, { useState } from 'react';

const API = 'http://localhost:5000/api/interviews';

const ROLE_OPTIONS = [
  'Software Development (Product Based)',
  'Software Development (Service Based)',
  'AI/ML Engineering',
  'DevOps Engineering',
  'Cloud Solutions Architect',
  'Full Stack Developer'
];

const scoreColor = (s) => (s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444');

const chipStyle = (color, active = true) => ({
  display: 'inline-block',
  padding: '0.25rem 0.65rem',
  margin: '0 0.4rem 0.4rem 0',
  borderRadius: '999px',
  fontSize: '0.75rem',
  color: active ? '#fff' : 'var(--text-muted)',
  background: active ? `${color}33` : 'transparent',
  border: `1px solid ${active ? color : 'var(--glass-border)'}`
});

function ScoreRing({ score }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" role="img" aria-label={`ATS score ${score} out of 100`}>
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
      <circle
        cx="55" cy="55" r={r} fill="none" stroke={scoreColor(score)} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (c * score) / 100} transform="rotate(-90 55 55)"
      />
      <text x="55" y="62" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff">{score}</text>
    </svg>
  );
}

const sectionTitle = (color) => ({ fontSize: '0.95rem', marginBottom: '0.5rem', color });
const mutedText = { fontSize: '0.8rem', marginBottom: '0.75rem', color: 'var(--text-muted)' };

export default function ResumeParser({ user, token, onGapsUpdated }) {
  const getDefaultRole = () => {
    if (user?.targetRole === 'AI/ML') return 'AI/ML Engineering';
    if (user?.targetRole === 'DevOps') return 'DevOps Engineering';
    if (user?.targetRole === 'Cloud') return 'Cloud Solutions Architect';
    if (user?.targetRole === 'Full Stack') return 'Full Stack Developer';
    return 'Software Development (Product Based)';
  };

  const [targetRole, setTargetRole] = useState(getDefaultRole());
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [error, setError] = useState('');

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const processFile = async (selectedFile) => {
    setFile(selectedFile);
    setParsing(true);
    setError('');
    setGenerated(null);
    setSelectedKeywords([]);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('targetRole', targetRole);
    formData.append('company', company.trim());
    formData.append('jobDescription', jobDescription.trim());

    try {
      const response = await fetch(`${API}/upload-resume`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error analysing resume.');
      setParsedData({ ...data, skillGaps: data.skillGaps.map((g) => ({ ...g, checked: false })) });
    } catch (err) {
      setParsedData(null);
      setError(err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleCheckGap = (index) => {
    const updatedGaps = [...parsedData.skillGaps];
    updatedGaps[index] = { ...updatedGaps[index], checked: !updatedGaps[index].checked };
    setParsedData({ ...parsedData, skillGaps: updatedGaps });
    if (onGapsUpdated) onGapsUpdated();
  };

  const toggleKeyword = (name) => {
    setGenerated(null);
    setSelectedKeywords((prev) => (prev.includes(name) ? prev.filter((k) => k !== name) : [...prev, name]));
  };

  const generateResume = async () => {
    setGenerating(true);
    setError('');
    try {
      const response = await fetch(`${API}/generate-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          profile: parsedData.profile,
          role: targetRole,
          company: company.trim(),
          extraKeywords: selectedKeywords
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not generate resume.');
      setGenerated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const baseName = `${(parsedData?.profile?.name || 'Resume').trim().replace(/\s+/g, '_')}_ATS_Resume`;

  const download = (content, filename, type) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printResume = () => {
    const w = window.open('', '_blank');
    if (!w) {
      setError('Allow pop-ups to print or save the resume as PDF.');
      return;
    }
    w.document.write(generated.html);
    w.document.close();
    w.focus();
    w.print();
  };

  const missing = parsedData?.missingKeywords || [];
  const priorityBadge = (p) => (p === 'High' ? 'badge-danger' : p === 'Medium' ? 'badge-warning' : 'badge-primary');

  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        AI Resume Analyzer & ATS Checker
      </h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Pick your target role, add the company and job description if you have them, then upload your resume (PDF, DOCX or TXT).
        You get an ATS score, missing keywords, fixes, and a new ATS-friendly resume.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="rp-role" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Target role
          </label>
          <select
            id="rp-role"
            className="glass-input"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            style={{ background: '#0a0915', height: '38px', padding: '0 0.75rem' }}
            disabled={parsing}
          >
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="rp-company" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Company (optional)
          </label>
          <input
            id="rp-company"
            className="glass-input"
            type="text"
            placeholder="e.g. Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={parsing}
            style={{ height: '38px', padding: '0 0.75rem' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="rp-jd" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Job description (optional). Leave empty to check against the role's standard requirements.
        </label>
        <textarea
          id="rp-jd"
          className="glass-input"
          rows={4}
          placeholder="Paste the job description here to get exact missing keywords"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={parsing}
          style={{ padding: '0.6rem 0.75rem', resize: 'vertical' }}
        />
      </div>

      {error && <div className="badge badge-danger" style={{ display: 'block', padding: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

      {!parsedData && !parsing && (
        <div className="upload-zone" onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => document.getElementById('resume-file-input').click()}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
          <strong>Drag & drop resume, or click to browse</strong>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Supports PDF, DOCX or TXT up to 5MB</p>
          <input type="file" id="resume-file-input" style={{ display: 'none' }} onChange={handleFileChange} accept=".pdf,.txt,.docx" />
        </div>
      )}

      {parsing && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ height: '100%', width: '60%', background: 'var(--primary)', borderRadius: '2px', animation: 'pulseGlow 1.5s infinite' }}></div>
          </div>
          <h4>Reading your resume and matching keywords...</h4>
        </div>
      )}

      {parsedData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', paddingBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
            <div>
              <strong style={{ color: '#fff' }}>{parsedData.fileName}</strong>
              <p style={{ fontSize: '0.8rem' }}>
                Checked for: <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{parsedData.detectedRoleMatch}</span>
                {parsedData.company ? ` at ${parsedData.company}` : ''}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {parsedData.analysisBasis === 'job-description'
                  ? 'Keywords come from your job description plus the role requirements.'
                  : 'No job description added, so keywords come from the role requirements. Add one for a tailored result.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => file && processFile(file)}>
                Re-analyze
              </button>
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => { setParsedData(null); setGenerated(null); }}>
                Re-upload
              </button>
            </div>
          </div>

          {/* ATS score */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <ScoreRing score={parsedData.atsScore} />
            <div>
              <h4 style={{ color: scoreColor(parsedData.atsScore), marginBottom: '0.25rem' }}>{parsedData.atsLabel}</h4>
              <p style={{ fontSize: '0.85rem', color: '#fff' }}>Keyword match: {parsedData.atsBreakdown.keywordScore}%</p>
              <p style={{ fontSize: '0.85rem', color: '#fff' }}>Format and structure: {parsedData.atsBreakdown.formatScore}%</p>
            </div>
          </div>

          {/* ATS checklist */}
          <div>
            <h4 style={sectionTitle('var(--secondary)')}>ATS Format Checks</h4>
            <div style={{ display: 'grid', gap: '0.4rem' }}>
              {parsedData.atsChecks.map((c) => (
                <div key={c.id} className="checklist-item" style={{ justifyContent: 'flex-start', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ color: c.pass ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{c.pass ? '✓' : '✗'}</span>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>{c.label}</span>
                    {!c.pass && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.tip}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <h4 style={sectionTitle('#22c55e')}>Keywords Found ({parsedData.matchedKeywords.length})</h4>
            <div>
              {parsedData.matchedKeywords.length === 0 && <p style={mutedText}>No role keywords found in your resume.</p>}
              {parsedData.matchedKeywords.map((k) => (
                <span key={k.name} style={chipStyle('#22c55e')}>{k.name}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={sectionTitle('#ef4444')}>Missing Keywords ({missing.length})</h4>
            <p style={mutedText}>
              Tick only the ones you genuinely have experience with. They will be added to your generated resume.
            </p>
            <div>
              {missing.length === 0 && <p style={mutedText}>Nothing missing. Your resume covers every keyword we checked.</p>}
              {missing.map((k) => {
                const on = selectedKeywords.includes(k.name);
                return (
                  <button
                    key={k.name}
                    type="button"
                    onClick={() => toggleKeyword(k.name)}
                    aria-pressed={on}
                    style={{ ...chipStyle(k.priority === 'High' ? '#ef4444' : k.priority === 'Medium' ? '#f59e0b' : '#6366f1', on), cursor: 'pointer', font: 'inherit', fontSize: '0.75rem' }}
                  >
                    {on ? '✓ ' : '+ '}{k.name}{k.fromJD ? ' (from JD)' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Improvements */}
          {parsedData.improvements.length > 0 && (
            <div>
              <h4 style={sectionTitle('var(--accent)')}>Improvements</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {parsedData.improvements.map((imp, idx) => (
                  <div key={idx} className="checklist-item" style={{ justifyContent: 'space-between', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#fff', textAlign: 'left' }}>{imp.text}</span>
                    <span className={`badge ${priorityBadge(imp.priority)}`} style={{ fontSize: '0.65rem' }}>{imp.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill gaps */}
          {parsedData.skillGaps.length > 0 && (
            <div>
              <h4 style={sectionTitle('var(--secondary)')}>What to Learn (Skill Gaps)</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {parsedData.skillGaps.map((gap, idx) => (
                  <div key={idx} className="checklist-item" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" className="checklist-checkbox" checked={gap.checked || false} onChange={() => handleCheckGap(idx)} />
                      <span style={{ fontSize: '0.85rem', color: gap.checked ? 'var(--text-muted)' : '#fff', textDecoration: gap.checked ? 'line-through' : 'none' }}>
                        {gap.skill}
                      </span>
                    </div>
                    <span className={`badge ${priorityBadge(gap.priority)}`} style={{ fontSize: '0.65rem' }}>{gap.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {parsedData.roadmapRecommendations.length > 0 && (
            <div>
              <h4 style={sectionTitle('var(--primary)')}>Action Plan Steps</h4>
              <div className="roadmap-timeline">
                {parsedData.roadmapRecommendations.map((rec, idx) => (
                  <div key={idx} className="roadmap-step">
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>Step {idx + 1}</span>
                    <p style={{ fontSize: '0.85rem', color: '#fff' }}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate resume */}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
            <h4 style={sectionTitle('var(--accent)')}>Generate a New ATS-Friendly Resume</h4>
            <p style={mutedText}>
              Builds a single-column resume with standard headings, plain bullets and no tables or icons, using only what is in your resume plus the keywords you ticked above.
            </p>
            <button className="btn btn-primary" onClick={generateResume} disabled={generating}>
              {generating ? 'Generating...' : 'Generate new resume'}
            </button>

            {generated && (
              <div style={{ marginTop: '1rem' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', lineHeight: 1.5, color: '#fff', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem', maxHeight: '360px', overflow: 'auto' }}>
                  {generated.text}
                </pre>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  <button className="btn btn-secondary" onClick={() => download(generated.text, `${baseName}.txt`, 'text/plain')}>Download .txt</button>
                  <button className="btn btn-secondary" onClick={() => download(generated.html, `${baseName}.doc`, 'application/msword')}>Download .doc</button>
                  <button className="btn btn-secondary" onClick={printResume}>Print / Save as PDF</button>
                  <button className="btn btn-secondary" onClick={() => navigator.clipboard?.writeText(generated.text)}>Copy text</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
