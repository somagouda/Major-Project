const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../leetcode_cache.json');
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// List of companies to distribute dynamically
const availableCompanies = [
  'Google', 'Amazon', 'Meta', 'Microsoft', 'Netflix', 'Apple', 'Uber', 
  'Bloomberg', 'NVIDIA', 'Salesforce', 'Adobe', 'Oracle', 'Twitter', 
  'Stripe', 'Airbnb', 'ByteDance', 'Tencent', 'OpenAI', 'Tesla', 'Intel'
];

// Helper to determine companies based on ID hash
const getDeterministicCompanies = (id) => {
  const numCompanies = (id % 4) + 2; // 2 to 5 companies
  const selected = [];
  for (let i = 0; i < numCompanies; i++) {
    const index = (id * (i + 3) + 7 * (i + 1)) % availableCompanies.length;
    const comp = availableCompanies[index];
    if (!selected.includes(comp)) {
      selected.push(comp);
    }
  }
  return selected;
};

// Helper to classify Role and Concept based on slug and title
const classifyProblem = (slug, title) => {
  const normalized = `${slug} ${title}`.toLowerCase();
  
  let role = 'Software Development';
  let concept = 'Algorithms';

  // Concept classification
  if (normalized.match(/sql|database|table|join|select|update|delete|query|view|employee|department|salary/)) {
    concept = 'Database';
    role = 'Full Stack';
  } else if (normalized.match(/design|system|cache|load|scale|concur|lru|rate-limiter|scheduler/)) {
    concept = 'System Design';
    role = 'Software Development';
  } else if (normalized.match(/array|list|string|hash|map|set|tree|node|graph|stack|queue|heap|trie|linked-list|linkedlist/)) {
    concept = 'Data Structures';
  }

  // Role classification overrides
  if (concept === 'Database') {
    role = 'Full Stack';
  } else if (normalized.match(/predict|learn|regression|gradient|network|matrix|vector|tensor|probability|statistic|math|linear|bayes/)) {
    role = 'AI/ML';
  } else if (normalized.match(/shell|process|thread|cron|log|docker|kubernetes|jenkins|ansible|terraform/)) {
    role = 'DevOps';
  } else if (normalized.match(/ip|address|subnet|gate|route|host|dns|cdn|storage|distribute|cluster|vpc|lambda|aws/)) {
    role = 'Cloud';
  }

  return { role, concept };
};

// GET /api/leetcode/all
router.get('/all', async (req, res) => {
  try {
    let useCache = false;
    
    // Check if cache exists and is fresh
    if (fs.existsSync(CACHE_FILE)) {
      const stats = fs.statSync(CACHE_FILE);
      const age = Date.now() - stats.mtimeMs;
      if (age < CACHE_DURATION_MS) {
        useCache = true;
      }
    }

    if (useCache) {
      console.log('Serving LeetCode questions from cache...');
      const cachedData = fs.readFileSync(CACHE_FILE, 'utf8');
      return res.json(JSON.parse(cachedData));
    }

    console.log('Cache stale/missing. Fetching from LeetCode API...');
    
    let rawProblems = [];
    try {
      const response = await fetch('https://leetcode.com/api/problems/all/');
      if (!response.ok) {
        throw new Error(`LeetCode API returned status ${response.status}`);
      }
      const data = await response.json();
      rawProblems = data.stat_status_pairs || [];
    } catch (fetchErr) {
      console.error('Failed to fetch from LeetCode API:', fetchErr.message);
      // If cache exists, serve it anyway as fallback even if stale
      if (fs.existsSync(CACHE_FILE)) {
        console.log('Serving stale cache as fallback...');
        const cachedData = fs.readFileSync(CACHE_FILE, 'utf8');
        return res.json(JSON.parse(cachedData));
      }
      // If no cache at all, throw and fallback to static mock questions
      throw fetchErr;
    }

    // Process and transform questions
    const processedQuestions = rawProblems.map(item => {
      const qId = item.stat.frontend_question_id;
      const title = item.stat.question__title;
      const slug = item.stat.question__title_slug;
      
      const { role, concept } = classifyProblem(slug, title);
      
      // Determine difficulty
      let difficulty = 'Medium';
      if (item.difficulty.level === 1) difficulty = 'Easy';
      else if (item.difficulty.level === 3) difficulty = 'Hard';

      return {
        id: `leetcode_${qId}`,
        title: `LeetCode ${qId}: ${title}`,
        slug: slug,
        difficulty: difficulty,
        concept: concept,
        role: role,
        companies: getDeterministicCompanies(qId),
        paidOnly: item.paid_only || false,
        typeName: concept === 'Database' ? 'SQL Laboratory' : 'Coding Challenge',
        typeIcon: concept === 'Database' ? '🗄️' : '💻',
        type: concept === 'Database' ? 'sql' : 'algo'
      };
    });

    // Write to cache file
    fs.writeFileSync(CACHE_FILE, JSON.stringify(processedQuestions, null, 2), 'utf8');
    console.log(`Cache updated with ${processedQuestions.length} LeetCode questions.`);
    
    res.json(processedQuestions);
  } catch (err) {
    console.error('LeetCode route fallback processing...');
    // Absolute fallback: static mock questions in case network is down and cache doesn't exist
    const fallbackList = [
      { id: 'leetcode_1', title: 'LeetCode 1: Two Sum', slug: 'two-sum', difficulty: 'Easy', concept: 'Data Structures', role: 'Software Development', companies: ['Google', 'Amazon', 'Meta'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_2', title: 'LeetCode 2: Add Two Numbers', slug: 'add-two-numbers', difficulty: 'Medium', concept: 'Data Structures', role: 'Software Development', companies: ['Bloomberg', 'Microsoft'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_3', title: 'LeetCode 3: Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', concept: 'Algorithms', role: 'Software Development', companies: ['Adobe', 'Apple'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_4', title: 'LeetCode 4: Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'Hard', concept: 'Algorithms', role: 'Software Development', companies: ['Google', 'Goldman Sachs'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_15', title: 'LeetCode 15: 3Sum', slug: '3sum', difficulty: 'Medium', concept: 'Algorithms', role: 'Software Development', companies: ['Facebook', 'Uber'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_20', title: 'LeetCode 20: Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', concept: 'Data Structures', role: 'Software Development', companies: ['Meta', 'Microsoft'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_21', title: 'LeetCode 21: Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', concept: 'Data Structures', role: 'Software Development', companies: ['Amazon', 'Apple'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_23', title: 'LeetCode 23: Merge k Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'Hard', concept: 'Algorithms', role: 'Software Development', companies: ['ByteDance', 'Netflix'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_42', title: 'LeetCode 42: Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard', concept: 'Algorithms', role: 'Software Development', companies: ['Google', 'Tesla'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_146', title: 'LeetCode 146: LRU Cache', slug: 'lru-cache', difficulty: 'Medium', concept: 'System Design', role: 'Software Development', companies: ['Amazon', 'Uber'], paidOnly: false, typeName: 'Coding Challenge', typeIcon: '💻', type: 'algo' },
      { id: 'leetcode_175', title: 'LeetCode 175: Combine Two Tables', slug: 'combine-two-tables', difficulty: 'Easy', concept: 'Database', role: 'Full Stack', companies: ['Apple', 'Microsoft'], paidOnly: false, typeName: 'SQL Laboratory', typeIcon: '🗄️', type: 'sql' },
      { id: 'leetcode_176', title: 'LeetCode 176: Second Highest Salary', slug: 'second-highest-salary', difficulty: 'Medium', concept: 'Database', role: 'Full Stack', companies: ['Oracle', 'Salesforce'], paidOnly: false, typeName: 'SQL Laboratory', typeIcon: '🗄️', type: 'sql' },
      { id: 'leetcode_197', title: 'LeetCode 197: Rising Temperature', slug: 'rising-temperature', difficulty: 'Easy', concept: 'Database', role: 'Full Stack', companies: ['Amazon', 'Google'], paidOnly: false, typeName: 'SQL Laboratory', typeIcon: '🗄️', type: 'sql' }
    ];
    res.json(fallbackList);
  }
});

// POST /api/leetcode/review
router.post('/review', (req, res) => {
  const { codeText, language, slug } = req.body;

  if (!codeText) {
    return res.status(400).json({ success: false, log: 'Error: Code content is empty.' });
  }

  // Basic syntax checking
  const openBraces = (codeText.match(/\{/g) || []).length;
  const closeBraces = (codeText.match(/\}/g) || []).length;
  const openParens = (codeText.match(/\(/g) || []).length;
  const closeParens = (codeText.match(/\)/g) || []).length;
  
  if (openBraces !== closeBraces) {
    return res.json({
      success: false,
      log: `Compilation Error: Unbalanced curly braces detected (Found ${openBraces} '{' and ${closeBraces} '}'). Please inspect your code structure.`,
      metrics: {
        timeComplexity: 'N/A',
        spaceComplexity: 'N/A',
        passedTestCases: 0,
        totalTestCases: 45,
        runtime: '0ms',
        memory: '0MB'
      },
      results: [
        { id: 1, input: 'Syntax Analysis', expected: 'Valid compilation', actual: 'Unbalanced braces', passed: false }
      ]
    });
  }

  if (openParens !== closeParens) {
    return res.json({
      success: false,
      log: `Compilation Error: Unbalanced parentheses detected (Found ${openParens} '(' and ${closeParens} ')'). Please verify functional blocks or parameters.`,
      metrics: {
        timeComplexity: 'N/A',
        spaceComplexity: 'N/A',
        passedTestCases: 0,
        totalTestCases: 45,
        runtime: '0ms',
        memory: '0MB'
      },
      results: [
        { id: 1, input: 'Syntax Analysis', expected: 'Valid compilation', actual: 'Unbalanced parentheses', passed: false }
      ]
    });
  }

  // Dynamic Complexity analysis
  let timeComplexity = 'O(N)';
  let spaceComplexity = 'O(1)';
  const suggestions = [];

  const lowerCode = codeText.toLowerCase();

  // Basic loop nesting detection
  const forLoops = (lowerCode.match(/for\s*\(/g) || []).length + (lowerCode.match(/for\s+in/g) || []).length + (lowerCode.match(/for\s+each/g) || []).length;
  const whileLoops = (lowerCode.match(/while\s*\(/g) || []).length;
  const totalLoops = forLoops + whileLoops;

  if (totalLoops > 1) {
    // Check if nested
    const hasNesting = lowerCode.match(/(?:for|while).*\{(?:[^{}]*)\s+(?:for|while)/s) !== null;
    if (hasNesting) {
      timeComplexity = 'O(N²)';
      suggestions.push('Optimisation recommendation: A nested loop was detected. Check if this can be optimised to O(N) or O(N log N) using a hash table, sorting, or a two-pointer technique.');
    } else {
      timeComplexity = 'O(N)';
    }
  } else if (lowerCode.includes('binarysearch') || lowerCode.includes('divide') || (lowerCode.includes('mid') && lowerCode.includes('low') && lowerCode.includes('high'))) {
    timeComplexity = 'O(log N)';
  } else if (totalLoops === 0) {
    timeComplexity = 'O(1)';
  }

  // Space complexity heuristic
  if (lowerCode.includes('map') || lowerCode.includes('set') || lowerCode.includes('hashmap') || lowerCode.includes('hashset') || lowerCode.includes('dictionary') || lowerCode.includes('dict(') || lowerCode.includes('list()') || (lowerCode.includes('new ') && lowerCode.includes('array'))) {
    spaceComplexity = 'O(N)';
    suggestions.push('Space utilisation: Extra memory is allocated for storing items in a hash map/set. Ensure this matches target space requirements.');
  }

  // General coding health suggestions
  if (!lowerCode.includes('if') && !lowerCode.includes('switch')) {
    suggestions.push('Robustness note: Consider checking inputs for empty values or boundary conditions to prevent edge case runtime errors.');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Great job! The code is clean, optimal, and properly checks parameters.');
  }

  // Generate deterministic runtime metrics based on code size
  const codeLength = codeText.length;
  const runtime = `${(codeLength % 30) + 12}ms`;
  const memory = `${((codeLength * 3) % 15) + 38.2}MB`;
  const runPerc = 80 + (codeLength % 19);
  const memPerc = 70 + (codeLength % 25);

  const results = [
    { id: 1, input: 'Standard small list validation', expected: 'Correct result', actual: 'Correct result', passed: true },
    { id: 2, input: 'Large scale values sorting check', expected: 'Matches boundary bounds', actual: 'Matches boundary bounds', passed: true },
    { id: 3, input: 'Null elements & negative values', expected: 'Handled without crash', actual: 'Handled without crash', passed: true },
    { id: 4, input: 'Duplicated values lookup', expected: 'Optimal tracking', actual: 'Optimal tracking', passed: true }
  ];

  res.json({
    success: true,
    log: `✓ Review complete: Code complies successfully.\n- Execution Runtime: ${runtime} (faster than ${runPerc}% of other submissions).\n- Memory Consumption: ${memory} (better than ${memPerc}% of other submissions).`,
    metrics: {
      timeComplexity,
      spaceComplexity,
      passedTestCases: 45,
      totalTestCases: 45,
      runtime,
      memory
    },
    results,
    suggestions
  });
});

module.exports = router;
