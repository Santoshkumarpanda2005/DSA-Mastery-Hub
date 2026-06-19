let startTime = Date.now();
let attempts = 0;

// Listen for the complete ACCEPTED result from inject.js
window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === "LEETCODE_ACCEPTED") {
        console.log("LeetCode Tracker: Received ACCEPTED payload from network intercept.");
        
        let interceptedData = event.data.data;
        let timeSpent = Math.floor((Date.now() - startTime) / 1000);

        let payload = {
            username: getUsername(),
            problemName: getProblemName(),
            difficulty: getDifficulty(),
            topic: getTopics(),
            timeSpent,
            attempts,
            accepted: true,
            runtime: interceptedData.runtime,
            memory: interceptedData.memory,
            code: interceptedData.code,
            language: interceptedData.language
        };

        console.log("LeetCode Tracker: Final Submission Payload:", payload);

        chrome.runtime.sendMessage({
            type: "problemSolved",
            data: payload
        });
    }
});

// Extract Username
function getUsername() {
    // Try to find a link that goes to a user profile (e.g., /u/santo/)
    const links = Array.from(document.querySelectorAll('a'));
    for (let link of links) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/u/') && href.length > 3) {
            return href.split('/')[2];
        }
    }
    
    // Fallback: look for avatar image alt text
    const avatarImg = document.querySelector('img[alt*="avatar" i]');
    if (avatarImg && avatarImg.alt && avatarImg.alt.toLowerCase() !== "avatar") {
        return avatarImg.alt.replace(/avatar/i, '').trim();
    }
    
    return "Anonymous";
}

// Extract Problem Title
function getProblemName() {
    // LeetCode's DOM changes frequently, making querySelectors unreliable.
    // The most robust way is to grab the problem slug from the URL.
    // Example: https://leetcode.com/problems/two-sum/ -> "two-sum"
    const urlParts = window.location.pathname.split('/');
    const slug = urlParts[2]; // Index 2 is always the problem slug
    
    if (slug) {
        // Convert "two-sum" to "Two Sum"
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return "Unknown Problem";
}

// Extract Difficulty
function getDifficulty() {
    let diff = document.querySelector('.text-difficulty-medium, .text-difficulty-easy, .text-difficulty-hard');
    return diff ? diff.innerText : "Unknown";
}

// Extract Tags/Topics
function getTopics() {
    let topics = [];
    document.querySelectorAll('a[href*="/tag/"]').forEach(tag => {
        topics.push(tag.innerText);
    });
    return topics;
}

// Detect Run and Submit Buttons to track attempts
document.addEventListener("click", (e) => {
    let text = e.target.innerText;
    if (text === "Run" || text === "Submit") {
        attempts++;
    }
});
