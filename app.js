(() => {
  const content = window.portfolioContent;
  let language = 'en';
  let filter = 'all';
  let activeCase = 0;
  const original = new Map([...document.querySelectorAll('[data-i18n]')].map(el => [el, el.innerHTML]));
  const pick = (en, zh) => language === 'en' ? en : zh;
  const guide = document.querySelector('#guide-dialog');
  const caseDialog = document.querySelector('#case-dialog');
  function renderArchive() {
    if(!document.querySelector("#archive-grid"))return;
    if(content.cvBacked){
      document.querySelector('#filters').hidden=true;
      document.querySelector('#archive-grid').innerHTML=content.archive.map((row,i)=>`<article class="archive-item cv-additional"><h3>${pick(row[2],row[3])}</h3><p>${pick(...content.archiveDescriptions[i])}</p></article>`).join('');return;
    }

    document.querySelector('#filters').innerHTML = content.filters.map(([id,en,zh]) => `<button data-filter="${id}" aria-pressed="${filter===id}">${pick(en,zh)}</button>`).join('');
    document.querySelector('#archive-grid').innerHTML = content.archive.filter(([category])=>filter==='all'||filter===category).map(([,art,en,zh]) => `<article class="archive-item"><div class="archive-art ${art}" aria-hidden="true"><i></i><b>${art==='deck'?'A NEW<br>PERSPECTIVE':art==='identity'?'yz.':art==='object'?'FIELD<br>NOTES':'THE<br>OTHER<br>SIDE'}</b></div><h3>${pick(en,zh)}</h3><p>${pick('VISUAL PLACEHOLDER','视觉占位')}</p></article>`).join('');
  }
  let workFilter='all';
  function renderWork(){
    const categories=content.workCategories;
    document.querySelector('#work-filters').innerHTML=categories.map(([id,en,zh])=>`<button data-work-filter="${id}" aria-pressed="${workFilter===id}">${pick(en,zh)}</button>`).join('');
    document.querySelector('#work-grid').innerHTML=content.cases.map((item,i)=>({item,i})).filter(({item})=>workFilter==='all'||item.category===workFilter).map(({item,i})=>{
      const category=categories.find(row=>row[0]===item.category);
      return `<button class="work-card work-entry" data-case="${i}"><div class="work-entry-cover ${item.image?'has-project-image':''}">${item.image?`<img src="${item.image}" alt="${pick(item.imageAltEn,item.imageAltZh)}" loading="lazy" decoding="async">`:''}<span>${pick(item.tagEn,item.tagZh)}</span><small>${pick(item.collection?'COLLECTION IN PROGRESS':'PROJECT OVERVIEW',item.collection?'作品集整理中':'项目概览')}</small></div><div class="card-details"><p>${pick(category[1],category[2])}</p><h3>${pick(item.en,item.zh)} <span>↗</span></h3></div></button>`;
    }).join('');
  }
  function renderCase() {
    const item = content.cases[activeCase];
    document.querySelector('#case-title').textContent=pick(item.en,item.zh);
    caseDialog.querySelectorAll('.case-project-media, .case-project-gallery').forEach(el=>el.remove());
    if(item.galleryGroups){
      const gallery=document.createElement('div');gallery.className='case-project-gallery';
      item.galleryGroups.forEach((group,groupIndex)=>{
        const section=document.createElement('section');
        const heading=document.createElement('h3');heading.textContent=`0${groupIndex+1} / ${pick(group.en,group.zh)}`;section.append(heading);
        const grid=document.createElement('div');grid.className='case-gallery-grid';
        group.images.forEach((asset,imageIndex)=>{
          const figure=document.createElement('figure');
          if(groupIndex===0 && imageIndex===0)figure.className='case-gallery-hero';
          const link=document.createElement('a');link.href=asset.src;link.target='_blank';link.rel='noopener';
          const image=document.createElement('img');image.src=asset.src;image.alt=pick(asset.altEn,asset.altZh);image.decoding='async';image.loading=groupIndex===0 && imageIndex===0?'eager':'lazy';
          link.append(image);figure.append(link);grid.append(figure);
        });
        section.append(grid);gallery.append(section);
      });
      document.querySelector('#case-steps').before(gallery);
    }else if(item.image){
      const figure=document.createElement('figure');figure.className='case-project-media';
      const image=document.createElement('img');image.src=item.image;image.alt=pick(item.imageAltEn,item.imageAltZh);image.decoding='async';
      const link=document.createElement('a');link.href=item.image;link.target='_blank';link.rel='noopener';link.append(image);figure.append(link);
      const caption=document.createElement('figcaption');caption.textContent=pick('UTP100 — event visual system. Open image at full size ↗','UTP100 — 赛事视觉系统。查看原图 ↗');figure.append(caption);
      document.querySelector('#case-steps').before(figure);
    }
    document.querySelector('#case-steps').innerHTML=(item.steps || content.steps).map(([en,zh,descEn,descZh],i)=>`<article><span>0${i+1}</span><div><h3>${pick(en,zh)}</h3><p>${pick(descEn,descZh)}</p></div></article>`).join('');
  }
  function renderThinkingProcess(){
    const stage=document.querySelector('#thinking-stage');
    const rail=document.querySelector('#process-rail');
    if(!stage||!rail||!content.process)return;
    stage.innerHTML=content.process.map((item,index)=>`<article class="process-stage${index===0?' is-active':''}" data-stage="${item.id}"><div class="process-meta"><span>${item.number} / PROCESS</span><span>${pick('INPUT → OUTPUT','输入 → 输出')}</span></div><h3>${pick(item.en,item.zh)}</h3><p class="process-meaning">${pick(item.meaningEn,item.meaningZh)}</p><ul>${pick(item.inputsEn,item.inputsZh).map(input=>`<li>${input}</li>`).join('')}</ul></article>`).join('');
    rail.innerHTML=content.process.map((item,index)=>`<li class="${index===0?'is-active':''}" data-stage-index="${index}"><span>${item.number}</span><b>${pick(item.en,item.zh)}</b></li>`).join('');
  }
  function render() {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = pick('Yuchen Zhong — Ideas into experiences','Yuchen Zhong — 让想法发生');
    original.forEach((html,el)=>{
      if(language==='en') el.innerHTML=html;
      else el.textContent=content.zh[el.dataset.i18n] || el.textContent;
    });
    const button = document.querySelector('#language');
    button.innerHTML=language==='en'?'EN <span>/ 中</span>':'中 <span>/ EN</span>';
    button.setAttribute('aria-label',pick('Switch to Chinese','切换为英文'));
    renderThinkingProcess();
    document.querySelector('#work-grid').innerHTML=content.cases.map((item,i)=>`<button class="work-card" data-case="${i}"><div class="work-art ${item.type}" aria-hidden="true"><div class="shapes"><i></i><i></i><i></i></div><span>${i===0?'FORM / SPACE':i===1?'A DIFFERENT<br>POINT OF VIEW':'IDEAS,<br>IN ORDER.'}</span><small>0${i+1} — ${pick(content.cvBacked?'ABSTRACT COVER · NOT PROJECT PHOTOGRAPHY':'VISUAL STUDY',content.cvBacked?'抽象封面 · 非项目照片':'视觉探索')}</small></div><div class="card-details"><p>${pick(item.tagEn,item.tagZh)}</p><h3>${pick(item.en,item.zh)} <span>↗</span></h3><span class="draft">${pick(content.cvBacked?'EXPLORE PROJECT':'CASE STUDY TO FOLLOW',content.cvBacked?'查看项目':'项目案例待补充')}</span></div></button>`).join('');
    if(document.body.classList.contains('home-page')) {
      document.title=pick('Yuchen Zhong — Concepts, narratives & actionable projects','Yuchen Zhong — 概念、叙事与可推进的项目');
      document.querySelector('#work-grid').innerHTML=content.cases.map((item,i)=>`<button class="challenge-card" data-case="${i}"><span class="challenge-index">0${i+1}</span><h3>${pick(item.en,item.zh)}</h3><span class="challenge-action">${pick('Explore framework','查看案例框架')} ↗</span><span class="draft">${pick('Project evidence pending','项目证据待补充')}</span></button>`).join('');
    }
    if(content.workCategories)renderWork();
    renderArchive(); renderCase();
    document.dispatchEvent(new CustomEvent('portfolio:render'));
  }
  document.querySelector('#work-filters')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-work-filter]');if(!button)return;
    workFilter=button.dataset.workFilter;renderWork();document.querySelector(`[data-work-filter="${workFilter}"]`).focus();document.dispatchEvent(new CustomEvent('portfolio:render'));
  });
  document.querySelector('#language').addEventListener('click',()=>{language=language==='en'?'zh':'en';render();});
  document.querySelector('#filters')?.addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(button){filter=button.dataset.filter;renderArchive();document.querySelector(`[data-filter="${filter}"]`).focus();}});
  document.addEventListener('click',event=>{const button=event.target.closest('[data-case]');if(button){activeCase=Number(button.dataset.case);renderCase();caseDialog.showModal();caseDialog.scrollTop=0;}});
  document.querySelectorAll('[data-guide]').forEach(button=>button.addEventListener('click',()=>guide.showModal()));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  });
  guide.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>guide.close()));
  render();
})();
