import { Metadata } from 'next';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

export const metadata: Metadata = {
  title: 'Blog Details | Medh',
  description: 'Blog details page',
};

interface BlogPageParams {
  id: string;
}

type Props = {
  params: BlogPageParams;
}

export default function BlogDetails({ params }: Props) {
  const { id } = params;
  
  return (
    <PageWrapper>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1>Blog Details: {id}</h1>
          <p>This is a placeholder for the blog content.</p>
        </div>
      </main>
    </PageWrapper>
  );
} 