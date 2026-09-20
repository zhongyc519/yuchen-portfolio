(() => {
  const canvas = document.querySelector('#wave-canvas');
  const button = document.querySelector('#wave-toggle');
  const hero = document.querySelector('.ember-hero');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = window.radiantState = { progress: 0, dark: 0, paused: reduced.matches };
  let time = 0, last = 0, frame = 0, visible = true, lost = false;
  let px = 0, py = 0, targetX = 0, targetY = 0;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  function fallback() {
    // Deterministic low-resolution fluid still; no circles or floating primitives.
    canvas.style.opacity = '0';
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 320; fallbackCanvas.height = 240;
    const ctx = fallbackCanvas.getContext('2d');
    const pixels = ctx.createImageData(320,240);
    for(let y=0;y<240;y++)for(let x=0;x<320;x++){
      const u=x/320,v=y/240;
      const w=Math.sin(u*6+Math.sin(v*7)*1.6)+Math.cos(v*5+u*2);
      const amount=Math.pow(Math.max(0,1-Math.abs(w-.45)),3)*.65;
      const base=u<.45?[160,224,171]:u<.7?[255,172,46]:[165,45,37];
      const i=(y*320+x)*4; pixels.data[i]=base[0]*amount+7;pixels.data[i+1]=base[1]*amount+7;pixels.data[i+2]=base[2]*amount+7;pixels.data[i+3]=255;
    }
    ctx.putImageData(pixels,0,0);
    canvas.parentElement.style.backgroundImage=`url(${fallbackCanvas.toDataURL()})`;
    canvas.parentElement.style.backgroundSize='cover';
    hero.dataset.radiant='static-fallback';
  }
  if(!gl){ fallback(); button.hidden=true; return; }
  const vertex='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  const fragment=`precision mediump float;
uniform vec2 resolution;uniform float time;uniform float progress;uniform float dark;uniform vec2 pointer;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float n=0.;float a=.5;for(int i=0;i<3;i++){n+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+4.2;a*=.5;}return n;}
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.);p*=2.1;p+=vec2(.3,-.17)+pointer*.09;
 float t=time*.035;vec2 q=vec2(fbm(p+vec2(t,-t*.4)),fbm(p+vec2(4.2,1.3)+t*.6));
 vec2 r=vec2(fbm(p+q*2.8+vec2(1.7,7.2)+progress*.5),fbm(p+q*2.4+vec2(8.3,2.8)-t*.4));
 float fluid=fbm(p+r*3.1+q);float fold=sin((fluid*2.4+p.x*.21-p.y*.32+progress*.32)*6.2831);
 float ribbon=pow(1.-abs(fold),3.4);float veil=smoothstep(.28,.83,fluid);
 vec3 sage=vec3(.627,.878,.671),amber=vec3(1.,.674,.18),oxblood=vec3(.647,.176,.145),violet=vec3(.32,.27,.35),pearl=vec3(.9,.91,.84);
 float hue=clamp(uv.x*.65+r.y*.6+sin(t*.2)*.06+progress*.2,0.,1.);
 vec3 mineral=mix(sage,amber,smoothstep(.22,.52,hue));mineral=mix(mineral,oxblood,smoothstep(.5,.8,hue));mineral=mix(mineral,violet,smoothstep(.8,1.,hue));
 vec3 color=mix(vec3(.018,.021,.02),mineral,veil*.42+ribbon*.56);
 color=mix(color,pearl,pow(ribbon,5.)*.28);float vignette=1.-.38*length((uv-.5)*vec2(1.,.8));color*=vignette;
 color*=mix(1.,.18,dark);color+=(hash(gl_FragCoord.xy)-.5)*.008;
 gl_FragColor=vec4(color,1.);
}`;
  let program, buffer;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Shader compilation failed');}return s;}
  let uniforms;
  function init(){
    const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
    program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader link failed');
    gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    uniforms=Object.fromEntries(['resolution','time','progress','dark','pointer'].map(k=>[k,gl.getUniformLocation(program,k)]));
    hero.dataset.radiant='webgl';canvas.style.opacity='1';
  }
  function resize(){const box=canvas.getBoundingClientRect(),cap=innerWidth<701?480:960;const ratio=Math.min(devicePixelRatio,1.5,cap/Math.max(1,box.width));canvas.width=Math.max(1,Math.round(box.width*ratio));canvas.height=Math.max(1,Math.round(box.height*ratio));gl.viewport(0,0,canvas.width,canvas.height);draw();}
  function draw(){if(lost||!uniforms)return;gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform1f(uniforms.time,time);gl.uniform1f(uniforms.progress,reduced.matches?0:state.progress);gl.uniform1f(uniforms.dark,reduced.matches?0:state.dark);gl.uniform2f(uniforms.pointer,px,py);gl.drawArrays(gl.TRIANGLES,0,3);}
  function tick(now){frame=0;if(!visible||document.hidden||lost)return;const dt=last?Math.min((now-last)/1000,.1):0;last=now;if(!state.paused&&!reduced.matches){time+=dt;px+=(targetX-px)*.025;py+=(targetY-py)*.025;}draw();if(!state.paused&&!reduced.matches)frame=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(frame);last=0;button.textContent=document.documentElement.lang==='zh-CN'?(state.paused?'播放动态':'暂停动态'):(state.paused?'Play motion':'Pause motion');button.setAttribute('aria-pressed',String(state.paused));draw();if(visible&&!document.hidden&&!state.paused&&!reduced.matches&&!lost)frame=requestAnimationFrame(tick);}
  try{init();}catch{fallback();button.hidden=true;return;}
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  const intersection=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();});intersection.observe(hero);
  button.addEventListener('click',()=>{state.paused=!state.paused;sync();});
  hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||state.paused||reduced.matches)return;const b=hero.getBoundingClientRect();targetX=(e.clientX-b.left)/b.width-.5;targetY=(e.clientY-b.top)/b.height-.5;},{passive:true});
  hero.addEventListener('pointerleave',()=>{targetX=targetY=0;});
  reduced.addEventListener('change',()=>{state.paused=reduced.matches;sync();});
  document.addEventListener('visibilitychange',sync);document.addEventListener('portfolio:render',sync);document.addEventListener('radiant:draw',()=>{if(!frame)frame=requestAnimationFrame(tick);});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(frame);fallback();});
  canvas.addEventListener('webglcontextrestored',()=>{lost=false;try{init();resize();sync();}catch{fallback();}});
  addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();gl.deleteBuffer(buffer);gl.deleteProgram(program);},{once:true});
  addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
  resize();sync();
})();
