import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBZAP9enBrlyF7ll2DoVhwUuLWn0H7lJh0",
  authDomain: "sla-tracker-8beb4.firebaseapp.com",
  projectId: "sla-tracker-8beb4",
  storageBucket: "sla-tracker-8beb4.firebasestorage.app",
  messagingSenderId: "963995666263",
  appId: "1:963995666263:web:345811588b107898696012",
  measurementId: "G-7DZB82PZL9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;