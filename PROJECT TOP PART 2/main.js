// --- PRELOADER & ON-LOAD EVENTS ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => { 
            loader.classList.add('loader-finish'); 
        }, 1000);
    }
    reveal(); // Check for reveal animations as soon as page loads
});

// --- SCROLL REVEAL ANIMATION ---
function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}
window.addEventListener("scroll", reveal);

// --- HOME PAGE: TOGGLE EXTRA VIDEOS ---
window.showMoreVideos = function() {
    const extras = document.querySelectorAll('.extra-video');
    if (extras.length === 0) return;

    extras.forEach(vid => vid.classList.toggle('hidden'));
    
    const btn = document.querySelector('.see-more-btn');
    if (btn) {
        btn.innerText = extras[0].classList.contains('hidden') ? "View More Recaps" : "Show Less";
    }
}

// --- HOME PAGE: SOCIAL BUBBLE ---
window.toggleSocial = function() {
    const bubble = document.getElementById('socialBubble');
    if (bubble) {
        bubble.classList.toggle('active');
    }
}

// --- HOME PAGE: FETCH CMS VIDEOS ---
async function fetchVideos() {
    const grid = document.querySelector('.video-grid');
    if (!grid) return; // If we aren't on the homepage, stop running this code

    try {
        const response = await fetch('data/videos.json');
        if (!response.ok) throw new Error("CMS JSON not found");
        const data = await response.json();
        
        // Clear static HTML placeholders
        grid.innerHTML = '';

        data.videos.forEach((vid, index) => {
            // Hide videos after the first 3
            const isHidden = index >= 3 ? 'hidden extra-video' : '';
            grid.innerHTML += `
                <div class="video-card ${isHidden}">
                    <video controls poster="${vid.poster || ''}">
                        <source src="${vid.url}" type="video/mp4">
                    </video>
                    <h3>${vid.title}</h3>
                </div>
            `;
        });
    } catch (err) {
        console.warn("CMS Data not found. Showing static fallback videos.", err);
    }
}

// Run the fetch function when the document is ready
document.addEventListener('DOMContentLoaded', fetchVideos);
