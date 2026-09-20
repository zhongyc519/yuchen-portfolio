(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const radiant = window.radiantState || { progress: 0, dark: 0 };
  let media = null;
  let refreshFrame = 0;

  const requestRefresh = () => {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  function buildHeroTimeline({ mobile }) {
    const hero = document.querySelector('#hero-scene');
    const description = hero?.querySelector('.ember-description');
    if (!hero || !description) return null;

    document.body.classList.add('continuous-motion');
    gsap.set('.hero-proposition-a,.hero-proposition-b', { clipPath: 'inset(0 100% 0 0)', x: 24 });
    gsap.set('.ember-description p,.hero-cta,.hero-disciplines', { autoAlpha: 0, y: 24 });
    gsap.set('.hero-continuity-line', { scaleY: 0 });

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        id: 'hero-sequence',
        trigger: '#hero-scene',
        start: 'top top',
        end: () => `+=${innerHeight * (mobile ? 1.55 : 2.75)}`,
        pin: true,
        scrub: mobile ? 0.45 : 0.75,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          radiant.progress = self.progress;
          radiant.dark = gsap.utils.clamp(0, .5, self.progress * .42);
          description.inert = self.progress < .22;
          document.dispatchEvent(new CustomEvent('radiant:draw'));
        }
      }
    });

    timeline
      .to('.ember-name', { scale: mobile ? .72 : .58, xPercent: mobile ? -8 : -18, yPercent: mobile ? -30 : -34, duration: .24 }, .08)
      .to('.hero-proposition-a', { clipPath: 'inset(0 0% 0 0)', x: 0, duration: .18 }, .24)
      .to('.hero-proposition-b', { clipPath: 'inset(0 0% 0 0)', x: 0, duration: .18 }, .41)
      .to('.ember-description p', { autoAlpha: 1, y: 0, duration: .14 }, .57)
      .to('.hero-disciplines', { autoAlpha: 1, y: 0, duration: .12 }, .64)
      .to('.hero-cta', { autoAlpha: 1, y: 0, duration: .14 }, .72)
      .to('.hero-continuity-line', { scaleY: 1, duration: .18 }, .79)
      .to({}, { duration: .12 }, .88);

    return timeline;
  }

  function buildAboutBridge() {
    const about = document.querySelector('#about');
    if (!about) return null;
    gsap.set(about.querySelector('h2'), { clipPath: 'inset(0 0 100% 0)', y: 28 });
    gsap.set(about.querySelector('.narrative-spine'), { scaleY: .08 });
    return gsap.timeline({
      scrollTrigger: { trigger: about, start: 'top 78%', end: 'top 25%', scrub: .7 }
    })
      .to(about.querySelector('.narrative-spine'), { scaleY: 1, ease: 'none' }, 0)
      .to(about.querySelector('h2'), { clipPath: 'inset(0 0 0% 0)', y: 0, ease: 'none' }, .08)
      .fromTo(about.querySelector('.about-portrait'), { yPercent: 3 }, { yPercent: -2, ease: 'none' }, 0);
  }

  function buildExperienceBridge() {
    const bridge = document.querySelector('#experience-bridge');
    if (!bridge) return null;
    const stages = gsap.utils.toArray('.bridge-stage', bridge);
    gsap.set(stages, { y: 22, autoAlpha: .42 });
    gsap.set(stages.map(stage => stage), { '--bridge-copy': 0 });
    return gsap.timeline({
      scrollTrigger: { trigger: bridge, start: 'top 82%', end: 'bottom 28%', scrub: .7 }
    })
      .to(bridge, { '--bridge-line': 1, duration: 1, ease: 'none' })
      .to(stages, { y: 0, autoAlpha: 1, stagger: .12, duration: .55, ease: 'none' }, 0)
      .to(stages, { '--bridge-copy': 1, stagger: .1, duration: .4, ease: 'none' }, .4);
  }

  function setActiveStage(index) {
    document.querySelectorAll('.process-stage').forEach((stage, stageIndex) => stage.classList.toggle('is-active', stageIndex === index));
    document.querySelectorAll('.process-rail li').forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
  }

  function buildThinkingTimeline() {
    const process = document.querySelector('#thinking-process');
    if (!process) return null;
    const stages = gsap.utils.toArray('.process-stage', process);
    const nodes = gsap.utils.toArray('.process-nodes circle', process);
    const traces = gsap.utils.toArray('.process-trace', process);
    if (stages.length !== 6) return null;

    gsap.set(stages, { autoAlpha: 0, y: 42, clipPath: 'inset(0 0 18% 0)' });
    gsap.set(stages[0], { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)' });
    gsap.set(nodes, { scale: .72, opacity: .45 });
    gsap.set(traces, { strokeDashoffset: 900, opacity: .35 });

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        id: 'thinking-sequence',
        trigger: '#thinking-process',
        start: 'top top',
        end: () => `+=${innerHeight * 5.2}`,
        pin: true,
        scrub: .8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const index = Math.min(5, Math.floor(self.progress * 6));
          setActiveStage(index);
          gsap.set('.thinking-progress i', { scaleX: (index + 1) / 6 });
        }
      }
    });

    const nodeStates = [
      [[-44,-30],[32,18],[-20,34],[42,-24],[0,0],[-34,-16],[40,28],[-22,42],[36,-40]],
      [[-12,0],[-12,0],[-6,0],[-6,0],[0,0],[6,0],[6,0],[12,0],[12,0]],
      [[54,70],[54,-70],[28,38],[28,-38],[0,0],[-28,38],[-28,-38],[-54,70],[-54,-70]],
      [[0,-20],[0,20],[-20,-10],[-20,10],[0,0],[20,-10],[20,10],[0,-20],[0,20]],
      [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
      [[282,164],[282,-164],[140,80],[140,-80],[0,0],[-140,80],[-140,-80],[-282,164],[-282,-164]]
    ];

    nodeStates[0].forEach(([x,y], index) => gsap.set(nodes[index], { x, y }));

    for (let index = 1; index < stages.length; index += 1) {
      const at = index;
      timeline
        .to(stages[index - 1], { autoAlpha: 0, y: -36, clipPath: 'inset(18% 0 0 0)', duration: .32 }, at - .28)
        .to(stages[index], { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .42 }, at - .08);
      nodes.forEach((node, nodeIndex) => {
        const [x, y] = nodeStates[index][nodeIndex];
        timeline.to(node, { x, y, scale: index === 2 && nodeIndex === 4 ? 1.65 : 1, opacity: index === 5 ? .9 : .72, duration: .68 }, at - .2);
      });
      if (index >= 3) timeline.to(traces, { strokeDashoffset: index === 3 ? 520 : index === 4 ? 180 : 0, opacity: .72, duration: .72 }, at - .18);
    }
    timeline.to({}, { duration: .42 }, 5.45);
    return timeline;
  }

  function buildProofBridge() {
    const proof = document.querySelector('#proof-transition');
    const work = document.querySelector('#work');
    if (!proof || !work) return null;
    gsap.set(proof.querySelector('strong'), { autoAlpha: .18, yPercent: 36, scale: .92 });
    gsap.set(proof.querySelector('i'), { scaleX: .08 });
    const covers = gsap.utils.toArray('#work-grid .work-entry-cover').slice(0, 2);
    gsap.set(covers, { clipPath: 'inset(12% 0 0 0)' });
    return gsap.timeline({ scrollTrigger: { trigger: proof, start: 'top 72%', end: 'bottom 18%', scrub: .65 } })
      .to(proof.querySelector('i'), { scaleX: 1, ease: 'none' }, 0)
      .to(proof.querySelector('strong'), { autoAlpha: 1, yPercent: 0, scale: 1, ease: 'none' }, .08)
      .to(covers, { clipPath: 'inset(0% 0 0 0)', stagger: .08, ease: 'none' }, .48);
  }

  function setReducedState() {
    document.body.classList.remove('continuous-motion');
    document.querySelector('.ember-description')?.removeAttribute('inert');
    setActiveStage(0);
    radiant.progress = 1;
    radiant.dark = .14;
    document.dispatchEvent(new CustomEvent('radiant:draw'));
  }

  function mount() {
    media?.revert();
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
        context.conditions.desktop ? buildThinkingTimeline() : null,
        buildProofBridge()
      ].filter(Boolean);
      return () => {
        timelines.forEach(timeline => timeline.kill());
        document.body.classList.remove('continuous-motion');
        document.querySelector('.ember-description')?.removeAttribute('inert');
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
