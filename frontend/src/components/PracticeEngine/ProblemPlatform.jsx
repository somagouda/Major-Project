import React, { useState, useEffect } from 'react';
import ProblemDetailView from './ProblemDetailView';

// Full Hierarchical Topic Tree Mapping across 7 Subjects
const topicTree = {
  DSA: [
    {
      name: 'Arrays',
      subtopics: [
        { name: 'Basics', id: 'dsa-arrays-basics' },
        { name: 'Prefix Sum', id: 'dsa-arrays-prefix-sum' },
        { name: 'Two Pointer', id: 'dsa-arrays-two-pointer' },
        { name: 'Sliding Window', id: 'dsa-arrays-sliding-window' },
        { name: "Kadane's Algorithm", id: 'dsa-arrays-kadane' }
      ]
    },
    {
      name: 'Strings',
      subtopics: [
        { name: 'Basics', id: 'dsa-strings-basics' },
        { name: 'Two Pointer', id: 'dsa-strings-two-pointer' },
        { name: 'Sliding Window', id: 'dsa-strings-sliding-window' }
      ]
    },
    {
      name: 'Linked List',
      subtopics: [
        { name: 'Singly Linked List', id: 'dsa-linkedlist-singly' },
        { name: 'Doubly Linked List', id: 'dsa-linkedlist-doubly' },
        { name: 'Fast & Slow Pointer', id: 'dsa-linkedlist-fast-slow' }
      ]
    },
    {
      name: 'Stack & Queue',
      subtopics: [
        { name: 'Monotonic Stack', id: 'dsa-stack-monostack' },
        { name: 'Parentheses Checks', id: 'dsa-stack-parentheses' }
      ]
    },
    {
      name: 'Trees & BST',
      subtopics: [
        { name: 'BFS & DFS Traversal', id: 'dsa-trees-bfs-dfs' },
        { name: 'BST Properties', id: 'dsa-bst' }
      ]
    },
    {
      name: 'Graph & DP',
      subtopics: [
        { name: 'Graph Traversal', id: 'dsa-graph-bfs-dfs' },
        { name: 'Dynamic Programming', id: 'dsa-dp-1d' }
      ]
    }
  ],
  APTITUDE: [
    {
      name: 'Quantitative Aptitude',
      subtopics: [
        { name: 'Percentages', id: 'aptitude-percentages' },
        { name: 'Profit & Loss', id: 'aptitude-profit-loss' },
        { name: 'Ratio & Proportion', id: 'aptitude-ratio' },
        { name: 'Time & Work', id: 'aptitude-time-work' },
        { name: 'Probability', id: 'aptitude-probability' },
        { name: 'Permutation & Combination', id: 'aptitude-permutations' },
        { name: 'Averages', id: 'aptitude-averages' },
        { name: 'Time Speed Distance', id: 'aptitude-speed-distance' }
      ]
    }
  ],
  OOPS: [
    {
      name: 'OOPS Core',
      subtopics: [
        { name: 'Classes & Objects', id: 'oops-classes-objects' },
        { name: 'Constructors', id: 'oops-constructors' },
        { name: 'Encapsulation', id: 'oops-encapsulation' },
        { name: 'Inheritance', id: 'oops-inheritance' },
        { name: 'Polymorphism', id: 'oops-polymorphism' },
        { name: 'Method Overloading', id: 'oops-method-overloading' },
        { name: 'Method Overriding', id: 'oops-method-overriding' },
        { name: 'Abstraction', id: 'oops-abstraction' }
      ]
    },
    {
      name: 'OOPS Advanced',
      subtopics: [
        { name: 'Interfaces', id: 'oops-interfaces' },
        { name: 'Abstract Classes', id: 'oops-abstract-classes' },
        { name: 'Access Modifiers', id: 'oops-access-modifiers' },
        { name: 'Static & Final', id: 'oops-static-final' }
      ]
    },
    {
      name: 'OOPS Design',
      subtopics: [
        { name: 'Exception Handling', id: 'oops-exception-handling' },
        { name: 'Composition', id: 'oops-composition' },
        { name: 'Aggregation', id: 'oops-aggregation' },
        { name: 'SOLID Principles', id: 'oops-solid' }
      ]
    }
  ],
  DBMS: [
    {
      name: 'DBMS Core',
      subtopics: [
        { name: 'DBMS Fundamentals', id: 'dbms-fundamentals' },
        { name: 'ER Model', id: 'dbms-er-model' },
        { name: 'Keys', id: 'dbms-keys' },
        { name: 'Relational Model', id: 'dbms-relational-model' }
      ]
    },
    {
      name: 'Normalization',
      subtopics: [
        { name: 'Functional Dependencies', id: 'dbms-functional-dependencies' },
        { name: '1NF', id: 'dbms-normalization-1nf' },
        { name: '2NF', id: 'dbms-normalization-2nf' },
        { name: '3NF', id: 'dbms-normalization-3nf' },
        { name: 'BCNF', id: 'dbms-normalization-bcnf' }
      ]
    },
    {
      name: 'SQL Engine',
      subtopics: [
        { name: 'SQL Basics', id: 'dbms-sql-basics' },
        { name: 'SELECT & WHERE', id: 'dbms-sql-select-where' },
        { name: 'GROUP BY & HAVING', id: 'dbms-sql-group-having' },
        { name: 'Aggregate Functions', id: 'dbms-sql-aggregate' },
        { name: 'SQL Joins', id: 'dbms-sql-joins' },
        { name: 'Subqueries', id: 'dbms-sql-subqueries' },
        { name: 'Views', id: 'dbms-sql-views' }
      ]
    },
    {
      name: 'Transactions & Concurrency',
      subtopics: [
        { name: 'Transactions', id: 'dbms-transactions' },
        { name: 'ACID', id: 'dbms-acid' },
        { name: 'Concurrency', id: 'dbms-concurrency' },
        { name: 'Locks', id: 'dbms-locks' },
        { name: 'Deadlocks', id: 'dbms-deadlocks' }
      ]
    },
    {
      name: 'Optimization',
      subtopics: [
        { name: 'Indexing', id: 'dbms-indexing' },
        { name: 'Query Optimization', id: 'dbms-query-optimization' }
      ]
    }
  ],
  OS: [
    {
      name: 'OS Architecture',
      subtopics: [
        { name: 'OS Fundamentals', id: 'os-fundamentals' },
        { name: 'System Calls', id: 'os-system-calls' }
      ]
    },
    {
      name: 'Process Management',
      subtopics: [
        { name: 'Processes', id: 'os-processes' },
        { name: 'Process States', id: 'os-process-states' },
        { name: 'PCB', id: 'os-pcb' },
        { name: 'Context Switching', id: 'os-context-switching' },
        { name: 'Threads', id: 'os-threads' }
      ]
    },
    {
      name: 'CPU Scheduling',
      subtopics: [
        { name: 'CPU Scheduling', id: 'os-cpu-scheduling' },
        { name: 'FCFS', id: 'os-fcfs' },
        { name: 'SJF', id: 'os-sjf' },
        { name: 'SRTF', id: 'os-srtf' },
        { name: 'Round Robin', id: 'os-round-robin' },
        { name: 'Priority Scheduling', id: 'os-priority-scheduling' }
      ]
    },
    {
      name: 'Synchronization',
      subtopics: [
        { name: 'Synchronization', id: 'os-synchronization' },
        { name: 'Mutex', id: 'os-mutex' },
        { name: 'Semaphore', id: 'os-semaphore' },
        { name: 'Deadlocks', id: 'os-deadlocks' },
        { name: "Banker's Algorithm", id: 'os-bankers-algorithm' }
      ]
    },
    {
      name: 'Memory & Storage',
      subtopics: [
        { name: 'Memory Management', id: 'os-memory-management' },
        { name: 'Paging', id: 'os-paging' },
        { name: 'Segmentation', id: 'os-segmentation' },
        { name: 'Virtual Memory', id: 'os-virtual-memory' },
        { name: 'Page Replacement', id: 'os-page-replacement' },
        { name: 'FIFO', id: 'os-fifo' },
        { name: 'LRU', id: 'os-lru' }
      ]
    },
    {
      name: 'File System & I/O',
      subtopics: [
        { name: 'File Systems', id: 'os-file-systems' },
        { name: 'Disk Scheduling', id: 'os-disk-scheduling' },
        { name: 'I/O Management', id: 'os-io-management' }
      ]
    }
  ],
  CN: [
    {
      name: 'Networking Core',
      subtopics: [
        { name: 'Network Fundamentals', id: 'cn-fundamentals' },
        { name: 'Network Topologies', id: 'cn-topologies' }
      ]
    },
    {
      name: 'Models & Protocols',
      subtopics: [
        { name: 'OSI Model', id: 'cn-osi-model' },
        { name: 'TCP/IP Model', id: 'cn-tcp-ip-model' }
      ]
    },
    {
      name: 'Link Layer',
      subtopics: [
        { name: 'Ethernet', id: 'cn-ethernet' },
        { name: 'MAC Address', id: 'cn-mac-address' },
        { name: 'ARP', id: 'cn-arp' }
      ]
    },
    {
      name: 'IP Addressing',
      subtopics: [
        { name: 'IPv4', id: 'cn-ipv4' },
        { name: 'IPv6', id: 'cn-ipv6' },
        { name: 'IP Addressing', id: 'cn-ip-addressing' },
        { name: 'CIDR', id: 'cn-cidr' },
        { name: 'Subnetting', id: 'cn-subnetting' }
      ]
    },
    {
      name: 'Transport Layer',
      subtopics: [
        { name: 'TCP', id: 'cn-tcp' },
        { name: 'TCP 3-Way Handshake', id: 'cn-tcp-3way-handshake' },
        { name: 'UDP', id: 'cn-udp' },
        { name: 'TCP vs UDP', id: 'cn-tcp-vs-udp' },
        { name: 'Flow Control', id: 'cn-flow-control' },
        { name: 'Congestion Control', id: 'cn-congestion-control' }
      ]
    },
    {
      name: 'Application Layer',
      subtopics: [
        { name: 'DNS', id: 'cn-dns' },
        { name: 'DHCP', id: 'cn-dhcp' },
        { name: 'HTTP', id: 'cn-http' },
        { name: 'HTTPS', id: 'cn-https' }
      ]
    },
    {
      name: 'Routing & Security',
      subtopics: [
        { name: 'Routing', id: 'cn-routing' },
        { name: 'Switching', id: 'cn-switching' },
        { name: 'Network Security', id: 'cn-security' }
      ]
    }
  ],
  Programming: [
    {
      name: 'Programming Concepts',
      subtopics: [
        { name: 'C++ Pointers & References', id: 'programming-cpp-pointers' },
        { name: 'Memory Allocation (malloc/new)', id: 'programming-cpp-memory' },
        { name: 'Java Heap & Garbage Collection', id: 'programming-java-memory' },
        { name: 'Python Memory & Decorators', id: 'programming-python-memory' },
        { name: 'Recursion & Stack Frames', id: 'programming-recursion' },
        { name: 'Bitwise Operations & Masks', id: 'programming-bit-manipulation' }
      ]
    }
  ]
};

const COMPANY_OPTIONS = [
  'Infosys', 'TCS', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini',
  'Amazon', 'Microsoft', 'Google', 'Deloitte', 'IBM', 'Oracle', 'Deutsche Bank'
];

export default function ProblemPlatform({ user, token, initialTopicId, onActionTriggered }) {
  const [selectedSubject, setSelectedSubject] = useState('DSA');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(initialTopicId || '');

  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [selectedSourceType, setSelectedSourceType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearch, setGlobalSearch] = useState(false);

  const [activeProblemId, setActiveProblemId] = useState(null);
  const [problems, setProblems] = useState([]);
  const [recentlyAskedList, setRecentlyAskedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solvedProblemIds, setSolvedProblemIds] = useState(new Set());

  // Subtopic Header Stats
  const [subtopicStats, setSubtopicStats] = useState({
    totalQuestions: 22,
    solvedCount: 0,
    attemptedCount: 0,
    accuracy: 0,
    mastery: 0
  });

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (initialTopicId) {
      setSelectedSubtopicId(initialTopicId);
    }
  }, [initialTopicId]);

  useEffect(() => {
    setPage(1);
    fetchProblems(1);
    fetchSubtopicStats();
  }, [selectedSubject, selectedTopicId, selectedSubtopicId, selectedDifficulty, selectedQuestionType, selectedSourceType, selectedCompany, selectedYear, selectedStatus, searchQuery, globalSearch]);

  useEffect(() => {
    fetchRecentlyAsked();
  }, []);

  const fetchRecentlyAsked = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leetcode/problems?recentlyAsked=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data.problems || []);
      setRecentlyAskedList(list.slice(0, 5));
    } catch (err) {
      console.warn('Recently asked fetch error:', err);
    }
  };

  const fetchSubtopicStats = async () => {
    try {
      const qParams = new URLSearchParams();
      if (!globalSearch) {
        if (selectedSubject) qParams.append('subject', selectedSubject);
        if (selectedSubtopicId) qParams.append('subtopicId', selectedSubtopicId);
        else if (selectedTopicId) qParams.append('topicId', selectedTopicId);
      }
      if (selectedDifficulty) qParams.append('difficulty', selectedDifficulty);
      if (selectedQuestionType) qParams.append('questionType', selectedQuestionType);
      if (selectedSourceType) qParams.append('sourceType', selectedSourceType);
      if (selectedCompany) qParams.append('company', selectedCompany);
      if (selectedYear) qParams.append('year', selectedYear);
      if (searchQuery) qParams.append('searchQuery', searchQuery);

      console.log('[ProblemPlatform] Fetching stats with query:', qParams.toString());

      const response = await fetch(`http://localhost:5000/api/leetcode/subtopic-stats?${qParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        console.log('[ProblemPlatform] Subtopic stats response:', data);
        setSubtopicStats(data);
      }
    } catch (err) {
      console.warn('Subtopic stats error:', err);
    }
  };

  const fetchProblems = async (targetPage = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', targetPage);
      queryParams.append('limit', PAGE_SIZE);

      if (!globalSearch) {
        if (selectedSubject) queryParams.append('subject', selectedSubject);
        if (selectedSubtopicId) queryParams.append('subtopicId', selectedSubtopicId);
        else if (selectedTopicId) queryParams.append('topicId', selectedTopicId);
      }

      if (selectedDifficulty) queryParams.append('difficulty', selectedDifficulty);
      if (selectedQuestionType) queryParams.append('questionType', selectedQuestionType);
      if (selectedSourceType) queryParams.append('sourceType', selectedSourceType);
      if (selectedCompany) queryParams.append('company', selectedCompany);
      if (selectedYear) queryParams.append('year', selectedYear);
      if (searchQuery) queryParams.append('searchQuery', searchQuery);

      console.log('[ProblemPlatform] Fetching problems with query:', queryParams.toString());

      const response = await fetch(`http://localhost:5000/api/leetcode/problems?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        if (Array.isArray(data)) {
          console.log(`[ProblemPlatform] Received ${data.length} problems (array format).`);
          setProblems(data);
          setTotalProblems(data.length);
          setTotalPages(Math.ceil(data.length / PAGE_SIZE));
        } else {
          const list = data.problems || [];
          console.log(`[ProblemPlatform] Received ${list.length} problems (total: ${data.total}, page: ${data.page}/${data.totalPages}).`);
          setProblems(list);
          setTotalProblems(data.total || list.length);
          setTotalPages(data.totalPages || 1);
          setPage(data.page || 1);
        }
      }
    } catch (err) {
      console.warn('Problems fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPractice = async () => {
    try {
      const qParams = new URLSearchParams();
      if (!globalSearch) {
        if (selectedSubject) qParams.append('subject', selectedSubject);
        if (selectedSubtopicId) qParams.append('subtopicId', selectedSubtopicId);
        else if (selectedTopicId) qParams.append('topicId', selectedTopicId);
      }
      if (selectedDifficulty) qParams.append('difficulty', selectedDifficulty);
      if (selectedQuestionType) qParams.append('questionType', selectedQuestionType);
      if (selectedSourceType) qParams.append('sourceType', selectedSourceType);
      if (selectedCompany) qParams.append('company', selectedCompany);
      if (selectedYear) qParams.append('year', selectedYear);
      if (searchQuery) qParams.append('searchQuery', searchQuery);

      const response = await fetch(`http://localhost:5000/api/leetcode/random-problem?${qParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data) {
        setActiveProblemId(data.id || data.problemId);
      }
    } catch (err) {
      console.warn('Random problem fetch error:', err);
    }
  };

  const handleProblemSolved = (topId) => {
    if (activeProblemId) {
      setSolvedProblemIds(prev => new Set([...prev, activeProblemId]));
    }
    fetchSubtopicStats();
    if (onActionTriggered) onActionTriggered();
  };

  const getSourceBadge = (sourceType) => {
    switch (sourceType) {
      case 'official':
        return { label: '🛡️ Official', style: { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' } };
      case 'verified_interview_report':
        return { label: '🔥 Verified Interview Report', style: { background: 'rgba(234, 88, 12, 0.2)', color: '#fb923c', border: '1px solid rgba(234, 88, 12, 0.4)' } };
      case 'community_report':
        return { label: '👥 Community Report', style: { background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)' } };
      case 'practice':
        return { label: '📚 Standard Practice', style: { background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' } };
      case 'ai_generated':
        return { label: '🤖 AI Practice', style: { background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.4)' } };
      default:
        return { label: '📚 Practice', style: { background: 'rgba(255, 255, 255, 0.1)', color: '#aaa', border: '1px solid rgba(255, 255, 255, 0.2)' } };
    }
  };

  if (activeProblemId) {
    return (
      <ProblemDetailView
        problemId={activeProblemId}
        token={token}
        onBack={() => setActiveProblemId(null)}
        onProblemSolved={handleProblemSolved}
      />
    );
  }

  const currentTree = topicTree[selectedSubject] || [];
  const activeSubtopicObj = currentTree.flatMap(c => c.subtopics).find(s => s.id === selectedSubtopicId);

  return (
    <div className="glass-container" style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '1.5rem', minHeight: '85vh' }}>
      
      {/* Left Navigation Tree Sidebar */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
        <h4 style={{ color: 'var(--primary)', margin: 0 }}>📌 Subject Navigation</h4>
        
        {/* Subject Switch Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {['DSA', 'APTITUDE', 'OOPS', 'DBMS', 'OS', 'CN', 'Programming'].map(subj => (
            <button
              key={subj}
              className={`btn ${selectedSubject === subj ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem', flex: '1 0 28%' }}
              onClick={() => {
                setSelectedSubject(subj);
                setSelectedTopicId('');
                setSelectedSubtopicId('');
              }}
            >
              {subj}
            </button>
          ))}
        </div>

        <button
          className={`btn ${!selectedSubtopicId && !selectedTopicId ? 'btn-accent' : 'btn-secondary'}`}
          style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem' }}
          onClick={() => {
            setSelectedTopicId('');
            setSelectedSubtopicId('');
          }}
        >
          All {selectedSubject} Questions
        </button>

        {/* Tree Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '55vh' }}>
          {currentTree.map((cat, cIdx) => (
            <div key={cIdx}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                📂 {cat.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.75rem' }}>
                {cat.subtopics.map(sub => (
                  <button
                    key={sub.id}
                    className="btn"
                    style={{
                      justifyContent: 'flex-start',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.78rem',
                      background: selectedSubtopicId === sub.id ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                      color: selectedSubtopicId === sub.id ? 'var(--primary)' : 'var(--text-main)',
                      borderColor: selectedSubtopicId === sub.id ? 'var(--primary)' : 'transparent',
                      fontWeight: selectedSubtopicId === sub.id ? 700 : 400
                    }}
                    onClick={() => {
                      setSelectedSubtopicId(sub.id);
                      setSelectedTopicId('');
                    }}
                  >
                    └ {sub.name} (20+)
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area: Header Stats, Filter Bar, Problem Table & Pagination */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Subtopic Header & Live Stats Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 100%)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--secondary)', fontWeight: 700, letterSpacing: '1px' }}>
                {selectedSubject} {activeSubtopicObj ? `➔ ${activeSubtopicObj.name}` : selectedTopicId ? `➔ ${selectedTopicId}` : '➔ All Topics'}
              </div>
              <h2 style={{ margin: '0.2rem 0', background: 'linear-gradient(to right, #fff, var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {activeSubtopicObj ? activeSubtopicObj.name : `${selectedSubject} Question Bank`}
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Guaranteed 20+ topic-specific questions with real placement reports, source metadata & adaptive practice.
              </p>
            </div>

            {/* Live Subtopic Stats Box */}
            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Questions</span>
                <strong style={{ fontSize: '1rem', color: '#fff' }}>{subtopicStats.totalQuestions}</strong>
              </div>
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Solved</span>
                <strong style={{ fontSize: '1rem', color: 'var(--success)' }}>{subtopicStats.solvedCount}</strong>
              </div>
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Accuracy</span>
                <strong style={{ fontSize: '1rem', color: 'var(--secondary)' }}>{subtopicStats.accuracy}%</strong>
              </div>
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mastery</span>
                <strong style={{ fontSize: '1rem', color: 'var(--accent)' }}>{subtopicStats.mastery}%</strong>
              </div>
            </div>

            {/* 🎲 Random Practice Button */}
            <button 
              className="btn btn-accent" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 700 }}
              onClick={handleRandomPractice}
            >
              🎲 Random Practice
            </button>
          </div>
        </div>

        {/* 🔥 RECENTLY ASKED BANNER */}
        {recentlyAskedList.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.12) 0%, rgba(139,92,246,0.12) 100%)', border: '1px solid rgba(234, 88, 12, 0.3)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔥</span>
                <h5 style={{ margin: 0, color: '#fb923c', fontSize: '0.88rem' }}>Recently Asked in 2026 Campus Hiring Drives</h5>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Updated 2026 Season</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
              {recentlyAskedList.map((rq, idx) => (
                <div 
                  key={rq.id || idx}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.65rem', cursor: 'pointer' }}
                  onClick={() => setActiveProblemId(rq.id || rq.problemId)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.68rem', background: 'rgba(234, 88, 12, 0.25)', color: '#fb923c', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                      🏢 {rq.company || 'Infosys'}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#aaa' }}>{rq.year}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rq.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source Type Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem' }}>
          {[
            { id: '', label: '🌐 All Sources' },
            { id: 'verified_interview_report', label: '🔥 Verified Reports' },
            { id: 'official', label: '🛡️ Official' },
            { id: 'community_report', label: '👥 Community' },
            { id: 'practice', label: '📚 Standard Practice' },
            { id: 'ai_generated', label: '🤖 AI Practice' }
          ].map(st => (
            <button
              key={st.id}
              className={`btn ${selectedSourceType === st.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
              onClick={() => setSelectedSourceType(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Combined Multi-Filter Controls Row */}
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)', padding: '0.6rem 0.75rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filters:</div>

          {/* Search Input & Global Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <input
              type="text"
              className="glass-input"
              style={{ width: '160px', height: '32px', fontSize: '0.78rem' }}
              placeholder={globalSearch ? "🔍 Search all topics..." : "🔍 Search in subtopic..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <input 
                type="checkbox" 
                checked={globalSearch} 
                onChange={(e) => setGlobalSearch(e.target.checked)} 
              />
              Global Search
            </label>
          </div>

          {/* Question Type Filter */}
          <select
            className="glass-input"
            style={{ width: '125px', height: '32px', fontSize: '0.78rem' }}
            value={selectedQuestionType}
            onChange={(e) => setSelectedQuestionType(e.target.value)}
          >
            <option value="">All Question Types</option>
            <option value="Coding">💻 Coding</option>
            <option value="MCQ">🔘 MCQ</option>
            <option value="Output Prediction">📊 Output Prediction</option>
            <option value="Interview">🗣️ Interview</option>
            <option value="Scenario">🧩 Scenario</option>
            <option value="Numerical">🔢 Numerical</option>
          </select>

          {/* Difficulty Filter */}
          <select
            className="glass-input"
            style={{ width: '110px', height: '32px', fontSize: '0.78rem' }}
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All Difficulty</option>
            <option value="Easy">🌱 Easy</option>
            <option value="Medium">⚡ Medium</option>
            <option value="Hard">🔥 Hard</option>
          </select>

          {/* Company Filter */}
          <select
            className="glass-input"
            style={{ width: '120px', height: '32px', fontSize: '0.78rem' }}
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">All Companies</option>
            {COMPANY_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            className="glass-input"
            style={{ width: '95px', height: '32px', fontSize: '0.78rem' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Problems List Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Loading questions for selected subtopic...
          </div>
        ) : problems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
            <h4 style={{ color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: 600 }}>
              No questions available for this topic with the selected filters.
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              No questions matched your current filter criteria in {activeSubtopicObj ? activeSubtopicObj.name : selectedSubject}.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.8rem' }}
                onClick={() => {
                  setSelectedDifficulty('');
                  setSelectedQuestionType('');
                  setSelectedSourceType('');
                  setSelectedCompany('');
                  setSelectedYear('');
                  setSearchQuery('');
                }}
              >
                🔄 Reset Filters
              </button>
              <button
                className="btn btn-accent"
                style={{ fontSize: '0.8rem', fontWeight: 600 }}
                onClick={() => setSelectedSourceType('ai_generated')}
              >
                🤖 Generate AI Practice
              </button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#fff' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', textTransform: 'uppercase', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Question Title</th>
                  <th style={{ padding: '0.75rem' }}>Type</th>
                  <th style={{ padding: '0.75rem' }}>Source Transparency</th>
                  <th style={{ padding: '0.75rem' }}>Company / Round</th>
                  <th style={{ padding: '0.75rem' }}>Difficulty</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, idx) => {
                  const isSolved = solvedProblemIds.has(p.id) || solvedProblemIds.has(p.problemId);
                  const srcBadge = getSourceBadge(p.sourceType);
                  return (
                    <tr key={p.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        {isSolved ? (
                          <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Solved</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>⚪ Unsolved</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span>{p.title}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {p.subtopicName || p.topicName}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                          {p.questionType || 'Coding'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 600, ...srcBadge.style }}>
                          {srcBadge.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {p.company ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)' }}>
                              🏢 {p.company} {p.role ? `(${p.role})` : ''}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {p.round || 'Technical'} {p.year ? `• ${p.year}` : ''}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${p.difficulty === 'Easy' ? 'badge-success' : p.difficulty === 'Hard' ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.72rem' }}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                          onClick={() => setActiveProblemId(p.id || p.problemId)}
                        >
                          Solve ➔
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination UI Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '0.85rem', marginTop: 'auto' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalProblems)} of {totalProblems} questions
            </span>

            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                disabled={page <= 1}
                onClick={() => fetchProblems(page - 1)}
              >
                ◀ Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                <button
                  key={pNum}
                  className={`btn ${page === pNum ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                  onClick={() => fetchProblems(pNum)}
                >
                  {pNum}
                </button>
              ))}

              <button
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                disabled={page >= totalPages}
                onClick={() => fetchProblems(page + 1)}
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
