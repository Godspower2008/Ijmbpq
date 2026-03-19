import { 
  db, 
  collections, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot 
} from '@/firebase/config';
import type { Subject } from '@/types';

// Get all subjects
export const getAllSubjects = async (): Promise<Subject[]> => {
  try {
    const q = query(collections.subjects, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Subject));
  } catch (error) {
    console.error('Error getting subjects:', error);
    return [];
  }
};

// Get single subject by ID
export const getSubjectById = async (id: string): Promise<Subject | null> => {
  try {
    const docRef = doc(db, 'subjects', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Subject;
    }
    return null;
  } catch (error) {
    console.error('Error getting subject:', error);
    return null;
  }
};

// Add new subject
export const addSubject = async (subject: Omit<Subject, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collections.subjects, {
      ...subject,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding subject:', error);
    return null;
  }
};

// Update subject
export const updateSubject = async (id: string, updates: Partial<Subject>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'subjects', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating subject:', error);
    return false;
  }
};

// Delete subject
export const deleteSubject = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'subjects', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting subject:', error);
    return false;
  }
};

// Subscribe to subjects (real-time updates)
export const subscribeToSubjects = (callback: (subjects: Subject[]) => void) => {
  const q = query(collections.subjects, orderBy('order', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const subjects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Subject));
    callback(subjects);
  });
};

// Initialize default subjects (run once to populate database)
export const initializeSubjects = async (): Promise<void> => {
  const defaultSubjects = [
    { name: 'Mathematics', code: 'MAT', icon: 'Calculator', topics: 'Algebra, Calculus, Trigonometry, Statistics', color: '#6366f1', order: 1 },
    { name: 'Physics', code: 'PHY', icon: 'FlaskConical', topics: 'Mechanics, Electricity, Waves, Modern Physics', color: '#8b5cf6', order: 2 },
    { name: 'Chemistry', code: 'CHE', icon: 'Microscope', topics: 'Organic, Inorganic, Physical Chemistry', color: '#ec4899', order: 3 },
    { name: 'Biology', code: 'BIO', icon: 'BookOpen', topics: 'Botany, Zoology, Genetics, Ecology', color: '#10b981', order: 4 },
    { name: 'Economics', code: 'ECO', icon: 'TrendingUp', topics: 'Microeconomics, Macroeconomics, Trade', color: '#f59e0b', order: 5 },
    { name: 'Government', code: 'GOV', icon: 'Landmark', topics: 'Political Systems, Constitution, International Relations', color: '#3b82f6', order: 6 },
    { name: 'CRS', code: 'CRS', icon: 'Church', topics: 'Christian Religious Studies, Biblical Knowledge', color: '#ef4444', order: 7 },
    { name: 'Literature', code: 'LIT', icon: 'BookText', topics: 'Poetry, Drama, Prose, Literary Analysis', color: '#14b8a6', order: 8 },
    { name: 'Accounting', code: 'ACC', icon: 'Wallet', topics: 'Financial Accounting, Cost Accounting', color: '#f97316', order: 9 },
    { name: 'Business Management', code: 'BUS', icon: 'Briefcase', topics: 'Business Organization, Marketing', color: '#06b6d4', order: 10 },
    { name: 'Geography', code: 'GEO', icon: 'Globe', topics: 'Physical Geography, Human Geography', color: '#84cc16', order: 11 },
    { name: 'IRS', code: 'IRS', icon: 'Moon', topics: 'Islamic Religious Studies', color: '#6366f1', order: 12 },
  ];

  try {
    const existingSubjects = await getAllSubjects();
    if (existingSubjects.length === 0) {
      for (const subject of defaultSubjects) {
        await addSubject(subject);
      }
      console.log('Default subjects initialized');
    }
  } catch (error) {
    console.error('Error initializing subjects:', error);
  }
};
