$(document).ready(function () {
    const chatIdInput = $("#chatId");
    const botConfigForm = $("#botConfigForm");
    const responseMessage = $("#responseMessage");
    const botLinkBtn = $("#botLinkBtn");
    const CLOUD_FLARE_URL = "https://mobiletrackerrobot.trackphone.workers.dev/";

    // Function to handle user authentication state
    function handleAuthState(user) {
        if (!user) {
            window.location.href = "/"; // Redirect to homepage if not logged in
            return;
        }
        console.log("User is logged in:", user.uid); // Log user ID for verification

        // Check for chat_id parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const chatIdFromUrl = urlParams.get("chat_id");

        if (chatIdFromUrl && /^[0-9]{10}$/.test(chatIdFromUrl)) {
            // Auto-save chat ID if valid
            saveChatId(chatIdFromUrl, () => {
                sendWelcomeMessage(chatIdFromUrl);
                redirectToBot();
            });
        }
    }

    // Check if user is logged in; if not, redirect to home page
    firebase.auth().onAuthStateChanged((user) => {
        handleAuthState(user);
    });

    // Back to Logs button click event
    $("#backToLogsBtn").click(function () {
        window.location.href = "sms-view.html"; // Path to your message log page
    });

    // Form submission event
    botConfigForm.submit(function (e) {
        e.preventDefault();
        
        const chatId = chatIdInput.val();
        
        if (/^[0-9]{10}$/.test(chatId)) {
            saveChatId(chatId, () => {
                sendWelcomeMessage(chatId);
                responseMessage.html("<div class='alert alert-success'>Chat ID saved successfully.</div>");
                redirectToBot(); // Redirect after successful save and message sending
            });
        } else {
            responseMessage.html("<div class='alert alert-danger'>Please enter a valid 10-digit Chat ID.</div>");
        }
    });

    // Save Chat ID to Firebase
    function saveChatId(chatId, callback) {
        const user = firebase.auth().currentUser;
        if (user) {
            const userUid = user.uid;
            console.log("Saving Chat ID for user:", userUid); // Log user UID
            firebase.database().ref(`TrackPhone/${userUid}/user-info`).update({ "tg-chat-id": chatId })
                .then(() => {
                    console.log("Chat ID saved successfully.");
                    responseMessage.html("<div class='alert alert-success'>Chat ID saved successfully.</div>");
                    if (callback) callback(); // Call the callback if provided
                })
                .catch((error) => {
                    console.error("Error saving Chat ID:", error);
                    responseMessage.html("<div class='alert alert-danger'>Failed to save Chat ID. Please try again.</div>");
                });
        } else {
            responseMessage.html("<div class='alert alert-danger'>User not authenticated. Please log in.</div>");
        }
    }

    // Send a welcome message to the bot
    function sendWelcomeMessage(chatId) {
        const payload = {
            chat_id: chatId,
            message: "Congratulations! Bot connected successfully."
        };

        $.ajax({
            url: CLOUD_FLARE_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function () {
                console.log("Welcome message sent successfully.");
            },
            error: function (xhr, status, error) {
                console.error("Error sending welcome message:", error);
            }
        });
    }

    // Redirect to bot
    function redirectToBot() {
        window.location.href = "https://telegram.me/MobileTrackerRobot";
    }

    // Event for manual redirection if needed
    botLinkBtn.click(function (e) {
        e.preventDefault();
        if (chatIdInput.val() && /^[0-9]{10}$/.test(chatIdInput.val())) {
            redirectToBot();
        } else {
            responseMessage.html("<div class='alert alert-warning'>Please enter a valid Chat ID before continuing.</div>");
        }
    });
});
