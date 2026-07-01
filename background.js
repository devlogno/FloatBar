let memoryWindowMap = null;

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function getWindowMap() {
    if (memoryWindowMap !== null) return memoryWindowMap;
    const result = await chrome.storage.local.get(['openedWindows']);
    memoryWindowMap = result.openedWindows || {};
    return memoryWindowMap;
}

async function setWindowMap(map) {
    memoryWindowMap = map;
    await chrome.storage.local.set({ openedWindows: map });
}

let memoryAppBounds = null;
let boundsDebounceTimer = null;

async function getAppBounds() {
    if (memoryAppBounds !== null) return memoryAppBounds;
    const result = await chrome.storage.local.get(['appBounds']);
    memoryAppBounds = result.appBounds || {};
    return memoryAppBounds;
}

function setAppBounds(bounds) {
    memoryAppBounds = bounds;
    // Debounce physical storage writes to avoid hitting Chrome's write limits during dragging/resizing
    clearTimeout(boundsDebounceTimer);
    boundsDebounceTimer = setTimeout(() => {
        chrome.storage.local.set({ appBounds: memoryAppBounds });
    }, 500);
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.appBounds) {
        memoryAppBounds = changes.appBounds.newValue || {};
    }
});

chrome.windows.onBoundsChanged.addListener((win) => {
    getWindowMap().then(windowMap => {
        let matchedAppId = null;
        for (const [appId, storedWinId] of Object.entries(windowMap)) {
            if (storedWinId === win.id) {
                matchedAppId = appId;
                break;
            }
        }
        
        if (matchedAppId) {
            getAppBounds().then(boundsMap => {
                boundsMap[matchedAppId] = {
                    left: win.left,
                    top: win.top,
                    width: win.width,
                    height: win.height
                };
                setAppBounds(boundsMap);
            });
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openWindow') {
        const appId = request.appId;
        const appUrl = request.appUrl;

        getWindowMap().then(windowMap => {
            const existingWinId = windowMap[appId];

            if (existingWinId) {
                chrome.windows.update(existingWinId, { focused: true }).catch(() => {
                    // Window was mostly likely closed or stale, so we create a new one
                    createNewAppWindow(appId, appUrl, windowMap);
                });
            } else {
                createNewAppWindow(appId, appUrl, windowMap);
            }
        });

        sendResponse({ status: "ok" });
        return true;
    }

    if (request.action === 'minimizeCurrentWindow') {
        chrome.windows.update(sender.tab.windowId, { state: "minimized" });
        sendResponse({ status: "ok" });
        return true;
    }

    if (request.action === 'restoreCurrentWindow') {
        chrome.windows.update(sender.tab.windowId, { state: "normal", focused: true });
        sendResponse({ status: "ok" });
        return true;
    }

    if (request.action === 'resizeCurrentWindow') {
        // Only update dimensions, keep it minimized if it is
        chrome.windows.update(sender.tab.windowId, { width: request.width, height: request.height });
        sendResponse({ status: "ok" });
        return true;
    }

    if (request.action === 'closeCurrentWindow') {
        chrome.windows.remove(sender.tab.windowId);
        sendResponse({ status: "ok" });
        return true;
    }

    if (request.action === 'downloadIcon') {
        fetch(request.iconUrl)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                const contentType = res.headers.get('content-type') || 'image/x-icon';
                return res.arrayBuffer().then(buffer => ({ buffer, contentType }));
            })
            .then(({ buffer, contentType }) => {
                const base64 = arrayBufferToBase64(buffer);
                sendResponse({ dataUrl: `data:${contentType};base64,${base64}` });
            })
            .catch(err => {
                sendResponse({ dataUrl: null, error: err.message });
            });
        return true;
    }

    if (request.action === 'checkIfAppWindow') {
        if (sender && sender.tab && sender.tab.windowId) {
            chrome.windows.get(sender.tab.windowId, (win) => {
                // If window type is popup, it is highly likely to be the extension app window
                sendResponse(win.type === 'popup');
            });
            return true;
        }
        sendResponse(false);
        return true;
    }
});

// Detect popup closure to collapse sidebar
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup-monitor") {
        port.onDisconnect.addListener(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "closeSidebar" }).catch(() => {});
                }
            });
        });
    }
});


// Purge closed windows from reference map
chrome.windows.onRemoved.addListener((windowId) => {
    getWindowMap().then(windowMap => {
        let modified = false;
        for (const [appId, storedWinId] of Object.entries(windowMap)) {
            if (storedWinId === windowId) {
                delete windowMap[appId];
                modified = true;
                break;
            }
        }
        if (modified) {
            setWindowMap(windowMap);
        }
    });
});

// Setup Right-Click Context Menus
chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.setUninstallURL("https://devlogno.github.io/Extensions/?p=leaving&ext=FloatBar%20Apps%20Always%20On%20Top");

    chrome.contextMenus.create({
        id: "pip-current-page",
        title: chrome.i18n.getMessage("alwaysOnTopContextMenu"),
        contexts: ["page"]
    });
    chrome.contextMenus.create({
        id: "add-to-sidebar",
        title: chrome.i18n.getMessage("addToFloatBarContextMenu"),
        contexts: ["page"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab) return;
    if (info.menuItemId === "pip-current-page") {
        chrome.tabs.sendMessage(tab.id, { action: "triggerPipCurrentPage" }).catch(() => {});
    } else if (info.menuItemId === "add-to-sidebar") {
        chrome.tabs.sendMessage(tab.id, { action: "addToSidebar" }).catch(() => {});
    }
});

function createNewAppWindow(appId, url, windowMap) {
    getAppBounds().then(boundsMap => {
        const bounds = boundsMap[appId] || { width: 400, height: 600 };
        
        const createOptions = {
            url: url,
            type: "popup",
            width: bounds.width,
            height: bounds.height
        };

        // Restore precise position if previously saved
        if (bounds.left !== undefined) createOptions.left = bounds.left;
        if (bounds.top !== undefined) createOptions.top = bounds.top;

        chrome.windows.create(createOptions).then(win => {
            windowMap[appId] = win.id;
            setWindowMap(windowMap);
        }).catch(err => {
            console.error("Failed to create window:", err);
        });
    });
}
