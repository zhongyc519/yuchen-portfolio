(() => {
  window.renderProjectCarousel=(dialog,item,pick)=>{
    dialog.querySelector('.project-squeeze')?.remove();
    dialog.querySelector('.case-project-media')?.remove();
    const original=dialog.querySelector('#case-steps');original.hidden=true;
    const slides=(item.steps||[]).map(([en,zh,de,dz])=>({title:pick(en,zh),description:pick(de,dz)}));
    if(item.image)slides.unshift({title:pick('Visual system','视觉系统'),description:pick(item.imageAltEn,item.imageAltZh),image:item.image});
    if(!slides.length){original.hidden=false;return;}
    let active=0;
    const root=document.createElement('section');root.className='project-squeeze';root.setAttribute('aria-label',pick('Project details','项目详情'));
    const controls=document.createElement('div');controls.className='squeeze-controls';
    const previous=document.createElement('button'),next=document.createElement('button'),counter=document.createElement('span');
    previous.textContent='←';next.textContent='→';previous.className=next.className='squeeze-arrow';previous.setAttribute('aria-label',pick('Previous panel','上一页'));next.setAttribute('aria-label',pick('Next panel','下一页'));
    controls.append(counter,previous,next);previous.hidden=next.hidden=slides.length<2;
    const strip=document.createElement('div');strip.className='squeeze-strip';strip.setAttribute('role','tablist');strip.setAttribute('aria-label',pick('Project chapters','项目章节'));
    const copy=document.createElement('div');copy.className='squeeze-copy';copy.id='squeeze-copy';copy.setAttribute('role','tabpanel');copy.setAttribute('aria-live','polite');
    const buttons=slides.map((slide,i)=>{
      const button=document.createElement('button');button.className='squeeze-panel';button.id='squeeze-tab-'+i;button.setAttribute('role','tab');button.setAttribute('aria-controls','squeeze-copy');button.setAttribute('aria-label',slide.title);
      if(slide.image){const image=document.createElement('img');image.src=slide.image;image.alt='';image.draggable=false;button.append(image);button.classList.add('squeeze-image');}
      const label=document.createElement('span');label.className='squeeze-panel-label';label.textContent=slide.title;
      const number=document.createElement('span');number.className='squeeze-number';number.textContent=String(i+1).padStart(2,'0');button.append(number,label);
      button.addEventListener('click',()=>select(i));strip.append(button);return button;
    });
    function select(index,focus=false){
      active=(index+slides.length)%slides.length;
      buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===active));button.tabIndex=i===active?0:-1;button.style.flexGrow=i===active?'7':Math.max(.25,1.2-Math.abs(i-active)*.3);});
      const slide=slides[active];copy.replaceChildren();
      const title=document.createElement('strong');title.textContent=slide.title+'. ';const description=document.createElement('span');description.textContent=slide.description;copy.append(title,description);copy.setAttribute('aria-labelledby',buttons[active].id);
      if(slide.image){const link=document.createElement('a');link.href=slide.image;link.target='_blank';link.rel='noopener';link.textContent=pick('View full image ↗','查看完整图片 ↗');copy.append(link);}
      counter.textContent=(active+1)+' / '+slides.length;if(focus)buttons[active].focus();
    }
    previous.addEventListener('click',()=>select(active-1));next.addEventListener('click',()=>select(active+1));
    strip.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=active+1;if(event.key==='ArrowLeft')target=active-1;if(event.key==='Home')target=0;if(event.key==='End')target=slides.length-1;if(target!==undefined){event.preventDefault();select(target,true);}});
    root.append(controls,strip,copy);original.before(root);select(0);
  };
})();
