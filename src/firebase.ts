import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore specifying the database id if it differs from (default)
const db = getFirestore(app);

export { db, collection, getDocs, addDoc, setDoc, doc, updateDoc, query, orderBy, onSnapshot };
