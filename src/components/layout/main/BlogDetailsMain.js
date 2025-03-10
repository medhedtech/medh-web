import BlogDetails from "@/components/sections/blog-details/BlogDetails";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";

const BlogDetailsMain = ({ blog, relatedBlogs = [] }) => {
  // Prepare blog title with fallback
  const blogTitle = blog?.title || "Blog Details";
  
  return (
    <>
      <HeroPrimary 
        path="Blogs" 
        title={blogTitle}
        description="Explore our latest educational insights and trends"
        className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 dark:from-primary-900/10 dark:via-gray-900 dark:to-secondary-900/10"
      />
      <BlogDetails blog={blog} relatedBlogs={relatedBlogs} />
    </>
  );
};

export default BlogDetailsMain;
