# FloatBar Apps: Your Ultimate Productivity Dock 🚀

[![Privacy Policy](https://img.shields.io/badge/Privacy-100%25_Private%20%7C%20No%20Data%20Collection-success?style=flat-square)](PRIVACY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=flat-square)](#)

Transform the way you multitask with a sleek, minimalist app dock that brings your favorite web apps to your fingertips—no matter what webpage you are on. 

Inspired by the Opera-style sidebar, **FloatBar Apps** lives completely hidden off-screen, sliding smoothly into view only when you need it. Coupled with native **Always-on-Top Picture-in-Picture (PiP)** window management, it provides an unparalleled workspace setup for developers, researchers, and power users.

---

## 📸 Preview

![FloatBar Apps Workspace Showcase](https://raw.githubusercontent.com/lognodev/floatbar-apps/main/assets/banner.png)
*Sleek, glassmorphism app dock with independent, Always-on-Top web app windows.*

---

## ✨ Key Features

* **🛡️ 100% Private & Serverless:** Built with absolute privacy in mind. There are no tracking scripts, no third-party analytics, and no backend servers. All configurations stay locally on your hardware.
* **🚀 Universally Accessible Workspace:** The FloatBar travels with you across the web. Whether reading an article, writing code, or working in a Google Doc, your custom dock is instantly accessible by flicking your mouse cursor to the right edge of your screen.
* **🖼️ True Always-on-Top PiP Windows:** Launch any web app into an isolated, independent window that floats over your other applications. No `iframe` sandbox restrictions, no broken layouts—just clean, native pop-outs.
* **🧠 "Auto-Remember" Window Memory:** Resize a floating window or drag it to your secondary monitor. FloatBar automatically caches your custom dimensions (width, height, X/Y screen coordinates) and perfectly restores them on your next launch.
* **📌 Fully Customizable App Dock:** Spin up your daily essentials (WhatsApp, ChatGPT, Gmail, Telegram, Spotify) in seconds. Provide a URL, and the extension auto-fetches the platform's high-quality favicon. You can also supply custom icon overrides manually.
* **🖱️ Intuitive Drag & Drop Reordering:** Reorganize your custom sidebar on the fly. Click, drag, and drop icons to arrange your workspace to fit your current workflow.
* **🌗 Premium Glassmorphism UI:** Features a modern, translucent design with real-time backdrop blur. Dynamically adapts to your system's hardware light/dark mode preference for a native operating system aesthetic.
* **⚡ Lightweight Engineering:** Engineered using native Web Components (Shadow DOM). This encapsulates all styles and scripts so the extension never breaks, pollutes, or slows down the DOM performance of websites you visit.

---

## 🛠️ Installation & Setup

1. **Install the extension** from the Chrome Web Store (or load it as an unpacked extension for local development).
2. **Navigate to any webpage** and snap your cursor to the far-right edge of your screen. 
3. **Click the `(+)` icon** inside the sliding dock to add your first web application!

---

## 🔒 Security & Architectural Integrity

FloatBar Apps is built from the ground up to be fully open-source, secure, and respectful of user data.

* **Zero Network Footprint:** The extension possesses zero backend API communication capabilities.
* **Local Storage Sandbox:** All user metadata, application lists, URLs, and window states are saved purely inside your browser container via `chrome.storage.local`. 
* **Secure Window Management:** When creating an Always-on-Top window, FloatBar interacts strictly with the Chromium engine as a window coordinator. It cannot monitor, scrape, or read data executing inside those custom windows.

For complete architectural guarantees, read our full [Privacy Policy](PRIVACY.md).

---

## 💻 Technical Details & Stack

* **Frontend Architecture:** Vanilla JavaScript, HTML5, CSS3 Custom Properties.
* **Component Isolation:** Web Components with Closed/Open Shadow DOM boundaries to eliminate CSS bleeding on host websites.
* **Storage Framework:** Standard `chrome.storage.local` engine.
* **Window Pipeline:** Chromium Document Picture-in-Picture / Panel API abstraction layers.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📬 Contact & Support

For bug reports, architectural discussions, or feature suggestions, please reach out directly:

* **Developer:** [lognodev7@gmail.com](mailto:lognodev7@gmail.com)
* **Project Repository:** [https://github.com/lognodev/floatbar-apps](https://github.com/lognodev/floatbar-apps)
