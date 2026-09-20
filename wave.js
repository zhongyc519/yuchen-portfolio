(() => {
  const canvas = document.querySelector('#wave-canvas');
  const ctx = canvas.getContext('2d');
  const button = document.querySelector('#wave-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, visible = true, raf = 0, time = 0, previous = 0;
  let width = 0, height = 0;
  const fieldHero = document.querySelector('.ember-hero');
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollPhase = 0;
  fieldHero.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || paused || reduced.matches) return;
    const box = fieldHero.getBoundingClientRect();
    pointer.targetX = ((event.clientX - box.left) / box.width - .5) * .18;
    pointer.targetY = ((event.clientY - box.top) / box.height - .5) * .12;
  }, { passive: true });
  fieldHero.addEventListener('pointerleave', () => { pointer.targetX = 0; pointer.targetY = 0; });
  let scrollRequest = 0;
  addEventListener('scroll', () => {
    if (scrollRequest || paused || reduced.matches) return;
    scrollRequest = requestAnimationFrame(() => {
      scrollRequest = 0;
      scrollPhase = Math.max(0, Math.min(1, -fieldHero.getBoundingClientRect().top / fieldHero.offsetHeight));
    });
  }, { passive: true });
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width / 2.5, height / 1.5);
    // A few coherent discoveries emerge from the otherwise irregular field.
    const discoveries = [
      {u: -.65 + Math.sin(time * .13) * .13, v: -.23, strength: .6 + .4 * Math.sin(time * .6) ** 2},
      {u: .45, v: .22 + Math.sin(time * .17) * .12, strength: .35 + .65 * Math.sin(time * .48 + 1.2) ** 2},
      {u: .96, v: -.62, strength: .25 + .5 * Math.sin(time * .38 + 2.4) ** 2}
    ];
    const lights = [];
    for (let z = -32; z <= 32; z += 2) {
      for (let x = -46; x <= 46; x += 2) {
        const u = x / 34, v = z / 32;
        const wave = Math.sin(u * 3.1 + time * .45) * Math.cos(v * 2.6 - time * .25) * .16 + Math.sin(u * 5 + v * 3 + time * .3) * .045;
        const centerU = .34 + pointer.x, centerV = -.05 + pointer.y;
        const distance = Math.hypot(u - centerU, (v - centerV) * .85);
        const aperture = Math.exp(-((distance - .37) ** 2) / .018);
        const compression = Math.exp(-(distance ** 2) / .22) * (.22 + scrollPhase * .14);
        const bentU = u + (centerU - u) * compression;
        const bentV = v + (centerV - v) * compression;
        const px = width / 2 + (bentU + bentV * .32) * scale * .8;
        const resolve = 1 - scrollPhase * .78;
        const py = height * .54 + (bentV * .32 - wave - aperture * .018) * scale * resolve;
        const edge = Math.max(0, 1 - Math.pow(Math.abs(u) / 1.43, 6)) * Math.max(0, 1 - Math.pow(Math.abs(v), 8));
        const alpha = edge * (.16 + (wave + .23) * .85);
        const light = Math.min(1, discoveries.reduce((sum, spot) => sum + Math.exp(-((u - spot.u) ** 2 + (v - spot.v) ** 2) / .026) * spot.strength, 0) + aperture * .27) * edge;
        const radius = Math.max(1.2, scale * .007);
        const columnHeight = scale * (.016 + (wave + .23) * .04) * resolve;
        const side = ctx.createLinearGradient(px - radius, 0, px + radius, 0);
        side.addColorStop(0, `rgba(56,63,73,${edge * .9})`);
        side.addColorStop(.35, `rgba(122,130,141,${Math.min(.8, alpha + .2)})`);
        side.addColorStop(1, `rgba(26,30,38,${edge * .95})`);
        ctx.fillStyle = side;
        ctx.beginPath(); ctx.moveTo(px - radius, py); ctx.lineTo(px - radius, py + columnHeight);
        ctx.ellipse(px, py + columnHeight, radius, radius * .45, 0, Math.PI, 0, true);
        ctx.lineTo(px + radius, py); ctx.closePath(); ctx.fill();
        ctx.fillStyle = `rgba(185,194,207,${Math.min(.95, alpha + .22)})`;
        ctx.beginPath(); ctx.ellipse(px, py, radius, radius * .48, 0, 0, Math.PI * 2); ctx.fill();
        if (light > .06) lights.push({px, py, light});
      }
    }
    // Halos are restricted to discovered points; the rest stays charcoal.
    ctx.globalCompositeOperation = 'screen';
    for (const {px, py, light} of lights) {
      const radius = Math.max(6, scale * .022);
      const halo = ctx.createRadialGradient(px, py, 0, px, py, radius);
      halo.addColorStop(0, `rgba(222,225,233,${light * .15})`);
      halo.addColorStop(1, 'rgba(222,225,233,0)');
      ctx.fillStyle = halo; ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
      ctx.fillStyle = `rgba(238,240,245,${Math.min(light, .9)})`;
      ctx.beginPath(); ctx.arc(px, py, Math.max(.8, scale * .0035), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function frame(now) {
    raf = 0;
    if (previous) time += Math.min((now - previous) / 1000, .05);
    previous = now; draw();
    pointer.x += (pointer.targetX - pointer.x) * .04;
    pointer.y += (pointer.targetY - pointer.y) * .04;
    if (!paused && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf); previous = 0;
    button.textContent = document.documentElement.lang === 'zh-CN' ? (paused ? '播放动态' : '暂停动态') : (paused ? 'Play motion' : 'Pause motion');
    button.setAttribute('aria-pressed', String(paused));
    draw(); if (!paused && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  new ResizeObserver(() => {
    width = canvas.clientWidth; height = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
  }).observe(canvas);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(canvas);
  button.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('portfolio:render', sync);
  sync();
  const hero = document.querySelector('.ember-hero');
  const profile = document.querySelector('#profile-panel');
  const trigger = document.querySelector('#about-trigger');
  const back = document.querySelector('#profile-back');
  if (!trigger) return;
  function showProfile(open) {
    profile.hidden = !open;
    hero.classList.toggle('profile-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    document.querySelector('.ember-description').inert = open;
    if (open) profile.focus(); else trigger.focus();
  }
  trigger.addEventListener('click', () => showProfile(true));
  back.addEventListener('click', () => showProfile(false));
  hero.addEventListener('keydown', event => { if (event.key === 'Escape' && !profile.hidden) showProfile(false); });
})();
