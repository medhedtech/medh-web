"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllCoursesWithLimits } from '@/apis/course/course';
import { ICourseSearchParams } from '@/apis/index';

interface ISearchResult {
  id: string;
  title: string;
  description?: string;
  price: number;
  rating?: number;
  instructor?: string;
}

interface ISearchSuggestion {
  id: string;
  title: string;
  category?: string;
}

const NavbarSearch = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const fetchResults = async (searchTerm: string): Promise<void> => {
    try {
      const params: ICourseSearchParams = {
        page: 1,
        limit: 10,
        search: searchTerm,
        skill_level: 'beginner',
        course_fee: { min: 0, max: 100 },
        sort_by: 'createdAt',
        sort_order: 'desc',
        status: 'Published'
      };
      
      const url = getAllCoursesWithLimits(params);
      const response = await axios.get<ISearchResult[]>(url);
      // Handle response
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchSuggestions = async (query: string): Promise<ISearchSuggestion[]> => {
    try {
      // Direct API call for suggestions
      const response = await axios.get<ISearchSuggestion[]>(
        `/api/v1/courses/search-suggestions?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  return (
    <input
      suppressHydrationWarning
      type="text"
      placeholder="Search courses..."
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default NavbarSearch; 