/**
 * Full Question Dataset Builder
 * Generates 22 questions for ALL 123 subtopics across 7 subjects (~2,700 total questions)
 */
const { generateDomainAuthenticQuestions } = require('./authenticQuestionDatabase');

const ALL_SUBTOPICS = [
  // ==================== DSA ====================
  { subject: 'DSA', topicId: 'dsa-arrays', subtopicId: 'dsa-arrays-basics', topicName: 'Arrays', subtopicName: 'Basics' },
  { subject: 'DSA', topicId: 'dsa-arrays', subtopicId: 'dsa-arrays-prefix-sum', topicName: 'Arrays', subtopicName: 'Prefix Sum' },
  { subject: 'DSA', topicId: 'dsa-arrays', subtopicId: 'dsa-arrays-two-pointer', topicName: 'Arrays', subtopicName: 'Two Pointer' },
  { subject: 'DSA', topicId: 'dsa-arrays', subtopicId: 'dsa-arrays-sliding-window', topicName: 'Arrays', subtopicName: 'Sliding Window' },
  { subject: 'DSA', topicId: 'dsa-arrays', subtopicId: 'dsa-arrays-kadane', topicName: 'Arrays', subtopicName: "Kadane's Algorithm" },

  { subject: 'DSA', topicId: 'dsa-strings', subtopicId: 'dsa-strings-basics', topicName: 'Strings', subtopicName: 'Basics' },
  { subject: 'DSA', topicId: 'dsa-strings', subtopicId: 'dsa-strings-two-pointer', topicName: 'Strings', subtopicName: 'Two Pointer' },
  { subject: 'DSA', topicId: 'dsa-strings', subtopicId: 'dsa-strings-sliding-window', topicName: 'Strings', subtopicName: 'Sliding Window' },

  { subject: 'DSA', topicId: 'dsa-linkedlist', subtopicId: 'dsa-linkedlist-singly', topicName: 'Linked List', subtopicName: 'Singly Linked List' },
  { subject: 'DSA', topicId: 'dsa-linkedlist', subtopicId: 'dsa-linkedlist-doubly', topicName: 'Linked List', subtopicName: 'Doubly Linked List' },
  { subject: 'DSA', topicId: 'dsa-linkedlist', subtopicId: 'dsa-linkedlist-fast-slow', topicName: 'Linked List', subtopicName: 'Fast & Slow Pointer' },

  { subject: 'DSA', topicId: 'dsa-stack', subtopicId: 'dsa-stack-monostack', topicName: 'Stack & Queue', subtopicName: 'Monotonic Stack' },
  { subject: 'DSA', topicId: 'dsa-stack', subtopicId: 'dsa-stack-parentheses', topicName: 'Stack & Queue', subtopicName: 'Parentheses Checks' },

  { subject: 'DSA', topicId: 'dsa-trees', subtopicId: 'dsa-trees-bfs-dfs', topicName: 'Trees & BST', subtopicName: 'BFS & DFS Traversal' },
  { subject: 'DSA', topicId: 'dsa-trees', subtopicId: 'dsa-bst', topicName: 'Trees & BST', subtopicName: 'BST Properties' },

  { subject: 'DSA', topicId: 'dsa-graph-dp', subtopicId: 'dsa-graph-bfs-dfs', topicName: 'Graph & DP', subtopicName: 'Graph Traversal' },
  { subject: 'DSA', topicId: 'dsa-graph-dp', subtopicId: 'dsa-dp-1d', topicName: 'Graph & DP', subtopicName: 'Dynamic Programming' },

  // ==================== APTITUDE ====================
  { subject: 'APTITUDE', topicId: 'aptitude-percentages', subtopicId: 'aptitude-percentages', topicName: 'Quantitative Aptitude', subtopicName: 'Percentages' },
  { subject: 'APTITUDE', topicId: 'aptitude-profit-loss', subtopicId: 'aptitude-profit-loss', topicName: 'Quantitative Aptitude', subtopicName: 'Profit & Loss' },
  { subject: 'APTITUDE', topicId: 'aptitude-ratio', subtopicId: 'aptitude-ratio', topicName: 'Quantitative Aptitude', subtopicName: 'Ratio & Proportion' },
  { subject: 'APTITUDE', topicId: 'aptitude-time-work', subtopicId: 'aptitude-time-work', topicName: 'Quantitative Aptitude', subtopicName: 'Time & Work' },
  { subject: 'APTITUDE', topicId: 'aptitude-probability', subtopicId: 'aptitude-probability', topicName: 'Quantitative Aptitude', subtopicName: 'Probability' },
  { subject: 'APTITUDE', topicId: 'aptitude-permutations', subtopicId: 'aptitude-permutations', topicName: 'Quantitative Aptitude', subtopicName: 'Permutation & Combination' },
  { subject: 'APTITUDE', topicId: 'aptitude-averages', subtopicId: 'aptitude-averages', topicName: 'Quantitative Aptitude', subtopicName: 'Averages' },
  { subject: 'APTITUDE', topicId: 'aptitude-speed-distance', subtopicId: 'aptitude-speed-distance', topicName: 'Quantitative Aptitude', subtopicName: 'Time Speed Distance' },

  // ==================== OOPS ====================
  { subject: 'OOPS', topicId: 'oops-classes-objects', subtopicId: 'oops-classes-objects', topicName: 'OOPS Core', subtopicName: 'Classes & Objects' },
  { subject: 'OOPS', topicId: 'oops-constructors', subtopicId: 'oops-constructors', topicName: 'OOPS Core', subtopicName: 'Constructors' },
  { subject: 'OOPS', topicId: 'oops-encapsulation', subtopicId: 'oops-encapsulation', topicName: 'OOPS Core', subtopicName: 'Encapsulation' },
  { subject: 'OOPS', topicId: 'oops-inheritance', subtopicId: 'oops-inheritance', topicName: 'OOPS Core', subtopicName: 'Inheritance' },
  { subject: 'OOPS', topicId: 'oops-polymorphism', subtopicId: 'oops-polymorphism', topicName: 'OOPS Core', subtopicName: 'Polymorphism' },
  { subject: 'OOPS', topicId: 'oops-method-overloading', subtopicId: 'oops-method-overloading', topicName: 'OOPS Core', subtopicName: 'Method Overloading' },
  { subject: 'OOPS', topicId: 'oops-method-overriding', subtopicId: 'oops-method-overriding', topicName: 'OOPS Core', subtopicName: 'Method Overriding' },
  { subject: 'OOPS', topicId: 'oops-abstraction', subtopicId: 'oops-abstraction', topicName: 'OOPS Core', subtopicName: 'Abstraction' },
  { subject: 'OOPS', topicId: 'oops-interfaces', subtopicId: 'oops-interfaces', topicName: 'OOPS Advanced', subtopicName: 'Interfaces' },
  { subject: 'OOPS', topicId: 'oops-abstract-classes', subtopicId: 'oops-abstract-classes', topicName: 'OOPS Advanced', subtopicName: 'Abstract Classes' },
  { subject: 'OOPS', topicId: 'oops-access-modifiers', subtopicId: 'oops-access-modifiers', topicName: 'OOPS Advanced', subtopicName: 'Access Modifiers' },
  { subject: 'OOPS', topicId: 'oops-static-final', subtopicId: 'oops-static-final', topicName: 'OOPS Advanced', subtopicName: 'Static & Final' },
  { subject: 'OOPS', topicId: 'oops-exception-handling', subtopicId: 'oops-exception-handling', topicName: 'OOPS Design', subtopicName: 'Exception Handling' },
  { subject: 'OOPS', topicId: 'oops-composition', subtopicId: 'oops-composition', topicName: 'OOPS Design', subtopicName: 'Composition' },
  { subject: 'OOPS', topicId: 'oops-aggregation', subtopicId: 'oops-aggregation', topicName: 'OOPS Design', subtopicName: 'Aggregation' },
  { subject: 'OOPS', topicId: 'oops-solid', subtopicId: 'oops-solid', topicName: 'OOPS Design', subtopicName: 'SOLID Principles' },

  // ==================== DBMS ====================
  { subject: 'DBMS', topicId: 'dbms-fundamentals', subtopicId: 'dbms-fundamentals', topicName: 'DBMS Core', subtopicName: 'DBMS Fundamentals' },
  { subject: 'DBMS', topicId: 'dbms-er-model', subtopicId: 'dbms-er-model', topicName: 'DBMS Core', subtopicName: 'ER Model' },
  { subject: 'DBMS', topicId: 'dbms-keys', subtopicId: 'dbms-keys', topicName: 'DBMS Core', subtopicName: 'Keys' },
  { subject: 'DBMS', topicId: 'dbms-relational-model', subtopicId: 'dbms-relational-model', topicName: 'DBMS Core', subtopicName: 'Relational Model' },
  { subject: 'DBMS', topicId: 'dbms-functional-dependencies', subtopicId: 'dbms-functional-dependencies', topicName: 'Normalization', subtopicName: 'Functional Dependencies' },
  { subject: 'DBMS', topicId: 'dbms-normalization-1nf', subtopicId: 'dbms-normalization-1nf', topicName: 'Normalization', subtopicName: '1NF' },
  { subject: 'DBMS', topicId: 'dbms-normalization-2nf', subtopicId: 'dbms-normalization-2nf', topicName: 'Normalization', subtopicName: '2NF' },
  { subject: 'DBMS', topicId: 'dbms-normalization-3nf', subtopicId: 'dbms-normalization-3nf', topicName: 'Normalization', subtopicName: '3NF' },
  { subject: 'DBMS', topicId: 'dbms-normalization-bcnf', subtopicId: 'dbms-normalization-bcnf', topicName: 'Normalization', subtopicName: 'BCNF' },
  { subject: 'DBMS', topicId: 'dbms-sql-basics', subtopicId: 'dbms-sql-basics', topicName: 'SQL Engine', subtopicName: 'SQL Basics' },
  { subject: 'DBMS', topicId: 'dbms-sql-select-where', subtopicId: 'dbms-sql-select-where', topicName: 'SQL Engine', subtopicName: 'SELECT & WHERE' },
  { subject: 'DBMS', topicId: 'dbms-sql-group-having', subtopicId: 'dbms-sql-group-having', topicName: 'SQL Engine', subtopicName: 'GROUP BY & HAVING' },
  { subject: 'DBMS', topicId: 'dbms-sql-aggregate', subtopicId: 'dbms-sql-aggregate', topicName: 'SQL Engine', subtopicName: 'Aggregate Functions' },
  { subject: 'DBMS', topicId: 'dbms-sql-joins', subtopicId: 'dbms-sql-joins', topicName: 'SQL Engine', subtopicName: 'SQL Joins' },
  { subject: 'DBMS', topicId: 'dbms-sql-subqueries', subtopicId: 'dbms-sql-subqueries', topicName: 'SQL Engine', subtopicName: 'Subqueries' },
  { subject: 'DBMS', topicId: 'dbms-sql-views', subtopicId: 'dbms-sql-views', topicName: 'SQL Engine', subtopicName: 'Views' },
  { subject: 'DBMS', topicId: 'dbms-transactions', subtopicId: 'dbms-transactions', topicName: 'Transactions & Concurrency', subtopicName: 'Transactions' },
  { subject: 'DBMS', topicId: 'dbms-acid', subtopicId: 'dbms-acid', topicName: 'Transactions & Concurrency', subtopicName: 'ACID' },
  { subject: 'DBMS', topicId: 'dbms-concurrency', subtopicId: 'dbms-concurrency', topicName: 'Transactions & Concurrency', subtopicName: 'Concurrency' },
  { subject: 'DBMS', topicId: 'dbms-locks', subtopicId: 'dbms-locks', topicName: 'Transactions & Concurrency', subtopicName: 'Locks' },
  { subject: 'DBMS', topicId: 'dbms-deadlocks', subtopicId: 'dbms-deadlocks', topicName: 'Transactions & Concurrency', subtopicName: 'Deadlocks' },
  { subject: 'DBMS', topicId: 'dbms-indexing', subtopicId: 'dbms-indexing', topicName: 'Optimization', subtopicName: 'Indexing' },
  { subject: 'DBMS', topicId: 'dbms-query-optimization', subtopicId: 'dbms-query-optimization', topicName: 'Optimization', subtopicName: 'Query Optimization' },

  // ==================== OPERATING SYSTEM ====================
  { subject: 'OS', topicId: 'os-fundamentals', subtopicId: 'os-fundamentals', topicName: 'OS Architecture', subtopicName: 'OS Fundamentals' },
  { subject: 'OS', topicId: 'os-system-calls', subtopicId: 'os-system-calls', topicName: 'OS Architecture', subtopicName: 'System Calls' },
  { subject: 'OS', topicId: 'os-processes', subtopicId: 'os-processes', topicName: 'Process Management', subtopicName: 'Processes' },
  { subject: 'OS', topicId: 'os-process-states', subtopicId: 'os-process-states', topicName: 'Process Management', subtopicName: 'Process States' },
  { subject: 'OS', topicId: 'os-pcb', subtopicId: 'os-pcb', topicName: 'Process Management', subtopicName: 'PCB' },
  { subject: 'OS', topicId: 'os-context-switching', subtopicId: 'os-context-switching', topicName: 'Process Management', subtopicName: 'Context Switching' },
  { subject: 'OS', topicId: 'os-threads', subtopicId: 'os-threads', topicName: 'Process Management', subtopicName: 'Threads' },
  { subject: 'OS', topicId: 'os-cpu-scheduling', subtopicId: 'os-cpu-scheduling', topicName: 'CPU Scheduling', subtopicName: 'CPU Scheduling' },
  { subject: 'OS', topicId: 'os-fcfs', subtopicId: 'os-fcfs', topicName: 'CPU Scheduling', subtopicName: 'FCFS' },
  { subject: 'OS', topicId: 'os-sjf', subtopicId: 'os-sjf', topicName: 'CPU Scheduling', subtopicName: 'SJF' },
  { subject: 'OS', topicId: 'os-srtf', subtopicId: 'os-srtf', topicName: 'CPU Scheduling', subtopicName: 'SRTF' },
  { subject: 'OS', topicId: 'os-round-robin', subtopicId: 'os-round-robin', topicName: 'CPU Scheduling', subtopicName: 'Round Robin' },
  { subject: 'OS', topicId: 'os-priority-scheduling', subtopicId: 'os-priority-scheduling', topicName: 'CPU Scheduling', subtopicName: 'Priority Scheduling' },
  { subject: 'OS', topicId: 'os-synchronization', subtopicId: 'os-synchronization', topicName: 'Synchronization', subtopicName: 'Synchronization' },
  { subject: 'OS', topicId: 'os-mutex', subtopicId: 'os-mutex', topicName: 'Synchronization', subtopicName: 'Mutex' },
  { subject: 'OS', topicId: 'os-semaphore', subtopicId: 'os-semaphore', topicName: 'Synchronization', subtopicName: 'Semaphore' },
  { subject: 'OS', topicId: 'os-deadlocks', subtopicId: 'os-deadlocks', topicName: 'Synchronization', subtopicName: 'Deadlocks' },
  { subject: 'OS', topicId: 'os-bankers-algorithm', subtopicId: 'os-bankers-algorithm', topicName: 'Synchronization', subtopicName: "Banker's Algorithm" },
  { subject: 'OS', topicId: 'os-memory-management', subtopicId: 'os-memory-management', topicName: 'Memory & Storage', subtopicName: 'Memory Management' },
  { subject: 'OS', topicId: 'os-paging', subtopicId: 'os-paging', topicName: 'Memory & Storage', subtopicName: 'Paging' },
  { subject: 'OS', topicId: 'os-segmentation', subtopicId: 'os-segmentation', topicName: 'Memory & Storage', subtopicName: 'Segmentation' },
  { subject: 'OS', topicId: 'os-virtual-memory', subtopicId: 'os-virtual-memory', topicName: 'Memory & Storage', subtopicName: 'Virtual Memory' },
  { subject: 'OS', topicId: 'os-page-replacement', subtopicId: 'os-page-replacement', topicName: 'Memory & Storage', subtopicName: 'Page Replacement' },
  { subject: 'OS', topicId: 'os-fifo', subtopicId: 'os-fifo', topicName: 'Memory & Storage', subtopicName: 'FIFO' },
  { subject: 'OS', topicId: 'os-lru', subtopicId: 'os-lru', topicName: 'Memory & Storage', subtopicName: 'LRU' },
  { subject: 'OS', topicId: 'os-file-systems', subtopicId: 'os-file-systems', topicName: 'File System & I/O', subtopicName: 'File Systems' },
  { subject: 'OS', topicId: 'os-disk-scheduling', subtopicId: 'os-disk-scheduling', topicName: 'File System & I/O', subtopicName: 'Disk Scheduling' },
  { subject: 'OS', topicId: 'os-io-management', subtopicId: 'os-io-management', topicName: 'File System & I/O', subtopicName: 'I/O Management' },

  // ==================== COMPUTER NETWORKS ====================
  { subject: 'CN', topicId: 'cn-fundamentals', subtopicId: 'cn-fundamentals', topicName: 'Networking Core', subtopicName: 'Network Fundamentals' },
  { subject: 'CN', topicId: 'cn-topologies', subtopicId: 'cn-topologies', topicName: 'Networking Core', subtopicName: 'Network Topologies' },
  { subject: 'CN', topicId: 'cn-osi-model', subtopicId: 'cn-osi-model', topicName: 'Models & Protocols', subtopicName: 'OSI Model' },
  { subject: 'CN', topicId: 'cn-tcp-ip-model', subtopicId: 'cn-tcp-ip-model', topicName: 'Models & Protocols', subtopicName: 'TCP/IP Model' },
  { subject: 'CN', topicId: 'cn-ethernet', subtopicId: 'cn-ethernet', topicName: 'Link Layer', subtopicName: 'Ethernet' },
  { subject: 'CN', topicId: 'cn-mac-address', subtopicId: 'cn-mac-address', topicName: 'Link Layer', subtopicName: 'MAC Address' },
  { subject: 'CN', topicId: 'cn-arp', subtopicId: 'cn-arp', topicName: 'Link Layer', subtopicName: 'ARP' },
  { subject: 'CN', topicId: 'cn-ipv4', subtopicId: 'cn-ipv4', topicName: 'IP Addressing', subtopicName: 'IPv4' },
  { subject: 'CN', topicId: 'cn-ipv6', subtopicId: 'cn-ipv6', topicName: 'IP Addressing', subtopicName: 'IPv6' },
  { subject: 'CN', topicId: 'cn-ip-addressing', subtopicId: 'cn-ip-addressing', topicName: 'IP Addressing', subtopicName: 'IP Addressing' },
  { subject: 'CN', topicId: 'cn-cidr', subtopicId: 'cn-cidr', topicName: 'IP Addressing', subtopicName: 'CIDR' },
  { subject: 'CN', topicId: 'cn-subnetting', subtopicId: 'cn-subnetting', topicName: 'IP Addressing', subtopicName: 'Subnetting' },
  { subject: 'CN', topicId: 'cn-tcp', subtopicId: 'cn-tcp', topicName: 'Transport Layer', subtopicName: 'TCP' },
  { subject: 'CN', topicId: 'cn-tcp-3way-handshake', subtopicId: 'cn-tcp-3way-handshake', topicName: 'Transport Layer', subtopicName: 'TCP 3-Way Handshake' },
  { subject: 'CN', topicId: 'cn-udp', subtopicId: 'cn-udp', topicName: 'Transport Layer', subtopicName: 'UDP' },
  { subject: 'CN', topicId: 'cn-tcp-vs-udp', subtopicId: 'cn-tcp-vs-udp', topicName: 'Transport Layer', subtopicName: 'TCP vs UDP' },
  { subject: 'CN', topicId: 'cn-flow-control', subtopicId: 'cn-flow-control', topicName: 'Transport Layer', subtopicName: 'Flow Control' },
  { subject: 'CN', topicId: 'cn-congestion-control', subtopicId: 'cn-congestion-control', topicName: 'Transport Layer', subtopicName: 'Congestion Control' },
  { subject: 'CN', topicId: 'cn-dns', subtopicId: 'cn-dns', topicName: 'Application Layer', subtopicName: 'DNS' },
  { subject: 'CN', topicId: 'cn-dhcp', subtopicId: 'cn-dhcp', topicName: 'Application Layer', subtopicName: 'DHCP' },
  { subject: 'CN', topicId: 'cn-http', subtopicId: 'cn-http', topicName: 'Application Layer', subtopicName: 'HTTP' },
  { subject: 'CN', topicId: 'cn-https', subtopicId: 'cn-https', topicName: 'Application Layer', subtopicName: 'HTTPS' },
  { subject: 'CN', topicId: 'cn-routing', subtopicId: 'cn-routing', topicName: 'Routing & Security', subtopicName: 'Routing' },
  { subject: 'CN', topicId: 'cn-switching', subtopicId: 'cn-switching', topicName: 'Routing & Security', subtopicName: 'Switching' },
  { subject: 'CN', topicId: 'cn-security', subtopicId: 'cn-security', topicName: 'Routing & Security', subtopicName: 'Network Security' },

  // ==================== PROGRAMMING ====================
  { subject: 'Programming', topicId: 'programming-cpp-pointers', subtopicId: 'programming-cpp-pointers', topicName: 'Programming Concepts', subtopicName: 'C++ Pointers & References' },
  { subject: 'Programming', topicId: 'programming-cpp-memory', subtopicId: 'programming-cpp-memory', topicName: 'Programming Concepts', subtopicName: 'Memory Allocation (malloc/new)' },
  { subject: 'Programming', topicId: 'programming-java-memory', subtopicId: 'programming-java-memory', topicName: 'Programming Concepts', subtopicName: 'Java Heap & Garbage Collection' },
  { subject: 'Programming', topicId: 'programming-python-memory', subtopicId: 'programming-python-memory', topicName: 'Programming Concepts', subtopicName: 'Python Memory & Decorators' },
  { subject: 'Programming', topicId: 'programming-recursion', subtopicId: 'programming-recursion', topicName: 'Programming Concepts', subtopicName: 'Recursion & Stack Frames' },
  { subject: 'Programming', topicId: 'programming-bit-manipulation', subtopicId: 'programming-bit-manipulation', topicName: 'Programming Concepts', subtopicName: 'Bitwise Operations & Masks' }
];

function buildFullDataset() {
  const fullDataset = [];

  ALL_SUBTOPICS.forEach(st => {
    const subtopicQuestions = generateDomainAuthenticQuestions(
      st.subject,
      st.topicId,
      st.subtopicId,
      st.topicName,
      st.subtopicName
    );

    fullDataset.push(...subtopicQuestions);
  });

  return fullDataset;
}

module.exports = {
  ALL_SUBTOPICS,
  buildFullDataset
};
