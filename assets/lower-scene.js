import * as T from './vendor/three.module.min.js';
export function mountLower(host,motion){
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,35);
 camera.position.set(0,1,8);camera.lookAt(0,0,0);
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<761?1.25:1.5));renderer.setClearColor(0x10150c,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const studio=new T.Scene();studio.background=new T.Color(0x363a2a);
 [[-4,3,3,4,7,0xffefc9,5],[4,2,1,2,6,0xffd791,5],[0,6,-3,5,4,0xffffff,5]].forEach(([x,y,z,w,h,col,power])=>{let m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(col).multiplyScalar(power),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);studio.add(m);});
 const pmrem=new T.PMREMGenerator(renderer),env=pmrem.fromScene(studio,.02);scene.environment=env.texture;pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 scene.add(new T.HemisphereLight(0xffecd1,0x151e0e,2));let light=new T.DirectionalLight(0xffe7b0,4);light.position.set(-3,5,4);scene.add(light);
 const gold=new T.MeshPhysicalMaterial({color:0xd4ad59,roughness:.25,metalness:1,clearcoat:.2});
 const dark=new T.MeshStandardMaterial({color:0x323829,roughness:.4,metalness:.7});
 const assembly=new T.Group();scene.add(assembly);const animated=[];
 if(host.dataset.scene==='risk'){
  camera.position.set(3.3,2.1,7.7);camera.lookAt(0,0,0);
  // Alternating positions are conceptual, deliberately not a performance curve.
  const bars=[[-1.2,-.2,.8],[-.6,.35,1.5],[0,.05,.9],[.6,.6,1.3],[1.2,.15,.85]];
  bars.forEach(([x,y,h],i)=>{let g=new T.Group();let body=new T.Mesh(new T.BoxGeometry(.32,h,.32),i%2?gold:dark);let wick=new T.Mesh(new T.CylinderGeometry(.018,.018,h+.7,8),gold);g.add(body,wick);g.position.set(x,y,0);assembly.add(g);animated.push(g);});
  [1.9,2.25].forEach((r,i)=>{let ring=new T.Mesh(new T.TorusGeometry(r,i?.015:.035,8,110),gold);ring.rotation.x=Math.PI/2+(i?.5:0);ring.rotation.z=i?.4:0;ring.position.y=-.6;assembly.add(ring);});
  let rail=new T.Mesh(new T.BoxGeometry(3.4,.025,.025),gold);rail.position.y=-1.25;assembly.add(rail);
 }else{
  const shape=new T.Shape(),w=2.7,h=1.8,r=.13;
  shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  let plate=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.085,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.025}),gold);assembly.add(plate);
  const c=document.createElement('canvas');c.width=1024;c.height=640;const ctx=c.getContext('2d');ctx.fillStyle='#192015';ctx.fillRect(0,0,1024,640);ctx.strokeStyle='#9c8652';ctx.lineWidth=2;ctx.strokeRect(38,38,948,564);ctx.fillStyle='#e8cb86';ctx.font='500 65px sans-serif';ctx.fillText('ForexGoldEA',76,165);ctx.fillStyle='#a8b399';ctx.font='23px monospace';ctx.fillText('XAU / USD    EXPERT ADVISOR',80,222);ctx.fillStyle='#e8cb86';ctx.font='88px sans-serif';ctx.fillText('MT4 + MT5',76,390);ctx.fillStyle='#a8b399';ctx.font='21px monospace';ctx.fillText('PARTNER ACCESS',80,538);ctx.fillStyle='#b39b5b';for(let i=0;i<24;i++)ctx.fillRect(690+i*9,490,3,55);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const face=new T.Mesh(new T.PlaneGeometry(2.59,1.68),new T.MeshStandardMaterial({map:tex,metalness:.35,roughness:.35}));face.position.z=.118;assembly.add(face);assembly.rotation.set(.04,-.3,-.12);
  const back=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelSegments:2,bevelSize:.025,bevelThickness:.025}),dark);back.position.set(.18,-.15,-.25);back.rotation.z=.1;assembly.add(back);
  const ring=new T.Mesh(new T.TorusGeometry(2.03,.012,6,100),gold);ring.rotation.x=Math.PI/2+.15;ring.position.y=-1.15;scene.add(ring);
 }
 let raf=0,visible=true,last=0,elapsed=0,disposed=false;
 function render(now){raf=0;if(disposed)return;let dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!motion.paused){elapsed+=dt;assembly.rotation.y=(host.dataset.scene==='risk'?-.15:-.3)+Math.sin(elapsed*.45)*.18;assembly.position.y=Math.sin(elapsed*.75)*.07;animated.forEach((o,i)=>o.position.z=Math.sin(elapsed*.6+i)*.07);}renderer.render(scene,camera);host.dataset.rendered='true';if(!motion.paused&&visible&&!document.hidden)raf=requestAnimationFrame(render);}
 function sync(){cancelAnimationFrame(raf);raf=0;last=0;if(visible&&!document.hidden)raf=requestAnimationFrame(render);}
 const ro=new ResizeObserver(()=>{if(!host.clientWidth)return;renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();sync();});ro.observe(host);
 const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();},{threshold:.02});io.observe(host);document.addEventListener('fg:motion',sync);document.addEventListener('visibilitychange',sync);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);delete host.dataset.rendered;});renderer.domElement.addEventListener('webglcontextrestored',sync);
 window.addEventListener('pagehide',e=>{cancelAnimationFrame(raf);if(e.persisted)return;disposed=true;ro.disconnect();io.disconnect();document.removeEventListener('fg:motion',sync);document.removeEventListener('visibilitychange',sync);scene.traverse(o=>{o.geometry?.dispose();o.material?.map?.dispose();o.material?.dispose();});env.dispose();renderer.dispose();});window.addEventListener('pageshow',sync);render(0);
}
