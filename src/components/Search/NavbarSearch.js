"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

const NavbarSearch = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const fetchResults = async (searchTerm) => {
    const url = apiUrls.courses.getAllCoursesWithLimits(1, 10, {
      search: searchTerm,
      difficulty: 'beginner',
      minPrice: 0,
      maxPrice: 100,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
    
    const response = await axios.get(`${apiBaseUrl}${url}`);
    // Handle response
  };

  const fetchSuggestions = async (query) => {
    const response = await axios.get(
      `${apiBaseUrl}${apiUrls.courses.searchSuggestions(query)}`
    );
    return response.data;
  };

  return (
    <input
      suppressHydrationWarning
    />
  );
};

export default NavbarSearch; 