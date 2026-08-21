// Partikel morphing. Dipakai index.html (hero) dan index-3d.html (layar penuh).
import * as THREE from 'three';

// ── empat bentuk, masing-masing mewakili satu proyek ──

// Pezen: gelombang suara. Tiga letupan bicara dengan jeda di antaranya.
function shapeVoice(i,n,out,o){
  const BARS=84;
  const b=i%BARS;                       // batang tegak, bukan awan, biar kebaca
  const x=(b/(BARS-1)-.5)*6.6;
  const env = Math.exp(-Math.pow((x+2.30)/0.90,2))*1.00
            + Math.exp(-Math.pow((x+0.35)/1.10,2))*1.45
            + Math.exp(-Math.pow((x-1.95)/0.85,2))*1.05;
  const s=Math.sin(b*78.233)*43758.5453, fr=s-Math.floor(s);
  const h=(0.12+env*0.92)*(0.42+0.58*fr);
  out[o]  = x+(Math.random()-.5)*0.042;
  out[o+1]=(Math.random()*2-1)*h;
  out[o+2]=(Math.random()-.5)*0.42;
}

// Receipt Scanner: lembar struk, baris teks, sedikit menggulung.
function shapeReceipt(i,n,out,o){
  const W=3.40, H=5.30, ROWS=26;
  const row=i%ROWS;
  const s=Math.sin(row*12.9898)*43758.5453, fr=s-Math.floor(s);
  const y = H/2-0.20-row*(H-0.44)/ROWS;
  let x0=-W/2+0.16, x1=x0+(W-0.32)*(0.35+fr*0.60);
  if(row<2){ x0=-W*0.30; x1=W*0.30; }                     // judul, rata tengah
  else if(row%5===4){ x1=W/2-0.16; x0=x1-(W-0.32)*0.28; }  // angka, rata kanan
  out[o]  = x0+Math.random()*(x1-x0);
  out[o+1]= y+(Math.random()-.5)*0.085;
  out[o+2]= Math.sin(y*0.75)*0.42+(Math.random()-.5)*0.05;
}

// House Price: sebaran harga, sumbu plus awan titik yang melebar naik.
function shapeScatter(i,n,out,o){
  const AX=0.10;
  if(i<n*AX){
    const k=i/(n*AX);
    if(k<0.5){ out[o]=-2.60+(k*2)*5.20; out[o+1]=-2.40+(Math.random()-.5)*0.05; }
    else     { out[o]=-2.60+(Math.random()-.5)*0.05; out[o+1]=-2.40+((k-0.5)*2)*4.80; }
    out[o+2]=(Math.random()-.5)*0.05;
    return;
  }
  const u=Math.random();
  const g=(Math.random()+Math.random()+Math.random()-1.5)/1.5;
  out[o]  =-2.40+u*4.90;
  out[o+1]=-1.90+u*3.90+g*(0.25+u*0.95);
  out[o+2]=(Math.random()-.5)*0.50;
}

// LearnToRecall: jaringan neural, empat lapis simpul dan sambungannya.
const LX=[-2.70,-0.95,0.95,2.70], LN=[5,9,9,3];
const ly=(l,c)=>(c-(LN[l]-1)/2)*(LN[l]>6?0.62:0.95);
function shapeNeural(i,n,out,o){
  if(i<n*0.55){                                    // simpul
    const total=LN[0]+LN[1]+LN[2]+LN[3];
    let c=i%total, l=0;
    while(c>=LN[l]){ c-=LN[l]; l++; }
    const th=Math.random()*Math.PI*2, ph=Math.acos(Math.random()*2-1);
    const rr=0.19*Math.cbrt(Math.random());
    out[o]  =LX[l]+rr*Math.sin(ph)*Math.cos(th);
    out[o+1]=ly(l,c)+rr*Math.sin(ph)*Math.sin(th);
    out[o+2]=rr*Math.cos(ph);
    return;
  }
  const l=Math.floor(Math.random()*3), t=Math.random();  // sambungan
  const a=ly(l,Math.floor(Math.random()*LN[l])), b=ly(l+1,Math.floor(Math.random()*LN[l+1]));
  out[o]  =LX[l]+(LX[l+1]-LX[l])*t;
  out[o+1]=a+(b-a)*t;
  out[o+2]=(Math.random()-.5)*0.12;
}
const MAKERS=[shapeVoice,shapeNeural,shapeReceipt,shapeScatter];

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
