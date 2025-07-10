import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// TODO: Replace with actual database integration
const getCourseFromDatabase = async (courseId: string) => {
  // TODO: Implement actual database query
  // Example: return await db.collection('courses').findOne({ _id: courseId });
  console.warn('getCourseFromDatabase: Mock data removed. Please implement database integration.');
  return null;
};

// Removed mock course data - implement database integration instead
const mockCourseData = {
  "68527b906f58dac6f32a0958": {
    "_id": "68527b906f58dac6f32a0958",
    "course_title": "AI & Data Science Master Course",
    "course_subtitle": "Complete Program with Industry Projects",
    "course_tag": "POPULAR",
    "course_description": {
      "program_overview": "Master the fundamentals and advanced concepts of Artificial Intelligence and Data Science. This comprehensive course covers machine learning, deep learning, data analysis, and real-world applications.",
      "benefits": "Industry-relevant skills, hands-on projects, expert mentorship, career support",
      "learning_objectives": [
        "Master Python programming for data science",
        "Understand machine learning algorithms",
        "Build deep learning models",
        "Work with real datasets",
        "Deploy AI models in production"
      ],
      "course_requirements": [
        "Basic programming knowledge",
        "High school mathematics",
        "Computer with internet connection"
      ],
      "target_audience": [
        "Students looking to enter AI/ML field",
        "Working professionals seeking career transition",
        "Entrepreneurs wanting to leverage AI"
      ]
    },
    "course_category": "Technology",
    "course_subcategory": "Artificial Intelligence",
    "course_grade": "Intermediate to Advanced",
    "course_level": "Intermediate",
    "language": "English",
    "course_image": "/images/courses/ai-data-science.jpg",
    "brochures": ["/brochures/ai-data-science-brochure.pdf"],
    "course_duration": "6 months",
    "session_duration": "2 hours",
    "course_fee": 49999,
    "course_type": "Live",
    "delivery_format": "Online",
    "delivery_type": "Live Interactive",
    "status": "Active",
    "enrolled_students": 1247,
    "is_Certification": "Yes",
    "is_Assignments": "Yes",
    "is_Projects": "Yes",
    "is_Quizes": "Yes",
    "curriculum": [
      {
        "id": "week1",
        "weekTitle": "Python Fundamentals for Data Science",
        "weekDescription": "Introduction to Python programming and data science libraries",
        "topics": ["Python basics", "NumPy", "Pandas", "Matplotlib"],
        "lessons": [
          {
            "id": "lesson1_1",
            "title": "Python Programming Basics",
            "duration": "2 hours",
            "type": "video"
          },
          {
            "id": "lesson1_2", 
            "title": "Data Structures in Python",
            "duration": "1.5 hours",
            "type": "video"
          }
        ]
      },
      {
        "id": "week2",
        "weekTitle": "Data Analysis and Visualization",
        "weekDescription": "Learn to analyze and visualize data effectively",
        "topics": ["Data cleaning", "Statistical analysis", "Data visualization", "Exploratory data analysis"],
        "lessons": [
          {
            "id": "lesson2_1",
            "title": "Data Cleaning Techniques",
            "duration": "2 hours",
            "type": "video"
          },
          {
            "id": "lesson2_2",
            "title": "Statistical Analysis with Python",
            "duration": "2 hours", 
            "type": "video"
          }
        ]
      },
      {
        "id": "week3",
        "weekTitle": "Machine Learning Fundamentals",
        "weekDescription": "Introduction to machine learning concepts and algorithms",
        "topics": ["Supervised learning", "Unsupervised learning", "Model evaluation", "Feature engineering"],
        "lessons": [
          {
            "id": "lesson3_1",
            "title": "Introduction to Machine Learning",
            "duration": "2 hours",
            "type": "video"
          },
          {
            "id": "lesson3_2",
            "title": "Linear Regression and Classification",
            "duration": "2.5 hours",
            "type": "video"
          }
        ]
      }
    ],
    "highlights": [
      "Live interactive sessions with industry experts",
      "Hands-on projects with real datasets",
      "Career guidance and placement support",
      "Industry-recognized certification",
      "Lifetime access to course materials"
    ],
    "learning_outcomes": [
      "Build end-to-end machine learning projects",
      "Deploy AI models in production environments",
      "Analyze complex datasets and derive insights",
      "Apply deep learning for computer vision and NLP",
      "Understand AI ethics and responsible development"
    ],
    "prerequisites": [
      "Basic programming knowledge (any language)",
      "High school level mathematics",
      "Eagerness to learn and practice"
    ],
    "faqs": [
      {
        "question": "Is this course suitable for beginners?",
        "answer": "Yes, we start with fundamentals and gradually progress to advanced topics. Basic programming knowledge is helpful but not mandatory."
      },
      {
        "question": "What kind of support do you provide?",
        "answer": "We provide 24/7 doubt resolution, one-on-one mentorship, career guidance, and placement assistance."
      },
      {
        "question": "Will I get a certificate?",
        "answer": "Yes, you'll receive an industry-recognized certificate upon successful completion of the course and projects."
      }
    ],
    "no_of_Sessions": 48,
    "isFree": false,
    "show_in_home": true,
    "tools_technologies": [
      "Python",
      "Jupyter Notebook",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "SQL"
    ],
    "course_videos": [],
    "resource_videos": [],
    "recorded_videos": [],
    "resource_pdfs": [],
    "course_modules": [],
    "bonus_modules": [],
    "related_courses": [],
    "subtitle_languages": ["English", "Hindi"],
    "final_evaluation": {
      "has_final_exam": true,
      "has_final_project": true,
      "final_project": {
        "evaluation_criteria": [
          "Code quality and documentation",
          "Problem-solving approach",
          "Model performance",
          "Presentation and communication"
        ]
      }
    },
    "certification": {
      "is_certified": true,
      "certification_criteria": {
        "min_assignments_score": 70,
        "min_quizzes_score": 75,
        "min_attendance": 80
      }
    },
    "doubt_session_schedule": {
      "frequency": "Weekly",
      "preferred_days": ["Saturday", "Sunday"],
      "preferred_time_slots": ["10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"]
    },
    "meta": {
      "ratings": {
        "average": 4.8,
        "count": 234
      },
      "views": 15420,
      "enrollments": 1247,
      "lastUpdated": "2024-01-15T10:30:00Z"
    },
    "prices": [
      {
        "currency": "INR",
        "individual": 49999,
        "batch": 39999,
        "min_batch_size": 5,
        "max_batch_size": 15,
        "early_bird_discount": 10,
        "group_discount": 15,
        "is_active": true,
        "_id": "price_inr_001"
      },
      {
        "currency": "USD",
        "individual": 599,
        "batch": 479,
        "min_batch_size": 5,
        "max_batch_size": 15,
        "early_bird_discount": 10,
        "group_discount": 15,
        "is_active": true,
        "_id": "price_usd_001"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "unique_key": "ai-data-science-master-2024",
    "slug": "ai-data-science-master-course",
    "_source": "medh-courses-api",
    "__v": 1
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    
    if (!courseId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Course ID is required" 
        },
        { status: 400 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const currency = searchParams.get('currency') || 'INR';
    const studentId = searchParams.get('studentId');

    // Fetch course data from database
    const courseData = await getCourseFromDatabase(courseId);
    
    if (!courseData) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Course not found" 
        },
        { status: 404 }
      );
    }

    // Filter prices by currency if specified
    let filteredCourse = { ...courseData };
    if (currency && courseData.prices) {
      const currencyPrices = courseData.prices.filter(
        price => price.currency.toLowerCase() === currency.toLowerCase()
      );
      if (currencyPrices.length > 0) {
        filteredCourse.prices = currencyPrices;
        // Update course_fee to match the currency
        filteredCourse.course_fee = currencyPrices[0].individual;
      }
    }

    return NextResponse.json({
      success: true,
      data: filteredCourse,
      source: "medh-courses-api"
    });

  } catch (error: any) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
} 