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
  ChevronDown,
  Award,
  Users,
  UserCheck,
  CheckCircle,
  MessageSquare,
  Target,
  Activity,
  TrendingUp,
  GraduationCap,
  Shield,
  HeartHandshake,
  UserPlus,
  Star,
  Globe,
  Layers,
  ClipboardList,
  Rocket,
  Handshake,
  UserCog,
  UserSquare,
  User,
  FileText,
  Zap,
  Lightbulb,
  ThumbsUp,
  Medal,
  Clock
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getEnhancedSemanticColor } from '@/utils/designSystem';

// TypeScript interfaces
interface RoleData {
  label: string;
  content: string;
}

interface Section {
  title: string;
  data: RoleData[];
}

interface TabContent {
  id: number;
  name: string;
  content: React.ReactNode;
}

interface IndustryStats {
  label: string;
  value: string;
  description: string;
}

interface TopIndustry {
  name: string;
  growth: string;
  description: string;
}

interface CourseFeature {
  title: string;
  description: string;
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
  contentClassName?: string;
}

interface SectionProps {
  title: string;
  data: RoleData[];
}

interface ListItemProps {
  feature: CourseFeature;
  index: number;
}

interface StatCardProps {
  stat: IndustryStats;
  index: number;
}

interface IndustryCardProps {
  industry: TopIndustry;
  index: number;
}

// Role-specific icon mapping
const roleIcons: Record<string, React.ReactNode> = {
  "Data Management": <Database className="w-8 h-8 text-blue-500 dark:text-blue-400" />,
  "Data Analysis": <LineChart className="w-8 h-8 text-green-500 dark:text-green-400" />,
  "Tool Development": <Code className="w-8 h-8 text-purple-500 dark:text-purple-400" />,
  "Machine Learning": <BrainCircuit className="w-8 h-8 text-red-500 dark:text-red-400" />,
  "Communication": <BarChart2 className="w-8 h-8 text-amber-500 dark:text-amber-400" />,
  "Decision-Making": <Brain className="w-8 h-8 text-teal-500 dark:text-teal-400" />
};

// Enhanced Section component with consistent card sizing matching FilterCourseCard
const Section = memo<SectionProps>(({ title, data }) => {
  const roleIcon = roleIcons[title] || <Briefcase className="w-8 h-8 text-primaryColor dark:text-primaryColor" />;
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-6 md:mt-8"
    >
      <div className="group relative flex flex-col 
        h-[320px] md:h-[340px] lg:h-[360px] xl:h-[380px] 
        w-full max-w-full 
        mx-auto rounded-lg md:rounded-xl overflow-hidden 
        border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60
        bg-white dark:bg-gray-900 
        shadow-sm hover:shadow-xl hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25
        transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] cursor-pointer
        transform-gpu will-change-transform">
        
        {/* Header Section - Consistent with FilterCourseCard image section height */}
        <div className="relative h-[140px] md:h-[150px] lg:h-[160px] flex flex-col justify-center items-center bg-gradient-to-br from-primaryColor/10 to-transparent dark:from-primaryColor/20 dark:to-transparent/0 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-2 md:mb-3 bg-white dark:bg-gray-900 p-2 md:p-3 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
            {roleIcon}
          </div>
          <h2 className="text-base md:text-lg lg:text-xl font-bold tracking-wide text-primaryColor dark:text-gray-50 text-center px-2">
            {title}
          </h2>
        </div>
        
        {/* Content Section - Matching FilterCourseCard content area */}
        <div className="flex flex-col flex-grow p-3 md:p-4 lg:p-4 space-y-2 md:space-y-2.5 overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {data.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="py-1.5 md:py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md border-l-2 border-transparent hover:border-primaryColor dark:hover:border-primaryColor"
              >
                <div className="flex flex-col">
                  <strong className="text-xs md:text-sm font-bold tracking-wide text-primaryColor dark:text-blue-400 mb-1">
                    {item.label}:
                  </strong>
                  <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.content}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Role Card Footer - Visual indicator */}
          <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ x: 5 }}
              className="text-xs md:text-sm font-medium text-primaryColor dark:text-blue-400 flex items-center"
            >
              View career details
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

Section.displayName = "Section";

const sections: Section[] = [
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
const industryStats: IndustryStats[] = [
  { label: "Market Growth Rate", value: "21%", description: "Annual growth in AI/ML sector" },
  { label: "Job Openings", value: "300K+", description: "Data science & AI jobs available globally" },
  { label: "Industry Value", value: "$500B", description: "Expected AI market value by 2025" },
  { label: "Skills Gap", value: "70%", description: "Companies reporting AI/ML skills shortage" }
];

// Top industries hiring for data science and AI professionals
const topIndustries: TopIndustry[] = [
  { name: "Healthcare", growth: "32%", description: "Medical imaging, predictive diagnostics, patient care optimization" },
  { name: "Finance", growth: "28%", description: "Algorithmic trading, fraud detection, risk assessment" },
  { name: "Retail", growth: "26%", description: "Recommendation systems, inventory management, consumer behavior analysis" },
  { name: "Manufacturing", growth: "24%", description: "Predictive maintenance, quality control, supply chain optimization" },
  { name: "Technology", growth: "35%", description: "Natural language processing, computer vision, autonomous systems" }
];

const data: { tabs: TabContent[] } = {
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
            Unlock Limitless Opportunities with AI and Data Science Course
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
            {/* Updated to use a responsive grid layout for equal-sized cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
              {sections.map((section, index) => (
                <Section key={index} title={section.title} data={section.data} />
              ))}
            </div>
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
const ListItem = memo<ListItemProps>(({ feature, index }) => (
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
const StatCard = memo<StatCardProps>(({ stat, index }) => (
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
const IndustryCard = memo<IndustryCardProps>(({ industry, index }) => (
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
const Accordion = memo<AccordionProps>(({ title, children, defaultOpen = false, titleClassName, contentClassName }) => {
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

// Optimized, UX-focused content for Why Choose & Features
const whyChoose = [
  {
    title: 'AI + Data Science The Power Combo',
    description: 'Master the tools and thinking that drive today’s smartest companies. Learn how AI and data science work together to solve real problems.'
  },
  {
    title: 'Real-World Impact',
    description: 'See how these skills are used in healthcare, finance, tech, and more. Every lesson is built for practical, job-ready results.'
  },
  {
    title: 'All-in-One Skillset',
    description: 'From data wrangling to building AI models, you’ll cover the full spectrum—no need for separate courses.'
  },
  {
    title: 'Save Time, Learn Smarter',
    description: 'A streamlined curriculum means you get the essentials, fast. No filler, just the skills employers want.'
  },
  {
    title: 'Interdisciplinary Edge',
    description: 'Blend computer science, statistics, and domain know-how. Become the “unicorn” every team wants.'
  }
];

const features = [
  {
    title: 'Expert Instructors',
    description: 'Learn from industry leaders who’ve built real AI and data products.'
  },
  {
    title: 'Hands-On Projects',
    description: 'Apply your skills to real datasets and challenges. Build a portfolio that gets noticed.'
  },
  {
    title: 'Interactive Community',
    description: 'Collaborate, discuss, and grow with peers and mentors in a supportive environment.'
  },
  {
    title: 'Career Support',
    description: 'Get resume help, interview prep, and job connections to launch your new career.'
  },
  {
    title: 'Cutting-Edge Tools',
    description: 'Work with Python, TensorFlow, and the latest industry software.'
  }
];

// Career prospects data for doughnut chart
const careerProspects = [
  { name: 'Data Scientist', value: 28, color: getEnhancedSemanticColor('courses', 'light') },
  { name: 'AI Engineer', value: 22, color: getEnhancedSemanticColor('pricing', 'light') },
  { name: 'Data Analyst', value: 18, color: getEnhancedSemanticColor('certification', 'light') },
  { name: 'ML Engineer', value: 14, color: getEnhancedSemanticColor('support', 'light') },
  { name: 'Business Analyst', value: 10, color: getEnhancedSemanticColor('enrollment', 'light') },
  { name: 'Other', value: 8, color: getEnhancedSemanticColor('corporate', 'light') }
];

const benefits = [
  {
    title: 'Comprehensive Curriculum',
    description: 'Master machine learning, deep learning, data visualization, NLP, and more—all in one place.'
  },
  {
    title: 'Flexible Learning',
    description: 'Study anytime, anywhere. Learn at your own pace with on-demand content and no rigid schedules.'
  },
  {
    title: 'Real-World Experience',
    description: 'Work on practical projects and real datasets to build job-ready skills and confidence.'
  },
  {
    title: 'Mentorship & Guidance',
    description: 'Get personalized support from experienced instructors and industry mentors.'
  },
  {
    title: 'Career Growth',
    description: 'Boost your employability and open doors to high-growth roles in top industries.'
  },
  {
    title: 'Networking Opportunities',
    description: 'Connect with peers, experts, and potential employers in a vibrant learning community.'
  }
];

// Accent color palette for cards
const accentColors = [
  { border: 'border-blue-500', bg: 'from-blue-50/80 to-white/90 dark:from-blue-900/40 dark:to-gray-900/80', icon: 'text-blue-500' },
  { border: 'border-emerald-500', bg: 'from-emerald-50/80 to-white/90 dark:from-emerald-900/40 dark:to-gray-900/80', icon: 'text-emerald-500' },
  { border: 'border-amber-500', bg: 'from-amber-50/80 to-white/90 dark:from-amber-900/40 dark:to-gray-900/80', icon: 'text-amber-500' },
  { border: 'border-violet-500', bg: 'from-violet-50/80 to-white/90 dark:from-violet-900/40 dark:to-gray-900/80', icon: 'text-violet-500' },
  { border: 'border-pink-500', bg: 'from-pink-50/80 to-white/90 dark:from-pink-900/40 dark:to-gray-900/80', icon: 'text-pink-500' },
  { border: 'border-indigo-500', bg: 'from-indigo-50/80 to-white/90 dark:from-indigo-900/40 dark:to-gray-900/80', icon: 'text-indigo-500' }
];
// Icon mapping for each card (by index)
const whyChooseIcons = [Brain, Globe, Layers, Zap, Lightbulb];
const featuresIcons = [Award, ClipboardList, MessageSquare, UserCheck, Code];
const benefitsIcons = [BookOpen, Clock, Activity, UserPlus, TrendingUp, Users];
const careerIcons = [CheckCircle, Target, UserCog, Handshake];

const TABS = [
  { id: 0, label: "Overview" },
  { id: 1, label: "Course Features" },
  { id: 2, label: "Benefits" },
];

const TAB_CONTENT = [
  // Overview
  (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
      {whyChoose.map((item, idx) => {
        const Icon = whyChooseIcons[idx % whyChooseIcons.length];
        const accent = accentColors[idx % accentColors.length];
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <div className="flex items-center mb-2">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mr-2"
              >
                <Icon className={`w-6 h-6 ${accent.icon}`} />
              </motion.div>
              <span className="font-bold text-lg text-primaryColor">{item.title}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  ),
  // Course Features
  (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
      {features.map((item, idx) => {
        const Icon = featuresIcons[idx % featuresIcons.length];
        const accent = accentColors[(idx + 2) % accentColors.length];
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <div className="flex items-center mb-2">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mr-2"
              >
                <Icon className={`w-6 h-6 ${accent.icon}`} />
              </motion.div>
              <span className="font-bold text-lg text-primaryColor">{item.title}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  ),
  // Benefits
  (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
      {benefits.map((item, idx) => {
        const Icon = benefitsIcons[idx % benefitsIcons.length];
        const accent = accentColors[(idx + 3) % accentColors.length];
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <div className="flex items-center mb-2">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mr-2"
              >
                <Icon className={`w-6 h-6 ${accent.icon}`} />
              </motion.div>
              <span className="font-bold text-lg text-primaryColor">{item.title}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  ),
];

const CourseAiOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/10 to-violet-500/15 dark:from-blue-500/10 dark:via-indigo-500/15 dark:to-violet-500/20 pointer-events-none" />
      <div className="relative w-full px-6 py-8 md:py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-10 md:mb-14 w-full"
        >
          <h1 className="text-[clamp(1.5rem,4vw+1rem,2.5rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor via-purple-600 to-blue-600 mb-3 text-center">
            Why Choose Medh’s AI & Data Science Course?
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium">
            Gain the most in-demand skills for tomorrow’s tech landscape. Our program blends AI and data science for a future-proof, job-ready education.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex justify-center mb-8">
          <nav className="inline-flex rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primaryColor/50
                  ${activeTab === tab.id
                    ? 'bg-primaryColor text-white dark:bg-primaryColor dark:text-white shadow'
                    : 'bg-transparent text-primaryColor dark:text-primaryColor hover:bg-primaryColor/10 dark:hover:bg-primaryColor/20'}
                `}
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                role="tab"
                tabIndex={activeTab === tab.id ? 0 : -1}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div id={`tab-panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}
          className="transition-all duration-300">
          {TAB_CONTENT[activeTab]}
        </div>

        {/* Career Prospects Doughnut Chart */}
        <div className="mb-12 w-full">
          <h2 className="text-lg md:text-xl font-bold text-primaryColor mb-4 text-center">Career Prospects</h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-4xl mx-auto text-center">
            The chart below shows the most common job roles and their relative demand for graduates of this course. These percentages reflect current industry hiring trends and the wide range of opportunities available in AI and Data Science. Each segment represents a career path you can pursue after completing the program.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center">
            <div className="w-full md:w-1/2 h-64 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={careerProspects}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {careerProspects.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-5 md:p-8 rounded-xl w-full"
          >
          <h2 className="text-xl md:text-2xl font-bold text-primaryColor dark:text-gray-200 mb-3 text-center">
              Ready to Launch Your Career in AI & Data Science?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-5 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Join thousands of students who have transformed their careers with our industry-leading course. The future of AI and Data Science is waiting for you!
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            onClick={() => window.open('/enrollment/ai-and-data-science', '_blank')}
              className="bg-gradient-to-r from-primaryColor to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base cursor-pointer"
            >
              Enroll Now
            </motion.button>
          </motion.div>
      </div>
    </div>
  );
};

export default CourseAiOverview;
