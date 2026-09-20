(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gs = window.gsap;
  const st = window.ScrollTrigger;
  if (gs && st) gs.registerPlugin(st);
  let context;
  function motion() {
    context?.revert();
    if (!gs || !st || reduced.matches) return;
    context = gs.context(() => {
      gs.from('.about-portrait',{clipPath:'inset(12% 8% 12% 8%)',scale:.94,ease:'none',scrollTrigger:{trigger:'#about',start:'top 85%',end:'top 25%',scrub:1}});
      document.querySelectorAll('.work-entry-cover').forEach(el=>gs.from(el,{clipPath:'inset(8% 0 0 0)',y:25,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 95%',once:true}}));
      document.querySelectorAll('.section-heading, .cv-evidence, .cv-timeline article, .background-heading, .cv-background, .contact h2').forEach(el => {
        gs.from(el,{y:36,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
      });
    });
    st.refresh();
  }
  motion();
  document.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>st?.refresh()));
  document.addEventListener('portfolio:render',motion);
  reduced.addEventListener('change',motion);
  const sections=document.querySelectorAll('main section[id]');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting) document.querySelectorAll('nav a').forEach(a=>{
      const sectionHash=entry.target.id==='thinking-process'?'#capabilities':'#'+entry.target.id;
      if(a.hash===sectionHash)a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
  }),{rootMargin:'-15% 0px -60% 0px'});
  sections.forEach(s=>observer.observe(s));
  window.addEventListener('pagehide',()=>{context?.revert();observer.disconnect();},{once:true});
})();
