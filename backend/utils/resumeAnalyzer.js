// utils/resumeAnalyzer.js
// Real resume analysis: text extraction, keyword match, ATS checks, resume generation.

const kw = (name, weight, aliases = []) => ({
  name,
  weight,
  aliases: [name.toLowerCase(), ...aliases.map((a) => a.toLowerCase())]
});

const ROLE_KEYWORDS = {
  'Software Development': [
    kw('Data Structures', 3, ['dsa', 'algorithms', 'leetcode']),
    kw('Object-Oriented Programming', 3, ['oop', 'oops', 'object oriented']),
    kw('System Design', 3, ['hld', 'lld', 'low level design', 'high level design']),
    kw('DBMS', 2, ['sql', 'mysql', 'postgresql', 'database']),
    kw('REST APIs', 2, ['rest api', 'restful']),
    kw('Operating Systems', 2, ['os concepts']),
    kw('Computer Networks', 1, ['networking']),
    kw('Design Patterns', 2, ['solid', 'singleton', 'factory pattern']),
    kw('Caching', 2, ['redis', 'memcached']),
    kw('Multithreading', 2, ['concurrency', 'multi-threading', 'threads']),
    kw('Unit Testing', 1, ['junit', 'pytest', 'jest']),
    kw('Microservices', 2, ['microservice']),
    kw('Git', 2, ['github', 'version control']),
    kw('Docker', 1),
    kw('AWS', 1, ['amazon web services']),
    kw('Java', 1),
    kw('Python', 1),
    kw('C++', 1)
  ],
  'Software Development (Service Based)': [
    kw('SDLC', 3, ['software development life cycle']),
    kw('Agile', 3),
    kw('Scrum', 2),
    kw('Jira', 2),
    kw('Git', 3, ['github', 'version control']),
    kw('SQL', 3, ['mysql', 'postgresql']),
    kw('Java', 2),
    kw('Python', 2),
    kw('Spring Boot', 2, ['spring']),
    kw('REST APIs', 2, ['rest api', 'restful']),
    kw('Testing', 2, ['unit testing', 'manual testing', 'junit', 'selenium']),
    kw('Debugging', 1),
    kw('Documentation', 1),
    kw('Communication', 1, ['teamwork', 'collaboration']),
    kw('AWS', 1, ['azure', 'cloud'])
  ],
  'AI/ML': [
    kw('Python', 3),
    kw('Machine Learning', 3, ['ml']),
    kw('Deep Learning', 3, ['neural network', 'cnn', 'rnn']),
    kw('PyTorch', 3),
    kw('TensorFlow', 2, ['keras']),
    kw('Scikit-learn', 2, ['sklearn']),
    kw('NumPy', 1),
    kw('Pandas', 2),
    kw('NLP', 2, ['natural language processing']),
    kw('Computer Vision', 2, ['opencv', 'image classification']),
    kw('LLMs', 2, ['llm', 'large language model', 'prompt engineering', 'fine-tuning']),
    kw('RAG', 2, ['retrieval augmented generation', 'retrieval-augmented generation']),
    kw('Model Evaluation', 2, ['f1-score', 'f1 score', 'precision', 'recall', 'confusion matrix']),
    kw('MLOps', 2, ['model deployment', 'sagemaker']),
    kw('Docker', 2),
    kw('FastAPI', 1, ['flask']),
    kw('Vector Databases', 1, ['pinecone', 'milvus', 'faiss', 'chroma']),
    kw('SQL', 1),
    kw('Git', 1, ['github'])
  ],
  DevOps: [
    kw('Docker', 3),
    kw('Kubernetes', 3, ['k8s', 'eks']),
    kw('CI/CD', 3, ['cicd', 'continuous integration', 'continuous delivery']),
    kw('GitHub Actions', 2, ['jenkins', 'gitlab ci']),
    kw('Terraform', 3),
    kw('Ansible', 2),
    kw('AWS', 2, ['amazon web services']),
    kw('Linux', 3),
    kw('Shell Scripting', 2, ['bash', 'shell script']),
    kw('Prometheus', 2),
    kw('Grafana', 2),
    kw('Monitoring', 2, ['logging', 'observability']),
    kw('Git', 2, ['github']),
    kw('Networking', 1, ['tcp/ip', 'dns', 'load balancer']),
    kw('Python', 1)
  ],
  Cloud: [
    kw('AWS', 3, ['amazon web services']),
    kw('Azure', 1),
    kw('GCP', 1, ['google cloud']),
    kw('VPC', 3, ['subnet', 'nat gateway']),
    kw('IAM', 3),
    kw('Serverless', 2, ['lambda', 'api gateway']),
    kw('EC2', 2),
    kw('S3', 2),
    kw('High Availability', 2, ['multi-region', 'fault tolerance', 'auto scaling']),
    kw('Terraform', 2, ['cloudformation', 'infrastructure as code']),
    kw('Cloud Security', 2, ['encryption', 'kms']),
    kw('Cost Optimization', 1),
    kw('Docker', 1),
    kw('Kubernetes', 1),
    kw('Linux', 1)
  ],
  'Full Stack': [
    kw('JavaScript', 3, ['es6']),
    kw('React', 3, ['react.js', 'reactjs']),
    kw('Node.js', 3, ['nodejs', 'node js']),
    kw('Express', 2, ['express.js', 'expressjs']),
    kw('MongoDB', 2),
    kw('SQL', 2, ['mysql', 'postgresql']),
    kw('REST APIs', 3, ['rest api', 'restful']),
    kw('TypeScript', 2),
    kw('Next.js', 2, ['nextjs']),
    kw('State Management', 2, ['redux', 'zustand', 'context api']),
    kw('GraphQL', 1),
    kw('Authentication', 2, ['jwt', 'oauth']),
    kw('Web Security', 2, ['cors', 'csrf', 'xss']),
    kw('HTML', 1),
    kw('CSS', 1, ['tailwind']),
    kw('Git', 2, ['github']),
    kw('Docker', 1),
    kw('Testing', 1, ['jest', 'cypress'])
  ]
};

const ROLE_TITLES = {
  'Software Development': 'Software Development Engineer',
  'Software Development (Service Based)': 'Software Engineer',
  'AI/ML': 'AI/ML Engineer',
  DevOps: 'DevOps Engineer',
  Cloud: 'Cloud Engineer',
  'Full Stack': 'Full Stack Developer'
};

function normalizeRole(raw = '') {
  const r = String(raw).toLowerCase();
  if (r.includes('service')) return 'Software Development (Service Based)';
  if (r.includes('ai/ml') || r.includes('machine learning')) return 'AI/ML';
  if (r.includes('devops')) return 'DevOps';
  if (r.includes('cloud')) return 'Cloud';
  if (r.includes('full stack')) return 'Full Stack';
  return 'Software Development';
}

// ---------- text helpers ----------
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasTerm = (text, term) =>
  new RegExp(`(^|[^a-z0-9+#])${escapeRe(term)}($|[^a-z0-9+#])`, 'i').test(text);
const hasKeyword = (text, k) => k.aliases.some((a) => hasTerm(text, a));

const BULLET_RE = /^\s*[•●▪◦·*–—-]\s+/;

const SECTION_PATTERNS = {
  summary: /^(professional\s+)?(summary|objective|profile)$|^career objective$|^about me$/i,
  education: /^(education|academics?|academic (background|qualifications?))$/i,
  skills: /^((technical|key|core)\s+)?skills(\s*(&|and)\s*tools)?$|^technical (expertise|proficiency)$|^tech stack$/i,
  experience: /^((work|professional|industrial)\s+)?(experience|internships?)(\s*(&|and)\s*(internships?|training))?$|^work history$|^employment( history)?$/i,
  projects: /^((academic|personal|key|major)\s+)?projects?$/i,
  certifications: /^(certifications?|certificates?|courses?)(\s*(&|and)\s*(achievements?|awards?))?$/i,
  achievements: /^(achievements?|awards?|accomplishments?|honou?rs|extracurriculars?( activities)?|positions of responsibility)$/i
};

function headingKey(line) {
  const clean = line.replace(/[:|_=\-–—•●▪◦·*]+\s*$/g, '').replace(/^[\s|_=\-–—•●▪◦·*]+/g, '').trim();
  if (!clean || clean.length > 40) return null;
  return Object.keys(SECTION_PATTERNS).find((k) => SECTION_PATTERNS[k].test(clean)) || null;
}

function splitSections(text) {
  const sections = { header: [] };
  let current = 'header';
  text.split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    const key = headingKey(line);
    if (key) {
      current = key;
      if (!sections[current]) sections[current] = [];
    } else {
      sections[current].push(line);
    }
  });
  return sections;
}

const cleanText = (t = '') =>
  t.replace(/\r/g, '\n').replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

const ACTION_VERBS = [
  'built', 'developed', 'designed', 'implemented', 'created', 'led', 'optimized', 'optimised', 'improved',
  'reduced', 'increased', 'deployed', 'automated', 'integrated', 'engineered', 'architected', 'launched',
  'managed', 'analyzed', 'analysed', 'trained', 'migrated', 'wrote', 'achieved', 'delivered', 'collaborated'
];

// ---------- extraction ----------
async function extractText(file) {
  const name = (file.originalname || '').toLowerCase();
  let text = '';
  if (name.endsWith('.pdf') || file.mimetype === 'application/pdf') {
    // pdf-parse v2 API (needs Node 20+). v1 fails on some PDFs with "bad XRef entry".
    const { PDFParse } = require('pdf-parse');
    const parser = new PDFParse({ data: file.buffer });
    try {
      text = (await parser.getText()).text;
    } finally {
      await parser.destroy();
    }
    text = text.replace(/^--\s*\d+\s+of\s+\d+\s*--$/gm, '');
  } else if (name.endsWith('.docx')) {
    const mammoth = require('mammoth');
    text = (await mammoth.extractRawText({ buffer: file.buffer })).value;
  } else if (name.endsWith('.txt')) {
    text = file.buffer.toString('utf8');
  } else {
    throw new Error('Unsupported file type. Upload a PDF, DOCX or TXT resume.');
  }
  return cleanText(text);
}

// ---------- keyword analysis ----------
function buildKeywordList(roleKey, jobDescription) {
  const list = ROLE_KEYWORDS[roleKey].map((k) => ({ ...k, fromJD: false }));
  const jd = cleanText(jobDescription || '');
  if (!jd) return list;

  // Bump role keywords that the JD explicitly mentions
  list.forEach((k) => {
    if (hasKeyword(jd, k)) {
      k.weight = 3;
      k.fromJD = true;
    }
  });

  // Add skills the JD mentions that this role list doesn't cover
  const seen = new Set(list.map((k) => k.name));
  Object.values(ROLE_KEYWORDS).flat().forEach((k) => {
    if (!seen.has(k.name) && hasKeyword(jd, k)) {
      seen.add(k.name);
      list.push({ ...k, weight: 3, fromJD: true });
    }
  });
  return list;
}

// ---------- ATS format checks ----------
function runFormatChecks(text, sections) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const lines = text.split('\n');
  const bulletLines = lines.filter((l) => BULLET_RE.test(l));
  const verbLines = lines.filter((l) => {
    const first = l.replace(BULLET_RE, '').trim().split(/\s+/)[0] || '';
    return ACTION_VERBS.includes(first.toLowerCase());
  });
  const metrics = text.match(/\d+(\.\d+)?\s?%|\b\d+(\.\d+)?\s?(x|k|ms|users|requests|records|students|customers|models|apis?)\b/gi) || [];
  const odd = (text.match(/[^\x00-\x7F•●▪◦·–—’‘“”…]/g) || []).length;
  const hasWork = (sections.experience || []).length > 0 || (sections.projects || []).length > 0;

  const defs = [
    ['readable', 'Text can be read by ATS', text.length >= 150, 3, 'Your file has almost no selectable text. Export it as a text-based PDF or DOCX, not a scanned image.'],
    ['email', 'Email address present', /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text), 2, 'Add a professional email address at the top.'],
    ['phone', 'Phone number present', /\+?\d[\d\s().-]{8,}\d/.test(text), 1, 'Add a phone number in the header.'],
    ['links', 'LinkedIn or GitHub link present', /linkedin\.com|github\.com/i.test(text), 1, 'Add your LinkedIn and GitHub profile links.'],
    ['education', 'Education section found', (sections.education || []).length > 0, 2, 'Add a section titled exactly "Education".'],
    ['skills', 'Skills section found', (sections.skills || []).length > 0, 2, 'Add a section titled "Skills" or "Technical Skills" so ATS can read your keywords.'],
    ['work', 'Projects or Experience section found', hasWork, 3, 'Add a "Projects" or "Experience" section with standard heading names.'],
    ['length', 'Length is 250-900 words', words >= 250 && words <= 900, 2, words < 250 ? 'Resume is too short. Add project details and measurable results.' : 'Resume is too long. Trim it to one or two pages.'],
    ['bullets', 'Uses bullet points', bulletLines.length >= 4, 1, 'Use short bullet points for projects and experience.'],
    ['verbs', 'Bullets start with action verbs', verbLines.length >= 4, 2, 'Start bullets with action verbs such as Built, Designed, Optimized.'],
    ['metrics', 'Shows measurable results', metrics.length >= 2, 2, 'Add numbers to your bullets, for example "reduced load time by 30%".'],
    ['clean', 'No unusual symbols or icons', odd / Math.max(text.length, 1) <= 0.03, 1, 'Remove icons, emojis and special symbols. ATS may misread them.']
  ];
  return defs.map(([id, label, pass, weight, tip]) => ({ id, label, pass: !!pass, weight, tip }));
}

// ---------- main analysis ----------
function analyzeResume({ text, role, company = '', jobDescription = '' }) {
  const clean = cleanText(text);
  if (clean.length < 50) {
    throw new Error('Could not read any text from this file. Upload a text-based PDF, DOCX or TXT.');
  }
  const roleKey = normalizeRole(role);
  const sections = splitSections(clean);
  const keywords = buildKeywordList(roleKey, jobDescription);

  const matched = keywords.filter((k) => hasKeyword(clean, k));
  const missing = keywords.filter((k) => !hasKeyword(clean, k)).sort((a, b) => b.weight - a.weight);

  const totalW = keywords.reduce((s, k) => s + k.weight, 0);
  const matchedW = matched.reduce((s, k) => s + k.weight, 0);
  const keywordScore = Math.round((matchedW / totalW) * 100);

  const checks = runFormatChecks(clean, sections);
  const fmtTotal = checks.reduce((s, c) => s + c.weight, 0);
  const fmtPass = checks.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0);
  const formatScore = Math.round((fmtPass / fmtTotal) * 100);

  const atsScore = Math.round(keywordScore * 0.6 + formatScore * 0.4);
  const atsLabel = atsScore >= 75 ? 'ATS Friendly' : atsScore >= 50 ? 'Needs Work' : 'Not ATS Friendly';

  const priority = (w) => (w >= 3 ? 'High' : w === 2 ? 'Medium' : 'Low');
  const improvements = [
    ...checks.filter((c) => !c.pass).map((c) => ({ text: c.tip, priority: c.weight >= 3 ? 'High' : c.weight === 2 ? 'Medium' : 'Low' })),
    ...missing.slice(0, 4).map((k) => ({
      text: `Add "${k.name}" to your Skills section and show it in a project bullet, but only if you have really used it.`,
      priority: priority(k.weight)
    }))
  ];

  const emailMatch = clean.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = clean.match(/\+?\d[\d\s().-]{8,}\d/);
  const links = (clean.match(/(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com|github\.com)\/[^\s,|)]+/gi) || []).slice(0, 3);
  const nameLine = (sections.header || []).find((l) => !/@|\d{5,}|https?:|linkedin|github/i.test(l) && l.length <= 50) || '';

  const projects = (sections.projects || [])
    .filter((l) => !BULLET_RE.test(l) && l.length <= 80)
    .slice(0, 3);

  return {
    company: company.trim(),
    detectedRoleMatch: `${ROLE_TITLES[roleKey]} (${atsScore}% ATS match)`,
    analysisBasis: jobDescription.trim() ? 'job-description' : 'role',
    atsScore,
    atsLabel,
    atsBreakdown: { keywordScore, formatScore },
    atsChecks: checks.map(({ id, label, pass, tip }) => ({ id, label, pass, tip })),
    matchedKeywords: matched.map((k) => ({ name: k.name, fromJD: k.fromJD })),
    missingKeywords: missing.map((k) => ({ name: k.name, priority: priority(k.weight), fromJD: k.fromJD })),
    improvements,
    parsedSkills: matched.map((k) => k.name),
    projects,
    skillGaps: missing.slice(0, 8).map((k) => ({ skill: k.name, priority: priority(k.weight) })),
    roadmapRecommendations: missing.slice(0, 3).map((k) => `Learn ${k.name} fundamentals and build one small project that uses it.`),
    resumeAdditions: missing.slice(0, 3).map((k) => `Mention ${k.name} in your Skills section and in a project bullet, if you have hands-on experience.`),
    profile: {
      name: nameLine,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0].trim() : '',
      links,
      matched: matched.map((k) => k.name),
      sections: {
        summary: sections.summary || [],
        skills: sections.skills || [],
        experience: sections.experience || [],
        projects: sections.projects || [],
        education: sections.education || [],
        certifications: sections.certifications || [],
        achievements: sections.achievements || []
      }
    }
  };
}

// ---------- resume generation ----------
const SECTION_ORDER = [
  ['summary', 'SUMMARY'],
  ['skills', 'TECHNICAL SKILLS'],
  ['experience', 'EXPERIENCE'],
  ['projects', 'PROJECTS'],
  ['education', 'EDUCATION'],
  ['certifications', 'CERTIFICATIONS'],
  ['achievements', 'ACHIEVEMENTS']
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const asLines = (v) => (Array.isArray(v) ? v : []).map((l) => String(l).slice(0, 300)).slice(0, 80);
const normBullet = (l) => (BULLET_RE.test(l) ? `- ${l.replace(BULLET_RE, '').trim()}` : l.trim());

function generateResume({ profile = {}, role, company = '', extraKeywords = [] }) {
  const roleKey = normalizeRole(role);
  const title = ROLE_TITLES[roleKey];
  const sec = {};
  Object.keys(SECTION_PATTERNS).forEach((k) => {
    sec[k] = asLines(profile.sections && profile.sections[k]).map(normBullet);
  });

  const matched = asLines(profile.matched);
  const extras = asLines(extraKeywords);

  // Skills: keep the candidate's own lines, add confirmed keywords not already written
  const skillsText = sec.skills.join(' ');
  const toAdd = [...new Set([...matched, ...extras])].filter((n) => !hasTerm(skillsText, n.toLowerCase()));
  if (toAdd.length) sec.skills.push(`Key Skills: ${toAdd.join(', ')}`);

  // Summary: keep the candidate's own, otherwise build one from skills they actually have
  if (!sec.summary.length) {
    const top = [...new Set([...matched, ...extras])].slice(0, 4);
    const skillPhrase = top.length > 1 ? `${top.slice(0, -1).join(', ')} and ${top[top.length - 1]}` : top[0] || 'core engineering skills';
    sec.summary = [`Motivated ${title} candidate with hands-on experience in ${skillPhrase}. Focused on building reliable software${company.trim() ? ` and contributing to ${company.trim()}` : ''}.`];
  }

  const contact = [profile.email, profile.phone, ...asLines(profile.links)].filter(Boolean).join(' | ');
  const name = String(profile.name || 'Your Name').slice(0, 60);

  // Plain text
  const out = [name.toUpperCase(), contact, ''];
  SECTION_ORDER.forEach(([key, label]) => {
    if (sec[key].length) out.push(label, ...sec[key], '');
  });
  const textOut = out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';

  // HTML (single column, standard headings, no tables or images)
  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(name)} - Resume</title>` +
    `<style>body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#000;max-width:780px;margin:24px auto;line-height:1.4}` +
    `h1{font-size:20pt;margin:0}p{margin:2px 0}.c{margin-bottom:10px}h2{font-size:12pt;border-bottom:1px solid #000;margin:14px 0 4px;padding-bottom:2px}` +
    `ul{margin:2px 0 4px 18px;padding:0}li{margin:1px 0}</style></head><body>` +
    `<h1>${esc(name)}</h1><p class="c">${esc(contact)}</p>`;
  SECTION_ORDER.forEach(([key, label]) => {
    if (!sec[key].length) return;
    html += `<h2>${label}</h2>`;
    let open = false;
    sec[key].forEach((l) => {
      if (l.startsWith('- ')) {
        if (!open) { html += '<ul>'; open = true; }
        html += `<li>${esc(l.slice(2))}</li>`;
      } else {
        if (open) { html += '</ul>'; open = false; }
        html += `<p>${esc(l)}</p>`;
      }
    });
    if (open) html += '</ul>';
  });
  html += '</body></html>';

  return { text: textOut, html, addedKeywords: toAdd };
}

module.exports = { analyzeResume, generateResume, extractText, normalizeRole, ROLE_KEYWORDS };
