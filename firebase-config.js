import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAXzw_g1r7kvYC2d6_d4RqDOoTF_svAphc",

  authDomain: "typenext-5bd90.firebaseapp.com",

  projectId: "typenext-5bd90",

  storageBucket: "typenext-5bd90.firebasestorage.app",

  messagingSenderId: "848488048236",

  appId: "1:848488048236:web:a742a647977a48ca63da49",

  measurementId: "G-B5WGZM350T"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);