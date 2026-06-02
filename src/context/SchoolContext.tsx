import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { schoolApi, StudentSafe, SystemNotification } from '../services/schoolApi';
import { useLocation } from 'react-router-dom';

interface RealtimeAlert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warn';
  timestamp: Date;
}

interface SchoolContextProps {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  notifications: SystemNotification[];
  refreshNotifications: () => Promise<void>;
  realtimeAlerts: RealtimeAlert[];
  removeRealtimeAlert: (id: string) => void;
  socket: Socket | null;
}

const SchoolContext = createContext<SchoolContextProps | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState<RealtimeAlert[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const location = useLocation();

  // Load user from local storage on startup
  useEffect(() => {
    const savedUser = schoolApi.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Socket.io and real-time triggers listener
  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const s = io(window.location.origin);
    setSocket(s);

    s.on('connect', () => {
      console.log('Realtime socket.io link connected is active!');
      if (user.role === 'student') {
        s.emit('join-student', user.id);
        s.emit('join-class', user.class);
      }
    });

    s.on('student-login', (data: any) => {
      if (user.role === 'teacher' || user.role === 'admin') {
        addAlert(`نشاط تلميذ 🔔`, `سجل التلميذ "${data.studentName}" فصيلة "${data.class}" دخوله الآن.`, 'info');
      }
    });

    s.on('exam-added', (data: any) => {
      if (user.role === 'student' && user.id === data.studentId) {
        addAlert(`علامات جديدة 📝`, `تم تسجيل علامة ${data.score}/20 في مادة ${data.subject}.`, 'success');
        refreshNotifications();
      }
    });

    s.on('writing-graded', (data: any) => {
      if (user.role === 'student' && user.id === data.studentId) {
        addAlert(`تم تصحيح موضوع الإنشاء 🎉`, `سجل معلمك علامة ${data.score}/20 على تعبيرك "${data.topicTitle}".`, 'success');
        refreshNotifications();
      }
    });

    s.on('exercise-submitted', (data: any) => {
      if (user.role === 'teacher' || user.role === 'admin') {
        addAlert(`إنجاز تمرين 🤖`, `أرسل "${data.studentName}" حلاً تمرينياً بصيغة "${data.title}".`, 'info');
      }
    });

    s.on('writing-submitted', (data: any) => {
      if (user.role === 'teacher' || user.role === 'admin') {
        addAlert(`تمرين تعبير جديد ✍️`, `أودع التلميذ "${data.studentName}" موضوع إنشاء للتصحيح بعنوان "${data.topicTitle}".`, 'info');
      }
    });

    return () => {
      s.disconnect();
    };
  }, [user]);

  // Load and fetch Notifications for user
  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const list = await schoolApi.getNotifications();
      setNotifications(list);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Helper to append real-time banner alert toasts
  const addAlert = (title: string, message: string, type: 'info' | 'success' | 'warn') => {
    const id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setRealtimeAlerts(prev => [...prev, { id, title, message, type, timestamp: new Date() }]);

    // auto dismiss
    setTimeout(() => {
      setRealtimeAlerts(prev => prev.filter(a => a.id !== id));
    }, 6000);
  };

  const removeRealtimeAlert = (id: string) => {
    setRealtimeAlerts(prev => prev.filter(a => a.id !== id));
  };

  // ⏱️ BACKGROUND ACTIVITY HEARBEATS TRACKER
  // Satisfies requirement for continuous trackActivity.js logging.
  useEffect(() => {
    if (!user || user.role !== 'student') return;

    let timeOnPage = 0;
    const interval = setInterval(() => {
      timeOnPage += 1; // minutes
      
      const cleanPath = location.pathname;
      let action = 'تصفح المنصة والدراسة';
      if (cleanPath.includes('levels')) action = 'استكشاف المسارات التعليمية المنهجية';
      else if (cleanPath.includes('learn')) action = 'دراسة وحدة تفاعلية صفية';
      else if (cleanPath.includes('exercises')) action = 'حل تمرين تقويمي صرفي ونحوي';
      else if (cleanPath.includes('composition')) action = 'ممارسة الإنشاء والتعبير العربي';
      else if (cleanPath.includes('live') || cleanPath.includes('communication')) action = 'جلسة مباشرة مع الأستاذ';
      
      schoolApi.logActivity(action, cleanPath, 1)
        .then(() => {
          // Increment cached user duration locally
          const cached = schoolApi.getCurrentUser();
          if (cached) {
            cached.totalTimeSpent = (cached.totalTimeSpent || 0) + 1;
            localStorage.setItem('school_user', JSON.stringify(cached));
            setUser(cached);
          }
        })
        .catch(err => console.error('Heartbeat log error:', err));

    }, 60000); // Send heartbeat every 60 seconds

    return () => clearInterval(interval);
  }, [user, location.pathname]);

  const login = async (email: string, password: string) => {
    const data = await schoolApi.login(email, password);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    schoolApi.logout();
    setUser(null);
  };

  return (
    <SchoolContext.Provider value={{
      user,
      loading,
      login,
      logout,
      notifications,
      refreshNotifications,
      realtimeAlerts,
      removeRealtimeAlert,
      socket
    }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be utilized within a SchoolProvider');
  }
  return context;
};
