import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { UpcomingClass, Reminder } from '@/types/upcoming-classes.types';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);

  // Load reminders from localStorage
  const loadReminders = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('classReminders');
      if (stored) {
        const parsedReminders = JSON.parse(stored);
        setReminders(parsedReminders);
        return parsedReminders;
      }
    }
    return [];
  };

  // Save reminders to localStorage
  const saveReminders = (newReminders: Reminder[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('classReminders', JSON.stringify(newReminders));
    }
    setReminders(newReminders);
  };

  // Create multiple reminders for a class
  const createMultipleReminders = (upcomingClass: UpcomingClass) => {
    if (!upcomingClass.scheduledDate) return;

    // Multiple reminder intervals: 1 week, 1 day, 2 hours, 30 minutes
    const reminderIntervals = [
      { minutes: 10080, label: '1 week' },    // 7 days
      { minutes: 1440, label: '1 day' },     // 24 hours
      { minutes: 120, label: '2 hours' },    // 2 hours
      { minutes: 30, label: '30 minutes' }   // 30 minutes
    ];

    const classDateTime = new Date(upcomingClass.scheduledDate);
    const newReminders: Reminder[] = [];

    reminderIntervals.forEach(({ minutes, label }) => {
      const reminderDateTime = new Date(classDateTime.getTime() - (minutes * 60 * 1000));
      
      // Only create reminder if it's in the future
      if (reminderDateTime > new Date()) {
        const newReminder: Reminder = {
          classId: upcomingClass.id,
          classTitle: upcomingClass.title,
          scheduledDate: upcomingClass.scheduledDate || '',
          reminderTime: minutes,
          reminderDateTime: reminderDateTime.toISOString(),
          isActive: true
        };
        newReminders.push(newReminder);
      }
    });

    if (newReminders.length > 0) {
      const updatedReminders = [...reminders, ...newReminders];
      saveReminders(updatedReminders);
      
      toast.success(`🔔 Multiple reminders set! You'll be notified 1 week, 1 day, 2 hours, and 30 minutes before class`, {
        duration: 4000,
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      });
    } else {
      toast.error('Class is too soon to set all reminder intervals');
    }
  };

  // Remove all reminders for a class
  const removeReminder = (classId: string) => {
    const updatedReminders = reminders.filter(r => r.classId !== classId);
    saveReminders(updatedReminders);
    toast.success('Reminder removed');
  };

  // Check for active reminders and show notifications
  const checkReminders = () => {
    const now = new Date();
    const activeReminders = reminders.filter(reminder => {
      const reminderTime = new Date(reminder.reminderDateTime);
      return reminder.isActive && now >= reminderTime && now <= new Date(reminder.scheduledDate);
    });

    activeReminders.forEach(reminder => {
      if (!activeNotifications.includes(reminder.classId)) {
        showNotification(reminder);
        setActiveNotifications(prev => [...prev, reminder.classId]);
        
        // Deactivate the reminder
        const updatedReminders = reminders.map(r => 
          r.classId === reminder.classId ? { ...r, isActive: false } : r
        );
        saveReminders(updatedReminders);
      }
    });
  };

  // Show browser and toast notifications
  const showNotification = (reminder: Reminder) => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Class Starting Soon!`, {
        body: `${reminder.classTitle} starts in ${reminder.reminderTime} minutes`,
        icon: '/icons/courses.png'
      });
    }
    
    // Toast notification
    toast.success(
      `🔔 ${reminder.classTitle} starts in ${reminder.reminderTime} minutes!`,
      { duration: 10000 }
    );
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // Handle setting reminders for a class
  const handleSetReminder = (upcomingClass: UpcomingClass) => {
    requestNotificationPermission();
    createMultipleReminders(upcomingClass);
  };

  // Load reminders and start checking on mount
  useEffect(() => {
    loadReminders();
    
    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    reminders,
    handleSetReminder,
    removeReminder
  };
}; 