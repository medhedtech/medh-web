import { Announcement } from "@/components/shared/dashboards/AnnouncementCard";

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const authToken = localStorage.getItem('authToken');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': authToken || '',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map((item: any) => ({
        title: item.title,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date',
        content: item.content || item.description,
        type: item.type || 'general'
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
};

export const getAnnouncementsByType = async (type: string): Promise<Announcement[]> => {
  try {
    const authToken = localStorage.getItem('authToken');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': authToken || '',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data.map((item: any) => ({
        title: item.title,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date',
        content: item.content || item.description,
        type: item.type || 'general'
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching announcements by type:', error);
    return [];
  }
};

export default {
  getAnnouncements,
  getAnnouncementsByType
}; 