const http = require('http');
const jwt = require('../backend/node_modules/jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sappip_secret_key_12345';
const testToken = jwt.sign({ id: 'test_user_123' }, JWT_SECRET);

function fetchJson(pathStr) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:5000${pathStr}`, {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (err) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function debugRequests() {
  console.log('=== DEBUGGING API ENDPOINTS ===\n');

  console.log('Test 1: Subtopic stats for subject=DSA');
  const stats1 = await fetchJson('/api/leetcode/subtopic-stats?subject=DSA');
  console.log('Stats DSA:', stats1);

  console.log('\nTest 2: Problems for subject=DSA, page=1, limit=10');
  const probs1 = await fetchJson('/api/leetcode/problems?page=1&limit=10&subject=DSA');
  console.log('Problems DSA status:', probs1.status);
  console.log('Problems DSA data summary:', {
    isArray: Array.isArray(probs1.data),
    hasProblems: Boolean(probs1.data && probs1.data.problems),
    length: Array.isArray(probs1.data) ? probs1.data.length : (probs1.data.problems ? probs1.data.problems.length : 0),
    sampleTitle: probs1.data && probs1.data.problems && probs1.data.problems[0] ? probs1.data.problems[0].title : null
  });

  console.log('\nTest 3: Problems for subtopicId=dsa-arrays-sliding-window');
  const probs2 = await fetchJson('/api/leetcode/problems?page=1&limit=10&subject=DSA&subtopicId=dsa-arrays-sliding-window');
  console.log('Problems Sliding Window:', {
    status: probs2.status,
    total: probs2.data ? probs2.data.total : 0,
    count: probs2.data && probs2.data.problems ? probs2.data.problems.length : 0,
    firstTitle: probs2.data && probs2.data.problems && probs2.data.problems[0] ? probs2.data.problems[0].title : null
  });

  console.log('\nTest 4: Subtopic stats for subtopicId=dsa-arrays-sliding-window');
  const stats2 = await fetchJson('/api/leetcode/subtopic-stats?subject=DSA&subtopicId=dsa-arrays-sliding-window');
  console.log('Stats Sliding Window:', stats2);
}

debugRequests();
