// Context Menu Listeners
function createPipControls(onPip, onCancel) {
    const host = document.createElement('div');
    host.id = 'pip-controls-root';
    host.style.cssText = 'position: fixed; top: 12px; left: 50%; transform: translateX(-50%); z-index: 2147483647; pointer-events: none;';
    
    const shadow = host.attachShadow({ mode: 'open' });
    
    const style = document.createElement('style');
    style.textContent = `
        :host {
            --bg: rgba(255, 255, 255, 0.4);
            --border: rgba(255, 255, 255, 0.5);
            --text: #1a1a1a;
            --accent: #ff7300;
            --hover: rgba(0, 0, 0, 0.08);
            --shadow: rgba(0, 0, 0, 0.1);
        }
        @media (prefers-color-scheme: dark) {
            :host {
                --bg: rgba(20, 20, 20, 0.4);
                --border: rgba(255, 255, 255, 0.15);
                --text: #f5f5f5;
                --hover: rgba(255, 255, 255, 0.15);
                --shadow: rgba(0, 0, 0, 0.4);
            }
        }
        .pill-bar {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 8px;
            background: var(--bg);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid var(--border);
            border-radius: 100px;
            box-shadow: 
                0 10px 30px -5px var(--shadow),
                0 0 0 1px rgba(0,0,0,0.02);
            pointer-events: auto;
            animation: slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pill-bar:hover {
            transform: translateY(2px);
            box-shadow: 0 15px 35px -5px var(--shadow);
            background: rgba(255, 255, 255, 0.5);
        }
        @media (prefers-color-scheme: dark) {
            .pill-bar:hover { background: rgba(30, 30, 30, 0.5); }
        }
        @keyframes slideDown {
            from { transform: translateY(-60px) scale(0.9); opacity: 0; filter: blur(10px); }
            to { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes slideUp {
            from { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
            to { transform: translateY(-60px) scale(0.9); opacity: 0; filter: blur(10px); }
        }
        .pill-bar.exit {
            animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 34px;
            border: none;
            border-radius: 100px;
            background: transparent;
            color: var(--text);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 0 12px;
            font-weight: 500;
        }
        button:hover { background: var(--hover); }
        button#pip-btn {
            background: var(--accent);
            color: white;
            font-weight: 600;
            font-size: 13.5px;
            gap: 8px;
            padding: 0 16px;
            box-shadow: 0 4px 12px rgba(255, 115, 0, 0.25);
        }
        button#pip-btn:hover { 
            background: #ff851a; 
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(255, 115, 0, 0.35);
        }
        button#pip-btn:active { transform: translateY(0); }
        button#close-btn { 
            width: 34px;
            padding: 0;
            color: var(--text); 
            opacity: 0.6; 
        }
        button#close-btn:hover { 
            opacity: 1; 
            background: rgba(255, 59, 48, 0.15); 
            color: #ff3b30; 
        }
        .divider {
            width: 1px;
            height: 14px;
            background: var(--border);
            margin: 0 2px;
            opacity: 0.5;
        }
    `;
    
    const bar = document.createElement('div');
    bar.className = 'pill-bar';
    bar.innerHTML = `
        <button id="pip-btn" title="${chrome.i18n.getMessage("pipStartTitle")}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pip" viewBox="0 0 16 16">
            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"/>
            <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z"/>
            </svg>
            ${chrome.i18n.getMessage("pipButtonText")}
        </button>
        <div class="divider"></div>
        <button id="close-btn" title="${chrome.i18n.getMessage("dismiss")}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;
    
    bar.querySelector('#pip-btn').onclick = onPip;
    bar.querySelector('#close-btn').onclick = onCancel;
    
    shadow.appendChild(style);
    shadow.appendChild(bar);
    
    host.removeWithAnimation = () => {
        bar.classList.add('exit');
        bar.addEventListener('animationend', () => {
            host.remove();
        }, { once: true });
        // Fallback for safety
        setTimeout(() => host.remove(), 600);
    };
    
    document.documentElement.appendChild(host);
    return host;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'addToSidebar') {
        const title = document.title || window.location.hostname;
        const url = window.location.href;
        
        let icon = '';
        const icons = [...document.querySelectorAll('link[rel~="icon"]')];
        if (icons.length > 0) icon = icons[icons.length - 1].href;
        else icon = window.location.origin + '/favicon.ico';

        chrome.runtime.sendMessage({ action: 'downloadIcon', iconUrl: icon }, (response) => {
            let finalIcon = icon;
            if (response && response.dataUrl) finalIcon = response.dataUrl;

            chrome.storage.local.get(['sidebarApps'], (result) => {
                const apps = result.sidebarApps || [];
                apps.push({
                    id: 'app-' + Date.now(),
                    name: title.substring(0, 15) + (title.length > 15 ? '...' : ''),
                    url: url,
                    icon: finalIcon,
                    pip: false
                });
                chrome.storage.local.set({ sidebarApps: apps });
                
                const toast = document.createElement('div');
                toast.style.cssText = 'position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 2147483647; background: #2c2c2e; color: white; padding: 12px 24px; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); animation: toastSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), toastFadeOut 0.3s ease-in 2.7s forwards; display: flex; align-items: center; gap: 10px; pointer-events: none;';
                
                toast.innerHTML = `
                    <div style="background: #ff7300; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 8px rgba(52, 199, 89, 0.6);"></div>
                    ${chrome.i18n.getMessage("addedToApps", [title])}
                `;

                const style = document.createElement('style');
                style.textContent = `
                    @keyframes toastSlideUp { from { transform: translate(-50%, 100px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
                    @keyframes toastFadeOut { from { transform: translate(-50%, 0); opacity: 1; } to { transform: translate(-50%, 20px); opacity: 0; } }
                `;
                if (document.head) {
                    document.head.appendChild(style);
                    document.body.appendChild(toast);
                    setTimeout(() => {
                        toast.remove();
                        style.remove();
                    }, 3000);
                }
            });
        });
    }

    if (request.action === 'triggerPipCurrentPage') {
        if (!('documentPictureInPicture' in window)) {
            alert("Document Picture-in-Picture is not supported in this browser.");
            return;
        }

        const controls = createPipControls(async () => {
            controls.removeWithAnimation();
            try {
                const pipWindow = await documentPictureInPicture.requestWindow({ width: 400, height: 600 });
                pipWindow.document.body.style.margin = '0';
                
                const iframe = pipWindow.document.createElement('iframe');
                iframe.src = window.location.href;
                iframe.style.width = '100vw';
                iframe.style.height = '100vh';
                iframe.style.border = 'none';
                
                pipWindow.document.body.appendChild(iframe);

                window.onbeforeunload = (e) => { e.preventDefault(); e.returnValue = ''; };
                pipWindow.addEventListener("pagehide", () => { window.onbeforeunload = null; });

            } catch (e) {
                alert("Failed to start PiP: " + e.message);
            }
        }, () => {
            controls.removeWithAnimation();
        });
        
        setTimeout(() => controls && controls.parentNode && controls.removeWithAnimation(), 10000);
    }
    if (request.action === 'openSidebar') {
        const root = document.getElementById('quick-access-sidebar-root');
        if (root && root._sidebarApi) root._sidebarApi.applySidebarState(false);
        sendResponse({ status: 'ok' });
    }
    if (request.action === 'closeSidebar') {
        const root = document.getElementById('quick-access-sidebar-root');
        if (root && root._sidebarApi) root._sidebarApi.applySidebarState(true);
        sendResponse({ status: 'ok' });
    }
});

// PiP Host Tab Interceptor
if (window.location.search.includes('alwaysOnTop=true')) {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('appId');

    const injectOverlay = () => {
        if (!document.body) return requestAnimationFrame(injectOverlay);

        let cachedBounds = { width: 400, height: 600 };
        chrome.storage.local.get(['appBounds'], (res) => {
            if (res.appBounds && res.appBounds[appId]) {
                cachedBounds = res.appBounds[appId];
            }
        });

        const controls = createPipControls(async () => {
            try {
                const pipWindow = await documentPictureInPicture.requestWindow({ 
                    width: cachedBounds.width, 
                    height: cachedBounds.height 
                });
                
                pipWindow.document.body.style.margin = '0';
                pipWindow.document.body.style.overflow = 'hidden';
                
                const iframe = pipWindow.document.createElement('iframe');
                iframe.style.width = '100vw';
                iframe.style.height = '100vh';
                iframe.style.border = 'none';
                iframe.setAttribute('allow', 'fullscreen; camera; microphone; display-capture; autoplay; encrypted-media');
                
                pipWindow.document.body.appendChild(iframe);
                
                const cleanUrl = new URL(window.location.href);
                cleanUrl.searchParams.delete('alwaysOnTop');
                cleanUrl.searchParams.delete('appId');
                iframe.src = cleanUrl.toString();
                
                controls.removeWithAnimation();
                    
                    // Black out and freeze the host window to prevent double audio/video playback
                    document.body.innerHTML = '';
                    document.body.style.backgroundColor = 'black';
                    const msg = document.createElement('div');
                    msg.style.cssText = 'color: #555; font-family: sans-serif; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;';
                    msg.innerHTML = `<h3 style="margin-bottom: 8px;">${chrome.i18n.getMessage("pipIsActive")}</h3><p style="font-size: 14px;">${chrome.i18n.getMessage("backgroundRunning")}</p>`;
                    document.body.appendChild(msg);

                    document.title = chrome.i18n.getMessage("pipActiveTitle");
                    let link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.head.appendChild(link);
                    }
                    link.href = chrome.runtime.getURL('images/icon48.png');

                    chrome.runtime.sendMessage({ action: 'minimizeCurrentWindow' });

                    let resizeTimeout;
                    pipWindow.addEventListener('resize', () => {
                        clearTimeout(resizeTimeout);
                        resizeTimeout = setTimeout(() => {
                            if (!appId) return;
                            chrome.storage.local.get(['appBounds'], (r) => {
                                const currentBounds = r.appBounds || {};
                                currentBounds[appId] = {
                                    ...currentBounds[appId],
                                    width: pipWindow.innerWidth,
                                    height: pipWindow.innerHeight
                                };
                                chrome.storage.local.set({ appBounds: currentBounds });
                            });
                            
                            // Dynamically resize the background host window to keep them identical
                            chrome.runtime.sendMessage({ 
                                action: 'resizeCurrentWindow', 
                                width: pipWindow.innerWidth, 
                                height: pipWindow.innerHeight 
                            });
                        }, 500);
                    });

                    window.onbeforeunload = (e) => {
                        e.preventDefault();
                        e.returnValue = ''; 
                    };

                    pipWindow.addEventListener("pagehide", () => {
                        window.onbeforeunload = null;
                        chrome.runtime.sendMessage({ action: 'restoreCurrentWindow' });
                        window.location.href = cleanUrl.toString();
                    });
            } catch (e) {
                alert("Failed to start PiP: " + e.message);
            }
        }, () => {
            controls.removeWithAnimation();
            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete('alwaysOnTop');
            cleanUrl.searchParams.delete('appId');
            history.replaceState(null, '', cleanUrl.toString());
        });
    };
    injectOverlay();
} else if (window === window.top && !document.getElementById('quick-access-sidebar-root')) {
    chrome.runtime.sendMessage({ action: 'checkIfAppWindow' }, (isApp) => {
        if (!isApp && !document.getElementById('quick-access-sidebar-root')) {
            chrome.storage.local.get(['blacklistedDomains', 'handleOpacity', 'handleSize', 'sidebarCollapsed'], (res) => {
                const blacklist = res.blacklistedDomains || [];
                if (blacklist.includes(window.location.hostname)) return;

                const runInit = () => {
                    if (!document.getElementById('quick-access-sidebar-root')) initSidebar(res);
                };
                if (document.body) {
                    runInit();
                } else {
                    document.addEventListener('DOMContentLoaded', runInit);
                }
            });
        }
    });
}

// Global storage listener for dynamic updates
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;

    const root = document.getElementById('quick-access-sidebar-root');
    const hostname = window.location.hostname;

    // Handle Blacklist changes
    if (changes.blacklistedDomains) {
        const blacklist = changes.blacklistedDomains.newValue || [];
        const isBlacklisted = blacklist.includes(hostname);
        
        if (isBlacklisted && root) {
            root.remove();
        } else if (!isBlacklisted && !root) {
            chrome.runtime.sendMessage({ action: 'checkIfAppWindow' }, (isApp) => {
                if (!isApp && window === window.top) {
                    chrome.storage.local.get(['handleOpacity', 'handleSize', 'sidebarCollapsed'], (settings) => {
                        initSidebar(settings);
                    });
                }
            });
        }
    }

    // Handle Sidebar Content/State changes if sidebar exists
    if (root && root._sidebarApi) {
        if (changes.sidebarApps) root._sidebarApi.renderApps(changes.sidebarApps.newValue);
        if (changes.sidebarCollapsed) root._sidebarApi.applySidebarState(!!changes.sidebarCollapsed.newValue);
        if (changes.handleOpacity || changes.handleSize) root._sidebarApi.updateHandleStyles();
    }
});

function initSidebar(settings = {}) {
    const initialOpacity = (settings.handleOpacity || 85) / 100;
    const initialSize = settings.handleSize || 48;
    const initialMarginTop = -(initialSize / 2);
    const initialCollapsed = settings.sidebarCollapsed === undefined ? false : !!settings.sidebarCollapsed;
    // 1. (Formerly Page Style adjustments - now removed since it hovers instead)

    // 2. Create Host for Shadow DOM
    const host = document.createElement('div');
    host.id = 'quick-access-sidebar-root';
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.left = '0';
    host.style.width = '100%'; // Using 100% respects the scrollbar width on Windows
    host.style.height = '100%';
    host.style.zIndex = '2147483647'; // Maximum possible z-index
    host.style.pointerEvents = 'none'; // Pass clicks through to the website behind it

    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    // 3. Shadow DOM CSS (Completely isolated from host website)
    const style = document.createElement('style');
    style.textContent = `
        :host {
            --sidebar-bg: rgba(255, 255, 255, 0.85);
            --border-color: rgba(0, 0, 0, 0.1);
            --dock-item-bg: #ffffff;
            --text-color: #333;
            --text-muted: #555;
            --modal-bg: #ffffff;
            --input-border: #ddd;
            --input-text: #000;
            --add-btn-bg: #f0f0f5;
            --add-btn-hover: #e4e4e9;
            --tooltip-bg: #333;
            --tooltip-text: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
        }
        @media (prefers-color-scheme: dark) {
            :host {
                --sidebar-bg: rgba(30, 30, 30, 0.85);
                --border-color: rgba(255, 255, 255, 0.1);
                --dock-item-bg: #2c2c2e;
                --text-color: #e0e0e0;
                --text-muted: #999;
                --modal-bg: #2c2c2e;
                --input-border: #444;
                --input-text: #fff;
                --add-btn-bg: #3a3a3c;
                --add-btn-hover: #48484a;
                --tooltip-bg: #e0e0e0;
                --tooltip-text: #111;
                --handle-bg: 30, 30, 30;
            }
        }
        :host {
            --handle-opacity: ${initialOpacity};
            --handle-bg: 255, 255, 255;
        }
        #sidebar-wrapper {
            position: absolute; top: 0; right: 0; width: 52px; height: 100vh;
            pointer-events: none; z-index: 100;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #sidebar-wrapper.collapsed { transform: translateX(100%); }
        #sidebar {
            position: absolute; top: 0; right: 0; width: 100%; height: 100%;
            background: var(--sidebar-bg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); 
            border-left: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; 
            justify-content: flex-start; box-sizing: border-box; box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05); 
            overflow-y: auto; overflow-x: hidden; pointer-events: auto;
        }
        #sidebar::before, #sidebar::after {
            content: '';
            flex: 1;
            min-height: 12px;
            pointer-events: none;
        }
        #sidebar::-webkit-scrollbar { display: none; }
        #toggle-btn {
            position: absolute; top: 50%; left: -24px; width: 24px; height: ${initialSize}px; margin-top: ${initialMarginTop}px;
            background: var(--sidebar-bg); border: 1px solid var(--border-color); border-right: none;
            border-radius: 8px 0 0 8px; display: flex; justify-content: center; align-items: center; cursor: pointer;
            color: var(--text-muted); opacity: var(--handle-opacity);
            box-shadow: -4px 0 8px rgba(0, 0, 0, 0.05); transition: background-color 0.2s, color 0.2s, opacity 0.2s; pointer-events: auto;
        }
        #toggle-btn:hover { background-color: var(--add-btn-hover); color: var(--text-color); }
        #toggle-btn svg { width: 16px; height: 16px; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        #sidebar-wrapper.collapsed #toggle-btn svg { transform: rotate(180deg); }
        .dock-item {
            width: 38px; height: 38px; min-height: 38px; margin-bottom: 12px; border-radius: 10px;
            background-color: var(--dock-item-bg); display: flex; justify-content: center; align-items: center;
            cursor: pointer; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease;
            position: relative; user-select: none; color: var(--text-color);
        } 
        .dock-item:hover { transform: scale(1.1); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); z-index: 5; }
        .dock-item.active { box-shadow: 0 0 0 2px #ff7300; }
        .dock-item img { width: 22px; height: 22px; object-fit: contain; pointer-events: none; }
        .dock-item .app-initial { font-size: 16px; font-weight: 600; color: var(--text-color); text-transform: uppercase; pointer-events: none; }
        .dock-item[data-id="add-btn"] { background-color: var(--add-btn-bg); color: var(--text-muted); font-size: 20px; font-weight: 300; }
        .dock-item[data-id="add-btn"]:hover { background-color: var(--add-btn-hover); color: var(--text-color); }
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: flex; justify-content: center;
            align-items: center; z-index: 200; visibility: hidden; opacity: 0; transition: opacity 0.2s ease; pointer-events: auto;
        }
        .modal-overlay.show { visibility: visible; opacity: 1; }
        .modal-content {
            background: var(--modal-bg); padding: 24px; border-radius: 16px; width: 280px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); transform: scale(0.95); transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); color: var(--text-color);
        }
        .modal-overlay.show .modal-content { transform: scale(1); }
        .modal-content h3 { margin-top: 0; margin-bottom: 20px; font-size: 18px; color: var(--text-color); }
        .input-group { margin-bottom: 16px; text-align: left; }
        .input-group label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px; font-weight: 500; }
        .modal-content input { width: 100%; padding: 10px 12px; border: 1px solid var(--input-border); border-radius: 8px; box-sizing: border-box; font-size: 14px; outline: none; background: var(--modal-bg); color: var(--input-text); transition: border-color 0.2s; }
        .modal-content input:focus { border-color: #ff7300; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .modal-actions button { padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background-color 0.2s; }
        .btn-cancel { background: var(--add-btn-bg); color: var(--text-color); }
        .btn-cancel:hover { background: var(--add-btn-hover); }
        .btn-add { background: #ff7300; color: white; }
        .btn-add:hover { background: #ff7300; }
        .delete-btn {
            position: absolute; bottom: -2px; right: -2px; background: #ff3b30; color: white; border-radius: 50%;
            width: 12px; height: 12px; font-size: 10px; line-height: 16px; display: flex; justify-content: center;
            align-items: center; cursor: pointer; visibility: hidden; opacity: 0; transition: opacity 0.2s, transform 0.2s;
            z-index: 10; box-shadow: 0 2px 4px rgba(255, 59, 48, 0.4);
        }
        .delete-btn:hover { transform: scale(1.15); }
        .dock-item:hover .delete-btn { visibility: visible; opacity: 1; }
        .edit-btn {
            position: absolute; top: -5px; right: -5px; border-radius: 50%;
            width: 12px; height: 12px; font-size: 12px; display: flex; justify-content: center;
            align-items: center; cursor: pointer; visibility: hidden; opacity: 0; transition: opacity 0.2s, transform 0.2s;
            z-index: 10; 
        }
        .edit-btn:hover { transform: scale(1.15); }
        .dock-item:hover .edit-btn { visibility: visible; opacity: 1; }
        .checkbox-group { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .checkbox-group label { margin-bottom: 0; cursor: pointer; }
        .checkbox-group input { width: auto; margin: 0; cursor: pointer; }
        #global-tooltip {
            position: absolute; right: 54px; background: var(--tooltip-bg); color: var(--tooltip-text); padding: 6px 10px;
            border-radius: 6px; font-size: 12px; white-space: nowrap; pointer-events: none; visibility: hidden; opacity: 0;
            transition: opacity 0.2s, transform 0.2s; z-index: 200; transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-weight: 500;
        }
        #global-tooltip.show { visibility: visible; opacity: 1; transform: translateX(0); }
        .dock-item.dragging { opacity: 0.5; }
        .dock-item.drag-over-top::before { content: ''; position: absolute; top: -7px; left: 0; right: 0; height: 3px; background: #ff7300; border-radius: 2px; z-index: 10; pointer-events: none; }
        .dock-item.drag-over-bottom::after { content: ''; position: absolute; bottom: -7px; left: 0; right: 0; height: 3px; background: #ff7300; border-radius: 2px; z-index: 10; pointer-events: none; }
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="sidebar-wrapper" class="${initialCollapsed ? 'collapsed' : ''}">
            <div id="toggle-btn" title="${chrome.i18n.getMessage("toggleFloatBar")}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div id="sidebar">
                <div class="dock-item" data-id="add-btn" id="add-btn">
                    +
                </div>
            </div>
            <div id="global-tooltip"></div>
        </div>
        <div id="modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <h3>${chrome.i18n.getMessage("addWebApp")}</h3>
                <div class="input-group">
                    <label for="app-name">${chrome.i18n.getMessage("appNameLabel")}</label>
                    <input type="text" id="app-name" placeholder="e.g. WhatsApp" autocomplete="off">
                </div>
                <div class="input-group">
                    <label for="app-url">${chrome.i18n.getMessage("urlLabel")}</label>
                    <input type="url" id="app-url" placeholder="e.g. https://web.whatsapp.com" autocomplete="off">
                </div>
                <div class="input-group">
                    <label for="app-icon">${chrome.i18n.getMessage("iconUrlLabel")}</label>
                    <input type="url" id="app-icon" placeholder="Leave empty to auto-fetch" autocomplete="off">
                </div>
                <div class="input-group">
                    <p style="font-size: 12px; color: var(--text-muted); margin: 0; line-height: 1.4;"><i>${chrome.i18n.getMessage("noteGmail")}</i></p>
                </div>
                <div class="modal-actions">
                    <button class="btn-cancel" id="cancel-btn">${chrome.i18n.getMessage("cancelBtn")}</button>
                    <button class="btn-add" id="save-btn">${chrome.i18n.getMessage("addBtn")}</button>
                </div>
            </div>
        </div>
        <div id="confirm-modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <h3>${chrome.i18n.getMessage("removeApp")}</h3>
                <p style="margin-bottom: 24px; color: var(--text-muted); font-size: 14px; margin-top: 0;">${chrome.i18n.getMessage("confirmRemove")}</p>
                <div class="modal-actions">
                    <button class="btn-cancel" id="confirm-cancel-btn">${chrome.i18n.getMessage("cancelBtn")}</button>
                    <button class="btn-add" id="confirm-remove-btn" style="background: #ff3b30;">${chrome.i18n.getMessage("removeBtn")}</button>
                </div>
            </div>
        </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);

    // Javascript logic functionality
    const sidebarWrapper = shadow.getElementById('sidebar-wrapper');
    const sidebar = shadow.getElementById('sidebar');
    const toggleBtn = shadow.getElementById('toggle-btn');
    const addBtn = shadow.getElementById('add-btn');

    const globalTooltip = shadow.getElementById('global-tooltip');

    function showTooltip(element, text) {
        const rect = element.getBoundingClientRect();
        globalTooltip.textContent = text;
        globalTooltip.style.top = (rect.top + rect.height / 2 - 12) + 'px';
        globalTooltip.classList.add('show');
    }

    function hideTooltip() {
        globalTooltip.classList.remove('show');
    }

    addBtn.addEventListener('mouseenter', () => showTooltip(addBtn, chrome.i18n.getMessage("addNewApp")));
    addBtn.addEventListener('mouseleave', hideTooltip);

    const modalOverlay = shadow.getElementById('modal-overlay');
    const modalTitle = shadow.querySelector('.modal-content h3');
    const cancelBtn = shadow.getElementById('cancel-btn');
    const saveBtn = shadow.getElementById('save-btn');
    const appNameInput = shadow.getElementById('app-name');
    const appUrlInput = shadow.getElementById('app-url');
    const appIconInput = shadow.getElementById('app-icon');
    let editingAppId = null;

    const confirmOverlay = shadow.getElementById('confirm-modal-overlay');
    const confirmCancelBtn = shadow.getElementById('confirm-cancel-btn');
    const confirmRemoveBtn = shadow.getElementById('confirm-remove-btn');

const defaultApps = [
    { id: 'app-gmail', name: 'Gmail', url: 'https://mail.google.com/', icon: 'images/gmail.ico', pip: false },
    { id: 'app-wa', name: 'WhatsApp', url: 'https://web.whatsapp.com/', icon: 'images/whatsapp.png', pip: false },
    { id: 'app-tg', name: 'Telegram', url: 'https://web.telegram.org/k/', icon: 'images/telegram.ico', pip: true },
    // { id: 'app-messenger', name: 'Messenger', url: 'https://www.messenger.com/', icon: 'images/messenger.png', pip: false },
        { id: 'app-tiktok', name: 'TikTok', url: 'https://www.tiktok.com/en', icon: 'images/tiktok.png', pip: true },
    { id: 'app-reels', name: 'Reels', url: 'https://www.instagram.com/reels/', icon: 'images/insta.png', pip: true },
    { id: 'app-shorts', name: 'Shorts', url: 'https://www.youtube.com/shorts', icon: 'images/yt.png', pip: true },
    { id: 'app-discord', name: 'Discord', url: 'https://discord.com/app', icon: 'images/discord.png', pip: true },
    { id: 'app-chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/', icon: 'images/chatgpt.ico', pip: true },
    { id: 'app-gemini', name: 'Gemini', url: 'https://gemini.google.com/', icon: 'images/gemini.png', pip: true },
    { id: 'app-spotify', name: 'Spotify', url: 'https://open.spotify.com/', icon: 'images/spotify.png', pip: true },
];

    let apps = [];
    let draggedAppIndex = null;

    // Initialize: Load apps from storage
    chrome.storage.local.get(['sidebarApps'], (result) => {
        if (result.sidebarApps && result.sidebarApps.length > 0) {
            apps = result.sidebarApps;
        } else {
            apps = [...defaultApps];
            saveApps();
        }
        renderApps();
        
        // Proactively upgrade any non-data URIs
        setTimeout(async () => {
            let upgraded = false;
            let upgradedApps = JSON.parse(JSON.stringify(apps));
            for (let i = 0; i < upgradedApps.length; i++) {
                let app = upgradedApps[i];
                if (app.icon && !app.icon.startsWith('data:')) {
                    try {
                        const response = await chrome.runtime.sendMessage({ action: 'downloadIcon', iconUrl: app.icon });
                        if (response && response.dataUrl) {
                            app.icon = response.dataUrl;
                            upgraded = true;
                        }
                    } catch (e) {
                        console.error('Failed proactive icon download:', e);
                    }
                }
            }
            if (upgraded) {
                apps = upgradedApps;
                saveApps();
                renderApps(); // Just re-render updated ones
            }
        }, 1500);
    });

    function saveApps() {
        chrome.storage.local.set({ sidebarApps: apps });
    }

    function renderApps() {
        const appIcons = shadow.querySelectorAll('.dock-item:not(#add-btn)');
        appIcons.forEach(icon => icon.remove());

        apps.forEach((app, index) => {
            const dockItem = document.createElement('div');
            dockItem.className = 'dock-item';
            dockItem.dataset.id = app.id;
            dockItem.setAttribute('draggable', 'true');

            dockItem.addEventListener('dragstart', (e) => {
                hideTooltip();
                draggedAppIndex = index;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => dockItem.classList.add('dragging'), 0);
            });

            dockItem.addEventListener('dragend', () => {
                dockItem.classList.remove('dragging');
                const items = shadow.querySelectorAll('.dock-item');
                items.forEach(item => item.classList.remove('drag-over-top', 'drag-over-bottom'));
                draggedAppIndex = null;
            });

            dockItem.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const bounding = dockItem.getBoundingClientRect();
                const offset = bounding.y + (bounding.height / 2);
                if (e.clientY - offset > 0) {
                    dockItem.classList.add('drag-over-bottom');
                    dockItem.classList.remove('drag-over-top');
                } else {
                    dockItem.classList.add('drag-over-top');
                    dockItem.classList.remove('drag-over-bottom');
                }
            });

            dockItem.addEventListener('dragleave', () => {
                dockItem.classList.remove('drag-over-top', 'drag-over-bottom');
            });

            dockItem.addEventListener('drop', (e) => {
                e.preventDefault();
                dockItem.classList.remove('drag-over-top', 'drag-over-bottom');
                if (draggedAppIndex === null) return;

                let targetIndex = index;
                const bounding = dockItem.getBoundingClientRect();
                const offset = bounding.y + (bounding.height / 2);
                if (e.clientY - offset > 0) {
                    targetIndex++; // Drop below
                }

                if (draggedAppIndex === targetIndex || draggedAppIndex === targetIndex - 1) {
                    return;
                }

                const draggedApp = apps[draggedAppIndex];
                apps.splice(draggedAppIndex, 1);
                
                if (draggedAppIndex < targetIndex) {
                    targetIndex--;
                }
                
                apps.splice(targetIndex, 0, draggedApp);
                saveApps();
                renderApps();
            });

            dockItem.addEventListener('mouseenter', () => showTooltip(dockItem, app.name));
            dockItem.addEventListener('mouseleave', hideTooltip);
            dockItem.addEventListener('mousedown', hideTooltip);

            if (app.icon) {
                const img = document.createElement('img');
                img.src = app.icon;
                img.onerror = () => {
                    img.style.display = 'none';
                    const initial = document.createElement('span');
                    initial.className = 'app-initial';
                    initial.textContent = app.name.charAt(0);
                    dockItem.appendChild(initial);
                };
                dockItem.appendChild(img);
            } else {
                const initial = document.createElement('span');
                initial.className = 'app-initial';
                initial.textContent = app.name.charAt(0);
                dockItem.appendChild(initial);
            }

            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.title = chrome.i18n.getMessage("removeApp");

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                confirmOverlay.dataset.appIdToRemove = app.id;
                confirmOverlay.classList.add('show');
            });
            dockItem.appendChild(deleteBtn);

            const editBtn = document.createElement('div');
            editBtn.className = 'edit-btn';

            // The \uFE0F is the "Variation Selector-16" to force color rendering
            editBtn.innerHTML = '✏️'; 

            editBtn.title = chrome.i18n.getMessage("editWebApp");

            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editingAppId = app.id;
                modalTitle.textContent = chrome.i18n.getMessage("editWebApp");
                saveBtn.textContent = chrome.i18n.getMessage("saveChangesBtn");
                appNameInput.value = app.name;
                appUrlInput.value = app.url;
                appIconInput.value = app.icon || '';
                modalOverlay.classList.add('show');
            });
            dockItem.appendChild(editBtn);

            dockItem.addEventListener('click', () => switchApp(app.id, app.url, app.pip));

            sidebar.insertBefore(dockItem, addBtn);
        });
    }

    // Expose API for global listeners
    host._sidebarApi = {
        renderApps: (newApps) => {
            if (newApps) apps = newApps;
            renderApps();
        },
        applySidebarState: (collapsed) => {
            applySidebarState(collapsed);
        },
        updateHandleStyles: () => {
            updateHandleStyles();
        }
    };

    function switchApp(id, url, alwaysOnTop) {
        if (!('documentPictureInPicture' in window)) {
            alert("Document Picture-in-Picture is not supported in this browser.");
            return;
        }
        const pipUrl = new URL(url);
        pipUrl.searchParams.set('alwaysOnTop', 'true');
        pipUrl.searchParams.set('appId', id);
        chrome.runtime.sendMessage({ action: 'openWindow', appId: id, appUrl: pipUrl.toString() });
    }

    /* Modal Interaction Logic */
    addBtn.addEventListener('click', () => {
        editingAppId = null;
        modalTitle.textContent = chrome.i18n.getMessage("addWebApp");
        saveBtn.textContent = chrome.i18n.getMessage("addBtn");
        appNameInput.value = '';
        appUrlInput.value = '';
        appIconInput.value = '';
        modalOverlay.classList.add('show');
        appNameInput.focus();
    });

    cancelBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('show');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('show');
        }
    });

    saveBtn.addEventListener('click', async () => {
        let name = appNameInput.value.trim();
        let url = appUrlInput.value.trim();
        let icon = appIconInput.value.trim();

        if (name && url) {
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }

            if (!icon) {
                try {
                    const domain = new URL(url).hostname;
                    icon = "https://www.google.com/s2/favicons?domain=" + domain + "&sz=128";
                } catch (e) {
                    icon = '';
                }
            }

            // Show saving status
            const originalBtnText = saveBtn.textContent;
            saveBtn.disabled = true;
            saveBtn.textContent = chrome.i18n.getMessage("saving");
            saveBtn.style.opacity = '0.7';
            saveBtn.style.cursor = 'wait';

            let finalIcon = icon;
            if (icon && !icon.startsWith('data:')) {
                try {
                    const response = await chrome.runtime.sendMessage({ action: 'downloadIcon', iconUrl: icon });
                    if (response && response.dataUrl) {
                        finalIcon = response.dataUrl;
                    }
                } catch (e) {
                    console.error("Failed to download icon via background:", e);
                }
            }

            const newApp = {
                id: editingAppId || ('app-' + Date.now()),
                name,
                url,
                icon: finalIcon,
                pip: true
            };

            if (editingAppId) {
                const index = apps.findIndex(a => a.id === editingAppId);
                if (index !== -1) apps[index] = newApp;
            } else {
                apps.push(newApp);
            }
            saveApps();
            renderApps();
            
            // Restore save button state
            saveBtn.disabled = false;
            saveBtn.textContent = originalBtnText;
            saveBtn.style.opacity = '1';
            saveBtn.style.cursor = 'pointer';

            modalOverlay.classList.remove('show');
        } else {
            alert(chrome.i18n.getMessage("errorEnterNameUrl"));
        }
    });

    appUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveBtn.click();
    });

    appIconInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveBtn.click();
    });

    // Confirm Remove Modal Logic
    confirmCancelBtn.addEventListener('click', () => {
        confirmOverlay.classList.remove('show');
    });

    confirmOverlay.addEventListener('click', (e) => {
        if (e.target === confirmOverlay) {
            confirmOverlay.classList.remove('show');
        }
    });

    confirmRemoveBtn.addEventListener('click', () => {
        const appId = confirmOverlay.dataset.appIdToRemove;
        if (appId) {
            apps = apps.filter(a => a.id !== appId);
            saveApps();
            renderApps();
            confirmOverlay.classList.remove('show');
        }
    });

    // Global updates are now handled by top-level storage listener via _sidebarApi

    let isSidebarCollapsed = initialCollapsed;

    const applySidebarState = (collapsed) => {
        isSidebarCollapsed = collapsed;
        if (collapsed) {
            sidebarWrapper.classList.add('collapsed');
        } else {
            sidebarWrapper.classList.remove('collapsed');
        }
    };

    const updateHandleStyles = () => {
        chrome.storage.local.get(['handleOpacity', 'handleSize'], (res) => {
            if (res.handleOpacity !== undefined) {
                toggleBtn.style.setProperty('--handle-opacity', res.handleOpacity / 100);
            }
            if (res.handleSize !== undefined) {
                const size = res.handleSize;
                toggleBtn.style.height = size + 'px';
                toggleBtn.style.marginTop = -(size / 2) + 'px';
            }
        });
    };
    // updateHandleStyles(); // Removed as we now initialize directly

    // Global updates are now handled by top-level storage listener via _sidebarApi

    let hoverTimeout;
    let collapseTimeout;

    sidebarWrapper.addEventListener('mouseenter', () => {
        clearTimeout(collapseTimeout);
        hoverTimeout = setTimeout(() => {
            if (!chrome.runtime?.id) return;
            if (isSidebarCollapsed) {
                chrome.storage.local.set({ sidebarCollapsed: false });
                applySidebarState(false);
            }
        }, 120);
    });

    // Close when mouse leaves the sidebar area
    sidebar.addEventListener('mouseleave', (e) => {
        if (isSidebarCollapsed) return;
        
        clearTimeout(hoverTimeout);
        collapseTimeout = setTimeout(() => {
            if (!chrome.runtime?.id) return;
            // Only collapse if mouse is not over the sidebar or handle
            // But the user specifically asked: "when go out side of the sidebar to the handel area close the sidebar"
            // So we just collapse it if it leaves the sidebar.
            chrome.storage.local.set({ sidebarCollapsed: true });
            applySidebarState(true);
        }, 400);
    });

    // Also close if mouse leaves the whole wrapper (safety)
    sidebarWrapper.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        if (!isSidebarCollapsed) {
            collapseTimeout = setTimeout(() => {
                if (!chrome.runtime?.id) return;
                chrome.storage.local.set({ sidebarCollapsed: true });
                applySidebarState(true);
            }, 400);
        }
    });

    // Global updates are now handled by top-level message listener via _sidebarApi

    // State is already initialized from pre-fetched settings
}
