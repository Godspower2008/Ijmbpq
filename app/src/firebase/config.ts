import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
// import type { DocumentData, QuerySnapshot } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARvoLEDGHPLCOkvxf60Vt4_nd4x_y_ZZU",
  authDomain: "ijmb-portal.firebaseapp.com",
  databaseURL: "https://ijmb-portal-default-rtdb.firebaseio.com",
  projectId: "ijmb-portal",
  storageBucket: "ijmb-portal.firebasestorage.app",
  messagingSenderId: "521270251438",
  appId: "1:521270251438:web:3ed3d6742636f73f1bc23f",
  measurementId: "G-8F68K72WDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Firestore collection references
export const collections = {
  questions: collection(db, 'questions'),
  subjects: collection(db, 'subjects'),
  users: collection(db, 'users'),
  progress: collection(db, 'progress'),
  exams: collection(db, 'exams'),
  stats: collection(db, 'stats'),
  adminLogs: collection(db, 'adminLogs'),
};

// Auth helper functions
export const registerUser = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  await sendEmailVerification(userCredential.user);
  
  // Create user document in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid,
    email,
    displayName,
    role: 'student',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isVerified: false
  });
  
  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Update last login
  await updateDoc(doc(db, 'users', userCredential.user.uid), {
    lastLoginAt: new Date().toISOString()
  });
  
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  
  // Check if user exists in Firestore
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      role: 'student',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isVerified: true
    });
  } else {
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLoginAt: new Date().toISOString()
    });
  }
  
  return userCredential.user;
};

export const logoutUser = () => signOut(auth);

export const getCurrentUser = () => auth.currentUser;

export const onAuthChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const isAdmin = async (uid: string): Promise<boolean> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() && userDoc.data().role === 'admin';
};

export { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
};
