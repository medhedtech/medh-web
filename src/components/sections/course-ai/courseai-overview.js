"use client";

import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronRight, 
  Briefcase, 
  Brain, 
  ArrowUp, 
  Database, 
  LineChart, 
  Code, 
  Bot, 
  BarChart2, 
  BrainCircuit,
  ChevronDown
} from "lucide-react";

// Role-specific icon mapping
const roleIcons = {
  "Data Management": <Database className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
  "Data Analysis": <LineChart className="w-8 h-8 text-green-500 dark:text-green-400" />,
  "Tool Development": <Code className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
  "Machine Learning": <BrainCircuit className="w-8 h-8 text-red-500 dark:text-red-400" />,
  "Communication": <BarChart2 className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
  "Decision-Making": <Brain className="w-8 h-8 text-teal-500 dark:text-teal-400" />
};

// Enhanced Section component with better dark mode styling and visual elements
const Section = memo(({ title, data }) => {
  const roleIcon = roleIcons[title] || <Briefcase className="w-8 h-8 text-primaryColor dark:text-primaryColor" />;
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-6 md:mt-8"
    >
      <div className="px-0 flex flex-col md:flex-row border border-gray300 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 dark:border-gray-700 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 group">
        {/* Left Section - Improved with gradient background and icon */}
        <div className="w-full md:w-[30%] flex flex-col justify-center items-center py-4 md:py-6 px-3 md:px-4 bg-gradient-to-br from-primaryColor/10 to-transparent dark:from-primaryColor/20 dark:to-transparent/0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
          <div className="mb-2 md:mb-3 bg-white dark:bg-gray-900 p-2 md:p-3 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
            {roleIcon}
          </div>
          <h2 className="text-[1.1rem] md:text-[1.2rem] font-bold tracking-wide text-primaryColor dark:text-gray-50 text-center">
            {title}
          </h2>
        </div>
        
        {/* Right Section - Better spacing and animations */}
        <div className="w-full md:w-[70%] flex flex-col justify-center py-3 md:py-5 px-4 md:px-6">
          <div className="flex flex-col space-y-1">
            {data.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="py-2 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md border-l-2 border-transparent hover:border-primaryColor dark:hover:border-primaryColor"
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  <strong className="text-[0.95rem] md:text-[1rem] font-bold tracking-wide text-primaryColor dark:text-blue-400 block md:inline md:w-[30%] md:min-w-[120px]">
                    {item.label}:
                  </strong>
                  <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 md:w-[70%]">{item.content}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Role Card Footer - Visual indicator */}
          <div className="mt-3 md:mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ x: 5 }}
              className="text-sm font-medium text-primaryColor dark:text-blue-400 flex items-center"
            >
              View career details
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

Section.displayName = "Section";

const sections = [
  {
    title: "Data Management",
    data: [
      { label: "Role", content: "Data Scientist, Data Engineer" },
      {
        label: "Responsibilities",
        content: "Gathering, cleaning, transforming, and storing data. Building data pipelines and ensuring data quality and accessibility."
      },
      {
        label: "Skills Needed",
        content: "Data wrangling, ETL processes, database management, SQL, Python, data governance, and cloud data solutions."
      },
      {
        label: "Avg. Salary",
        content: "$95,000 - $140,000 per year"
      },
      {
        label: "Growth Rate",
        content: "26% annually (much faster than average)"
      }
    ],
  },
  {
    title: "Data Analysis",
    data: [
      { label: "Role", content: "Data Analyst, Business Analyst, Analytics Engineer" },
      {
        label: "Responsibilities",
        content: "Identifying trends, patterns, and relationships in large data sets. Translating data insights into actionable business strategies."
      },
      {
        label: "Skills Needed",
        content: "Statistical analysis, data visualization, SQL, Python, R, business intelligence tools, and domain knowledge."
      },
      {
        label: "Avg. Salary",
        content: "$85,000 - $120,000 per year"
      },
      {
        label: "Growth Rate",
        content: "23% annually (much faster than average)"
      }
    ],
  },
  {
    title: "Tool Development",
    data: [
      { label: "Role", content: "AI Engineer, Machine Learning Engineer, MLOps Engineer" },
      {
        label: "Responsibilities",
        content: "Developing and improving intelligent algorithms and tools to be robust, flexible, and scalable. Building deployment pipelines for AI systems."
      },
      {
        label: "Skills Needed",
        content: "Algorithm development, software engineering, TensorFlow, PyTorch, cloud platforms, containerization, and CI/CD."
      },
      {
        label: "Avg. Salary",
        content: "$110,000 - $175,000 per year"
      },
      {
        label: "Growth Rate",
        content: "30% annually (much faster than average)"
      }
    ],
  },
  {
    title: "Machine Learning",
    data: [
      { label: "Role", content: "Machine Learning Scientist, AI Specialist, Research Scientist" },
      {
        label: "Responsibilities",
        content: "Training and testing models on relevant data. Researching and implementing state-of-the-art algorithms for complex problems."
      },
      {
        label: "Skills Needed",
        content: "Model training, hyperparameter tuning, deep learning, NLP, computer vision, and advanced mathematics."
      },
      {
        label: "Avg. Salary",
        content: "$115,000 - $180,000 per year"
      },
      {
        label: "Growth Rate",
        content: "32% annually (much faster than average)"
      }
    ],
  },
  {
    title: "Communication",
    data: [
      { 
        label: "Role", 
        content: "Data Storyteller, Data Visualization Specialist, AI Communications Expert" 
      },
      {
        label: "Responsibilities",
        content: "Interpreting, visualizing, and communicating essential findings from data analysis. Bridging technical concepts with business stakeholders."
      },
      {
        label: "Skills Needed",
        content: "Data visualization tools (Tableau, Power BI), storytelling, presentation skills, UX/UI for dashboards, and communication."
      },
      {
        label: "Avg. Salary",
        content: "$90,000 - $135,000 per year"
      },
      {
        label: "Growth Rate",
        content: "22% annually (much faster than average)"
      }
    ],
  },
  {
    title: "Decision-Making",
    data: [
      { label: "Role", content: "Decision Scientist, Strategic Analyst, AI Product Manager" },
      {
        label: "Responsibilities",
        content: "Supporting and improving the decision-making process. Translating AI capabilities into strategic business advantages."
      },
      {
        label: "Skills Needed",
        content: "Decision analysis, business intelligence, strategic planning, AI literacy, and domain expertise."
      },
      {
        label: "Avg. Salary",
        content: "$105,000 - $160,000 per year"
      },
      {
        label: "Growth Rate",
        content: "24% annually (much faster than average)"
      }
    ],
  },
];

// Industry statistics for career prospects visualization
const industryStats = [
  { label: "Market Growth Rate", value: "21%", description: "Annual growth in AI/ML sector" },
  { label: "Job Openings", value: "300K+", description: "Data science & AI jobs available globally" },
  { label: "Industry Value", value: "$500B", description: "Expected AI market value by 2025" },
  { label: "Skills Gap", value: "70%", description: "Companies reporting AI/ML skills shortage" }
];

// Top industries hiring for data science and AI professionals
const topIndustries = [
  { name: "Healthcare", growth: "32%", description: "Medical imaging, predictive diagnostics, patient care optimization" },
  { name: "Finance", growth: "28%", description: "Algorithmic trading, fraud detection, risk assessment" },
  { name: "Retail", growth: "26%", description: "Recommendation systems, inventory management, consumer behavior analysis" },
  { name: "Manufacturing", growth: "24%", description: "Predictive maintenance, quality control, supply chain optimization" },
  { name: "Technology", growth: "35%", description: "Natural language processing, computer vision, autonomous systems" }
];

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <>
          <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
            Why Choose the Combined AI and Data Science Course?
          </h1>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-white">
            {[
              {
                title: "Synergy between AI and Data Science",
                description:
                  "AI and Data Science are closely related fields. AI techniques, such as machine learning and deep learning, are essential components of data science. By studying them together, you can better understand how AI algorithms are applied to real-world data problems, making the learning experience more cohesive and practical.",
              },
              {
                title: "Real-world Relevance",
                description:
                  "In the real world, AI and Data Science are often used in conjunction to solve complex problems and make data-driven decisions. Combining the two in a course allows us to see the practical applications and how they complement each other.",
              },
              {
                title: "Comprehensive Skill Set",
                description:
                  "Students who take a combined AI and Data Science course can develop a more comprehensive skill set. They learn not only how to analyze and interpret data but also how to build and deploy AI models to gain valuable insights from that data.",
              },
              {
                title: "Efficiency and Time-saving",
                description:
                  "Offering both subjects in a single course can save time for students who are interested in both AI and Data Science. They don't have to take separate courses for each, reducing the overall duration of their learning.",
              },
              {
                title: "Interdisciplinary Perspective",
                description:
                  "AI and Data Science draw concepts and techniques from various disciplines, such as computer science, statistics, and domain-specific knowledge. Integrating them in a single course can help students understand the interdisciplinary nature of these fields and how they interact in the real world.",
              },
            ].map((feature, index) => (
              <li key={index}>
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>

          <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
            Course Features:
          </h1>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Expert-Led Instruction",
                description:
                  "Our course is facilitated by industry experts with extensive experience in AI and Data Science. They will guide you through complex concepts, offer real-world insights, and share practical tips to enhance your learning experience.",
              },
              {
                title: "Hands-on Projects",
                description:
                  "Theory alone won't suffice in this ever-evolving domain. That's why we emphasize hands-on projects that allow you to apply your knowledge to real-world scenarios. Through these projects, you'll gain the confidence to tackle AI and Data Science challenges head-on.",
              },
              {
                title: "Interactive Learning Environment",
                description:
                  "Our platform fosters an engaging and collaborative learning environment. Connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience.",
              },
              {
                title: "Practical Tools and Software",
                description:
                  "Gain proficiency in popular tools and software used in AI and Data Science, such as Python, R, TensorFlow, and more. Acquiring these skills will make you stand out in the job market and empower you to tackle real-world challenges.",
              },
              {
                title: "Career Support",
                description:
                  "We care about your success beyond the course completion. Benefit from career support, resume building assistance, and interview preparation to boost your chances of landing rewarding positions in the AI and Data Science industry.",
              },
            ].map((feature, index) => (
              <li key={index}>
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Comprehensive Curriculum",
                description:
                  "The AI and Data Science course offers a well-rounded education in machine learning, deep learning, statistical analysis, data visualization, natural language processing, and more. This diverse skill set equips you to address complex real-world data science challenges effectively.",
              },
              {
                title: "Flexibility and Convenience",
                description:
                  "The flexibility to access course material anywhere, anytime is advantageous for busy working professionals and students, enabling learning at their own pace without sacrificing other commitments. The absence of a rigid class schedule allows learners to review challenging concepts and focus more on intriguing areas.",
              },
              {
                title: "Hands-on Projects and Practical Experience",
                description:
                  "Emphasizing hands-on learning, we focus on projects and real-world applications. Working with practical assignments and real datasets, you'll gain invaluable experience in AI algorithm implementation, data pattern exploration, and insightful analysis. This experiential approach equips you to excel in data science roles that demand both theoretical knowledge and practical expertise.",
              },
              {
                title: "Expert Instruction and Mentorship",
                description:
                  "Our virtual classroom is led by industry experts and experienced data scientists, enriching your learning journey with practical insights. Access to these seasoned professionals guarantees high-quality instruction and mentorship. They provide personalized guidance, answer questions, and share industry best practices, empowering you to excel as a proficient AI and Data Science professional.",
              },
              {
                title: "Networking Opportunities",
                description:
                  "Our diverse learner cohort fosters valuable networking chances. Engaging with peers, participating in discussions, and collaborating on projects can lead to meaningful industry connections. Networking enhances knowledge and opens doors to potential job offers or collaborations in the future.",
              },
              {
                title: "Career Advancement",
                description:
                  "The rising demand for AI and Data Science experts in healthcare, finance, marketing, e-commerce, and other industries is evident. Completing an online course that equips you with these skills enhances employability and career prospects. Whether switching careers or seeking advancement, a strong foundation in AI and Data Science sets you apart in the job market.",
              },
            ].map((feature, index) => (
              <li key={index}>
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
        </>
      ),
    },

    {
      id: 3,
      name: "Career Prospects",
      content: (
        <>
          <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
            Unlock Limitless Opportunities with AI and Data
            Science Course
          </h1>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            In today's rapidly evolving technological landscape, the demand
            for professionals with expertise in Data Science and AI is
            skyrocketing. As computational power and data volumes continue to
            expand, the need for skilled individuals in these fields will only
            grow. Our AI and Data Science course equips you with the knowledge
            and skills to capitalize on a wide range of career opportunities
            across various industries, including engineering, medicine, and
            finance. Whether you aim to pursue a role in industry, government,
            or academia, this course sets you on the path to success.
          </p>

          <div>
            <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
              Career Opportunities in AI and Data Science
            </h1>
            {sections.map((section, index) => (
              <Section key={index} title={section.title} data={section.data} />
            ))}
          </div>

          <h1 className="text-[23px] pt-8 font-bold text-primaryColor dark:text-gray50">
            Who Should Enroll in This Course?
          </h1>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Aspiring Data Scientists",
                description:
                  "If you are fascinated by data and aspire to become a Data Scientist, this course provides the ideal launching pad for your career. You'll gain the foundational and advanced skills needed to analyze data, build models, and generate insights that drive business decisions.",
              },
              {
                title: "AI Enthusiasts",
                description:
                  "Whether you're an AI hobbyist or an enthusiast seeking to delve deeper into AI and its applications, this course will nurture your passion and enhance your expertise. You'll explore cutting-edge AI technologies and learn how to apply them to solve real-world problems.",
              },
              {
                title: "Professionals Seeking to Upskill",
                description:
                  "If you are already working in the tech industry and wish to upskill in AI and Data Science, our course offers a convenient and efficient way to do so. Enhance your current skill set with the latest AI and data science techniques to stay competitive in the job market.",
              },
              {
                title: "Career Changers",
                description:
                  "Looking to transition to a high-growth, in-demand field? This comprehensive course provides the perfect foundation for professionals looking to pivot their careers toward the exciting world of AI and Data Science.",
              },
            ].map((feature, index) => (
              <li key={index}>
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ],
};

// Enhanced ListItem component for better UI in lists
const ListItem = memo(({ feature, index }) => (
  <motion.li 
    key={index}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="mb-3 md:mb-4 p-2 md:p-3 border-l-4 border-primaryColor/50 hover:border-primaryColor bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-all"
  >
    <strong className="text-[0.95rem] md:text-[1rem] font-bold tracking-wide text-primaryColor dark:text-gray50 block mb-1">
      {feature.title}
    </strong>
    <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
      {feature.description}
    </p>
  </motion.li>
));

ListItem.displayName = "ListItem";

// Create a new StatCard component for visual statistics
const StatCard = memo(({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-3 md:p-5 flex flex-col items-center text-center"
  >
    <motion.div 
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
      className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-1 md:mb-2"
    >
      {stat.value}
    </motion.div>
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">{stat.label}</h3>
    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
  </motion.div>
));

StatCard.displayName = "StatCard";

// Create an IndustryCard component for top industries
const IndustryCard = memo(({ industry, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
    className="flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-primaryColor hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
  >
    <div className="min-w-[50px] md:min-w-[60px]">
      <div className="text-base md:text-xl font-bold text-primaryColor bg-primaryColor/10 rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center">
        {industry.growth}
      </div>
    </div>
    <div>
      <h3 className="text-md md:text-lg font-semibold text-gray-800 dark:text-gray-200">{industry.name}</h3>
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{industry.description}</p>
    </div>
  </motion.div>
));

IndustryCard.displayName = "IndustryCard";

// Create a reusable accordion component
const Accordion = memo(({ title, children, defaultOpen = false, titleClassName, contentClassName }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-3 overflow-hidden">
      <button
        className={`w-full flex justify-between items-center p-3 md:p-4 text-left transition-all duration-300 ${
          isOpen 
            ? "bg-gradient-to-r from-primaryColor to-blue-600 text-white dark:from-primaryColor dark:to-blue-500 font-semibold shadow-md" 
            : "bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/90 dark:to-gray-800/70 text-gray-800 dark:text-gray-200 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700"
        } ${titleClassName}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[16px] md:text-[18px] flex items-center">
          <span className={`inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-2 ${
            isOpen 
              ? "bg-white animate-pulse" 
              : "bg-primaryColor/60 dark:bg-primaryColor/80"
          }`}></span>
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-center rounded-full ${
            isOpen 
              ? "bg-white/20 dark:bg-white/20" 
              : "bg-primaryColor/10 dark:bg-primaryColor/20"
          } w-6 h-6 md:w-7 md:h-7`}
        >
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 ${
            isOpen ? "text-white" : "text-primaryColor dark:text-primaryColor"
          }`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0.5 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`p-3 md:p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 border-t border-gray-200 dark:border-gray-700 ${contentClassName}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Accordion.displayName = "Accordion";

const CourseAiOverview = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = React.useRef(null);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Handle scroll to top visibility with debouncing for performance
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    // Debounced scroll handler for better performance
    let timeoutId;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  const tabIcons = {
    1: <BookOpen className="w-5 h-5" />,
    2: <Brain className="w-5 h-5" />,
    3: <Briefcase className="w-5 h-5" />
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Modify the content for better UX
  const renderTabContent = () => {
    // Get the active tab content and parse it to use our new ListItem component
    const content = activeContent.content;
    
    // Replace <li> elements with ListItem component
    if (activeTab === 1) {
      return (
        <>
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6">
            Why Choose the Combined AI and Data Science Course?
          </h1>
          
          <div className="space-y-2 md:space-y-4">
            <Accordion 
              title="Synergy between AI and Data Science" 
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                AI and Data Science are closely related fields. AI techniques, such as machine learning and deep learning, are essential components of data science. By studying them together, you can better understand how AI algorithms are applied to real-world data problems, making the learning experience more cohesive and practical.
              </p>
            </Accordion>
            
            <Accordion 
              title="Real-world Relevance"
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                In the real world, AI and Data Science are often used in conjunction to solve complex problems and make data-driven decisions. Combining the two in a course allows us to see the practical applications and how they complement each other.
              </p>
            </Accordion>
            
            <Accordion 
              title="Comprehensive Skill Set"
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Students who take a combined AI and Data Science course can develop a more comprehensive skill set. They learn not only how to analyze and interpret data but also how to build and deploy AI models to gain valuable insights from that data.
              </p>
            </Accordion>
            
            <Accordion 
              title="Efficiency and Time-saving"
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Offering both subjects in a single course can save time for students who are interested in both AI and Data Science. They don't have to take separate courses for each, reducing the overall duration of their learning.
              </p>
            </Accordion>
            
            <Accordion 
              title="Interdisciplinary Perspective"
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                AI and Data Science draw concepts and techniques from various disciplines, such as computer science, statistics, and domain-specific knowledge. Integrating them in a single course can help students understand the interdisciplinary nature of these fields and how they interact in the real world.
              </p>
            </Accordion>
          </div>

          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mt-6 md:mt-8 mb-4 md:mb-6">
            Course Features:
          </h1>
          
          <div className="space-y-2 md:space-y-4">
            <Accordion 
              title="Expert-Led Instruction" 
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Our course is facilitated by industry experts with extensive experience in AI and Data Science. They will guide you through complex concepts, offer real-world insights, and share practical tips to enhance your learning experience.
              </p>
            </Accordion>
            
            <Accordion 
              title="Hands-on Projects"
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Theory alone won't suffice in this ever-evolving domain. That's why we emphasize hands-on projects that allow you to apply your knowledge to real-world scenarios. Through these projects, you'll gain the confidence to tackle AI and Data Science challenges head-on.
              </p>
            </Accordion>
            
            <Accordion 
              title="Interactive Learning Environment"
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Our platform fosters an engaging and collaborative learning environment. Connect with fellow learners, participate in discussions, and exchange ideas, enhancing your overall learning experience.
              </p>
            </Accordion>
            
            <Accordion 
              title="Practical Tools and Software"
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                Gain proficiency in popular tools and software used in AI and Data Science, such as Python, R, TensorFlow, and more. Acquiring these skills will make you stand out in the job market and empower you to tackle real-world challenges.
              </p>
            </Accordion>
            
            <Accordion 
              title="Career Support"
            >
              <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                We care about your success beyond the course completion. Benefit from career support, resume building assistance, and interview preparation to boost your chances of landing rewarding positions in the AI and Data Science industry.
              </p>
            </Accordion>
          </div>
        </>
      );
    } else if (activeTab === 2) {
      return (
        <div className="space-y-2 md:space-y-4">
          <Accordion 
            title="Comprehensive Curriculum" 
          >
            <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
              The AI and Data Science course offers a well-rounded education in machine learning, deep learning, statistical analysis, data visualization, natural language processing, and more. This diverse skill set equips you to address complex real-world data science challenges effectively.
            </p>
          </Accordion>
          
          <Accordion 
            title="Flexibility and Convenience"
          >
            <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
              The flexibility to access course material anywhere, anytime is advantageous for busy working professionals and students, enabling learning at their own pace without sacrificing other commitments. The absence of a rigid class schedule allows learners to review challenging concepts and focus more on intriguing areas.
            </p>
          </Accordion>
          
          <Accordion 
            title="Hands-on Projects and Practical Experience"
          >
            <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
              Emphasizing hands-on learning, we focus on projects and real-world applications. Working with practical assignments and real datasets, you'll gain invaluable experience in AI algorithm implementation, data pattern exploration, and insightful analysis. This experiential approach equips you to excel in data science roles that demand both theoretical knowledge and practical expertise.
            </p>
          </Accordion>
          
          <Accordion 
            title="Expert Instruction and Mentorship"
          >
            <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
              Our virtual classroom is led by industry experts and experienced data scientists, enriching your learning journey with practical insights. Access to these seasoned professionals guarantees high-quality instruction and mentorship. They provide personalized guidance, answer questions, and share industry best practices, empowering you to excel as a proficient AI and Data Science professional.
            </p>
          </Accordion>
          
          <Accordion 
            title="Networking Opportunities"
          >
            <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
              Our diverse learner cohort fosters valuable networking chances. Engaging with peers, participating in discussions, and collaborating on projects can lead to meaningful industry connections. Networking enhances knowledge and opens doors to potential job offers or collaborations in the future.
            </p>
          </Accordion>
          
          <Accordion 
            title="Career Advancement"
          >
            <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
              The rising demand for AI and Data Science experts in healthcare, finance, marketing, e-commerce, and other industries is evident. Completing an online course that equips you with these skills enhances employability and career prospects. Whether switching careers or seeking advancement, a strong foundation in AI and Data Science sets you apart in the job market.
            </p>
          </Accordion>
        </div>
      );
    } else {
      return (
        <>
          <h1 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6">
            Unlock Limitless Opportunities with AI and Data Science
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 dark:text-gray-300 mb-5 md:mb-6 text-[14px] md:text-[16px] leading-relaxed"
          >
            In today's rapidly evolving technological landscape, the demand for professionals with expertise in Data Science and AI 
            is skyrocketing. As computational power and data volumes continue to expand, the need for skilled individuals in these 
            fields will only grow. Our AI and Data Science course equips you with the knowledge and skills to capitalize on a wide 
            range of career opportunities across various industries.
          </motion.p>

          {/* Industry Statistics Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-10"
          >
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 md:mb-4">
              Industry Growth Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {industryStats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Career Path Section */}
          <div>
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6"
            >
              Career Paths in AI and Data Science
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-700 dark:text-gray-300 mb-4 md:mb-6 text-[14px] md:text-[16px]"
            >
              Our comprehensive course prepares you for various roles in the AI and Data Science ecosystem. 
              Below are some of the prominent career paths you can pursue after completing this course:
            </motion.p>
            
            <Accordion 
              title="Explore AI & Data Science Career Paths" 
              contentClassName="p-0"
            >
              <div className="space-y-4 mt-2">
                {sections.map((section, index) => (
                  <Section key={index} title={section.title} data={section.data} />
                ))}
              </div>
            </Accordion>
          </div>

          {/* Top Industries Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 md:mt-10 mb-6 md:mb-8"
          >
            <h2 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6">
              Top Industries Hiring AI & Data Science Professionals
            </h2>
            
            <Accordion 
              title="View Top Hiring Industries" 
              contentClassName="p-0"
            >
              <div className="space-y-2 md:space-y-3 mt-2">
                {topIndustries.map((industry, index) => (
                  <IndustryCard key={index} industry={industry} index={index} />
                ))}
              </div>
            </Accordion>
          </motion.div>

          {/* Who Should Enroll Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 md:mt-10 p-4 md:p-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-[20px] md:text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-4 md:mb-6">
              Who Should Enroll in This Course?
            </h2>
            
            <div className="space-y-2 md:space-y-4">
              <Accordion 
                title="Aspiring Data Scientists" 
              >
                <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                  If you are fascinated by data and aspire to become a Data Scientist, this course provides the ideal launching pad for your career. You'll gain the foundational and advanced skills needed to analyze data, build models, and generate insights that drive business decisions.
                </p>
              </Accordion>
              
              <Accordion 
                title="AI Enthusiasts"
              >
                <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                  Whether you're an AI hobbyist or an enthusiast seeking to delve deeper into AI and its applications, this course will nurture your passion and enhance your expertise. You'll explore cutting-edge AI technologies and learn how to apply them to solve real-world problems.
                </p>
              </Accordion>
              
              <Accordion 
                title="Professionals Seeking to Upskill"
              >
                <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                  If you are already working in the tech industry and wish to upskill in AI and Data Science, our course offers a convenient and efficient way to do so. Enhance your current skill set with the latest AI and data science techniques to stay competitive in the job market.
                </p>
              </Accordion>
              
              <Accordion 
                title="Career Changers"
              >
                <p className="text-gray-700 dark:text-gray-300 text-[13px] md:text-[15px]">
                  Looking to transition to a high-growth, in-demand field? This comprehensive course provides the perfect foundation for professionals looking to pivot their careers toward the exciting world of AI and Data Science.
                </p>
              </Accordion>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 md:mt-10 text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-5 md:p-8 rounded-xl"
          >
            <h2 className="text-xl md:text-2xl font-bold text-primaryColor dark:text-gray-200 mb-3">
              Ready to Launch Your Career in AI & Data Science?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-5 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Join thousands of students who have transformed their careers with our industry-leading course. 
              The future of AI and Data Science is waiting for you!
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.open('/enrollment/ai-and-data-science', '_blank');
              }}
              className="bg-gradient-to-r from-primaryColor to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base cursor-pointer"
            >
              Enroll Now
            </motion.button>
          </motion.div>
        </>
      );
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh]">
      {/* Enhanced background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/10 to-violet-500/15 dark:from-blue-500/10 dark:via-indigo-500/15 dark:to-violet-500/20" />
      
      {/* Loading overlay with animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 md:w-12 md:h-12 border-4 border-primaryColor border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative container mx-auto px-3 md:px-4 py-8 md:py-16">
        {/* Hero section with enhanced animations */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="flex items-center flex-col w-full md:w-[80%] mx-auto mb-10 md:mb-16"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[20px] md:text-[24px] text-center leading-7 md:text-4xl font-bold md:mb-4 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor via-purple-600 to-blue-600"
          >
            Empower Your Journey to Success in the Modern Era of AI and Data Science with MEDH.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center md:text-[16px] text-[14px] leading-6 md:leading-7 md:w-[80%] text-gray-600 dark:text-gray-300"
          >
            Medh's Artificial Intelligence and Data Science course combines advanced AI techniques and technologies with the principles of Data Science. This fusion leverages AI algorithms, models, and tools to efficiently analyze data, extract valuable insights, automate processes, and support data-driven decision-making.
          </motion.p>
        </motion.div>

        {/* Enhanced Tabs with better interactions */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 px-2 md:px-4" 
          role="tablist"
          aria-label="Course content tabs"
        >
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.97 }}
              className={`px-3 md:px-8 py-2 md:py-3 transition-all duration-300 rounded-xl flex items-center gap-2 text-sm md:text-base ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primaryColor to-blue-600 text-white font-semibold shadow-lg"
                  : "bg-white text-primaryColor border border-primaryColor/50 hover:bg-primaryColor/10 dark:bg-gray-800 dark:text-white dark:border-primaryColor/30"
              }`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tabIcons[tab.id]}
              {tab.name}
              {activeTab === tab.id && (
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Content Rendering with glass morphism effect */}
        <AnimatePresence mode="wait">
          <motion.section
            ref={contentRef}
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/90 backdrop-blur-md mx-2 md:mx-auto mt-6 md:mt-8 dark:bg-gray-800/90 px-4 py-6 md:px-8 md:py-10 border border-gray-200 dark:border-gray-700 text-gray-700 rounded-2xl shadow-xl"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {renderTabContent()}
          </motion.section>
        </AnimatePresence>

        {/* Enhanced Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-gradient-to-r from-primaryColor to-blue-600 text-white p-2 md:p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
              onClick={() => {/* Removing scroll functionality */}}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(CourseAiOverview);
