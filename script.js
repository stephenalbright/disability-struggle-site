/* ═══════════════════════════════════════════
   DISABILITY STRUGGLE — ANIMATIONS & LOGIC
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════
// HERO STAR FIELD
// ═══════════════════════════════════════════
(function initStarField() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, stars;
  const STAR_COUNT = 200;
  const SPEED = 0.15;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  function createStars() {
    stars = [];
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.6 + 0.1,
        drift: (Math.random() - 0.5) * SPEED,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  let frame = 0;
  function draw() {
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    ctx.clearRect(0, 0, cw, ch);

    // Animated gradient background
    const t = frame * 0.003;
    const grd = ctx.createRadialGradient(
      cw * (0.5 + 0.2 * Math.sin(t)), ch * (0.3 + 0.1 * Math.cos(t * 0.7)), 0,
      cw * 0.5, ch * 0.5, cw * 0.8
    );
    grd.addColorStop(0, 'rgba(15, 25, 50, 0.3)');
    grd.addColorStop(0.5, 'rgba(10, 10, 10, 0.1)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, cw, ch);

    // Stars
    for (const s of stars) {
      const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinklePhase);
      const alpha = s.alpha * (0.5 + 0.5 * twinkle);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.fill();

      // Soft glow on brighter stars
      if (s.r > 1) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.1})`;
        ctx.fill();
      }

      s.y += s.drift;
      if (s.y < -5) s.y = ch + 5;
      if (s.y > ch + 5) s.y = -5;
    }

    frame++;
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();
  window.addEventListener('resize', () => { resize(); createStars(); });
})();

// --- Hero entrance sequence ---
const heroTl = gsap.timeline({ delay: 0.3 });
heroTl
  .to('.hero-logo', { opacity: 1, duration: 1, ease: 'power2.out' })
  .to('.hero-wordmark', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
  .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
  .to('.scroll-indicator', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');

// --- Problem stats: each line fades in on scroll ---
document.querySelectorAll('[data-problem]').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
  gsap.set(el, { y: 30 });
});

// --- Product card + phone mockup: slides up ---
gsap.to('.product-card', {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.product-layout',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});

gsap.to('.phone-mockup', {
  opacity: 1,
  y: 0,
  duration: 1,
  delay: 0.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.product-layout',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});

// --- Coming Soon cards: stagger in ---
gsap.to('[data-card]', {
  opacity: 1,
  y: 0,
  duration: 0.7,
  ease: 'power2.out',
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.card-grid',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// --- Section title for Coming Soon ---
gsap.from('.coming-soon .section-title', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.coming-soon .section-title',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});

// --- Platform section ---
gsap.from('.platform .section-title', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.platform',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});

gsap.from('.platform-text', {
  opacity: 0,
  x: -30,
  duration: 0.9,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.platform-layout',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

gsap.from('.platform-diagram', {
  opacity: 0,
  scale: 0.8,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.platform-layout',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// --- Vision: lines reveal with scale ---
document.querySelectorAll('[data-vision]').forEach((el, i) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.9,
    delay: i * 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.vision-inner',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });
  gsap.set(el, { y: 20, scale: 0.97 });
});

// --- About section ---
gsap.from('.about-content', {
  opacity: 0,
  y: 40,
  duration: 0.9,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.about',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// --- Credentials: stagger in ---
gsap.to('[data-cred]', {
  opacity: 1,
  y: 0,
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.cred-row',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});

// --- Built Different: stagger in ---
gsap.from('.built-different .section-title', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.built-different .section-title',
    start: 'top 85%',
    toggleActions: 'play none none none',
  },
});

gsap.to('[data-diff]', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out',
  stagger: 0.15,
  scrollTrigger: {
    trigger: '.diff-grid',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// --- Waitlist section ---
gsap.from('.waitlist-inner', {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.waitlist',
    start: 'top 80%',
    toggleActions: 'play none none none',
  },
});

// ═══════════════════════════════════════════
// WAITLIST FORM — Supabase
// ═══════════════════════════════════════════
const SUPABASE_URL = 'https://zgdjxqaainynovabvprb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZGp4cWFhaW55bm92YWJ2cHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NTY2MTMsImV4cCI6MjA1MTQzMjYxM30.jnMQjGeLMVZCq-vhVR_K7mEaOYwVAGjS3OTAV92gAYY';

const form = document.getElementById('waitlist-form');
const message = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('waitlist-email').value.trim();
  const condition = document.getElementById('waitlist-condition').value;
  const submitBtn = form.querySelector('.btn--submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  if (!email) {
    showMessage('Please enter your email.', 'error');
    return;
  }

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ds_waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email,
        condition_interest: condition || null,
      }),
    });

    if (res.ok) {
      showMessage("You're on the list! We'll be in touch.", 'success');
      form.reset();
    } else {
      const err = await res.json();
      if (err.code === '23505') {
        showMessage("You're already on the waitlist!", 'success');
      } else {
        showMessage('Something went wrong. Please try again.', 'error');
      }
    }
  } catch {
    showMessage('Network error. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }
});

function showMessage(text, type) {
  message.textContent = text;
  message.className = `form-message form-message--${type}`;
}

// --- Scroll to waitlist with pre-selected condition ---
function scrollToWaitlist(condition) {
  const select = document.getElementById('waitlist-condition');
  if (select) {
    select.value = condition;
  }
  document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('waitlist-email').focus();
  }, 600);
}
