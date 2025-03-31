import { Announcement } from "@/components/shared/dashboards/AnnouncementCard";

// Mock data
const mockAnnouncements: Announcement[] = [
  {
    title: "New AI Course Starting Soon",
    date: "2 days ago",
    content: "We're excited to announce our new AI fundamentals course starting next week.",
    type: "course"
  },
  {
    title: "Platform Maintenance",
    date: "1 week ago",
    content: "Scheduled maintenance on Saturday, May 15th from 2-4 AM EST. Brief downtime expected.",
    type: "system"
  },
  {
    title: "Summer Bootcamp Registration",
    date: "2 weeks ago",
    content: "Registration for our intensive summer coding bootcamp is now open.",
    type: "event"
  },
  {
    title: "New Learning Path Available",
    date: "3 weeks ago",
    content: "Explore our new full-stack developer learning path with 20+ courses.",
    type: "course"
  }
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAnnouncements = async (): Promise<Announcement[]> => {
  // Simulate API call with delay
  await delay(800);
  return mockAnnouncements;
};

export const getAnnouncementsByType = async (type: string): Promise<Announcement[]> => {
  await delay(600);
  return mockAnnouncements.filter(announcement => announcement.type === type);
};

export default {
  getAnnouncements,
  getAnnouncementsByType
}; 