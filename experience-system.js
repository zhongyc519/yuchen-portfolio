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
    timeline.to({}, { duration: .58 });
    return timeline;
  }

  function buildAboutBridge() {
    const about = document.querySelector('#about');
    if (!about) return null;
    gsap.set(about.querySelector('h2'), { clipPath: 'inset(0 0 100% 0)', y: 28 });
    return gsap.timeline({ scrollTrigger: { trigger: about, start: 'top 78%', end: 'top 25%', scrub: .7 } })
      .to(about.querySelector('h2'), { clipPath: 'inset(0 0 0% 0)', y: 0, ease: 'none' }, .08)
      .fromTo(about.querySelector('.about-portrait'), { yPercent: 3 }, { yPercent: -2, ease: 'none' }, 0);
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
    if (stages.length !== 6 || icons.length !== 6 || nodes.length !== 15) return null;

    const scatterShapes = [
      [[118,122],[122,422],[174,272],[232,180],[228,374],[306,126],[312,430],[400,280],[492,128],[488,432],[570,178],[574,376],[628,278],[686,124],[682,424]],
      [[118,210],[118,350],[194,152],[194,408],[278,218],[278,342],[400,108],[400,280],[400,452],[522,218],[522,342],[606,152],[606,408],[682,210],[682,350]],
      [[152,280],[184,190],[184,370],[260,132],[260,428],[346,198],[346,362],[400,280],[454,198],[454,362],[540,132],[540,428],[616,190],[616,370],[648,280]],
      [[112,280],[156,238],[200,326],[244,214],[288,346],[332,228],[372,316],[400,280],[428,244],[468,332],[512,214],[556,346],[600,230],[644,320],[688,280]],
      [[400,104],[330,124],[470,124],[270,176],[530,176],[230,250],[570,250],[400,280],[230,330],[570,330],[270,398],[530,398],[330,444],[470,444],[400,462]],
      [[116,396],[164,346],[212,376],[260,302],[308,330],[356,246],[382,278],[400,280],[432,230],[478,184],[526,212],[574,142],[622,170],[670,102],[708,126]]
    ];
    const centerOffsets = nodes.map(node => ({ x: 400 - Number(node.getAttribute('cx')), y: 280 - Number(node.getAttribute('cy')) }));
    const offsetsFor = shape => nodes.map((node, index) => ({
      x: shape[index][0] - Number(node.getAttribute('cx')),
      y: shape[index][1] - Number(node.getAttribute('cy'))
    }));
    const scatterOffsets = scatterShapes.map(offsetsFor);
    const orbitOffsets = nodes.map((node, index) => {
      const angle = (Math.PI * 2 * index / nodes.length) + .18;
      const radius = 74 + (index % 3) * 18;
      return {
        x: 400 + Math.cos(angle) * radius - Number(node.getAttribute('cx')),
        y: 280 + Math.sin(angle) * radius * .68 - Number(node.getAttribute('cy'))
      };
    });

    gsap.set(arrival, { autoAlpha: 1, y: 0, visibility: 'visible' });
    gsap.set(stages, { autoAlpha: 0, y: 34, visibility: 'hidden', clipPath: 'inset(0 0 16% 0)' });
    gsap.set(icons, { autoAlpha: 0, scale: .82, visibility: 'hidden' });
    gsap.set(nodes, { opacity: .62, scale: index => .62 + (index % 4) * .08 });
    nodes.forEach((node, index) => gsap.set(node, scatterOffsets[0][index]));
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
        end: () => `+=${innerHeight * (mobile ? 9.4 : 10.1)}`,
        pin: true,
        scrub: mobile ? .62 : .85,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate() {
          const time = timeline.time();
          const nextState = time < .84 ? -1 : time >= 8.55 ? 6 : Math.min(5, Math.floor((time - .84) / 1.35));
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
      const base = .84 + stageIndex * 1.35;
      const icon = icons[stageIndex];
      const nextState = scatterOffsets[Math.min(stageIndex + 1, scatterOffsets.length - 1)];
      timeline
        .set(stage, { visibility: 'visible' }, base + .08)
        .to(nodes, {
          x: nodeIndex => orbitOffsets[nodeIndex].x,
          y: nodeIndex => orbitOffsets[nodeIndex].y,
          scale: nodeIndex => .56 + (nodeIndex % 3) * .1,
          opacity: .86,
          duration: .25,
          stagger: { each: .008, from: stageIndex % 2 ? 'end' : 'start' },
          ease: 'power2.inOut'
        }, base)
        .to(nodes, {
          x: nodeIndex => centerOffsets[nodeIndex].x,
          y: nodeIndex => centerOffsets[nodeIndex].y,
          scale: .2,
          opacity: 1,
          duration: .28,
          stagger: { each: .006, from: 'edges' },
          ease: 'expo.in'
        }, base + .2)
        .to(traces, { opacity: .05, duration: .24, ease: 'none' }, base + .08)
        .set(icon, { visibility: 'visible' }, base + .43)
        .to(nodes, { opacity: 0, scale: .02, duration: .14, ease: 'power2.in' }, base + .43)
        .to(icon, { autoAlpha: 1, scale: 1, duration: .24, ease: 'power3.out' }, base + .43)
        .to(stage, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .36, ease: 'power3.out' }, base + .28)
        .to(stage, { autoAlpha: 0, y: -22, clipPath: 'inset(16% 0 0 0)', duration: .25, ease: 'power2.in' }, base + .9)
        .to(icon, { autoAlpha: 0, scale: 1.06, duration: .2, ease: 'power2.in' }, base + .92)
        .set(stage, { visibility: 'hidden' }, base + 1.14)
        .set(icon, { visibility: 'hidden' }, base + 1.14)
        .to(nodes, {
          x: nodeIndex => nextState[nodeIndex][0],
          y: nodeIndex => nextState[nodeIndex][1],
          scale: nodeIndex => .62 + (nodeIndex % 4) * .08,
          opacity: .64,
          duration: .38,
          stagger: { each: .009, from: 'center' },
          ease: 'expo.out'
        }, base + .96)
        .to(traces, { strokeDashoffset: Math.max(0, 650 - stageIndex * 108), opacity: .22 + stageIndex * .045, duration: .38, ease: 'none' }, base + .96);
    });

    timeline
      .to(field, { autoAlpha: 0, duration: .3, ease: 'power2.in' }, 8.5)
      .set(summary, { visibility: 'visible' }, 8.56)
      .to(summary, { autoAlpha: 1, y: 0, duration: .46, ease: 'power3.out' }, 8.57)
      .to(summaryItems, { autoAlpha: 1, y: 0, stagger: .045, duration: .3, ease: 'power3.out' }, 8.66)
      .to(rail, { autoAlpha: 0, y: -8, duration: .24, ease: 'power2.in' }, 8.6)
      .set(handoff, { visibility: 'visible' }, 8.72)
      .to(handoff, { autoAlpha: 1, y: 0, duration: .34, ease: 'power3.out' }, 8.73)
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
