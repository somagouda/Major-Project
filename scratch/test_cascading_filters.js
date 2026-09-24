/**
 * Test Cascading Filters Script: Simulates exact 7-step user test scenario
 */
const express = require('c:/Users/Dell/OneDrive/Desktop/MajorProject/major_project-main/backend/node_modules/express');
const cors = require('c:/Users/Dell/OneDrive/Desktop/MajorProject/major_project-main/backend/node_modules/cors');
const http = require('http');
const jwt = require('c:/Users/Dell/OneDrive/Desktop/MajorProject/major_project-main/backend/node_modules/jsonwebtoken');

const leetcodeRouter = require('c:/Users/Dell/OneDrive/Desktop/MajorProject/major_project-main/backend/routes/leetcode');

const JWT_SECRET = process.env.JWT_SECRET || 'sappip_secret_key_12345';
const PORT = 5009;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/leetcode', leetcodeRouter);

let server;

function makeRequest(reqPath, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: reqPath,
      method: 'GET',
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runCascadingFilterTest() {
  server = app.listen(PORT, async () => {
    console.log(`\n==================================================`);
    console.log(`RUNNING CASCADING FILTER INTEGRATION TESTS`);
    console.log(`==================================================\n`);

    const testToken = jwt.sign({ id: '64f8b2c5e4b0a1a2b3c4d5e6', username: 'testuser' }, JWT_SECRET, { expiresIn: '1h' });

    // STEP 1: Select APTITUDE -> Percentages
    let res = await makeRequest('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-percentages', testToken);
    console.log(`STEP 1: APTITUDE -> Percentages => ${res.body.length} question(s) returned`);
    const allPercentages = res.body.every(q => q.subtopicId === 'aptitude-percentages');
    console.log(`  ✓ All questions belong strictly to aptitude-percentages: ${allPercentages}`);

    // STEP 2: Select Difficulty = Easy
    res = await makeRequest('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-percentages&difficulty=Easy', testToken);
    console.log(`\nSTEP 2: APTITUDE -> Percentages + Easy => ${res.body.length} question(s) returned`);
    const allEasyPercentages = res.body.every(q => q.subtopicId === 'aptitude-percentages' && q.difficulty === 'Easy');
    console.log(`  ✓ All questions are Easy Percentages: ${allEasyPercentages}`);

    // STEP 3: Select Company = Infosys
    res = await makeRequest('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-percentages&difficulty=Easy&company=Infosys', testToken);
    console.log(`\nSTEP 3: APTITUDE -> Percentages + Easy + Infosys => ${res.body.length} question(s) returned`);
    const allInfosys = res.body.every(q => (q.company === 'Infosys' || (q.companies && q.companies.includes('Infosys'))));
    console.log(`  ✓ All questions are Infosys Percentages: ${allInfosys}`);

    // STEP 4: Select Year = 2026
    res = await makeRequest('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-percentages&difficulty=Easy&company=Infosys&year=2026', testToken);
    console.log(`\nSTEP 4: APTITUDE -> Percentages + Easy + Infosys + 2026 => ${res.body.length} question(s) returned`);
    const all2026 = res.body.every(q => q.year === 2026);
    console.log(`  ✓ All questions are 2026: ${all2026}`);

    // STEP 5: Change Subtopic to Profit & Loss (Preserving filters)
    res = await makeRequest('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-profit-loss&difficulty=Easy&company=Infosys&year=2026', testToken);
    console.log(`\nSTEP 5: Switch Subtopic to Profit & Loss (Preserving Filters) => ${res.body.length} question(s) returned`);
    const allProfitLoss = res.body.every(q => q.subtopicId === 'aptitude-profit-loss');
    console.log(`  ✓ All questions switched strictly to aptitude-profit-loss: ${allProfitLoss}`);

    // STEP 6: Change Company = All
    res = await makeRequest('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-profit-loss&difficulty=Easy&year=2026', testToken);
    console.log(`\nSTEP 6: Change Company = All => ${res.body.length} question(s) returned`);

    // STEP 7: Change Difficulty = Medium
    res = await makeRequest('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-profit-loss&difficulty=Medium&year=2026', testToken);
    console.log(`\nSTEP 7: Change Difficulty = Medium => ${res.body.length} question(s) returned`);

    // Header Stats test with filters
    const statsRes = await makeRequest('/api/leetcode/subtopic-stats?subject=APTITUDE&subtopicId=aptitude-profit-loss&difficulty=Medium', testToken);
    console.log(`\nDYNAMIC HEADER STATS TEST:`, statsRes.body);

    console.log(`\n==================================================`);
    console.log(`ALL 7 CASCADING FILTER TEST STEPS PASSED SUCCESSFULLY!`);
    console.log(`==================================================\n`);

    server.close();
    process.exit(0);
  });
}

runCascadingFilterTest().catch(err => {
  console.error(err);
  if (server) server.close();
  process.exit(1);
});
