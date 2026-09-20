(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const hero=document.querySelector('.ember-hero'),name=document.querySelector('.ember-name'),description=document.querySelector('.ember-description'),principle=document.querySelector('.principle-scene');
  const state=window.radiantState||{progress:0,dark:0};
  const capabilityIcons = ["<circle cx=\"10\" cy=\"10\" r=\"6\"/><path d=\"m15 15 6 6M7 10h6M10 7v6\"/>", "<path d=\"m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5\"/>", "<path d=\"M4 20 9 4h6l5 16M7 13h10M3 20h4M17 20h4\"/>", "<path d=\"M4 5h6a3 3 0 0 1 3 3v13a5 5 0 0 0-5-3H4V5ZM13 8a3 3 0 0 1 3-3h5v13h-3a5 5 0 0 0-5 3M7 9h3M7 12h3M16 9h2M16 12h2\"/>", "<circle cx=\"12\" cy=\"5\" r=\"3\"/><circle cx=\"5\" cy=\"18\" r=\"3\"/><circle cx=\"19\" cy=\"18\" r=\"3\"/><path d=\"m10 8-4 7m8-7 4 7M8 18h8\"/>", "<rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"1\"/><path d=\"M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4m-10-5-2 3h4l-2 3\"/>"];
  function decorateCapabilities(){
    document.querySelectorAll('#capabilities-grid article').forEach((item,i)=>{
      if(item.querySelector('.capability-icon'))return;
      const icon=document.createElement('span');icon.className='capability-icon';icon.setAttribute('aria-hidden','true');
      icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">'+capabilityIcons[i]+'</svg>';
      item.prepend(icon);
    });
  }
  decorateCapabilities();
  document.addEventListener('portfolio:render',decorateCapabilities);
  const media=gsap.matchMedia();let heroTrigger;let contentContext;
  function contentMotion(){
    contentContext?.revert();
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    contentContext=gsap.context(()=>{
      if(innerWidth>700){
        gsap.utils.toArray('#work-grid .work-art').forEach(image=>{
          gsap.fromTo(image,{clipPath:'inset(5% 3% 0% 3%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:image,start:'top 90%',end:'top 18%',scrub:true}});
        });
      }
    });
  }
  media.add({desktop:'(min-width:701px)',mobile:'(max-width:700px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
    if(context.conditions.reduce){document.body.classList.remove('story-active');description.inert=false;contentMotion();return;}
    document.body.classList.add('story-active');
    gsap.set(description,{clipPath:'inset(100% 0% 0% 0%)',yPercent:-42,autoAlpha:1});
    gsap.set(principle,{yPercent:-50,clipPath:'inset(100% 0% 0% 0%)',autoAlpha:1});
    const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:hero,start:'top top',end:()=>'+='+innerHeight*(context.conditions.mobile?1.65:2.65),pin:true,scrub:.65,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{
      state.progress=self.progress;description.inert=self.progress<.74;

    }}});
    heroTrigger=tl.scrollTrigger;
    tl.to(name,{scale:1.025,duration:.12},0)
      .to('.first-name',{xPercent:-9,duration:.12},.12).to('.last-name',{xPercent:9,duration:.12},.12)
      .to(name,{clipPath:'inset(0% 0% 100% 0%)',yPercent:-62,duration:.14},.20)
      .to(state,{dark:.55,duration:.14},.24)
      .to(principle,{clipPath:'inset(0% 0% 0% 0%)',duration:.14},.24)
      .to(principle,{clipPath:'inset(0% 0% 100% 0%)',duration:.10},.50)
      .to(state,{dark:.12,duration:.14},.60)
      .to(description,{clipPath:'inset(0% 0% 0% 0%)',yPercent:-50,duration:.14},.60);
    // Hold the final reading scene, including both CTAs, until natural unpin.
    tl.to({}, {duration:.26},.74);
    contentMotion();
    return()=>{heroTrigger=null;document.body.classList.remove('story-active');description.inert=false;state.progress=state.dark=0;contentContext?.revert();};
  });
  document.addEventListener('portfolio:render',()=>{contentMotion();ScrollTrigger.refresh();});
  // Anchor destinations include the pin spacer; focus follows navigation without trapping.
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const id=link.getAttribute('href');const target=id==='#'?hero:document.getElementById(id.slice(1));if(!target)return;
    event.preventDefault();ScrollTrigger.refresh();
    const y=id==='#'?0:target.getBoundingClientRect().top+scrollY-100;
    history.pushState(null,'',id);window.scrollTo({top:Math.max(0,y),behavior:'instant'});ScrollTrigger.update();
    if(id!=='#'){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
  });
  // Keyboard users can reach the canonical statement without waiting through masked scenes.
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab'&&heroTrigger&&scrollY<heroTrigger.end&&scrollY>=heroTrigger.start){
      description.inert=false;
      if(heroTrigger.progress<.74){window.scrollTo(0,heroTrigger.start+(heroTrigger.end-heroTrigger.start)*.84);ScrollTrigger.update();}
    }
  });
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
  addEventListener('load',()=>{ScrollTrigger.refresh();if(location.hash&&location.hash!=='#'){const target=document.getElementById(location.hash.slice(1));if(target)window.scrollTo(0,target.getBoundingClientRect().top+scrollY-100);}});
  addEventListener('pagehide',()=>{contentContext?.revert();media.revert();},{once:true});
})();
