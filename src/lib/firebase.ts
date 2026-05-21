import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAS0U0r-iIIE1fpl1_khdP_fG0_SBxii_k',
  authDomain: 'pixel-office-293d6.firebaseapp.com',
  databaseURL: 'https://pixel-office-293d6-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'pixel-office-293d6',
  storageBucket: 'pixel-office-293d6.firebasestorage.app',
  messagingSenderId: '208235910225',
  appId: '1:208235910225:web:bba913cba049ddbe179470',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
