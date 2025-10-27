// Mock data stored as JavaScript variables for runtime flexibility
// This replaces static JSON files and allows dynamic updates

const lessonsData = {
  // Standalone lessons
  "standalone-1": {
    lessonId: "standalone-1",
    lessonTitle: "Complete Web Development Guide",
    courseId: null,
    courseTitle: null,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    content: {
      video: {
        type: "video",
        method: "upload",
        files: [
          {
            name: "web-development-intro.mp4",
            size: 15728640,
            type: "video/mp4",
            path: "/uploads/lessons/standalone-1/videos/web-development-intro.mp4",
            url: "https://content-studio-backend-production.up.railway.app/uploads/lessons/standalone-1/videos/web-development-intro.mp4"
          }
        ],
        transcription: "Welcome to our comprehensive web development guide. Today we'll cover the fundamentals of HTML, CSS, and JavaScript, and how they work together to create modern web applications.",
        generated: null
      },
      text: {
        type: "text",
        method: "ai",
        content: "",
        generated: "# Complete Web Development Guide\n\n## Introduction\n\nWeb development is the process of building websites and web applications. It involves three main technologies:\n\n### 1. HTML (HyperText Markup Language)\n- Structure and content of web pages\n- Elements like headings, paragraphs, links, images\n- Semantic HTML for better accessibility\n\n### 2. CSS (Cascading Style Sheets)\n- Styling and layout of web pages\n- Responsive design principles\n- CSS Grid and Flexbox for layouts\n\n### 3. JavaScript\n- Interactive functionality\n- DOM manipulation\n- Modern ES6+ features\n\n## Modern Frameworks\n\n### Frontend Frameworks\n- **React**: Component-based UI library\n- **Vue.js**: Progressive framework\n- **Angular**: Full-featured framework\n\n### Backend Technologies\n- **Node.js**: JavaScript runtime\n- **Express.js**: Web framework\n- **MongoDB**: NoSQL database\n\n## Best Practices\n\n1. **Responsive Design**: Mobile-first approach\n2. **Performance**: Optimize images and code\n3. **Accessibility**: WCAG guidelines\n4. **SEO**: Search engine optimization\n5. **Security**: HTTPS, input validation\n\n## Next Steps\n\n1. Practice with small projects\n2. Learn version control (Git)\n3. Deploy to cloud platforms\n4. Stay updated with new technologies"
      },
      presentation: {
        type: "presentation",
        method: "upload",
        file: {
          name: "web-development-guide.pptx",
          size: 5242880,
          type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          path: "/uploads/lessons/standalone-1/presentations/web-development-guide.pptx"
        },
        presentation_url: "/uploads/lessons/standalone-1/presentations/web-development-guide.pptx"
      },
      mindmap: {
        type: "mindmap",
        method: "upload",
        file: {
          name: "web-development-mindmap.png",
          size: 1048576,
          type: "image/png",
          path: "/uploads/lessons/standalone-1/mindmaps/web-development-mindmap.png"
        },
        mindmap_url: "/uploads/lessons/standalone-1/mindmaps/web-development-mindmap.png"
      },
      code: {
        type: "code",
        method: "ai",
        code: "// Complete Web Development Example\n\n// HTML Structure\nconst htmlTemplate = `\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Web Development Guide</title>\n    <link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n    <header>\n        <h1>Web Development Guide</h1>\n        <nav>\n            <ul>\n                <li><a href=\"#html\">HTML</a></li>\n                <li><a href=\"#css\">CSS</a></li>\n                <li><a href=\"#js\">JavaScript</a></li>\n            </ul>\n        </nav>\n    </header>\n    <main>\n        <section id=\"html\">\n            <h2>HTML Fundamentals</h2>\n            <p>Learn the structure and semantic elements of HTML5.</p>\n        </section>\n        <section id=\"css\">\n            <h2>CSS Styling</h2>\n            <p>Master CSS for styling and responsive design.</p>\n        </section>\n        <section id=\"js\">\n            <h2>JavaScript Programming</h2>\n            <p>Add interactivity with JavaScript.</p>\n        </section>\n    </main>\n    <footer>\n        <p>&copy; 2024 Web Development Guide</p>\n    </footer>\n    <script src=\"script.js\"></script>\n</body>\n</html>\n`;\n\n// CSS Styles\nconst cssStyles = `\n/* Modern CSS with Grid and Flexbox */\n* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n    line-height: 1.6;\n    color: #333;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    min-height: 100vh;\n}\n\nheader {\n    background: rgba(255, 255, 255, 0.1);\n    backdrop-filter: blur(10px);\n    padding: 1rem 0;\n    text-align: center;\n}\n\nnav ul {\n    display: flex;\n    justify-content: center;\n    list-style: none;\n    gap: 2rem;\n    margin-top: 1rem;\n}\n\nnav a {\n    color: white;\n    text-decoration: none;\n    padding: 0.5rem 1rem;\n    border-radius: 25px;\n    transition: all 0.3s ease;\n}\n\nnav a:hover {\n    background: rgba(255, 255, 255, 0.2);\n    transform: translateY(-2px);\n}\n\nmain {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n    gap: 2rem;\n    padding: 2rem;\n    max-width: 1200px;\n    margin: 0 auto;\n}\n\nsection {\n    background: white;\n    padding: 2rem;\n    border-radius: 15px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);\n    transition: transform 0.3s ease;\n}\n\nsection:hover {\n    transform: translateY(-5px);\n}\n\nh2 {\n    color: #667eea;\n    margin-bottom: 1rem;\n    font-size: 1.5rem;\n}\n\nfooter {\n    text-align: center;\n    padding: 2rem;\n    color: white;\n    background: rgba(0, 0, 0, 0.1);\n}\n\n/* Responsive Design */\n@media (max-width: 768px) {\n    main {\n        grid-template-columns: 1fr;\n        padding: 1rem;\n    }\n    \n    nav ul {\n        flex-direction: column;\n        gap: 1rem;\n    }\n}\n`;\n\n// JavaScript Functionality\nconst jsCode = `\n// Modern JavaScript with ES6+ features\nclass WebDevGuide {\n    constructor() {\n        this.currentSection = 'html';\n        this.init();\n    }\n    \n    init() {\n        this.setupEventListeners();\n        this.highlightCurrentSection();\n        this.addSmoothScrolling();\n    }\n    \n    setupEventListeners() {\n        // Navigation click handlers\n        document.querySelectorAll('nav a').forEach(link => {\n            link.addEventListener('click', (e) => {\n                e.preventDefault();\n                const targetId = e.target.getAttribute('href').substring(1);\n                this.navigateToSection(targetId);\n            });\n        });\n        \n        // Section hover effects\n        document.querySelectorAll('section').forEach(section => {\n            section.addEventListener('mouseenter', () => {\n                section.style.transform = 'translateY(-10px) scale(1.02)';\n            });\n            \n            section.addEventListener('mouseleave', () => {\n                section.style.transform = 'translateY(0) scale(1)';\n            });\n        });\n    }\n    \n    navigateToSection(sectionId) {\n        const section = document.getElementById(sectionId);\n        if (section) {\n            section.scrollIntoView({ \n                behavior: 'smooth',\n                block: 'start'\n            });\n            this.currentSection = sectionId;\n            this.highlightCurrentSection();\n        }\n    }\n    \n    highlightCurrentSection() {\n        // Remove active class from all nav links\n        document.querySelectorAll('nav a').forEach(link => {\n            link.classList.remove('active');\n        });\n        \n        // Add active class to current section link\n        const activeLink = document.querySelector(`nav a[href=\"#${this.currentSection}\"]`);\n        if (activeLink) {\n            activeLink.classList.add('active');\n        }\n    }\n    \n    addSmoothScrolling() {\n        // Add smooth scrolling to all internal links\n        document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {\n            anchor.addEventListener('click', (e) => {\n                e.preventDefault();\n                const target = document.querySelector(anchor.getAttribute('href'));\n                if (target) {\n                    target.scrollIntoView({\n                        behavior: 'smooth',\n                        block: 'start'\n                    });\n                }\n            });\n        });\n    }\n}\n\n// Initialize the application when DOM is loaded\ndocument.addEventListener('DOMContentLoaded', () => {\n    new WebDevGuide();\n    \n    // Add some interactive features\n    console.log('🚀 Web Development Guide loaded successfully!');\n    \n    // Add typing effect to main heading\n    const heading = document.querySelector('h1');\n    if (heading) {\n        const text = heading.textContent;\n        heading.textContent = '';\n        let i = 0;\n        \n        const typeWriter = () => {\n            if (i < text.length) {\n                heading.textContent += text.charAt(i);\n                i++;\n                setTimeout(typeWriter, 100);\n            }\n        };\n        \n        setTimeout(typeWriter, 500);\n    }\n});\n`;\n\n// Export the code templates\nmodule.exports = {\n    html: htmlTemplate,\n    css: cssStyles,\n    javascript: jsCode\n};\n",
        language: "javascript"
      },
      images: {
        type: "images",
        method: "ai",
        files: [
          {
            name: "web-dev-architecture.png",
            description: "Web development architecture diagram showing frontend, backend, and database layers",
            size: 2048000,
            type: "image/png",
            path: "/uploads/lessons/standalone-1/images/web-dev-architecture.png"
          },
          {
            name: "html-css-js-flow.png",
            description: "Flow diagram showing how HTML, CSS, and JavaScript work together",
            size: 1536000,
            type: "image/png",
            path: "/uploads/lessons/standalone-1/images/html-css-js-flow.png"
          },
          {
            name: "responsive-design-example.png",
            description: "Example of responsive design showing mobile, tablet, and desktop layouts",
            size: 1280000,
            type: "image/png",
            path: "/uploads/lessons/standalone-1/images/responsive-design-example.png"
          }
        ],
        generated: [
          {
            prompt: "Create a modern web development architecture diagram",
            description: "Visual representation of web development components and their relationships",
            url: "https://content-studio-backend-production.up.railway.app/uploads/lessons/standalone-1/images/generated-architecture.png"
          }
        ],
        count: 3
      }
    },
    template: {
      id: "learning-flow",
      name: "Learning Flow",
      description: "Traditional learning progression from video to practice",
      formats: [
        { name: "Video", icon: "🎥", order: 1 },
        { name: "Explanation", icon: "🧾", order: 2 },
        { name: "Code", icon: "💻", order: 3 },
        { name: "Mind Map", icon: "🧠", order: 4 },
        { name: "Image", icon: "🖼️", order: 5 },
        { name: "Presentation", icon: "📊", order: 6 }
      ]
    },
    metadata: {
      totalContent: 6,
      completedContent: 6,
      progress: 100,
      estimatedTime: "45 minutes",
      difficulty: "intermediate"
    }
  },

  "standalone-2": {
    lessonId: "standalone-2",
    lessonTitle: "JavaScript Fundamentals - Part 1",
    courseId: null,
    courseTitle: null,
    createdAt: "2024-01-21T10:00:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
    content: {
      video: null,
      text: {
        type: "text",
        method: "manual",
        content: "This lesson covers the basics of JavaScript programming including variables, functions, and control structures.",
        generated: ""
      },
      presentation: null,
      mindmap: null,
      code: null,
      images: null
    },
    template: {
      id: "learning-flow",
      name: "Learning Flow",
      description: "Traditional learning progression from video to practice",
      formats: [
        { name: "Video", icon: "🎥", order: 1 },
        { name: "Explanation", icon: "🧾", order: 2 },
        { name: "Code", icon: "💻", order: 3 },
        { name: "Mind Map", icon: "🧠", order: 4 },
        { name: "Image", icon: "🖼️", order: 5 },
        { name: "Presentation", icon: "📊", order: 6 }
      ]
    },
    metadata: {
      totalContent: 1,
      completedContent: 1,
      progress: 17,
      estimatedTime: "30 minutes",
      difficulty: "beginner"
    }
  },

  "standalone-3": {
    lessonId: "standalone-3",
    lessonTitle: "Empty Lesson Template",
    courseId: null,
    courseTitle: null,
    createdAt: "2024-01-22T10:00:00Z",
    updatedAt: "2024-01-22T10:00:00Z",
    content: {
      video: null,
      text: null,
      presentation: null,
      mindmap: null,
      code: null,
      images: null
    },
    template: {
      id: "learning-flow",
      name: "Learning Flow",
      description: "Traditional learning progression from video to practice",
      formats: [
        { name: "Video", icon: "🎥", order: 1 },
        { name: "Explanation", icon: "🧾", order: 2 },
        { name: "Code", icon: "💻", order: 3 },
        { name: "Mind Map", icon: "🧠", order: 4 },
        { name: "Image", icon: "🖼️", order: 5 },
        { name: "Presentation", icon: "📊", order: 6 }
      ]
    },
    metadata: {
      totalContent: 0,
      completedContent: 0,
      progress: 0,
      estimatedTime: "0 minutes",
      difficulty: "beginner"
    }
  },

  // Test lesson (dynamically created)
  "test-lesson": {
    lessonId: "test-lesson",
    lessonTitle: "Test Lesson",
    courseId: null,
    courseTitle: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      text: {
        type: "text",
        content: "This is a test lesson content"
      }
    },
    template: {
      id: "learning-flow",
      name: "Learning Flow",
      description: "Traditional learning progression from video to practice",
      formats: [
        { name: "Video", icon: "🎥", order: 1 },
        { name: "Explanation", icon: "🧾", order: 2 },
        { name: "Code", icon: "💻", order: 3 },
        { name: "Mind Map", icon: "🧠", order: 4 },
        { name: "Image", icon: "🖼️", order: 5 },
        { name: "Presentation", icon: "📊", order: 6 }
      ]
    },
    metadata: {
      totalContent: 1,
      completedContent: 1,
      progress: 17,
      estimatedTime: "45 minutes",
      difficulty: "beginner"
    }
  }
};

// Helper functions for managing lesson data
const lessonDataManager = {
  // Get lesson by ID
  getLesson(lessonId) {
    return lessonsData[lessonId] || null;
  },

  // Update lesson content
  updateLesson(lessonId, updates) {
    if (lessonsData[lessonId]) {
      // Update existing lesson
      lessonsData[lessonId] = {
        ...lessonsData[lessonId],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return lessonsData[lessonId];
    } else {
      // Create new lesson if it doesn't exist
      lessonsData[lessonId] = {
        ...updates,
        lessonId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return lessonsData[lessonId];
    }
  },

  // Update specific content format for a lesson
  updateLessonContent(lessonId, formatId, content) {
    if (lessonsData[lessonId]) {
      if (!lessonsData[lessonId].content) {
        lessonsData[lessonId].content = {};
      }
      lessonsData[lessonId].content[formatId] = content;
      lessonsData[lessonId].updatedAt = new Date().toISOString();
      
      // Update metadata
      const contentCount = Object.keys(lessonsData[lessonId].content).filter(
        key => lessonsData[lessonId].content[key] !== null
      ).length;
      
      lessonsData[lessonId].metadata = {
        ...lessonsData[lessonId].metadata,
        totalContent: Object.keys(lessonsData[lessonId].content).length,
        completedContent: contentCount,
        progress: Math.round((contentCount / Object.keys(lessonsData[lessonId].content).length) * 100)
      };
      
      return lessonsData[lessonId];
    }
    return null;
  },

  // Create new lesson
  createLesson(lessonData) {
    const lessonId = lessonData.lessonId || `lesson-${Date.now()}`;
    lessonsData[lessonId] = {
      ...lessonData,
      lessonId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return lessonsData[lessonId];
  },

  // Get all lessons
  getAllLessons() {
    return Object.values(lessonsData);
  },

  // Delete lesson
  deleteLesson(lessonId) {
    if (lessonsData[lessonId]) {
      delete lessonsData[lessonId];
      return true;
    }
    return false;
  }
};

module.exports = {
  lessonsData,
  lessonDataManager
};
