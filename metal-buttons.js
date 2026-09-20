(() => {
  const selector='.ember-actions a,.wave-toggle,.floating-guide,.button,.close-dialog';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('metal-visible',entry.isIntersecting)));
  function apply(){document.querySelectorAll(selector).forEach(button=>{if(button.classList.contains('metal-control'))return;button.classList.add('metal-control');observer.observe(button);});}
  apply();document.addEventListener('portfolio:render',apply);
  document.addEventListener('click',event=>{
    const button=event.target.closest('.metal-control');if(!button||reduced.matches)return;
    const box=button.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='metal-ripple';ripple.setAttribute('aria-hidden','true');
    ripple.style.left=(event.detail?event.clientX-box.left:box.width/2)+'px';ripple.style.top=(event.detail?event.clientY-box.top:box.height/2)+'px';
    button.append(ripple);setTimeout(()=>ripple.remove(),650);
  });
  addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
