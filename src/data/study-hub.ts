// DSA Sheets Data
export interface DsaSheet {
  id: string;
  title: string;
  author: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  url: string;
}

export const DSA_SHEETS: DsaSheet[] = [
  {
    id: "striver-a2z",
    title: "Striver A2Z DSA Sheet",
    author: "Striver (Raj Vikramaditya)",
    description: "Complete roadmap covering beginner to advanced DSA with topic-wise progression",
    difficulty: "All Levels",
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
  },
  {
    id: "striver-sde",
    title: "Striver SDE Sheet",
    author: "Striver (Raj Vikramaditya)",
    description: "One of the most popular interview preparation sheets for product-based companies",
    difficulty: "Intermediate",
    url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
  },
  {
    id: "love-babbar-450",
    title: "Love Babbar 450 DSA Sheet",
    author: "Love Babbar",
    description: "450 carefully selected interview questions covering all important DSA topics",
    difficulty: "All Levels",
    url: "https://450dsa.com/"
  },
  {
    id: "neetcode-150",
    title: "NeetCode 150",
    author: "NeetCode",
    description: "Curated interview questions frequently asked in top tech companies",
    difficulty: "Intermediate",
    url: "https://neetcode.io/roadmap"
  },
  {
    id: "blind-75",
    title: "Blind 75",
    author: "Blind Community",
    description: "The famous 75-question interview preparation list",
    difficulty: "Intermediate",
    url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions"
  },
  {
    id: "grind-169",
    title: "Grind 169",
    author: "Grind 75 Community",
    description: "A modern extension of Blind 75 with better topic coverage",
    difficulty: "Intermediate",
    url: "https://www.techinterviewhandbook.org/grind75"
  },
  {
    id: "cp-31",
    title: "CP-31 Sheet",
    author: "Priyansh Agarwal",
    description: "A structured competitive programming sheet designed to improve contest performance",
    difficulty: "Advanced",
    url: "https://docs.google.com/document/d/1vBU5X96B6W90X1SqA8dF0aMqB7Y599x1M1n4x3l7W8/edit"
  }
];

// Courses Data
export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  thumbnail: string;
  playlistUrl: string;
  description: string;
  duration?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
}

export const COURSES: Course[] = [
  // C
  {
    id: "c-codewithharry",
    title: "Complete C Programming Course",
    instructor: "CodeWithHarry",
    category: "C",
    thumbnail: "https://i.ytimg.com/vi/aGtC9gj4C2k/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38oQDdS",
    description: "Learn C from scratch with variables, loops, arrays, pointers, structures, and memory management.",
    duration: "15 Hours",
    difficulty: "Beginner"
  },
  {
    id: "c-apnacollege",
    title: "C Language Complete Tutorial",
    instructor: "Apna College",
    category: "C",
    thumbnail: "https://i.ytimg.com/vi/irqbmMNs2Bo/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    description: "Detailed step-by-step introduction to procedural programming in C, curated for absolute beginners.",
    duration: "10 Hours",
    difficulty: "Beginner"
  },
  {
    id: "c-striver",
    title: "C & C++ Programming Basics",
    instructor: "Striver (take U forward)",
    category: "C",
    thumbnail: "https://i.ytimg.com/vi/EAR7De6Goz4/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    description: "Understand compilation, syntax logic, control structures, and standard functions for C beginners.",
    duration: "8 Hours",
    difficulty: "Beginner"
  },

  // C++
  {
    id: "cpp-lovebabbar",
    title: "C++ Complete Series",
    instructor: "Love Babbar (CodeHelp)",
    category: "C++",
    thumbnail: "https://i.ytimg.com/vi/wQ7wQqJ41c8/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
    description: "One of the most famous C++ programming series covering basic constructs, pointers, STL, and OOP concepts.",
    duration: "30 Hours",
    difficulty: "Beginner"
  },
  {
    id: "cpp-apnacollege",
    title: "C++ Placement Course",
    instructor: "Apna College",
    category: "C++",
    thumbnail: "https://i.ytimg.com/vi/z9bZufPHFLU/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ",
    description: "In-depth placement preparation course in C++, teaching memory layouts, structures, and basic algorithms.",
    duration: "40 Hours",
    difficulty: "Beginner"
  },
  {
    id: "cpp-codewithharry",
    title: "C++ Complete Tutorial for Beginners",
    instructor: "CodeWithHarry",
    category: "C++",
    thumbnail: "https://i.ytimg.com/vi/j8nAHeVKL08/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38oQDdS",
    description: "Object-oriented structures, namespaces, file handling, and STL containers in C++.",
    duration: "25 Hours",
    difficulty: "Beginner"
  },
  {
    id: "cpp-striver",
    title: "C++ STL & Basics Playlist",
    instructor: "Striver (take U forward)",
    category: "C++",
    thumbnail: "https://i.ytimg.com/vi/R7i15tA-X5s/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    description: "Comprehensive guide to C++ Standard Template Library (vectors, maps, sets, iterators) and time complexity analysis.",
    duration: "12 Hours",
    difficulty: "Intermediate"
  },

  // Java
  {
    id: "java-apnacollege",
    title: "Java + DSA Placement Course",
    instructor: "Apna College",
    category: "Java",
    thumbnail: "https://i.ytimg.com/vi/yRpLlJSvq5A/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    description: "Java fundamentals, OOP constructs, collections framework, and advanced interview DSA strategies.",
    duration: "80 Hours",
    difficulty: "All Levels"
  },
  {
    id: "java-codewithharry",
    title: "Java Complete Tutorial",
    instructor: "CodeWithHarry",
    category: "Java",
    thumbnail: "https://i.ytimg.com/vi/ntLJmHOJ0ME/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9agS67Uits0UnJyrYiXhQS9Z",
    description: "Thorough guide explaining Java JVM, memory mapping, classes, inheritance, threads, and JDBC database links.",
    duration: "50 Hours",
    difficulty: "Beginner"
  },
  {
    id: "java-striver",
    title: "Java Language Fundamentals",
    instructor: "Striver (take U forward)",
    category: "Java",
    thumbnail: "https://i.ytimg.com/vi/U3aXWizDbQ4/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    description: "Understand object orientation, execution memory, and standard inputs/outputs in Java.",
    duration: "10 Hours",
    difficulty: "Beginner"
  },

  // Python
  {
    id: "python-codewithharry",
    title: "Python Complete Course for Beginners",
    instructor: "CodeWithHarry",
    category: "Python",
    thumbnail: "https://i.ytimg.com/vi/gfDE2a7MKjA/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9agICnT8t4iYVSZ3eykIAOME",
    description: "Master Python syntax, list comprehensions, file systems, pip libraries, and advanced logic scripts.",
    duration: "40 Hours",
    difficulty: "Beginner"
  },
  {
    id: "python-apnacollege",
    title: "Python Full Course for Placements",
    instructor: "Apna College",
    category: "Python",
    thumbnail: "https://i.ytimg.com/vi/vLqTf2b6GZw/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0MvGQrF9L2VNiQe0Ff68L3",
    description: "Learn variables, loops, custom function building, and OOP frameworks using Python.",
    duration: "20 Hours",
    difficulty: "Beginner"
  },
  {
    id: "python-lovebabbar",
    title: "Python Programming Basics",
    instructor: "Love Babbar (CodeHelp)",
    category: "Python",
    thumbnail: "https://i.ytimg.com/vi/e1p6k4jS1uM/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
    description: "Learn Python script configurations, file structures, and algorithms for quick interview coding.",
    duration: "15 Hours",
    difficulty: "Beginner"
  },

  // Data Structures & Algorithms
  {
    id: "dsa-striver",
    title: "Striver A2Z DSA Playlist",
    instructor: "Striver (take U forward)",
    category: "Data Structures & Algorithms",
    thumbnail: "https://i.ytimg.com/vi/8h8Jq2J8dT4/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    description: "Complete DSA roadmap covering arrays, trees, heaps, graphs, string algorithms, and dynamic programming.",
    duration: "100+ Hours",
    difficulty: "All Levels"
  },
  {
    id: "dsa-lovebabbar",
    title: "DSA Complete Boot Camp",
    instructor: "Love Babbar (CodeHelp)",
    category: "Data Structures & Algorithms",
    thumbnail: "https://i.ytimg.com/vi/4rJZ_zS6lE8/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
    description: "Highly rated DSA series in Hindi explaining trees, graphs, dynamic programming, and greedy systems.",
    duration: "70+ Hours",
    difficulty: "All Levels"
  },
  {
    id: "dsa-apnacollege",
    title: "DSA Placement Prep Course",
    instructor: "Apna College",
    category: "Data Structures & Algorithms",
    thumbnail: "https://i.ytimg.com/vi/yRpLlJSvq5A/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    description: "Systematic data structure lectures with detailed solutions to top interview questions.",
    duration: "50 Hours",
    difficulty: "All Levels"
  },

  // Web Development
  {
    id: "webdev-codewithharry",
    title: "Sigma Web Development Course",
    instructor: "CodeWithHarry",
    category: "Web Development",
    thumbnail: "https://i.ytimg.com/vi/7EOFi9kJ_kY/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq53JxJ9YfL2l3b1H6G8oK",
    description: "Web development from HTML/CSS/JS basics to MongoDB, Node.js, Express, and React integrations.",
    duration: "100+ Hours",
    difficulty: "All Levels"
  },
  {
    id: "webdev-apnacollege",
    title: "Delta Web Development Series",
    instructor: "Apna College",
    category: "Web Development",
    thumbnail: "https://i.ytimg.com/vi/tVzUXW6siu0/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3f4O1vNckGq1qNc0h25Qz7",
    description: "Full-stack MERN (MongoDB, Express, React, Node) course tailored for building projects.",
    duration: "75 Hours",
    difficulty: "All Levels"
  },
  {
    id: "webdev-lovebabbar",
    title: "Web Development Boot Camp",
    instructor: "Love Babbar (CodeHelp)",
    category: "Web Development",
    thumbnail: "https://i.ytimg.com/vi/hlGoQC332Ms/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Build robust frontend and backend servers using standard MERN architecture and responsive designs.",
    duration: "60 Hours",
    difficulty: "All Levels"
  },

  // SQL & DBMS
  {
    id: "sql-lovebabbar",
    title: "DBMS Complete Course",
    instructor: "Love Babbar (CodeHelp)",
    category: "SQL & DBMS",
    thumbnail: "https://i.ytimg.com/vi/hlGoQC332Ms/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Thorough database management concepts, schemas, indexing, sharding, and SQL transactions.",
    duration: "20 Hours",
    difficulty: "Beginner"
  },
  {
    id: "sql-apnacollege",
    title: "SQL & Databases Tutorial",
    instructor: "Apna College",
    category: "SQL & DBMS",
    thumbnail: "https://i.ytimg.com/vi/HXV3zeQKqGY/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    description: "Learn relational databases, normalizations, JOINs, subqueries, and database setups.",
    duration: "12 Hours",
    difficulty: "Beginner"
  },
  {
    id: "sql-codewithharry",
    title: "SQL & MySQL Tutorial for Beginners",
    instructor: "CodeWithHarry",
    category: "SQL & DBMS",
    thumbnail: "https://i.ytimg.com/vi/J9X4l5o8194/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38oQDdS",
    description: "Complete relational database queries, table relationships, and MySQL workbench guide.",
    duration: "15 Hours",
    difficulty: "Beginner"
  },

  // Operating Systems
  {
    id: "os-lovebabbar",
    title: "Operating Systems Placement Course",
    instructor: "Love Babbar (CodeHelp)",
    category: "Operating Systems",
    thumbnail: "https://i.ytimg.com/vi/k09sI9R5q1s/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Covers process scheduling, semaphores, virtual memories, deadlocks, and file systems.",
    duration: "25 Hours",
    difficulty: "All Levels"
  },
  {
    id: "os-apnacollege",
    title: "Operating Systems Crash Course",
    instructor: "Apna College",
    category: "Operating Systems",
    thumbnail: "https://i.ytimg.com/vi/vBURTt9nyEk/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    description: "Operating Systems notes, core CPU algorithms, and memory management for placement prep.",
    duration: "12 Hours",
    difficulty: "All Levels"
  },

  // Computer Networks
  {
    id: "cn-lovebabbar",
    title: "Computer Networks Complete Course",
    instructor: "Love Babbar (CodeHelp)",
    category: "Computer Networks",
    thumbnail: "https://i.ytimg.com/vi/hlGoQC332Ms/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Covers OSI layers, TCP/IP layouts, routing algorithms, socket programming, and protocol setups.",
    duration: "25 Hours",
    difficulty: "All Levels"
  },
  {
    id: "cn-apnacollege",
    title: "Computer Networks Tutorial",
    instructor: "Apna College",
    category: "Computer Networks",
    thumbnail: "https://i.ytimg.com/vi/J85xQxR09bI/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    description: "Syllabus-focused, clean lectures explaining IP configurations, DNS, TCP, and network layers.",
    duration: "15 Hours",
    difficulty: "All Levels"
  },

  // System Design
  {
    id: "sysdesign-striver",
    title: "System Design Placement Prep",
    instructor: "Striver (take U forward)",
    category: "System Design",
    thumbnail: "https://i.ytimg.com/vi/MCXHnjXnDeW/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    description: "Learn software architecture, monolithic vs microservices, load balancing, proxy configurations, and caching.",
    duration: "15 Hours",
    difficulty: "Intermediate"
  },
  {
    id: "sysdesign-lovebabbar",
    title: "System Design Placement bootcamp",
    instructor: "Love Babbar (CodeHelp)",
    category: "System Design",
    thumbnail: "https://i.ytimg.com/vi/hlGoQC332Ms/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Scalability structures, design concepts, distributed logging, and real-life product architecture models.",
    duration: "20 Hours",
    difficulty: "Advanced"
  },
  {
    id: "sysdesign-apnacollege",
    title: "System Design Series",
    instructor: "Apna College",
    category: "System Design",
    thumbnail: "https://i.ytimg.com/vi/z9bZufPHFLU/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ",
    description: "Fundamentals of application architecture, vertical and horizontal scaling, load distribution, and cloud CDN setups.",
    duration: "10 Hours",
    difficulty: "Intermediate"
  },

  // Git & GitHub
  {
    id: "git-codewithharry",
    title: "Git & GitHub Tutorial in Hindi",
    instructor: "CodeWithHarry",
    category: "Git & GitHub",
    thumbnail: "https://i.ytimg.com/vi/apGV9Kg7ics/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9ag8S5vR9W2z8g6t0k8z8x9y",
    description: "Branching, staging, committing, conflict resolutions, pull requests, and collaborative repository setups.",
    duration: "10 Hours",
    difficulty: "Beginner"
  },
  {
    id: "git-apnacollege",
    title: "Git & GitHub Complete Course",
    instructor: "Apna College",
    category: "Git & GitHub",
    thumbnail: "https://i.ytimg.com/vi/z9bZufPHFLU/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    description: "Complete hands-on version control guide from project initialization to publishing repositories.",
    duration: "6 Hours",
    difficulty: "Beginner"
  },
  {
    id: "git-lovebabbar",
    title: "Git & GitHub Crash Course",
    instructor: "Love Babbar (CodeHelp)",
    category: "Git & GitHub",
    thumbnail: "https://i.ytimg.com/vi/hlGoQC332Ms/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Fast-paced version control tutorial mapping push/pull, merges, commits, and collaborative open-source flow.",
    duration: "5 Hours",
    difficulty: "Beginner"
  }
];

// Available domains for courses
export const COURSE_DOMAINS = [
  "All",
  "C",
  "C++",
  "Java",
  "Python",
  "Data Structures & Algorithms",
  "Web Development",
  "SQL & DBMS",
  "Operating Systems",
  "Computer Networks",
  "System Design",
  "Git & GitHub"
];

// Roadmaps Data
export interface RoadmapStage {
  name: string;
  emoji: string;
  duration: string;
  items: { topic: string; detail: string }[];
}

export interface Roadmap {
  id: string;
  domain: string;
  title: string;
  description: string;
  icon: string;
  totalDuration: string;
  stages: RoadmapStage[];
}

export const ROADMAP_DOMAINS = [
  "C",
  "C++",
  "Java",
  "Python",
  "Data Structures & Algorithms",
  "Web Development",
  "SQL & DBMS",
  "Operating Systems",
  "Computer Networks",
  "System Design",
  "Git & GitHub",
  "Machine Learning & AI",
];

export const ROADMAPS: Roadmap[] = [
  {
    id: "c",
    domain: "C",
    title: "C Programming Roadmap",
    description: "A practical path from syntax to memory-safe programs, data structures, and small systems projects.",
    icon: "C",
    totalDuration: "8-10 Weeks",
    stages: [
      {
        name: "Stage 1: Programming Basics",
        emoji: "01",
        duration: "Week 1-2",
        items: [
          { topic: "Setup and Compilation", detail: "Install GCC or MinGW, compile with warnings, understand source files, object files, and executables." },
          { topic: "Core Syntax", detail: "Variables, data types, operators, input/output, conditionals, loops, and function structure." },
          { topic: "Problem Solving", detail: "Trace code by hand, dry run loops, write small programs for numbers, patterns, and strings." },
          { topic: "Debugging Basics", detail: "Use compiler warnings, breakpoints, print debugging, and simple test cases." },
        ],
      },
      {
        name: "Stage 2: Memory and Data",
        emoji: "02",
        duration: "Week 3-5",
        items: [
          { topic: "Arrays and Strings", detail: "1D/2D arrays, character arrays, string.h functions, bounds, and null terminators." },
          { topic: "Pointers", detail: "Addresses, dereferencing, pointer arithmetic, pointer-to-pointer, arrays vs pointers." },
          { topic: "Dynamic Memory", detail: "malloc, calloc, realloc, free, memory leaks, dangling pointers, and ownership habits." },
          { topic: "Structs and Files", detail: "Structures, typedef, nested data, binary/text files, and simple record storage." },
        ],
      },
      {
        name: "Stage 3: C in Practice",
        emoji: "03",
        duration: "Week 6-10",
        items: [
          { topic: "Data Structures", detail: "Implement linked lists, stacks, queues, hash tables, and basic trees manually." },
          { topic: "Bit and Low-Level Concepts", detail: "Bit masks, shifts, flags, integer overflow, memory layout, and sizeof behavior." },
          { topic: "Build Tools", detail: "Header files, multiple source files, Makefile basics, static libraries, and clean project layout." },
          { topic: "Capstone", detail: "Build a student record system, mini shell, file compressor, or inventory CLI with persistent storage." },
        ],
      },
    ],
  },
  {
    id: "cpp",
    domain: "C++",
    title: "C++ Roadmap",
    description: "Move from language fundamentals to STL fluency, object-oriented design, and interview-ready C++.",
    icon: "C++",
    totalDuration: "10-14 Weeks",
    stages: [
      {
        name: "Stage 1: Language Foundation",
        emoji: "01",
        duration: "Week 1-3",
        items: [
          { topic: "Modern C++ Basics", detail: "I/O, references, const, auto, range loops, functions, namespaces, and compilation." },
          { topic: "OOP Concepts", detail: "Classes, constructors, destructors, access control, inheritance, polymorphism, and virtual functions." },
          { topic: "Memory Model", detail: "Stack vs heap, RAII, new/delete, copy semantics, references, and object lifetime." },
          { topic: "Error Handling", detail: "Exceptions, assertions, defensive programming, and when to avoid exceptions in contest code." },
        ],
      },
      {
        name: "Stage 2: STL and Patterns",
        emoji: "02",
        duration: "Week 4-7",
        items: [
          { topic: "Containers", detail: "vector, string, deque, stack, queue, priority_queue, set, map, unordered_map, and unordered_set." },
          { topic: "Algorithms", detail: "sort, binary_search, lower_bound, upper_bound, accumulate, next_permutation, and custom comparators." },
          { topic: "Templates", detail: "Function templates, class templates, type aliases, and generic helper utilities." },
          { topic: "Competitive Patterns", detail: "Fast I/O, pair/tuple, lambdas, bit tricks, coordinate compression, and modular arithmetic." },
        ],
      },
      {
        name: "Stage 3: Advanced and Applied",
        emoji: "03",
        duration: "Week 8-14",
        items: [
          { topic: "Modern Features", detail: "Smart pointers, move semantics, lambda captures, optional, variant, and structured bindings." },
          { topic: "Design Practice", detail: "Apply SOLID basics, composition over inheritance, and small class design exercises." },
          { topic: "DSA Implementation", detail: "Implement graph algorithms, DSU, segment tree, trie, and heap-based problems in C++." },
          { topic: "Project", detail: "Build a CLI task manager, simple game engine loop, or contest template library with tests." },
        ],
      },
    ],
  },
  {
    id: "java",
    domain: "Java",
    title: "Java Roadmap",
    description: "A backend-focused roadmap covering core Java, collections, concurrency, databases, and Spring Boot.",
    icon: "JAVA",
    totalDuration: "14-18 Weeks",
    stages: [
      {
        name: "Stage 1: Core Java",
        emoji: "01",
        duration: "Week 1-4",
        items: [
          { topic: "JDK, JRE, JVM", detail: "Compilation, bytecode, class loading, JVM memory areas, and basic garbage collection." },
          { topic: "Syntax and OOP", detail: "Types, control flow, classes, objects, inheritance, interfaces, abstraction, and polymorphism." },
          { topic: "Strings and Exceptions", detail: "String pool, StringBuilder, checked vs unchecked exceptions, and try-with-resources." },
          { topic: "Clean Code", detail: "Packages, access modifiers, naming, immutability, equals/hashCode, and toString." },
        ],
      },
      {
        name: "Stage 2: Java Standard Library",
        emoji: "02",
        duration: "Week 5-9",
        items: [
          { topic: "Collections", detail: "List, Set, Map, Queue, Deque, PriorityQueue, comparators, iterators, and complexity trade-offs." },
          { topic: "Generics", detail: "Generic classes, bounded types, wildcards, type erasure, and reusable APIs." },
          { topic: "Streams and Lambdas", detail: "Functional interfaces, Stream operations, Optional, method references, and collectors." },
          { topic: "Concurrency", detail: "Threads, synchronized, volatile, ExecutorService, Future, CompletableFuture, and thread safety." },
        ],
      },
      {
        name: "Stage 3: Backend Development",
        emoji: "03",
        duration: "Week 10-18",
        items: [
          { topic: "JDBC and Persistence", detail: "Connections, prepared statements, transactions, connection pools, and ORM basics." },
          { topic: "Spring Boot", detail: "Dependency injection, REST controllers, services, repositories, validation, and configuration profiles." },
          { topic: "Security and Testing", detail: "JWT basics, Spring Security, JUnit, Mockito, integration tests, and API testing." },
          { topic: "Project", detail: "Build a REST API with auth, CRUD, pagination, database migrations, tests, and deployment." },
        ],
      },
    ],
  },
  {
    id: "python",
    domain: "Python",
    title: "Python Roadmap",
    description: "A balanced route through Python fundamentals, automation, backend work, data tools, and production habits.",
    icon: "PY",
    totalDuration: "10-14 Weeks",
    stages: [
      {
        name: "Stage 1: Python Fundamentals",
        emoji: "01",
        duration: "Week 1-3",
        items: [
          { topic: "Setup and Workflow", detail: "Python 3, pip, virtual environments, VS Code, notebooks, formatting, and PEP 8." },
          { topic: "Language Basics", detail: "Types, control flow, functions, comprehensions, slicing, unpacking, and modules." },
          { topic: "Data Structures", detail: "Lists, tuples, dictionaries, sets, counters, default dicts, and practical complexity." },
          { topic: "Files and Errors", detail: "Pathlib, JSON/CSV, context managers, exceptions, and custom error handling." },
        ],
      },
      {
        name: "Stage 2: Intermediate Python",
        emoji: "02",
        duration: "Week 4-7",
        items: [
          { topic: "OOP and Data Models", detail: "Classes, dataclasses, inheritance, composition, dunder methods, and properties." },
          { topic: "Functional Tools", detail: "Iterators, generators, decorators, functools, itertools, and lazy evaluation." },
          { topic: "Testing and Packaging", detail: "pytest, fixtures, mocks, type hints, mypy basics, requirements, and pyproject.toml." },
          { topic: "Automation", detail: "requests, argparse, subprocess, scraping basics, file automation, and scheduled scripts." },
        ],
      },
      {
        name: "Stage 3: Specialize",
        emoji: "03",
        duration: "Week 8-14",
        items: [
          { topic: "Backend Path", detail: "FastAPI or Flask, Pydantic, SQLAlchemy, authentication, REST APIs, and Docker." },
          { topic: "Data Path", detail: "NumPy, Pandas, Matplotlib, Seaborn, data cleaning, EDA, and report notebooks." },
          { topic: "Async and Performance", detail: "asyncio, multiprocessing, profiling, caching, and when to use compiled libraries." },
          { topic: "Project", detail: "Build an API, automation tool, data dashboard, or ML-ready data pipeline with tests." },
        ],
      },
    ],
  },
  {
    id: "dsa",
    domain: "Data Structures & Algorithms",
    title: "DSA Roadmap",
    description: "A topic-by-topic interview roadmap with patterns, practice order, and enough depth for strong problem solving.",
    icon: "DSA",
    totalDuration: "18-24 Weeks",
    stages: [
      {
        name: "Stage 1: Foundations and Patterns",
        emoji: "01",
        duration: "Week 1-5",
        items: [
          { topic: "Complexity Analysis", detail: "Big-O, space complexity, recursion cost, amortized analysis, and comparing approaches." },
          { topic: "Arrays and Strings", detail: "Two pointers, sliding window, prefix sums, Kadane, hashing, and frequency maps." },
          { topic: "Searching and Sorting", detail: "Binary search variants, search on answer, merge sort, quick sort, and custom sorting." },
          { topic: "Recursion Basics", detail: "Call stack, backtracking template, subsets, permutations, combinations, and pruning." },
        ],
      },
      {
        name: "Stage 2: Core Structures",
        emoji: "02",
        duration: "Week 6-11",
        items: [
          { topic: "Linked Lists", detail: "Reversal, cycle detection, fast/slow pointers, merge lists, and pointer edge cases." },
          { topic: "Stacks and Queues", detail: "Monotonic stack, next greater element, expression parsing, deque, and BFS queue." },
          { topic: "Trees and BST", detail: "Traversals, recursion, level order, LCA, diameter, path sums, and BST operations." },
          { topic: "Heaps and Hashing", detail: "Top K, median stream, merge K lists, map/set patterns, and collision-aware thinking." },
        ],
      },
      {
        name: "Stage 3: Advanced Algorithms",
        emoji: "03",
        duration: "Week 12-20",
        items: [
          { topic: "Graphs", detail: "BFS, DFS, topological sort, shortest paths, MST, DSU, cycle detection, and components." },
          { topic: "Dynamic Programming", detail: "1D/2D DP, knapsack, LIS, LCS, matrix DP, partition DP, and memoization templates." },
          { topic: "Tries and Intervals", detail: "Prefix trees, word search, interval merge, sweep line, and calendar-style problems." },
          { topic: "Advanced Structures", detail: "Fenwick tree, segment tree, lazy propagation, and sparse table for range queries." },
        ],
      },
      {
        name: "Stage 4: Interview Readiness",
        emoji: "04",
        duration: "Week 21-24",
        items: [
          { topic: "Practice Plan", detail: "Finish one structured sheet, then mix easy/medium/hard timed sets by topic." },
          { topic: "Revision Notes", detail: "Maintain templates, common mistakes, edge cases, and pattern summaries." },
          { topic: "Mock Interviews", detail: "Practice explaining brute force, optimization, complexity, and clean implementation aloud." },
          { topic: "Contest Habit", detail: "Do weekly contests to build speed, debugging control, and unfamiliar problem confidence." },
        ],
      },
    ],
  },
  {
    id: "webdev",
    domain: "Web Development",
    title: "Full-Stack Web Development Roadmap",
    description: "A project-driven full-stack path from browser fundamentals to APIs, databases, testing, and deployment.",
    icon: "WEB",
    totalDuration: "20-28 Weeks",
    stages: [
      {
        name: "Stage 1: Frontend Foundation",
        emoji: "01",
        duration: "Week 1-6",
        items: [
          { topic: "HTML and Accessibility", detail: "Semantic tags, forms, validation, labels, keyboard navigation, and basic SEO." },
          { topic: "CSS Layout", detail: "Box model, flexbox, grid, responsive design, animations, variables, and component styling." },
          { topic: "JavaScript", detail: "DOM, events, fetch, promises, async/await, modules, closures, and browser storage." },
          { topic: "Frontend Projects", detail: "Build a portfolio, dashboard UI, weather app, and form-heavy app with validation." },
        ],
      },
      {
        name: "Stage 2: React and TypeScript",
        emoji: "02",
        duration: "Week 7-13",
        items: [
          { topic: "React Core", detail: "Components, props, state, effects, conditional rendering, lists, forms, and composition." },
          { topic: "Routing and State", detail: "React Router, Context, Redux Toolkit or Zustand, server state, and caching." },
          { topic: "TypeScript", detail: "Types, interfaces, generics, utility types, type guards, and strict component props." },
          { topic: "Frontend Quality", detail: "Reusable components, loading/error states, testing with RTL, and Playwright basics." },
        ],
      },
      {
        name: "Stage 3: Backend and Database",
        emoji: "03",
        duration: "Week 14-22",
        items: [
          { topic: "Node and Express", detail: "Routing, middleware, validation, error handling, auth, rate limiting, and file uploads." },
          { topic: "Databases", detail: "PostgreSQL or MongoDB, schema design, indexes, transactions, and ORM usage." },
          { topic: "API Design", detail: "REST conventions, pagination, filtering, status codes, versioning, and OpenAPI docs." },
          { topic: "Security", detail: "Password hashing, JWT/cookies, CORS, environment variables, input validation, and OWASP basics." },
        ],
      },
      {
        name: "Stage 4: Production Skills",
        emoji: "04",
        duration: "Week 23-28",
        items: [
          { topic: "Deployment", detail: "Vercel, Render/Railway, Docker basics, CI/CD, domains, HTTPS, and environment setup." },
          { topic: "Performance", detail: "Code splitting, caching, image optimization, database query tuning, and monitoring." },
          { topic: "Capstone", detail: "Build a full-stack app with auth, roles, CRUD, search, tests, and deployed backend/frontend." },
          { topic: "Portfolio Polish", detail: "Write README files, record demos, explain architecture, and document trade-offs." },
        ],
      },
    ],
  },
  {
    id: "sql-dbms",
    domain: "SQL & DBMS",
    title: "SQL & DBMS Roadmap",
    description: "Learn SQL, relational modeling, transactions, indexing, and database design for backend and data roles.",
    icon: "SQL",
    totalDuration: "8-12 Weeks",
    stages: [
      {
        name: "Stage 1: SQL Querying",
        emoji: "01",
        duration: "Week 1-3",
        items: [
          { topic: "Query Basics", detail: "SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, aliases, NULL handling, and expressions." },
          { topic: "Joins", detail: "INNER, LEFT, RIGHT, FULL, CROSS, self joins, join keys, and duplicate control." },
          { topic: "Aggregation", detail: "COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING, and filtering grouped data." },
          { topic: "Subqueries", detail: "Scalar, table, correlated subqueries, EXISTS vs IN, and derived tables." },
        ],
      },
      {
        name: "Stage 2: Database Design",
        emoji: "02",
        duration: "Week 4-6",
        items: [
          { topic: "Schema Modeling", detail: "Entities, relationships, primary keys, foreign keys, constraints, and ER diagrams." },
          { topic: "Normalization", detail: "1NF, 2NF, 3NF, BCNF, functional dependencies, and denormalization trade-offs." },
          { topic: "Transactions", detail: "ACID, isolation levels, locks, deadlocks, commit, rollback, and savepoints." },
          { topic: "Views and Procedures", detail: "Views, materialized views, stored procedures, functions, and triggers." },
        ],
      },
      {
        name: "Stage 3: Performance and Scale",
        emoji: "03",
        duration: "Week 7-12",
        items: [
          { topic: "Indexes", detail: "B-tree indexes, composite indexes, covering indexes, selectivity, and EXPLAIN plans." },
          { topic: "Advanced SQL", detail: "CTEs, recursive CTEs, window functions, ranking, lead/lag, and analytics queries." },
          { topic: "Scaling Concepts", detail: "Replication, partitioning, sharding, backups, migrations, and connection pooling." },
          { topic: "Practice", detail: "Solve SQL 50 style problems and design schemas for ecommerce, chat, LMS, and analytics apps." },
        ],
      },
    ],
  },
  {
    id: "os",
    domain: "Operating Systems",
    title: "Operating Systems Roadmap",
    description: "A clear OS path for interviews: processes, concurrency, memory, storage, and system-level thinking.",
    icon: "OS",
    totalDuration: "10-14 Weeks",
    stages: [
      {
        name: "Stage 1: Process and CPU",
        emoji: "01",
        duration: "Week 1-4",
        items: [
          { topic: "OS Basics", detail: "Kernel vs user space, system calls, interrupts, modes, boot flow, and OS responsibilities." },
          { topic: "Processes", detail: "Process states, PCB, context switching, fork/exec, scheduling queues, and IPC basics." },
          { topic: "Threads", detail: "User vs kernel threads, multithreading benefits, thread lifecycle, and shared memory risks." },
          { topic: "Scheduling", detail: "FCFS, SJF, Round Robin, Priority, MLFQ, turnaround time, waiting time, and starvation." },
        ],
      },
      {
        name: "Stage 2: Concurrency",
        emoji: "02",
        duration: "Week 5-8",
        items: [
          { topic: "Synchronization", detail: "Race conditions, critical sections, mutexes, semaphores, monitors, and condition variables." },
          { topic: "Classic Problems", detail: "Producer-consumer, readers-writers, dining philosophers, and bounded buffer." },
          { topic: "Deadlocks", detail: "Necessary conditions, prevention, avoidance, detection, recovery, and Banker's algorithm." },
          { topic: "Practical Concurrency", detail: "Thread pools, locks, atomic operations, priority inversion, and debugging concurrent code." },
        ],
      },
      {
        name: "Stage 3: Memory and Storage",
        emoji: "03",
        duration: "Week 9-14",
        items: [
          { topic: "Memory Management", detail: "Logical vs physical addresses, paging, segmentation, TLB, page tables, and fragmentation." },
          { topic: "Virtual Memory", detail: "Demand paging, page faults, replacement algorithms, thrashing, and working set model." },
          { topic: "File Systems", detail: "File metadata, directories, allocation methods, journaling, permissions, and inodes." },
          { topic: "I/O and Disks", detail: "Interrupts, DMA, buffering, caching, disk scheduling, SSD concepts, and RAID basics." },
        ],
      },
    ],
  },
  {
    id: "cn",
    domain: "Computer Networks",
    title: "Computer Networks Roadmap",
    description: "Understand internet architecture from OSI layers to routing, TCP, DNS, HTTP, security, and debugging.",
    icon: "NET",
    totalDuration: "10-14 Weeks",
    stages: [
      {
        name: "Stage 1: Network Fundamentals",
        emoji: "01",
        duration: "Week 1-3",
        items: [
          { topic: "Models and Devices", detail: "OSI, TCP/IP, encapsulation, switches, routers, gateways, modems, and access points." },
          { topic: "Physical and Data Link", detail: "Transmission media, framing, MAC addresses, ARP, error detection, and Ethernet basics." },
          { topic: "Addressing", detail: "IPv4, IPv6, subnetting, CIDR, private IPs, NAT, DHCP, and routing tables." },
          { topic: "Tools", detail: "ping, traceroute, nslookup, dig, curl, netstat, Wireshark, and browser network tab." },
        ],
      },
      {
        name: "Stage 2: Transport and Routing",
        emoji: "02",
        duration: "Week 4-8",
        items: [
          { topic: "TCP", detail: "Handshake, termination, sequence numbers, retransmission, flow control, and congestion control." },
          { topic: "UDP", detail: "Connectionless delivery, packet loss, latency trade-offs, streaming, gaming, DNS, and QUIC basics." },
          { topic: "Routing", detail: "Distance vector, link state, RIP, OSPF, BGP concepts, route selection, and failures." },
          { topic: "Reliability", detail: "Timeouts, retries, idempotency, packet loss, jitter, and bandwidth vs throughput." },
        ],
      },
      {
        name: "Stage 3: Web and Security",
        emoji: "03",
        duration: "Week 9-14",
        items: [
          { topic: "DNS", detail: "Recursive resolution, records, caching, TTL, CDN routing, and common DNS failures." },
          { topic: "HTTP and HTTPS", detail: "HTTP methods, status codes, headers, cookies, CORS, caching, HTTP/2, HTTP/3, and TLS." },
          { topic: "Security", detail: "TLS handshake, certificates, firewalls, VPNs, DDoS, spoofing, and secure network habits." },
          { topic: "Practice", detail: "Debug API latency, inspect requests, explain page load flow, and solve common interview scenarios." },
        ],
      },
    ],
  },
  {
    id: "sysdesign",
    domain: "System Design",
    title: "System Design Roadmap",
    description: "A structured path for designing scalable products: requirements, APIs, data, caches, queues, and trade-offs.",
    icon: "SYS",
    totalDuration: "14-20 Weeks",
    stages: [
      {
        name: "Stage 1: Design Basics",
        emoji: "01",
        duration: "Week 1-4",
        items: [
          { topic: "Interview Framework", detail: "Clarify requirements, estimate scale, define APIs, model data, design high level, and discuss trade-offs." },
          { topic: "Scalability", detail: "Vertical vs horizontal scaling, stateless services, load balancing, replication, and bottlenecks." },
          { topic: "APIs", detail: "REST, GraphQL, gRPC basics, idempotency, pagination, rate limiting, and versioning." },
          { topic: "Availability", detail: "SLA/SLO, redundancy, graceful degradation, failover, and disaster recovery concepts." },
        ],
      },
      {
        name: "Stage 2: Data and Performance",
        emoji: "02",
        duration: "Week 5-10",
        items: [
          { topic: "Databases", detail: "SQL vs NoSQL, schema design, indexes, transactions, denormalization, and query patterns." },
          { topic: "Caching", detail: "Cache-aside, write-through, write-behind, invalidation, TTL, Redis, and hot keys." },
          { topic: "Partitioning", detail: "Sharding, consistent hashing, shard keys, hotspots, resharding, and cross-shard queries." },
          { topic: "Async Systems", detail: "Queues, streams, Kafka, pub/sub, retries, dead letter queues, and eventual consistency." },
        ],
      },
      {
        name: "Stage 3: Distributed Systems",
        emoji: "03",
        duration: "Week 11-16",
        items: [
          { topic: "Consistency", detail: "CAP, quorum reads/writes, leader election, consensus basics, and conflict resolution." },
          { topic: "Observability", detail: "Logs, metrics, traces, dashboards, alerts, SLI selection, and incident debugging." },
          { topic: "Security", detail: "Authentication, authorization, encryption, secrets, abuse prevention, and privacy-aware design." },
          { topic: "Media and Search", detail: "CDNs, object storage, search indexing, recommendation basics, and batch processing." },
        ],
      },
      {
        name: "Stage 4: Case Studies",
        emoji: "04",
        duration: "Week 17-20",
        items: [
          { topic: "Starter Designs", detail: "URL shortener, pastebin, file storage, notification system, and rate limiter." },
          { topic: "Product Designs", detail: "Chat app, social feed, ride sharing, video platform, ecommerce, and collaborative editor." },
          { topic: "Mock Practice", detail: "Practice 45-minute sessions, speak trade-offs clearly, and write assumptions before diagrams." },
          { topic: "Design Review", detail: "Check failure modes, capacity, security, data lifecycle, monitoring, and operational simplicity." },
        ],
      },
    ],
  },
  {
    id: "git",
    domain: "Git & GitHub",
    title: "Git & GitHub Roadmap",
    description: "A developer workflow roadmap for version control, branching, pull requests, collaboration, and CI basics.",
    icon: "GIT",
    totalDuration: "3-5 Weeks",
    stages: [
      {
        name: "Stage 1: Git Essentials",
        emoji: "01",
        duration: "Week 1",
        items: [
          { topic: "Mental Model", detail: "Working tree, staging area, local repo, remote repo, commits, branches, and HEAD." },
          { topic: "Daily Commands", detail: "init, clone, status, add, commit, log, diff, restore, reset, branch, switch, merge." },
          { topic: "Remote Work", detail: "remote, fetch, pull, push, upstream branches, SSH setup, and resolving push errors." },
          { topic: "Good Commits", detail: "Small commits, clear messages, Conventional Commits, and meaningful diffs." },
        ],
      },
      {
        name: "Stage 2: Collaboration",
        emoji: "02",
        duration: "Week 2-3",
        items: [
          { topic: "Branching Workflows", detail: "Feature branches, GitHub Flow, trunk-based development, release branches, and hotfixes." },
          { topic: "Pull Requests", detail: "PR descriptions, reviews, requested changes, approvals, merge commits, squash, and rebase merge." },
          { topic: "Conflicts", detail: "Understand conflict markers, resolve safely, test after merge, and avoid mixing unrelated changes." },
          { topic: "GitHub Issues", detail: "Labels, milestones, projects, templates, linking PRs, and tracking work cleanly." },
        ],
      },
      {
        name: "Stage 3: Advanced Workflow",
        emoji: "03",
        duration: "Week 4-5",
        items: [
          { topic: "History Tools", detail: "rebase, interactive rebase, cherry-pick, revert, reflog, tags, and release notes." },
          { topic: "Automation", detail: "GitHub Actions, CI checks, branch protection, CODEOWNERS, Dependabot, and pre-commit hooks." },
          { topic: "Open Source", detail: "Forking, upstream remotes, syncing forks, contributing guidelines, and review etiquette." },
          { topic: "Practice", detail: "Create a repo, simulate team branches, resolve conflicts, open PRs, and set up a CI workflow." },
        ],
      },
    ],
  },
  {
    id: "ml-ai",
    domain: "Machine Learning & AI",
    title: "Machine Learning & AI Roadmap",
    description: "A serious AI roadmap covering math, Python tooling, classical ML, deep learning, LLMs, and deployment.",
    icon: "AI",
    totalDuration: "24-32 Weeks",
    stages: [
      {
        name: "Stage 1: Prerequisites",
        emoji: "01",
        duration: "Week 1-6",
        items: [
          { topic: "Python for Data", detail: "NumPy, Pandas, plotting, notebooks, environments, data cleaning, and reproducible scripts." },
          { topic: "Math Foundation", detail: "Linear algebra, probability, statistics, calculus intuition, optimization, and Bayes theorem." },
          { topic: "Data Handling", detail: "Missing values, outliers, encoding, scaling, train/validation/test splits, and leakage prevention." },
          { topic: "Experiment Habits", detail: "Clear baselines, metrics, notebooks to scripts, versioned datasets, and readable reports." },
        ],
      },
      {
        name: "Stage 2: Classical Machine Learning",
        emoji: "02",
        duration: "Week 7-14",
        items: [
          { topic: "Supervised Learning", detail: "Linear/logistic regression, decision trees, SVM basics, kNN, and regularization." },
          { topic: "Evaluation", detail: "Accuracy, precision, recall, F1, ROC-AUC, confusion matrix, cross-validation, and bias-variance." },
          { topic: "Ensembles", detail: "Random forest, gradient boosting, XGBoost/LightGBM basics, feature importance, and tuning." },
          { topic: "Unsupervised Learning", detail: "Clustering, PCA, dimensionality reduction, anomaly detection, and recommendation basics." },
        ],
      },
      {
        name: "Stage 3: Deep Learning and LLMs",
        emoji: "03",
        duration: "Week 15-24",
        items: [
          { topic: "Neural Networks", detail: "Forward pass, backpropagation, activations, optimizers, loss functions, and regularization." },
          { topic: "PyTorch or TensorFlow", detail: "Tensors, datasets, dataloaders, training loops, checkpoints, GPU use, and inference." },
          { topic: "Model Families", detail: "CNNs for vision, RNN/LSTM basics, transformers, embeddings, attention, and transfer learning." },
          { topic: "LLM Applications", detail: "Prompting, embeddings search, RAG, evaluation, tool calling concepts, and safety checks." },
        ],
      },
      {
        name: "Stage 4: Production ML",
        emoji: "04",
        duration: "Week 25-32",
        items: [
          { topic: "Deployment", detail: "FastAPI model serving, Docker, batch vs real-time inference, latency, and model packaging." },
          { topic: "MLOps", detail: "MLflow, DVC, experiment tracking, model registry, data validation, and pipeline orchestration." },
          { topic: "Monitoring", detail: "Data drift, model drift, logging predictions, feedback loops, and retraining strategy." },
          { topic: "Capstone", detail: "Build and deploy an end-to-end ML or RAG app with metrics, README, tests, and demo data." },
        ],
      },
    ],
  },
];