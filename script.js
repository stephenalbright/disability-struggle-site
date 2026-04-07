/* ═══════════════════════════════════════════
   DISABILITY DRIVEN — ANIMATIONS & LOGIC
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════
// HERO — GRADIENT MESH + PARTICLES
// ═══════════════════════════════════════════
(function initHeroBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles, meshPoints;
  const PARTICLE_COUNT = 120;
  const MESH_POINTS = 5;

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  function createMeshPoints() {
    meshPoints = [];
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    for (let i = 0; i < MESH_POINTS; i++) {
      meshPoints.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: cw * (0.3 + Math.random() * 0.4),
        hue: 210 + Math.random() * 30,
        saturation: 70 + Math.random() * 20,
        lightness: 40 + Math.random() * 15,
        alpha: 0.03 + Math.random() * 0.04,
      });
    }
  }

  function createParticles() {
    particles = [];
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.3 - 0.05,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        life: Math.random(),
      });
    }
  }

  let frame = 0;
  function draw() {
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    ctx.clearRect(0, 0, cw, ch);

    // Animated gradient mesh
    for (const mp of meshPoints) {
      mp.x += mp.vx;
      mp.y += mp.vy;
      if (mp.x < -mp.radius * 0.5 || mp.x > cw + mp.radius * 0.5) mp.vx *= -1;
      if (mp.y < -mp.radius * 0.5 || mp.y > ch + mp.radius * 0.5) mp.vy *= -1;

      const breathe = 1 + 0.15 * Math.sin(frame * 0.008 + mp.hue);
      const grd = ctx.createRadialGradient(mp.x, mp.y, 0, mp.x, mp.y, mp.radius * breathe);
      grd.addColorStop(0, `hsla(${mp.hue}, ${mp.saturation}%, ${mp.lightness}%, ${mp.alpha})`);
      grd.addColorStop(0.5, `hsla(${mp.hue}, ${mp.saturation}%, ${mp.lightness}%, ${mp.alpha * 0.3})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, cw, ch);
    }

    // Particles
    for (const p of particles) {
      const twinkle = Math.sin(frame * p.twinkleSpeed + p.twinklePhase);
      const alpha = p.alpha * (0.4 + 0.6 * twinkle);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${Math.max(0, alpha)})`;
      ctx.fill();

      // Soft glow on larger particles
      if (p.r > 1.2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${Math.max(0, alpha * 0.08)})`;
        ctx.fill();
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.y < -10) { p.y = ch + 10; p.x = Math.random() * cw; }
      if (p.x < -10) p.x = cw + 10;
      if (p.x > cw + 10) p.x = -10;
    }

    // Subtle connecting lines between nearby particles
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = dx * dx + dy * dy;
        if (dist < 15000) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    frame++;
    requestAnimationFrame(draw);
  }

  resize();
  createMeshPoints();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createMeshPoints(); createParticles(); });
})();

// --- Hero entrance sequence ---
const heroTl = gsap.timeline({ delay: 0.3 });
heroTl
  .to('.hero-logo', { opacity: 1, duration: 1, ease: 'power2.out' })
  .to('.hero-wordmark', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
  .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
  .to('.scroll-indicator', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.2');

// ═══════════════════════════════════════════
// COUNTER ANIMATION — Problem Stats
// ═══════════════════════════════════════════
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  if (!target) return;

  const countSpan = el.querySelector('.count-number');
  if (!countSpan) return;

  const duration = 2;
  const obj = { val: 0 };

  gsap.to(obj, {
    val: target,
    duration: duration,
    ease: 'power2.out',
    onUpdate() {
      countSpan.textContent = Math.round(obj.val).toLocaleString();
    },
  });
}

// --- Problem stats: each line fades in on scroll ---
document.querySelectorAll('[data-problem]').forEach((el) => {
  gsap.set(el, { y: 30 });
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
    onStart() {
      if (el.dataset.count) animateCounter(el);
    },
  });
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

// --- Credential tags: fade in ---
gsap.to('.about-creds', {
  opacity: 1,
  y: 0,
  duration: 0.6,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.about-creds',
    start: 'top 90%',
    toggleActions: 'play none none none',
  },
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

// ═══════════════════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════════════════
let toastTimer;
function showToast(text) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = text;
  toast.classList.remove('toast--visible');

  // Force reflow so the animation restarts
  void toast.offsetWidth;

  gsap.fromTo(toast,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out',
      onStart() { toast.classList.add('toast--visible'); }
    }
  );

  toastTimer = setTimeout(() => {
    gsap.to(toast, {
      opacity: 0, y: 20, duration: 0.3, ease: 'power2.in',
      onComplete() { toast.classList.remove('toast--visible'); }
    });
  }, 3000);
}

// --- Scroll to waitlist with pre-selected condition + toast ---
function scrollToWaitlist(condition) {
  const select = document.getElementById('waitlist-condition');
  if (select && condition) {
    select.value = condition;
  }

  if (condition) {
    showToast(`Signing up for ${condition} waitlist`);
  } else {
    showToast('Signing up for the waitlist');
  }

  document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('waitlist-email').focus();
  }, 600);
}
