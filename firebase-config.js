// Firebase Configuration
// Replace these values with your Firebase project credentials
// Get these from: Firebase Console → Project Settings → Your Apps

const firebaseConfig = {
  apiKey: "AIzaSyDYfV-qZ7pL3M4nQrStUvWxYzAbCd5FgHk",
  authDomain: "bank-of-america-app.firebaseapp.com",
  projectId: "bank-of-america-app",
  storageBucket: "bank-of-america-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references
const auth = firebase.auth();
const db = firebase.database();

console.log("✅ Firebase initialized successfully");
