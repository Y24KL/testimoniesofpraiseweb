// 1. THE PRELOADER FIX (Ensures the black "Loading" screen actually goes away)
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        // Force the loader to disappear after 1 second
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            console.log("Loader hidden successfully.");
        }, 1000);
    }
});

// 2. FETCH VIDEOS FROM CMS
async function fetchVideos() {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;

    try {
        // Path must match your GitHub folder exactly: data/videos.json
        const response = await fetch('data/videos.json');
        
        if (!response.ok) {
            console.warn("videos.json not found yet. Showing placeholder.");
            grid.innerHTML = '<p style="color:#888;">Testimonies will appear here once added via CMS.</p>';
            return;
        }

        const data = await response.json();
        
        if (data.videos && data.videos.length > 0) {
            grid.innerHTML = ''; // Clear the "Loading" text
            data.videos.forEach(vid => {
                grid.innerHTML += `
                    <div class="video-card" style="background:#111; border-radius:10px; margin-bottom:20px; border:1px solid #333;">
                        <video controls poster="${vid.poster || ''}" style="width:100%; display:block;">
                            <source src="${vid.url}" type="video/mp4">
                        </video>
                        <h3 style="padding:15px; font-size:0.9rem; color:#f5c518;">${vid.title}</h3>
                    </div>
                `;
            });
        }
    } catch (err) {
        console.error("CMS Fetch Error:", err);
    }
}

// Run the video fetcher
document.addEventListener('DOMContentLoaded', fetchVideos);

// 3. UI FUNCTIONS
window.toggleSocial = function() {
    const bubble = document.getElementById('socialBubble');
    if(bubble) bubble.classList.toggle('active');
};

window.showMoreVideos = function() {
    alert("More testimonies coming soon!");
};
