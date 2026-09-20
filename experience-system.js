(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const radiant = window.radiantState || { progress: 0, dark: 0 };
  const wiredLiquidActions = new WeakSet();
  let media = null;
  let refreshFrame = 0;

  const requestRefresh = () => {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  function setupLiquidActions() {
    document.querySelectorAll('.liquid-action').forEach(action => {
      if (wiredLiquidActions.has(action)) return;
      wiredLiquidActions.add(action);
      let pointerFrame = 0;
      let nextX = 50;
      let nextY = 50;
      const draw = () => {
        pointerFrame = 0;
        action.style.setProperty('--pointer-x', `${nextX}%`);
        action.style.setProperty('--pointer-y', `${nextY}%`);
      };
      action.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse') return;
        const rect = action.getBoundingClientRect();
        nextX = ((event.clientX - rect.left) / rect.width) * 100;
        nextY = ((event.clientY - rect.top) / rect.height) * 100;
        if (!pointerFrame) pointerFrame = requestAnimationFrame(draw);
      }, { passive: true });
      action.addEventListener('pointerleave', () => {
        nextX = 50;
        nextY = 50;
        if (!pointerFrame) pointerFrame = requestAnimationFrame(draw);
      }, { passive: true });
    });
  }

  function setHeroScene(scenes, index) {
    scenes.forEach((scene, sceneIndex) => {
      const active = sceneIndex === index;
      scene.classList.toggle('is-current', active);
      scene.setAttribute('aria-hidden', String(!active));
      if (sceneIndex === scenes.length - 1) scene.inert = !active;
    });
  }

  function buildHeroTimeline({ mobile }) {
    const hero = document.querySelector('#hero-scene');
    const scenes = gsap.utils.toArray('[data-hero-scene]', hero);
    if (!hero || scenes.length !== 5) return null;

    document.body.classList.add('continuous-motion');
    gsap.set(scenes, { autoAlpha: 0, y: 46, scale: .985, filter: 'blur(9px)', clipPath: 'inset(12% 0 12% 0)' });
    gsap.set(scenes[0], { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0% 0 0% 0)' });
    gsap.set('.hero-continuity-line', { scaleY: 0 });
    setHeroScene(scenes, 0);

    const timeline = gsap.timeline({
      scrollTrigger: {
        id: 'hero-sequence',
        trigger: hero,
        start: 'top top',
        end: () => `+=${innerHeight * (mobile ? 4.45 : 5.1)}`,
        pin: true,
        scrub: mobile ? .55 : .82,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const active = Math.min(4, Math.floor(self.progress * 5));
          setHeroScene(scenes, active);
          radiant.progress = self.progress;
          radiant.dark = gsap.utils.clamp(0, .48, Math.max(0, self.progress - .54) * .92);
          document.dispatchEvent(new CustomEvent('radiant:draw'));
        }
      }
    });

    timeline.to({}, { duration: .52 });
    scenes.slice(1).forEach((scene, index) => {
      const previous = scenes[index];
      const at = .72 + index * 1.05;
      timeline
        .to(previous, { autoAlpha: 0, y: -54, scale: 1.018, filter: 'blur(8px)', clipPath: 'inset(0 0 88% 0)', duration: .34, ease: 'power2.in' }, at)
        .set(previous, { visibility: 'hidden' }, at + .34)
        .set(scene, { visibility: 'visible' }, at + .14)
        .to(scene, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0% 0 0% 0)', duration: .52, ease: 'power3.out' }, at + .16);
    });
    timeline.to('.hero-continuity-line', { scaleY: 1, duration: .45, ease: 'power3.out' }, 4.62).to({}, { duration: .58 });
    return timeline;
  }

  function buildAboutBridge() {
    const about = document.querySelector('#about');
    if (!about) return null;
    gsap.set(about.querySelector('h2'), { clipPath: 'inset(0 0 100% 0)', y: 28 });
    gsap.set(about.querySelector('.narrative-spine'), { scaleY: .08 });
    return gsap.timeline({ scrollTrigger: { trigger: about, start: 'top 78%', end: 'top 25%', scrub: .7 } })
      .to(about.querySelector('.narrative-spine'), { scaleY: 1, ease: 'none' }, 0)
      .to(about.querySelector('h2'), { clipPath: 'inset(0 0 0% 0)', y: 0, ease: 'none' }, .08)
      .fromTo(about.querySelector('.about-portrait'), { yPercent: 3 }, { yPercent: -2, ease: 'none' }, 0);
  }

  function buildExperienceBridge() {
    const bridge = document.querySelector('#experience-bridge');
    if (!bridge) return null;
    const stages = gsap.utils.toArray('.bridge-stage', bridge);
    gsap.set(stages, { y: 28, autoAlpha: .28, '--bridge-copy': 0 });
    return gsap.timeline({
      scrollTrigger: { trigger: bridge, start: 'top 88%', end: 'bottom 22%', scrub: .75 }
    })
      .to(bridge, { '--bridge-line': 1, duration: 1, ease: 'none' })
      .to(stages, { y: 0, autoAlpha: 1, stagger: .13, duration: .58, ease: 'none' }, 0)
      .to(stages, { '--bridge-copy': 1, stagger: .1, duration: .45, ease: 'none' }, .42)
      .to(stages, { color: '#d8ff24', stagger: .08, duration: .34, ease: 'none' }, .78);
  }

  function setActiveStage(index) {
    document.querySelectorAll('.process-stage').forEach((stage, stageIndex) => stage.classList.toggle('is-active', stageIndex === index));
    document.querySelectorAll('.process-rail li').forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === index);
      item.classList.toggle('is-complete', index === 6);
    });
  }

  function buildThinkingTimeline({ mobile }) {
    const process = document.querySelector('#thinking-process');
    const arrival = process?.querySelector('.process-arrival');
    const summary = process?.querySelector('#process-summary');
    const handoff = process?.querySelector('#method-handoff');
    const rail = process?.querySelector('#process-rail');
    const field = process?.querySelector('.process-field');
    if (!process || !arrival || !summary || !handoff) return null;
    const stages = gsap.utils.toArray('.process-stage', process);
    const nodes = gsap.utils.toArray('.process-nodes circle', process);
    const traces = gsap.utils.toArray('.process-trace', process);
    const icons = gsap.utils.toArray('.field-icon', process);
    const summaryItems = gsap.utils.toArray('.process-summary li', process);
    if (stages.length !== 6 || icons.length !== 6 || nodes.length !== 9) return null;

    const releaseStates = [
      [[-20,-16],[18,12],[-14,16],[22,-12],[0,0],[-18,-8],[16,14],[-12,20],[20,-18]],
      [[-72,-22],[66,18],[-34,54],[38,-48],[0,0],[-48,-34],[54,36],[-66,58],[70,-56]],
      [[48,62],[48,-62],[26,34],[26,-34],[0,0],[-26,34],[-26,-34],[-48,62],[-48,-62]],
      [[-82,0],[-42,0],[-18,0],[18,0],[0,0],[42,0],[82,0],[-62,0],[62,0]],
      [[-62,-42],[62,-42],[-38,38],[38,38],[0,0],[-72,42],[72,42],[-26,-62],[26,-62]],
      [[-118,-74],[118,-74],[-64,48],[64,48],[0,0],[-110,70],[110,70],[-32,-92],[32,-92]]
    ];
    const centerOffsets = nodes.map(node => ({ x: 400 - Number(node.getAttribute('cx')), y: 280 - Number(node.getAttribute('cy')) }));

    gsap.set(arrival, { autoAlpha: 1, y: 0, visibility: 'visible' });
    gsap.set(stages, { autoAlpha: 0, y: 34, visibility: 'hidden', clipPath: 'inset(0 0 16% 0)' });
    gsap.set(icons, { autoAlpha: 0, scale: .08, rotation: -8, visibility: 'hidden' });
    gsap.set(nodes, { opacity: .42, scale: .72 });
    nodes.forEach((node, index) => gsap.set(node, { x: releaseStates[0][index][0], y: releaseStates[0][index][1] }));
    gsap.set(traces, { strokeDashoffset: 900, opacity: .2 });
    gsap.set(summary, { autoAlpha: 0, y: 32, visibility: 'hidden' });
    gsap.set(summaryItems, { autoAlpha: 0, y: 20 });
    gsap.set(handoff, { autoAlpha: 0, y: 16, visibility: 'hidden' });
    setActiveStage(-1);

    let activeState = -2;
    const timeline = gsap.timeline({
      scrollTrigger: {
        id: 'thinking-sequence',
        trigger: process,
        start: 'top top',
        end: () => `+=${innerHeight * (mobile ? 8.1 : 8.6)}`,
        pin: true,
        scrub: mobile ? .62 : .85,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate() {
          const time = timeline.time();
          const nextState = time < .78 ? -1 : time >= 7.3 ? 6 : Math.min(5, Math.floor((time - .78) / 1.08));
          if (nextState !== activeState) {
            activeState = nextState;
            setActiveStage(nextState);
          }
          gsap.set('.thinking-progress i', { scaleX: nextState < 0 ? .04 : (nextState + 1) / 7 });
        }
      }
    });

    timeline
      .to({}, { duration: .55 })
      .to(arrival, { autoAlpha: 0, y: -34, clipPath: 'inset(0 0 85% 0)', duration: .34, ease: 'power2.in' }, .58)
      .set(arrival, { visibility: 'hidden' }, .92)
      .to(traces, { strokeDashoffset: 620, opacity: .34, duration: .48, ease: 'none' }, .62);

    stages.forEach((stage, stageIndex) => {
      const base = .82 + stageIndex * 1.08;
      const icon = icons[stageIndex];
      const nextState = releaseStates[Math.min(stageIndex + 1, releaseStates.length - 1)];
      timeline
        .set(stage, { visibility: 'visible' }, base + .14)
        .to(nodes, {
          x: nodeIndex => centerOffsets[nodeIndex].x,
          y: nodeIndex => centerOffsets[nodeIndex].y,
          scale: .28,
          opacity: 1,
          duration: .24,
          ease: 'power3.in'
        }, base)
        .to(traces, { opacity: .06, duration: .18, ease: 'none' }, base)
        .set(icon, { visibility: 'visible' }, base + .19)
        .to(nodes, { opacity: 0, scale: .05, duration: .13, ease: 'power2.in' }, base + .2)
        .to(icon, { autoAlpha: 1, scale: 1, rotation: 0, duration: .3, ease: 'power3.out' }, base + .2)
        .to(stage, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .35, ease: 'power3.out' }, base + .18)
        .to(stage, { autoAlpha: 0, y: -28, clipPath: 'inset(18% 0 0 0)', duration: .24, ease: 'power2.in' }, base + .72)
        .to(icon, { autoAlpha: 0, scale: 1.18, rotation: 7, duration: .22, ease: 'power2.in' }, base + .72)
        .set(stage, { visibility: 'hidden' }, base + .96)
        .set(icon, { visibility: 'hidden' }, base + .96)
        .to(nodes, {
          x: nodeIndex => nextState[nodeIndex][0],
          y: nodeIndex => nextState[nodeIndex][1],
          scale: .72,
          opacity: .55,
          duration: .3,
          ease: 'power3.out'
        }, base + .78)
        .to(traces, { strokeDashoffset: Math.max(0, 560 - stageIndex * 105), opacity: .28 + stageIndex * .055, duration: .3, ease: 'none' }, base + .78);
    });

    timeline
      .to(field, { autoAlpha: 0, duration: .28, ease: 'power2.in' }, 7.18)
      .set(summary, { visibility: 'visible' }, 7.24)
      .to(summary, { autoAlpha: 1, y: 0, duration: .46, ease: 'power3.out' }, 7.25)
      .to(summaryItems, { autoAlpha: 1, y: 0, stagger: .045, duration: .3, ease: 'power3.out' }, 7.34)
      .to(rail, { autoAlpha: 0, y: -8, duration: .24, ease: 'power2.in' }, 7.28)
      .set(handoff, { visibility: 'visible' }, 7.42)
      .to(handoff, { autoAlpha: 1, y: 0, duration: .34, ease: 'power3.out' }, 7.43)
      .to({}, { duration: 1.05 });
    return timeline;
  }

  function buildWorkEntrance() {
    const work = document.querySelector('#work');
    if (!work) return null;
    const heading = work.querySelector('.section-heading');
    const covers = gsap.utils.toArray('#work-grid .work-entry-cover').slice(0, 2);
    gsap.set(heading, { y: 28, autoAlpha: .62 });
    gsap.set(covers, { clipPath: 'inset(14% 0 0 0)' });
    return gsap.timeline({ scrollTrigger: { trigger: work, start: 'top 88%', end: 'top 28%', scrub: .68 } })
      .to(heading, { y: 0, autoAlpha: 1, ease: 'none' }, 0)
      .to(covers, { clipPath: 'inset(0% 0 0 0)', stagger: .1, ease: 'none' }, .2);
  }

  function setReducedState() {
    document.body.classList.remove('continuous-motion');
    document.querySelectorAll('[data-hero-scene]').forEach(scene => {
      scene.removeAttribute('aria-hidden');
      scene.inert = false;
    });
    setActiveStage(6);
    radiant.progress = 1;
    radiant.dark = .12;
    document.dispatchEvent(new CustomEvent('radiant:draw'));
  }

  function mount() {
    media?.revert();
    setupLiquidActions();
    media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 701px)', mobile: '(max-width: 700px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
      if (context.conditions.reduce) {
        setReducedState();
        return;
      }
      const timelines = [
        buildHeroTimeline({ mobile: context.conditions.mobile }),
        buildAboutBridge(),
        buildExperienceBridge(),
        buildThinkingTimeline({ mobile: context.conditions.mobile }),
        buildWorkEntrance()
      ].filter(Boolean);
      return () => {
        timelines.forEach(timeline => timeline.kill());
        document.body.classList.remove('continuous-motion');
        radiant.progress = 0;
        radiant.dark = 0;
      };
    });
    requestRefresh();
  }

  let renderFrame = 0;
  document.addEventListener('portfolio:render', () => {
    cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(mount);
  });
  document.fonts?.ready.then(requestRefresh);
  addEventListener('load', requestRefresh, { once: true });
  addEventListener('pagehide', () => media?.revert(), { once: true });
  mount();
})();
