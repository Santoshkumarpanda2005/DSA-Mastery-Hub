// This script is injected into the MAIN world (page context)
// to intercept the fetch requests made by LeetCode's SPA.

const originalFetch = window.fetch;

let lastSubmission = {
    code: "",
    lang: ""
};

window.fetch = async (...args) => {
    const url = args[0];
    const options = args[1];

    // 1. Intercept the Submit Request (POST) to grab the code
    if (url && typeof url === 'string' && url.includes('/submit/')) {
        try {
            if (options && options.body) {
                const bodyStr = typeof options.body === 'string' ? options.body : new TextDecoder().decode(options.body);
                const parsed = JSON.parse(bodyStr);
                
                if (parsed.typed_code) {
                    lastSubmission.code = parsed.typed_code;
                    lastSubmission.lang = parsed.lang;
                    console.log('LeetCode Tracker: Intercepted Code Submission');
                }
            }
        } catch (e) {
            console.error('LeetCode Tracker: Error intercepting submit payload:', e);
        }
    }

    // Call the original fetch so the page continues working normally
    const response = await originalFetch(...args);

    // 2. Intercept the Check Result Request (GET) to see if it was Accepted
    if (url && typeof url === 'string' && url.includes('/check/')) {
        try {
            // We MUST clone the response so we don't consume the stream and break LeetCode's UI
            const clone = response.clone();
            const data = await clone.json();

            if (data && data.state === 'SUCCESS' && data.status_msg === 'Accepted') {
                console.log('LeetCode Tracker: Intercepted Accepted Result!', data);

                // Only send if we actually captured the code for this submission
                if (lastSubmission.code) {
                    window.postMessage({
                        type: 'LEETCODE_ACCEPTED',
                        data: {
                            code: lastSubmission.code,
                            language: lastSubmission.lang,
                            runtime: data.status_runtime || "Unknown ms",
                            memory: data.status_memory || "Unknown MB"
                        }
                    }, '*');
                    
                    // Clear out the submission so we don't fire duplicates
                    lastSubmission.code = "";
                    lastSubmission.lang = "";
                }
            }
        } catch (e) {
            console.error('LeetCode Tracker: Error intercepting check response:', e);
        }
    }

    return response;
};
