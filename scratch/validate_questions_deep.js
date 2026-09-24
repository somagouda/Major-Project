const { buildFullDataset, ALL_SUBTOPICS } = require('../backend/seeders/fullQuestionDataset');

console.log('==================================================');
console.log('DEEP QUESTION DATASET & SUBTOPIC VALIDATION SCRIPT');
console.log('==================================================\n');

const dataset = buildFullDataset();
console.log(`Total Question Records Generated: ${dataset.length}`);

let passed = true;
const errors = [];

// Map subtopics
const questionsBySubtopic = {};
dataset.forEach(q => {
  if (!questionsBySubtopic[q.subtopicId]) {
    questionsBySubtopic[q.subtopicId] = [];
  }
  questionsBySubtopic[q.subtopicId].push(q);
});

// A. Check Every subtopic has >= 20 questions
console.log('\n--- 1. SUBTOPIC COUNT VALIDATION (Min 20 Required) ---');
ALL_SUBTOPICS.forEach(st => {
  const count = (questionsBySubtopic[st.subtopicId] || []).length;
  if (count < 20) {
    passed = false;
    errors.push(`Subtopic ${st.subtopicId} has only ${count} questions (minimum 20 required).`);
    console.log(`❌ ${st.subtopicId}: ${count}`);
  } else {
    console.log(`✓ ${st.subtopicId}: ${count}`);
  }
});

// B, C, D, E. Question Metadata & Schema Integrity
console.log('\n--- 2. QUESTION METADATA & SCHEMA VALIDATION ---');
let missingMetadataCount = 0;
const seenIds = new Set();
const seenTitles = new Set();
const seenDescriptions = new Set();

let duplicateIdCount = 0;
let duplicateTitleCount = 0;

dataset.forEach((q, idx) => {
  const requiredKeys = ['id', 'subject', 'topicId', 'subtopicId', 'title', 'description', 'questionType', 'difficulty', 'sourceType'];
  requiredKeys.forEach(k => {
    if (!q[k]) {
      missingMetadataCount++;
      errors.push(`Question index ${idx} missing required key '${k}'`);
    }
  });

  if (seenIds.has(q.id)) {
    duplicateIdCount++;
    errors.push(`Duplicate ID found: ${q.id}`);
  } else {
    seenIds.add(q.id);
  }

  const titleKey = `${q.subtopicId}:::${q.title}`;
  if (seenTitles.has(titleKey)) {
    duplicateTitleCount++;
    errors.push(`Duplicate title in subtopic ${q.subtopicId}: ${q.title}`);
  } else {
    seenTitles.add(titleKey);
  }
});

console.log(`Missing Required Metadata Fields: ${missingMetadataCount}`);
console.log(`Duplicate IDs: ${duplicateIdCount}`);
console.log(`Duplicate Titles (within subtopics): ${duplicateTitleCount}`);

if (missingMetadataCount > 0 || duplicateIdCount > 0 || duplicateTitleCount > 0) {
  passed = false;
}

// 16. TOPIC SWITCH TEST
console.log('\n--- 3. TOPIC SWITCH CONTENT DISJOINTNESS TEST ---');

function getTop5Titles(subtopicId) {
  const list = questionsBySubtopic[subtopicId] || [];
  return list.slice(0, 5).map(q => q.title);
}

const percentageTitles = getTop5Titles('aptitude-percentages');
const profitLossTitles = getTop5Titles('aptitude-profit-loss');
const probabilityTitles = getTop5Titles('aptitude-probability');
const slidingWindowTitles = getTop5Titles('dsa-arrays-sliding-window');
const prefixSumTitles = getTop5Titles('dsa-arrays-prefix-sum');

console.log('1. Aptitude -> Percentages (First 5 Titles):');
percentageTitles.forEach(t => console.log(`   - ${t}`));

console.log('\n2. Aptitude -> Profit & Loss (First 5 Titles):');
profitLossTitles.forEach(t => console.log(`   - ${t}`));

console.log('\n3. Aptitude -> Probability (First 5 Titles):');
probabilityTitles.forEach(t => console.log(`   - ${t}`));

console.log('\n4. DSA -> Arrays -> Sliding Window (First 5 Titles):');
slidingWindowTitles.forEach(t => console.log(`   - ${t}`));

console.log('\n5. DSA -> Arrays -> Prefix Sum (First 5 Titles):');
prefixSumTitles.forEach(t => console.log(`   - ${t}`));

// Check disjointness
const checkOverlap = (name1, set1, name2, set2) => {
  const overlap = set1.filter(t => set2.includes(t));
  if (overlap.length > 0) {
    passed = false;
    errors.push(`Overlap found between ${name1} and ${name2}: ${overlap.join(', ')}`);
    console.log(`❌ Overlap detected between ${name1} and ${name2}!`);
  } else {
    console.log(`✓ ${name1} and ${name2} have completely distinct question titles.`);
  }
};

checkOverlap('Percentages', percentageTitles, 'Profit & Loss', profitLossTitles);
checkOverlap('Profit & Loss', profitLossTitles, 'Probability', probabilityTitles);
checkOverlap('Probability', probabilityTitles, 'Sliding Window', slidingWindowTitles);
checkOverlap('Sliding Window', slidingWindowTitles, 'Prefix Sum', prefixSumTitles);

console.log('\n==================================================');
if (passed) {
  console.log('SUCCESS: ALL DEEP VALIDATION TESTS PASSED CLEANLY (100%)!');
} else {
  console.log('FAIL: Validation errors found:');
  errors.forEach(e => console.log(`  - ${e}`));
}
console.log('==================================================');

process.exit(passed ? 0 : 1);
