(() => {
 const root=document.documentElement,scene=document.querySelector('.lens-scene'),svgNS='http://www.w3.org/2000/svg';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let selected=0,paused=reduced.matches,frame=0;
 const zh=()=>root.lang==='zh-CN';
 function flow(){
   document.querySelector('#flow-buttons').innerHTML=window.portfolioContent.flow.map((s,i)=>`<button type="button" data-stage="${i}" aria-pressed="${selected===i}" aria-controls="flow-detail"><span>0${i+1}</span>${s[zh()?1:0]}<b aria-hidden="true">${i<4?'→':'↗'}</b></button>`).join('');
   const s=window.portfolioContent.flow[selected];
   document.querySelector('#flow-detail').innerHTML=`<p class="flow-outcome">${s[zh()?7:6]}</p><h3>${s[zh()?3:2]}</h3><p>${s[zh()?5:4]}</p>`;
   scene.dataset.stage=selected;
   const toggle=document.querySelector('#motion-toggle');
   toggle.textContent=zh()?(paused?'播放动态':'暂停动态'):(paused?'Play motion':'Pause motion');
   toggle.setAttribute('aria-pressed',String(paused));
 }
 document.querySelector('#flow-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-stage]');if(!b)return;selected=Number(b.dataset.stage);flow();document.querySelector(`[data-stage="${selected}"]`).focus();});
 document.addEventListener('portfolio:render',flow);
 const strands=document.querySelector('#signal-strands'),iris=document.querySelector('#iris-lines');
 for(let i=0;i<42;i++){
   const path=document.createElementNS(svgNS,'path');
   const angle=(i/42)*Math.PI*2,x=433+142*Math.cos(angle),y=280+159*Math.sin(angle);
   path.setAttribute('d',`M -25 ${35+i*12} C ${95+i%5*12} ${-80+i*18}, ${200+i%7*9} ${280+(y-280)*1.4}, ${x} ${y}`);
   path.setAttribute('fill','none');path.setAttribute('stroke','url(#silver)');path.setAttribute('stroke-width',i%7===0?'1.4':'.65');path.setAttribute('pathLength','100');path.classList.add('signal-path');path.style.setProperty('--delay',`${i*.028}s`);strands.append(path);
   const ring=document.createElementNS(svgNS,'ellipse');ring.setAttribute('cx','433');ring.setAttribute('cy','280');ring.setAttribute('rx',String(58+i*2.2));ring.setAttribute('ry',String(50+i*2.65));ring.setAttribute('transform',`rotate(${i*4.28} 433 280)`);ring.setAttribute('fill','none');ring.setAttribute('stroke','url(#silver)');ring.setAttribute('stroke-width',i%6===0?'1.2':'.55');ring.setAttribute('opacity',String(.23+i/85));iris.append(ring);
 }
 function progress(){frame=0;const box=document.querySelector('.cognitive-hero').getBoundingClientRect();const p=Math.max(0,Math.min(1,-box.top/Math.max(box.height,1)));root.style.setProperty('--lens-open',paused||reduced.matches?'0':String(p));}
 function scroll(){if(!frame)frame=requestAnimationFrame(progress);}
 function pause(value){paused=value;scene.classList.toggle('motion-paused',paused);flow();progress();}
 document.querySelector('#motion-toggle').addEventListener('click',()=>pause(!paused));
 reduced.addEventListener('change',()=>pause(reduced.matches));
 window.addEventListener('scroll',scroll,{passive:true});
 pause(paused);
})();
