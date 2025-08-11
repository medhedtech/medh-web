import { NextRequest, NextResponse } from 'next/server';

// Mock data for announcements (replace with actual database integration)
const mockAnnouncements = [
  {
    _id: '1',
    title: 'Welcome to Medh Learning Platform',
    content: 'We are excited to welcome you to our comprehensive learning platform. Start your journey with our expert-led courses.',
    type: 'general' as const,
    priority: 'medium' as const,
    status: 'published' as const,
    targetAudience: ['all'] as const,
    isSticky: true,
    viewCount: 150,
    readCount: 120,
    isRead: false,
    author: {
      _id: 'admin1',
      full_name: 'Medh Team',
      email: 'team@medh.co',
      role: ['admin']
    },
    categories: [],
    tags: ['welcome', 'platform'],
    metadata: {
      featured: true,
      allowComments: false,
      sendNotification: true,
      emailNotification: false,
      pushNotification: false,
      notificationSent: true
    },
    publishDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'New AI & Data Science Course Available',
    content: 'Explore the latest in artificial intelligence and data science with our comprehensive course designed for all skill levels.',
    type: 'course' as const,
    priority: 'high' as const,
    status: 'published' as const,
    targetAudience: ['students'] as const,
    isSticky: false,
    viewCount: 89,
    readCount: 67,
    isRead: false,
    author: {
      _id: 'instructor1',
      full_name: 'Dr. Sarah Johnson',
      email: 'sarah@medh.co',
      role: ['instructor']
    },
    categories: [],
    tags: ['ai', 'data-science', 'new-course'],
    metadata: {
      featured: true,
      allowComments: true,
      sendNotification: true,
      emailNotification: true,
      pushNotification: true,
      notificationSent: true
    },
    publishDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'System Maintenance Notice',
    content: 'We will be performing scheduled maintenance on Sunday, 2:00 AM - 4:00 AM. During this time, the platform may be temporarily unavailable.',
    type: 'maintenance' as const,
    priority: 'medium' as const,
    status: 'published' as const,
    targetAudience: ['all'] as const,
    isSticky: false,
    viewCount: 45,
    readCount: 38,
    isRead: false,
    author: {
      _id: 'admin1',
      full_name: 'Medh Team',
      email: 'team@medh.co',
      role: ['admin']
    },
    categories: [],
    tags: ['maintenance', 'system'],
    metadata: {
      featured: false,
      allowComments: false,
      sendNotification: true,
      emailNotification: false,
      pushNotification: true,
      notificationSent: true
    },
    publishDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '5');
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type');
    const targetAudience = searchParams.get('targetAudience') || 'all';
    const status = searchParams.get('status') || 'published';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Filter announcements based on parameters
    let filteredAnnouncements = mockAnnouncements.filter(announcement => {
      // Filter by status
      if (status && announcement.status !== status) return false;
      
      // Filter by type
      if (type && announcement.type !== type) return false;
      
      // Filter by target audience
      if (targetAudience && targetAudience !== 'all' && !announcement.targetAudience.includes(targetAudience as any)) return false;
      
      return true;
    });
    
    // Sort announcements
    filteredAnnouncements.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'publishDate':
          aValue = new Date(a.publishDate).getTime();
          bValue = new Date(b.publishDate).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Apply pagination
    const totalCount = filteredAnnouncements.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);
    
    // Add relative dates
    const announcementsWithDates = paginatedAnnouncements.map(announcement => ({
      ...announcement,
      date: formatRelativeDate(announcement.createdAt)
    }));
    
    const response = {
      status: 'success',
      message: 'Recent announcements retrieved successfully',
      data: {
        announcements: announcementsWithDates,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        }
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching recent announcements:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch recent announcements',
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Helper function to format relative dates
function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}
