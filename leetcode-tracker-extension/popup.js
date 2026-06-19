const API_URL = "https://dsa-mastery-hub.onrender.com/api/auth/login";

document.addEventListener('DOMContentLoaded', () => {
    const loginView = document.getElementById('loginView');
    const loggedInView = document.getElementById('loggedInView');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const statusDiv = document.getElementById('status');

    // Check if already logged in
    chrome.storage.local.get(['jwtToken'], function(result) {
        if (result.jwtToken) {
            loginView.classList.add('hidden');
            loggedInView.classList.remove('hidden');
        }
    });

    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        statusDiv.textContent = "Logging in...";
        statusDiv.style.color = "#38bdf8";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, leetcodeUsername: "" })
            });

            const data = await response.json();

            if (response.ok && data.access_token) {
                chrome.storage.local.set({ jwtToken: data.access_token }, () => {
                    loginView.classList.add('hidden');
                    loggedInView.classList.remove('hidden');
                    statusDiv.textContent = "";
                });
            } else {
                statusDiv.textContent = data.detail || "Login failed";
                statusDiv.style.color = "#ef4444";
            }
        } catch (error) {
            statusDiv.textContent = "Server error or offline";
            statusDiv.style.color = "#ef4444";
        }
    });

    logoutBtn.addEventListener('click', () => {
        chrome.storage.local.remove(['jwtToken'], () => {
            loggedInView.classList.add('hidden');
            loginView.classList.remove('hidden');
        });
    });
});
