import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface UserStats {
  xp: number;
  level: string;
  badges: string[];
  streak: number;
  lastActive: string;
}

export const useGamification = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!auth.currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setStats({
          xp: data.xp || 0,
          level: calculateLevel(data.xp || 0),
          badges: data.badges || [],
          streak: data.streak || 0,
          lastActive: data.lastActive || '',
        });
      }
    } catch (error) {
      console.error("Error fetching gamification stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const calculateLevel = (xp: number) => {
    if (xp <= 100) return 'مبتدئ';
    if (xp <= 300) return 'متوسط';
    if (xp <= 600) return 'متقدم';
    return 'خبير';
  };

  const addXP = async (amount: number) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        xp: increment(amount)
      });
      await fetchStats(); // Refresh local stats
    } catch (error) {
      console.error("Error adding XP:", error);
    }
  };

  const addBadge = async (badgeId: string) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        badges: arrayUnion(badgeId)
      });
      await fetchStats();
    } catch (error) {
      console.error("Error adding badge:", error);
    }
  };

  const updateStreak = async () => {
    if (!auth.currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const lastActive = stats?.lastActive?.split('T')[0];

    if (lastActive === today) return; // Already updated today

    let newStreak = 1;
    if (lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActive === yesterdayStr) {
        newStreak = (stats?.streak || 0) + 1;
      }
    }

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        streak: newStreak,
        lastActive: new Date().toISOString(),
        xp: increment(5) // Daily login bonus
      });
      await fetchStats();
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  return { stats, loading, addXP, addBadge, updateStreak, fetchStats };
};
