import { 
  db, 
  collections, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  onSnapshot 
} from '@/firebase/config';
import type { UserProgress, ExamResult, DashboardStats } from '@/types';

// Get or create user progress
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const q = query(collections.progress, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserProgress;
    }
    
    // Create new progress record
    const newProgress: Omit<UserProgress, 'id'> = {
      userId,
      examsTaken: 0,
      subjectsStudied: [],
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      progress: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collections.progress, newProgress);
    return { id: docRef.id, ...newProgress };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
};

// Update user progress
export const updateUserProgress = async (
  userId: string, 
  updates: Partial<UserProgress>
): Promise<boolean> => {
  try {
    const q = query(collections.progress, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'progress', querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        ...updates,
        lastActive: new Date().toISOString()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
};

// Record exam result
export const recordExamResult = async (
  userId: string,
  result: Omit<ExamResult, 'id' | 'userId' | 'completedAt'>
): Promise<string | null> => {
  try {
    const examResult: Omit<ExamResult, 'id'> = {
      ...result,
      userId,
      completedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collections.exams, examResult);
    
    // Update user progress
    const progress = await getUserProgress(userId);
    if (progress) {
      const newExamsTaken = progress.examsTaken + 1;
      const newSubjects = [...new Set([...progress.subjectsStudied, result.subject])];
      const newTotalQuestions = progress.totalQuestionsAnswered + result.totalQuestions;
      const newCorrectAnswers = progress.correctAnswers + result.correctAnswers;
      const newProgress = Math.round((newCorrectAnswers / newTotalQuestions) * 100);
      
      await updateUserProgress(userId, {
        examsTaken: newExamsTaken,
        subjectsStudied: newSubjects,
        totalQuestionsAnswered: newTotalQuestions,
        correctAnswers: newCorrectAnswers,
        progress: newProgress
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error recording exam result:', error);
    return null;
  }
};

// Get exam history
export const getExamHistory = async (userId: string): Promise<ExamResult[]> => {
  try {
    const q = query(
      collections.exams, 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ExamResult));
  } catch (error) {
    console.error('Error getting exam history:', error);
    return [];
  }
};

// Get dashboard stats
export const getDashboardStats = async (userId?: string): Promise<DashboardStats> => {
  try {
    // Get global stats
    const statsDoc = await getDoc(doc(db, 'stats', 'global'));
    const globalStats = statsDoc.exists() ? statsDoc.data() : {};
    
    // Get user-specific stats if userId provided
    let userStats = null;
    if (userId) {
      const progress = await getUserProgress(userId);
      if (progress) {
        userStats = {
          examsTaken: progress.examsTaken,
          subjectsStudied: progress.subjectsStudied.length,
          progress: progress.progress,
          totalQuestions: progress.totalQuestionsAnswered,
          correctAnswers: progress.correctAnswers
        };
      }
    }
    
    return {
      totalQuestions: globalStats.totalQuestions || 0,
      totalSubjects: globalStats.totalSubjects || 12,
      totalUsers: globalStats.totalUsers || 0,
      totalExams: globalStats.totalExams || 0,
      userStats
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      totalQuestions: 0,
      totalSubjects: 12,
      totalUsers: 0,
      totalExams: 0
    };
  }
};

// Subscribe to user progress (real-time)
export const subscribeToUserProgress = (
  userId: string,
  callback: (progress: UserProgress | null) => void
) => {
  const q = query(collections.progress, where('userId', '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      callback({ id: doc.id, ...doc.data() } as UserProgress);
    } else {
      callback(null);
    }
  });
};

// Update global stats (admin function)
export const updateGlobalStats = async (updates: Partial<DashboardStats>): Promise<boolean> => {
  try {
    const statsRef = doc(db, 'stats', 'global');
    await updateDoc(statsRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating global stats:', error);
    return false;
  }
};

// Initialize global stats
export const initializeGlobalStats = async (): Promise<void> => {
  try {
    const statsRef = doc(db, 'stats', 'global');
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      await addDoc(collections.stats, {
        id: 'global',
        totalQuestions: 0,
        totalSubjects: 12,
        totalUsers: 0,
        totalExams: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error initializing global stats:', error);
  }
};
