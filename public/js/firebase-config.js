// js/firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyDqglBTk9OHEYpkTpLd-sfMOJYhFpfS3sk",
    authDomain: "freetrackphone.firebaseapp.com",
    databaseURL: "https://freetrackphone-default-rtdb.firebaseio.com",
    projectId: "freetrackphone",
    storageBucket: "freetrackphone.appspot.com",
    messagingSenderId: "977909417074",
    appId: "1:977909417074:web:a2999495cbbc622cfaaeeb",
    measurementId: "G-LDH8WNHL5X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
