


document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
        userName: username,
        email: email,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8080/public/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const messageElement = document.getElementById("responseMessage");
        if (response.ok) {
            messageElement.style.color = "#28a745";
            messageElement.textContent = "Registration Successful! You can now log in.";
        } else {
            const message = await response.text();
            messageElement.style.color = "#dc3545";
            messageElement.textContent = `Error: ${message}`;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("responseMessage").textContent = "Registration failed. Please try again.";
    }
});
