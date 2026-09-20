(() => {
  if (!window.Motion) return;
  const { animate, inView } = window.Motion;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = [.22, 1, .36, 1];
  const active = new Map();
  const sequence = document.querySelector('#capabilities-grid');
  let signalFrame = 0;
  function updateSignal() {
    signalFrame = 0;
    const box = sequence.getBoundingClientRect();
    const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .7 - box.top) / Math.max(1, box.height - 50)));
    const items = [...sequence.children];
    const reached = items.map(item => reduced.matches || item.getBoundingClientRect().top < innerHeight * .7);
    sequence.style.setProperty('--signal-progress', progress);
    items.forEach((item, index) => item.classList.toggle('is-reached', reached[index]));
  }
  function requestSignal() { if (!signalFrame) signalFrame = requestAnimationFrame(updateSignal); }
  addEventListener('scroll', requestSignal, { passive: true });
  addEventListener('resize', requestSignal, { passive: true });
  document.addEventListener('portfolio:render', requestSignal);
  reduced.addEventListener('change', requestSignal);
  requestSignal();
  function glide(element, properties, duration = .55) {
    active.get(element)?.stop();
    if (reduced.matches) return;
    const control = animate(element, properties, { duration, ease });
    active.set(element, control);
    control.then(() => { if (active.get(element) === control) active.delete(element); });
  }
  // Content is never hidden while waiting for JS or an intersection event.
  inView('.section-heading, .lab-layout, .about-columns', element => {
    glide(element, { y: [16, 0] }, .7);
  }, { amount: .15 });
  const profile = document.querySelector('#profile-panel');
  new MutationObserver(() => {
    if (!profile.hidden) glide(profile, { y: [10, 0], opacity: [.7, 1] }, .4);
  }).observe(profile, { attributes: true, attributeFilter: ['hidden'] });
  document.querySelectorAll('dialog').forEach(dialog => {
    new MutationObserver(() => {
      if (dialog.open) glide(dialog, { y: [12, 0], opacity: [.8, 1] }, .28);
    }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  const grid = document.querySelector('#work-grid');
  grid.addEventListener('pointerover', event => {
    if (event.pointerType !== 'mouse') return;
    const card = event.target.closest('.work-card');
    if (card && !card.contains(event.relatedTarget)) glide(card.querySelector('.work-art'), { y: -3 }, .24);
  });
  grid.addEventListener('pointerout', event => {
    const card = event.target.closest('.work-card');
    if (card && !card.contains(event.relatedTarget)) glide(card.querySelector('.work-art'), { y: 0 }, .28);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { active.forEach((control, element) => { control.stop(); element.style.transform = 'none'; element.style.opacity = '1'; }); active.clear(); }
  });
})();
