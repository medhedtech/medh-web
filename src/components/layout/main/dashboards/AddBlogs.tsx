"use client";
import React, { useEffect, useState, useRef } from "react";
import usePostQuery from "@/hooks/postQuery.hook";
import { useForm } from "react-hook-form";
import { apiUrls } from "@/apis";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import useGetQuery from "@/hooks/getQuery.hook";
import { useUpload } from "@/hooks/useUpload";
import Preloader from "@/components/shared/others/Preloader";
import AdminBlogs from "./AdminBlogs";
import Select, { MultiValue, ActionMeta } from 'react-select';
import { motion } from 'framer-motion';
import { Sparkles, Upload, Tag, Link as LinkIcon, Layout, Type, FileText } from 'lucide-react';
import NoSSRQuill from "@/components/shared/editors/NoSSRQuill";
import dynamic from "next/dynamic";

// Define local helpers to avoid import issues
/**
 * Converts a string to a URL-friendly slug
 */
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

// Dynamic import of the rich text editor to avoid SSR issues with modern React 18 compatibility
const ReactQuill = dynamic(() => 
  import('react-quill'), { 
    ssr: false,
    loading: () => <div className="h-[300px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">Loading editor...</div>
  }
);

// Simplified approach - use a null renderer when SSR and lazy load the actual component
const QuillEditor = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return function QuillNoSSR(props: any) {
      return <RQ {...props} />;
    }
  },
  {
    ssr: false,
    loading: () => <div className="h-[300px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">Loading editor...</div>
  }
);
import 'react-quill/dist/quill.snow.css';

interface Category {
  value: string;
  label: string;
}

interface BlogImage {
  url: string;
  key: string;
  bucket?: string;
}

interface BlogFormData {
  title: string;
  description: string;
  blog_link: string | null;
  upload_image: string;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}

// Validation Schema
const schema = yup.object({
  title: yup.string()
    .required("Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: yup.string()
    .required("Description is required"),
  blog_link: yup.string()
    .transform((value) => value?.trim() || null)
    .url("Please enter a valid URL")
    .nullable(),
  upload_image: yup.string()
    .required("Blog image is required"),
  meta_title: yup.string()
    .max(60, "Meta title must be less than 60 characters"),
  meta_description: yup.string()
    .max(160, "Meta description must be less than 160 characters"),
  status: yup.string()
    .oneOf(['draft', 'published', 'archived'], "Invalid status")
    .default('published'),
  featured: yup.boolean()
    .default(false)
}).required();

const AddBlog: React.FC = () => {
  const { postQuery, loading: postLoading } = usePostQuery();
  const { getQuery, loading: getLoading } = useGetQuery();
  const { isUploading, uploadBase64 } = useUpload({
    onSuccess: (response) => {
      try {
        // Handle different response formats
        let cleanData: BlogImage;
        
        if (typeof response.data === 'string') {
          // If response.data is a direct URL string
          const dataString = response.data as string;
          cleanData = {
            url: dataString,
            key: dataString.split('/').pop() || ''
          };
        } else if (response.data && typeof response.data === 'object') {
          // If response.data is an object, handle possible string formats
          cleanData = {
            url: typeof response.data.url === 'string' 
              ? response.data.url.replace(/^"|"$/g, '') // Remove surrounding quotes if present
              : response.data.url,
            key: typeof response.data.key === 'string'
              ? response.data.key.replace(/^"|"$/g, '')
              : response.data.key,
            bucket: typeof response.data.bucket === 'string'
              ? response.data.bucket.replace(/^"|"$/g, '')
              : response.data.bucket
          };
        } else {
          throw new Error('Invalid response format');
        }

        console.log('Cleaned image data:', cleanData); // Debug log
        setBlogImage(cleanData);
        setValue("upload_image", cleanData.url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error('Error processing upload response:', error, response);
        toast.error("Error processing uploaded image. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Upload error details:", error);
      toast.error(error?.message || "Image upload failed. Please try again.");
    },
    showToast: false
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<string>('');
  const [blogImage, setBlogImage] = useState<BlogImage | null>(null);
  const [showAddBlogListing, setShowAddBlogListing] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [editorMounted, setEditorMounted] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BlogFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: '',
      description: '',
      blog_link: null,
      upload_image: '',
      meta_title: '',
      meta_description: '',
      status: 'published',
      featured: false
    }
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        
        if (!token) {
          toast.error("Please log in to create blogs");
          // Optionally redirect to login
        }
      }
    };
    
    checkAuth();
  }, []);

  // Suppress console warnings for editor when mounted
  useEffect(() => {
    if (editorMounted && typeof window !== 'undefined') {
      const originalWarn = console.warn;
      console.warn = function filteredWarn(...args) {
        if (typeof args[0] === 'string' && args[0].includes('DOMNodeInserted')) {
          return;
        }
        return originalWarn.apply(console, args);
      };
      
      return () => {
        console.warn = originalWarn;
      };
    }
  }, [editorMounted]);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    }
  };

  // Fetch categories only
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      // Fetch categories
      try {
        const categoryResponse = await getQuery({
          url: apiUrls?.categories?.getAllCategories
        });
        
        if (categoryResponse?.success && Array.isArray(categoryResponse.data)) {
          const formattedCategories = categoryResponse.data.map(cat => ({
            value: cat._id,
            label: cat.category_name || cat.name // fallback to name if category_name doesn't exist
          }));
          
          setCategories(formattedCategories);
        } else {
          console.warn("Invalid categories data format:", categoryResponse);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchData();
  }, [getQuery, isAuthenticated]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const requiredWidth = 1200;
    const requiredHeight = 630;
    const maxSizeInMB = 5;

    if (file) {
      try {
        // Check file size first
        if (file.size > maxSizeInMB * 1024 * 1024) {
          throw new Error(`File size must be less than ${maxSizeInMB}MB`);
        }

        // Create a compressed version of the image
        const compressedFile = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = requiredWidth;
              canvas.height = requiredHeight;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to create canvas context'));
                return;
              }
              ctx.drawImage(img, 0, 0, requiredWidth, requiredHeight);
              resolve(canvas.toDataURL('image/jpeg', 0.75)); // Compress to JPEG with 75% quality
            };
            img.onerror = () => reject(new Error('Failed to load image for compression'));
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
        });

        // Extract base64 string and upload
        const base64String = compressedFile.split(',')[1];
        await uploadBase64(base64String, "image");

      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(error instanceof Error ? error.message : "An unexpected error occurred while uploading the image.");
      }
    }
  };

  const handleTagsChange = (inputValue: string) => {
    const newTags = inputValue.split(',').map(tag => tag.trim()).filter(Boolean);
    setTags(newTags);
  };

  const handleCategoriesChange = (
    newValue: MultiValue<Category>,
    actionMeta: ActionMeta<Category>
  ) => {
    setSelectedCategories(newValue as Category[]);
  };

  const onSubmit = async (data: BlogFormData) => {
    if (content.length < 100) {
      toast.error("Content is too short. Please add more content to your blog.");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      
      if (!token || !userId) {
        toast.error("Please login to create a blog");
        return;
      }

      // Create a slug from the title
      const slug = slugify(data.title);

      const postData = {
        ...data,
        content,
        categories: selectedCategories.map(cat => cat.value),
        tags,
        upload_image: blogImage?.url || data.upload_image,
        author: userId,
        slug,
      };

      await postQuery({
        url: apiUrls?.Blogs?.createBlog,
        postData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-access-token': token
        },
        onSuccess: () => {
          toast.success("Blog added successfully!");
          reset();
          setContent('');
          setTags([]);
          setSelectedCategories([]);
          setBlogImage(null);
          setShowAddBlogListing(true);
        },
        onFail: (error) => {
          console.error("Blog creation error:", error);
          if (error?.response?.status === 401) {
            toast.error("Authentication failed. Please login again.");
          } else {
            toast.error(error?.response?.data?.message || "Error adding blog.");
          }
        },
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
        <div className="text-center max-w-md p-8 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
          <FileText className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6 text-gray-300">You need to be logged in to create and manage blogs.</p>
          <a 
            href="/auth/login" 
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all font-medium"
          >
            Login Now
          </a>
        </div>
      </div>
    );
  }

  if (showAddBlogListing) {
    return <AdminBlogs />;
  }

  if (postLoading || isUploading || getLoading) {
    return <Preloader />;
  }

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      padding: '4px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.4)' : 'none',
      '&:hover': {
        border: '1px solid rgba(99, 102, 241, 0.4)'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '1rem',
      overflow: 'hidden'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'rgba(99, 102, 241, 0.9)'
        : state.isFocused 
          ? 'rgba(99, 102, 241, 0.1)'
          : 'transparent',
      color: state.isSelected ? 'white' : 'inherit',
      cursor: 'pointer'
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderRadius: '0.5rem'
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 pt-9">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-primary-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Create New Blog
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title and Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all placeholder:text-gray-500"
                    placeholder="Enter an engaging title..."
                  />
                </div>
                {errors.title && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm mt-2 flex items-center gap-2"
                  >
                    {errors.title.message}
                  </motion.span>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <select
                    {...register("status")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("featured")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/5 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                    <span className="ml-3 text-sm font-medium">Featured</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description Field */}
            <div className="relative">
              <Layout className="absolute left-3 top-4 text-gray-400" size={20} />
              <textarea
                {...register("description")}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all placeholder:text-gray-500"
                placeholder="Write a compelling description..."
              />
              {errors.description && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-2"
                >
                  {errors.description.message}
                </motion.span>
              )}
            </div>

            {/* Categories, Tags, and Course */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Categories <span className="text-red-400">*</span></label>
                <Select
                  isMulti
                  options={categories}
                  value={selectedCategories}
                  onChange={handleCategoriesChange}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select categories..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all placeholder:text-gray-500"
                    placeholder="Enter tags separated by commas..."
                  />
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Blog Content <span className="text-red-400">*</span></label>
              <div className="prose-editor-container rounded-xl overflow-hidden border border-white/10">
                <NoSSRQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => {
                    setContent(value);
                    if (!editorMounted) setEditorMounted(true);
                  }}
                  modules={modules}
                  className="bg-white/5 min-h-[300px] text-white"
                  placeholder="Start writing your blog content here..."
                  preserveWhitespace={true}
                  onFocus={() => setEditorMounted(true)}
                  forwardedRef={editorRef}
                />
              </div>
              {content.length < 100 && (
                <p className="text-orange-400 text-sm mt-2">Content is too short. Add more details to make your blog valuable.</p>
              )}
            </div>

            {/* Blog Link */}
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="url"
                {...register("blog_link")}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all placeholder:text-gray-500"
                placeholder="External blog link (optional)"
              />
              {errors.blog_link && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-sm mt-2 flex items-center gap-2"
                >
                  {errors.blog_link.message}
                </motion.span>
              )}
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">SEO Meta Title</label>
                <input
                  type="text"
                  {...register("meta_title")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all placeholder:text-gray-500"
                  placeholder="SEO Meta Title (defaults to regular title if empty)"
                />
                {errors.meta_title && (
                  <motion.span className="text-red-400 text-sm mt-2">{errors.meta_title.message}</motion.span>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">SEO Meta Description</label>
                <textarea
                  {...register("meta_description")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all placeholder:text-gray-500"
                  placeholder="SEO Meta Description (defaults to regular description if empty)"
                  rows={2}
                />
                {errors.meta_description && (
                  <motion.span className="text-red-400 text-sm mt-2">{errors.meta_description.message}</motion.span>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <p className="text-sm text-gray-300 mb-3">
                Blog Image <span className="text-red-400">*</span>
                <span className="text-gray-400 ml-2">(1200x630 pixels recommended for social sharing)</span>
              </p>
              <div className="relative group">
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center transition-all group-hover:border-primary-400/50 bg-white/5">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                  {blogImage ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full max-w-md h-48 mb-4">
                        <img 
                          src={blogImage.url} 
                          alt="Blog preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-gray-300">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-4 group-hover:text-primary-400 transition-colors" />
                      <p className="text-lg font-medium text-gray-300 group-hover:text-primary-400 transition-colors">
                        Drop your image here, or click to browse
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Supports: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {errors.upload_image && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 block"
                >
                  {errors.upload_image.message}
                </motion.span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowAddBlogListing(true)}
                className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all font-medium"
              >
                Publish Blog
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      <style jsx global>{`
        .prose-editor-container .ql-toolbar {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
        
        .prose-editor-container .ql-container {
          border-color: rgba(255, 255, 255, 0.1);
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
        }

        .prose-editor-container .ql-editor {
          min-height: 300px;
          color: white;
        }

        .prose-editor-container .ql-toolbar button,
        .prose-editor-container .ql-toolbar .ql-picker {
          filter: invert(1);
        }
        
        .prose-editor-container .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.4);
          font-style: normal;
        }
        
        .prose-editor-container .ql-formats {
          margin-right: 12px;
        }
      `}</style>
    </div>
  );
};

export default AddBlog;

