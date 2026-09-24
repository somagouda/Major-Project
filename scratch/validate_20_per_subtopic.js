/**
 * Validation Script: Verifies AT LEAST 20 questions exist for EVERY SINGLE SUBTOPIC
 */
const { buildFullDataset, ALL_SUBTOPICS } = require('../backend/seeders/fullQuestionDataset');

function validateDataset() {
  const dataset = buildFullDataset();
  console.log(`\n==================================================`);
  console.log(`TOTAL DATASET SIZE: ${dataset.length} questions`);
  console.log(`TOTAL SUBTOPICS TO VERIFY: ${ALL_SUBTOPICS.length}`);
  console.log(`==================================================\n`);

  let passed = 0;
  let failed = 0;
  const failureDetails = [];

  ALL_SUBTOPICS.forEach((st, idx) => {
    const matching = dataset.filter(q => q.subtopicId === st.subtopicId);
    const count = matching.length;

    if (count >= 20) {
      passed++;
      console.log(`✓ [${st.subject}] ${st.topicName} -> ${st.subtopicName} (id: ${st.subtopicId}): ${count} questions`);
    } else {
      failed++;
      failureDetails.push(`❌ [${st.subject}] ${st.topicName} -> ${st.subtopicName} (id: ${st.subtopicId}): ONLY ${count} questions (REQUIRED >= 20)`);
    }
  });

  console.log(`\n==================================================`);
  console.log(`VALIDATION RESULT: ${passed} / ${ALL_SUBTOPICS.length} SUBTOPICS PASSED!`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    console.error(`FAILED SUBTOPICS:\n` + failureDetails.join('\n'));
    process.exit(1);
  } else {
    console.log(`SUCCESS! Every subtopic has AT LEAST 20 topic-specific questions!`);
    process.exit(0);
  }
}

validateDataset();
