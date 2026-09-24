// 1. Luxury Preloader Counter logic
(function initPreloader() {
  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');
  const preloader = document.getElementById('kva-preloader');
  let count = 0;

  const timer = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 4;
    if (count >= 100) {
      count = 100;
      clearInterval(timer);
      counterEl.textContent = '100';
      barEl.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 700);
      }, 300);
    } else {
      counterEl.textContent = count < 10 ? '0' + count : count;
      barEl.style.width = count + '%';
    }
  }, 35);
})();

// 2. Custom Magnetic Follower Cursor
const dot = document.getElementById('cursor-dot');
const disc = document.getElementById('cursor-disc');
const cursorText = document.getElementById('cursor-text');

let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let discX = mouseX, discY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  }
});

function animateFollower() {
  discX += (mouseX - discX) * 0.15;
  discY += (mouseY - discY) * 0.15;
  if (disc) {
    const r = disc.offsetWidth / 2;
    disc.style.transform = `translate(${discX - r}px, ${discY - r}px)`;
  }
  requestAnimationFrame(animateFollower);
}
if (disc && window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) {
  document.body.classList.add('has-custom-cursor');
  requestAnimationFrame(animateFollower);
} else {
  dot?.remove();
  disc?.remove();
}

// Hover state over projects
document.querySelectorAll('.project-card').forEach(card => {
  if (!disc) return;
  card.addEventListener('mouseenter', () => {
    disc.classList.add('w-16', 'h-16', 'bg-on-tertiary-container', 'border-transparent');
    cursorText.textContent = 'VIEW';
    cursorText.classList.remove('opacity-0');
  });
  card.addEventListener('mouseleave', resetCursorHover);
});

function resetCursorHover() {
  if (!disc) return;
  disc.classList.remove('w-16', 'h-16', 'bg-on-tertiary-container', 'border-transparent');
  cursorText.classList.add('opacity-0');
  cursorText.textContent = '';
}

// 3. Project Filter Tabs
window.filterProjects = function(category) {
  const cards = document.querySelectorAll('.project-card');
  const buttons = document.querySelectorAll('.project-filter-btn');

  buttons.forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.className = 'project-filter-btn px-space-md py-space-xs font-label-sm text-label-sm uppercase tracking-wider bg-on-tertiary-container text-on-background border border-on-tertiary-container transition-all';
    } else {
      btn.className = 'project-filter-btn px-space-md py-space-xs font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/30 transition-all';
    }
  });

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'grid';
    } else {
      card.style.display = 'none';
    }
  });
};

// 4. Case Study Drawer Database & State
const caseData = {
  "vantage": {
    "id": "DOC_01 // VANTAGE",
    "title": "VANTAGE MOTORS DUBAI",
    "subtitle": "Premium multi-brand luxury automotive showroom — \"Drive What Defines You.\"",
    "image": "/images/work/vantage-motors.jpg",
    "url": "https://vintage-dubai.vercel.app/",
    "timeline": "AUTOMOTIVE // DUBAI",
    "goal": "INVENTORY DISCOVERY & TEST DRIVES",
    "impact": "vintage-dubai.vercel.app",
    "challenge": "A digital showroom for verified hypercars and certified GCC-spec pre-owned vehicles, built to feel as premium online as a flagship dealership on Sheikh Zayed Road.",
    "solution": "A black-and-gold showroom experience with a search bar over the hero (make, model, price range in AED and body type), browsable collections — luxury cars, performance SUVs, sports & hypercars, executive saloons, EVs and premium used — plus a sell-your-car flow, test-drive booking and a floating VIP concierge.",
    "stack": [
      "Next.js",
      "React",
      "Vercel"
    ]
  },
  "vanya": {
    "id": "DOC_02 // VANYA",
    "title": "ATELIER VANYA",
    "subtitle": "Interior architecture & spatial design — \"Spaces That Tell Stories.\"",
    "image": "/images/work/atelier-vanya.jpg",
    "url": "https://interior-design-4enc.vercel.app/",
    "timeline": "INTERIORS // ARCHITECTURE",
    "goal": "PORTFOLIO & CONSULTATIONS",
    "impact": "interior-design-4enc.vercel.app",
    "challenge": "A studio site for considered interior architecture, where geological materiality, silent proportions, deep light and everyday Indian life converge into enduring calm.",
    "solution": "A warm, stone-toned editorial site with a blueprint-overlay hero, a story that moves from line to stone to light to life, a selected-works folio (The Earth House, The Olive Residence, The Courtyard Home and more), a materiality section on sandstone, teak, lime plaster and brass, services, process and consultation requests.",
    "stack": [
      "Next.js",
      "React",
      "Vercel"
    ]
  },
  "luxe": {
    "id": "DOC_03 // LUXE",
    "title": "LUXE HAIR STUDIO",
    "subtitle": "Atelier of haute coiffure — \"Hair Is An Attitude.\"",
    "image": "/images/work/luxe-hair-studio.jpg",
    "url": "https://luxe-hair-studio-ten.vercel.app/",
    "timeline": "BEAUTY // SALON",
    "goal": "SERVICES & APPOINTMENTS",
    "impact": "luxe-hair-studio-ten.vercel.app",
    "challenge": "An atelier for couture haircuts, bespoke balayage and restorative hair-spa rituals that needed a website as editorial as the work in the chair.",
    "solution": "A cinematic hero with serif display type, a services menu (cut & sculptural style, couture colour, balayage, caviar hair spa, bridal & gala), an interactive before & after transformation, the lookbook, the artists, a ritual menu and a \"Book an appointment\" flow.",
    "stack": [
      "Next.js",
      "React",
      "Vercel"
    ]
  },
  "sambhar": {
    "id": "DOC_04 // SAMBHAR",
    "title": "SAMBHAR MODERN INDIAN",
    "subtitle": "Timeless Indian flavours and a curated table — \"India, Reimagined.\"",
    "image": "/images/work/sambhar.jpg",
    "url": "https://sample-restroo.vercel.app/",
    "timeline": "HOSPITALITY // RESTAURANT",
    "goal": "RESERVATIONS & PRIVATE DINING",
    "impact": "sample-restroo.vercel.app",
    "challenge": "A restaurant brand pairing timeless Indian flavours with contemporary sensorial architecture, designed for unforgettable twilight dinners in New Delhi and Mayfair, London.",
    "solution": "An atmospheric site with a full-bleed dining-room hero, the restaurant story, the menu, the experience, a gallery, guest reviews, locations, private dining enquiries and a prominent \"Reserve a table\" call to action.",
    "stack": [
      "Next.js",
      "React",
      "Vercel"
    ]
  },
  "mojito": {
    "id": "DOC_05 // MOJITO",
    "title": "THE GENTLE POUR — MOJITO",
    "subtitle": "An animated cocktail bar experience — \"Sip the Spirit of Summer.\"",
    "image": "/images/work/gentle-pour-mojito.jpg",
    "url": "https://mojito-theta.vercel.app/",
    "timeline": "HOSPITALITY // BAR & CAFÉ",
    "goal": "MOTION-LED STORYTELLING",
    "impact": "mojito-theta.vercel.app",
    "challenge": "A bar brand where every detail matters, from muddle to garnish, so the website had to feel crafted, playful and alive.",
    "solution": "A single-page, animation-heavy experience: an oversized serif hero with floating leaves and a cocktail glass, popular cocktails and mocktails, \"The Art\" craft section, a cocktail menu, ingredients, opening hours, location and socials.",
    "stack": [
      "React",
      "Vite",
      "Vercel"
    ]
  }
};

window.openDrawer = function(key) {
  const data = caseData[key];
  if (!data) return;

  document.getElementById('drawer-id').textContent = data.id;
  document.getElementById('drawer-title').textContent = data.title;
  document.getElementById('drawer-subtitle').textContent = data.subtitle;
  document.getElementById('drawer-image').src = data.image;
  document.getElementById('drawer-timeline').textContent = data.timeline;
  document.getElementById('drawer-goal').textContent = data.goal;
  const impact = document.getElementById('drawer-impact');
  impact.textContent = data.impact;
  impact.href = data.url;
  document.getElementById('drawer-live').href = data.url;
  document.getElementById('drawer-image').alt = data.title + ' website preview';
  document.getElementById('drawer-challenge').textContent = data.challenge;
  document.getElementById('drawer-solution').textContent = data.solution;

  const stackContainer = document.getElementById('drawer-stack');
  stackContainer.innerHTML = '';
  data.stack.forEach(tech => {
    const pill = document.createElement('span');
    pill.className = 'px-space-sm py-[2px] bg-surface-container font-label-sm text-label-sm uppercase text-on-surface border border-outline-variant/30';
    pill.textContent = tech;
    stackContainer.appendChild(pill);
  });

  resetCursorHover();

  const backdrop = document.getElementById('case-drawer-backdrop');
  const drawer = document.getElementById('case-drawer');
  backdrop.classList.remove('opacity-0', 'pointer-events-none');
  backdrop.classList.add('opacity-100', 'pointer-events-auto');
  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  drawer.scrollTop = 0;
  drawer.querySelector('button')?.focus({ preventScroll: true });
};

window.closeDrawer = function() {
  const backdrop = document.getElementById('case-drawer-backdrop');
  const drawer = document.getElementById('case-drawer');
  backdrop.classList.add('opacity-0', 'pointer-events-none');
  backdrop.classList.remove('opacity-100', 'pointer-events-auto');
  drawer.classList.add('translate-x-full');
  drawer.classList.remove('translate-x-0');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

// 5. Services Accordion Row Expansion
window.toggleService = function(row) {
  const details = row.querySelector('.service-details');
  const icon = row.querySelector('.service-icon');
  const isHidden = details.classList.contains('hidden');

  // Close other rows for clean luxury feel
  document.querySelectorAll('.service-details').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.service-icon').forEach(el => {
    el.textContent = 'add';
    el.classList.remove('rotate-45');
  });

  if (isHidden) {
    details.classList.remove('hidden');
    icon.textContent = 'close';
    icon.classList.add('rotate-45');
  }
};

// 6. Interactive Brief Form Chips
window.selectType = function(btn) {
  document.querySelectorAll('.type-chip').forEach(b => {
    b.classList.remove('bg-on-tertiary-container', 'text-on-background', 'border-on-tertiary-container');
    b.classList.add('bg-surface', 'border-outline-variant/40');
  });
  btn.classList.remove('bg-surface', 'border-outline-variant/40');
  btn.classList.add('bg-on-tertiary-container', 'text-on-background', 'border-on-tertiary-container');
};

window.selectBudget = function(btn) {
  document.querySelectorAll('.budget-chip').forEach(b => {
    b.classList.remove('bg-on-tertiary-container', 'text-on-background', 'border-on-tertiary-container');
    b.classList.add('bg-surface', 'border-outline-variant/40');
  });
  btn.classList.remove('bg-surface', 'border-outline-variant/40');
  btn.classList.add('bg-on-tertiary-container', 'text-on-background', 'border-on-tertiary-container');
};

window.handleBriefSubmit = function(e) {
  e.preventDefault();
  const successBox = document.getElementById('form-success');
  successBox.classList.remove('hidden');
  document.getElementById('project-brief-form').reset();
};

// 7. Clipboard Helper
window.copyToClipboard = function(text, el) {
  navigator.clipboard.writeText(text).then(() => {
    const originalIcon = el.innerHTML;
    el.innerHTML = '<span class="material-symbols-outlined text-sm text-on-tertiary-container">done</span>';
    setTimeout(() => {
      el.innerHTML = originalIcon;
    }, 2000);
  });
};

// 8. Mobile navigation menu
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

function setMenu(open) {
  mobileMenu.classList.toggle('hidden', !open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuIcon.textContent = open ? 'close' : 'menu';
}

menuToggle.addEventListener('click', () => setMenu(mobileMenu.classList.contains('hidden')));
mobileMenu.querySelectorAll('.mobile-link').forEach((link) => link.addEventListener('click', () => setMenu(false)));
window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setMenu(false));

// 9. Escape closes the drawer / menu
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeDrawer();
  setMenu(false);
});

// 10. Highlight the nav link for the section in view
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('text-on-surface', active);
        link.classList.toggle('font-medium', active);
        link.classList.toggle('text-on-surface-variant', !active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
['work-section', 'services', 'approach', 'process', 'inquiry-section'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});
