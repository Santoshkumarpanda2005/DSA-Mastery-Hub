let startTime = Date.now();
let attempts = 0;

// Function to robustly get difficulty and topics
async function getProblemDetails(slug) {
    let details = { difficulty: "Unknown", topics: [] };

    // 1. Try DOM for Difficulty
    let diffNode = document.querySelector('.text-difficulty-medium, .text-difficulty-easy, .text-difficulty-hard');
    if (diffNode && diffNode.innerText) {
        details.difficulty = diffNode.innerText;
    } else {
        // Alternative DOM check for difficulty
        let altDiff = document.querySelector('.bg-olive, .bg-yellow, .bg-red');
        if (altDiff && altDiff.innerText) details.difficulty = altDiff.innerText;
    }

    // 2. Try DOM for Topics
    document.querySelectorAll('a[href*="/tag/"]').forEach(tag => {
        details.topics.push(tag.innerText);
    });

    // 3. Fallback to GraphQL if either is missing
    if (details.difficulty === "Unknown" || details.topics.length === 0) {
        try {
            const response = await fetch('https://leetcode.com/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `query getQuestionDetail($titleSlug: String!) { question(titleSlug: $titleSlug) { difficulty topicTags { name } } }`,
                    variables: { titleSlug: slug }
                })
            });
            const data = await response.json();
            if (data && data.data && data.data.question) {
                if (details.difficulty === "Unknown" && data.data.question.difficulty) {
                    details.difficulty = data.data.question.difficulty;
                }
                if (details.topics.length === 0 && data.data.question.topicTags) {
                    details.topics = data.data.question.topicTags.map(tag => tag.name);
                }
            }
        } catch (e) {
            console.error("Tracker: Error fetching details via GraphQL", e);
        }
    }

    return details;
}

// Listen for the complete ACCEPTED result from inject.js
if (!window.leetcodeTrackerInjected) {
    window.leetcodeTrackerInjected = true;
    window.addEventListener("message", async (event) => {
        if (event.source !== window) return;
        
        if (event.data.type === "LEETCODE_ACCEPTED") {
            console.log("LeetCode Tracker: Received ACCEPTED payload from network intercept.");
            
            let interceptedData = event.data.data;
            let timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            const urlParts = window.location.pathname.split('/');
            const slug = urlParts[2]; // Index 2 is always the problem slug

            const details = await getProblemDetails(slug);

            let payload = {
                username: getUsername(),
                problemName: getProblemName(),
                difficulty: details.difficulty,
                topic: details.topics,
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

            // Reset trackers for the next problem
            startTime = Date.now();
            attempts = 0;
        }
    });
}

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

// Detect Run and Submit Buttons to track attempts
document.addEventListener("click", (e) => {
    let text = e.target.innerText;
    if (text === "Run" || text === "Submit") {
        attempts++;
    }
});
