export const roadmapData = [
  // PHASE 1: BASICS
  {
    id: 'linear-search',
    title: 'Linear Search',
    phase: 1,
    status: 'completed',
    problems: ['Two Sum', 'Find Numbers with Even Number of Digits', 'Richest Customer Wealth']
  },
  {
    id: 'basic-sorting',
    title: 'Basic Sorting',
    phase: 1,
    status: 'current',
    problems: ['Sort Array By Parity', 'Height Checker', 'Relative Sort Array']
  },
  {
    id: 'stack-basics',
    title: 'Stack Basics',
    phase: 1,
    status: 'locked',
    problems: ['Valid Parentheses', 'Implement Stack using Queues', 'Baseball Game']
  },
  {
    id: 'queue-basics',
    title: 'Queue Basics',
    phase: 1,
    status: 'locked',
    problems: ['Implement Queue using Stacks', 'Number of Recent Calls']
  },
  {
    id: 'linked-list-basics',
    title: 'Singly Linked List',
    phase: 1,
    status: 'locked',
    problems: ['Reverse Linked List', 'Middle of the Linked List', 'Linked List Cycle']
  },

  // PHASE 2: INTERMEDIATE
  {
    id: 'binary-search',
    title: 'Binary Search',
    phase: 2,
    status: 'locked',
    problems: ['Binary Search', 'Search Insert Position', 'Find First and Last Position']
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    phase: 2,
    status: 'locked',
    problems: ['Valid Palindrome', 'Two Sum II', 'Container With Most Water']
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    phase: 2,
    status: 'locked',
    problems: ['Maximum Average Subarray I', 'Longest Substring Without Repeating Characters']
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack',
    phase: 2,
    status: 'locked',
    problems: ['Next Greater Element I', 'Daily Temperatures']
  },
  {
    id: 'hashing',
    title: 'Hashing / HashMaps',
    phase: 2,
    status: 'locked',
    problems: ['Contains Duplicate', 'Valid Anagram', 'Group Anagrams', 'Subarray Sum Equals K']
  },

  // PHASE 3: ADVANCED DATA STRUCTURES & ALGO
  {
    id: 'trees',
    title: 'Trees & BST',
    phase: 3,
    status: 'locked',
    problems: ['Maximum Depth of Binary Tree', 'Invert Binary Tree', 'Lowest Common Ancestor']
  },
  {
    id: 'heaps',
    title: 'Heap / Priority Queue',
    phase: 3,
    status: 'locked',
    problems: ['Kth Largest Element', 'Top K Frequent Elements', 'Merge K Sorted Lists']
  },
  {
    id: 'graphs',
    title: 'Graphs (DFS/BFS)',
    phase: 3,
    status: 'locked',
    problems: ['Number of Islands', 'Clone Graph', 'Rotting Oranges', 'Course Schedule']
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    phase: 3,
    status: 'locked',
    problems: ['Climbing Stairs', 'House Robber', 'Coin Change', 'Longest Increasing Subsequence']
  },
  {
    id: 'greedy',
    title: 'Greedy Algorithms',
    phase: 3,
    status: 'locked',
    problems: ['Jump Game', 'Gas Station', 'Assign Cookies']
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    phase: 3,
    status: 'locked',
    problems: ['Subsets', 'Permutations', 'Combination Sum', 'N-Queens']
  }
];

export const phases = [
  { id: 1, title: 'Phase 1: Fundamentals', description: 'Mastering the basic arrays, strings, and fundamental data structures.' },
  { id: 2, title: 'Phase 2: Core Patterns', description: 'Learning the standard patterns like Two Pointers, Sliding Window, and Binary Search.' },
  { id: 3, title: 'Phase 3: Advanced Algos', description: 'Tackling Trees, Graphs, DP, and Heaps.' }
];
