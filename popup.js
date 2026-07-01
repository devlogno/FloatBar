// Internationalization
document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const message = chrome.i18n.getMessage(key);
    if (message) {
        el.innerHTML = message;
    }
});
document.title = chrome.i18n.getMessage("howToUse");

// Constants
const OPACITY_KEY = 'handleOpacity';
const SIZE_KEY = 'handleSize';
const BLACKLIST_KEY = 'blacklistedDomains';

// Elements
const opacitySlider = document.getElementById('opacity-slider');
const opacityVal = document.getElementById('opacity-val');
const sizeSlider = document.getElementById('size-slider');
const sizeVal = document.getElementById('size-val');
const siteToggle = document.getElementById('site-toggle');
const addSiteBtn = document.getElementById('add-site-btn');
const openPipBtn = document.getElementById('open-pip-btn');

// Port to monitor popup closure
chrome.runtime.connect({ name: "popup-monitor" });

// Get current hostname
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url) return;

    try {
        const url = new URL(activeTab.url);
        const hostname = url.hostname;

        // Load Settings
        chrome.storage.local.get([OPACITY_KEY, SIZE_KEY, BLACKLIST_KEY], (res) => {
            // Opacity
            const opacity = res[OPACITY_KEY] || 85;
            opacitySlider.value = opacity;
            opacityVal.textContent = opacity + '%';

            // Size
            const size = res[SIZE_KEY] || 48;
            sizeSlider.value = size;
            sizeVal.textContent = size + 'px';

            // Site Toggle
            const blacklist = res[BLACKLIST_KEY] || [];
            siteToggle.checked = !blacklist.includes(hostname);
        });

        // Event Listeners
        opacitySlider.addEventListener('input', (e) => {
            const val = e.target.value;
            opacityVal.textContent = val + '%';
            chrome.storage.local.set({ [OPACITY_KEY]: parseInt(val) });
        });

        sizeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            sizeVal.textContent = val + 'px';
            chrome.storage.local.set({ [SIZE_KEY]: parseInt(val) });
        });

        siteToggle.addEventListener('change', (e) => {
            chrome.storage.local.get([BLACKLIST_KEY], (res) => {
                let blacklist = res[BLACKLIST_KEY] || [];
                if (e.target.checked) {
                    blacklist = blacklist.filter(h => h !== hostname);
                } else {
                    if (!blacklist.includes(hostname)) blacklist.push(hostname);
                }
                chrome.storage.local.set({ [BLACKLIST_KEY]: blacklist });
            });
        });

        addSiteBtn.addEventListener('click', () => {
            chrome.tabs.sendMessage(activeTab.id, { action: "addToSidebar" }).catch(() => {});
            const originalText = addSiteBtn.innerText;
            addSiteBtn.innerText = "✓";
            setTimeout(() => {
                addSiteBtn.innerText = originalText;
            }, 1500);
        });

        openPipBtn.addEventListener('click', () => {
            chrome.tabs.sendMessage(activeTab.id, { action: "triggerPipCurrentPage" }).catch(() => {});
            window.close();
        });

        // Trigger sidebar open on current page
        chrome.tabs.sendMessage(activeTab.id, { action: "openSidebar" }).catch(() => {});

    } catch (e) {
        console.error("Invalid URL in popup:", e);
    }
});

// Email Click to Copy
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('highlight') && e.target.closest('.footer')) {
        const email = "lognodev7@gmail.com";
        navigator.clipboard.writeText(email).then(() => {
            const originalText = e.target.innerHTML;
            e.target.innerHTML = "Copied!";
            e.target.classList.add('copied');
            setTimeout(() => {
                e.target.innerHTML = originalText;
                e.target.classList.remove('copied');
            }, 2000);
        });
    }
});

