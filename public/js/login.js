$(document).ready(function () {
    const defaultRedirectUrl = "sms-view.html"; // Fallback URL

    auth.onAuthStateChanged((user) => {
        if (user) {
            if (user.emailVerified) {
                // Redirect to the referring URL or fallback to the default URL
                const referrerUrl = document.referrer || defaultRedirectUrl;
                window.location.href = referrerUrl;
            } else {
                // Check if we've already prompted the user to verify their email in this session
                if (!localStorage.getItem("emailVerificationPrompted")) {
                    // Set the flag in localStorage to avoid prompting again this session
                    localStorage.setItem("emailVerificationPrompted", "true");

                    // Attempt to send a verification email and alert the user
                    user.sendEmailVerification().then(() => {
                        alert("Your email is not verified. A verification link has been sent to your email. Please verify before logging in.");
                    }).catch((error) => {
                        alert("Error sending verification email: " + error.message);
                    }).finally(() => {
                        // Log the user out after the verification email is sent
                        auth.signOut();
                    });
                } else {
                    // Log the user out if they've already been prompted
                    auth.signOut();
                }
            }
        }
    });

    // Login function
    $("#loginBtn").click(async function () {
        const email = $("#email").val();
        const password = $("#password").val();
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            if (user.emailVerified) {
                // Redirect to the referring URL or fallback to the default URL
                const referrerUrl = document.referrer || defaultRedirectUrl;
                window.location.href = referrerUrl;
            } else {
                // Check if email verification prompt has already been shown
                if (!localStorage.getItem("emailVerificationPrompted")) {
                    localStorage.setItem("emailVerificationPrompted", "true");
                    await user.sendEmailVerification()
                        .then(() => {
                            alert("Your email is not verified. A verification link has been sent to your email. Please verify before logging in.");
                        })
                        .catch((error) => {
                            // Handle the case where the email sending fails
                            alert("Error sending verification email: " + error.message);
                            // Specifically handle the case where Google blocks the request due to too many attempts
                            if (error.code === 'auth/too-many-requests') {
                                alert("Too many requests. Please wait a while before trying again.");
                            }
                        });
                }
                // Log out the user if email is not verified
                auth.signOut();
            }
        } catch (error) {
            // Handle login errors
            if (error.code === 'auth/user-not-found') {
                alert("Error: No user found with this email.");
            } else if (error.code === 'auth/wrong-password') {
                alert("Error: Incorrect password.");
            } else {
                alert("Error: " + error.message);
            }
        }
    });

    // Google login function
    $("#googleLoginBtn").click(async function () {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            const user = result.user;
            if (user.emailVerified || user.providerData[0].providerId === "google.com") {
                // Redirect to the referring URL or fallback to the default URL
                const referrerUrl = document.referrer || defaultRedirectUrl;
                window.location.href = referrerUrl;
            } else {
                // Check if email verification prompt has already been shown
                if (!localStorage.getItem("emailVerificationPrompted")) {
                    localStorage.setItem("emailVerificationPrompted", "true");
                    await user.sendEmailVerification()
                        .then(() => {
                            alert("Your email is not verified. A verification link has been sent to your email. Please verify before logging in.");
                        })
                        .catch((error) => {
                            // Handle the case where the email sending fails
                            alert("Error sending verification email: " + error.message);
                            // Specifically handle the case where Google blocks the request due to too many attempts
                            if (error.code === 'auth/too-many-requests') {
                                alert("Too many requests. Please wait a while before trying again.");
                            }
                        });
                }
                // Log out the user if email is not verified
                auth.signOut();
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
});
