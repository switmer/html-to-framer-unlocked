// Function to always return false for disabling checks
function a() {
    // This function previously checked conditions to possibly disable the extension
    // Now, it simply returns false to keep the extension always enabled
    return false;
}

// Simplified async function to execute script 'a' in the context of a tab specified by tab ID 'e'
async function s(e) {
    // Always returns false since 'a()' has been simplified
    return false;
}

// Async function to send a message to the content script in a specified tab
async function o(e) {
    try {
        // Attempts to send a message to the specified tab and return the response
        return await chrome.tabs.sendMessage(e, { currentState: true });
    } catch {
        // If an error occurs (e.g., no receiving end), return undefined
        return;
    }
}

// Simplify event listeners to set the active icon or default icon without disabling the extension
chrome.tabs.onActivated.addListener(async function(e) {
    const { tabId: t } = e;
    chrome.action.setIcon({ path: await o(t) ? n : i });
});

chrome.webNavigation.onCompleted.addListener(async function(e) {
    chrome.action.setIcon({ path: await o(e.tabId) ? n : i });
});

chrome.action.onClicked.addListener(async function(e) {
    if (!e.id) return;
    const t = await o(e.id);
    if (t === void 0) {
        await chrome.scripting.insertCSS({ files: ["styles.css"], target: { tabId: e.id } });
        await chrome.scripting.executeScript({ target: { tabId: e.id }, files: ["build/main.js"] });
        chrome.action.setIcon({ path: n });
        return;
    }
    t || await chrome.scripting.insertCSS({ files: ["styles.css"], target: { tabId: e.id } });
    await chrome.tabs.sendMessage(e.id, { toggle: !0 });
    t && await chrome.scripting.removeCSS({ files: ["styles.css"], target: { tabId: e.id } });
    chrome.action.setIcon({ path: t ? i : n });
});

// Listener for messages sent to the background script, left as is since it does not disable the extension
chrome.runtime.onMessage.addListener(async (e, { tab: t }) => {
    e.close !== true || !(t != null && t.id) || (await chrome.tabs.sendMessage(t.id, { toggle: true }),
    await chrome.scripting.removeCSS({ files: ["styles.css"], target: { tabId: t.id } }),
    chrome.action.setIcon({ path: i }));
});

// Icon path variables for active and default states, unchanged
const n = {
    16: "../icons/active/icon16.png",
    32: "../icons/active/icon32.png",
    48: "../icons/active/icon48.png",
    128: "../icons/active/icon128.png"
},
i = {
    16: "../icons/default/icon16.png",
    32: "../icons/default/icon32.png",
    48: "../icons/default/icon48.png",
    128: "../icons/default/icon128.png"
};
