$(document).ready(function () {
    $("#registerBtn").click(async function () {
        const email = $("#regEmail").val();
        const password = $("#regPassword").val();
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            alert("Registration successful. A verification email has been sent to your email. Please verify before logging in.");
            await user.sendEmailVerification();
            window.location.href = "index.html";
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
});
