import type { Metadata } from 'next'
import './blog-styles.css'

export const metadata: Metadata = {
  title: 'Blog | Medh',
  description: 'Expert insights on technology, career growth, education, and industry trends',
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 