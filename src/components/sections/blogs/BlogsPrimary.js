"use client";
import allBlogs from "@/../public/fakedata/blogs";
import blogImag6 from "@/assets/images/blog/blog_6.png";
import blogImag7 from "@/assets/images/blog/blog_7.png";
import blogImag8 from "@/assets/images/blog/blog_8.png";
import blogImag9 from "@/assets/images/blog/blog_9.png";
import BlogPrimary from "@/components/shared/blogs/BlogPrimary";
import BlogsSidebar from "@/components/shared/blogs/BlogsSidebar";
// import Pagination from "@/components/shared/others/Pagination"; // Import Pagination component
import { useEffect, useRef, useState } from "react";
import Pagination from "./pagination";

const images = [
  blogImag6,
  blogImag7,
  blogImag8,
  blogImag9,
  blogImag8,
  blogImag7,
  blogImag6,
  blogImag9,
  blogImag6,
  blogImag7,
];

const BlogsPrimary = () => {
  const [currentBlogs, setCurrentBlogs] = useState([]);
  const blogsRef = useRef(null);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const totalBlogs = allBlogs?.length;
  const limit = 3;
  const totalPages = Math.ceil(totalBlogs / limit);

  // Function to handle pagination
  const handlePagination = (id) => {
    blogsRef.current.scrollIntoView({ behavior: "smooth" });
    if (typeof id === "number") {
      setCurrentPage(id);
      setSkip(limit * id);
    } else if (id === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setSkip(skip - limit);
    } else if (id === "next" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setSkip(skip + limit);
    }
  };

  // Update displayed blogs when `skip` or `limit` changes
  useEffect(() => {
    const blogs = [...allBlogs.slice(6, 10), ...allBlogs.slice(0, 6)]?.map(
      (blog, idx) => ({
        ...blog,
        image: images[idx],
      })
    );
    const blogsToShow = blogs.slice(skip, skip + limit); // Correct slicing for current blogs
    setCurrentBlogs(blogsToShow);
  }, [skip, limit]);

  return (
    <section ref={blogsRef}>
      <div className="container py-10 md:py-30px lg:py-40px 2xl:py-60px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px">
          {/* blogs */}
          <div className="lg:col-start-1 lg:col-span-8 space-y-[35px] ">
            {currentBlogs && currentBlogs.length > 0 ? (
              <>
                {currentBlogs?.map((blog, idx) => (
                  <BlogPrimary blog={blog} idx={idx} key={idx} />
                ))}

                {/* Pagination Component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePagesnation={handlePagination}
                />
              </>
            ) : (
              <p>No blogs available</p>
            )}
          </div>
          {/* blog sidebar */}
          <div className="lg:col-start-9 lg:col-span-4">
            <BlogsSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsPrimary;
