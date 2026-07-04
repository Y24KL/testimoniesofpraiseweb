// ===== Testimonies of Praise - Homepage Script =====

const SETTINGS_DEFAULTS = {
  heroVideo: "https://res.cloudinary.com/duw6xrnpn/video/upload/v1777127537/TESTIMONIES_OF_PRAISE_FINAL_OPENING_MONTAGE_lq5wqk.mp4",
  heroSubtitle: "Experience high-definition storytelling, unfiltered testimonies, and immersive worship blasted directly to your device.",
  socials: {
    kingschat: "https://kingschat.online/user/testimonies.lmm",
    x: "https://x.com/testimonies_lmm"
  }
};

// --- Preloader ---
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('loader-finish');
}
window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 3000);

// --- Reveal on scroll ---
function reveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < window.innerHeight - 100) el.classList.add('active');
  });
}
window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// --- Mobile nav ---
window.toggleNav = function () {
  document.getElementById('mainNav')?.classList.toggle('nav-open');
};
window.closeNav = function () {
  document.getElementById('mainNav')?.classList.remove('nav-open');
};

// --- Social bubble ---
window.toggleSocial = function () {
  document.getElementById('socialBubble')?.classList.toggle('active');
};

// --- Apply homepage content from the CMS (data/settings.json) ---
async function applySettings() {
  let settings = SETTINGS_DEFAULTS;
  try {
    const res = await fetch('data/settings.json');
    if (res.ok) settings = { ...SETTINGS_DEFAULTS, ...(await res.json()) };
  } catch (err) {
    console.warn('Using default site settings:', err);
  }

  const heroVideoSource = document.querySelector('.hero-video source');
  if (heroVideoSource && settings.heroVideo) {
    heroVideoSource.src = settings.heroVideo;
    heroVideoSource.parentElement.load();
  }

  const heroSubtitle = document.getElementById('heroSubtitle');
  if (heroSubtitle && settings.heroSubtitle) heroSubtitle.textContent = settings.heroSubtitle;

  const kingschatLink = document.getElementById('kingschatLink');
  if (kingschatLink && settings.socials?.kingschat) kingschatLink.href = settings.socials.kingschat;

  const xLink = document.getElementById('xLink');
  if (xLink && settings.socials?.x) xLink.href = settings.socials.x;
}

// --- Testimony video carousel (data/videos.json) ---
async function initVideoCarousel() {
  const wrapper = document.getElementById('videoWrapper');
  if (!wrapper) return;

  let videos = [];
  try {
    const res = await fetch('data/videos.json');
    if (!res.ok) throw new Error('videos.json not found');
    videos = (await res.json()).videos || [];
  } catch (err) {
    console.warn('Could not load testimony videos:', err);
  }

  if (!videos.length) {
    wrapper.innerHTML = '<div class="video-state"><p>Testimonies will appear here once added via the content manager.</p></div>';
    return;
  }

  wrapper.innerHTML = videos.map(video => `
    <div class="swiper-slide">
      <div class="video-card">
        <video controls playsinline${video.poster ? ` poster="${video.poster}"` : ''}>
          <source src="${video.url}" type="video/mp4">
        </video>
        <h3>${video.title}</h3>
      </div>
    </div>
  `).join('');

  new Swiper('.videoSwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: videos.length > 1,
    grabCursor: true,
    pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 30 },
      1024: { slidesPerView: 3, spaceBetween: 40 }
    }
  });
}

// --- Silent testimony form submit ---
function initTestimonyForm() {
  const form = document.getElementById('testimonyForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Submitting...';
    status.style.color = 'var(--accent)';
    try {
      const response = await fetch(event.target.action, {
        method: form.method,
        body: new FormData(event.target),
        headers: { Accept: 'application/json' }
      });
      if (response.ok) {
        status.textContent = 'Praise the Lord! Your testimony has been submitted.';
        status.style.color = '#4CAF50';
        form.reset();
      } else {
        status.textContent = 'There was a problem submitting your form.';
      }
    } catch (err) {
      status.textContent = 'Check your connection and try again.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  initVideoCarousel();
  initTestimonyForm();
  reveal();
});
