$(document).ready(function () {
    $("#resetBtn").click(async function () {
        const email = $("#resetEmail").val();
        try {
            await auth.sendPasswordResetEmail(email);
            alert("Password reset email sent.");
            window.location.href = "index.html";
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
});
