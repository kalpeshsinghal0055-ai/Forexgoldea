import * as THREE from './vendor/three.module.min.js';

// Real geometry and studio reflections; the original image remains the fallback.
export function mountGoldScene(host, motion) {
 const scene=new THREE.Scene();
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(max-width:760px)').matches?1.25:1.75));
 renderer.setClearColor(0x10120f,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(34,1,.1,50);camera.position.set(2.7,1.1,8.9);camera.lookAt(0,0,0);
 const studio=new THREE.Scene();studio.background=new THREE.Color(0x20221b);
 const panels=[];
 function panel(color,intensity,x,y,z,w,h){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);studio.add(m);panels.push(m);}
 panel(0xfff4db,7,-4,3,3,3,7);panel(0xffe6b1,5,4,2,1,2,8);panel(0xffffff,5,0,6,-2,5,3);panel(0xd9b96d,3,1,-1,-5,2,6);
 const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(studio,.02);scene.environment=env.texture;pmrem.dispose();panels.forEach(p=>{p.geometry.dispose();p.material.dispose();});
 scene.add(new THREE.HemisphereLight(0xffedc7,0x171910,2));
 const key=new THREE.DirectionalLight(0xffe0a2,4);key.position.set(-3,5,4);scene.add(key);
 const edge=new THREE.DirectionalLight(0xfff5db,3);edge.position.set(3,2,-3);scene.add(edge);
 const sculpture=new THREE.Group();scene.add(sculpture);
 const gold=new THREE.MeshPhysicalMaterial({color:0xdab56b,metalness:1,roughness:.26,clearcoat:.22,clearcoatRoughness:.3,side:THREE.DoubleSide,envMapIntensity:1.2});
 function ribbon(height,width){
  const vertices=[],indices=[],nu=22,nv=64,thickness=.055;
  for(let side=0;side<2;side++)for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){
   const u=i/nu-.5,v=j/nv,twist=(v-.5)*1.22;
   const x=u*width,z=(Math.cos(u*Math.PI*1.6)-.5)*.7+(side?thickness:-thickness),y=v*height-1.9;
   vertices.push(x*Math.cos(twist)+z*Math.sin(twist),y+u*.22,x*-Math.sin(twist)+z*Math.cos(twist));
  }
  const layer=(nu+1)*(nv+1);
  for(let s=0;s<2;s++)for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){
   const a=s*layer+j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;
   if(s)indices.push(a,c,b,b,c,d);else indices.push(a,b,c,b,d,c);
  }
  const edges=[];for(let i=0;i<nu;i++){edges.push([i,i+1],[nv*(nu+1)+i+1,nv*(nu+1)+i]);}for(let j=0;j<nv;j++){edges.push([j*(nu+1),(j+1)*(nu+1)],[(j+1)*(nu+1)+nu,j*(nu+1)+nu]);}
  edges.forEach(([a,b])=>indices.push(a,a+layer,b,b,a+layer,b+layer));
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();return geo;
 }
 [2.5,3.35,4.15].forEach((h,i)=>{const mesh=new THREE.Mesh(ribbon(h,1.23),gold);mesh.position.x=(i-1)*1.1;mesh.position.z=(i-1)*-.24;sculpture.add(mesh);});
 const base=new THREE.Mesh(new THREE.CylinderGeometry(2.12,2.2,.09,96),new THREE.MeshStandardMaterial({color:0x30291b,metalness:.9,roughness:.35}));base.position.y=-2.04;sculpture.add(base);
 const rings=new THREE.Group();scene.add(rings);
 [2.6,2.85].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.009,5,160,Math.PI*(i?1.3:1.7)),new THREE.MeshBasicMaterial({color:0xb3985e,transparent:true,opacity:i?.2:.4}));ring.rotation.x=Math.PI/2;ring.rotation.z=i*2;ring.position.y=-2.08; rings.add(ring);});
 let frame=0,last=0,time=0,visible=true,px=0,py=0,targetX=0,targetY=0,disposed=false;
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 function pointer(e){if(!fine.matches)return;const r=host.getBoundingClientRect();targetX=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));targetY=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));}
 function leave(){targetX=targetY=0;}
 host.closest('.hero-section').addEventListener('pointermove',pointer,{passive:true});host.closest('.hero-section').addEventListener('pointerleave',leave);
 function draw(now){frame=0;if(disposed)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;
  if(!motion.paused){time+=dt;px+=(targetX-px)*.045;py+=(targetY-py)*.045;sculpture.rotation.y=-.22+Math.sin(time*.3)*.13+px*.22;sculpture.rotation.x=py*.07;sculpture.position.y=Math.sin(time*.65)*.07;rings.rotation.y=time*.035;}
  renderer.render(scene,camera);host.dataset.rendered='true';
  if(visible&&!document.hidden&&!motion.paused)frame=requestAnimationFrame(draw);
 }
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(visible&&!document.hidden)frame=requestAnimationFrame(draw);}
 const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();sync();});resize.observe(host);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.01});observer.observe(host);
 document.addEventListener('visibilitychange',sync);document.addEventListener('fg:motion',sync);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);host.closest('.hero-section').classList.remove('has-3d');});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{host.closest('.hero-section').classList.add('has-3d');sync();});
 draw(0);host.closest('.hero-section').classList.add('has-3d');
 const dispose=()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',sync);document.removeEventListener('fg:motion',sync);scene.traverse(o=>{o.geometry?.dispose();});gold.dispose();env.dispose();renderer.dispose();};
 window.addEventListener('pagehide',e=>{if(e.persisted){cancelAnimationFrame(frame);}else dispose();},{once:true});window.addEventListener('pageshow',sync);
 return {dispose};
}

