"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  X, 
  Bot, 
  Wand2, 
  Loader2, 
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Upload,
  Type,
  Layout,
  Tag,
  Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import usePutQuery from "@/hooks/putQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import { useUpload } from "@/hooks/useUpload";
import { apiUrls, aiUtils, IAIBlogEnhanceInput, IAIBlogGenerateContentInput } from "@/apis";
import MDEditor from '@uiw/react-md-editor';
import Select, { MultiValue } from 'react-select';

interface IBlogData {
  _id: string;
  title: string;
  description: string;
  content: string;
  upload_image: string;
  meta_title?: string;
  meta_description?: string;
  blog_link?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  categories: Array<{ _id: string; category_name: string; }>;
  tags: string[];
  slug: string;
}

interface ICategory {
  value: string;
  label: string;
}

interface IEditBlogProps {
  blog: IBlogData;
  onCancel: () => void;
  onSave: (updatedBlog: IBlogData) => void;
}

const schema = yup.object({
  title: yup.string().required("Title is required").max(200, "Title too long"),
  description: yup.string().required("Description is required"),
  blog_link: yup.string().url("Invalid URL").nullable().optional(),
  upload_image: yup.string().required("Image is required"),
  meta_title: yup.string().max(60, "Meta title too long").optional(),
  meta_description: yup.string().max(160, "Meta description too long").optional(),
  status: yup.string().oneOf(['draft', 'published', 'archived']).default('published'),
  featured: yup.boolean().default(false)
});

const EditBlog: React.FC<IEditBlogProps> = ({ blog, onCancel, onSave }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { putQuery, loading: putLoading } = usePutQuery();
  const { getQuery } = useGetQuery();
  const { isUploading, uploadBase64 } = useUpload({
    onSuccess: (response: any) => {
      const imageUrl = typeof response.data === 'string' ? response.data : response.data?.url;
      setValue("upload_image", imageUrl);
      showToast.success("Image updated successfully!");
    },
    onError: (error) => showToast.error("Image upload failed"),
    showToast: false
  });

  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isRegeneratingContent, setIsRegeneratingContent] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [targetWordCount, setTargetWordCount] = useState(1500);
  const [generatedContentHistory, setGeneratedContentHistory] = useState<string[]>([]);
  const [aiServiceAvailable, setAiServiceAvailable] = useState<boolean | null>(null);

  const isDark = mounted ? theme === 'dark' : true;

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: '',
      description: '',
      blog_link: '',
      upload_image: '',
      meta_title: '',
      meta_description: '',
      status: 'published' as 'draft' | 'published' | 'archived',
      featured: false
    }
  });

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  // Initialize blog data when component mounts or blog prop changes
  useEffect(() => {
    if (blog && mounted) {
      console.log('Initializing blog data:', blog);
      setContent(blog.content || '');
      setSelectedCategories(
        blog.categories?.map(cat => ({ value: cat._id, label: cat.category_name })) || []
      );
      setTags(blog.tags || []);
      
      // Reset form with blog data
      setValue("title", blog.title);
      setValue("description", blog.description);
      setValue("blog_link", blog.blog_link || '');
      setValue("upload_image", blog.upload_image);
      setValue("meta_title", blog.meta_title || '');
      setValue("meta_description", blog.meta_description || '');
      setValue("status", blog.status as 'draft' | 'published' | 'archived');
      setValue("featured", blog.featured);
      
      setEditorReady(true);
      setEditorKey(prev => prev + 1); // Force editor refresh on blog load
    }
  }, [blog, mounted, setValue]);

  // Watch for content changes and log them
  useEffect(() => {
    console.log('Content state changed to:', content.length, 'characters');
  }, [content]);

  // Check AI service availability
  const checkAIServiceHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(apiUrls.ai.getSystemHealth, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.ok;
    } catch (error) {
      console.warn('AI Service health check failed:', error);
      return false;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getQuery({ url: apiUrls?.categories?.getAllCategories });
      if (response?.success && Array.isArray(response.data)) {
        setCategories(response.data.map((cat: any) => ({
          value: cat._id,
          label: cat.category_name || cat.name
        })));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, [getQuery]);

  // Check AI service health when AI Helper is opened
  useEffect(() => {
    if (showAIHelper && aiServiceAvailable === null) {
      checkAIServiceHealth().then(setAiServiceAvailable);
    }
  }, [showAIHelper, aiServiceAvailable, checkAIServiceHealth]);

  // Helper function to clean HTML content
  const cleanHtmlContent = useCallback((content: string): string => {
    if (!content) return '';
    
    // Remove ```html and ``` tags
    let cleaned = content.replace(/^```html\s*\n?/i, '').replace(/\n?```\s*$/i, '');
    
    // Remove any remaining markdown code block indicators
    cleaned = cleaned.replace(/^```\s*\n?/gm, '').replace(/\n?```\s*$/gm, '');
    
    return cleaned.trim();
  }, []);

  // Helper function to populate form fields from AI response
  const populateFormFromAIResponse = useCallback((responseData: any) => {
    // Handle both formData and blogData response formats
    const data = responseData.formData || responseData.blogData;
    
    if (data) {
      // Clean content if it has HTML code block markers
      const cleanedContent = cleanHtmlContent(data.content || '');
      const cleanedDescription = cleanHtmlContent(data.description || '');
      
      // Update form fields if they have new data
      if (data.title && data.title !== watch("title")) {
        setValue("title", data.title);
      }
      if (cleanedDescription && cleanedDescription !== watch("description")) {
        setValue("description", cleanedDescription);
      }
      if (data.meta_title && data.meta_title !== watch("meta_title")) {
        setValue("meta_title", data.meta_title);
      }
      if (data.meta_description && data.meta_description !== watch("meta_description")) {
        setValue("meta_description", data.meta_description);
      }
      
      // Set content and tags
      setContent(cleanedContent);
      if (data.tags && data.tags.length > 0) {
        setTags(data.tags);
      }
      
      // Set categories if provided
      if (data.categories && data.categories.length > 0) {
        const matchedCategories = categories.filter(cat => 
          data.categories.includes(cat.value)
        );
        setSelectedCategories(matchedCategories);
      }
      
      // Store in history
      setGeneratedContentHistory(prev => [cleanedContent, ...prev.slice(0, 4)]);
      
      return {
        metadata: responseData.metadata,
        helpers: responseData.formHelpers,
        wordCount: responseData.wordCount,
        readingTime: responseData.readingTime
      };
    }
    return null;
  }, [cleanHtmlContent, categories, setValue, watch]);

  const generateAIContent = useCallback(async (type: 'improve' | 'expand' | 'rewrite' | 'custom' = 'improve') => {
    if (!blog._id) {
      showToast.error("Blog ID is missing. Cannot enhance content.");
      return;
    }

    if (!content?.trim() && type !== 'custom') {
      showToast.error("Please add some content first to enhance it");
      return;
    }

    if (type === 'custom' && !aiPrompt?.trim()) {
      showToast.error("Please enter a custom prompt for AI enhancement");
      return;
    }

    setIsGeneratingContent(true);
    
    try {
      const input: IAIBlogEnhanceInput = {
        blogId: blog._id, // Add the blog ID for enhancement
        content: content?.trim() || '',
        enhancementType: type,
        customPrompt: type === 'custom' ? aiPrompt?.trim() : undefined,
        targetWordCount: targetWordCount || 1500,
        updateInDatabase: false
      };

      console.log('📝 Sending request to AI enhancement API:', {
        ...input,
        blogId: blog._id,
        contentLength: input.content?.length || 0,
        endpoint: `${apiUrls.ai.enhanceExistingBlog}`
      });

      const response = await aiUtils.enhanceExistingBlog(input);
      
      console.log('📥 AI Enhancement API Response:', response);

      if (response.success && response.data) {
        // Handle direct enhancedContent response format
        const enhancedContent = response.data.enhancedContent;
        
        if (enhancedContent) {
          // Clean content if it has HTML code block markers
          const cleanedContent = cleanHtmlContent(enhancedContent);
          
          console.log(`🎉 AI enhanced content generated successfully!`);
          console.log(`📊 Original: ${content.length} chars → Enhanced: ${cleanedContent.length} chars`);
          
          setContent(cleanedContent);
          setGeneratedContentHistory(prev => [cleanedContent, ...prev.slice(0, 4)]);
          
          // Force editor re-render with new content
          setEditorKey(prev => prev + 1);
          
          // Show enhanced success message
          const wordCount = response.data.wordCount || Math.floor(cleanedContent.length / 5);
          const readingTime = Math.ceil(wordCount / 200);
          
          showToast.success(
            `🎉 Content Enhanced Successfully!\n` +
            `📊 ${wordCount} words • ${readingTime} min read\n` +
            `✨ ${type === 'custom' ? 'Custom enhancement' : `${type.charAt(0).toUpperCase() + type.slice(1)} enhancement`} applied!`
          );
          
          if (type === 'custom') {
            setAiPrompt('');
          }
        } else {
          console.error('❌ No enhanced content received:', response);
          showToast.error(response.message || 'No enhanced content received from AI');
        }
      } else {
        console.error('❌ Enhancement failed:', response);
        showToast.error(response.message || 'Failed to enhance content');
      }
    } catch (error) {
      console.error('❌ AI content generation error:', error);
      
      // Check if it's a network error (Failed to fetch)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        showToast.error(
          "🔌 AI Service Unavailable\n" +
          "The AI enhancement service is currently not available. This could be because:\n" +
          "• Backend server is not running\n" +
          "• AI endpoints are not implemented\n" +
          "• Network connectivity issues\n\n" +
          "Please check your backend server or try again later."
        );
      } else {
        showToast.error(aiUtils.handleAIError(error));
      }
    } finally {
      setIsGeneratingContent(false);
    }
  }, [blog._id, content, aiPrompt, targetWordCount, cleanHtmlContent]);

  // Generate fresh content using the new AI content generation endpoint
  const generateFreshContent = useCallback(async () => {
    const title = watch("title");
    const description = watch("description");

    if (!title?.trim()) {
      showToast.error("Please enter a title first to generate fresh content");
      return;
    }

    setIsRegeneratingContent(true);
    
    try {
      // Enhance prompt with word limit
      const enhancedPrompt = aiPrompt?.trim() 
        ? `${aiPrompt.trim()}\n\nPlease write approximately ${targetWordCount} words for the main content.`
        : `Generate comprehensive content for "${title}" with approximately ${targetWordCount} words.`;
      
      const input: IAIBlogGenerateContentInput = {
        title: title.trim(),
        description: description?.trim() || '',
        categories: selectedCategories.map(cat => cat.value),
        tags: tags,
        approach: 'comprehensive',
        regenerate: true,
        saveToDatabase: false
      };

      const response = await aiUtils.generateBlogContent(input);

      if (response.success && response.data) {
        // Handle direct content response format
        const generatedContent = response.data.content;
        
        if (generatedContent) {
          // Clean content
          const cleanedContent = cleanHtmlContent(generatedContent);
          
          // Set new content
          setContent(cleanedContent);
          setGeneratedContentHistory(prev => [cleanedContent, ...prev.slice(0, 4)]);
          
          // Force editor re-render
          setEditorKey(prev => prev + 1);
          
          // Show enhanced success message
          const wordCount = response.data.wordCount || Math.floor(cleanedContent.length / 5);
          const readingTime = Math.ceil(wordCount / 200);
          
          showToast.success(
            `🔄 Fresh Content Generated Successfully!\n` +
            `📊 ${wordCount} words • ${readingTime} min read\n` +
            `✨ Brand new content with latest information!`
          );
          
          if (aiPrompt) {
            setAiPrompt('');
          }
        } else {
          throw new Error('No content received from AI');
        }
      } else {
        throw new Error(response.message || 'Failed to generate fresh content');
      }
    } catch (error) {
      console.error('AI Fresh Content Generation Error:', error);
      
      // Check if it's a network error (Failed to fetch)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        showToast.error(
          "🔌 AI Service Unavailable\n" +
          "The AI content generation service is currently not available. This could be because:\n" +
          "• Backend server is not running\n" +
          "• AI endpoints are not implemented\n" +
          "• Network connectivity issues\n\n" +
          "Please check your backend server or try again later."
        );
      } else {
        showToast.error(aiUtils.handleAIError(error));
      }
    } finally {
      setIsRegeneratingContent(false);
    }
  }, [watch, selectedCategories, tags, aiPrompt, targetWordCount, cleanHtmlContent]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64String = (event.target?.result as string).split(',')[1];
          await uploadBase64(base64String, "image");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        showToast.error("Error uploading image");
      }
    }
  };

  const onSubmit = useCallback(async (data: any) => {
    if (content.length < 100) {
      showToast.error("Content is too short (minimum 100 characters)");
      return;
    }

    if (!blog._id) {
      showToast.error("Blog ID is missing");
      return;
    }

    try {
      // Validate required fields first
      if (!data.title || !data.title.trim()) {
        showToast.error("Title is required");
        return;
      }

      if (!data.description || !data.description.trim()) {
        showToast.error("Description is required");
        return;
      }

      if (!data.upload_image || !data.upload_image.trim()) {
        showToast.error("Blog image is required");
        return;
      }

      // Ensure all required fields have valid values
      const safeData = {
        title: data.title.trim(),
        description: data.description.trim(),
        content: content.trim(),
        upload_image: data.upload_image.trim(),
        meta_title: (data.meta_title && data.meta_title.trim()) || data.title.trim(),
        meta_description: (data.meta_description && data.meta_description.trim()) || data.description.slice(0, 160),
        blog_link: (data.blog_link && data.blog_link.trim()) || null,
        status: data.status || 'published',
        featured: Boolean(data.featured),
        categories: selectedCategories.length > 0 ? selectedCategories.map(cat => cat.value).filter(Boolean) : [],
        tags: tags.length > 0 ? tags.slice(0, 10).filter(tag => tag && tag.trim()) : []
      };

      // Construct the correct API URL
      const updateUrl = apiUrls.Blogs.updateBlog(blog._id);
      console.log('Updating blog with URL:', updateUrl);
      console.log('Blog ID:', blog._id);
      console.log('Safe update data:', JSON.stringify(safeData, null, 2));
      console.log('Selected categories:', selectedCategories);
      console.log('Tags:', tags);

      await putQuery({
        url: updateUrl,
        putData: safeData,
        onSuccess: (response) => {
          console.log('Blog update response:', response);
          showToast.success("Blog updated successfully! 🎉");
          // Convert categories back to the expected format for onSave
          const updatedBlog: IBlogData = {
            ...blog,
            title: safeData.title,
            description: safeData.description,
            content: safeData.content,
            upload_image: safeData.upload_image,
            meta_title: safeData.meta_title,
            meta_description: safeData.meta_description,
            blog_link: safeData.blog_link,
            status: safeData.status as 'draft' | 'published' | 'archived',
            featured: safeData.featured,
            categories: selectedCategories.map(cat => ({ _id: cat.value, category_name: cat.label })),
            tags: safeData.tags
          };
          onSave(updatedBlog);
        },
        onFail: (error) => {
          console.error('Blog update error:', error);
          showToast.error(`Failed to update blog: ${error?.message || 'Unknown error'}`);
        }
      });
    } catch (error) {
      console.error('Blog update exception:', error);
      showToast.error("An error occurred while updating the blog");
    }
  }, [content, selectedCategories, tags, blog, putQuery, onSave]);

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      borderRadius: '0.75rem',
      minHeight: '48px'
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: '0.75rem'
    })
  };

  return (
    <div className={`min-h-screen p-4 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className={`backdrop-blur-xl rounded-2xl border p-6 md:p-8 shadow-2xl ${
          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white/80 border-gray-200/50 text-gray-900'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Edit Blog</h1>
              <p className="text-sm text-gray-500 mt-1">
                Editing: {blog.title} | Content: {blog.content?.length || 0} chars | ID: {blog._id}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Reload Content Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Manually reloading content...');
                  setContent(blog.content || '');
                  setEditorKey(prev => prev + 1); // Force editor refresh
                  showToast.success('Content reloaded!');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  isDark ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
                title="Reload original content and refresh editor"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Reload</span>
              </motion.button>
              
              {/* Force Editor Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Force refreshing editor...');
                  setEditorKey(prev => prev + 1);
                  showToast.info('Editor refreshed!');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  isDark ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
                title="Force refresh editor display"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
              
              {/* AI Helper Button */}
              <button
                onClick={() => setShowAIHelper(!showAIHelper)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isDark ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Bot className="w-4 h-4" />
                AI Helper
              </button>
            </div>
          </div>

          {/* AI Helper Panel */}
          <AnimatePresence>
            {showAIHelper && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 rounded-xl border ${
                  isDark ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
                }`}
              >
                <div className="space-y-6">
                  {/* AI Blog Writing Assistant */}
                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-lg">AI Blog Writing Assistant</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Describe what you want to write about or how you want to improve your content. The AI will generate well-structured HTML content with proper hierarchy, facts, and formatting.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            Blog Writing Prompt
                          </label>
                          <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            rows={4}
                            className={`w-full border rounded-xl py-3 px-4 resize-none ${
                              isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'
                            }`}
                            placeholder="Examples:
• Write a comprehensive guide about machine learning for beginners
• Improve this content to be more engaging with real-world examples
• Add proper HTML structure with headings, lists, and code blocks
• Rewrite this to include latest industry statistics and trends
• Create a step-by-step tutorial with practical examples"
                          />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {aiPrompt.length}/500 characters
                            </span>
                            <span className="text-xs text-gray-500">
                              Be specific for better results
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                            <Wand2 className="w-4 h-4" />
                            Target Word Count
                          </label>
                          <div className="space-y-3">
                            <div className="relative">
                              <input
                                type="number"
                                value={targetWordCount}
                                onChange={(e) => setTargetWordCount(Math.max(100, Math.min(5000, parseInt(e.target.value) || 1500)))}
                                min="100"
                                max="5000"
                                step="50"
                                className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 transition-all ${
                                  isDark 
                                    ? 'bg-white/5 border-white/10 focus:ring-purple-400/50 text-white'
                                    : 'bg-white border-gray-200 focus:ring-purple-400/50 text-gray-900'
                                }`}
                              />
                            </div>
                            
                            {/* Quick word count presets */}
                            <div className="flex flex-wrap gap-2">
                              {[500, 800, 1200, 1500, 2000].map((preset) => (
                                <motion.button
                                  key={preset}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => setTargetWordCount(preset)}
                                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                    targetWordCount === preset
                                      ? isDark
                                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                        : 'bg-purple-100 text-purple-700 border border-purple-300'
                                      : isDark
                                        ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                  }`}
                                >
                                  {preset}w
                                </motion.button>
                              ))}
                            </div>
                            
                            <div className={`text-xs ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              📝 {targetWordCount < 600 ? 'Short' : targetWordCount < 1200 ? 'Medium' : targetWordCount < 2000 ? 'Long' : 'In-depth'} 
                              • ~{Math.ceil(targetWordCount / 200)} min read
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => setAiPrompt("Improve this content with better structure, add relevant examples, include proper HTML formatting with headings and lists, and ensure all facts are accurate and up-to-date.")}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isDark ? 'border-green-500/30 bg-green-900/20 hover:bg-green-900/30 text-green-300' : 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium text-sm">Improve Structure</span>
                          </div>
                          <p className="text-xs opacity-80">Enhance formatting & facts</p>
                        </button>

                        <button
                          onClick={() => setAiPrompt("Rewrite this content completely with professional HTML structure, include industry statistics, add practical examples, use proper headings (h2, h3), bullet points, and ensure SEO-friendly formatting.")}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isDark ? 'border-blue-500/30 bg-blue-900/20 hover:bg-blue-900/30 text-blue-300' : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <RefreshCw className="w-4 h-4" />
                            <span className="font-medium text-sm">Professional Rewrite</span>
                          </div>
                          <p className="text-xs opacity-80">Complete restructure with HTML</p>
                        </button>

                        <button
                          onClick={() => setAiPrompt("Expand this content significantly with detailed explanations, add code examples, include step-by-step instructions, use proper HTML tags (h2, h3, ul, ol, pre, code), and include relevant industry data and statistics.")}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isDark ? 'border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/30 text-purple-300' : 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Wand2 className="w-4 h-4" />
                            <span className="font-medium text-sm">Detailed Expansion</span>
                          </div>
                          <p className="text-xs opacity-80">Add examples & tutorials</p>
                        </button>
                      </div>

                      {/* Enhanced AI Generation Buttons */}
                      <div className="space-y-3">
                        {/* Primary Generation Buttons */}
                        <div className="space-y-3">
                          {/* Custom Enhancement Button */}
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => generateAIContent('custom')}
                              disabled={isGeneratingContent || !aiPrompt.trim()}
                              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                                isGeneratingContent || !aiPrompt.trim()
                                  ? 'opacity-50 cursor-not-allowed bg-gray-500/20 text-gray-400'
                                  : isDark
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                              }`}
                            >
                              {isGeneratingContent ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  <span>AI is enhancing content...</span>
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-5 h-5" />
                                  <span>Enhance Current Content (~{targetWordCount}w)</span>
                                </>
                              )}
                            </motion.button>

                            {aiPrompt.trim() && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setAiPrompt('')}
                                className={`p-3 rounded-xl transition-all ${
                                  isDark ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                                title="Clear prompt"
                              >
                                <X className="w-5 h-5" />
                              </motion.button>
                            )}
                          </div>

                          {/* Fresh Content Generation Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={generateFreshContent}
                            disabled={isRegeneratingContent || !watch("title")?.trim()}
                            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                              isRegeneratingContent || !watch("title")?.trim()
                                ? 'opacity-50 cursor-not-allowed bg-gray-500/20 text-gray-400'
                                : isDark
                                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                            }`}
                          >
                            {isRegeneratingContent ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Generating fresh content...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-5 h-5" />
                                <span>Generate Fresh Content (~{targetWordCount}w)</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                </svg>
                              </>
                            )}
                          </motion.button>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => generateAIContent('improve')}
                            disabled={isGeneratingContent}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                              isGeneratingContent
                                ? 'opacity-50 cursor-not-allowed bg-gray-500/20 text-gray-400'
                                : isDark
                                  ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30 border border-green-500/30'
                                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm">Enhance with Latest Data</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => generateAIContent('rewrite')}
                            disabled={isGeneratingContent}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                              isGeneratingContent
                                ? 'opacity-50 cursor-not-allowed bg-gray-500/20 text-gray-400'
                                : isDark
                                  ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30'
                                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                            }`}
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-sm">Quick Improve</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* AI Status */}
                      {(isGeneratingContent || isRegeneratingContent) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-xl border ${
                            isDark ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <div>
                              <p className="font-medium">
                                {isGeneratingContent ? 'AI Blog Enhancement in Progress...' : 'AI Fresh Content Generation...'}
                              </p>
                              <p className="text-sm opacity-80">🔍 Researching latest data and industry trends</p>
                              <p className="text-sm opacity-80">✍️ Creating well-structured HTML content (~{targetWordCount} words)</p>
                              <p className="text-xs opacity-60 mt-1">
                                {isGeneratingContent 
                                  ? `Current content: ${content.length} chars → Enhanced content will replace this`
                                  : `Generating fresh content based on: "${watch("title")?.slice(0, 50)}..."`
                                }
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Content Update Success Indicator */}
                      {!isGeneratingContent && !isRegeneratingContent && content.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`p-3 rounded-xl border ${
                            isDark ? 'bg-green-900/20 border-green-500/30 text-green-300' : 'bg-green-50 border-green-200 text-green-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Content ready: {content.length} characters • ~{Math.ceil(content.length / 5)} words</span>
                            </div>
                            {generatedContentHistory.length > 0 && (
                              <div className="text-xs opacity-75">
                                {generatedContentHistory.length} AI generation{generatedContentHistory.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title and Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className="text-sm font-medium mb-2 block">Title *</label>
                <input
                  {...register("title")}
                  className={`w-full border rounded-xl py-3 px-4 ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  {...register("status")}
                  className={`w-full border rounded-xl py-3 px-4 ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Description *</label>
              <textarea
                {...register("description")}
                rows={3}
                className={`w-full border rounded-xl py-3 px-4 ${
                  isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Blog Link */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Blog Link (Optional)
              </label>
              <input
                {...register("blog_link")}
                type="url"
                placeholder="https://example.com/blog-post"
                className={`w-full border rounded-xl py-3 px-4 ${
                  isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
              {errors.blog_link && <p className="text-red-500 text-sm mt-1">{errors.blog_link.message}</p>}
            </div>

            {/* Categories and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categories</label>
                <Select
                  isMulti
                  options={categories}
                  value={selectedCategories}
                  onChange={(newValue) => setSelectedCategories(newValue as ICategory[])}
                  styles={customSelectStyles}
                  placeholder="Select categories..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <input
                  type="text"
                  value={tags.join(', ')}
                  onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                  className={`w-full border rounded-xl py-3 px-4 ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                  placeholder="Enter tags separated by commas..."
                />
              </div>
            </div>

            {/* Meta Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Meta Title (SEO)</label>
                <input
                  {...register("meta_title")}
                  placeholder="SEO optimized title (max 60 chars)"
                  className={`w-full border rounded-xl py-3 px-4 ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
                {errors.meta_title && <p className="text-red-500 text-sm mt-1">{errors.meta_title.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Meta Description (SEO)</label>
                <input
                  {...register("meta_description")}
                  placeholder="SEO description (max 160 chars)"
                  className={`w-full border rounded-xl py-3 px-4 ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
                {errors.meta_description && <p className="text-red-500 text-sm mt-1">{errors.meta_description.message}</p>}
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3">
              <input
                {...register("featured")}
                type="checkbox"
                id="featured"
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Mark as Featured Article
              </label>
            </div>

            {/* Content Editor */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Content * 
                <span className="text-xs text-gray-500 ml-2">
                  (Current: {content.length} chars)
                </span>
              </label>
              
              {!editorReady ? (
                <div className={`rounded-xl border p-8 text-center ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
                  <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-400" />
                  <p className="text-gray-500">Loading editor...</p>
                </div>
              ) : (
                <>
                  <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <MDEditor
                      key={editorKey}
                      value={content}
                      onChange={(value) => {
                        console.log('Editor content changed from:', content.length, 'to:', value?.length, 'characters');
                        setContent(value || '');
                      }}
                      placeholder="Start writing your blog content here..."
                      className={`min-h-[300px] ${isDark ? 'bg-white/5 text-white' : 'bg-white text-gray-900'}`}
                      onFocus={() => console.log('Editor focused, current content length:', content.length)}
                    />
                  </div>
                  
                  {/* Content Update Button for Testing */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Force updating editor content...');
                          setEditorKey(prev => prev + 1);
                          showToast.info('Editor refreshed!');
                        }}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Force Refresh Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const testContent = `<h2>Test Content ${Date.now()}</h2><p>This is test content generated at ${new Date().toLocaleTimeString()}</p>`;
                          console.log('Setting test content:', testContent.length, 'chars');
                          setContent(testContent);
                          setEditorKey(prev => prev + 1);
                          showToast.success('Test content added!');
                        }}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Test Content Update
                      </button>
                    </div>
                  )}
                  
                  {/* Debug Info */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      <strong>Debug:</strong> Content loaded: {content.length > 0 ? 'Yes' : 'No'} | 
                      Original blog content: {blog.content?.length || 0} chars | 
                      Current state: {content.length} chars | 
                      Editor key: {editorKey}
                    </div>
                  )}
                </>
              )}
              
              {content.length < 100 && content.length > 0 && (
                <div className="mt-2 text-orange-500 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Content is quite short. Consider adding more details.
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium mb-2 block">Blog Image *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`border-2 border-dashed rounded-xl p-4 text-center ${
                  isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
                }`}>
                  {watch('upload_image') ? (
                    <img src={watch('upload_image')} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <div className="py-8">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Click to upload new image</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.upload_image && <p className="text-red-500 text-sm mt-1">{errors.upload_image.message}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-opacity-10">
              <button
                type="button"
                onClick={onCancel}
                className={`px-6 py-3 rounded-xl border transition-all ${
                  isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <X className="w-4 h-4 mr-2 inline" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={putLoading || isUploading}
                className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {putLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : isUploading ? (
                  <>
                    <Upload className="w-4 h-4" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Blog
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditBlog; 