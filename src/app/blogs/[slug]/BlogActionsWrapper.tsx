'use client';

import BlogActions from './BlogActions';

interface BlogActionsWrapperProps {
  blogId: string;
}

export default function BlogActionsWrapper({ blogId }: BlogActionsWrapperProps) {
  return <BlogActions blogId={blogId} />;
} 