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
  // C - CodeWithHarry
  {
    id: "c-codewithharry",
    title: "Complete C Programming",
    instructor: "CodeWithHarry",
    category: "C",
    thumbnail: "https://i.ytimg.com/vi/aGtC9gj4C2k/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38oQDdS",
    description: "Complete beginner-friendly C programming course",
    duration: "15+ Hours",
    difficulty: "Beginner"
  },
  // C++ - Apna College
  {
    id: "cpp-apna-college",
    title: "C++ Placement Course",
    instructor: "Apna College",
    category: "C++",
    thumbnail: "https://i.ytimg.com/vi/z9bZufPHFLU/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ",
    description: "Complete C++ course for placement preparation with DSA basics",
    duration: "40+ Hours",
    difficulty: "Beginner"
  },
  // C++ - Love Babbar
  {
    id: "cpp-love-babbar",
    title: "C++ Complete Series",
    instructor: "Love Babbar",
    category: "C++",
    thumbnail: "https://i.ytimg.com/vi/wQ7wQqJ41c8/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
    description: "Complete C++ tutorial series for beginners",
    duration: "30+ Hours",
    difficulty: "Beginner"
  },
  // Java - Apna College
  {
    id: "java-apna-college",
    title: "Java + DSA Course",
    instructor: "Apna College",
    category: "Java",
    thumbnail: "https://i.ytimg.com/vi/1oQwXa51w6Y/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop",
    description: "Complete Java and Data Structures course in Hindi",
    duration: "80+ Hours",
    difficulty: "All Levels"
  },
  // Java - CodeWithHarry
  {
    id: "java-codewithharry",
    title: "Java Complete Tutorial",
    instructor: "CodeWithHarry",
    category: "Java",
    thumbnail: "https://i.ytimg.com/vi/ntLJmHOJ0ME/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9agS67Uits0UnJyrYiXhQS9Z",
    description: "Complete Java tutorial from beginner to advanced in Hindi",
    duration: "50+ Hours",
    difficulty: "Beginner"
  },
  // Python - CodeWithHarry
  {
    id: "python-codewithharry",
    title: "Python Complete Tutorial",
    instructor: "CodeWithHarry",
    category: "Python",
    thumbnail: "https://i.ytimg.com/vi/gfDE2a7MKjA/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9agICnT8t4iYVSZ3eykIAOME",
    description: "Complete Python tutorial in Hindi from basic to advanced",
    duration: "40+ Hours",
    difficulty: "Beginner"
  },
  // Python - Apna College
  {
    id: "python-apna-college",
    title: "Python Course",
    instructor: "Apna College",
    category: "Python",
    thumbnail: "https://i.ytimg.com/vi/vLqTf2b6GZw/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0MvGQrF9L2VNiQe0Ff68L3",
    description: "Python course for beginners in Hindi",
    duration: "20+ Hours",
    difficulty: "Beginner"
  },
  // DSA - Striver
  {
    id: "dsa-striver",
    title: "DSA Complete Playlist",
    instructor: "Striver (Take U Forward)",
    category: "Data Structures & Algorithms",
    thumbnail: "https://i.ytimg.com/vi/8h8Jq2J8dT4/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    description: "Complete DSA course from beginner to advanced by Striver",
    duration: "100+ Hours",
    difficulty: "All Levels"
  },
  // DSA - Love Babbar
  {
    id: "dsa-love-babbar",
    title: "DSA Complete Series",
    instructor: "Love Babbar",
    category: "Data Structures & Algorithms",
    thumbnail: "https://i.ytimg.com/vi/4rJZ_zS6lE8/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
    description: "Complete Data Structures and Algorithms series in Hindi",
    duration: "70+ Hours",
    difficulty: "All Levels"
  },
  // Web Development - CodeWithHarry
  {
    id: "web-sigma-codewithharry",
    title: "Sigma Web Development Course",
    instructor: "CodeWithHarry",
    category: "Web Development",
    thumbnail: "https://i.ytimg.com/vi/7EOFi9kJ_kY/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq53JxJ9YfL2l3b1H6G8oK",
    description: "Complete Web Development course from HTML to React in Hindi",
    duration: "100+ Hours",
    difficulty: "All Levels"
  },
  // Web Development - Apna College
  {
    id: "web-apna-college-fullstack",
    title: "Full Stack Web Development",
    instructor: "Apna College",
    category: "Web Development",
    thumbnail: "https://i.ytimg.com/vi/tVzUXW6siu0/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3f4O1vNckGq1qNc0h25Qz7",
    description: "Full Stack Web Development in Hindi",
    duration: "70+ Hours",
    difficulty: "All Levels"
  },
  // HTML & CSS - CodeWithHarry
  {
    id: "html-css-codewithharry",
    title: "HTML & CSS Tutorial",
    instructor: "CodeWithHarry",
    category: "HTML & CSS",
    thumbnail: "https://i.ytimg.com/vi/6mbwJ2xhgzE/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9agiCL7tyaDgYj9hR7jJ9K9z",
    description: "Complete HTML & CSS course for beginners",
    duration: "20+ Hours",
    difficulty: "Beginner"
  },
  // JavaScript - CodeWithHarry
  {
    id: "js-codewithharry",
    title: "JavaScript Complete Tutorial",
    instructor: "CodeWithHarry",
    category: "JavaScript",
    thumbnail: "https://i.ytimg.com/vi/8zT8J928r54/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38oQDdS",
    description: "Complete JavaScript tutorial from basics to advanced",
    duration: "30+ Hours",
    difficulty: "All Levels"
  },
  // React - CodeWithHarry
  {
    id: "react-codewithharry",
    title: "React Complete Tutorial",
    instructor: "CodeWithHarry",
    category: "React",
    thumbnail: "https://i.ytimg.com/vi/4rZ8T1N0r9I/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9agXq6385kL2vJ8r9N1m4F1y",
    description: "React tutorial in Hindi from scratch",
    duration: "35+ Hours",
    difficulty: "All Levels"
  },
  // SQL - CodeWithHarry
  {
    id: "sql-codewithharry",
    title: "SQL Tutorial",
    instructor: "CodeWithHarry",
    category: "SQL",
    thumbnail: "https://i.ytimg.com/vi/J9X4l5o8194/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38oQDdS",
    description: "SQL tutorial in Hindi from scratch",
    duration: "15+ Hours",
    difficulty: "Beginner"
  },
  // SQL - CodeHelp (Love Babbar)
  {
    id: "sql-codehelp",
    title: "SQL Complete Course",
    instructor: "CodeHelp (Love Babbar)",
    category: "SQL",
    thumbnail: "https://i.ytimg.com/vi/hlGoQC332Ms/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Complete SQL course for beginners and interviews",
    duration: "20+ Hours",
    difficulty: "Beginner"
  },
  // DBMS - CodeHelp (Love Babbar)
  {
    id: "dbms-codehelp",
    title: "DBMS Complete Course",
    instructor: "CodeHelp (Love Babbar)",
    category: "DBMS",
    thumbnail: "https://i.ytimg.com/vi/k09sI9R5q1s/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Complete Database Management Systems course for interviews",
    duration: "25+ Hours",
    difficulty: "Beginner"
  },
  // OOP - CodeWithHarry
  {
    id: "oop-codewithharry",
    title: "OOP Complete Tutorial",
    instructor: "CodeWithHarry",
    category: "OOP",
    thumbnail: "https://i.ytimg.com/vi/0jT2q6g5c68/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9aiXlHcLx-mDH1Qul38oQDdS",
    description: "Object Oriented Programming concepts in detail",
    duration: "20+ Hours",
    difficulty: "All Levels"
  },
  // Git & GitHub - CodeWithHarry
  {
    id: "git-codewithharry",
    title: "Git & GitHub Tutorial",
    instructor: "CodeWithHarry",
    category: "Git & GitHub",
    thumbnail: "https://i.ytimg.com/vi/apGV9Kg7ics/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLu0W_9lII9ag8S5vR9W2z8g6t0k8z8x9y",
    description: "Complete Git and GitHub tutorial in Hindi",
    duration: "10+ Hours",
    difficulty: "Beginner"
  },
  // Operating Systems - CodeHelp (Love Babbar)
  {
    id: "os-codehelp",
    title: "Operating Systems Complete Course",
    instructor: "CodeHelp (Love Babbar)",
    category: "Operating Systems",
    thumbnail: "https://i.ytimg.com/vi/7iWvLr2fU9U/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Operating Systems complete course for placements",
    duration: "30+ Hours",
    difficulty: "All Levels"
  },
  // Computer Networks - CodeHelp (Love Babbar)
  {
    id: "cn-codehelp",
    title: "Computer Networks Complete Course",
    instructor: "CodeHelp (Love Babbar)",
    category: "Computer Networks",
    thumbnail: "https://i.ytimg.com/vi/J85xQxR09bI/maxresdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTpukecmA3Pz0b2_mnzIogd9",
    description: "Computer Networks full course for interviews",
    duration: "25+ Hours",
    difficulty: "All Levels"
  }
];

// Available domains for courses
export const COURSE_DOMAINS = [
  "All", "C", "C++", "Java", "Python", 
  "Data Structures & Algorithms", "Web Development", "HTML & CSS", "JavaScript", "React", 
  "SQL", "DBMS", "Operating Systems", "Computer Networks", "OOP", "Git & GitHub"
];

// Roadmaps Data
export interface Roadmap {
  id: string;
  title: string;
  description: string;
  stages: {
    name: string;
    items: string[];
  }[];
}

export const ROADMAPS: Roadmap[] = [
  {
    id: "cpp",
    title: "C++ Roadmap",
    description: "Start from basic syntax and move to advanced concepts like OOP, STL, and DSA",
    stages: [
      {
        name: "Beginner",
        items: ["Basic Syntax", "Variables & Data Types", "Control Structures", "Functions", "Arrays"]
      },
      {
        name: "Intermediate",
        items: ["Pointers", "OOP Concepts", "STL", "File Handling", "Exception Handling"]
      },
      {
        name: "Advanced",
        items: ["Templates", "DSA with C++", "Competitive Programming"]
      }
    ]
  },
  {
    id: "java",
    title: "Java Roadmap",
    description: "Master Java from basics to enterprise-level development",
    stages: [
      {
        name: "Beginner",
        items: ["Basic Syntax", "Variables & Data Types", "OOP Basics", "Strings", "Arrays"]
      },
      {
        name: "Intermediate",
        items: ["Collections Framework", "Multithreading", "Exception Handling", "JDBC", "File I/O"]
      },
      {
        name: "Advanced",
        items: ["Spring Boot", "Microservices", "DSA with Java"]
      }
    ]
  },
  {
    id: "python",
    title: "Python Roadmap",
    description: "Learn Python from basics to data science and web development",
    stages: [
      {
        name: "Beginner",
        items: ["Basic Syntax", "Variables & Data Types", "Control Structures", "Functions", "Lists & Tuples"]
      },
      {
        name: "Intermediate",
        items: ["OOP", "File Handling", "Libraries (NumPy, Pandas)", "Web Scraping"]
      },
      {
        name: "Advanced",
        items: ["Django/Flask", "Data Science", "Machine Learning"]
      }
    ]
  },
  {
    id: "dsa",
    title: "DSA Roadmap",
    description: "Step-by-step guide to master Data Structures and Algorithms",
    stages: [
      {
        name: "Beginner",
        items: ["Time & Space Complexity", "Arrays", "Strings", "Searching & Sorting"]
      },
      {
        name: "Intermediate",
        items: ["Linked Lists", "Stacks & Queues", "Trees", "Hashing"]
      },
      {
        name: "Advanced",
        items: ["Graphs", "Dynamic Programming", "Greedy", "Segment Trees"]
      }
    ]
  },
  {
    id: "web",
    title: "Web Development Roadmap",
    description: "From beginner to full-stack developer in structured steps",
    stages: [
      {
        name: "Beginner",
        items: ["HTML", "CSS", "JavaScript Basics", "Git & GitHub"]
      },
      {
        name: "Intermediate",
        items: ["React", "Node.js", "Express", "MongoDB"]
      },
      {
        name: "Advanced",
        items: ["Next.js", "System Design", "DevOps"]
      }
    ]
  },
  {
    id: "frontend",
    title: "Frontend Roadmap",
    description: "Become a frontend development expert",
    stages: [
      {
        name: "Beginner",
        items: ["HTML", "CSS", "JavaScript", "Responsive Design"]
      },
      {
        name: "Intermediate",
        items: ["React", "State Management", "TypeScript", "CSS Frameworks"]
      },
      {
        name: "Advanced",
        items: ["Next.js", "Performance Optimization", "Testing"]
      }
    ]
  },
  {
    id: "backend",
    title: "Backend Roadmap",
    description: "Master backend development and APIs",
    stages: [
      {
        name: "Beginner",
        items: ["Node.js/Java/Python", "Databases", "REST APIs"]
      },
      {
        name: "Intermediate",
        items: ["Express/Spring Boot", "Authentication", "SQL & NoSQL"]
      },
      {
        name: "Advanced",
        items: ["Microservices", "Caching", "Message Queues"]
      }
    ]
  },
  {
    id: "fullstack",
    title: "Full Stack Roadmap",
    description: "Become a complete full-stack developer",
    stages: [
      {
        name: "Beginner",
        items: ["HTML", "CSS", "JavaScript", "Git"]
      },
      {
        name: "Intermediate",
        items: ["React", "Node.js/Express", "MongoDB/PostgreSQL"]
      },
      {
        name: "Advanced",
        items: ["Next.js", "System Design", "DevOps"]
      }
    ]
  }
];
