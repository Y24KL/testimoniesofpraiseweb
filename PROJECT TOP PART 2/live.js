import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push, onDisconnect, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSyDKJSuZJ8ZqGE6rUZUjlPyMHiH4TgCdY6o",
    authDomain: "topweb-698e5.firebaseapp.com",
    databaseURL: "https://topweb-698e5-default-rtdb.firebaseio.com",
    projectId: "topweb-698e5",
    storageBucket: "topweb-698e5.firebasestorage.app",
    messagingSenderId: "675291297804",
    appId: "1:675291297804:web:6b2ae484e87be20bb4d629"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 2. LIVE VIEWER TRACKING LOGIC
const viewerRef = ref(db, 'liveViewers');
const myViewerRef = push(viewerRef); // Creates a unique ID for this session

// Add user to database when they arrive
set(myViewerRef, { joinedAt: serverTimestamp() });

// Remove user automatically when they close the tab
onDisconnect(myViewerRef).remove();

// Update UI when total viewer count changes
onValue(viewerRef, (snapshot) => {
    const countElement = document.getElementById('count');
    if (countElement) {
        countElement.innerText = snapshot.size || 0;
    }
});

// 3. HLS (.m3u8) PLAYER LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('livePlayer');
    if (!video) return;

    const streamUrl = 'https://your-stream-link.m3u8'; // Swap with your actual stream

    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl; // Native support fallback (Safari)
    }
});
