// 第302便a(原仮定者の裁定(第92報)AN304 ②・統括の検証項目 R186): **W_bg の直接定義の移行がビット同一で、署名の差が宣言の書き換えだけ**であることを 1 本ずつ確かめる器。
// 基点 html(引数 1)と現行 html(引数 2)で全内蔵の本を 600 步走らせ、指紋(x・y・z・vx・vy・vz・自転・R・m・t・n・NaN・クランプ数 —— 署名の長さは入れない)と
// presetSig を比べる。署名の差は relativeDrag の gain/Wbg/enabled の鍵を外して比べ(sigDiffOther = それ以外の差)、係数(凍結比較は gain・それ以外は 1/Wbg・OFF は 0)の差を coefDiff に出す。
// tests/exp-w258c-bitsame.mjs は指紋に署名の長さを入れるので、鍵の名前を変えた本 24 本が差に出る —— その差がこの器の sigDiff(= 宣言の書き換え)と同じ集合であることを見る。
// 使い方: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w302a-wbgsig.mjs beta/_w302_base.html beta/index.html [出力 JSON]
//   (出力先は第 3 引数か W302A_OUT —— 省略時は標準出力だけ)。終了コード: stepDiff・sigDiffOther が 1 本でもあれば 1。
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'); const A=process.argv[2], B=process.argv[3], OUT=process.argv[4]||process.env.W302A_OUT||null;
const req=createRequire(path.join(process.env.PLAYWRIGHT_CORE_DIR||'/home/user/dfm-simulator','noop.js'));
const browser=await req('playwright').chromium.launch();
async function run(target){ const page=await browser.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(String(e.message||e)));
  await page.goto('file://'+path.join(ROOT,target),{waitUntil:'load'}); await page.waitForFunction(()=>window.HP&&HP.sim&&HP.currentPreset());
  const out=await page.evaluate(()=>{ const hash=(T)=>{let a=0x811c9dc5;const buf=new ArrayBuffer(8),f=new Float64Array(buf),u=new Uint8Array(buf);const push=(v)=>{f[0]=v;for(let b=0;b<8;b++){a^=u[b];a=Math.imul(a,0x01000193)>>>0;}};
      for(const k of ['x','y','z','vx','vy','vz','spin','R','m']){const Ar=T[k]; if(!Ar) continue; for(let i=0;i<T.n;i++) push(Ar[i]);} push(T.t); return a.toString(16);};
    const rows={}; for(const p of HP.allPresets()){ HP.loadPreset(p.id,false); const T=HP.sim; for(let i=0;i<600;i++) T.step(0.016);
      rows[p.id]={h:hash(T)+'|'+T.n+'|'+T.hasNaN()+'|'+T.clampVN+'|'+T.clampSN, sig:presetSig(p)}; } return rows; });
  await page.close(); return {out,errs}; }
const a=await run(A), b=await run(B); await browser.close();
const coef=(rd)=>{ if(!rd||rd.law!=='inertial') return undefined; if(rd.gain!==undefined) return rd.gain; return (rd.enabled===false||rd.Wbg==null)? 0 : 1/rd.Wbg; };
const strip=(sig)=>{ const o=JSON.parse(sig); const rd=o.physics&&o.physics.relativeDrag; if(rd){ const r=Object.assign({},rd); delete r.gain; delete r.Wbg; delete r.enabled; o.physics.relativeDrag=r; } return JSON.stringify(o); };
const res={stepDiff:[], sigDiff:[], sigDiffOther:[], coefDiff:[]};
for(const id of Object.keys(a.out)){ const x=a.out[id], y=b.out[id]; if(!y){res.stepDiff.push(id+':missing'); continue;}
  if(x.h!==y.h) res.stepDiff.push(id);
  if(x.sig!==y.sig){ res.sigDiff.push(id);
    if(strip(x.sig)!==strip(y.sig)) res.sigDiffOther.push(id);
    const ca=coef(JSON.parse(x.sig).physics.relativeDrag), cb=coef(JSON.parse(y.sig).physics.relativeDrag);
    if(ca!==cb) res.coefDiff.push(id+':'+ca+'→'+cb); } }
res.n=Object.keys(a.out).length; res.errsA=a.errs.slice(0,3); res.errsB=b.errs.slice(0,3);
if(OUT) fs.writeFileSync(OUT, JSON.stringify(res,null,1)); console.log(JSON.stringify(res));
process.exit(res.stepDiff.length===0 && res.sigDiffOther.length===0 ? 0 : 1);
