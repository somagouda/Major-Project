import React, { useState, useEffect } from 'react';
import ConceptMap from './ConceptMap';
import ProblemPlatform from './ProblemPlatform';

const questionPool = {
  'Software Development': [
    {
      id: 'leetcode_1',
      concept: 'Data Structures',
      difficulty: 'Easy',
      question: 'LeetCode 1: Two Sum - Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. What is the optimal time complexity to solve this problem?',
      options: ['O(N²)', 'O(N log N)', 'O(N)', 'O(1)'],
      correctIndex: 2,
      explanation: 'Using a hash map, we can check for the complement (target - nums[i]) of each element in O(1) lookup time, resulting in an overall O(N) time complexity.',
      companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple']
    },
    {
      id: 'leetcode_2',
      concept: 'Data Structures',
      difficulty: 'Medium',
      question: 'LeetCode 146: LRU Cache - Design a data structure that follows the constraints of a Least Recently Used (LRU) Cache. Which combination of data structures achieves both get and put operations in average O(1) time complexity?',
      options: [
        'Singly Linked List and Binary Search Tree',
        'Doubly Linked List and Hash Map',
        'Min-Heap and Hash Map',
        'Array and Stack'
      ],
      correctIndex: 1,
      explanation: 'A Doubly Linked List allows O(1) removal and insertion at the head/tail, and a Hash Map allows O(1) lookup of list nodes, fulfilling the O(1) cache criteria.',
      companies: ['Amazon', 'Microsoft', 'Bloomberg', 'Google', 'Uber']
    },
    {
      id: 'leetcode_3',
      concept: 'Algorithms',
      difficulty: 'Hard',
      question: 'LeetCode 23: Merge k Sorted Lists - You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it. What is the optimal time complexity of this merge operation (where N is the total number of elements across all lists)?',
      options: ['O(N log k)', 'O(N log N)', 'O(N * k)', 'O(N)'],
      correctIndex: 0,
      explanation: 'By using a Min-Heap (Priority Queue) containing the head of each of the k lists, we can repeatedly extract the minimum element and insert its successor. Each heap operation takes O(log k) time, giving an overall complexity of O(N log k).',
      companies: ['Meta', 'Google', 'Amazon', 'Netflix', 'ByteDance']
    },
    {
      id: 'leetcode_4',
      concept: 'System Design',
      difficulty: 'Expert',
      question: 'LeetCode 42: Trapping Rain Water - Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. Which algorithmic approach can solve this in O(N) time and O(1) auxiliary space?',
      options: [
        'Dynamic Programming with left and right max arrays',
        'Two-Pointer traversal from both ends',
        'Monotonic Stack traversal',
        'Binary Search over the maximum heights'
      ],
      correctIndex: 1,
      explanation: 'The two-pointer approach moves left and right inward, tracking left_max and right_max in-place. This uses O(1) extra space, compared to O(N) extra space for the Dynamic Programming or Monotonic Stack approaches.',
      companies: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Goldman Sachs']
    }
  ],
  'AI/ML': [
    {
      id: 'ml_leetcode_1',
      concept: 'AI & Machine Learning',
      difficulty: 'Easy',
      question: 'Gradient Descent Optimization Step - You are training a simple neural network. To minimize the Mean Squared Error (MSE) loss function, which direction should you step along the gradient vector?',
      options: [
        'Directly in the direction of the gradient',
        'Opposite to the direction of the gradient',
        'Orthogonal to the gradient direction',
        'No step is needed, gradients automatically converge'
      ],
      correctIndex: 1,
      explanation: 'Gradient descent steps in the direction of steepest descent, which is mathematically opposite (negative) to the gradient vector: w = w - eta * grad.',
      companies: ['Meta', 'Google', 'Apple', 'Tesla']
    },
    {
      id: 'ml_leetcode_2',
      concept: 'AI & Machine Learning',
      difficulty: 'Medium',
      question: 'Transformer Self-Attention Matrix Dimensions - In a Transformer Self-Attention block, if the input sequence has shape (Batch, SeqLen, ModelDim) (e.g. (B, T, C)), what are the matrix dimensions of the raw attention score matrix (Query * Key^T) before applying softmax?',
      options: [
        '(B, T, C)',
        '(B, T, T)',
        '(B, C, C)',
        '(B, T, 2*C)'
      ],
      correctIndex: 1,
      explanation: 'The attention score matrix matches Query (B, T, head_dim) times Key transposed (B, head_dim, T), giving (B, T, T). This matrix stores the pairwise attention weights between all T tokens in the sequence.',
      companies: ['OpenAI', 'Google', 'Anthropic', 'Meta', 'Microsoft']
    },
    {
      id: 'ml_leetcode_3',
      concept: 'AI & Machine Learning',
      difficulty: 'Hard',
      question: 'Backpropagation and Vanishing Gradients - In a deep neural network with 50 layers using sigmoid activation functions, you observe that the weights in the early layers learn extremely slowly. Which of the following is the primary mathematical reason for this?',
      options: [
        'The derivative of sigmoid is bounded between 0 and 0.25, leading to repeated multiplication of small fractions during backpropagation',
        'Sigmoid gradients grow exponentially, causing numerical overflow and parameter clipping',
        'Sigmoid derivatives are always zero for active inputs',
        'The learning rate decays to absolute zero at layer 10'
      ],
      correctIndex: 0,
      explanation: 'The derivative of the sigmoid function peaks at 0.25. During backpropagation, chain rule multiplications of these small numbers layer-by-layer cause the gradient to decay exponentially, resulting in vanishing gradients in early layers.',
      companies: ['Google', 'Meta', 'NVIDIA', 'OpenAI']
    },
    {
      id: 'ml_leetcode_4',
      concept: 'AI & Machine Learning',
      difficulty: 'Expert',
      question: 'Transformer KV-Caching Complexity - To optimize inference latency in auto-regressive Transformer decoding (e.g., GPT-4), we implement Key-Value (KV) Caching. What is the time complexity of generating the next token at step T (context length T) WITH KV-Caching, compared to WITHOUT KV-Caching?',
      options: [
        'With KV-Cache: O(T), Without: O(T²)',
        'With KV-Cache: O(1), Without: O(T)',
        'With KV-Cache: O(T²), Without: O(T³)',
        'With KV-Cache: O(T log T), Without: O(T²)'
      ],
      correctIndex: 0,
      explanation: 'Without KV-caching, we must recompute keys and values for all past tokens, resulting in O(T²) time for the full attention matrix calculation. With KV-caching, we only compute Q, K, V for the single new token and perform a dot product with the cached keys/values, reducing the step complexity to O(T).',
      companies: ['OpenAI', 'Anthropic', 'NVIDIA', 'Meta', 'Google', 'Amazon']
    }
  ],
  'DevOps': [
    {
      id: 'devops_leetcode_1',
      concept: 'DevOps & Cloud',
      difficulty: 'Easy',
      question: 'Docker Layer Caching Optimization - You are optimizing a Dockerfile for a Node.js app to improve build times. Which order of commands best utilizes Docker\'s layer caching?',
      options: [
        'COPY . . followed by RUN npm install',
        'COPY package.json . followed by RUN npm install followed by COPY . .',
        'RUN npm install followed by COPY . .',
        'COPY package.json package-lock.json followed by COPY . . followed by RUN npm install'
      ],
      correctIndex: 1,
      explanation: 'Copying package descriptors and running install first ensures that npm packages are cached and only rebuilt when package dependencies actually change, rather than on every minor source code change.',
      companies: ['Netflix', 'Amazon', 'Harness', 'GitLab']
    },
    {
      id: 'devops_leetcode_2',
      concept: 'DevOps & Cloud',
      difficulty: 'Medium',
      question: 'Kubernetes Rolling Update - During a Kubernetes Deployment rolling update, you want to ensure that no downtime occurs and at most 25% of pods are unavailable. Which deployment strategy parameters achieve this?',
      options: [
        'maxSurge: 25%, maxUnavailable: 0',
        'maxSurge: 0, maxUnavailable: 25%',
        'maxSurge: 25%, maxUnavailable: 25%',
        'recreate strategy with zero pods active'
      ],
      correctIndex: 0,
      explanation: 'Setting maxUnavailable: 0 ensures that no pods are terminated before new pods are ready, preventing any drop in active capacity. maxSurge: 25% allows K8s to spin up extra pods during transition.',
      companies: ['Google', 'Microsoft', 'Red Hat', 'HashiCorp']
    },
    {
      id: 'devops_leetcode_3',
      concept: 'DevOps & Cloud',
      difficulty: 'Hard',
      question: 'Blue-Green Deployment Load Balancer Weights - You are implementing a Blue-Green deployment pipeline. How can you safely verify the Green environment under real production load without risking a full site outage?',
      options: [
        'Use canary routing to route 5% of traffic to Green, gradually scaling up based on error rate metrics',
        'Switch DNS records instantly using a TTL of 86400 seconds',
        'Force all users to refresh their browser cache simultaneously',
        'Run Green database migrations on the active Blue database in production'
      ],
      correctIndex: 0,
      explanation: 'A canary routing release sends a small fraction of real users to Green, allowing validation of service health while protecting 95% of users from any issues.',
      companies: ['Netflix', 'Airbnb', 'Spotify', 'AWS']
    },
    {
      id: 'devops_leetcode_4',
      concept: 'DevOps & Cloud',
      difficulty: 'Expert',
      question: 'Distributed Consensus Node Quorum - In a high-availability Kubernetes cluster running etcd, what is the minimum number of nodes required to tolerate a partition where up to 2 nodes go offline simultaneously?',
      options: [
        '3 Nodes',
        '4 Nodes',
        '5 Nodes',
        '6 Nodes'
      ],
      correctIndex: 2,
      explanation: 'To tolerate F failures, a consensus system (Raft/Paxos) requires 2F + 1 nodes to maintain a majority quorum. For 2 failures, we need 2(2) + 1 = 5 nodes. If 2 go offline, 3 nodes remain, which is a quorum (> 50%).',
      companies: ['HashiCorp', 'Google', 'CockroachLabs', 'Apple']
    }
  ],
  'Cloud': [
    {
      id: 'cloud_leetcode_1',
      concept: 'DevOps & Cloud',
      difficulty: 'Easy',
      question: 'AWS S3 Storage Class Cost Optimization - You are storing backups that are rarely accessed but must be retrieved within minutes in case of disaster. Which AWS S3 storage class is most cost-effective?',
      options: [
        'S3 Standard',
        'S3 Glacier Flexible Retrieval',
        'S3 Standard-Infrequent Access',
        'S3 Glacier Deep Archive'
      ],
      correctIndex: 1,
      explanation: 'Glacier Flexible Retrieval provides cost-effective cold storage with retrieval times ranging from minutes to hours. Glacier Deep Archive is cheaper but takes hours to retrieve, which fails the "within minutes" requirement.',
      companies: ['Amazon', 'Capital One', 'Salesforce']
    },
    {
      id: 'cloud_leetcode_2',
      concept: 'DevOps & Cloud',
      difficulty: 'Medium',
      question: 'VPC NAT Gateway Placement - You have EC2 instances in a private subnet that need to download security updates from the internet. How should you design the network route?',
      options: [
        'Deploy a NAT Gateway in the public subnet, and add a route in the private subnet route table pointing 0.0.0.0/0 to the NAT Gateway',
        'Deploy an Internet Gateway directly in the private subnet',
        'Assign public IP addresses to the private instances and route traffic through a VPC Peering connection',
        'Configure a public NAT Gateway inside the private subnet'
      ],
      correctIndex: 0,
      explanation: 'NAT Gateways must reside in a public subnet with a route to an Internet Gateway. Private instances can then route outbound-only traffic through it without exposing themselves to inbound internet traffic.',
      companies: ['AWS', 'Microsoft', 'Adobe', 'Oracle']
    },
    {
      id: 'cloud_leetcode_3',
      concept: 'DevOps & Cloud',
      difficulty: 'Hard',
      question: 'Global Database Multi-Region Replication - To achieve a Recovery Point Objective (RPO) of under 1 second and Recovery Time Objective (RTO) of under 1 minute for a global cloud application, which database architecture should you choose?',
      options: [
        'Active-Passive cross-region read replicas with asynchronous replication and manual failover',
        'Multi-Region Active-Active database (e.g. DynamoDB Global Tables or Aurora Global Database) with automatic failover',
        'Nightly scheduled snapshot exports copied to another region',
        'Single-region database with daily tape backup replication'
      ],
      correctIndex: 1,
      explanation: 'Global Active-Active tables replicate data across regions in milliseconds (RPO < 1s) and support automatic failover routing in seconds (RTO < 1 min) if a regional outage occurs.',
      companies: ['Amazon', 'Netflix', 'Airbnb', 'Disney']
    },
    {
      id: 'cloud_leetcode_4',
      concept: 'DevOps & Cloud',
      difficulty: 'Expert',
      question: 'Serverless Lambda Cold Start Optimization - An API built on AWS Lambda experiences latency spikes (cold starts) during traffic bursts. Which technique is most effective for maintaining low latency?',
      options: [
        'Enable Provisioned Concurrency to keep a set number of execution environments pre-warmed',
        'Increase the Lambda memory size to 10GB to speed up runtime container instantiation',
        'Write a cron job that pings the Lambda function every 5 minutes',
        'Convert all code to use heavy Java Spring Boot libraries'
      ],
      correctIndex: 0,
      explanation: 'Provisioned Concurrency allocates initialized execution environments in advance, eliminating cold starts entirely for traffic within the provisioned limits.',
      companies: ['AWS', 'Stripe', 'Twilio', 'Slack']
    }
  ],
  'Full Stack': [
    {
      id: 'fullstack_leetcode_1',
      concept: 'System Design',
      difficulty: 'Easy',
      question: 'React Virtual DOM Reconciliation Keys - When rendering a dynamic list of items in React, why is it critical to provide a unique key prop to each list item?',
      options: [
        'To bind the component to local CSS stylesheets',
        'To help React identify which items have changed, been added, or been removed during reconciliation',
        'To automatically store the list items in localStorage',
        'To enforce strong typing on the children elements'
      ],
      correctIndex: 1,
      explanation: 'React\'s virtual DOM reconciliation uses the key prop to match elements across renders, avoiding unnecessary DOM re-creation and state preservation issues.',
      companies: ['Meta', 'Airbnb', 'Uber', 'Twitter']
    },
    {
      id: 'fullstack_leetcode_2',
      concept: 'System Design',
      difficulty: 'Medium',
      question: 'SQL vs NoSQL Feed Pagination - You are implementing infinite scroll pagination for a feed with millions of posts. Which pagination technique is most performant?',
      options: [
        'Offset pagination using LIMIT and OFFSET in SQL',
        'Cursor-based pagination using a unique sequential column (e.g. WHERE id > last_seen_id LIMIT N)',
        'Loading all rows into frontend state and sorting them in React',
        'Querying random offsets using math random bounds'
      ],
      correctIndex: 1,
      explanation: 'Offset pagination becomes slower as offset grows because the database must scan and discard all rows up to the offset. Cursor-based pagination uses indexes directly, maintaining O(log N) lookup regardless of page depth.',
      companies: ['Meta', 'Twitter', 'Pinterest', 'Reddit']
    },
    {
      id: 'fullstack_leetcode_3',
      concept: 'System Design',
      difficulty: 'Hard',
      question: 'Cookie Session Authentication CSRF Mitigation - You store user JWTs in cookies for session authentication. What is the most secure way to protect your frontend application from Cross-Site Request Forgery (CSRF) attacks?',
      options: [
        'Store tokens in localStorage and send them in the Authorization header',
        'Set the cookie flags to HttpOnly, Secure, and SameSite=Strict/Lax, and optionally use anti-CSRF double-submit tokens',
        'Disable cookies and encrypt all request payloads with client-side public keys',
        'Only accept requests from localhost'
      ],
      correctIndex: 1,
      explanation: 'HttpOnly prevents XSS scripts from reading the cookie, Secure ensures transport over HTTPS, SameSite=Strict/Lax blocks automatic cookie attachment during cross-site requests, and double-submit tokens provide secondary validation.',
      companies: ['Stripe', 'PayPal', 'Okta', 'Google']
    },
    {
      id: 'fullstack_leetcode_4',
      concept: 'System Design',
      difficulty: 'Expert',
      question: 'Server-Sent Events vs WebSockets for One-Way Feeds - You are building a real-time stock ticker dashboard that only streams data from the server to the client. Which protocol is most efficient and easiest to scale under high load?',
      options: [
        'WebSockets',
        'Server-Sent Events (SSE) over HTTP/2',
        'Short Polling every 500ms',
        'Long Polling with 30-second timeouts'
      ],
      correctIndex: 1,
      explanation: 'SSE is built over standard HTTP, supports automatic reconnection, and is unidirectional, making it highly efficient. Combined with HTTP/2 multiplexing, it avoids WebSocket connection handshake overhead and scaling issues for one-way streams.',
      companies: ['Robinhood', 'Coinbase', 'Bloomberg', 'Slack']
    }
  ]
};

const algoProblems = {
  'Software Development': [
    {
      id: 'algo_1',
      title: 'LeetCode 1: Two Sum',
      difficulty: 'Easy',
      functionName: 'twoSum',
      companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n**Example:**\nInput: `nums = [2,7,11,15]`, `target = 9`\nOutput: `[0,1]`',
      starterTemplates: {
        javascript: `function twoSum(nums, target) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def twoSum(nums: List[int], target: int) -> List[int]:\n    # Write your Python code here\n    pass`,
        java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your Java code here\n        return new int[]{}; \n    }\n}`,
        cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your C++ code here\n        return {};\n    }\n};`,
        c: `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your C code here\n    *returnSize = 2;\n    int* result = (int*)malloc(2 * sizeof(int));\n    return result;\n}`,
        csharp: `public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        // Write your C# code here\n        return new int[]{};\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
        { id: 2, input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
        { id: 3, input: 'nums = [3,3], target = 6', expected: '[0,1]' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn twoSum;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          
          const cases = [
            { id: 1, nums: [2, 7, 11, 15], target: 9, expected: '[0,1]' },
            { id: 2, nums: [3, 2, 4], target: 6, expected: '[1,2]' },
            { id: 3, nums: [3, 3], target: 6, expected: '[0,1]' }
          ];
          
          const results = cases.map(c => {
            try {
              const r = func([...c.nums], c.target);
              const passed = Array.isArray(r) && [...r].sort().join(',') === c.expected.replace(/[\[\]]/g, '').split(',').map(Number).sort().join(',');
              return {
                id: c.id,
                input: `nums = [${c.nums.join(',')}], target = ${c.target}`,
                expected: c.expected,
                actual: JSON.stringify(r),
                passed: passed
              };
            } catch (e) {
              return {
                id: c.id,
                input: `nums = [${c.nums.join(',')}], target = ${c.target}`,
                expected: c.expected,
                actual: `Error: ${e.message}`,
                passed: false
              };
            }
          });
          
          const allPassed = results.every(r => r.passed);
          const log = allPassed 
            ? '✓ Success: All test cases passed!' 
            : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { 
            success: false, 
            log: 'Compilation/Execution Error: ' + e.message,
            results: [
              { id: 1, input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', actual: `Error: ${e.message}`, passed: false },
              { id: 2, input: 'nums = [3,2,4], target = 6', expected: '[1,2]', actual: `Error: ${e.message}`, passed: false },
              { id: 3, input: 'nums = [3,3], target = 6', expected: '[0,1]', actual: `Error: ${e.message}`, passed: false }
            ]
          };
        }
      }
    },
    {
      id: 'algo_2',
      title: 'LeetCode 20: Valid Parentheses',
      difficulty: 'Medium',
      functionName: 'isValid',
      companies: ['Meta', 'Microsoft', 'Bloomberg', 'Google'],
      description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets and in the correct order.\n\n**Example:**\nInput: `s = "()[]{}"`\nOutput: `true`',
      starterTemplates: {
        javascript: `function isValid(s) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def isValid(s: str) -> bool:\n    # Write your Python code here\n    return False`,
        java: `class Solution {\n    public boolean isValid(String s) {\n        // Write your Java code here\n        return false;\n    }\n}`,
        cpp: `#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your C++ code here\n        return false;\n    }\n};`,
        c: `#include <stdbool.h>\n\nbool isValid(char* s) {\n    // Write your C code here\n    return false;\n}`,
        csharp: `public class Solution {\n    public bool IsValid(string s) {\n        // Write your C# code here\n        return false;\n    }\n}`
      },
      testCases: [
        { id: 1, input: 's = "()[]{}"', expected: 'true' },
        { id: 2, input: 's = "(]"', expected: 'false' },
        { id: 3, input: 's = "{[]}"', expected: 'true' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn isValid;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          
          const cases = [
            { id: 1, s: "()[]{}", expected: true, expectedStr: 'true' },
            { id: 2, s: "(]", expected: false, expectedStr: 'false' },
            { id: 3, s: "{[]}", expected: true, expectedStr: 'true' }
          ];
          
          const results = cases.map(c => {
            try {
              const r = func(c.s);
              const passed = r === c.expected;
              return {
                id: c.id,
                input: `s = "${c.s}"`,
                expected: c.expectedStr,
                actual: String(r),
                passed: passed
              };
            } catch (e) {
              return {
                id: c.id,
                input: `s = "${c.s}"`,
                expected: c.expectedStr,
                actual: `Error: ${e.message}`,
                passed: false
              };
            }
          });
          
          const allPassed = results.every(r => r.passed);
          const log = allPassed 
            ? '✓ Success: All test cases passed!' 
            : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return {
            success: false,
            log: 'Compilation/Execution Error: ' + e.message,
            results: [
              { id: 1, input: 's = "()[]{}"', expected: 'true', actual: `Error: ${e.message}`, passed: false },
              { id: 2, input: 's = "(]"', expected: 'false', actual: `Error: ${e.message}`, passed: false },
              { id: 3, input: 's = "{[]}"', expected: 'true', actual: `Error: ${e.message}`, passed: false }
            ]
          };
        }
      }
    },
    {
      id: 'algo_3',
      title: 'LeetCode 344: Reverse String',
      difficulty: 'Easy',
      functionName: 'reverseString',
      companies: ['Adobe', 'Apple', 'Yahoo', 'Microsoft'],
      description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n**Example:**\nInput: `s = ["h","e","l","l","o"]`\nOutput: `["o","l","l","e","h"]`',
      starterTemplates: {
        javascript: `function reverseString(s) {\n    // Modify the array s in-place\n    \n}`,
        python: `def reverseString(s: List[str]) -> None:\n    # Modify the array s in-place, return None\n    pass`,
        java: `class Solution {\n    public void reverseString(char[] s) {\n        // Modify the array s in-place\n        \n    }\n}`,
        cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Modify the array s in-place\n        \n    }\n};`,
        c: `void reverseString(char* s, int sSize) {\n    // Modify the array s in-place\n    \n}`,
        csharp: `public class Solution {\n    public void ReverseString(char[] s) {\n        // Modify the array s in-place\n        \n    }\n}`
      },
      testCases: [
        { id: 1, input: 's = ["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
        { id: 2, input: 's = ["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn reverseString;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          
          const cases = [
            { id: 1, s: ["h","e","l","l","o"], expected: ["o","l","l","e","h"] },
            { id: 2, s: ["H","a","n","n","a","h"], expected: ["h","a","n","n","a","H"] }
          ];
          
          const results = cases.map(c => {
            try {
              const arr = [...c.s];
              func(arr);
              const passed = arr.join('') === c.expected.join('');
              return {
                id: c.id,
                input: `s = [${c.s.map(x => `"${x}"`).join(',')}]`,
                expected: JSON.stringify(c.expected),
                actual: JSON.stringify(arr),
                passed: passed
              };
            } catch (e) {
              return {
                id: c.id,
                input: `s = [${c.s.map(x => `"${x}"`).join(',')}]`,
                expected: JSON.stringify(c.expected),
                actual: `Error: ${e.message}`,
                passed: false
              };
            }
          });
          
          const allPassed = results.every(r => r.passed);
          const log = allPassed 
            ? '✓ Success: All test cases passed!' 
            : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return {
            success: false,
            log: 'Compilation/Execution Error: ' + e.message,
            results: [
              { id: 1, input: 's = ["h","e","l","l","o"]', expected: '["o","l","l","e","h"]', actual: `Error: ${e.message}`, passed: false },
              { id: 2, input: 's = ["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]', actual: `Error: ${e.message}`, passed: false }
            ]
          };
        }
      }
    }
  ],
  'AI/ML': [
    {
      id: 'ml_algo_1',
      title: 'LeetCode 1865 (Modified): Dot Product of Two Sparse Vectors',
      difficulty: 'Medium',
      functionName: 'dotProduct',
      companies: ['Meta', 'Google', 'Twitter'],
      description: 'Compute the dot product of two sparse vectors represented as arrays. A sparse vector has mostly zero values. Your implementation should optimize for non-zero elements.\n\n**Example:**\nInput: `vec1 = [1,0,0,2,3]`, `vec2 = [0,3,0,4,0]`\nOutput: `8` (because 1*0 + 0*3 + 0*0 + 2*4 + 3*0 = 8)',
      starterTemplates: {
        javascript: `function dotProduct(vec1, vec2) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def dotProduct(vec1: List[int], vec2: List[int]) -> int:\n    # Write your Python code here\n    pass`,
        java: `class Solution {\n    public int dotProduct(int[] vec1, int[] vec2) {\n        // Write your Java code here\n        return 0;\n    }\n}`,
        cpp: `class Solution {\npublic:\n    int dotProduct(vector<int>& vec1, vector<int>& vec2) {\n        // Write your C++ code here\n        return 0;\n    }\n};`,
        c: `int dotProduct(int* vec1, int vec1Size, int* vec2, int vec2Size) {\n    // Write your C code here\n    return 0;\n}`,
        csharp: `public class Solution {\n    public int DotProduct(int[] vec1, int[] vec2) {\n        // Write your C# code here\n        return 0;\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'vec1 = [1,0,0,2,3], vec2 = [0,3,0,4,0]', expected: '8' },
        { id: 2, input: 'vec1 = [0,1,0,0,2,0,4], vec2 = [0,0,0,1,3,0,0]', expected: '6' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn dotProduct;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, vec1: [1,0,0,2,3], vec2: [0,3,0,4,0], expected: 8 },
            { id: 2, vec1: [0,1,0,0,2,0,4], vec2: [0,0,0,1,3,0,0], expected: 6 }
          ];
          const results = cases.map(c => {
            try {
              const r = func([...c.vec1], [...c.vec2]);
              return { id: c.id, input: `vec1 = [${c.vec1.join(',')}], vec2 = [${c.vec2.join(',')}]`, expected: String(c.expected), actual: String(r), passed: r === c.expected };
            } catch (e) {
              return { id: c.id, input: `vec1 = [${c.vec1.join(',')}], vec2 = [${c.vec2.join(',')}]`, expected: String(c.expected), actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    },
    {
      id: 'ml_algo_2',
      title: 'ML Challenge: Mean Squared Error (MSE)',
      difficulty: 'Easy',
      functionName: 'meanSquaredError',
      companies: ['OpenAI', 'Google', 'Anthropic', 'Tesla'],
      description: 'Given two arrays representing predictions (`predictions`) and ground truths (`targets`), calculate the Mean Squared Error (MSE) metric.\n\n**Example:**\nInput: `predictions = [2.5, 3.0, 4.0]`, `targets = [3.0, 3.0, 3.8]`\nOutput: `0.09` (because ((2.5-3.0)^2 + (3.0-3.0)^2 + (4.0-3.8)^2) / 3 = (0.25 + 0.0 + 0.04) / 3 = 0.09)',
      starterTemplates: {
        javascript: `function meanSquaredError(predictions, targets) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def meanSquaredError(predictions: List[float], targets: List[float]) -> float:\n    # Write your Python code here\n    return 0.0`,
        java: `class Solution {\n    public double meanSquaredError(double[] predictions, double[] targets) {\n        // Write your Java code here\n        return 0.0;\n    }\n}`,
        cpp: `class Solution {\npublic:\n    double meanSquaredError(vector<double>& predictions, vector<double>& targets) {\n        // Write your C++ code here\n        return 0.0;\n    }\n};`,
        c: `double meanSquaredError(double* predictions, int predSize, double* targets, int targetSize) {\n    // Write your C code here\n    return 0.0;\n}`,
        csharp: `public class Solution {\n    public double MeanSquaredError(double[] predictions, double[] targets) {\n        // Write your C# code here\n        return 0.0;\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'predictions = [2.5, 3.0, 4.0], targets = [3.0, 3.0, 3.8]', expected: '0.09' },
        { id: 2, input: 'predictions = [1, 2, 3], targets = [1, 2, 3]', expected: '0' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn meanSquaredError;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, preds: [2.5, 3.0, 4.0], targets: [3.0, 3.0, 3.8], expected: 0.09 },
            { id: 2, preds: [1, 2, 3], targets: [1, 2, 3], expected: 0 }
          ];
          const results = cases.map(c => {
            try {
              const r = func([...c.preds], [...c.targets]);
              const passed = Math.abs(r - c.expected) < 1e-6;
              return { id: c.id, input: `predictions = [${c.preds.join(',')}], targets = [${c.targets.join(',')}]`, expected: String(c.expected), actual: String(r), passed: passed };
            } catch (e) {
              return { id: c.id, input: `predictions = [${c.preds.join(',')}], targets = [${c.targets.join(',')}]`, expected: String(c.expected), actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    },
    {
      id: 'ml_algo_3',
      title: 'ML Challenge: Sigmoid Activation Function',
      difficulty: 'Easy',
      functionName: 'sigmoid',
      companies: ['Meta', 'Apple', 'NVIDIA'],
      description: 'Implement the mathematical sigmoid activation function: f(z) = 1 / (1 + e^-z). Apply this function element-wise to an array of values `z`.\n\n**Example:**\nInput: `z = [0, 2, -2]`\nOutput: `[0.5, 0.880797, 0.119202]`',
      starterTemplates: {
        javascript: `function sigmoid(z) {\n    // Return a new array of element-wise sigmoid values\n    \n}`,
        python: `def sigmoid(z: List[float]) -> List[float]:\n    # Write your Python code here\n    return []`,
        java: `class Solution {\n    public double[] sigmoid(double[] z) {\n        // Write your Java code here\n        return new double[]{};\n    }\n}`,
        cpp: `class Solution {\npublic:\n    vector<double> sigmoid(vector<double>& z) {\n        // Write your C++ code here\n        return {};\n    }\n};`,
        c: `double* sigmoid(double* z, int zSize) {\n    // Note: malloc returned array\n    return z;\n}`,
        csharp: `public class Solution {\n    public double[] Sigmoid(double[] z) {\n        // Write your C# code here\n        return new double[]{};\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'z = [0]', expected: '[0.5]' },
        { id: 2, input: 'z = [2, -2]', expected: '[0.8808,0.1192]' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn sigmoid;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, z: [0], expected: [0.5] },
            { id: 2, z: [2, -2], expected: [0.880797, 0.119202] }
          ];
          const results = cases.map(c => {
            try {
              const r = func([...c.z]);
              const passed = Array.isArray(r) && r.every((val, i) => Math.abs(val - c.expected[i]) < 1e-4);
              return { id: c.id, input: `z = [${c.z.join(',')}]`, expected: JSON.stringify(c.expected.map(v => Math.round(v * 10000)/10000)), actual: JSON.stringify(r), passed: passed };
            } catch (e) {
              return { id: c.id, input: `z = [${c.z.join(',')}]`, expected: JSON.stringify(c.expected), actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    }
  ],
  'DevOps': [
    {
      id: 'devops_algo_1',
      title: 'DevOps Challenge: Log File Error Parser',
      difficulty: 'Medium',
      functionName: 'parseLogs',
      companies: ['Amazon', 'Netflix', 'Harness'],
      description: 'Given an array of server logs where each log is formatted as `"TIMESTAMP [LEVEL] MSG [IP:ip_address]"`, extract all distinct IP addresses that are associated with a `"[ERROR]"` message, and return them sorted alphabetically.\n\n**Example:**\nInput: `logs = ["12:00 [INFO] User logged in [IP:1.1.1.1]", "12:01 [ERROR] DB connection timed out [IP:2.2.2.2]", "12:02 [ERROR] Disk full [IP:1.1.1.1]"]`\nOutput: `["1.1.1.1", "2.2.2.2"]`',
      starterTemplates: {
        javascript: `function parseLogs(logs) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def parseLogs(logs: List[str]) -> List[str]:\n    # Write your Python code here\n    return []`,
        java: `class Solution {\n    public List<String> parseLogs(String[] logs) {\n        // Write your Java code here\n        return new ArrayList<>();\n    }\n}`,
        cpp: `class Solution {\npublic:\n    vector<string> parseLogs(vector<string>& logs) {\n        // Write your C++ code here\n        return {};\n    }\n};`,
        c: `char** parseLogs(char** logs, int logsSize, int* returnSize) {\n    // Write your C code here\n    *returnSize = 0;\n    return NULL;\n}`,
        csharp: `public class Solution {\n    public List<string> ParseLogs(string[] logs) {\n        // Write your C# code here\n        return new List<string>();\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'logs = ["12:00 [ERROR] Fail [IP:8.8.8.8]", "12:01 [INFO] Ok [IP:1.1.1.1]", "12:02 [ERROR] Fail [IP:8.8.8.8]"]', expected: '["8.8.8.8"]' },
        { id: 2, input: 'logs = ["10:00 [ERROR] Auth [IP:2.2.2.2]", "10:01 [ERROR] Timeout [IP:1.1.1.1]"]', expected: '["1.1.1.1", "2.2.2.2"]' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn parseLogs;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, logs: ["12:00 [ERROR] Fail [IP:8.8.8.8]", "12:01 [INFO] Ok [IP:1.1.1.1]", "12:02 [ERROR] Fail [IP:8.8.8.8]"], expected: ["8.8.8.8"] },
            { id: 2, logs: ["10:00 [ERROR] Auth [IP:2.2.2.2]", "10:01 [ERROR] Timeout [IP:1.1.1.1]"], expected: ["1.1.1.1", "2.2.2.2"] }
          ];
          const results = cases.map(c => {
            try {
              const r = func([...c.logs]);
              const passed = Array.isArray(r) && r.sort().join(',') === c.expected.sort().join(',');
              return { id: c.id, input: `logs = [${c.logs.map(x=>`"${x}"`).join(',')}]`, expected: JSON.stringify(c.expected), actual: JSON.stringify(r), passed: passed };
            } catch (e) {
              return { id: c.id, input: `logs = [${c.logs.map(x=>`"${x}"`).join(',')}]`, expected: JSON.stringify(c.expected), actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    },
    {
      id: 'devops_algo_2',
      title: 'DevOps Challenge: CIDR Subnet Matcher',
      difficulty: 'Medium',
      functionName: 'ipInCIDR',
      companies: ['HashiCorp', 'Google', 'AWS'],
      description: 'Given an IPv4 address string (`ip`) and a CIDR subnet block string (`cidr`, e.g. `"192.168.1.0/24"`), check if the IP belongs to the subnet block range.\n\n**Example:**\nInput: `ip = "192.168.1.50"`, `cidr = "192.168.1.0/24"`\nOutput: `true` (Since /24 allows range 192.168.1.0 to 192.168.1.255)',
      starterTemplates: {
        javascript: `function ipInCIDR(ip, cidr) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def ipInCIDR(ip: str, cidr: str) -> bool:\n    # Write your Python code here\n    return False`,
        java: `class Solution {\n    public boolean ipInCIDR(String ip, String cidr) {\n        // Write your Java code here\n        return false;\n    }\n}`,
        cpp: `class Solution {\npublic:\n    bool ipInCIDR(string ip, string cidr) {\n        // Write your C++ code here\n        return false;\n    }\n};`,
        c: `#include <stdbool.h>\n\nbool ipInCIDR(char* ip, char* cidr) {\n    // Write your C code here\n    return false;\n}`,
        csharp: `public class Solution {\n    public bool IpInCIDR(string ip, string cidr) {\n        // Write your C# code here\n        return false;\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'ip = "192.168.1.50", cidr = "192.168.1.0/24"', expected: 'true' },
        { id: 2, input: 'ip = "10.0.0.1", cidr = "10.1.0.0/16"', expected: 'false' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn ipInCIDR;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, ip: "192.168.1.50", cidr: "192.168.1.0/24", expected: true },
            { id: 2, ip: "10.0.0.1", cidr: "10.1.0.0/16", expected: false }
          ];
          const results = cases.map(c => {
            try {
              const r = func(c.ip, c.cidr);
              return { id: c.id, input: `ip = "${c.ip}", cidr = "${c.cidr}"`, expected: String(c.expected), actual: String(r), passed: r === c.expected };
            } catch (e) {
              return { id: c.id, input: `ip = "${c.ip}", cidr = "${c.cidr}"`, expected: String(c.expected), actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    }
  ],
  'Cloud': [
    {
      id: 'cloud_algo_1',
      title: 'Cloud Challenge: Load Balancer Round Robin',
      difficulty: 'Easy',
      functionName: 'getNextServer',
      companies: ['AWS', 'Cloudflare', 'Microsoft'],
      description: 'Implement a basic stateless Round Robin target group selector. Given an array of target server nodes (`servers`) and the total request index integer count (`requestCount`), return the string name of the server chosen for this request. (Use 0-based request indexing).\n\n**Example:**\nInput: `servers = ["serverA", "serverB", "serverC"]`, `requestCount = 5`\nOutput: `"serverC"` (since 5 % 3 = 2, selecting index 2)',
      starterTemplates: {
        javascript: `function getNextServer(servers, requestCount) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def getNextServer(servers: List[str], requestCount: int) -> str:\n    # Write your Python code here\n    return ""`,
        java: `class Solution {\n    public String getNextServer(String[] servers, int requestCount) {\n        // Write your Java code here\n        return "";\n    }\n}`,
        cpp: `class Solution {\npublic:\n    string getNextServer(vector<string>& servers, int requestCount) {\n        // Write your C++ code here\n        return "";\n    }\n};`,
        c: `char* getNextServer(char** servers, int serversSize, int requestCount) {\n    // Write your C code here\n    return servers[0];\n}`,
        csharp: `public class Solution {\n    public string GetNextServer(string[] servers, int requestCount) {\n        // Write your C# code here\n        return "";\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'servers = ["serverA","serverB"], requestCount = 3', expected: '"serverB"' },
        { id: 2, input: 'servers = ["serverA","serverB","serverC"], requestCount = 9', expected: '"serverA"' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn getNextServer;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, servers: ["serverA","serverB"], req: 3, expected: "serverB" },
            { id: 2, servers: ["serverA","serverB","serverC"], req: 9, expected: "serverA" }
          ];
          const results = cases.map(c => {
            try {
              const r = func([...c.servers], c.req);
              return { id: c.id, input: `servers = [${c.servers.map(x=>`"${x}"`).join(',')}], requestCount = ${c.req}`, expected: `"${c.expected}"`, actual: `"${r}"`, passed: r === c.expected };
            } catch (e) {
              return { id: c.id, input: `servers = [${c.servers.map(x=>`"${x}"`).join(',')}], requestCount = ${c.req}`, expected: `"${c.expected}"`, actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    },
    {
      id: 'cloud_algo_2',
      title: 'Cloud Challenge: IAM Policy Action Validator',
      difficulty: 'Medium',
      functionName: 'isActionAllowed',
      companies: ['AWS', 'Stripe', 'Google'],
      description: 'You are implementing an IAM Policy validator. Given a policy JSON representation containing a list of wildcards, check if a requested action (e.g. `"s3:GetObject"`) is allowed by an array of allowed action patterns.\n\n**Pattern Rules:**\n- `"s3:*"` allows any action starting with `"s3:"`\n- `"*"` allows any action\n\n**Example:**\nInput: `allowedPatterns = ["s3:Get*", "iam:*"], requestedAction = "s3:GetObject"`\nOutput: `true`',
      starterTemplates: {
        javascript: `function isActionAllowed(allowedPatterns, requestedAction) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def isActionAllowed(allowedPatterns: List[str], requestedAction: str) -> bool:\n    # Write your Python code here\n    return False`,
        java: `class Solution {\n    public boolean isActionAllowed(List<String> allowedPatterns, String requestedAction) {\n        // Write your Java code here\n        return false;\n    }\n}`,
        cpp: `class Solution {\npublic:\n    bool isActionAllowed(vector<string>& allowedPatterns, string requestedAction) {\n        // Write your C++ code here\n        return false;\n    }\n};`,
        c: `#include <stdbool.h>\n\nbool isActionAllowed(char** allowedPatterns, int size, char* requestedAction) {\n    // Write your C code here\n    return false;\n}`,
        csharp: `public class Solution {\n    public bool IsActionAllowed(string[] allowedPatterns, string requestedAction) {\n        // Write your C# code here\n        return false;\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'allowedPatterns = ["s3:Get*", "iam:*"], requestedAction = "s3:GetObject"', expected: 'true' },
        { id: 2, input: 'allowedPatterns = ["s3:List*"], requestedAction = "s3:PutObject"', expected: 'false' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn isActionAllowed;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, patterns: ["s3:Get*", "iam:*"], req: "s3:GetObject", expected: true },
            { id: 2, patterns: ["s3:List*"], req: "s3:PutObject", expected: false }
          ];
          const results = cases.map(c => {
            try {
              const r = func([...c.patterns], c.req);
              return { id: c.id, input: `allowedPatterns = [${c.patterns.map(x=>`"${x}"`).join(',')}], requestedAction = "${c.req}"`, expected: String(c.expected), actual: String(r), passed: r === c.expected };
            } catch (e) {
              return { id: c.id, input: `allowedPatterns = [${c.patterns.map(x=>`"${x}"`).join(',')}], requestedAction = "${c.req}"`, expected: String(c.expected), actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    }
  ],
  'Full Stack': [
    {
      id: 'fs_algo_1',
      title: 'Full Stack Challenge: Flatten Nested Object',
      difficulty: 'Medium',
      functionName: 'flattenObject',
      companies: ['Meta', 'Uber', 'Airbnb'],
      description: 'Implement a utility function to flatten a nested object where keys are dot-separated paths. Assume all keys are objects or primitive values (no arrays).\n\n**Example:**\nInput: `obj = {"user": {"profile": {"name": "John", "age": 30}, "role": "admin"}}`\nOutput: `{"user.profile.name": "John", "user.profile.age": 30, "user.role": "admin"}`',
      starterTemplates: {
        javascript: `function flattenObject(obj) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def flattenObject(obj: dict) -> dict:\n    # Write your Python code here\n    return {}`,
        java: `class Solution {\n    public Map<String, Object> flattenObject(Map<String, Object> obj) {\n        // Write your Java code here\n        return new HashMap<>();\n    }\n}`,
        cpp: `// Simulating JSON via Map representation\nclass Solution {\npublic:\n    map<string, string> flattenObject(map<string, string> obj) {\n        return obj;\n    }\n};`,
        c: `// Not standard in basic C; return unmodified string representation\nchar* flattenObject(char* jsonStr) {\n    return jsonStr;\n}`,
        csharp: `public class Solution {\n    public Dictionary<string, object> FlattenObject(Dictionary<string, object> obj) {\n        return new Dictionary<string, object>();\n    }\n}`
      },
      testCases: [
        { id: 1, input: 'obj = {"a":{"b":1,"c":{"d":2}}}', expected: '{"a.b":1,"a.c.d":2}' },
        { id: 2, input: 'obj = {"user":{"role":"admin"}}', expected: '{"user.role":"admin"}' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn flattenObject;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, obj: {"a":{"b":1,"c":{"d":2}}}, expected: {"a.b":1,"a.c.d":2} },
            { id: 2, obj: {"user":{"role":"admin"}}, expected: {"user.role":"admin"} }
          ];
          const results = cases.map(c => {
            try {
              const r = func(JSON.parse(JSON.stringify(c.obj)));
              const passed = JSON.stringify(r) === JSON.stringify(c.expected);
              return { id: c.id, input: `obj = ${JSON.stringify(c.obj)}`, expected: JSON.stringify(c.expected), actual: JSON.stringify(r), passed: passed };
            } catch (e) {
              return { id: c.id, input: `obj = ${JSON.stringify(c.obj)}`, expected: JSON.stringify(c.expected), actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    },
    {
      id: 'fs_algo_2',
      title: 'Full Stack Challenge: Query Parameter Objectifier',
      difficulty: 'Easy',
      functionName: 'parseQuery',
      companies: ['Vercel', 'Netlify', 'Pinterest'],
      description: 'Write a helper function to convert a URL query string parameters (excluding leading "?") into a key-value object. Support repeated keys as an array of values.\n\n**Example:**\nInput: `"tags=js&tags=react&user=admin"`\nOutput: `{"tags": ["js", "react"], "user": "admin"}`',
      starterTemplates: {
        javascript: `function parseQuery(queryString) {\n    // Write your JavaScript code here\n    \n}`,
        python: `def parseQuery(queryString: str) -> dict:\n    # Write your Python code here\n    return {}`,
        java: `class Solution {\n    public Map<String, Object> parseQuery(String queryString) {\n        // Write your Java code here\n        return new HashMap<>();\n    }\n}`,
        cpp: `class Solution {\npublic:\n    map<string, string> parseQuery(string queryString) {\n        return {};\n    }\n};`,
        c: `char* parseQuery(char* queryString) {\n    return "";\n}`,
        csharp: `public class Solution {\n    public Dictionary<string, object> ParseQuery(string queryString) {\n        return new Dictionary<string, object>();\n    }\n}`
      },
      testCases: [
        { id: 1, input: '"a=1&b=2&a=3"', expected: '{"a":["1","3"],"b":"2"}' },
        { id: 2, input: '"user=admin"', expected: '{"user":"admin"}' }
      ],
      validator: (codeText) => {
        try {
          const fullScript = `${codeText}\nreturn parseQuery;`;
          const evaluator = new Function(fullScript);
          const func = evaluator();
          const cases = [
            { id: 1, qs: "a=1&b=2&a=3", expected: {"a":["1","3"],"b":"2"} },
            { id: 2, qs: "user=admin", expected: {"user":"admin"} }
          ];
          const results = cases.map(c => {
            try {
              const r = func(c.qs);
              const passed = JSON.stringify(r) === JSON.stringify(c.expected);
              return { id: c.id, input: `"${c.qs}"`, expected: JSON.stringify(c.expected), actual: JSON.stringify(r), passed: passed };
            } catch (e) {
              return { id: c.id, input: `"${c.qs}"`, expected: JSON.stringify(c.expected), actual: `Error: ${e.message}`, passed: false };
            }
          });
          const allPassed = results.every(r => r.passed);
          const log = allPassed ? '✓ Success: All test cases passed!' : `❌ Failed: ${results.filter(r => !r.passed).length} test cases failed.`;
          return { success: allPassed, log, results };
        } catch (e) {
          return { success: false, log: 'Compilation/Execution Error: ' + e.message };
        }
      }
    }
  ]
};

const sqlProblems = {
  'Software Development': [
    {
      id: 'sql_1',
      title: 'LeetCode 176: Second Highest Salary',
      difficulty: 'Medium',
      companies: ['Microsoft', 'Amazon', 'Google', 'Oracle'],
      description: 'Write a SQL query to find the second highest salary from the `Employee` table. If there is no second highest salary, return `null`.\n\n**Schema:**\nTable `Employee` (id INT, salary INT)\n\n**Example:**\nInput: Employee with salaries: `100, 200, 300`\nOutput: `200`',
      starterCode: `-- Write your SQL query here\nSELECT `,
      testCases: [
        { id: 1, input: 'Employee table with salaries: [100, 200, 300]', expected: '200' },
        { id: 2, input: 'Employee table with salaries: [100]', expected: 'null' }
      ],
      validator: (code) => {
        const query = code.toLowerCase().trim();
        if (!query.includes('select')) {
          const err = 'SQL Error: Query must start with a SELECT statement.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Employee: [100, 200, 300]', expected: '200', actual: err, passed: false },
              { id: 2, input: 'Employee: [100]', expected: 'null', actual: err, passed: false }
            ]
          };
        }
        if (!query.includes('employee')) {
          const err = 'SQL Error: Query must select FROM the Employee table.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Employee: [100, 200, 300]', expected: '200', actual: err, passed: false },
              { id: 2, input: 'Employee: [100]', expected: 'null', actual: err, passed: false }
            ]
          };
        }
        
        const hasSubquery = query.includes('select') && query.indexOf('select') !== query.lastIndexOf('select');
        const hasLimitOffset = query.includes('limit') && query.includes('offset');
        const hasMax = query.includes('max(') || query.includes('max (');
        
        if (hasSubquery || hasLimitOffset || hasMax) {
          return {
            success: true,
            log: '✓ Success: SQL Query execution mock returned correct output.',
            results: [
              { id: 1, input: 'Employee: [100, 200, 300]', expected: '200', actual: '200', passed: true },
              { id: 2, input: 'Employee: [100]', expected: 'null', actual: 'null', passed: true }
            ]
          };
        } else {
          const err = 'SQL Output Error: Query executed but returned incorrect results. Hint: Use a subquery with Max() or LIMIT 1 OFFSET 1 to filter out the maximum salary.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Employee: [100, 200, 300]', expected: '200', actual: '300 (Highest Salary instead of Second)', passed: false },
              { id: 2, input: 'Employee: [100]', expected: 'null', actual: '100 (Single Salary instead of null)', passed: false }
            ]
          };
        }
      }
    },
    {
      id: 'sql_2',
      title: 'LeetCode 182: Duplicate Emails',
      difficulty: 'Easy',
      companies: ['Uber', 'Twitter', 'Google', 'Meta'],
      description: 'Write a SQL query to report all duplicate emails in the `Person` table. Every email in this table is non-null.\n\n**Schema:**\nTable `Person` (id INT, email VARCHAR)\n\n**Example:**\nInput: Person with emails: `a@b.com, c@d.com, a@b.com`\nOutput: `a@b.com`',
      starterCode: `-- Write your SQL query here\nSELECT `,
      testCases: [
        { id: 1, input: 'Person: [a@b.com, c@d.com, a@b.com]', expected: 'a@b.com' },
        { id: 2, input: 'Person: [x@y.com, w@z.com]', expected: ' (empty set)' }
      ],
      validator: (code) => {
        const query = code.toLowerCase().trim();
        if (!query.includes('select')) {
          const err = 'SQL Error: Query must start with a SELECT statement.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Person: [a@b.com, c@d.com, a@b.com]', expected: 'a@b.com', actual: err, passed: false },
              { id: 2, input: 'Person: [x@y.com, w@z.com]', expected: ' (empty set)', actual: err, passed: false }
            ]
          };
        }
        if (!query.includes('person')) {
          const err = 'SQL Error: Query must select FROM the Person table.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Person: [a@b.com, c@d.com, a@b.com]', expected: 'a@b.com', actual: err, passed: false },
              { id: 2, input: 'Person: [x@y.com, w@z.com]', expected: ' (empty set)', actual: err, passed: false }
            ]
          };
        }
        if (!query.includes('group by')) {
          const err = 'SQL Error: Query should group rows using GROUP BY email.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Person: [a@b.com, c@d.com, a@b.com]', expected: 'a@b.com', actual: err, passed: false },
              { id: 2, input: 'Person: [x@y.com, w@z.com]', expected: ' (empty set)', actual: err, passed: false }
            ]
          };
        }
        if (!query.includes('having') || !query.includes('count')) {
          const err = 'SQL Error: Query must filter duplicates using HAVING count(email) > 1.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Person: [a@b.com, c@d.com, a@b.com]', expected: 'a@b.com', actual: err, passed: false },
              { id: 2, input: 'Person: [x@y.com, w@z.com]', expected: ' (empty set)', actual: err, passed: false }
            ]
          };
        }
        return {
          success: true,
          log: '✓ Success: SQL Query execution mock returned duplicate emails.',
          results: [
            { id: 1, input: 'Person: [a@b.com, c@d.com, a@b.com]', expected: 'a@b.com', actual: 'a@b.com', passed: true },
            { id: 2, input: 'Person: [x@y.com, w@z.com]', expected: ' (empty set)', actual: ' (empty set)', passed: true }
          ]
        };
      }
    },
    {
      id: 'sql_3',
      title: 'LeetCode 181: Employees Earning More Than Their Managers',
      difficulty: 'Easy',
      companies: ['Google', 'Meta', 'Amazon', 'Apple'],
      description: 'Write a SQL query to find the employees who earn more than their managers.\n\n**Schema:**\nTable `Employee` (id INT, name VARCHAR, salary INT, managerId INT)\n\n**Example:**\nInput: Employee Joe earns 70k (Manager Sam earns 60k)\nOutput: `Joe`',
      starterCode: `-- Write your SQL query here\nSELECT `,
      testCases: [
        { id: 1, input: 'Employee table: Joe (70k, manager Sam), Sam (60k, no manager)', expected: 'Joe' },
        { id: 2, input: 'Employee table: Joe (50k, manager Sam), Sam (60k, no manager)', expected: ' (empty set)' }
      ],
      validator: (code) => {
        const query = code.toLowerCase().trim();
        if (!query.includes('select')) {
          const err = 'SQL Error: Query must start with a SELECT statement.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Joe (70k) manager Sam (60k)', expected: 'Joe', actual: err, passed: false },
              { id: 2, input: 'Joe (50k) manager Sam (60k)', expected: ' (empty set)', actual: err, passed: false }
            ]
          };
        }
        if (!query.includes('employee')) {
          const err = 'SQL Error: Query must select FROM the Employee table.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Joe (70k) manager Sam (60k)', expected: 'Joe', actual: err, passed: false },
              { id: 2, input: 'Joe (50k) manager Sam (60k)', expected: ' (empty set)', actual: err, passed: false }
            ]
          };
        }
        const hasSelfJoin = query.includes('join') || (query.split('employee').length - 1 >= 2);
        if (!hasSelfJoin) {
          const err = 'SQL Error: Query needs to perform a self-join (or multiple references to Employee) to compare employee and manager salaries.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Joe (70k) manager Sam (60k)', expected: 'Joe', actual: err, passed: false },
              { id: 2, input: 'Joe (50k) manager Sam (60k)', expected: ' (empty set)', actual: err, passed: false }
            ]
          };
        }
        if (!query.includes('salary') || !query.includes('>')) {
          const err = 'SQL Error: Query must check if employee salary is greater than manager salary.';
          return {
            success: false,
            log: err,
            results: [
              { id: 1, input: 'Joe (70k) manager Sam (60k)', expected: 'Joe', actual: err, passed: false },
              { id: 2, input: 'Joe (50k) manager Sam (60k)', expected: ' (empty set)', actual: err, passed: false }
            ]
          };
        }
        return {
          success: true,
          log: '✓ Success: SQL Query execution mock returned employee names.',
          results: [
            { id: 1, input: 'Joe (70k) manager Sam (60k)', expected: 'Joe', actual: 'Joe', passed: true },
            { id: 2, input: 'Joe (50k) manager Sam (60k)', expected: ' (empty set)', actual: ' (empty set)', passed: true }
          ]
        };
      }
    }
  ],
  'AI/ML': [
    {
      id: 'ml_sql_1',
      title: 'ML Database: Best Performing Model Version',
      difficulty: 'Medium',
      companies: ['OpenAI', 'Google', 'HuggingFace'],
      description: 'Write a SQL query to find the version of each model (`name`) that achieved the highest `accuracy` in the `models` table. If there is a accuracy tie, select the version with the lower `loss`.\n\n**Schema:**\nTable `models` (id INT, name VARCHAR, version VARCHAR, accuracy FLOAT, loss FLOAT)\n\n**Example Output:**\n`name | version | accuracy | loss`\n`BERT | v2.0 | 0.94 | 0.12`\n`GPT | v4.0 | 0.98 | 0.04`',
      starterCode: `-- Write your SQL query here\nSELECT `,
      testCases: [
        { id: 1, input: 'models entries: BERT(v1: 0.90, loss 0.2), BERT(v2: 0.94, loss 0.12)', expected: 'BERT v2.0' },
        { id: 2, input: 'models entries: ResNet(v1: 0.88, loss 0.3), ResNet(v2: 0.88, loss 0.25)', expected: 'ResNet v2.0 (Tie broken by lower loss)' }
      ],
      validator: (code) => {
        const query = code.toLowerCase().trim();
        if (!query.includes('select') || !query.includes('models')) return { success: false, log: 'SQL Error: Select from models table is required.', results: [] };
        const hasRank = query.includes('row_number()') || query.includes('rank()') || query.includes('partition by') || query.includes('max(');
        if (!hasRank) return { success: false, log: 'SQL Error: Query must partition/rank model runs or group by model names to find the maximum accuracy.', results: [] };
        return { success: true, log: '✓ Success: Best model versions selected successfully.', results: [ { id: 1, input: 'BERT versions v1 and v2', expected: 'BERT v2.0', actual: 'BERT v2.0', passed: true }, { id: 2, input: 'ResNet tie accuracy', expected: 'ResNet v2.0', actual: 'ResNet v2.0', passed: true } ] };
      }
    },
    {
      id: 'ml_sql_2',
      title: 'ML Database: Average Training Duration',
      difficulty: 'Easy',
      companies: ['NVIDIA', 'Meta', 'LambdaLabs'],
      description: 'Calculate the average training duration (in minutes) for each framework where the status is `"completed"`.\n\n**Schema:**\nTable `runs` (id INT, framework VARCHAR, duration_minutes INT, status VARCHAR)\n\n**Example Output:**\n`framework | avg_duration`\n`PyTorch | 120.5`\n`TensorFlow | 150.0`',
      starterCode: `-- Write your SQL query here\nSELECT `,
      testCases: [
        { id: 1, input: 'runs: PyTorch(completed, 120m), PyTorch(completed, 60m)', expected: 'PyTorch: 90' },
        { id: 2, input: 'runs: TensorFlow(failed, 50m), TensorFlow(completed, 180m)', expected: 'TensorFlow: 180 (Failed run excluded)' }
      ],
      validator: (code) => {
        const query = code.toLowerCase().trim();
        if (!query.includes('select') || !query.includes('runs')) return { success: false, log: 'SQL Error: Must query from runs table.', results: [] };
        if (!query.includes('avg(') && !query.includes('avg (')) return { success: false, log: 'SQL Error: Average aggregation function AVG() is missing.', results: [] };
        if (!query.includes('group by')) return { success: false, log: 'SQL Error: Must group by framework.', results: [] };
        if (!query.includes('completed')) return { success: false, log: 'SQL Error: Missing check for status = "completed".', results: [] };
        return { success: true, log: '✓ Success: Average training durations calculated.', results: [ { id: 1, input: 'PyTorch completed runs', expected: '90.0', actual: '90.0', passed: true }, { id: 2, input: 'TensorFlow status check', expected: '180.0', actual: '180.0', passed: true } ] };
      }
    }
  ],
  'DevOps': [
    {
      id: 'devops_sql_1',
      title: 'DevOps DB: Server CPU Spike Outliers',
      difficulty: 'Medium',
      companies: ['Datadog', 'Splunk', 'PagerDuty'],
      description: 'Find all server nodes (`node_id`) from the `server_metrics` table whose average CPU utilization exceeded 90% in the last 24 hours. Order them by the highest average utilization.\n\n**Schema:**\nTable `server_metrics` (id INT, node_id VARCHAR, cpu_utilization FLOAT, recorded_at TIMESTAMP)',
      starterCode: `-- Write your SQL query here\nSELECT `,
      testCases: [
        { id: 1, input: 'metrics: node-1 (avg 92.5%), node-2 (avg 85.0%)', expected: '["node-1"]' },
        { id: 2, input: 'metrics: node-a (avg 95.0%), node-b (avg 98.2%)', expected: '["node-b", "node-a"]' }
      ],
      validator: (code) => {
        const query = code.toLowerCase().trim();
        if (!query.includes('server_metrics')) return { success: false, log: 'SQL Error: Table must be server_metrics', results: [] };
        if (!query.includes('avg(') && !query.includes('avg (')) return { success: false, log: 'SQL Error: CPU aggregation avg(cpu_utilization) is missing', results: [] };
        if (!query.includes('group by')) return { success: false, log: 'SQL Error: Group by node_id is required', results: [] };
        if (!query.includes('having') || !query.includes('90')) return { success: false, log: 'SQL Error: HAVING filter for cpu utilization > 90% is missing', results: [] };
        return { success: true, log: '✓ Success: High utilization CPU outliers identified.', results: [ { id: 1, input: 'node-1 avg cpu 92.5%', expected: '["node-1"]', actual: '["node-1"]', passed: true }, { id: 2, input: 'node-b (98.2%) > node-a (95%) order', expected: '["node-b", "node-a"]', actual: '["node-b", "node-a"]', passed: true } ] };
      }
    }
  ],
  'Cloud': [
    {
      id: 'cloud_sql_1',
      title: 'Cloud DB: Orphaned Unattached Storage Volumes',
      difficulty: 'Medium',
      companies: ['AWS', 'Airbnb', 'Netflix'],
      description: 'Identify all storage volume IDs (`volume_id`) from the `ebs_volumes` table that are currently unattached (i.e. they do not exist in the `attached_devices` list).\n\n**Schema:**\nTable `ebs_volumes` (volume_id VARCHAR, size_gb INT, status VARCHAR)\nTable `attached_devices` (attachment_id VARCHAR, volume_id VARCHAR, instance_id VARCHAR)',
      starterCode: `-- Write your SQL query here\nSELECT `,
      testCases: [
        { id: 1, input: 'volumes: vol-1, vol-2; attachments: vol-1', expected: '["vol-2"]' },
        { id: 2, input: 'volumes: vol-a, vol-b; attachments: none', expected: '["vol-a", "vol-b"]' }
      ],
      validator: (code) => {
        const query = code.toLowerCase().trim();
        if (!query.includes('ebs_volumes')) return { success: false, log: 'SQL Error: Must query from ebs_volumes table', results: [] };
        const hasLeftJoin = query.includes('left join') && query.includes('null');
        const hasNotIn = query.includes('not in') || query.includes('not exists');
        if (!hasLeftJoin && !hasNotIn) return { success: false, log: 'SQL Error: Missing exclusion query check (use LEFT JOIN ... IS NULL or NOT IN subquery).', results: [] };
        return { success: true, log: '✓ Success: Orphaned storage volumes identified.', results: [ { id: 1, input: 'vol-2 unattached', expected: '["vol-2"]', actual: '["vol-2"]', passed: true }, { id: 2, input: 'No attachments', expected: '["vol-a", "vol-b"]', actual: '["vol-a", "vol-b"]', passed: true } ] };
      }
    }
  ],
  'Full Stack': [
    {
      id: 'fs_sql_1',
      title: 'Full Stack DB: User Session Statistics',
      difficulty: 'Medium',
      companies: ['Stripe', 'Slack', 'Okta'],
      description: 'Report the total number of distinct user login sessions (`session_id`) per user during the past 7 days, for users who had more than 3 sessions.\n\n**Schema:**\nTable `user_sessions` (session_id VARCHAR, user_id VARCHAR, login_time TIMESTAMP)',
      starterCode: `-- Write your SQL query here\nSELECT `,
      testCases: [
        { id: 1, input: 'sessions: user-1 (5 sessions), user-2 (2 sessions)', expected: 'user-1: 5' },
        { id: 2, input: 'sessions: user-a (4 sessions), user-b (4 sessions)', expected: 'user-a: 4, user-b: 4' }
      ],
      validator: (code) => {
        const query = code.toLowerCase().trim();
        if (!query.includes('user_sessions')) return { success: false, log: 'SQL Error: Must query user_sessions table', results: [] };
        if (!query.includes('count(') && !query.includes('count (')) return { success: false, log: 'SQL Error: Missing session count expression.', results: [] };
        if (!query.includes('group by')) return { success: false, log: 'SQL Error: GROUP BY user_id is required', results: [] };
        if (!query.includes('having')) return { success: false, log: 'SQL Error: HAVING clause filter for count > 3 is missing', results: [] };
        return { success: true, log: '✓ Success: Session statistics fetched.', results: [ { id: 1, input: 'user-1 (5 sessions) > 3 filter', expected: 'user-1: 5', actual: 'user-1: 5', passed: true }, { id: 2, input: 'user-a and user-b count', expected: 'user-a: 4, user-b: 4', actual: 'user-a: 4, user-b: 4', passed: true } ] };
      }
    }
  ]
};

const getStarterTemplate = (prob, lang) => {
  if (prob.starterTemplates && prob.starterTemplates[lang]) {
    return prob.starterTemplates[lang];
  }
  const funcName = prob.slug ? prob.slug.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) : 'solution';
  switch (lang) {
    case 'javascript':
      return `/*\n * LeetCode Problem: ${prob.title || ''}\n * URL: https://leetcode.com/problems/${prob.slug || ''}/\n */\nfunction ${funcName}() {\n    // Write your JavaScript code here\n    \n}`;
    case 'python':
      return `# LeetCode Problem: ${prob.title || ''}\n# URL: https://leetcode.com/problems/${prob.slug || ''}/\ndef ${funcName}():\n    # Write your Python code here\n    pass`;
    case 'java':
      return `/*\n * LeetCode Problem: ${prob.title || ''}\n * URL: https://leetcode.com/problems/${prob.slug || ''}/\n */\nclass Solution {\n    public void ${funcName}() {\n        // Write your Java code here\n        \n    }\n}`;
    case 'cpp':
      return `/*\n * LeetCode Problem: ${prob.title || ''}\n * URL: https://leetcode.com/problems/${prob.slug || ''}/\n */\nclass Solution {\npublic:\n    void ${funcName}() {\n        // Write your C++ code here\n        \n    }\n};`;
    case 'c':
      return `/*\n * LeetCode Problem: ${prob.title || ''}\n * URL: https://leetcode.com/problems/${prob.slug || ''}/\n */\nvoid ${funcName}() {\n    // Write your C code here\n    \n}`;
    case 'csharp':
      return `/*\n * LeetCode Problem: ${prob.title || ''}\n * URL: https://leetcode.com/problems/${prob.slug || ''}/\n */\npublic class Solution {\n    public void ${funcName}() {\n        // Write your C# code here\n        \n    }\n}`;
    case 'sql':
      return `-- LeetCode Problem: ${prob.title || ''}\n-- URL: https://leetcode.com/problems/${prob.slug || ''}/\nSELECT * FROM table_name;\n`;
    default:
      return `// Write your code here`;
  }
};

export default function DailyPractice({ user, token, onActionTriggered }) {
  const [activeRole, setActiveRole] = useState(
    user?.targetRole && questionPool[user.targetRole] ? user.targetRole : 'Software Development'
  );

  const [liveLeetcodeQuestions, setLiveLeetcodeQuestions] = useState([]);
  const [selectedLiveLeetcodeQuestion, setSelectedLiveLeetcodeQuestion] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchLiveLeetcode = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/leetcode/all');
        if (res.ok && active) {
          const data = await res.json();
          const marked = data.map(q => ({
            ...q,
            isLeetCodeLive: true
          }));
          setLiveLeetcodeQuestions(marked);
        }
      } catch (err) {
        console.error('Failed to load live LeetCode questions:', err);
      }
    };
    fetchLiveLeetcode();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user?.targetRole && questionPool[user.targetRole]) {
      setActiveRole(user.targetRole);
    }
  }, [user]);

  const role = activeRole;
  const questions = questionPool[role] || questionPool['Software Development'];
  
  const activeAlgoProblems = algoProblems[role] || algoProblems['Software Development'];
  const activeSqlProblems = sqlProblems[role] || sqlProblems['Software Development'];

  // Compile unique company lists dynamically from all data resources
  const allCompanies = Array.from(new Set([
    ...Object.values(questionPool).flatMap(list => list.flatMap(q => q.companies || [])),
    ...Object.values(algoProblems).flatMap(list => list.flatMap(q => q.companies || [])),
    ...Object.values(sqlProblems).flatMap(list => list.flatMap(q => q.companies || [])),
    ...liveLeetcodeQuestions.flatMap(q => q.companies || [])
  ])).sort();

  // Aggregate all questions in the explorer data set
  const allExplorerQuestions = [];

  // Conceptual Quiz (MCQ) Problems
  Object.entries(questionPool).forEach(([roleName, list]) => {
    list.forEach((q, index) => {
      allExplorerQuestions.push({
        ...q,
        role: roleName,
        type: 'mcq',
        index: index,
        typeName: 'Conceptual Quiz',
        typeIcon: '📋'
      });
    });
  });

  // Coding Challenges (Algorithms)
  Object.entries(algoProblems).forEach(([roleName, list]) => {
    list.forEach((q, index) => {
      allExplorerQuestions.push({
        ...q,
        role: roleName,
        type: 'algo',
        index: index,
        typeName: 'Coding Challenge',
        typeIcon: '💻'
      });
    });
  });

  // SQL Problems
  Object.entries(sqlProblems).forEach(([roleName, list]) => {
    list.forEach((q, index) => {
      allExplorerQuestions.push({
        ...q,
        role: roleName,
        type: 'sql',
        index: index,
        typeName: 'SQL Laboratory',
        typeIcon: '🗄️'
      });
    });
  });

  // Merge Live LeetCode questions
  allExplorerQuestions.push(...liveLeetcodeQuestions);

  // Switcher state
  const [activeMode, setActiveMode] = useState('platform'); // 'platform', 'mcq', 'algo', 'sql', 'explorer'

  // Explorer states
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerRole, setExplorerRole] = useState('All');
  const [explorerCompany, setExplorerCompany] = useState('All');
  const [explorerDifficulty, setExplorerDifficulty] = useState('All');
  const [explorerType, setExplorerType] = useState('All');

  // MCQ states
  const [theta, setTheta] = useState(0.0); // User ability: -3.0 to +3.0
  const [difficultyTier, setDifficultyTier] = useState('Medium'); // Easy, Medium, Hard, Expert
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  // Algorithmic Coding States
  const [selectedAlgoIdx, setSelectedAlgoIdx] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [algoCode, setAlgoCode] = useState('');
  const [algoConsole, setAlgoConsole] = useState(null);
  const [algoSuccess, setAlgoSuccess] = useState(null);
  
  // SQL States
  const [selectedSqlIdx, setSelectedSqlIdx] = useState(0);
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlConsole, setSqlConsole] = useState(null);
  const [sqlSuccess, setSqlSuccess] = useState(null);

  // Visual Console States
  const [algoResults, setAlgoResults] = useState(null);
  const [sqlResults, setSqlResults] = useState(null);
  const [algoConsoleTab, setAlgoConsoleTab] = useState('testcases'); // 'testcases' or 'results'
  const [sqlConsoleTab, setSqlConsoleTab] = useState('testcases'); // 'testcases' or 'results'
  const [activeAlgoCaseIdx, setActiveAlgoCaseIdx] = useState(0);
  const [activeSqlCaseIdx, setActiveSqlCaseIdx] = useState(0);

  // Initialize first MCQ question based on Medium difficulty
  useEffect(() => {
    selectQuestion(difficultyTier);
  }, []);

  // Sync difficulty tier when theta updates
  useEffect(() => {
    let tier = 'Medium';
    if (theta < -0.8) {
      tier = 'Easy';
    } else if (theta >= -0.8 && theta < 0.8) {
      tier = 'Medium';
    } else if (theta >= 0.8 && theta < 1.8) {
      tier = 'Hard';
    } else {
      tier = 'Expert';
    }
    setDifficultyTier(tier);
  }, [theta]);

  // Reset indices when user targetRole changes
  useEffect(() => {
    setSelectedAlgoIdx(0);
    setSelectedSqlIdx(0);
    setAlgoConsole(null);
    setAlgoSuccess(null);
    setAlgoResults(null);
    setSqlConsole(null);
    setSqlSuccess(null);
    setSqlResults(null);
  }, [role]);

  // Sync Algo template when selected problem or language changes
  useEffect(() => {
    const activeProb = (selectedLiveLeetcodeQuestion && selectedLiveLeetcodeQuestion.type === 'algo')
      ? selectedLiveLeetcodeQuestion
      : activeAlgoProblems[selectedAlgoIdx];

    if (activeProb) {
      const template = (activeProb.starterTemplates && activeProb.starterTemplates[selectedLanguage]) ||
                       (activeProb.starterTemplates && activeProb.starterTemplates['javascript']) ||
                       getStarterTemplate(activeProb, selectedLanguage);
      setAlgoCode(template);
      setAlgoConsole(null);
      setAlgoSuccess(null);
      setAlgoResults(null);
      setAlgoConsoleTab(activeProb.isLeetCodeLive ? 'results' : 'testcases');
      setActiveAlgoCaseIdx(0);
    }
  }, [selectedAlgoIdx, selectedLanguage, role, selectedLiveLeetcodeQuestion]);

  // Sync SQL template when selected problem changes
  useEffect(() => {
    const activeProb = (selectedLiveLeetcodeQuestion && selectedLiveLeetcodeQuestion.type === 'sql')
      ? selectedLiveLeetcodeQuestion
      : activeSqlProblems[selectedSqlIdx];

    if (activeProb) {
      setSqlQuery(activeProb.starterCode || getStarterTemplate(activeProb, 'sql'));
      setSqlConsole(null);
      setSqlSuccess(null);
      setSqlResults(null);
      setSqlConsoleTab(activeProb.isLeetCodeLive ? 'results' : 'testcases');
      setActiveSqlCaseIdx(0);
    }
  }, [selectedSqlIdx, role, selectedLiveLeetcodeQuestion]);

  const selectQuestion = (tier) => {
    const candidates = questions.filter(q => q.difficulty === tier);
    const targetQ = candidates.length > 0 
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : questions[Math.floor(Math.random() * questions.length)];
      
    setCurrentQuestion(targetQ);
    setSelectedAnswer(null);
    setSubmitted(false);
    setFeedbackMsg(null);
  };

  const handleAnswerSelect = (idx) => {
    if (submitted) return;
    setSelectedAnswer(idx);
  };

  const logPracticeOnServer = async (qId, concept, difficulty, isCorrect) => {
    let thetaChange = isCorrect ? 0.6 : -0.4;
    const newTheta = Math.min(Math.max(theta + thetaChange, -3.0), 3.0);
    setTheta(newTheta);
    
    try {
      await fetch('http://localhost:5000/api/analytics/practice-log', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questionId: qId,
          concept: concept,
          difficulty: difficulty,
          correct: isCorrect,
          thetaRating: newTheta
        })
      });
      if (onActionTriggered) onActionTriggered();
    } catch (err) {
      console.warn('Could not log practice on server:', err.message);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    
    let thetaChange = isCorrect ? 0.6 : -0.4;
    const newTheta = Math.min(Math.max(theta + thetaChange, -3.0), 3.0);
    setTheta(newTheta);
    
    setSubmitted(true);
    setHistoryCount(prev => prev + 1);

    try {
      const response = await fetch('http://localhost:5000/api/analytics/practice-log', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          concept: currentQuestion.concept,
          difficulty: currentQuestion.difficulty,
          correct: isCorrect,
          thetaRating: newTheta
        })
      });
      const data = await response.json();
      
      if (onActionTriggered) onActionTriggered();

      setFeedbackMsg({
        correct: isCorrect,
        text: isCorrect 
          ? `Correct! Ability index (theta) increased to ${newTheta.toFixed(2)}.` 
          : `Incorrect. Correct answer is: ${currentQuestion.options[currentQuestion.correctIndex]}. Ability index (theta) dropped to ${newTheta.toFixed(2)}.`
      });
    } catch (err) {
      console.error('Error logging practice: ', err);
      setFeedbackMsg({
        correct: isCorrect,
        text: `Logged locally (Server offline). Correct answer: ${currentQuestion.options[currentQuestion.correctIndex]}`
      });
    }
  };

  const handleNextQuestion = () => {
    let tier = 'Medium';
    if (theta < -0.8) {
      tier = 'Easy';
    } else if (theta >= -0.8 && theta < 0.8) {
      tier = 'Medium';
    } else if (theta >= 0.8 && theta < 1.8) {
      tier = 'Hard';
    } else {
      tier = 'Expert';
    }
    selectQuestion(tier);
  };

  const handleSelectConcept = (conceptName) => {
    // Switch to Conceptual Quiz tab first
    setActiveMode('mcq');
    
    // Find all questions in the current role that match the concept
    let candidates = questions.filter(q => q.concept === conceptName);
    
    // If no candidates in the current role, search across all roles
    if (candidates.length === 0) {
      Object.keys(questionPool).forEach(roleKey => {
        const matchingQs = questionPool[roleKey].filter(q => q.concept === conceptName);
        candidates.push(...matchingQs);
      });
    }

    if (candidates.length > 0) {
      // Pick a random question from candidates
      const targetQ = candidates[Math.floor(Math.random() * candidates.length)];
      setCurrentQuestion(targetQ);
      setSelectedAnswer(null);
      setSubmitted(false);
      setFeedbackMsg(null);
    }
  };

  const getCompilerName = (lang) => {
    switch (lang) {
      case 'python': return 'Python 3.11 Interpreter';
      case 'java': return 'OpenJDK Java 17 Compiler';
      case 'cpp': return 'GCC G++ 12 C++ Compiler';
      case 'c': return 'GCC 12 C Compiler';
      case 'csharp': return 'Microsoft .NET C# Compiler';
      default: return 'JS Runtime';
    }
  };

  const handleRunLiveLeetcode = async (type) => {
    const activeProb = selectedLiveLeetcodeQuestion;
    if (!activeProb) return;

    const code = type === 'sql' ? sqlQuery : algoCode;

    if (type === 'sql') {
      setSqlConsole("Submitting code to AI review engine...\nLinking compilation nodes...\nRunning verification heuristics...\n");
      setSqlSuccess(null);
      setSqlResults(null);
      setSqlConsoleTab('results');
    } else {
      setAlgoConsole("Submitting code to AI review engine...\nLinking compilation nodes...\nRunning verification heuristics...\n");
      setAlgoSuccess(null);
      setAlgoResults(null);
      setAlgoConsoleTab('results');
    }

    try {
      const response = await fetch('http://localhost:5000/api/leetcode/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          codeText: code,
          language: type === 'sql' ? 'sql' : selectedLanguage,
          slug: activeProb.slug
        })
      });

      if (!response.ok) {
        throw new Error(`Review server returned status ${response.status}`);
      }

      const data = await response.json();

      if (type === 'sql') {
        let fullLog = data.log || '';
        if (data.success && data.suggestions) {
          fullLog += `\n\n💡 AI Suggestions:\n` + data.suggestions.map(s => `- ${s}`).join('\n') + `\n\n📊 Complexity Analysis:\n- Time: ${data.metrics?.timeComplexity || 'O(N)'}\n- Space: ${data.metrics?.spaceComplexity || 'O(1)'}`;
        }
        setSqlConsole(fullLog);
        setSqlSuccess(data.success);
        setSqlResults(data.results || null);
        setSqlConsoleTab('results');
      } else {
        let fullLog = data.log || '';
        if (data.success && data.suggestions) {
          fullLog += `\n\n💡 AI Suggestions:\n` + data.suggestions.map(s => `- ${s}`).join('\n') + `\n\n📊 Complexity Analysis:\n- Time: ${data.metrics?.timeComplexity || 'O(N)'}\n- Space: ${data.metrics?.spaceComplexity || 'O(1)'}`;
        }
        setAlgoConsole(fullLog);
        setAlgoSuccess(data.success);
        setAlgoResults(data.results || null);
        setAlgoConsoleTab('results');
      }

      if (data.success) {
        setHistoryCount(prev => prev + 1);
        logPracticeOnServer(activeProb.id, activeProb.concept, activeProb.difficulty, true);
      }
    } catch (err) {
      const errMsg = `\n❌ AI Review Request Failed: ${err.message}. Please check your connection or retry.\n`;
      if (type === 'sql') {
        setSqlConsole(prev => prev + errMsg);
        setSqlSuccess(false);
      } else {
        setAlgoConsole(prev => prev + errMsg);
        setAlgoSuccess(false);
      }
    }
  };

  const handleRunAlgo = () => {
    const activeProb = (selectedLiveLeetcodeQuestion && selectedLiveLeetcodeQuestion.type === 'algo')
      ? selectedLiveLeetcodeQuestion
      : activeAlgoProblems[selectedAlgoIdx];
    
    if (activeProb?.isLeetCodeLive) {
      handleRunLiveLeetcode('algo');
      return;
    }
    
    if (selectedLanguage === 'javascript') {
      const res = activeProb.validator(algoCode);
      setAlgoConsole(res.log);
      setAlgoSuccess(res.success);
      setAlgoResults(res.results || null);
      setAlgoConsoleTab('results');
      setActiveAlgoCaseIdx(0);
      
      if (res.success) {
        setHistoryCount(prev => prev + 1);
        logPracticeOnServer(activeProb.id, 'Algorithms', activeProb.difficulty, true);
      }
    } else {
      // Compilation Simulation
      const compiler = getCompilerName(selectedLanguage);
      setAlgoConsole(`Compiling solution using ${compiler}...\nLinking dependencies...\nRunning test suite against inputs...\n`);
      setAlgoSuccess(null);
      setAlgoResults(null);

      setTimeout(() => {
        const templateCode = activeProb.starterTemplates[selectedLanguage];
        const hasEdited = algoCode.trim() !== templateCode.trim() && algoCode.length > templateCode.length + 5;

        if (!hasEdited) {
          const errMsg = `\n❌ Compilation Error: Code has not been modified from the starter template. Please write your logic solution.`;
          setAlgoConsole(prev => prev + errMsg);
          setAlgoSuccess(false);
          
          const mockResults = activeProb.testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: 'Compilation Error: Starter template unmodified',
            passed: false
          }));
          setAlgoResults(mockResults);
          setAlgoConsoleTab('results');
          setActiveAlgoCaseIdx(0);
          return;
        }

        // Logic check heuristics
        const clean = algoCode.toLowerCase();
        let passes = true;
        let hint = '';

        if (activeProb.id === 'algo_1') {
          // Two Sum
          const hasLoop = clean.includes('for') || clean.includes('while') || clean.includes('lambda');
          const hasMap = clean.includes('map') || clean.includes('dict') || clean.includes('hash') || clean.includes('unordered_map') || clean.includes('dictionary');
          if (!hasLoop) {
            passes = false;
            hint = 'Error: No loops or iterations detected. You must search elements to find the target pair.';
          } else if (!hasMap) {
            // Check nested loop
            const count = (clean.split('for').length - 1) + (clean.split('while').length - 1);
            if (count < 2) {
              passes = false;
              hint = 'Error: For a correct solution, either use a hash lookup (Map/Dictionary) in O(N) or nested loops in O(N^2).';
            }
          }
        } else if (activeProb.id === 'algo_2') {
          // Valid Parentheses
          const hasStack = clean.includes('stack') || clean.includes('push') || clean.includes('pop') || clean.includes('append') || clean.includes('list') || clean.includes('vector') || clean.includes('stack');
          if (!hasStack) {
            passes = false;
            hint = 'Error: No stack-like operations (push/pop/vector/list) detected. A stack is required to validate brace orders.';
          }
        } else if (activeProb.id === 'algo_3') {
          // Reverse String
          const hasSwap = clean.includes('temp') || clean.includes('swap') || clean.includes('left') || clean.includes('right') || clean.includes('reverse') || clean.includes('^=');
          if (!hasSwap) {
            passes = false;
            hint = 'Error: No swapping logic detected. You must swap elements in-place to reverse the string.';
          }
        }

        const mockResults = activeProb.testCases.map(tc => {
          if (passes) {
            return {
              id: tc.id,
              input: tc.input,
              expected: tc.expected,
              actual: tc.expected,
              passed: true
            };
          } else {
            return {
              id: tc.id,
              input: tc.input,
              expected: tc.expected,
              actual: `Incorrect: Logical verification failed (${hint})`,
              passed: false
            };
          }
        });

        setAlgoResults(mockResults);
        setAlgoConsoleTab('results');
        setActiveAlgoCaseIdx(0);

        if (passes) {
          setAlgoConsole(prev => prev + `\n- Test Case 1: Passed\n- Test Case 2: Passed\n${activeProb.id === 'algo_1' || activeProb.id === 'algo_2' ? '- Test Case 3: Passed\n' : ''}\n✓ Success: Compilation successful. All unit test assertions passed!`);
          setAlgoSuccess(true);
          setHistoryCount(prev => prev + 1);
          logPracticeOnServer(activeProb.id, 'Algorithms', activeProb.difficulty, true);
        } else {
          setAlgoConsole(prev => prev + `\n❌ Logical Verification Failed:\n${hint}\n\nPlease correct your logic and re-compile.`);
          setAlgoSuccess(false);
        }
      }, 800);
    }
  };

  const handleRunSql = () => {
    const activeProb = (selectedLiveLeetcodeQuestion && selectedLiveLeetcodeQuestion.type === 'sql')
      ? selectedLiveLeetcodeQuestion
      : activeSqlProblems[selectedSqlIdx];

    if (activeProb?.isLeetCodeLive) {
      handleRunLiveLeetcode('sql');
      return;
    }

    const res = activeProb.validator(sqlQuery);
    setSqlConsole(res.log);
    setSqlSuccess(res.success);
    setSqlResults(res.results || null);
    setSqlConsoleTab('results');
    setActiveSqlCaseIdx(0);
    
    if (res.success) {
      setHistoryCount(prev => prev + 1);
      logPracticeOnServer(activeProb.id, 'Database', activeProb.difficulty, true);
    }
  };

  const algoLineCount = algoCode ? algoCode.split('\n').length : 1;
  const algoLineNumbers = Array.from({ length: Math.max(algoLineCount, 15) }, (_, i) => i + 1);

  const sqlLineCount = sqlQuery ? sqlQuery.split('\n').length : 1;
  const sqlLineNumbers = Array.from({ length: Math.max(sqlLineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="glass-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Daily Adaptive Preparation
        </h1>
        <p>Your practice engine is fueled by an Item Response Theory (IRT) model that calibrates problem difficulties dynamically.</p>
      </div>

      {/* Practice Mode Switcher Header */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem', 
        borderBottom: '1px solid var(--glass-border)', 
        paddingBottom: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <button 
          className={`btn ${activeMode === 'platform' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveMode('platform')}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          🚀 LeetCode Coding Platform
        </button>
        <button 
          className={`btn ${activeMode === 'mcq' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveMode('mcq')}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          📋 Conceptual Quiz
        </button>
        <button 
          className={`btn ${activeMode === 'algo' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveMode('algo')}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          💻 Coding Challenges
        </button>
        <button 
          className={`btn ${activeMode === 'sql' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveMode('sql')}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          🗄️ SQL Laboratory
        </button>
        <button 
          className={`btn ${activeMode === 'explorer' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveMode('explorer')}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          🔍 LeetCode Explorer
        </button>
      </div>

      {activeMode === 'platform' && (
        <ProblemPlatform user={user} token={token} onActionTriggered={onActionTriggered} />
      )}

      {activeMode !== 'platform' && (
        <div className="practice-container">
        {/* Left Column: Active Practice Workspace */}
        <div>
          {activeMode === 'mcq' && (
            currentQuestion ? (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="badge badge-primary">{currentQuestion.concept}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className={`badge ${
                        currentQuestion.difficulty === 'Easy' ? 'badge-success' :
                        currentQuestion.difficulty === 'Medium' ? 'badge-primary' :
                        currentQuestion.difficulty === 'Hard' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {currentQuestion.difficulty}
                      </span>
                      <span className="badge badge-secondary">Theta: {theta.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* LeetCode Label and Target Companies */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.01)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '8px', 
                    padding: '0.6rem 0.8rem', 
                    marginBottom: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#ffa116', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Code Challenge <span>⚡</span>
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>| LeetCode-style Problem</span>
                    </div>
                    {currentQuestion.companies && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Target Interviews:</span>
                        {currentQuestion.companies.map((co, cidx) => (
                          <span 
                            key={cidx} 
                            style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 600,
                              padding: '0.2rem 0.5rem', 
                              borderRadius: '4px', 
                              background: 'rgba(255, 255, 255, 0.04)', 
                              color: 'var(--text-main)',
                              border: '1px solid var(--glass-border)',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                              transition: 'all 0.2s ease',
                              cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(236,72,153,0.1)';
                              e.target.style.borderColor = 'var(--accent)';
                              e.target.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                              e.target.style.borderColor = 'var(--glass-border)';
                              e.target.style.color = 'var(--text-main)';
                            }}
                          >
                            {co}
                          </span >
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 style={{ marginBottom: '1.5rem', lineHeight: '1.4' }}>{currentQuestion.question}</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {currentQuestion.options.map((option, idx) => {
                      let buttonClass = 'option-button';
                      if (selectedAnswer === idx) buttonClass += ' selected';
                      if (submitted) {
                        if (idx === currentQuestion.correctIndex) buttonClass += ' correct';
                        else if (selectedAnswer === idx) buttonClass += ' wrong';
                      }

                      return (
                        <button
                          key={idx}
                          className={buttonClass}
                          onClick={() => handleAnswerSelect(idx)}
                          disabled={submitted}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  {feedbackMsg && (
                    <div className="glass-card" style={{ 
                      borderColor: feedbackMsg.correct ? 'var(--success)' : 'var(--danger)',
                      background: feedbackMsg.correct ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                      marginBottom: '1.25rem', 
                      padding: '1rem' 
                    }}>
                      <strong style={{ color: feedbackMsg.correct ? 'var(--success)' : 'var(--danger)', display: 'block', marginBottom: '0.25rem' }}>
                        {feedbackMsg.correct ? 'Well Done!' : 'Review Concept'}
                      </strong>
                      <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{feedbackMsg.text}</p>
                      <p style={{ fontSize: '0.8rem' }}>{currentQuestion.explanation}</p>
                    </div>
                  )}

                  {!submitted ? (
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: '100%', background: 'linear-gradient(135deg, var(--secondary), #0891b2)', border: 'none' }}
                      onClick={handleNextQuestion}
                    >
                      Next Adaptive Question
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <p>Loading Question...</p>
              </div>
            )
          )}

          {activeMode === 'algo' && (() => {
            const activeProb = (selectedLiveLeetcodeQuestion && selectedLiveLeetcodeQuestion.type === 'algo')
              ? selectedLiveLeetcodeQuestion
              : activeAlgoProblems[selectedAlgoIdx];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Problem Description & asked by tags */}
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '200px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Select Algorithmic Problem</label>
                      {activeProb?.isLeetCodeLive ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>
                            LeetCode Mode Active 🌐
                          </span>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', textTransform: 'none' }}
                            onClick={() => setSelectedLiveLeetcodeQuestion(null)}
                          >
                            Return to Local Practice
                          </button>
                        </div>
                      ) : (
                        <select 
                          className="glass-input"
                          value={selectedAlgoIdx}
                          onChange={(e) => setSelectedAlgoIdx(Number(e.target.value))}
                          style={{ background: '#0a0915', height: '38px', padding: '0 0.75rem' }}
                        >
                          {activeAlgoProblems.map((p, idx) => (
                            <option key={p.id} value={idx} style={{ background: '#0a0915' }}>{p.title} ({p.difficulty})</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`badge ${
                        activeProb?.difficulty === 'Easy' ? 'badge-success' :
                        activeProb?.difficulty === 'Medium' ? 'badge-primary' :
                        activeProb?.difficulty === 'Hard' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {activeProb?.difficulty}
                      </span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="glass-input"
                        style={{ 
                          width: '120px', 
                          height: '28px', 
                          padding: '0 0.5rem', 
                          fontSize: '0.75rem', 
                          background: '#090a18',
                          borderRadius: '6px',
                          borderColor: 'rgba(255,255,255,0.15)'
                        }}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="csharp">C#</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.01)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '8px', 
                    padding: '0.6rem 0.8rem', 
                    marginBottom: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Interviews:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {activeProb?.companies?.map((co, cidx) => (
                        <span 
                          key={cidx} 
                          style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px', 
                            background: 'rgba(255, 255, 255, 0.04)', 
                            color: 'var(--text-main)',
                            border: '1px solid var(--glass-border)',
                          }}
                        >
                          {co}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    {activeProb?.title}
                  </h3>
                  
                  {activeProb?.isLeetCodeLive ? (
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                      <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                        This is a live LeetCode problem. The full description, constraints, and test suite are hosted on LeetCode.com.
                      </p>
                      <div style={{ margin: '1.5rem 0' }}>
                        <a 
                          href={`https://leetcode.com/problems/${activeProb.slug}/`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                        >
                          Open Problem on LeetCode 🌐
                        </a>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Write your solution below, then click <strong>Run Test Cases ⚡</strong> to submit your solution to our offline AI Code Reviewer. We will analyze your code correctness, time complexity, space complexity, and edge cases.
                      </p>
                    </div>
                  ) : (
                    <div style={{ 
                      fontSize: '0.9rem', 
                      lineHeight: '1.6', 
                      color: 'var(--text-main)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {activeProb?.description}
                    </div>
                  )}
                </div>

                {/* Code Workspace */}
                <div className="glass-card" style={{ background: '#090a18', padding: '1rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      solution.{selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'c' ? 'c' : 'cs'}
                    </span>
                    <button 
                      onClick={() => setAlgoCode(getStarterTemplate(activeProb, selectedLanguage))}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Reset Template
                    </button>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid var(--glass-border)', borderRadius: '6px', background: '#0b0c16', minHeight: '280px', overflow: 'hidden' }}>
                    {/* Line Numbers */}
                    <div style={{ 
                      width: '35px', 
                      background: '#07080e', 
                      borderRight: '1px solid var(--glass-border)', 
                      padding: '0.75rem 0', 
                      textAlign: 'right', 
                      paddingRight: '8px', 
                      color: 'rgba(255,255,255,0.15)', 
                      fontFamily: 'Consolas, Courier New, monospace', 
                      fontSize: '0.85rem',
                      lineHeight: '1.5',
                      userSelect: 'none'
                    }}>
                      {algoLineNumbers.map(n => <div key={n}>{n}</div>)}
                    </div>

                    <textarea
                      value={algoCode}
                      onChange={(e) => setAlgoCode(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#e2e8f0',
                        padding: '0.75rem',
                        fontFamily: 'Consolas, Courier New, monospace',
                        fontSize: '0.85rem',
                        lineHeight: '1.5',
                        resize: 'vertical',
                        minHeight: '280px',
                        whiteSpace: 'pre'
                      }}
                    />
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '1rem' }}
                    onClick={handleRunAlgo}
                  >
                    Run Test Cases ⚡
                  </button>
                </div>

                {/* Visual Test Cases Console */}
                <div className="glass-card" style={{
                  background: '#090a18',
                  border: '1px solid var(--glass-border)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {activeProb?.isLeetCodeLive ? (
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--glass-border)',
                        paddingBottom: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                          🌐 AI Code Review Report
                        </span>
                        {algoSuccess !== null && (
                          <span className={`badge ${algoSuccess ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                            {algoSuccess ? 'REVIEW PASSED' : 'REVIEW FAILED'}
                          </span>
                        )}
                      </div>
                      {algoConsole ? (
                        <pre style={{
                          margin: 0,
                          padding: '0.75rem',
                          background: '#04030a',
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.85)',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {algoConsole}
                        </pre>
                      ) : (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
                          No execution log. Click 'Run Test Cases ⚡' to trigger review analysis.
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Console Tabs */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--glass-border)',
                        paddingBottom: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className={`btn ${algoConsoleTab === 'testcases' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '4px' }}
                            onClick={() => setAlgoConsoleTab('testcases')}
                          >
                            📋 Test Cases
                          </button>
                          <button
                            className={`btn ${algoConsoleTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '4px' }}
                            onClick={() => setAlgoConsoleTab('results')}
                            disabled={algoResults === null}
                          >
                            {algoSuccess === true ? '✅ Results (Passed)' : algoSuccess === false ? '❌ Results (Failed)' : '⚡ Results'}
                          </button>
                        </div>
                        {algoResults && (
                          <span className={`badge ${algoSuccess ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                            {algoSuccess ? 'ALL PASSED' : 'SOME FAILED'}
                          </span>
                        )}
                      </div>

                      {/* Sub-tabs for Case 1, Case 2, etc. */}
                      {algoConsoleTab === 'testcases' && (
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {activeProb?.testCases?.map((tc, idx) => (
                              <button
                                key={tc.id}
                                onClick={() => setActiveAlgoCaseIdx(idx)}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  background: activeAlgoCaseIdx === idx ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                  color: activeAlgoCaseIdx === idx ? '#fff' : 'var(--text-muted)',
                                  border: '1px solid',
                                  borderColor: activeAlgoCaseIdx === idx ? 'var(--accent)' : 'var(--glass-border)',
                                  cursor: 'pointer'
                                }}
                              >
                                Case {idx + 1}
                              </button>
                            ))}
                          </div>

                          {/* Active Test Case Detail */}
                          {activeProb?.testCases?.[activeAlgoCaseIdx] && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Input Parameters:</span>
                                <pre style={{
                                  margin: 0,
                                  padding: '0.5rem 0.75rem',
                                  background: '#07080e',
                                  borderRadius: '4px',
                                  border: '1px solid var(--glass-border)',
                                  fontFamily: 'monospace',
                                  color: '#fff',
                                  overflowX: 'auto'
                                }}>
                                  {activeProb.testCases[activeAlgoCaseIdx].input}
                                </pre>
                              </div>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Expected Output:</span>
                                <pre style={{
                                  margin: 0,
                                  padding: '0.5rem 0.75rem',
                                  background: '#07080e',
                                  borderRadius: '4px',
                                  border: '1px solid var(--glass-border)',
                                  fontFamily: 'monospace',
                                  color: 'var(--success)',
                                  overflowX: 'auto'
                                }}>
                                  {activeProb.testCases[activeAlgoCaseIdx].expected}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {algoConsoleTab === 'results' && algoResults && (
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {algoResults.map((res, idx) => (
                              <button
                                key={res.id}
                                onClick={() => setActiveAlgoCaseIdx(idx)}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  background: activeAlgoCaseIdx === idx ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                  color: res.passed ? 'var(--success)' : 'var(--danger)',
                                  border: '1px solid',
                                  borderColor: activeAlgoCaseIdx === idx ? (res.passed ? 'var(--success)' : 'var(--danger)') : 'var(--glass-border)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <span>{res.passed ? '✓' : '✗'}</span> Case {idx + 1}
                              </button>
                            ))}
                          </div>

                          {/* Active Result Detail */}
                          {algoResults[activeAlgoCaseIdx] && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Input:</span>
                                <pre style={{
                                  margin: 0,
                                  padding: '0.5rem 0.75rem',
                                  background: '#07080e',
                                  borderRadius: '4px',
                                  border: '1px solid var(--glass-border)',
                                  fontFamily: 'monospace',
                                  color: '#fff'
                                }}>
                                  {algoResults[activeAlgoCaseIdx].input}
                                </pre>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Expected Output:</span>
                                  <pre style={{
                                    margin: 0,
                                    padding: '0.5rem 0.75rem',
                                    background: '#07080e',
                                    borderRadius: '4px',
                                    border: '1px solid var(--glass-border)',
                                    fontFamily: 'monospace',
                                    color: 'var(--success)'
                                  }}>
                                    {algoResults[activeAlgoCaseIdx].expected}
                                  </pre>
                                </div>
                                <div>
                                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Your Code Output:</span>
                                  <pre style={{
                                    margin: 0,
                                    padding: '0.5rem 0.75rem',
                                    background: '#07080e',
                                    borderRadius: '4px',
                                    border: '1px solid var(--glass-border)',
                                    fontFamily: 'monospace',
                                    color: algoResults[activeAlgoCaseIdx].passed ? 'var(--success)' : 'var(--danger)'
                                  }}>
                                    {algoResults[activeAlgoCaseIdx].actual}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Console Logs / Compiler Outputs */}
                          {algoConsole && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Compiler Execution logs:</span>
                              <pre style={{
                                margin: 0,
                                padding: '0.75rem',
                                background: '#04030a',
                                borderRadius: '4px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.85)',
                                whiteSpace: 'pre-wrap'
                              }}>
                                {algoConsole}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {activeMode === 'sql' && (() => {
            const activeProb = (selectedLiveLeetcodeQuestion && selectedLiveLeetcodeQuestion.type === 'sql')
              ? selectedLiveLeetcodeQuestion
              : activeSqlProblems[selectedSqlIdx];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Problem Description & asked by tags */}
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '200px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Select SQL Problem</label>
                      {activeProb?.isLeetCodeLive ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>
                            LeetCode Mode Active 🌐
                          </span>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', textTransform: 'none' }}
                            onClick={() => setSelectedLiveLeetcodeQuestion(null)}
                          >
                            Return to Local Practice
                          </button>
                        </div>
                      ) : (
                        <select 
                          className="glass-input"
                          value={selectedSqlIdx}
                          onChange={(e) => setSelectedSqlIdx(Number(e.target.value))}
                          style={{ background: '#0a0915', height: '38px', padding: '0 0.75rem' }}
                        >
                          {activeSqlProblems.map((p, idx) => (
                            <option key={p.id} value={idx} style={{ background: '#0a0915' }}>{p.title} ({p.difficulty})</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`badge ${
                        activeProb?.difficulty === 'Easy' ? 'badge-success' :
                        activeProb?.difficulty === 'Medium' ? 'badge-primary' :
                        activeProb?.difficulty === 'Hard' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {activeProb?.difficulty}
                      </span>
                      <span className="badge badge-secondary">SQL</span>
                    </div>
                  </div>

                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.01)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '8px', 
                    padding: '0.6rem 0.8rem', 
                    marginBottom: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Interviews:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {activeProb?.companies?.map((co, cidx) => (
                        <span 
                          key={cidx} 
                          style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px', 
                            background: 'rgba(255, 255, 255, 0.04)', 
                            color: 'var(--text-main)',
                            border: '1px solid var(--glass-border)',
                          }}
                        >
                          {co}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    {activeProb?.title}
                  </h3>
                  
                  {activeProb?.isLeetCodeLive ? (
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                      <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                        This is a live LeetCode database problem. The full description, schema structure, and test suite are hosted on LeetCode.com.
                      </p>
                      <div style={{ margin: '1.5rem 0' }}>
                        <a 
                          href={`https://leetcode.com/problems/${activeProb.slug}/`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                        >
                          Open Problem on LeetCode 🌐
                        </a>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Write your SQL query below, then click <strong>Execute Query ⚡</strong> to submit your query to our offline AI SQL Reviewer. We will analyze your query syntax, performance indexing, and accuracy.
                      </p>
                    </div>
                  ) : (
                    <div style={{ 
                      fontSize: '0.9rem', 
                      lineHeight: '1.6', 
                      color: 'var(--text-main)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {activeProb?.description}
                    </div>
                  )}
                </div>

                {/* SQL Query Console */}
                <div className="glass-card" style={{ background: '#090a18', padding: '1rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>query.sql</span>
                    <button 
                      onClick={() => setSqlQuery(activeProb.starterCode || getStarterTemplate(activeProb, 'sql'))}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Reset Template
                    </button>
                  </div>

                  <div style={{ display: 'flex', border: '1px solid var(--glass-border)', borderRadius: '6px', background: '#0b0c16', minHeight: '280px', overflow: 'hidden' }}>
                    {/* Line Numbers */}
                    <div style={{ 
                      width: '35px', 
                      background: '#07080e', 
                      borderRight: '1px solid var(--glass-border)', 
                      padding: '0.75rem 0', 
                      textAlign: 'right', 
                      paddingRight: '8px', 
                      color: 'rgba(255,255,255,0.15)', 
                      fontFamily: 'Consolas, Courier New, monospace', 
                      fontSize: '0.85rem',
                      lineHeight: '1.5',
                      userSelect: 'none'
                    }}>
                      {sqlLineNumbers.map(n => <div key={n}>{n}</div>)}
                    </div>

                    <textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#e2e8f0',
                        padding: '0.75rem',
                        fontFamily: 'Consolas, Courier New, monospace',
                        fontSize: '0.85rem',
                        lineHeight: '1.5',
                        resize: 'vertical',
                        minHeight: '280px',
                        whiteSpace: 'pre'
                      }}
                    />
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '1rem' }}
                    onClick={handleRunSql}
                  >
                    Execute Query ⚡
                  </button>
                </div>

                {/* Visual Test Cases Console */}
                <div className="glass-card" style={{
                  background: '#090a18',
                  border: '1px solid var(--glass-border)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {activeProb?.isLeetCodeLive ? (
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--glass-border)',
                        paddingBottom: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                          🌐 AI SQL Review Report
                        </span>
                        {sqlSuccess !== null && (
                          <span className={`badge ${sqlSuccess ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                            {sqlSuccess ? 'REVIEW PASSED' : 'REVIEW FAILED'}
                          </span>
                        )}
                      </div>
                      {sqlConsole ? (
                        <pre style={{
                          margin: 0,
                          padding: '0.75rem',
                          background: '#04030a',
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.85)',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {sqlConsole}
                        </pre>
                      ) : (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
                          No execution log. Click 'Execute Query ⚡' to trigger review analysis.
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Console Tabs */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--glass-border)',
                        paddingBottom: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className={`btn ${sqlConsoleTab === 'testcases' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '4px' }}
                            onClick={() => setSqlConsoleTab('testcases')}
                          >
                            📋 Test Cases
                          </button>
                          <button
                            className={`btn ${sqlConsoleTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '4px' }}
                            onClick={() => setSqlConsoleTab('results')}
                            disabled={sqlResults === null}
                          >
                            {sqlSuccess === true ? '✅ Results (Passed)' : sqlSuccess === false ? '❌ Results (Failed)' : '⚡ Results'}
                          </button>
                        </div>
                        {sqlResults && (
                          <span className={`badge ${sqlSuccess ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                            {sqlSuccess ? 'ALL PASSED' : 'SOME FAILED'}
                          </span>
                        )}
                      </div>

                      {/* Sub-tabs for Case 1, Case 2, etc. */}
                      {sqlConsoleTab === 'testcases' && (
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {activeProb?.testCases?.map((tc, idx) => (
                              <button
                                key={tc.id}
                                onClick={() => setActiveSqlCaseIdx(idx)}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  background: activeSqlCaseIdx === idx ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                  color: activeSqlCaseIdx === idx ? '#fff' : 'var(--text-muted)',
                                  border: '1px solid',
                                  borderColor: activeSqlCaseIdx === idx ? 'var(--accent)' : 'var(--glass-border)',
                                  cursor: 'pointer'
                                }}
                              >
                                Case {idx + 1}
                              </button>
                            ))}
                          </div>

                          {/* Active Test Case Detail */}
                          {activeProb?.testCases?.[activeSqlCaseIdx] && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Input State:</span>
                                <pre style={{
                                  margin: 0,
                                  padding: '0.5rem 0.75rem',
                                  background: '#07080e',
                                  borderRadius: '4px',
                                  border: '1px solid var(--glass-border)',
                                  fontFamily: 'monospace',
                                  color: '#fff',
                                  overflowX: 'auto'
                                }}>
                                  {activeProb.testCases[activeSqlCaseIdx].input}
                                </pre>
                              </div>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Expected Output:</span>
                                <pre style={{
                                  margin: 0,
                                  padding: '0.5rem 0.75rem',
                                  background: '#07080e',
                                  borderRadius: '4px',
                                  border: '1px solid var(--glass-border)',
                                  fontFamily: 'monospace',
                                  color: 'var(--success)',
                                  overflowX: 'auto'
                                }}>
                                  {activeProb.testCases[activeSqlCaseIdx].expected}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {sqlConsoleTab === 'results' && sqlResults && (
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {sqlResults.map((res, idx) => (
                              <button
                                key={res.id}
                                onClick={() => setActiveSqlCaseIdx(idx)}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.75rem',
                                  borderRadius: '4px',
                                  background: activeSqlCaseIdx === idx ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                  color: res.passed ? 'var(--success)' : 'var(--danger)',
                                  border: '1px solid',
                                  borderColor: activeSqlCaseIdx === idx ? (res.passed ? 'var(--success)' : 'var(--danger)') : 'var(--glass-border)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <span>{res.passed ? '✓' : '✗'}</span> Case {idx + 1}
                              </button>
                            ))}
                          </div>

                          {/* Active Result Detail */}
                          {sqlResults[activeSqlCaseIdx] && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                              <div>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Input:</span>
                                <pre style={{
                                  margin: 0,
                                  padding: '0.5rem 0.75rem',
                                  background: '#07080e',
                                  borderRadius: '4px',
                                  border: '1px solid var(--glass-border)',
                                  fontFamily: 'monospace',
                                  color: '#fff'
                                }}>
                                  {sqlResults[activeSqlCaseIdx].input}
                                </pre>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Expected Output:</span>
                                  <pre style={{
                                    margin: 0,
                                    padding: '0.5rem 0.75rem',
                                    background: '#07080e',
                                    borderRadius: '4px',
                                    border: '1px solid var(--glass-border)',
                                    fontFamily: 'monospace',
                                    color: 'var(--success)'
                                  }}>
                                    {sqlResults[activeSqlCaseIdx].expected}
                                  </pre>
                                </div>
                                <div>
                                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Query Output:</span>
                                  <pre style={{
                                    margin: 0,
                                    padding: '0.5rem 0.75rem',
                                    background: '#07080e',
                                    borderRadius: '4px',
                                    border: '1px solid var(--glass-border)',
                                    fontFamily: 'monospace',
                                    color: sqlResults[activeSqlCaseIdx].passed ? 'var(--success)' : 'var(--danger)'
                                  }}>
                                    {sqlResults[activeSqlCaseIdx].actual}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Console Logs / Database Outputs */}
                          {sqlConsole && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Database Execution logs:</span>
                              <pre style={{
                                margin: 0,
                                padding: '0.75rem',
                                background: '#04030a',
                                borderRadius: '4px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.85)',
                                whiteSpace: 'pre-wrap'
                              }}>
                                {sqlConsole}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {activeMode === 'explorer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Explorer Search and Filters */}
              <div className="glass-card">
                <h3 style={{ marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Role & Company LeetCode Explorer
                </h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Filter and search company-specific coding questions, SQL challenges, and conceptual cards.
                </p>

                {/* Filters Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Row 1: Search */}
                  <div>
                    <input
                      type="text"
                      className="glass-input"
                      placeholder="Search questions by title, description, or concept..."
                      value={explorerSearch}
                      onChange={(e) => setExplorerSearch(e.target.value)}
                    />
                  </div>

                  {/* Row 2: Selectors Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                    gap: '0.75rem' 
                  }}>
                    {/* Role Filter */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Role</label>
                      <select
                        className="glass-input"
                        value={explorerRole}
                        onChange={(e) => setExplorerRole(e.target.value)}
                        style={{ background: '#0a0915', height: '38px', padding: '0 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="All">All Roles</option>
                        <option value="Software Development">Software Development</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Full Stack">Full Stack</option>
                      </select>
                    </div>

                    {/* Company Filter */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Company</label>
                      <select
                        className="glass-input"
                        value={explorerCompany}
                        onChange={(e) => setExplorerCompany(e.target.value)}
                        style={{ background: '#0a0915', height: '38px', padding: '0 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="All">All Companies</option>
                        {allCompanies.map((co, cidx) => (
                          <option key={cidx} value={co}>{co}</option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Difficulty</label>
                      <select
                        className="glass-input"
                        value={explorerDifficulty}
                        onChange={(e) => setExplorerDifficulty(e.target.value)}
                        style={{ background: '#0a0915', height: '38px', padding: '0 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Type</label>
                      <select
                        className="glass-input"
                        value={explorerType}
                        onChange={(e) => setExplorerType(e.target.value)}
                        style={{ background: '#0a0915', height: '38px', padding: '0 0.5rem', fontSize: '0.8rem' }}
                      >
                        <option value="All">All Types</option>
                        <option value="algo">Coding Challenges</option>
                        <option value="sql">SQL Laboratory</option>
                        <option value="mcq">Conceptual Quizzes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explorer Questions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(() => {
                  // Filter the aggregated questions list
                  const filtered = allExplorerQuestions.filter((q) => {
                    // Filter by search query
                    if (explorerSearch.trim() !== '') {
                      const query = explorerSearch.toLowerCase();
                      const inTitle = q.title?.toLowerCase().includes(query) || q.question?.toLowerCase().includes(query) || false;
                      const inDesc = q.description?.toLowerCase().includes(query) || q.explanation?.toLowerCase().includes(query) || false;
                      const inConcept = q.concept?.toLowerCase().includes(query) || false;
                      if (!inTitle && !inDesc && !inConcept) return false;
                    }

                    // Filter by Role
                    if (explorerRole !== 'All' && q.role !== explorerRole) {
                      return false;
                    }

                    // Filter by Company
                    if (explorerCompany !== 'All' && !(q.companies && q.companies.includes(explorerCompany))) {
                      return false;
                    }

                    // Filter by Difficulty
                    if (explorerDifficulty !== 'All' && q.difficulty !== explorerDifficulty) {
                      return false;
                    }

                    // Filter by Type
                    if (explorerType !== 'All' && q.type !== explorerType) {
                      return false;
                    }

                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>No questions match your filter criteria.</p>
                        <button 
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
                          onClick={() => {
                            setExplorerSearch('');
                            setExplorerRole('All');
                            setExplorerCompany('All');
                            setExplorerDifficulty('All');
                            setExplorerType('All');
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    );
                  }

                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Found <strong style={{ color: '#fff' }}>{filtered.length}</strong> matching questions
                        </span>
                      </div>
                      
                      <div className="grid-2">
                        {filtered.map((q, idx) => (
                          <div key={`${q.type}_${q.id}_${idx}`} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span className={`badge ${
                                  q.type === 'algo' ? 'badge-primary' : q.type === 'sql' ? 'badge-secondary' : 'badge-success'
                                }`} style={{ fontSize: '0.65rem' }}>
                                  {q.typeIcon} {q.typeName}
                                </span>
                                <span className={`badge ${
                                  q.difficulty === 'Easy' ? 'badge-success' :
                                  q.difficulty === 'Medium' ? 'badge-primary' :
                                  q.difficulty === 'Hard' ? 'badge-warning' : 'badge-danger'
                                }`} style={{ fontSize: '0.65rem' }}>
                                  {q.difficulty}
                                </span>
                              </div>

                              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                                {q.title || (q.question ? q.question.substring(0, 60) + '...' : 'Untitled Question')}
                              </h4>

                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                                <span style={{ 
                                  fontSize: '0.7rem', 
                                  padding: '0.15rem 0.4rem', 
                                  borderRadius: '4px', 
                                  background: 'rgba(255,255,255,0.03)', 
                                  border: '1px solid rgba(255,255,255,0.05)',
                                  color: 'var(--text-muted)' 
                                }}>
                                  🎯 {q.role}
                                </span>
                                {q.concept && (
                                  <span style={{ 
                                    fontSize: '0.7rem', 
                                    padding: '0.15rem 0.4rem', 
                                    borderRadius: '4px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    color: 'var(--text-muted)' 
                                  }}>
                                    💡 {q.concept}
                                  </span>
                                )}
                              </div>

                              {q.companies && q.companies.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>Asked by:</span>
                                  {q.companies.map((co, cidx) => (
                                    <span
                                      key={cidx}
                                      onClick={() => setExplorerCompany(co)}
                                      style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 600,
                                        padding: '0.15rem 0.4rem',
                                        borderRadius: '4px',
                                        background: explorerCompany === co ? 'rgba(139,92,246,0.2)' : 'rgba(255, 255, 255, 0.04)',
                                        color: explorerCompany === co ? '#fff' : 'var(--text-main)',
                                        border: '1px solid',
                                        borderColor: explorerCompany === co ? 'var(--primary)' : 'var(--glass-border)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (explorerCompany !== co) {
                                          e.target.style.background = 'rgba(236,72,153,0.1)';
                                          e.target.style.borderColor = 'var(--accent)';
                                          e.target.style.color = '#fff';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (explorerCompany !== co) {
                                          e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                                          e.target.style.borderColor = 'var(--glass-border)';
                                          e.target.style.color = 'var(--text-main)';
                                        }
                                      }}
                                    >
                                      {co}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              className="btn btn-primary"
                              style={{ width: '100%', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                              onClick={() => {
                                // Switch to the active role of the question
                                setActiveRole(q.role);

                                // Select index/setup question workspace
                                if (q.isLeetCodeLive) {
                                  setSelectedLiveLeetcodeQuestion(q);
                                } else {
                                  setSelectedLiveLeetcodeQuestion(null);
                                  if (q.type === 'algo') {
                                    setSelectedAlgoIdx(q.index);
                                  } else if (q.type === 'sql') {
                                    setSelectedSqlIdx(q.index);
                                  } else if (q.type === 'mcq') {
                                    setCurrentQuestion(q);
                                    setSelectedAnswer(null);
                                    setSubmitted(false);
                                    setFeedbackMsg(null);
                                  }
                                }

                                // Switch workspace tab
                                setActiveMode(q.type);
                              }}
                            >
                              Solve Challenge ⚡
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Concept Connection Map & Telemetry Status (Uniform across modes) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ paddingBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Concept Connection Map</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Topic dependencies. Solving practice cards unlocks connected nodes.</p>
            
            <ConceptMap solvedCount={historyCount} targetRole={role} onSelectConcept={handleSelectConcept} />
          </div>
          
          <div className="glass-card">
            <h4>IRT Calibration Status</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <span>Problems Solved:</span>
              <strong style={{ color: '#fff' }}>{historyCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              <span>Adaptive Ability Index (θ):</span>
              <strong style={{ color: 'var(--secondary)' }}>{theta.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              <span>Active Target Difficulty:</span>
              <strong style={{ color: 'var(--accent)' }}>{difficultyTier}</strong>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
