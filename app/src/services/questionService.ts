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
  where, 
  orderBy,
  onSnapshot 
} from '@/firebase/config';
import type { Question, QuestionFilter } from '@/types';

// Get all questions
export const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const querySnapshot = await getDocs(collections.questions);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
  } catch (error) {
    console.error('Error getting questions:', error);
    return [];
  }
};

// Get questions with filters
export const getQuestions = async (filter: QuestionFilter): Promise<Question[]> => {
  try {
    let q = query(collections.questions);
    
    if (filter.subject && filter.subject !== 'All') {
      q = query(q, where('subject', '==', filter.subject));
    }
    if (filter.year && filter.year !== 'All') {
      q = query(q, where('year', '==', parseInt(filter.year)));
    }
    if (filter.paper && filter.paper !== 'All') {
      q = query(q, where('paper', '==', filter.paper));
    }
    
    q = query(q, orderBy('year', 'desc'));
    
    const querySnapshot = await getDocs(q);
    let questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
    
    // Client-side search filter
    if (filter.searchQuery) {
      const searchLower = filter.searchQuery.toLowerCase();
      questions = questions.filter(q => 
        q.question.toLowerCase().includes(searchLower) ||
        q.subject.toLowerCase().includes(searchLower) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return questions;
  } catch (error) {
    console.error('Error getting filtered questions:', error);
    return [];
  }
};

// Get questions by subject
export const getQuestionsBySubject = async (subject: string): Promise<Question[]> => {
  try {
    const q = query(collections.questions, where('subject', '==', subject), orderBy('year', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
  } catch (error) {
    console.error('Error getting questions by subject:', error);
    return [];
  }
};

// Get single question by ID
export const getQuestionById = async (id: string): Promise<Question | null> => {
  try {
    const docRef = doc(db, 'questions', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Question;
    }
    return null;
  } catch (error) {
    console.error('Error getting question:', error);
    return null;
  }
};

// Add new question
export const addQuestion = async (question: Omit<Question, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collections.questions, {
      ...question,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding question:', error);
    return null;
  }
};

// Update question
export const updateQuestion = async (id: string, updates: Partial<Question>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'questions', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating question:', error);
    return false;
  }
};

// Delete question
export const deleteQuestion = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'questions', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting question:', error);
    return false;
  }
};

// Subscribe to questions (real-time updates)
export const subscribeToQuestions = (
  callback: (questions: Question[]) => void,
  filter?: QuestionFilter
) => {
  let q = query(collections.questions, orderBy('year', 'desc'));
  
  if (filter?.subject && filter.subject !== 'All') {
    q = query(q, where('subject', '==', filter.subject));
  }
  
  return onSnapshot(q, (snapshot) => {
    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));
    callback(questions);
  });
};

// Get unique years from questions
export const getUniqueYears = async (): Promise<number[]> => {
  try {
    const questions = await getAllQuestions();
    const years = [...new Set(questions.map(q => q.year))].sort((a, b) => b - a);
    return years;
  } catch (error) {
    console.error('Error getting years:', error);
    return [];
  }
};

// Get question count by subject
export const getQuestionCountBySubject = async (subject: string): Promise<number> => {
  try {
    const q = query(collections.questions, where('subject', '==', subject));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting question count:', error);
    return 0;
  }
};
