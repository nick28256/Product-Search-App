// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyD072MDKKtXrJO6dy6UluN79qJx5TBrI7I",
    authDomain: "expotest-efa5a.firebaseapp.com",
    projectId: "expotest-efa5a",
    storageBucket: "expotest-efa5a.firebasestorage.app",
    messagingSenderId: "830164299556",
    appId: "1:830164299556:web:38717b621d877d08940db1",
    measurementId: "G-6QXET601EJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use getAuth for Expo Go compatibility
export const auth = getAuth(app);
