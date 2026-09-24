const http = require('http');

function fetchJson(pathStr) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:5000${pathStr}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Failed to parse JSON (Status ${res.statusCode}): ${data.slice(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

async function runApiTests() {
  console.log('==================================================');
  console.log('LIVE BACKEND API TOPIC FILTERING & DATASET TESTS');
  console.log('==================================================\n');

  try {
    // 1. Aptitude -> Percentages
    const resPercent = await fetchJson('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-percentages');
    console.log(`1. GET /api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-percentages`);
    console.log(`   - Count returned: ${resPercent.totalCount}`);
    console.log(`   - First 3 titles:`, resPercent.problems.slice(0, 3).map(p => p.title));

    // 2. Aptitude -> Profit & Loss
    const resProfit = await fetchJson('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-profit-loss');
    console.log(`\n2. GET /api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-profit-loss`);
    console.log(`   - Count returned: ${resProfit.totalCount}`);
    console.log(`   - First 3 titles:`, resProfit.problems.slice(0, 3).map(p => p.title));

    // 3. DSA -> Arrays -> Sliding Window
    const resSliding = await fetchJson('/api/leetcode/problems?subject=DSA&subtopicId=dsa-arrays-sliding-window');
    console.log(`\n3. GET /api/leetcode/problems?subject=DSA&subtopicId=dsa-arrays-sliding-window`);
    console.log(`   - Count returned: ${resSliding.totalCount}`);
    console.log(`   - First 3 titles:`, resSliding.problems.slice(0, 3).map(p => p.title));

    // 4. DSA -> Arrays -> Prefix Sum
    const resPrefix = await fetchJson('/api/leetcode/problems?subject=DSA&subtopicId=dsa-arrays-prefix-sum');
    console.log(`\n4. GET /api/leetcode/problems?subject=DSA&subtopicId=dsa-arrays-prefix-sum`);
    console.log(`   - Count returned: ${resPrefix.totalCount}`);
    console.log(`   - First 3 titles:`, resPrefix.problems.slice(0, 3).map(p => p.title));

    // 5. Test Metadata Filters on Subtopic: Aptitude -> Percentages + Easy + Infosys
    const resFiltered = await fetchJson('/api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-percentages&difficulty=Easy&company=Infosys');
    console.log(`\n5. GET /api/leetcode/problems?subject=APTITUDE&subtopicId=aptitude-percentages&difficulty=Easy&company=Infosys`);
    console.log(`   - Count returned: ${resFiltered.totalCount}`);
    console.log(`   - Verified every problem matches subtopic AND Easy AND Infosys:`, resFiltered.problems.every(p => p.subtopicId === 'aptitude-percentages' && p.difficulty === 'Easy' && (p.company === 'Infosys' || (p.companies && p.companies.includes('Infosys')))));

    // 6. Test Random Problem in Subtopic
    const resRandom = await fetchJson('/api/leetcode/random-problem?subject=DSA&subtopicId=dsa-arrays-sliding-window');
    console.log(`\n6. GET /api/leetcode/random-problem?subject=DSA&subtopicId=dsa-arrays-sliding-window`);
    console.log(`   - Random Problem ID: ${resRandom.id}, Title: ${resRandom.title}, Subtopic: ${resRandom.subtopicId}`);

    console.log('\n==================================================');
    console.log('API TESTS COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
  } catch (err) {
    console.error('API Test Error:', err);
    process.exit(1);
  }
}

runApiTests();
