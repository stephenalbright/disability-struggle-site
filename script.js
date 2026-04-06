/* ═══════════════════════════════════════════
   DISABILITY STRUGGLE — ANIMATIONS & LOGIC
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

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

// --- Product card: slides up ---
gsap.to('.product-card', {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.product-card',
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
