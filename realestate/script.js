/* ===================================================================
   AURELÍA — Interaction & Animation Layer (GSAP + ScrollTrigger)
=================================================================== */
gsap.registerPlugin(ScrollTrigger);

const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 900;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================== LOADER ===================== */
function runLoader(){
  return new Promise((resolve)=>{
    const fill = document.getElementById('loaderFill');
    const pct = document.getElementById('loaderPct');
    const obj = { v: 0 };
    gsap.to(obj, {
      v: 100, duration: prefersReducedMotion ? 0.2 : 1.6, ease:'power2.inOut',
      onUpdate(){
        const val = Math.round(obj.v);
        fill.style.width = val + '%';
        pct.textContent = String(val).padStart(2,'0');
      },
      onComplete(){
        gsap.to('.seal-cross', { strokeDashoffset:0, duration:.5, ease:'power2.out' });
        gsap.to('.loader', {
          yPercent:-100, duration:.9, ease:'power3.inOut', delay:.15,
          onComplete(){ document.getElementById('loader').style.display='none'; resolve(); }
        });
      }
    });
  });
}





/* ===================== NAVBAR ===================== */
function initNav(){
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 60, end: 99999,
    onUpdate(self){ nav.classList.toggle('scrolled', self.scroll() > 60); }
  });

  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', ()=>{
    burger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open');
  });
  mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
    burger.classList.remove('is-open'); mobileMenu.classList.remove('is-open');
  }));

  // mega menu touch toggle
  const trigger = document.getElementById('collectionsTrigger');
  if (isTouch){
    trigger.querySelector('.nav-link').addEventListener('click', (e)=>{
      e.preventDefault();
      trigger.classList.toggle('mega-open');
    });
  }
}

/* ===================== HERO ===================== */
function initHero(){
  // split words already wrapped in spans in markup; animate them
  const tl = gsap.timeline({ delay:.15, defaults:{ ease:'power4.out' } });

  tl.to('#heroImg', { scale:1, duration: prefersReducedMotion?0.1:2.2, ease:'power3.out' }, 0)
    .to('.hero-title .word', { y:'0%', duration:1.1, stagger:0.05 }, .1)
    .to('.eyebrow.reveal-line span, .hero-sub.reveal-line span, .hero-actions.reveal-line', {
      opacity:1, y:0, duration:.9
    }, .5)
    .fromTo('.hero-trust', { opacity:0, y:16 }, { opacity:1, y:0, duration:.9 }, .75)
    .to('#heroThreadPath', { strokeDashoffset:0, duration:1.8, ease:'power2.inOut' }, .6);

  gsap.set('.eyebrow.reveal-line span, .hero-sub.reveal-line span, .hero-actions.reveal-line', { opacity:0, y:14 });

  // parallax on scroll
  gsap.to('#heroImg', {
    yPercent: 14,
    ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
  });
  gsap.to('.hero-content', {
    yPercent: 22, opacity:.4, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
  });
}

/* ===================== COUNTERS ===================== */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el=>{
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    const obj = { v:0 };
    ScrollTrigger.create({
      trigger: el, start:'top 88%', once:true,
      onEnter(){
        gsap.to(obj, {
          v: target, duration:1.8, ease:'power2.out',
          onUpdate(){ el.textContent = obj.v.toFixed(decimals); }
        });
      }
    });
  });
}

/* ===================== SCROLL REVEALS ===================== */
function initReveals(){
  // section heads
  gsap.utils.toArray('.section-head').forEach(head=>{
    gsap.from(head.children, {
      opacity:0, y:34, filter:'blur(6px)', duration:1, stagger:.12, ease:'power3.out',
      scrollTrigger:{ trigger:head, start:'top 82%' }
    });
  });

  // property cards stagger
  gsap.from('.property-card', {
    opacity:0, y:50, scale:.96, filter:'blur(8px)', duration:1, stagger:.12, ease:'power3.out',
    scrollTrigger:{ trigger:'#propertyGrid', start:'top 85%' }
  });

  // pillars
  gsap.from('.pillar', {
    opacity:0, y:40, duration:.9, stagger:.15, ease:'power3.out',
    scrollTrigger:{ trigger:'.why-pillars', start:'top 85%' }
  });

  // why thread draw
  gsap.to('#whyThreadPath', {
    strokeDashoffset:0, ease:'none',
    scrollTrigger:{ trigger:'.why', start:'top 70%', end:'bottom 80%', scrub:true }
  });

  // footer thread draw
  gsap.to('#footerThreadPath', {
    strokeDashoffset:0, ease:'none',
    scrollTrigger:{ trigger:'.footer', start:'top 95%', end:'top 60%', scrub:true }
  });

  // tier cards
  gsap.from('.tier-card', {
    opacity:0, x:30, duration:.8, stagger:.12, ease:'power3.out',
    scrollTrigger:{ trigger:'.invest-tiers', start:'top 85%' }
  });

  gsap.from('.invest-chart-card', {
    opacity:0, y:30, duration:1, ease:'power3.out',
    scrollTrigger:{ trigger:'.invest-chart-card', start:'top 85%' }
  });

  // roi chart draw
  ScrollTrigger.create({
    trigger:'#roiChart', start:'top 80%', once:true,
    onEnter(){
      gsap.to('#roiLinePath', { strokeDashoffset:0, duration:1.8, ease:'power2.inOut' });
      gsap.fromTo('#roiAreaPath', { opacity:0 }, { opacity:.5, duration:1.2, delay:.3 });
      gsap.fromTo('#roiDashedPath', { opacity:0 }, { opacity:1, duration:1, delay:.6 });
    }
  });

  // floorplan rooms draw
  ScrollTrigger.create({
    trigger:'.exp-floorplan', start:'top 85%', once:true,
    onEnter(){
      gsap.to('.fp-room', { strokeDashoffset:0, duration:1.4, stagger:.12, ease:'power2.inOut' });
    }
  });

  // contact form + map
  gsap.from('.contact-form .field, .contact-form .btn', {
    opacity:0, y:20, duration:.7, stagger:.08, ease:'power3.out',
    scrollTrigger:{ trigger:'.contact-form', start:'top 85%' }
  });
  gsap.from('.office-map, .office', {
    opacity:0, y:24, duration:.8, stagger:.08, ease:'power3.out',
    scrollTrigger:{ trigger:'.contact-offices', start:'top 85%' }
  });
}

/* ===================== PROPERTY FILTER ===================== */
function initFilters(){
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.property-card');
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card=>{
        const show = filter==='all' || card.dataset.cat===filter;
        if (show){
          card.classList.remove('is-hidden');
          gsap.fromTo(card, { opacity:0, y:14 }, { opacity:1, y:0, duration:.5, ease:'power2.out' });
        } else {
          gsap.to(card, { opacity:0, duration:.2, onComplete(){ card.classList.add('is-hidden'); } });
        }
      });
    });
  });
}

/* ===================== 3D CARD TILT ===================== */
function initCardTilt(){
  if (isTouch) return;
  document.querySelectorAll('.property-card').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - .5;
      const py = (e.clientY - r.top)/r.height - .5;
      gsap.to(card, { rotateY: px*6, rotateX: -py*6, duration:.4, ease:'power2.out', transformPerspective:800 });
    });
    card.addEventListener('mouseleave', ()=>{
      gsap.to(card, { rotateY:0, rotateX:0, duration:.6, ease:'power3.out' });
    });
  });
}

/* ===================== HORIZONTAL SCROLL COLLECTIONS ===================== */
function initHScroll(){
  const track = document.getElementById('hscrollTrack');
  const wrap = document.getElementById('hscrollWrap');
  if (!track || !wrap) return;

  function build(){
    ScrollTrigger.getAll().forEach(st=>{ if (st.vars.id==='hscroll') st.kill(); });
    const distance = track.scrollWidth - window.innerWidth;
    if (distance <= 0) return;
    gsap.to(track, {
      x: -distance, ease:'none',
      scrollTrigger:{
        id:'hscroll', trigger: wrap, start:'top top', end:()=> '+=' + (distance + window.innerHeight*.2),
        scrub:1, pin:true, anticipatePin:1, invalidateOnRefresh:true
      }
    });
  }
  build();
  window.addEventListener('resize', ()=> { gsap.delayedCall(0.2, build); });
}

/* ===================== EXPERIENCE PINNED WALKTHROUGH ===================== */
function initExperience(){
  const steps = gsap.utils.toArray('.exp-step');
  const images = gsap.utils.toArray('.exp-img');
  if (!steps.length) return;

  ScrollTrigger.create({
    trigger:'#expPin', start:'top top', end:'+=320%', pin:true, scrub:.4,
    onUpdate(self){
      const idx = Math.min(steps.length-1, Math.floor(self.progress * steps.length));
      steps.forEach((s,i)=> s.classList.toggle('active', i===idx));
      images.forEach((img,i)=> img.classList.toggle('active', i===idx));
    }
  });
}

/* ===================== TESTIMONIAL CAROUSEL ===================== */
function initTestimonials(){
  const cards = document.querySelectorAll('.test-card');
  const dotsWrap = document.getElementById('testDots');
  let idx = 0; let timer;

  cards.forEach((_,i)=>{
    const d = document.createElement('span');
    if (i===0) d.classList.add('active');
    d.addEventListener('click', ()=> go(i));
    dotsWrap.appendChild(d);
  });
  const dots = dotsWrap.children;

  function go(i){
    cards[idx].classList.remove('active');
    dots[idx].classList.remove('active');
    idx = (i + cards.length) % cards.length;
    cards[idx].classList.add('active');
    dots[idx].classList.add('active');
    resetTimer();
  }
  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(()=> go(idx+1), 6000);
  }

  document.getElementById('testPrev').addEventListener('click', ()=> go(idx-1));
  document.getElementById('testNext').addEventListener('click', ()=> go(idx+1));
  resetTimer();
}

/* ===================== CONTACT FORM ===================== */
function initContactForm(){
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn = document.getElementById('submitBtn');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    btn.querySelector('span').textContent = 'Sending\u2026';
    setTimeout(()=>{
      btn.querySelector('span').textContent = 'Request a Private Consultation';
      success.classList.add('is-visible');
      form.reset();
    }, 900);
  });
}

/* ===================== MEGA MENU COLLECTION FILTER LINK ===================== */
function initMegaLinks(){
  document.querySelectorAll('.mega-col').forEach(col=>{
    col.addEventListener('click', (e)=>{
      const map = { villas:'villa', apartments:'penthouse', commercial:'commercial', investment:'estate' };
      const cat = map[col.dataset.collection];
      if (cat){
        setTimeout(()=>{
          const tab = document.querySelector(`.filter-tab[data-filter="${cat}"]`);
          if (tab) tab.click();
        }, 600);
      }
    });
  });
}

/* ===================== INIT ===================== */
document.addEventListener('DOMContentLoaded', async ()=>{

  initFilters();
  initCardTilt();
  initTestimonials();
  initContactForm();
  initMegaLinks();

  await runLoader();

  initHero();
  initCounters();
  initReveals();
  initHScroll();
  initExperience();

  ScrollTrigger.refresh();
});
