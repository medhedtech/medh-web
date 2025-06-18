"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import MyTable from "@/components/shared/common-table/page";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import Image from "next/image";

const formatDateTime = (dateTime) => {
  const dateObj = new Date(dateTime);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}  ${hours}:${minutes}`;
};

// Validation Schema
const schema = yup.object({
  full_name: yup.string().required("Instructor name is required"),
  email: yup.string().email().required("Instructor Email is required"),
  course_title: yup.string().required("Course name is required"),
  // course_type: yup.string().required("Course type is required"),
});

const AssignInstructor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { postQuery, loading: postLoading } = usePostQuery();
  const { getQuery, loading: getLoading } = useGetQuery();
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  // State Management
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [assignedInstructors, setAssignedInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [assignInstructorModal, setAssignInstructorModal] = useState({ open: false, assignmentId: null });

  // Dropdown States
  const courseDropdownRef = useRef(null);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const fullNameDropdownRef = useRef(null);
  const [fullNameDropdownOpen, setFullNameDropdownOpen] = useState(false);
  const [selectedFullName, setSelectedFullName] = useState("");
  const [searchTermFullName, setSearchTermFullName] = useState("");
  const emailDropdownRef = useRef(null);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [searchTermEmail, setSearchTermEmail] = useState("");
  
  // Sort and filter states
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterQuery, setFilterQuery] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Add a dedicated, more robust instructor loading function
  // This should be at the top of your component, just after your useState declarations

  // Special debugging function to log API URLs
  const logApiEndpoints = () => {
    console.log("Available API endpoints:", {
      instructor: {
        lowercase: apiUrls.instructors?.getAllInstructors,
        uppercase: apiUrls.Instructor?.getAllInstructors,
        directPath: apiUrls?.["instructors/getAllInstructors"] || apiUrls?.["Instructor/getAllInstructors"] 
      },
      alternateStructure: {
        instructors: apiUrls?.instructors,
        Instructor: apiUrls?.Instructor
      },
      completeApiUrls: apiUrls
    });
  };

  // Enhanced instructor loading that works across all components
  const loadInstructorsWithFallbacks = async () => {
    setPageLoading(true);
    
    // Log API endpoints for debugging
    logApiEndpoints();
    
    const loadingToastId = toast.loading("Loading instructors...");
    
    try {
      // List all possible instructor API paths we might try
      const possibleEndpoints = [
        apiUrls.instructors?.getAllInstructors,
        apiUrls.Instructor?.getAllInstructors,
        `${apiUrls.baseUrl}/instructors/getAllInstructors`,
        `${apiUrls.baseUrl}/Instructor/getAllInstructors`,
        apiUrls?.["instructors/getAllInstructors"],
        apiUrls?.["Instructor/getAllInstructors"]
      ].filter(Boolean); // Remove undefined/null values
      
      console.log("Trying instructor endpoints:", possibleEndpoints);
      
      if (possibleEndpoints.length === 0) {
        console.error("No valid instructor API endpoints found!");
        throw new Error("API configuration issue: No instructor endpoints available");
      }
      
      // Try each endpoint until one works
      let success = false;
      let instructorsData = [];
      
      for (const endpoint of possibleEndpoints) {
        if (success) break;
        
        try {
          console.log(`Attempting to fetch instructors from: ${endpoint}`);
          
          const response = await new Promise((resolve, reject) => {
            getQuery({
              url: endpoint,
              onSuccess: (data) => resolve(data),
              onFail: (err) => reject(err),
            });
          });
          
          console.log("Instructor API response:", response);
          
          // Handle various response formats
          if (Array.isArray(response)) {
            instructorsData = response;
            success = true;
          } else if (response?.data && Array.isArray(response.data)) {
            instructorsData = response.data;
            success = true;
          } else if (response?.instructors && Array.isArray(response.instructors)) {
            instructorsData = response.instructors;
            success = true;
          } else if (response?.results && Array.isArray(response.results)) {
            instructorsData = response.results;
            success = true;
          }
          
          if (success) {
            console.log(`Successfully loaded ${instructorsData.length} instructors from ${endpoint}`);
          }
        } catch (err) {
          console.warn(`Endpoint ${endpoint} failed:`, err);
          // Continue to next endpoint
        }
      }
      
      if (success) {
        setInstructors(instructorsData);
        toast.update(loadingToastId, {
          render: `${instructorsData.length} instructors loaded successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        // All endpoints failed
        throw new Error("All instructor API endpoints failed");
      }
    } catch (error) {
      console.error("Failed to load instructors:", error);
      toast.update(loadingToastId, {
        render: "Failed to load instructors. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      
      // Try alternative approach - direct fetch if available
      tryDirectInstructorFetch(loadingToastId);
    } finally {
      setPageLoading(false);
    }
  };

  // Direct fetch fallback as a last resort
  const tryDirectInstructorFetch = async (toastId) => {
    try {
      console.log("Attempting direct instructor fetch as fallback");
      
      // Create a fetch URL using common patterns
      const baseUrl = apiUrls.baseUrl || window.location.origin;
      const possibleUrls = [
        `${baseUrl}/api/instructors`,
        `${baseUrl}/api/Instructor`,
        `${baseUrl}/instructors`,
        `${baseUrl}/Instructor`
      ];
      
      for (const url of possibleUrls) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          
          const data = await response.json();
          console.log("Direct fetch response:", data);
          
          let instructorsData = [];
          if (Array.isArray(data)) {
            instructorsData = data;
          } else if (data?.data && Array.isArray(data.data)) {
            instructorsData = data.data;
          } else if (data?.instructors && Array.isArray(data.instructors)) {
            instructorsData = data.instructors;
          } else if (data?.results && Array.isArray(data.results)) {
            instructorsData = data.results;
          }
          
          if (instructorsData.length > 0) {
            setInstructors(instructorsData);
            
            toast.update(toastId, {
              render: `${instructorsData.length} instructors loaded with fallback method`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            
            return;
          }
        } catch (err) {
          console.warn(`Direct fetch to ${url} failed:`, err);
        }
      }
      
      // All attempts failed
      console.error("All instructor loading methods failed");
      setPageError("Could not load instructors. API might be unavailable.");
    } catch (finalError) {
      console.error("Fatal error in instructor loading:", finalError);
    }
  };

  // Replace the fetchInstructors function with our enhanced version
  const fetchInstructors = useCallback(async (retryCount = 0) => {
    try {
      await loadInstructorsWithFallbacks();
    } catch (error) {
      console.error("Instructor fetch failed completely:", error);
      if (retryCount < 2) {
        console.log(`Retrying instructor fetch (attempt ${retryCount + 1})...`);
        setTimeout(() => fetchInstructors(retryCount + 1), 2000);
      } else {
        setPageError("Failed to load instructors after multiple attempts");
      }
    }
  }, [getQuery]);

  // Enhanced fetch courses with retry mechanism
  const fetchCourses = useCallback(async (retryCount = 0) => {
    try {
      setPageLoading(true);
      const loadingToastId = toast.loading("Loading courses...");
      
      await getQuery({
        url: apiUrls?.courses?.getAllCourses,
        onSuccess: (response) => {
          let data = [];
          if (Array.isArray(response)) {
            data = response;
          } else if (response?.data && Array.isArray(response.data)) {
            data = response.data;
          }
          const validatedCourses = data.map(course => ({
            ...course,
            course_title: course.course_title || 'Untitled Course',
            course_duration: course.course_duration || 'Not specified',
            status: course.status || 'Upcoming',
            created_at: course.created_at || course.createdAt || new Date().toISOString(),
            _id: course._id || course.id
          }));
          setCoursesData(validatedCourses);
          setCourses(validatedCourses);
          
          const uniqueCategories = [...new Set(validatedCourses.map(course => course.course_category))].filter(Boolean);
          setCategories(uniqueCategories);
          
          toast.update(loadingToastId, {
            render: `${data.length} courses loaded successfully`,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        },
        onFail: (error) => {
          console.error("Error fetching courses:", error);
          
          if (retryCount < 3) {
            toast.update(loadingToastId, {
              render: `Retrying... (Attempt ${retryCount + 1}/3)`,
              type: "info",
              isLoading: true,
            });
            
            setTimeout(() => fetchCourses(retryCount + 1), 1000 * (retryCount + 1));
          } else {
            toast.update(loadingToastId, {
              render: "Failed to load courses",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        },
      });
    } catch (error) {
      console.error("Unexpected error fetching courses:", error);
      showToast.error("Error loading courses. Please refresh the page.");
    } finally {
      setPageLoading(false);
    }
  }, [getQuery]);

  // Enhanced fetch assigned instructors
  const fetchAssignedInstructors = useCallback(async (retryCount = 0) => {
    try {
      setPageLoading(true);
      const loadingToastId = toast.loading("Loading assigned instructors...");
      
      await getQuery({
        url: apiUrls?.assignedInstructors?.getAllAssignedInstructors,
        onSuccess: (response) => {
          let data = [];
          if (Array.isArray(response)) {
            data = response;
          } else if (response?.data && Array.isArray(response.data)) {
            data = response.data;
          }
          
          // Add count property for table numbering
          const dataWithCount = data.map((item, index) => ({
            ...item,
            count: index + 1
          }));
          
          setAssignedInstructors(dataWithCount);
          
          toast.update(loadingToastId, {
            render: `${data.length} instructor assignments loaded`,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        },
        onFail: (error) => {
          console.error("Error fetching assigned instructors:", error);
          
          if (retryCount < 3) {
            toast.update(loadingToastId, {
              render: `Retrying... (Attempt ${retryCount + 1}/3)`,
              type: "info",
              isLoading: true,
            });
            
            setTimeout(() => fetchAssignedInstructors(retryCount + 1), 1000 * (retryCount + 1));
          } else {
            toast.update(loadingToastId, {
              render: "Failed to load instructor assignments",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        },
      });
    } catch (error) {
      console.error("Unexpected error fetching assigned instructors:", error);
      showToast.error("Error loading assignments. Please refresh the page.");
    } finally {
      setPageLoading(false);
    }
  }, [getQuery]);

  useEffect(() => {
    // Log API structure on component mount to help debug
    logApiEndpoints();
    
    fetchInstructors();
    fetchCourses();
    fetchAssignedInstructors();
  }, [refreshKey]);

  // Enhanced form submission with better error handling
  const onSubmit = async (data) => {
    try {
      setPageLoading(true);
      const loadingToastId = toast.loading("Assigning instructor...");
      
      // Check if this assignment already exists
      const isDuplicate = assignedInstructors.some(
        assignment => assignment.email === data.email && assignment.course_title === data.course_title
      );
      
      if (isDuplicate) {
        toast.update(loadingToastId, {
          render: "This instructor is already assigned to this course",
          type: "warning",
          isLoading: false,
          autoClose: 4000,
        });
        setPageLoading(false);
        return;
      }
      
      await postQuery({
        url: apiUrls?.assignedInstructors?.createAssignedInstructor,
        postData: {
          full_name: data.full_name,
          email: data.email,
          course_title: data.course_title,
          user_id: data.user_id,
        },
        onSuccess: () => {
          toast.update(loadingToastId, {
            render: "Instructor assigned successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          reset();
          resetStates();
          setRefreshKey(prev => prev + 1);
        },
        onFail: (error) => {
          const errorMessage = error?.message || error?.response?.data?.message || "Error assigning instructor";
          toast.update(loadingToastId, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      showToast.error("An unexpected error occurred. Please try again.");
    } finally {
      setPageLoading(false);
    }
  };

  // Enhanced update handler with improved error handling
  const handleUpdateAssignedInstructor = async () => {
    if (!selectedInstructor || !instructorDetails) return;

    try {
      setPageLoading(true);
      const loadingToastId = toast.loading("Updating instructor assignment...");
      
      await postQuery({
        url: `${apiUrls?.assignedInstructors?.updateAssignedInstructor}/${selectedInstructor}`,
        postData: {
          full_name: instructorDetails.full_name,
          email: instructorDetails.email,
          course_title: instructorDetails.course_title,
        },
        onSuccess: () => {
          toast.update(loadingToastId, {
            render: "Instructor assignment updated successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          closeModal();
          setRefreshKey(prev => prev + 1);
        },
        onFail: (error) => {
          const errorMessage = error?.message || error?.response?.data?.message || "Error updating instructor assignment";
          toast.update(loadingToastId, {
            render: errorMessage,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        },
      });
    } catch (error) {
      console.error("Update submission error:", error);
      showToast.error("An unexpected error occurred during update. Please try again.");
    } finally {
      setPageLoading(false);
    }
  };

  // Add function to directly assign instructor to a course with id (from ListOfCourse.js)
  const assignInstructorDirectly = async (assignmentId, instructorId) => {
    if (!instructorId) {
      showToast.error("Please select an instructor");
      return;
    }
    
    const loadingToastId = toast.loading("Updating instructor assignment...");
    
    try {
      // Find the selected instructor and assignment details
      const instructor = instructors.find(i => i._id === instructorId);
      const assignment = assignedInstructors.find(a => a._id === assignmentId);
      
      if (!instructor || !assignment) {
        console.error("Missing data:", { 
          instructorFound: !!instructor, 
          assignmentFound: !!assignment,
          instructorId,
          assignmentId,
          instructorsCount: instructors.length,
          assignmentsCount: assignedInstructors.length 
        });
        
        toast.update(loadingToastId, {
          render: "Invalid instructor or assignment data",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
      
      console.log("Updating assignment with:", {
        instructorName: instructor.full_name,
        instructorEmail: instructor.email,
        courseTitle: assignment.course_title
      });
      
      await postQuery({
        url: `${apiUrls?.assignedInstructors?.updateAssignedInstructor}/${assignmentId}`,
        postData: {
          full_name: instructor.full_name,
          email: instructor.email,
          course_title: assignment.course_title,
          user_id: instructor._id
        },
        onSuccess: () => {
          toast.update(loadingToastId, {
            render: `${instructor.full_name} assigned successfully`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
          
          // Close modal and refresh data
          setAssignInstructorModal({ open: false, assignmentId: null });
          setRefreshKey(prev => prev + 1);
        },
        onFail: (error) => {
          console.error("Assignment update failed:", error);
          toast.update(loadingToastId, {
            render: `Failed to update assignment: ${error?.message || "Unknown error"}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
        }
      });
    } catch (err) {
      console.error("Error in assignInstructorDirectly:", err);
      toast.update(loadingToastId, {
        render: "An error occurred while updating assignment",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        courseDropdownRef.current &&
        !courseDropdownRef.current.contains(event.target)
      ) {
        setCourseDropdownOpen(false);
      }
      if (
        fullNameDropdownRef.current &&
        !fullNameDropdownRef.current.contains(event.target)
      ) {
        setFullNameDropdownOpen(false);
      }
      if (
        emailDropdownRef.current &&
        !emailDropdownRef.current.contains(event.target)
      ) {
        setEmailDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCourseDropdown = (e) => {
    e.preventDefault();
    setCourseDropdownOpen((prev) => !prev);
  };

  const selectCourse = (courseName) => {
    setSelectedCourse(courseName);
    setValue("course_title", courseName);
    setCourseDropdownOpen(false);
    setSearchTerm("");
  };

  const filteredCourses = (Array.isArray(courses) ? courses : []).filter((course) => 
    (course.course_title || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const toggleFullNameDropdown = (e) => {
    e.preventDefault();
    setFullNameDropdownOpen((prev) => !prev);
  };

  const selectInstructor = (fullName) => {
    setSelectedFullName(fullName);
    setValue("full_name", fullName);
    // Find the instructor by full name
    const instructor = instructors.find((ins) => ins.full_name === fullName);
    if (instructor) {
      setValue("email", instructor.email);
      setValue("user_id", instructor._id);
      setSelectedEmail(instructor.email);
    }
    setFullNameDropdownOpen(false);
    setSearchTermFullName("");
  };

  const filteredInstructors = instructors?.filter((ins) =>
    ins.full_name.toLowerCase().includes(searchTermFullName.toLowerCase())
  );

  const toggleEmailDropdown = (e) => {
    e.preventDefault();
    setEmailDropdownOpen((prev) => !prev);
  };

  const selectInstructorEmail = (email) => {
    setSelectedEmail(email);
    setValue("email", email);
    const selectedInstructor = instructors.find((ins) => ins.email === email);
    if (selectedInstructor) {
      setValue("user_id", selectedInstructor._id);
    }

    setEmailDropdownOpen(false);
    setSearchTermEmail("");
  };

  const filteredInstructorsEmail = instructors?.filter((ins) =>
    ins.email.toLowerCase().includes(searchTermEmail.toLowerCase())
  );

  const resetStates = () => {
    setIsModalOpen(false);
    setInstructorDetails(null);
    setSelectedInstructor(null);
    setCourseDropdownOpen(false);
    setSelectedCourse("");
    setSearchTerm("");
    setFullNameDropdownOpen(false);
    setSelectedFullName("");
    setSearchTermFullName("");
    setEmailDropdownOpen(false);
    setSelectedEmail("");
    setSearchTermEmail("");
  };

  const openModal = (row) => {
    setSelectedInstructor(row._id);
    fetchUpdatedInstructorDetails(row._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInstructorDetails(null);
    setSelectedInstructor(null);
  };

  const fetchUpdatedInstructorDetails = async (instructorId) => {
    try {
      const loadingToastId = toast.loading("Loading assignment details...");
      
      await getQuery({
        url: `${apiUrls?.assignedInstructors?.getAssignedInstructorById}/${instructorId}`,
        onSuccess: (data) => {
          setInstructorDetails(data.assignment);
          
          toast.update(loadingToastId, {
            render: "Assignment details loaded",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
        },
        onFail: (err) => {
          console.error("Error fetching assignment details:", err);
          
          toast.update(loadingToastId, {
            render: `Failed to fetch assignment details: ${
              err instanceof Error ? err.message : err
            }`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        },
      });
    } catch (error) {
      console.error("Error fetching instructor details:", error);
      showToast.error("Failed to load assignment details");
    }
  };

  // Sort function for table data
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter assignments based on search query
  const filteredAssignments = assignedInstructors.filter(assignment => {
    const searchLower = filterQuery.toLowerCase();
    return (
      (assignment.full_name || '').toLowerCase().includes(searchLower) ||
      (assignment.course_title || '').toLowerCase().includes(searchLower) ||
      (assignment.email || '').toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    // Basic sort logic
    if (!a[sortField] && !b[sortField]) return 0;
    if (!a[sortField]) return 1;
    if (!b[sortField]) return -1;
    
    let comparison = 0;
    if (typeof a[sortField] === 'string') {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else if (typeof a[sortField] === 'number') {
      comparison = a[sortField] - b[sortField];
    } else if (a[sortField] instanceof Date && b[sortField] instanceof Date) {
      comparison = a[sortField] - b[sortField];
    } else {
      // Try to convert to string for comparison
      comparison = String(a[sortField]).localeCompare(String(b[sortField]));
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Replace the AssignInstructorModal function with an enhanced version
  const AssignInstructorModal = () => {
    const [selectedInstructorId, setSelectedInstructorId] = useState("");
    const [loadingInstructors, setLoadingInstructors] = useState(false);
    const [modalInstructors, setModalInstructors] = useState([]);
    const assignment = assignedInstructors.find(a => a._id === assignInstructorModal.assignmentId);
    
    // Enhanced function to load instructors specifically for the modal
    const loadInstructorsForModal = async () => {
      // If we already have instructors in the main component, use those
      if (instructors.length > 0) {
        console.log("Using pre-loaded instructors:", instructors.length);
        setModalInstructors(instructors);
        return;
      }
      
      setLoadingInstructors(true);
      const loadingToastId = toast.loading("Loading instructors...");
      
      try {
        // Try all possible endpoints directly within the modal
        const possibleEndpoints = [
          apiUrls.instructors?.getAllInstructors,
          apiUrls.Instructor?.getAllInstructors,
          `${apiUrls.baseUrl || ""}/api/instructors`,
          `${apiUrls.baseUrl || ""}/api/Instructor`,
        ].filter(Boolean);
        
        console.log("Modal trying instructor endpoints:", possibleEndpoints);
        
        let success = false;
        let instructorsData = [];
        
        for (const endpoint of possibleEndpoints) {
          if (success) break;
          
          try {
            console.log(`Modal attempting to fetch from: ${endpoint}`);
            
            const response = await new Promise((resolve, reject) => {
              getQuery({
                url: endpoint,
                onSuccess: (data) => resolve(data),
                onFail: (err) => reject(err),
              });
            });
            
            // Handle various response formats
            if (Array.isArray(response)) {
              instructorsData = response;
              success = true;
            } else if (response?.data && Array.isArray(response.data)) {
              instructorsData = response.data;
              success = true;
            } else if (response?.instructors && Array.isArray(response.instructors)) {
              instructorsData = response.instructors;
              success = true;
            }
            
            if (success) {
              console.log(`Modal successfully loaded ${instructorsData.length} instructors`);
              setModalInstructors(instructorsData);
              // Also update the main instructors state
              setInstructors(instructorsData);
              
              toast.update(loadingToastId, {
                render: `${instructorsData.length} instructors loaded`,
                type: "success",
                isLoading: false,
                autoClose: 1000,
              });
            }
          } catch (err) {
            console.warn(`Modal endpoint ${endpoint} failed:`, err);
          }
        }
        
        if (!success) {
          throw new Error("All instructor endpoints failed in modal");
        }
      } catch (error) {
        console.error("Failed to load instructors in modal:", error);
        toast.update(loadingToastId, {
          render: "Failed to load instructors. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } finally {
        setLoadingInstructors(false);
      }
    };
    
    // Load instructors when modal opens
    useEffect(() => {
      loadInstructorsForModal();
    }, []);
    
    // Display the instructor list
    const displayInstructors = modalInstructors.length > 0 ? modalInstructors : instructors;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Update Instructor Assignment</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Select a new instructor for course: <span className="font-medium text-green-600">{assignment?.course_title}</span>
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Instructor {displayInstructors.length > 0 ? `(${displayInstructors.length} available)` : ''}
            </label>
            {loadingInstructors ? (
              <div className="flex justify-center items-center h-10">
                <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                {displayInstructors.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-2">No instructors found</p>
                    <button
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                      onClick={loadInstructorsForModal}
                    >
                      Refresh Instructors
                    </button>
                  </div>
                ) : (
                  <select
                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedInstructorId}
                    onChange={(e) => setSelectedInstructorId(e.target.value)}
                  >
                    <option value="">Select an Instructor</option>
                    {displayInstructors.map(instructor => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.full_name} {instructor.expertise ? `- ${instructor.expertise}` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300"
              onClick={() => setAssignInstructorModal({ open: false, assignmentId: null })}
            >
              Cancel
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-white ${
                !selectedInstructorId ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              onClick={() => assignInstructorDirectly(assignInstructorModal.assignmentId, selectedInstructorId)}
              disabled={!selectedInstructorId}
            >
              Update Assignment
            </button>
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      Header: "No.",
      accessor: "count",
    },
    { Header: "Name", accessor: "full_name" },
    { Header: "Course", accessor: "course_title" },
    {
      Header: "Date & Time",
      accessor: "createdAt",
      render: (row) => formatDateTime(row?.createdAt),
    },
    // { Header: "Type", accessor: "course_type" },
    {
      Header: "Action",
      accessor: "actions",
      render: (row) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => openModal(row)}
            className="text-[#7ECA9D] border border-[#7ECA9D] rounded-md px-[10px] py-1 hover:bg-green-50 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => setAssignInstructorModal({ open: true, assignmentId: row._id })}
            className="text-blue-600 border border-blue-600 rounded-md px-[10px] py-1 hover:bg-blue-50 transition-colors"
          >
            Update
          </button>
        </div>
      ),
    },
  ];

  if (pageLoading || postLoading || getLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen font-Poppins dark:bg-inherit bg-gray-100 p-4 md:p-6 pt-16 md:pt-24">
      <div className="container max-w-6xl w-full mx-auto space-y-6">
        {pageError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{pageError}</p>
            <button
              onClick={() => {
                setPageError(null);
                setRefreshKey(prev => prev + 1);
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white dark:bg-inherit dark:border dark:text-white rounded-xl shadow-lg">
            {/* Form Header */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">Assign Instructor</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>{instructors.length} Instructors</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>{courses.length} Courses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instructor Full Name */}
                <div className="relative" ref={fullNameDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400">
                    <button
                      className="w-full text-left"
                      onClick={toggleFullNameDropdown}
                    >
                      {selectedFullName || "Select Instructor"}
                    </button>
                    {fullNameDropdownOpen && (
                      <div className="absolute z-10 left-0 top-20 bg-white border border-gray-400 rounded-lg w-full shadow-xl">
                        <input
                          type="text"
                          className="w-full p-2 border-b focus:outline-none rounded-lg"
                          placeholder="Search..."
                          value={searchTermFullName}
                          onChange={(e) => setSearchTermFullName(e.target.value)}
                        />
                        <ul className="max-h-56 overflow-auto">
                          {filteredInstructors.length > 0 ? (
                            filteredInstructors.map((ins) => (
                              <li
                                key={ins._id}
                                className="hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 px-3 py-3"
                                onClick={() => {
                                  selectInstructor(ins.full_name);
                                }}
                              >
                                {ins.instructor_image ? (
                                  <Image
                                    src={ins.instructor_image}
                                    alt={ins.full_name || "Instructor Full Name"}
                                    width={32}
                                    height={32}
                                    className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8"
                                  />
                                ) : (
                                  <div className="rounded-full w-8 h-8 bg-customGreen flex items-center justify-center font-bold">
                                    {ins.full_name?.substring(0, 1).toUpperCase()}
                                  </div>
                                )}
                                <span>
                                  {ins.full_name || "No name available"}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="p-2 text-gray-500">
                              No instructors found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.full_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="relative" ref={emailDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400">
                    <button
                      className="w-full text-left"
                      onClick={toggleEmailDropdown}
                    >
                      {selectedEmail || "Select Email"}
                    </button>
                    {emailDropdownOpen && (
                      <div className="absolute z-10 left-0 top-20 bg-white border border-gray-400 rounded-lg w-full shadow-xl">
                        <input
                          type="text"
                          className="w-full p-2 border-b focus:outline-none rounded-lg"
                          placeholder="Search..."
                          value={searchTermEmail}
                          onChange={(e) => setSearchTermEmail(e.target.value)}
                        />
                        <ul className="max-h-56 overflow-auto">
                          {filteredInstructorsEmail.length > 0 ? (
                            filteredInstructorsEmail.map((ins) => (
                              <li
                                key={ins._id}
                                className="hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 px-3 py-3"
                                onClick={() => {
                                  selectInstructorEmail(ins.email);
                                }}
                              >
                                {ins.instructor_image ? (
                                  <Image
                                    src={ins.instructor_image}
                                    alt={ins.email || "Instructor Email"}
                                    width={32}
                                    height={32}
                                    className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8"
                                  />
                                ) : (
                                  <div className="rounded-full w-8 h-8 bg-customGreen flex items-center justify-center font-bold">
                                    {ins.email?.substring(0, 1).toUpperCase()}
                                  </div>
                                )}
                                <span>{ins.email || "No email available"}</span>
                              </li>
                            ))
                          ) : (
                            <li className="p-2 text-gray-500">No email found</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative" ref={courseDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full border border-gray-300 dark:bg-inherit rounded-md py-2 px-3 pr-3 focus:outline-none focus:ring-2 focus:ring-green-400">
                    <button
                      className="w-full text-left"
                      onClick={toggleCourseDropdown}
                    >
                      {selectedCourse || "Select Course"}
                    </button>
                    {courseDropdownOpen && (
                      <div className="absolute z-10 left-0 top-20 bg-white border border-gray-400 rounded-lg w-full shadow-xl">
                        <input
                          type="text"
                          className="w-full p-2 border-b focus:outline-none rounded-lg"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ul className="max-h-56 overflow-auto">
                          {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                              <li
                                key={course._id}
                                className="hover:bg-gray-100 rounded-lg cursor-pointer flex items-center gap-3 px-3 py-3"
                                onClick={() => {
                                  selectCourse(course.course_title);
                                }}
                              >
                                {course.course_image ? (
                                  <Image
                                    src={course.course_image}
                                    alt={course.course_title || "Course Image"}
                                    width={32}
                                    height={32}
                                    className="rounded-full min-h-8 max-h-8 min-w-8 max-w-8"
                                  />
                                ) : (
                                  <div className="rounded-full w-8 h-8 bg-customGreen"></div>
                                )}
                                <span>
                                  {course.course_title || "No title available"}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="p-2 text-gray-500">
                              No courses found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.course_title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.course_title.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    resetStates();
                  }}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <span>Assign Instructor</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Table Section */}
        <div className="bg-white dark:bg-inherit dark:border dark:text-white rounded-xl shadow-lg">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Assigned Instructors</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    className="py-2 px-4 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {filteredAssignments.length} Total Assignments
                </span>
                <button
                  onClick={() => fetchInstructors()}
                  className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  Refresh Instructors
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-hidden rounded-lg border dark:border-gray-700">
              <MyTable 
                columns={columns} 
                data={filteredAssignments}
                isLoading={pageLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal with adjusted padding */}
      {isModalOpen && instructorDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl transform transition-all duration-200">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold">
                Edit Assigned Instructor
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Full Name
                  </label>
                  <select
                    value={instructorDetails.full_name || ""}
                    disabled
                    onChange={(e) =>
                      setInstructorDetails({
                        ...instructorDetails,
                        full_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor._id} value={instructor.full_name}>
                        {instructor.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Course Name
                  </label>
                  <select
                    value={instructorDetails.course_title || ""}
                    onChange={(e) =>
                      setInstructorDetails({
                        ...instructorDetails,
                        course_title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course.course_title}>
                        {course.course_title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={instructorDetails.email || ""}
                    disabled
                    onChange={(e) =>
                      setInstructorDetails({
                        ...instructorDetails,
                        email: e.target.value,
                      })
                    }
                    placeholder="Instructor Email"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t dark:border-gray-700">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAssignedInstructor}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Instructor Assignment Modal */}
      {assignInstructorModal.open && <AssignInstructorModal />}
    </div>
  );
};

export default AssignInstructor;
