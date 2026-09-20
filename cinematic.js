(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.querySelector('.ember-hero');
  let contentContext;

  function contentMotion() {
    contentContext?.revert();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    contentContext = gsap.context(() => {
      gsap.utils.toArray('#work-grid .work-entry').slice(2).forEach(entry => {
        gsap.fromTo(entry, { y: 28, autoAlpha: .72 }, {
          y: 0,
          autoAlpha: 1,
          duration: .9,
          ease: 'power3.out',
          scrollTrigger: { trigger: entry, start: 'top 92%', once: true }
        });
      });
    });
  }

  document.addEventListener('portfolio:render', () => {
    contentMotion();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  function anchorPosition(id, target) {
    if (id === '#') return 0;
    return Math.max(0, target.getBoundingClientRect().top + scrollY - 100);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = link.getAttribute('href');
    if (id === '#capabilities') return;
    const target = id === '#' ? hero : document.getElementById(id.slice(1));
    if (!target) return;
    event.preventDefault();
    const destination = anchorPosition(id, target);
    ScrollTrigger.refresh();
    history.pushState(null, '', id);
    requestAnimationFrame(() => {
      window.scrollTo({ top: destination, behavior: 'instant' });
      ScrollTrigger.update();
      if (id !== '#') {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  document.addEventListener('keydown', event => {
    const trigger = ScrollTrigger.getById('hero-sequence');
    const description = document.querySelector('.ember-description');
    if (event.key === 'Tab' && trigger && scrollY < trigger.end && scrollY >= trigger.start) {
      description.inert = false;
      if (trigger.progress < .76) {
        window.scrollTo(0, trigger.start + (trigger.end - trigger.start) * .82);
        ScrollTrigger.update();
      }
    }
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => {
    contentMotion();
    ScrollTrigger.refresh();
    if (location.hash && location.hash !== '#') {
      const target = document.getElementById(location.hash.slice(1));
      if (target) requestAnimationFrame(() => window.scrollTo(0, anchorPosition(location.hash, target)));
    }
  });
  addEventListener('pagehide', () => contentContext?.revert(), { once: true });
})();
