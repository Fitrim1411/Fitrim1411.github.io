// Partikel morphing. Dipakai index.html (hero) dan index-3d.html (layar penuh).
import * as THREE from 'three';

// ── lima bentuk target ──
function shapeSphere(i,n,out,o){
  const GA=Math.PI*(3-Math.sqrt(5)), R=3.0;
  const y=1-(i/(n-1))*2, r=Math.sqrt(Math.max(0,1-y*y)), th=GA*i;
  out[o]=Math.cos(th)*r*R; out[o+1]=y*R; out[o+2]=Math.sin(th)*r*R;
}
function shapeKnot(i,n,out,o){
  const t=(i/n)*Math.PI*2, q=3, R=2.1, r=.85, u=t*2, j=.16;
  out[o]  =(R+r*Math.cos(q*t))*Math.cos(u)+(Math.random()-.5)*j*2;
  out[o+1]= r*Math.sin(q*t)*1.7           +(Math.random()-.5)*j*2;
  out[o+2]=(R+r*Math.cos(q*t))*Math.sin(u)+(Math.random()-.5)*j*2;
}
function shapeWave(i,n,out,o){
  const s=Math.ceil(Math.sqrt(n)), a=i%s, b=Math.floor(i/s);
  const x=(a/s-.5)*7.0, z=(b/s-.5)*7.0;
  out[o]=x; out[o+1]=Math.sin(x*1.15)*.62+Math.cos(z*.95)*.62+Math.sin((x+z)*.6)*.4; out[o+2]=z;
}
function shapeGalaxy(i,n,out,o){
  const arms=3, a=i%arms, t=Math.pow(i/n,.58);
  const ang=t*6.2+a*(Math.PI*2/arms), rad=.25+t*3.5, sp=.10+t*.22;
  out[o]  =Math.cos(ang)*rad+(Math.random()-.5)*sp*2;
  out[o+1]=Math.sin(ang)*rad+(Math.random()-.5)*sp*2;
  out[o+2]=(Math.random()-.5)*sp*2*(1.4-t)*.8;
}
function shapeHelix(i,n,out,o){
  const t=(i/n)*Math.PI*2*3.2, side=(i%2)?1:-1, r=1.5, j=.07;
  out[o]  =Math.cos(t)*r*side+(Math.random()-.5)*j*2;
  out[o+1]=(i/n-.5)*7.4;
  out[o+2]=Math.sin(t)*r*side+(Math.random()-.5)*j*2;
}
const MAKERS=[shapeSphere,shapeKnot,shapeGalaxy,shapeWave,shapeHelix];

export const MOBILE = matchMedia('(max-width:820px)').matches;
export const REDUCED = matchMedia('(prefers-reduced-motion:reduce)').matches;

export async function initParticles(canvas, opt={}){
  const COUNT = opt.count || (MOBILE?34000:120000);
  const CAMZ  = opt.camZ  || 9.6;
  const ALPHA = opt.alpha ?? 0.30;
  const SIZE  = opt.size  || (MOBILE?1.6:1.9);
  const FOV   = opt.fov   || 55;
  const BLOOM = opt.bloom !== false && !MOBILE;
  const onFrame = opt.onFrame;

  // ukuran diambil dari canvas, bukan dari layar, supaya bisa dipakai di hero separuh lebar
  const W = ()=>canvas.clientWidth||1, H = ()=>canvas.clientHeight||1;

  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(W(),H(),false);
  renderer.setClearColor(0x000000,0);

  const scene=new THREE.Scene();
  const cam=new THREE.PerspectiveCamera(FOV,W()/H(),.1,100);
  cam.position.z=CAMZ;

  const SHAPES=MAKERS.map(fn=>{
    const arr=new Float32Array(COUNT*3);
    for(let i=0;i<COUNT;i++) fn(i,COUNT,arr,i*3);
    return arr;
  });

  const aA=new Float32Array(COUNT*3), aB=new Float32Array(COUNT*3);
  aA.set(SHAPES[0]); aB.set(SHAPES[1]);
  const aColor=new Float32Array(COUNT*3), aRand=new Float32Array(COUNT);
  const cPurple=new THREE.Color(0x7c6aef), cLilac=new THREE.Color(0xc9c1ff), cTeal=new THREE.Color(0x6ff0d6);
  const tmpC=new THREE.Color();
  for(let i=0;i<COUNT;i++){
    const r=Math.random();
    tmpC.copy(r<.08?cTeal:(r<.45?cLilac:cPurple));
    aColor[i*3]=tmpC.r; aColor[i*3+1]=tmpC.g; aColor[i*3+2]=tmpC.b;
    aRand[i]=Math.random();
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(aA,3));
  geo.setAttribute('aA',new THREE.BufferAttribute(aA,3));
  geo.setAttribute('aB',new THREE.BufferAttribute(aB,3));
  geo.setAttribute('aColor',new THREE.BufferAttribute(aColor,3));
  geo.setAttribute('aRand',new THREE.BufferAttribute(aRand,1));
  geo.boundingSphere=new THREE.Sphere(new THREE.Vector3(),12);

  const mat=new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{
      uMix:{value:0}, uTime:{value:0},
      uMouse:{value:new THREE.Vector3(999,999,0)},
      uAlpha:{value:ALPHA},
      uBase:{value:CAMZ},          // titik seukuran uSize px di jarak kamera awal
      uSize:{value:SIZE*Math.min(devicePixelRatio,2)}
    },
    vertexShader:[
      'attribute vec3 aA; attribute vec3 aB; attribute vec3 aColor; attribute float aRand;',
      'uniform float uMix, uTime, uSize, uBase; uniform vec3 uMouse;',
      'varying vec3 vColor; varying float vFade;',
      'void main(){',
      '  float d = clamp((uMix - aRand*0.28) / 0.72, 0.0, 1.0);',
      '  d = d*d*(3.0-2.0*d);',
      '  vec3 p = mix(aA, aB, d);',
      '  float ph = aRand*6.2831;',
      '  p += 0.05*vec3(sin(uTime*0.7+ph), cos(uTime*0.6+ph), sin(uTime*0.5+ph));',
      '  vec2 diff = p.xy - uMouse.xy;',
      '  float dist = length(diff);',
      '  float force = smoothstep(2.3, 0.0, dist);',
      '  p.xy += normalize(diff + vec2(0.0001)) * force * 1.35;',
      '  vColor = mix(aColor, vec3(1.0), force*0.40);',
      '  vec4 mv = modelViewMatrix * vec4(p,1.0);',
      '  gl_PointSize = uSize * (uBase / max(0.4,-mv.z));',
      '  vFade = clamp(1.0 - (-mv.z - 4.0)/16.0, 0.12, 1.0);',
      '  gl_Position = projectionMatrix * mv;',
      '}'
    ].join('\n'),
    fragmentShader:[
      'uniform float uAlpha;',
      'varying vec3 vColor; varying float vFade;',
      'void main(){',
      '  vec2 c = gl_PointCoord - 0.5;',
      '  float d = length(c);',
      '  if(d > 0.5) discard;',
      '  float a = smoothstep(0.5, 0.05, d);',
      '  gl_FragColor = vec4(vColor, a * vFade * uAlpha);',
      '}'
    ].join('\n')
  });
  const core=new THREE.Points(geo,mat);
  core.frustumCulled=false;
  scene.add(core);

  let composer=null;
  if(BLOOM){
    try{
      const [ec,rp,ub]=await Promise.all([
        import('three/addons/postprocessing/EffectComposer.js'),
        import('three/addons/postprocessing/RenderPass.js'),
        import('three/addons/postprocessing/UnrealBloomPass.js')
      ]);
      composer=new ec.EffectComposer(renderer);
      composer.addPass(new rp.RenderPass(scene,cam));
      composer.addPass(new ub.UnrealBloomPass(new THREE.Vector2(W(),H()),0.38,0.45,0.34));
      composer.setSize(W(),H());
    }catch(err){ composer=null; }   // bloom gagal dimuat -> tetap jalan tanpa bloom
  }

  let cur=0,next=1,mixT=0,holding=true,hold=0;
  const HOLD=3.4, MORPH=2.6;
  function advance(dt){
    if(holding){
      hold+=dt;
      if(hold>=HOLD){holding=false;hold=0;}
    }else{
      mixT+=dt/MORPH;
      if(mixT>=1){
        mixT=0; holding=true;
        cur=next; next=(next+1)%SHAPES.length;
        aA.set(SHAPES[cur]); aB.set(SHAPES[next]);
        geo.attributes.aA.needsUpdate=true;
        geo.attributes.aB.needsUpdate=true;
      }
    }
    mat.uniforms.uMix.value=mixT;
  }

  // mouse dihitung relatif ke canvas, bukan ke layar
  let mx=0,my=0,hasMouse=false;
  const mouseWorld=new THREE.Vector3(999,999,0);
  const AWAY=new THREE.Vector3(999,999,0), tmpV=new THREE.Vector3();
  addEventListener('mousemove',e=>{
    const r=canvas.getBoundingClientRect();
    mx=((e.clientX-r.left)/r.width-.5)*2;
    my=((e.clientY-r.top)/r.height-.5)*2;
    hasMouse = mx>=-1.6 && mx<=1.6 && my>=-1.6 && my<=1.6;
    if(!hasMouse) return;
    const v=new THREE.Vector3(mx,-my,.5).unproject(cam);
    const dir=v.sub(cam.position).normalize();
    mouseWorld.copy(cam.position).add(dir.multiplyScalar((0-cam.position.z)/dir.z));
  });
  addEventListener('mouseleave',()=>{hasMouse=false;});
  addEventListener('resize',()=>{
    cam.aspect=W()/H(); cam.updateProjectionMatrix();
    renderer.setSize(W(),H(),false);
    if(composer) composer.setSize(W(),H());
  });

  const api={THREE,scene,cam,core,mat,renderer,mouse:()=>({mx,my})};
  const clock=new THREE.Clock();
  function frame(){
    const dt=Math.min(clock.getDelta(),.05), t=clock.getElapsedTime();
    advance(dt);
    mat.uniforms.uTime.value=t;
    // shader membandingkan di ruang lokal, jadi mouse ikut digeser/diskalakan objek
    if(hasMouse){
      core.updateWorldMatrix(true,false);
      mat.uniforms.uMouse.value.copy(core.worldToLocal(tmpV.copy(mouseWorld)));
    }else mat.uniforms.uMouse.value.copy(AWAY);
    core.rotation.y=t*.055;
    core.rotation.x=Math.sin(t*.14)*.13;
    if(onFrame) onFrame(t,api);
    if(composer) composer.render(); else renderer.render(scene,cam);
    requestAnimationFrame(frame);
  }
  frame();
  return api;
}
