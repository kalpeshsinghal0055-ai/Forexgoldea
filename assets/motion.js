(()=>{'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let preference=false;try{preference=localStorage.getItem('fg-motion-paused')==='true';}catch{}
 const motion={paused:reduced.matches||preference};document.documentElement.classList.toggle('motion-paused',motion.paused);
 const button=document.createElement('button');button.className='motion-control';button.type='button';button.setAttribute('aria-label','Pause animations');document.body.append(button);
 const animations=new Set();
 function update(){document.documentElement.classList.toggle('motion-paused',motion.paused);button.textContent=motion.paused?'▶ Motion off':'Ⅱ Motion on';button.setAttribute('aria-label',motion.paused?'Enable animations':'Pause animations');button.setAttribute('aria-pressed',String(!motion.paused));if(motion.paused){animations.forEach(a=>a.finish());animations.clear();}document.dispatchEvent(new Event('fg:motion'));}
 button.addEventListener('click',()=>{motion.paused=!motion.paused;try{localStorage.setItem('fg-motion-paused',String(motion.paused));}catch{}update();});reduced.addEventListener('change',()=>{motion.paused=reduced.matches;update();});update();
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let scrollFrame=0;function scroll(){if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;document.querySelector('.site-header')?.classList.toggle('is-scrolled',scrollY>30);});}addEventListener('scroll',scroll,{passive:true});scroll();
 function animate(el,frames,options){if(motion.paused)return;const a=el.animate(frames,options);animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));}
 const elements=document.querySelectorAll('.hero-copy > *, .hero-stats > div, .home h2, .steps-grid > div, .feat-grid > div, .price-shell, .verified-badge, .tool, .acct, .journal .lead-card, .journal .row, .content-page main h2, .tools-page .head, .tools-page .calc');
 const reveal=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;reveal.unobserve(el);animate(el,[{opacity:.25,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,delay:Number(el.dataset.stagger||0),easing:'cubic-bezier(.16,1,.3,1)'});});},{threshold:.12});
 elements.forEach((el,i)=>{el.dataset.stagger=el.closest('.hero-copy')?String(i*55):'0';reveal.observe(el);});
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 document.querySelectorAll('.tool,.acct,.price-shell>div,.verified-badge').forEach(el=>{
  el.classList.add('depth-card');let rect,raf=0;
  el.addEventListener('pointerenter',()=>{rect=el.getBoundingClientRect();});
  el.addEventListener('pointermove',e=>{if(motion.paused||!fine.matches||!rect||raf)return;raf=requestAnimationFrame(()=>{raf=0;const x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;el.style.setProperty('--tilt-x',(-y*5)+'deg');el.style.setProperty('--tilt-y',(x*6)+'deg');el.style.setProperty('--shine-x',((x+.5)*100)+'%');el.style.setProperty('--shine-y',((y+.5)*100)+'%');});},{passive:true});
  el.addEventListener('pointerleave',()=>{cancelAnimationFrame(raf);raf=0;el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');});
 });
 document.addEventListener('click',e=>{const q=e.target.closest('.faq-q');if(q?.getAttribute('aria-expanded')==='true'){const a=q.parentElement.querySelector('.faq-a');if(a)animate(a,[{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});}});
 const hero=document.querySelector('.hero-section');
 const sections=document.querySelectorAll('.home section');
 const activity=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('section-resting',!e.isIntersecting)),{rootMargin:'80px'});sections.forEach(el=>activity.observe(el));
 const lazyScenes=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;lazyScenes.unobserve(e.target);if(navigator.connection?.saveData)return;import('./lower-scene.js').then(m=>m.mountLower(e.target,motion)).catch(()=>{e.target.querySelector('canvas')?.remove();delete e.target.dataset.rendered;});});},{rootMargin:'180px'});document.querySelectorAll('.lower-3d').forEach(el=>lazyScenes.observe(el));
 if(hero&&!navigator.connection?.saveData){
  const host=document.createElement('div');host.className='gold-scene';host.setAttribute('aria-hidden','true');hero.append(host);
  import('./gold-scene.js').then(m=>m.mountGoldScene(host,motion)).catch(()=>{host.remove();hero.classList.remove('has-3d');});
 }
})();
