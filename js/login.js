
// document.getElementById("loginForm").addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     const user = {
//         userName: username,
//         password: password
//     };

//     try {
//         const response = await fetch("http://localhost:8080/public/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(user)
//         });

//         const data = await response.json();
//         const messageElement = document.getElementById("responseMessage");
//         if (response.ok) {
           
//             const token = data.token;
//             messageElement.style.color = "#28a745";
//             messageElement.textContent = "Login Successful!";
//             // Store the token locally
//             localStorage.setItem("jwtToken", token);
//             // Redirect to the dashboard
//             window.location.href = "/home.html";
//         } else {
           
//             const errorText = await response.text();
//             messageElement.style.color = "#dc3545";
//             messageElement.textContent = `Error:  ${data.error || 'Login failed. Please try again.'}`;
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         document.getElementById("responseMessage").style.color = "#dc3545";
//         document.getElementById("responseMessage").textContent = "Login failed. Please try again.";
//     }
// });

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = {
        userName: username,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8080/public/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();
        const messageElement = document.getElementById("responseMessage");
        if (response.ok) {
            const token = data.token;
            messageElement.style.color = "#28a745";
            messageElement.textContent = "Login Successful!";
            localStorage.setItem("jwtToken", token);
            window.location.href = "/home.html";
        } else {
            messageElement.style.color = "#dc3545";
            messageElement.textContent = `Error: ${data.error || 'Login failed. Please try again.'}`;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("responseMessage").style.color = "#dc3545";
        document.getElementById("responseMessage").textContent = "Login failed. Please try again.";
    }
});
