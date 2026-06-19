const NODE_BACKEND_URL = "https://dsa-mastery-hub.onrender.com/api/activity";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "problemSolved") {
        console.log("Extension: Sending data to backend...", request.data);

        chrome.storage.local.get(['jwtToken'], function(result) {
            const token = result.jwtToken;
            
            if (!token) {
                console.error("No JWT Token found! Backend requires login via the extension popup.");
                return;
            }

            // Send to the Node.js Backend on Render
            fetch(NODE_BACKEND_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(request.data)
            })
            .then(response => response.json())
            .then(data => console.log("Extension: Successfully saved to Node.js DB!", data))
            .catch(error => console.error("Extension: Error saving to Node.js DB", error));
        });
    }
});
