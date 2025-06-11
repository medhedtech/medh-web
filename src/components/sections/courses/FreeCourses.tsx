'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ChevronDown, Star, Clock, Users, BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ICourse {
  _id: string;
  title: string;
  description: string;
  courseImage: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolledStudents: number;
  tags: string[];
  price: number;
  originalPrice?: number;
  isFree: boolean;
}

const FreeCourses: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Mock data for free courses
  const mockFreeCourses: ICourse[] = [
    {
      _id: '1',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript to start your web development journey.',
      courseImage: '/images/courses/web-dev-intro.jpg',
      instructor: {
        name: 'John Smith',
        avatar: '/images/instructors/john-smith.jpg'
      },
      duration: '4 weeks',
      level: 'Beginner',
      rating: 4.8,
      enrolledStudents: 1250,
      tags: ['HTML', 'CSS', 'JavaScript'],
      price: 0,
      originalPrice: 999,
      isFree: true
    },
    {
      _id: '2',
      title: 'Python Programming Fundamentals',
      description: 'Master the fundamentals of Python programming with hands-on projects and exercises.',
      courseImage: '/images/courses/python-basics.jpg',
      instructor: {
        name: 'Sarah Johnson',
        avatar: '/images/instructors/sarah-johnson.jpg'
      },
      duration: '6 weeks',
      level: 'Beginner',
      rating: 4.9,
      enrolledStudents: 980,
      tags: ['Python', 'Programming', 'Basics'],
      price: 0,
      originalPrice: 1299,
      isFree: true
    },
    {
      _id: '3',
      title: 'Digital Marketing Essentials',
      description: 'Understand the core concepts of digital marketing including SEO, social media, and analytics.',
      courseImage: '/images/courses/digital-marketing.jpg',
      instructor: {
        name: 'Mike Wilson',
        avatar: '/images/instructors/mike-wilson.jpg'
      },
      duration: '3 weeks',
      level: 'Beginner',
      rating: 4.7,
      enrolledStudents: 756,
      tags: ['Marketing', 'SEO', 'Social Media'],
      price: 0,
      originalPrice: 799,
      isFree: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchFreeCourses = async () => {
      setLoading(true);
      // In real implementation, this would be an API call
      setTimeout(() => {
        setCourses(mockFreeCourses);
        setFilteredCourses(mockFreeCourses);
        setLoading(false);
      }, 1000);
    };

    fetchFreeCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level.toLowerCase() === selectedLevel);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedLevel, courses]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const CourseCard: React.FC<{ course: ICourse }> = ({ course }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Image
          src={course.courseImage}
          alt={course.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            FREE
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <button className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors">
            <BookOpen className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(course.rating)}</div>
          <span className="text-sm text-gray-600">({course.enrolledStudents})</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolledStudents}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image
              src={course.instructor.avatar || '/images/default-avatar.jpg'}
              alt={course.instructor.name}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{course.instructor.name}</span>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {course.level}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-green-600">FREE</span>
            {course.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{course.originalPrice}
              </span>
            )}
          </div>
          <Link href={`/course/${course._id}`}>
            <Button className="bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              Start Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading free courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Free Courses
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Start your learning journey with our collection of high-quality free courses
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search free courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">Filter by:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <p className="text-sm text-gray-600">
              {filteredCourses.length} free course{filteredCourses.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready for More Advanced Courses?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Explore our premium courses for in-depth learning and certification
            </p>
            <Link href="/courses">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FreeCourses; 