/* ============ DATOS DEL CURRÍCULO (Orden de 30 de mayo de 2023, Matemáticas, segundo ciclo) ============ */
let CES={},CRITS=[],CRIT={},SABERES=[],BLOQUES={};
const AREAS=Object.entries(CURRICULO).map(([id,a])=>({id,n:a.n,corto:a.corto,ciclo:'2.º ciclo · 3.º y 4.º',on:1}));
function setArea(id){const a=CURRICULO[id]||CURRICULO.mat;CES=a.ces;CRITS=a.crits;CRIT=Object.fromEntries(CRITS.map(x=>[x.c,x]));SABERES=a.saberes;BLOQUES=a.bloques;if(UI&&!CRIT[UI.crit])UI.crit=CRITS[0].c}

const LVN=['','Inicio','En proceso','Conseguido','Destacado'];
const LVC=['var(--l0)','var(--l1)','var(--l2)','var(--l3)','var(--l4)'];
const TRI_N=['1.<sup>er</sup> trim.','2.º trim.','3.<sup>er</sup> trim.','Curso'];

/* ============ ESTADO ============ */
const DEF_CONFIG=()=>({alumnos:[],notas:[3,5,7,9],tri:[['2026-09-01','2026-12-31'],['2027-01-01','2027-03-31'],['2027-04-01','2027-06-30']],horario:{1:[],2:[],3:[],4:[],5:[]},udActual:{},avisoSust:''});
let S={config:DEF_CONFIG(),months:{},prog:{}};
const PROGT=['ud','ses'];
const toWire=p=>({id:p.id,t:p.t,ar:p.ar,f:p.f||'',a:'',c:'',txt:JSON.stringify(p.d||{})});
function fromWire(r){let d={};try{d=JSON.parse(r.txt||'{}')}catch(e){}return {id:r.id,t:r.t,ar:r.ar||'mat',f:r.f||'',d}}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function guessTri(){const t=today();const i=S.config.tri.findIndex(([a,b])=>t>=a&&t<=b);return i<0?3:i}
let UI={area:'mat',tab:'inicio',tri:0,crit:'1.1',fecha:today(),rub:true,modo:'nivel',alumno:null,curso:'3',filtro:'todos'};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtF=f=>{const [y,m,d]=f.split('-');return d+'/'+m+'/'+y.slice(2)};

/* ============ ALMACENAMIENTO (nube privada + copia local) ============ */
const APP_VERSION='1.3.1';
const LK='evaluapp-datos',LO='evaluapp-cambios',LS='evaluapp-sync';
let OPS=[];let SYNC={url:'',key:''};
function persist(){try{localStorage.setItem(LK,JSON.stringify(S));localStorage.setItem(LO,JSON.stringify(OPS))}catch(e){}}
function loadLocal(){try{const r=localStorage.getItem(LK);if(r){const d=JSON.parse(r);S.config=Object.assign(DEF_CONFIG(),d.config||{});S.months=d.months||{};S.prog=d.prog||{}}OPS=JSON.parse(localStorage.getItem(LO)||'[]');SYNC=Object.assign({url:'',key:''},JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}}
function putReg(r){if(PROGT.includes(r.t)){S.prog=Object.assign({},S.prog,{[r.id]:fromWire(r)});return}for(const m in S.months){const i=S.months[m].findIndex(x=>x.id===r.id);if(i>=0){S.months[m]=S.months[m].slice();S.months[m].splice(i,1)}}const m=mk(r.f);S.months[m]=(S.months[m]||[]).concat([r])}
function dropReg(id){if(S.prog[id]){const p=Object.assign({},S.prog);delete p[id];S.prog=p;return}for(const m in S.months){const i=S.months[m].findIndex(x=>x.id===id);if(i>=0){S.months[m]=S.months[m].slice();S.months[m].splice(i,1)}}}
function applyOp(o){if(o.op==='up')putReg(o.r);else if(o.op==='del')dropReg(o.id);else if(o.op==='config')S.config=Object.assign(DEF_CONFIG(),o.config)}
function enqueue(o){if(o.op==='config')OPS=OPS.filter(x=>x.op!=='config');OPS.push(JSON.parse(JSON.stringify(o)));persist();Sync.schedule()}
const Sync={timer:null,busy:false,
 ok(){return !!(SYNC.url&&SYNC.key)},
 status(){if(!this.ok())setSync('warn','Sin sincronizar');else if(!navigator.onLine)setSync('warn',OPS.length?`Sin conexión · ${OPS.length} pendientes`:'Sin conexión');},
 schedule(ms=1200){if(!this.ok()){this.status();return}clearTimeout(this.timer);this.timer=setTimeout(()=>this.run(),ms)},
 async call(body,url=SYNC.url,key=SYNC.key){
   const r=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({key},body))});
   let j;try{j=await r.json()}catch(e){throw new Error('La hoja no responde bien. Revisa la URL y que la implementación sea «Cualquier usuario».')}
   if(!j.ok)throw new Error(j.error||'Error desconocido');return j},
 async run(){
   if(!this.ok()||this.busy)return;
   if(!navigator.onLine){this.status();return}
   this.busy=true;setSync('warn','Sincronizando…');
   try{
     if(OPS.length){const env=OPS.slice();await this.call({action:'push',ops:env});OPS=OPS.slice(env.length);persist()}
     const j=await this.call({action:'pull'});
     const vacia=!j.config&&!(j.regs||[]).length;
     const progW=Object.values(S.prog).map(toWire);
     if(vacia&&(S.config.alumnos.length||allRegsRaw().length||progW.length)){
       OPS=[{op:'config',config:S.config}].concat(allRegsRaw().map(r=>({op:'up',r})),progW.map(r=>({op:'up',r})));persist();
       this.busy=false;return this.run();
     }
     if(!vacia||!OPS.length){S.config=Object.assign(DEF_CONFIG(),j.config||{});S.months={};S.prog={};(j.regs||[]).forEach(r=>{if(PROGT.includes(r.t)){S.prog[r.id]=fromWire(r);return}const m=mk(r.f);(S.months[m]=S.months[m]||[]).push(r)});OPS.forEach(applyOp);persist();render()}
     setSync('ok','Sincronizado');
   }catch(e){setSync('err','Error de sincronización');console.warn(e);this.lastError=e.message}
   this.busy=false;if(OPS.length)this.schedule(4000);
 }
};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')Sync.schedule(200)});
window.addEventListener('online',()=>Sync.schedule(200));window.addEventListener('offline',()=>Sync.status());
setInterval(()=>{if(document.visibilityState==='visible'&&!OPS.length)Sync.run()},90000);
let SYNCST=['warn','Sin sincronizar'];
function syncHTML(){return `<span class="dot ${SYNCST[0]}"></span><span>${esc(SYNCST[1])}</span>`}
function setSync(k,t){if(SYNCST[0]===k&&SYNCST[1]===t)return;SYNCST=[k,t];document.querySelectorAll('.sync').forEach(el=>el.innerHTML=syncHTML());if(UI.tab==='ajustes'&&k!=='warn'&&!document.querySelector('.modal-bg'))render()}

/* ============ CÁLCULOS ============ */
const allRegsRaw=()=>Object.values(S.months).flat();
const allRegs=()=>allRegsRaw().filter(r=>(r.ar||'mat')===UI.area);
const areaAct=()=>AREAS.find(a=>a.id===UI.area)||AREAS[0];
function inPeriod(f){if(UI.tri===3)return true;const [a,b]=S.config.tri[UI.tri];return f>=a&&f<=b}
const periodRegs=()=>allRegs().filter(r=>inPeriod(r.f));
const aplica=(al,c)=>!(CRIT[c].solo4&&al.curso==='3');
function nivelMedio(regs,a,c){const v=regs.filter(r=>r.t==='niv'&&r.a===a&&r.c===c).map(r=>r.n);return v.length?v.reduce((x,y)=>x+y,0)/v.length:null}
function aNota(nv){if(nv==null)return null;const n=S.config.notas.map(Number);const i=Math.min(Math.floor(nv),3);const lo=Math.max(i,1);const f=nv-lo;const val=lo>=4?n[3]:n[lo-1]+(n[Math.min(lo,3)]-n[lo-1])*f;return Math.max(1,Math.min(10,val))}
const colorNv=nv=>nv==null?LVC[0]:LVC[nv<2?1:nv<3?2:nv<3.75?3:4];
function mediaAlumno(regs,al){const ns=CRITS.filter(x=>aplica(al,x.c)).map(x=>aNota(nivelMedio(regs,al.id,x.c))).filter(v=>v!=null);return ns.length?ns.reduce((a,b)=>a+b,0)/ns.length:null}
const alumnosOrd=()=>S.config.alumnos.slice().sort((a,b)=>a.curso.localeCompare(b.curso)||a.nombre.localeCompare(b.nombre,'es'));
const mk=f=>f.slice(0,7);

/* ============ ACCIONES ============ */
function setNivel(a,c,n){
  const f=UI.fecha;
  const r=allRegs().find(r=>r.t==='niv'&&r.a===a&&r.c===c&&r.f===f);
  if(r&&r.n===n){dropReg(r.id);enqueue({op:'del',id:r.id})}
  else{const nr=r?Object.assign({},r,{n}):{id:uid(),t:'niv',a,c,n,f,ar:UI.area};putReg(nr);enqueue({op:'up',r:nr})}
  render();
}
function addObs(a,c,txt,f){const r={id:uid(),t:'obs',a,c,txt,f,ar:UI.area};putReg(r);enqueue({op:'up',r})}
function delReg(id){dropReg(id);enqueue({op:'del',id})}
function saveConfig(){enqueue({op:'config',config:S.config})}

/* ============ UI BASE ============ */
const ICONS={
 evaluar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
 clase:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
 alumno:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
 seneca:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
 ajustes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
 nota:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
};
ICONS.inicio='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>';
ICONS.prog='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4H9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5h-6A1.5 1.5 0 0 1 2 16Z"/><path d="M22 5.5A1.5 1.5 0 0 0 20.5 4H15a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5h6A1.5 1.5 0 0 0 22 16Z"/></svg>';
ICONS.area='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>';
ICONS.chev='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
ICONS.evaluar='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="m9 13 2 2 4-4"/></svg>';
ICONS.clase='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3"/><path d="M6.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="5" cy="10" r="2"/><circle cx="19" cy="10" r="2"/><path d="M1.5 18a3.5 3.5 0 0 1 4-3.4M22.5 18a3.5 3.5 0 0 0-4-3.4"/></svg>';
const SECS={
 inicio:{n:'Inicio',sub:'Panel docente'},
 evaluar:{n:'Evaluar',sub:'Criterios y rúbricas'},
 clase:{n:'Clase',sub:'Grupo de un vistazo'},
 alumno:{n:'Alumno',sub:'Ficha y seguimiento'},
 seneca:{n:'Séneca',sub:'Traslado de notas'},
 prog:{n:'Programación',sub:'Unidades, diario y horario'},
 ajustes:{n:'Ajustes',sub:'Datos y copias'}
};
const NAV=['inicio','evaluar','clase','alumno','seneca','prog','ajustes'];
const MOBNAV=['inicio','evaluar','clase','alumno','seneca','prog'];
const cursoEsc=()=>{const d=new Date();const y=d.getMonth()>=8?d.getFullYear():d.getFullYear()-1;return `${y}/${y+1}`};
const secVars=k=>`--navbg:var(--s-${k});--navacc:var(--a-${k})`;
function resumen(){
  const als=S.config.alumnos,regs=periodRegs();
  let tot=0,ev=0;const alertAl=new Set();
  als.forEach(al=>CRITS.forEach(x=>{if(!aplica(al,x.c))return;tot++;const v=nivelMedio(regs,al.id,x.c);if(v!=null){ev++;if(v<2)alertAl.add(al.id)}}));
  const sinEval=CRITS.filter(x=>als.some(al=>aplica(al,x.c))&&!regs.some(r=>r.t==='niv'&&r.c===x.c)).length;
  return {als:als.length,tot,ev,alertas:alertAl.size,sinEval,pct:tot?Math.round(ev/tot*100):0};
}
function areaModal(){
  modal(`<h3>Área</h3>${AREAS.map(a=>`<button class="opt ${a.id===UI.area?'on':''}" data-area="${a.id}" ${a.on?'':'disabled'}><div><b>${esc(a.n)}</b><span>${a.ciclo}</span></div><span class="badge">${a.id===UI.area?'Activa':a.on?'Disponible':'Próximamente'}</span></button>`).join('')}<p class="small muted" style="margin:14px 2px 0">El alumnado es el mismo en todas las áreas; los criterios y las notas son propios de cada una.</p><div class="btns" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-close>Cerrar</button></div>`,(m,close)=>{m.addEventListener('click',e=>{const b=e.target.closest('[data-area]');if(b&&!b.disabled){UI.area=b.dataset.area;setArea(UI.area);try{localStorage.setItem('evaluapp-area',UI.area)}catch(_){ }close();render()}})});
}
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),2200)}
function modal(html,onMount){const bg=document.createElement('div');bg.className='modal-bg';bg.innerHTML=`<div class="modal">${html}</div>`;document.body.appendChild(bg);const close=()=>bg.remove();bg.addEventListener('click',e=>{if(e.target===bg||e.target.closest('[data-close]'))close()});onMount&&onMount(bg.querySelector('.modal'),close);return close}
function confirmar(txt,okTxt,fn){modal(`<h3>${esc(txt)}</h3><div class="btns" style="justify-content:flex-end"><button class="btn" data-close>Cancelar</button><button class="btn danger" id="okb">${esc(okTxt)}</button></div>`,(m,close)=>{m.querySelector('#okb').onclick=()=>{close();fn()}})}
async function copiar(txt){try{await navigator.clipboard.writeText(txt);toast('Copiado')}catch(e){modal(`<h3>Copia este texto</h3><textarea style="min-height:220px">${esc(txt)}</textarea><div class="btns" style="justify-content:flex-end;margin-top:10px"><button class="btn" data-close>Cerrar</button></div>`,m=>{const t=m.querySelector('textarea');t.focus();t.select()})}}
function descargar(filename,data,type='text/plain'){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}

/* ============ VISTA: EVALUAR ============ */
function vEvaluar(){
  const als=alumnosOrd();
  if(!als.length)return `<h2>Evaluar</h2><div class="card empty"><b>Aún no hay alumnos</b>Añádelos en Ajustes o carga el ejemplo para probar la app.<div class="btns" style="justify-content:center;margin-top:14px"><button class="btn pri" data-go="ajustes">Ir a Ajustes</button><button class="btn" data-act="demo">Cargar ejemplo</button></div></div>`;
  const vis=critsVisibles();if(!vis.some(x=>x.c===UI.crit))UI.crit=vis[0].c;
  const cr=CRIT[UI.crit];const ucurs=udsEnCurso().filter(u=>(u.d.crits||[]).length);
  const regsHoy=allRegs().filter(r=>r.f===UI.fecha);
  const shown=als.filter(a=>UI.filtro==='todos'||a.curso===UI.filtro);
  return `<h2>Evaluar</h2>
  <div class="card stack">
    <div class="toolbar" style="margin:0">
      <div class="field" style="flex:1;min-width:150px"><label>Fecha</label><input type="date" id="fecha" value="${UI.fecha}"></div>
      <div class="field" style="flex:1;min-width:150px"><label>Curso</label><div class="seg" id="filtro">${[['todos','Todos'],['3','3.º'],['4','4.º']].map(([k,n])=>`<button data-filtro="${k}" class="${UI.filtro===k?'on':''}">${n}</button>`).join('')}</div></div>
    </div>
    ${ucurs.length?`<button class="udbar ${UI.soloUd?'on':''}" data-act="soloUd"><span>${UI.soloUd?'Solo los criterios de':'Ver solo los criterios de'}</span><b>${ucurs.map(u=>esc(u.d.titulo)+(UI.filtro==='todos'&&udCurso(u)!=='ambos'?' ('+CURSO_N[udCurso(u)]+')':'')).join(' y ')}</b><span class="sw2">${UI.soloUd?'Ver todos':'Filtrar'}</span></button>`:''}
    <div class="critbar">${vis.map(x=>`<button class="chip ${UI.crit===x.c?'on':''}" data-crit="${x.c}">${x.c}${x.core?'<span class="core">★</span>':''}</button>`).join('')}</div>
    <div class="critinfo"><div><div class="ce">CE${cr.ce} · ${CES[cr.ce]}</div><div class="t">${cr.c} ${esc(cr.t)}</div>
      <div class="small muted" style="margin-top:4px">${UI.filtro!=='4'&&cr.d3?`<b>3.º:</b> ${esc(cr.d3)}${UI.filtro==='todos'?'<br>':''}`:''}${UI.filtro!=='3'?`<b>4.º:</b> ${esc(cr.d4)}`:''}</div></div>
      <button class="btn sm" data-act="rub">${UI.rub?'Ocultar rúbrica':'Ver rúbrica'}</button></div>
    ${(()=>{const ti=S.config.tri.findIndex(([x,y])=>UI.fecha>=x&&UI.fecha<=y);const rg=allRegs().filter(r=>r.t==='niv'&&r.c===cr.c&&(ti<0||(r.f>=S.config.tri[ti][0]&&r.f<=S.config.tri[ti][1])));const ap=shown.filter(al=>aplica(al,cr.c));const ev=ap.filter(al=>rg.some(r=>r.a===al.id)).length;const p=ap.length?Math.round(ev/ap.length*100):0;return `<div><div class="prog"><i style="width:${p}%"></i></div><div class="small muted" style="margin-top:6px">${ev} de ${ap.length} alumnos evaluados en este criterio${ti>=0?' este trimestre':''} · ${p} %</div></div>`})()}
    ${UI.rub?`<div class="rub">${cr.r.map((t,i)=>`<div><b><span class="sw" style="background:${LVC[i+1]}"></span>${i+1} · ${LVN[i+1]}</b>${esc(t)}</div>`).join('')}</div>`:''}
  </div>
  <div class="card list" style="margin-top:12px">
    ${shown.map(al=>{
      const r=regsHoy.find(x=>x.t==='niv'&&x.a===al.id&&x.c===cr.c);
      const ob=regsHoy.some(x=>x.t==='obs'&&x.a===al.id);
      return `<div class="row"><div class="name">${esc(al.nombre)}<span class="curso">${al.curso}.º</span></div>
      ${aplica(al,cr.c)?`<div class="lv">${[1,2,3,4].map(n=>`<button data-lv="${n}" data-al="${al.id}" class="${r&&r.n===n?'on'+n:''}" aria-label="${LVN[n]}">${n}</button>`).join('')}</div>`:`<div class="na">No se evalúa en 3.º</div>`}
      <button class="ic ${ob?'has':''}" data-obs="${al.id}" aria-label="Observación">${ICONS.nota}</button></div>`}).join('')}
  </div>
  <p class="small muted" style="text-align:center">Toca un nivel para guardarlo con la fecha elegida. Vuelve a tocarlo para quitarlo. ★ = criterio esencial.</p>`;
}

/* ============ VISTA: CLASE ============ */
function vClase(){
  const als=alumnosFiltro();
  if(!als.length)return `<h2>Clase</h2><div class="card empty"><b>Sin alumnos</b>Añádelos en Ajustes.</div>`;
  const regs=periodRegs();
  const niv=regs.filter(r=>r.t==='niv');
  let tot=0,ev=0;const alerts=[];
  als.forEach(al=>CRITS.forEach(x=>{if(!aplica(al,x.c))return;tot++;const v=nivelMedio(regs,al.id,x.c);if(v!=null){ev++;if(v<2)alerts.push([al,x.c,v])}}));
  const byAl={};alerts.forEach(([al,c,v])=>{(byAl[al.id]=byAl[al.id]||{al,l:[]}).l.push([c,v])});
  const media=als.map(al=>mediaAlumno(regs,al)).filter(v=>v!=null);
  const showN=UI.modo==='nota';
  const cellTxt=v=>v==null?'·':showN?aNota(v).toFixed(1).replace('.',','):v.toFixed(1).replace('.',',');
  let ceRow='',lastCe=0;CRITS.forEach(x=>{ceRow+=`<th class="ceh">${x.ce!==lastCe?'CE'+x.ce:''}</th>`;lastCe=x.ce});
  return `<h2>Clase · ${TRI_N[UI.tri]}</h2>
  <div class="kpis">
    <div class="kpi"><b>${als.length}</b><span>alumnos</span></div>
    <div class="kpi"><b>${niv.length}</b><span>registros</span></div>
    <div class="kpi"><b>${tot?Math.round(ev/tot*100):0} %</b><span>casillas evaluadas</span></div>
    <div class="kpi"><b style="color:${alerts.length?'var(--l1)':'inherit'}">${Object.keys(byAl).length}</b><span>alumnos con alertas</span></div>
  </div>
  <div class="toolbar" style="margin-top:14px">
    <div class="legend">${[1,2,3,4].map(n=>`<span><i class="sw" style="background:${LVC[n]}"></i>${LVN[n]}</span>`).join('')}<span><i class="sw" style="background:var(--l0)"></i>Sin datos</span></div>
    <div class="seg" style="min-width:180px">${[['nivel','Nivel 1–4'],['nota','Nota 1–10']].map(([k,n])=>`<button data-modo="${k}" class="${UI.modo===k?'on':''}">${n}</button>`).join('')}</div>
  </div>
  <div class="hm-wrap"><table class="hm">
   <thead><tr><th class="nm ceh"></th>${ceRow}<th class="avg ceh"></th></tr>
   <tr><th class="nm">Alumno</th>${CRITS.map(x=>`<th title="${esc(x.t)}">${x.c}</th>`).join('')}<th class="avg">Media</th></tr></thead>
   <tbody>${als.map(al=>{const m=mediaAlumno(regs,al);return `<tr><td class="nm"><a href="#" data-verAl="${al.id}" style="color:inherit;text-decoration:none">${esc(al.nombre)}</a> <span class="curso">${al.curso}.º</span></td>${CRITS.map(x=>{if(!aplica(al,x.c))return `<td class="c"><div class="cell x">–</div></td>`;const v=nivelMedio(regs,al.id,x.c);return `<td class="c"><button class="cell ${v==null?'e':''}" style="${v!=null?'background:'+colorNv(v):''}" data-cell="${al.id}|${x.c}">${cellTxt(v)}</button></td>`}).join('')}<td class="avg" style="color:${m==null?'var(--muted)':m<5?'var(--l1)':'inherit'}">${m==null?'–':m.toFixed(1).replace('.',',')}</td></tr>`}).join('')}</tbody>
   <tfoot><tr><td class="nm">Clase</td>${CRITS.map(x=>{const vs=als.filter(al=>aplica(al,x.c)).map(al=>nivelMedio(regs,al.id,x.c)).filter(v=>v!=null);const v=vs.length?vs.reduce((a,b)=>a+b,0)/vs.length:null;return `<td><div class="cell ${v==null?'e':''}" style="height:26px;${v!=null?'background:'+colorNv(v):''}">${cellTxt(v)}</div></td>`}).join('')}<td class="avg">${media.length?(media.reduce((a,b)=>a+b,0)/media.length).toFixed(1).replace('.',','):'–'}</td></tr></tfoot>
  </table></div>
  <p class="small muted">La media es orientativa (todos los criterios pesan igual). La nota oficial la calcula Séneca con sus porcentajes.</p>
  <div class="card" style="margin-top:12px"><h3>Necesitan refuerzo <span class="muted small">(nivel medio inferior a 2)</span></h3>
   ${Object.values(byAl).length?Object.values(byAl).map(({al,l})=>`<div class="alert"><div class="name" style="flex:0 0 130px">${esc(al.nombre)}</div><div>${l.map(([c,v])=>`<span class="tag" style="background:${colorNv(v)}" title="${esc(CRIT[c].t)}">${c} ${esc(CRIT[c].t)}</span>`).join('')}</div></div>`).join(''):'<div class="muted small">Nadie por debajo del nivel 2 en este periodo.</div>'}
  </div>`;
}

/* ============ VISTA: ALUMNO ============ */
function vAlumno(){
  const als=alumnosOrd();
  if(!als.length)return `<h2>Alumno</h2><div class="card empty"><b>Sin alumnos</b>Añádelos en Ajustes.</div>`;
  if(!als.find(a=>a.id===UI.alumno))UI.alumno=als[0].id;
  const al=als.find(a=>a.id===UI.alumno);
  const regs=periodRegs();
  const crs=CRITS.filter(x=>aplica(al,x.c));
  const evs=crs.filter(x=>nivelMedio(regs,al.id,x.c)!=null).length;
  const m=mediaAlumno(regs,al);
  const obs=regs.filter(r=>r.t==='obs'&&r.a===al.id).sort((a,b)=>b.f.localeCompare(a.f));
  const nRegs=regs.filter(r=>r.t==='niv'&&r.a===al.id).length;
  const ceAvg=Object.keys(CES).map(ce=>{const vs=crs.filter(x=>x.ce==ce).map(x=>nivelMedio(regs,al.id,x.c)).filter(v=>v!=null);return [ce,vs.length?vs.reduce((a,b)=>a+b,0)/vs.length:null]});
  return `<h2>Alumno · ${TRI_N[UI.tri]}</h2>
  <div class="g2a" style="margin-bottom:12px"><select id="selAl" style="grid-column:1/-1">${als.map(a=>`<option value="${a.id}" ${a.id===al.id?'selected':''}>${esc(a.nombre)} (${a.curso}.º)</option>`).join('')}</select>
   <button class="btn" data-obs="${al.id}">+ Observación</button><button class="btn pri" data-act="informe">Copiar informe</button></div>
  <div class="kpis">
   <div class="kpi"><b style="color:${m!=null&&m<5?'var(--l1)':'inherit'}">${m==null?'–':m.toFixed(1).replace('.',',')}</b><span>media orientativa</span></div>
   <div class="kpi"><b>${evs}/${crs.length}</b><span>criterios evaluados</span></div>
   <div class="kpi"><b>${nRegs}</b><span>registros</span></div>
   <div class="kpi"><b>${obs.length}</b><span>observaciones</span></div>
  </div>
  <div class="grid2" style="margin-top:12px">
   <div class="card"><h3>Por competencia específica</h3><div class="bars">${ceAvg.map(([ce,v])=>`<div class="b"><span>CE${ce} ${CES[ce]}</span><div class="track"><div class="fill" style="width:${v==null?0:v/4*100}%;background:${colorNv(v)}"></div></div><b>${v==null?'–':v.toFixed(1).replace('.',',')}</b></div>`).join('')}</div></div>
   <div class="card"><h3>Criterios</h3>${crs.map(x=>{const v=nivelMedio(regs,al.id,x.c);return `<div class="crow"><span class="code">${x.c}</span><span>${esc(x.t)}</span><button class="pill" style="border:0;background:${colorNv(v)};color:${v==null?'var(--dim)':'var(--on-lv)'}" data-cell="${al.id}|${x.c}">${v==null?'·':aNota(v).toFixed(0)}</button></div>`}).join('')}</div>
  </div>
  <div class="card" style="margin-top:12px"><h3>Observaciones</h3>${obs.length?obs.map(o=>`<div class="obs"><div class="meta"><span>${fmtF(o.f)}${o.c?' · '+o.c+' '+esc(CRIT[o.c]?CRIT[o.c].t:''):''}</span><a href="#" data-del="${o.id}" style="color:var(--l1)">Borrar</a></div>${esc(o.txt)}</div>`).join(''):'<div class="muted small">Sin observaciones en este periodo.</div>'}</div>`;
}
function informeTexto(al){
  const regs=periodRegs();const crs=CRITS.filter(x=>aplica(al,x.c));
  const fuertes=crs.filter(x=>{const v=nivelMedio(regs,al.id,x.c);return v!=null&&v>=3});
  const mejorar=crs.filter(x=>{const v=nivelMedio(regs,al.id,x.c);return v!=null&&v<2.5});
  const obs=regs.filter(r=>r.t==='obs'&&r.a===al.id).sort((a,b)=>a.f.localeCompare(b.f));
  const per=UI.tri===3?'curso completo':['primer','segundo','tercer'][UI.tri]+' trimestre';
  let t=`Informe de ${areaN(UI.area)} · ${al.nombre} (${al.curso}.º) · ${per}\n\n`;
  t+=`Puntos fuertes:\n${fuertes.length?fuertes.map(x=>'· '+x.t+': '+x.r[Math.min(3,Math.round(nivelMedio(regs,al.id,x.c)))-1]).join('\n'):'· Aún no hay datos suficientes.'}\n\n`;
  t+=`Aspectos que mejorar:\n${mejorar.length?mejorar.map(x=>'· '+x.t+': '+x.r[2]).join('\n'):'· Ninguno destacable en este periodo.'}\n`;
  if(obs.length)t+=`\nObservaciones:\n${obs.map(o=>'· '+fmtF(o.f)+': '+o.txt).join('\n')}\n`;
  return t;
}

/* ============ VISTA: SÉNECA ============ */
function senecaData(curso){
  const regs=periodRegs();const als=alumnosOrd().filter(a=>a.curso===curso);
  const crs=CRITS.filter(x=>!(x.solo4&&curso==='3'));
  return {als,crs,rows:als.map(al=>crs.map(x=>{const v=nivelMedio(regs,al.id,x.c);return v==null?'':String(Math.round(aNota(v)))}))};
}
function vSeneca(){
  const {als,crs,rows}=senecaData(UI.curso);
  return `<h2>Traslado a Séneca · ${TRI_N[UI.tri]}</h2>
  ${CURRICULO[UI.area].nota?`<div class="note" style="margin-bottom:10px">${esc(CURRICULO[UI.area].nota)}</div>`:''}
  <div class="note">Nota de 1 a 10 por criterio, en el mismo orden que el cuaderno de Séneca. Introdúcelas allí y Séneca calculará la nota del área con sus porcentajes. Las casillas vacías son criterios sin evaluar en este periodo.</div>
  <div class="g2b" style="margin:12px 0"><div class="seg" style="grid-column:1/-1">${['3','4'].map(c=>`<button data-curso="${c}" class="${UI.curso===c?'on':''}">${c}.º</button>`).join('')}</div>
   <button class="btn" data-act="copySen">Copiar tabla</button><button class="btn pri" data-act="csvSen">Descargar CSV</button></div>
  ${als.length?`<div class="hm-wrap"><table class="sn"><thead><tr><th>Alumno</th>${crs.map(x=>`<th>${x.c}</th>`).join('')}</tr></thead><tbody>${als.map((al,i)=>`<tr><td>${esc(al.nombre)}</td>${rows[i].map(v=>`<td class="v" style="color:${v===''?'var(--dim)':+v<5?'var(--l1)':'inherit'}">${v||'·'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:`<div class="card empty">No hay alumnos de ${UI.curso}.º.</div>`}`;
}
function senecaTSV(sep){const {als,crs,rows}=senecaData(UI.curso);return [['Alumno',...crs.map(x=>x.c)].join(sep),...als.map((al,i)=>[al.nombre,...rows[i]].join(sep))].join('\n')}

/* ============ VISTA: AJUSTES ============ */
function vAjustes(){
  const als=alumnosOrd();const n=S.config.notas;
  return `<h2>Ajustes</h2>
  <div class="card stack"><h3>Alumnos</h3>
   <div class="note">Por protección de datos, usa <b>iniciales o un apodo</b>, no el nombre completo.</div>
   <form id="addAl" class="g2a"><input type="text" id="alNom" placeholder="Iniciales o apodo" maxlength="40"><div class="seg" id="alCur"><button type="button" data-c="3" class="on">3.º</button><button type="button" data-c="4">4.º</button></div><button class="btn pri">Añadir</button></form>
   <div>${als.map(a=>`<div class="al"><span class="name">${esc(a.nombre)}<span class="curso">${a.curso}.º</span></span><div class="btns"><button class="btn sm" data-edAl="${a.id}">Editar</button><button class="btn sm danger" data-rmAl="${a.id}">Quitar</button></div></div>`).join('')||'<div class="muted small">Aún no hay alumnos.</div>'}</div>
  </div>
  <div class="card stack" style="margin-top:12px"><h3>Conversión de nivel a nota</h3>
   <div class="g4">${[1,2,3,4].map(i=>`<div class="field"><label><span class="sw" style="background:${LVC[i]}"></span> Nivel ${i}</label><input type="number" min="1" max="10" step="0.5" data-nota="${i-1}" value="${n[i-1]}"></div>`).join('')}</div>
   <div class="small muted">Nivel 1 = Inicio, 2 = En proceso, 3 = Conseguido, 4 = Destacado. Las medias intermedias se interpolan: un 2,5 de media equivale a la nota a medio camino entre «En proceso» y «Conseguido».</div>
  </div>
  <div class="card stack" style="margin-top:12px"><h3>Fechas de los trimestres</h3>
   ${S.config.tri.map(([a,b],i)=>`<div class="g2t"><b>${TRI_N[i]}</b><div class="field"><label>Inicio</label><input type="date" data-tri="${i}|0" value="${a}"></div><div class="field"><label>Fin</label><input type="date" data-tri="${i}|1" value="${b}"></div></div>`).join('')}
  </div>
  <div class="card stack" style="margin-top:12px"><h3>Sincronización con Google</h3>
   ${Sync.ok()?`<div class="small">Conectado a tu hoja de Google. ${OPS.length?`<b>${OPS.length} cambios pendientes de subir.</b>`:'Todo está subido.'}</div>${Sync.lastError?`<div class="small" style="color:var(--l1)">Último error: ${esc(Sync.lastError)}</div>`:''}<div class="g2b"><button class="btn" data-act="syncNow">Sincronizar ahora</button><button class="btn danger" data-act="syncOff">Desconectar</button></div>`
   :`<div class="small muted">Pega la URL de la aplicación web y la clave que te dio el script de tu hoja (cuenta de educaand). Así verás los mismos datos en el móvil y en el PC.</div>
   <div class="field"><label>URL de la aplicación web</label><input type="text" id="syUrl" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off"></div>
   <div class="field"><label>Clave</label><input type="text" id="syKey" placeholder="Clave del script" autocomplete="off"></div>
   <button class="btn pri" data-act="syncSave">Conectar</button>`}
  </div>
  <div class="card stack" style="margin-top:12px"><h3>Copia de seguridad</h3>
   <div class="g2b"><button class="btn" data-act="backup">Descargar copia</button><label class="btn" style="text-align:center">Restaurar copia<input type="file" id="restore" accept=".json,application/json" hidden></label><button class="btn" data-act="demo">Cargar ejemplo</button><button class="btn" data-act="quitarDemo">Quitar ejemplo</button></div>
   <button class="btn danger" data-act="wipe">Borrar todo</button>
   <div class="small muted">Descarga una copia al final de cada trimestre. «Cargar ejemplo» añade 8 alumnos ficticios, marcados con «(ej.)», y «Quitar ejemplo» los borra con sus registros.</div>
  </div>
  <div class="card stack" style="margin-top:12px"><h3>Guía rápida</h3>
   <div class="small" style="line-height:1.55">
   <b>1. Evaluar.</b> Elige la fecha y el criterio, lee la rúbrica y toca el nivel de cada alumno (1 Inicio, 2 En proceso, 3 Conseguido, 4 Destacado). Si vuelves a tocar el mismo nivel, se borra. El bocadillo añade una observación.<br>
   <b>2. Clase.</b> El mapa de calor muestra el nivel medio de cada alumno en cada criterio del periodo elegido arriba. Toca una casilla para ver o borrar sus registros.<br>
   <b>3. Alumno.</b> Su perfil por competencias y criterios, sus observaciones y un informe en texto para copiar.<br>
   <b>4. Séneca.</b> La nota de 1 a 10 por criterio, en el orden del cuaderno de Séneca, para trasladarla a mano.<br>
   <b>5. Instalar.</b> En Android, menú de Chrome → «Añadir a pantalla de inicio». En iPhone, Compartir → «Añadir a pantalla de inicio». La app se actualiza sola.
   </div>
   <div class="small muted" style="text-align:center">Evalúapp · versión ${APP_VERSION}</div>
  </div>`;
}

/* ============ RENDER + EVENTOS ============ */

/* ============ PROGRAMACIÓN ============ */
const INSTR=['Observación directa','Rúbrica','Cuaderno del alumnado','Prueba escrita','Prueba oral','Producto final','Portfolio','Lista de cotejo','Autoevaluación','Coevaluación'];
const DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const may1=t=>t.replace(/^./,c=>c.toUpperCase());
const fLarga=f=>{const d=new Date(f+'T12:00:00');return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`};
const addDias=(f,n)=>{const d=new Date(f+'T12:00:00');d.setDate(d.getDate()+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const lunesDe=f=>{const d=new Date(f+'T12:00:00');const w=d.getDay()||7;return addDias(f,1-w)};
const areaN=id=>id&&CURRICULO[id]?CURRICULO[id].corto:'';
const CURSO_N={'3':'3.º','4':'4.º',ambos:'3.º y 4.º'};
const progList=(t,ar)=>Object.values(S.prog).filter(p=>p.t===t&&(!ar||p.ar===ar));
const udCurso=u=>u.d.curso||'ambos';
const udPara=(u,c)=>!c||c==='todos'||udCurso(u)==='ambos'||udCurso(u)===c;
const udsDe=(ar,c)=>progList('ud',ar).filter(u=>udPara(u,c)).sort((a,b)=>((a.d.tri??0)-(b.d.tri??0))||String(a.d.ini||'').localeCompare(String(b.d.ini||''))||String(a.d.titulo||'').localeCompare(String(b.d.titulo||''),'es'));
function saveProg(p){S.prog=Object.assign({},S.prog,{[p.id]:p});enqueue({op:'up',r:toWire(p)})}
function delProg(id){dropReg(id);enqueue({op:'del',id})}
const actKey=(ar,c)=>`${ar}-${c}`;
const udActualDe=(ar,c)=>{const id=(S.config.udActual||{})[actKey(ar,c)];return id&&S.prog[id]?S.prog[id]:null};
const udEstado=u=>['3','4'].some(c=>(S.config.udActual||{})[actKey(u.ar,c)]===u.id)?'curso':u.d.hecha?'hecha':'pend';
const EST_N={pend:'Pendiente',curso:'En curso',hecha:'Impartida'};
const cursosDe=c=>c==='ambos'?['3','4']:[c];
function sesUsa(p,udId){const d=p.d||{};return d.ud===udId||(d.c3&&d.c3.ud===udId)||(d.c4&&d.c4.ud===udId)}
const sesDiario=udId=>progList('ses').filter(p=>sesUsa(p,udId)&&p.f<=today()).length;
UI.ptab='uds';UI.pfecha=today();UI.soloUd=true;UI.pcurso='todos';

function cursoSeg(){return `<div class="seg" style="margin-bottom:12px">${[['todos','Ambos cursos'],['3','3.º'],['4','4.º']].map(([k,n])=>`<button data-pcurso="${k}" class="${UI.pcurso===k?'on':''}">${n}</button>`).join('')}</div>`}
function vProg(){
  const tabs=[['uds','Unidades'],['tri','Trimestres'],['dia','Diario'],['hor','Horario']];
  const body={uds:vUds,tri:vTris,dia:vDiario,hor:vHorario}[UI.ptab]();
  return `<h2>Programación</h2><div class="seg" style="margin-bottom:12px">${tabs.map(([k,n])=>`<button data-ptab="${k}" class="${UI.ptab===k?'on':''}">${n}</button>`).join('')}</div>${['uds','tri'].includes(UI.ptab)?cursoSeg():''}${body}`;
}
function udCard(u){
  const e=udEstado(u),nc=(u.d.crits||[]).length,ds=sesDiario(u.id);
  return `<button class="ucard" data-ud="${u.id}"><span class="utag ${u.d.tipo==='SdA'?'sda':''}">${u.d.tipo==='SdA'?'SdA':'UD'}</span><span class="ubody"><b>${esc(u.d.titulo||'Sin título')}</b><span>${CURSO_N[udCurso(u)]} · ${u.d.ses||0} sesiones · ${nc} ${nc===1?'criterio':'criterios'}${ds?` · ${ds} en el diario`:''}</span></span><span class="uest ${e}">${EST_N[e]}</span></button>`;
}
function vUds(){
  const us=udsDe(UI.area,UI.pcurso);
  const btn=`<button class="btn pri" data-act="nuevaUd" style="width:100%;margin-bottom:14px">+ Nueva unidad o situación de aprendizaje</button>`;
  if(!us.length)return btn+`<div class="card empty"><b>Aún no hay unidades de ${esc(areaN(UI.area))}${UI.pcurso!=='todos'?' para '+CURSO_N[UI.pcurso]:''}</b>Crea la primera con el botón de arriba. Podrás asociarle criterios, saberes, actividades e instrumentos.</div>`;
  return btn+[0,1,2].map(t=>{const l=us.filter(u=>(u.d.tri??0)===t);const ses=l.reduce((a,u)=>a+(+u.d.ses||0),0);
    return `<div class="card" style="margin-bottom:12px"><h3 style="display:flex;justify-content:space-between;gap:10px"><span>${TRI_N[t].replace('trim.','trimestre')}</span><span class="muted small">${l.length} ${l.length===1?'unidad':'unidades'} · ${ses} sesiones</span></h3>${l.length?l.map(udCard).join(''):'<div class="muted small">Sin unidades en este trimestre.</div>'}</div>`}).join('');
}
function coberturaCard(c){
  const us=udsDe(UI.area,c);const crs=CRITS.filter(x=>!(x.solo4&&c==='3'));
  const usados=new Set(us.flatMap(u=>u.d.crits||[]));const faltan=crs.filter(x=>!usados.has(x.c));
  return `<div class="card"><h3>Criterios programados en ${CURSO_N[c]} · ${crs.length-faltan.length} de ${crs.length}</h3>
   <div class="cov">${crs.map(x=>`<span class="covc ${usados.has(x.c)?'on':''}" title="${esc(x.t)}">${x.c}</span>`).join('')}</div>
   ${faltan.length?`<p class="small muted" style="margin:10px 0 0">Sin asociar a ninguna unidad: ${faltan.map(x=>`${x.c} ${esc(x.t)}`).join(' · ')}.</p>`:'<p class="small muted" style="margin:10px 0 0">Todos los criterios están en alguna unidad.</p>'}</div>`;
}
function vTris(){
  const us=udsDe(UI.area,UI.pcurso);
  return `<div class="tris">${[0,1,2].map(t=>{const l=us.filter(u=>(u.d.tri??0)===t);const ses=l.reduce((a,u)=>a+(+u.d.ses||0),0);const hechas=l.filter(u=>u.d.hecha).length;const pct=l.length?Math.round(hechas/l.length*100):0;
    return `<div class="card"><div class="trit">${TRI_N[t].replace('trim.','trimestre')}</div><div class="trinum"><b>${l.length}</b> ${l.length===1?'unidad':'unidades'} · <b>${ses}</b> sesiones</div><div class="prog"><i style="width:${pct}%"></i></div><div class="small muted" style="margin:6px 0 10px">${hechas} de ${l.length} impartidas</div>${l.map(u=>{const e=udEstado(u);return `<button class="tline" data-ud="${u.id}"><span class="dotst ${e}"></span><span>${esc(u.d.titulo||'Sin título')}</span><span class="muted">${UI.pcurso==='todos'?CURSO_N[udCurso(u)]+' · ':''}${u.d.ses||0} s.</span></button>`}).join('')||'<div class="muted small">Sin unidades.</div>'}</div>`}).join('')}</div>
  <div class="grid2" style="margin-top:12px">${(UI.pcurso==='todos'?['3','4']:[UI.pcurso]).map(coberturaCard).join('')}</div>`;
}
function udModal(id){
  const ex=id?S.prog[id]:null;
  const u=ex?JSON.parse(JSON.stringify(ex)):{id:'ud-'+uid(),t:'ud',ar:UI.area,f:'',d:{tipo:'UD',curso:UI.pcurso==='todos'?'ambos':UI.pcurso,titulo:'',tri:UI.tri<3?UI.tri:0,ses:8,ini:'',fin:'',desc:'',crits:[],sab:[],act:'',inst:[],hecha:false}};
  u.d.curso=u.d.curso||'ambos';
  const est=ex?udEstado(ex):'pend';
  const chips=(list,sel,attr)=>list.map(([v,l,dis])=>`<button type="button" class="tchip ${sel.includes(v)?'on':''}" data-${attr}="${esc(v)}" ${dis?'disabled':''}>${l}</button>`).join('');
  modal(`<h3>${ex?'Editar':'Nueva'} · ${esc(areaN(u.ar))}</h3><div class="stack">
   <div class="seg" id="udTipo"><button data-v="UD" class="${u.d.tipo==='UD'?'on':''}">Unidad didáctica</button><button data-v="SdA" class="${u.d.tipo==='SdA'?'on':''}">Situación de aprendizaje</button></div>
   <div class="field"><label>Curso</label><div class="seg" id="udCur">${[['3','3.º'],['4','4.º'],['ambos','Ambos']].map(([k,n])=>`<button data-v="${k}" class="${u.d.curso===k?'on':''}">${n}</button>`).join('')}</div></div>
   <div class="field"><label>Título</label><input type="text" id="udTit" value="${esc(u.d.titulo)}" maxlength="120" placeholder="Por ejemplo: Somos comerciantes"></div>
   <div class="field"><label>Trimestre</label><div class="seg" id="udTri">${[0,1,2].map(t=>`<button data-v="${t}" class="${(u.d.tri??0)===t?'on':''}">${TRI_N[t]}</button>`).join('')}</div></div>
   <div class="g3"><div class="field"><label>Sesiones</label><input type="number" id="udSes" min="1" max="99" value="${u.d.ses||''}"></div><div class="field"><label>Inicio</label><input type="date" id="udIni" value="${u.d.ini||''}"></div><div class="field"><label>Fin</label><input type="date" id="udFin" value="${u.d.fin||''}"></div></div>
   <div class="field"><label>Descripción o producto final</label><textarea id="udDesc" style="min-height:80px" placeholder="Reto, contexto o producto que elaborará el alumnado">${esc(u.d.desc)}</textarea></div>
   <div class="field"><label>Criterios de evaluación</label><div class="tchips" id="udCrit">${chips(CRITS.map(x=>[x.c,`<b>${x.c}</b> ${esc(x.t)}${x.solo4?' (solo 4.º)':''}`]),u.d.crits||[],'c')}</div></div>
   <div class="field"><label>Saberes básicos</label>${Object.entries(BLOQUES).map(([b,bn])=>{const l=SABERES.filter(([c])=>c.split('.')[2]===b||c.startsWith('EP.'+b));return l.length?`<div class="small muted" style="margin:6px 0 4px">${b}. ${esc(bn)}</div><div class="tchips" data-grp="sab">${chips(l.map(([c,t])=>[c,esc(t)]),u.d.sab||[],'s')}</div>`:''}).join('')}</div>
   <div class="field"><label>Actividades y tareas</label><textarea id="udAct" placeholder="Una por línea">${esc(u.d.act)}</textarea></div>
   <div class="field"><label>Instrumentos de evaluación</label><div class="tchips" id="udInst">${chips(INSTR.map(x=>[x,esc(x)]),u.d.inst||[],'i')}</div></div>
   <div class="field"><label>Estado</label><div class="seg" id="udEst">${Object.entries(EST_N).map(([k,n])=>`<button data-v="${k}" class="${est===k?'on':''}">${n}</button>`).join('')}</div><div class="small muted">«En curso» la convierte en la unidad actual de ${'su curso'} y filtra los criterios en Evaluar.</div></div>
  </div><div class="btns" style="justify-content:space-between;margin-top:16px">${ex?'<button class="btn danger" id="udDel">Eliminar</button>':'<span></span>'}<div class="btns"><button class="btn" data-close>Cancelar</button><button class="btn pri" id="udOk">Guardar</button></div></div>`,(m,close)=>{
    m.addEventListener('click',e=>{
      const sb=e.target.closest('.seg button');if(sb){e.preventDefault();sb.parentElement.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===sb));return}
      const tc=e.target.closest('.tchip');if(tc&&!tc.disabled){e.preventDefault();tc.classList.toggle('on');return}
    });
    const v=sel=>m.querySelector(sel+' .on')?.dataset.v;
    const quitarActual=(act,id)=>{Object.keys(act).forEach(k=>{if(act[k]===id)act[k]=''})};
    if(m.querySelector('#udDel'))m.querySelector('#udDel').onclick=()=>{confirmar('¿Eliminar esta unidad? Las sesiones del diario que la usen se quedarán sin unidad.','Eliminar',()=>{delProg(u.id);const act=Object.assign({},S.config.udActual||{});quitarActual(act,u.id);S.config.udActual=act;saveConfig();close();render();toast('Unidad eliminada')})};
    m.querySelector('#udOk').onclick=()=>{
      const tit=m.querySelector('#udTit').value.trim();if(!tit){toast('Ponle un título');m.querySelector('#udTit').focus();return}
      Object.assign(u.d,{tipo:v('#udTipo')||'UD',curso:v('#udCur')||'ambos',titulo:tit,tri:+(v('#udTri')||0),ses:+m.querySelector('#udSes').value||0,ini:m.querySelector('#udIni').value,fin:m.querySelector('#udFin').value,desc:m.querySelector('#udDesc').value.trim(),act:m.querySelector('#udAct').value.trim(),
        crits:[...m.querySelectorAll('#udCrit .tchip.on')].map(b=>b.dataset.c),sab:[...m.querySelectorAll('[data-grp="sab"] .tchip.on')].map(b=>b.dataset.s),inst:[...m.querySelectorAll('#udInst .tchip.on')].map(b=>b.dataset.i)});
      const ne=v('#udEst')||'pend';u.d.hecha=ne==='hecha';
      saveProg(u);
      const act=Object.assign({},S.config.udActual||{});const antes=JSON.stringify(act);
      quitarActual(act,u.id);
      if(ne==='curso')cursosDe(u.d.curso).forEach(c=>act[actKey(u.ar,c)]=u.id);
      if(JSON.stringify(act)!==antes){S.config.udActual=act;saveConfig()}
      close();render();toast('Unidad guardada');
    };
  });
}
/* ---- horario ---- */
function franjasDe(f){const w=new Date(f+'T12:00:00').getDay();return (S.config.horario||{})[w]||[]}
function vHorario(){
  const H=S.config.horario||{};
  const opts=sel=>Object.entries(CURRICULO).map(([id,a])=>`<option value="${id}" ${sel===id?'selected':''}>${esc(a.corto)}</option>`).join('')+`<option value="otro" ${sel==='otro'?'selected':''}>Otra (recreo, inglés…)</option>`;
  return `<div class="note" style="margin-bottom:12px">Tu horario semanal. El diario lo usa para preparar cada día y el plan para quien te sustituya.</div>`+[1,2,3,4,5].map(w=>`<div class="card" style="margin-bottom:12px"><h3>${may1(DIAS[w])}</h3>${(H[w]||[]).map((fr,i)=>`<div class="frow"><input type="time" data-hw="${w}" data-hi="${i}" data-hk="ini" value="${fr.ini||''}"><input type="time" data-hw="${w}" data-hi="${i}" data-hk="fin" value="${fr.fin||''}"><select data-hw="${w}" data-hi="${i}" data-hk="ar">${opts(fr.ar)}</select>${fr.ar==='otro'?`<input type="text" data-hw="${w}" data-hi="${i}" data-hk="lab" value="${esc(fr.lab||'')}" placeholder="Qué es" class="flab">`:''}<button class="ic" data-hdel="${w}|${i}" aria-label="Quitar">✕</button></div>`).join('')||'<div class="muted small" style="margin-bottom:8px">Sin franjas.</div>'}<div class="g2b" style="margin-top:8px"><button class="btn sm" data-hadd="${w}">+ Añadir franja</button>${w>1?`<button class="btn sm" data-hcopy="${w}">Copiar del ${DIAS[w-1]}</button>`:'<span></span>'}</div></div>`).join('')+
  `<div class="card stack"><h3>Indicaciones generales para sustitutos</h3><textarea id="avisoSust" placeholder="Rutinas del aula, dónde están los materiales, normas, a quién acudir…">${esc(S.config.avisoSust||'')}</textarea><div class="small muted">Saldrá al principio de cada plan exportado. No pongas aquí datos personales ni de salud del alumnado.</div></div>`;
}
function setHorario(fn){const H=JSON.parse(JSON.stringify(S.config.horario||{}));[1,2,3,4,5].forEach(w=>H[w]=H[w]||[]);fn(H);S.config.horario=H;saveConfig();render()}
/* ---- diario ---- */
const sesId=(f,i)=>`ses-${f}-${i}`;
function sesDatos(p){const d=p?JSON.parse(JSON.stringify(p.d)):{};
  if(d.junto===undefined){d.junto=!d.c3&&!d.c4&&!!(d.ud||d.act||d.mat)?true:(d.junto||false)}
  if(d.junto&&!d.c3&&(d.ud||d.act||d.mat)){d.c3={ud:d.ud||'',act:d.act||'',mat:d.mat||''}}
  d.c3=d.c3||{};d.c4=d.c4||{};return d}
function bloqueCurso(i,c,d,ar,lab){
  const x=d['c'+c]||{};const lc=c==='j'?'ambos':c;const key=c==='j'?'c3':'c'+c;const y=d[key]||{};
  return `<div class="cblk">${lab?`<div class="clab">${lab}</div>`:''}<select data-sf="${i}" data-sk="${key}.ud"><option value="">Sin unidad</option>${udsDe(ar,lc==='ambos'?'todos':lc).map(u=>`<option value="${u.id}" ${y.ud===u.id?'selected':''}>${esc(u.d.titulo)}${lc==='ambos'?' ('+CURSO_N[udCurso(u)]+')':''}</option>`).join('')}</select>
   <textarea data-sf="${i}" data-sk="${key}.act" placeholder="Qué se va a hacer (página, actividad, explicación…)" style="min-height:76px">${esc(y.act||'')}</textarea>
   <input type="text" data-sf="${i}" data-sk="${key}.mat" placeholder="Materiales" value="${esc(y.mat||'')}"></div>`;
}
function vDiario(){
  const f=UI.pfecha,frs=franjasDe(f),w=new Date(f+'T12:00:00').getDay();
  const nav=`<div class="daynav"><button class="iconbtn" data-pday="-1" aria-label="Día anterior" style="transform:rotate(180deg)">${ICONS.chev}</button><div><input type="date" id="pfecha" value="${f}"><div class="small muted" style="text-align:center;margin-top:4px">${may1(fLarga(f))}</div></div><button class="iconbtn" data-pday="1" aria-label="Día siguiente">${ICONS.chev}</button></div>`;
  const exp=`<div class="g2b" style="margin:12px 0"><button class="btn" data-act="expDia">Exportar este día</button><button class="btn pri" data-act="expSem">Exportar la semana</button></div>`;
  if(w===0||w===6)return nav+`<div class="card empty"><b>Fin de semana</b>Elige un día lectivo.</div>`;
  if(!frs.length)return nav+`<div class="card empty"><b>No hay horario para este día</b>Configura tu horario semanal para preparar el diario.<div style="margin-top:12px"><button class="btn pri" data-ptab="hor">Configurar horario</button></div></div>`;
  const notas=S.prog[sesId(f,'n')];
  return nav+exp+frs.map((fr,i)=>{
    const p=S.prog[sesId(f,i)];const esArea=!!CURRICULO[fr.ar];const d=sesDatos(p);
    const tit=esArea?areaN(fr.ar):(fr.lab||'Otra actividad');
    return `<div class="card sescard" style="--sc:var(--t-${{mat:'evaluar',len:'alumno',cmn:'clase',pla:'seneca'}[fr.ar]||'ajustes'})"><div class="seshead"><span class="hora">${esc(fr.ini||'')}–${esc(fr.fin||'')}</span><b>${esc(tit)}</b></div>
     ${esArea?`<button class="junto ${d.junto?'on':''}" data-junto="${i}"><span class="tg"></span>Lo mismo para 3.º y 4.º</button>
      ${d.junto?bloqueCurso(i,'j',d,fr.ar,''):bloqueCurso(i,'3',d,fr.ar,'3.º')+bloqueCurso(i,'4',d,fr.ar,'4.º')}`
     :`<input type="text" data-sf="${i}" data-sk="act" placeholder="Indicaciones (opcional)" value="${esc((p&&p.d.act)||'')}" style="margin-top:10px">`}</div>`}).join('')+
   `<div class="card stack"><h3>Avisos de este día</h3><textarea data-sf="n" data-sk="notas" placeholder="Salidas, cambios, quién recoge a quién…">${esc(notas?notas.d.notas:'')}</textarea></div>`;
}
function guardarSesion(i,k,val){
  const f=UI.pfecha,id=sesId(f,i),fr=i==='n'?null:franjasDe(f)[+i];
  const p=S.prog[id]?JSON.parse(JSON.stringify(S.prog[id])):{id,t:'ses',ar:fr?(CURRICULO[fr.ar]?fr.ar:'otro'):'otro',f,d:{}};
  if(fr){p.d.ini=fr.ini;p.d.fin=fr.fin;p.d.far=fr.ar;p.d.lab=fr.lab||''}
  if(fr&&CURRICULO[fr.ar]){const d=sesDatos(p);Object.assign(p.d,{junto:d.junto,c3:d.c3,c4:d.c4});delete p.d.ud;delete p.d.act;delete p.d.mat}
  if(k.includes('.')){const [a,b]=k.split('.');p.d[a]=Object.assign({},p.d[a]||{},{[b]:val})}else p.d[k]=val;
  saveProg(p);
}
function toggleJunto(i){
  const f=UI.pfecha,id=sesId(f,i),fr=franjasDe(f)[+i];
  const p=S.prog[id]?JSON.parse(JSON.stringify(S.prog[id])):{id,t:'ses',ar:CURRICULO[fr.ar]?fr.ar:'otro',f,d:{ini:fr.ini,fin:fr.fin,far:fr.ar}};
  const d=sesDatos(p);p.d=Object.assign(p.d,{junto:!d.junto,c3:d.c3,c4:d.c4});delete p.d.ud;delete p.d.act;delete p.d.mat;
  saveProg(p);render();
}
/* ---- exportar plan ---- */
function bloquesPlan(fechas){
  const B=[{k:'h1',t:'Plan de clase · 3.º y 4.º'},{k:'p',t:fechas.length>1?`Semana del ${fLarga(fechas[0])} al ${fLarga(fechas[fechas.length-1])}`:may1(fLarga(fechas[0]))}];
  if(S.config.avisoSust)B.push({k:'h2',t:'Indicaciones generales'},...S.config.avisoSust.split('\n').filter(x=>x.trim()).map(t=>({k:'p',t})));
  const parte=(y,lab)=>{const u=y.ud&&S.prog[y.ud]?S.prog[y.ud].d:null;
    if(lab||u)B.push({k:'p',t:`${lab?lab+' — ':''}${u?`${u.tipo==='SdA'?'Situación de aprendizaje':'Unidad'}: ${u.titulo}`:'Sin unidad'}`});
    if(y.act)y.act.split('\n').filter(x=>x.trim()).forEach(t=>B.push({k:'li',t}));else B.push({k:'p',t:'Sin indicaciones.'});
    if(y.mat)B.push({k:'p',t:'Materiales: '+y.mat})};
  fechas.forEach(f=>{
    const frs=franjasDe(f);if(!frs.length)return;
    B.push({k:'h2',t:may1(fLarga(f))});
    const n=S.prog[sesId(f,'n')];if(n&&n.d.notas)B.push({k:'p',t:'Avisos: '+n.d.notas});
    frs.forEach((fr,i)=>{
      const p=S.prog[sesId(f,i)];const esArea=!!CURRICULO[fr.ar];
      B.push({k:'h3',t:`${fr.ini||''}–${fr.fin||''} · ${esArea?areaN(fr.ar):(fr.lab||'Otra actividad')}`});
      if(!esArea){if(p&&p.d.act)B.push({k:'p',t:p.d.act});return}
      const d=sesDatos(p);
      const vacio=y=>!y||(!y.ud&&!y.act&&!y.mat);
      if(d.junto?vacio(d.c3):(vacio(d.c3)&&vacio(d.c4))){B.push({k:'p',t:'Sin indicaciones.'});return}
      if(d.junto)parte(d.c3,'3.º y 4.º');else{parte(d.c3,'3.º');parte(d.c4,'4.º')}
    });
  });
  return B;
}
function fechasExport(sem){if(!sem)return [UI.pfecha];const l=lunesDe(UI.pfecha);return [0,1,2,3,4].map(n=>addDias(l,n))}
function exportModal(sem){
  const fechas=fechasExport(sem);
  modal(`<h3>Exportar ${sem?'la semana':'este día'}</h3><p class="small muted" style="margin-top:-6px">${sem?`Del ${fLarga(fechas[0])} al ${fLarga(fechas[4])}`:may1(fLarga(fechas[0]))}</p>
   <button class="opt" id="exPdf"><div><b>PDF</b><span>Se abre la ventana de imprimir: elige «Guardar como PDF».</span></div></button>
   <button class="opt" id="exDoc" ${Sync.ok()?'':'disabled'}><div><b>Documento de Google</b><span>${Sync.ok()?'Se crea en tu Drive de educaand, listo para compartir.':'Necesita la hoja de Google conectada.'}</span></div></button>
   <div id="exRes"></div><div class="btns" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-close>Cerrar</button></div>`,(m,close)=>{
    m.querySelector('#exPdf').onclick=()=>{close();imprimir(bloquesPlan(fechas))};
    m.querySelector('#exDoc').onclick=async()=>{const b=m.querySelector('#exDoc');b.disabled=true;b.querySelector('span').textContent='Creando el documento…';
      try{const j=await Sync.call({action:'doc',titulo:`Plan de clase · ${sem?'semana del '+fmtF(fechas[0]):fmtF(fechas[0])}`,bloques:bloquesPlan(fechas)});
        if(!j.url)throw new Error('Actualiza el script de la hoja para poder crear documentos.');
        m.querySelector('#exRes').innerHTML=`<a class="btn pri" style="display:block;text-align:center;margin-top:12px;text-decoration:none" href="${esc(j.url)}" target="_blank" rel="noopener">Abrir el documento</a>`;b.querySelector('span').textContent='Documento creado en tu Drive.'}
      catch(e){b.disabled=false;b.querySelector('span').textContent=/desconocida/.test(e.message)?'Actualiza el script de la hoja (versión 1.2) para crear documentos.':e.message}};
  });
}
function imprimir(B){
  let el=document.getElementById('print');if(!el){el=document.createElement('div');el.id='print';document.body.appendChild(el)}
  let html='',ul=false;
  B.forEach(b=>{if(b.k==='li'){if(!ul){html+='<ul>';ul=true}html+=`<li>${esc(b.t)}</li>`;return}if(ul){html+='</ul>';ul=false}html+=`<${b.k==='p'?'p':b.k}>${esc(b.t)}</${b.k==='p'?'p':b.k}>`});
  if(ul)html+='</ul>';
  el.innerHTML=html;document.body.classList.add('printing');
  const fin=()=>{document.body.classList.remove('printing');window.removeEventListener('afterprint',fin)};
  window.addEventListener('afterprint',fin);setTimeout(()=>{try{window.print()}catch(e){toast('Tu navegador no permite imprimir desde aquí')}},60);
}
/* ---- Evaluar: unidad en curso ---- */
function udsEnCurso(){const cs=UI.filtro==='todos'?['3','4']:[UI.filtro];const l=[];cs.forEach(c=>{const u=udActualDe(UI.area,c);if(u&&!l.includes(u))l.push(u)});return l}
function critsVisibles(){const us=udsEnCurso();const set=new Set(us.flatMap(u=>u.d.crits||[]));if(UI.soloUd&&set.size){const l=CRITS.filter(x=>set.has(x.c));if(l.length)return l}return CRITS}
const VIEWS={inicio:vInicio,prog:vProg,evaluar:vEvaluar,clase:vClase,alumno:vAlumno,seneca:vSeneca,ajustes:vAjustes};
/* ===== v1.3 · interfaz al estilo del diseño de Esteban ===== */
Object.assign(ICONS,{
 menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/></svg>',
 bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
 down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
 layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 17.5 9 5 9-5" opacity=".6"/></svg>',
 target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12 20 4M16 4h4v4"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
 doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
 copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2"/></svg>',
 dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>',
 cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5Z"/><path d="m9.5 13.5 2 2 3.5-3.5"/></svg>',
 alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2.5 20h19Z"/><path d="M12 10v4.5M12 17.5h.01"/></svg>',
 chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20V12M10 20V6M15 20v-9M20 20V4"/></svg>',
 pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/></svg>',
 grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
 /* Séneca: icono propio (traslado de notas), no el emblema de la Junta */
 seneca:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4" width="11" height="15" rx="2"/><path d="M7 9h4M7 12.5h4"/><path d="M13 15.5h7.5M17.5 12.5l3 3-3 3"/></svg>',
 avisos:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/></svg>'
});
ICONS.diario=ICONS.cal;
SECS.avisos={n:'Avisos',sub:'Lo que requiere tu atención'};
SECS.ajustes={n:'Ajustes',sub:'Perfil, datos y copias'};
const NAV13=['inicio','evaluar','clase','alumno','seneca','prog','avisos','ajustes'];
const TILESUB={evaluar:'Criterios, rúbricas y calificaciones',clase:'Grupo, mapa de calor y refuerzo',alumno:'Ficha, evaluación y seguimiento',seneca:'Traslado de notas y exportación',prog:'Unidades, situaciones de aprendizaje y diario',ajustes:'Personalización, copias y datos'};
const triTxt=i=>i===3?'curso completo':TRI_N[i].replace('trim.','trimestre');
UI.evDet=false;UI.evTab='crit';UI.clTab='mapa';UI.alTab='ficha';UI.ptab='menu';UI.utri='todas';
function ctxRow(opt={}){
  const parts=[esc(areaN(UI.area))];
  if(opt.curso!==false)parts.push(UI.filtro==='todos'?'3.º y 4.º':UI.filtro+'.º');
  if(opt.tri!==false)parts.push(triTxt(UI.tri));
  return `<button class="ctxrow" data-act="ctx"><span>${parts.join(' · ')}</span>${ICONS.down}</button>`;
}
function ctxModal(){
  modal(`<h3>Qué quieres ver</h3>
   <div class="field"><label>Área</label>${AREAS.map(a=>`<button class="opt ${a.id===UI.area?'on':''}" data-carea="${a.id}"><div><b>${esc(a.n)}</b><span>${a.ciclo}</span></div><span class="badge">${a.id===UI.area?'Activa':''}</span></button>`).join('')}</div>
   <div class="field" style="margin-top:14px"><label>Curso</label><div class="seg" id="cCur">${[['todos','3.º y 4.º'],['3','Solo 3.º'],['4','Solo 4.º']].map(([k,n])=>`<button data-v="${k}" class="${UI.filtro===k?'on':''}">${n}</button>`).join('')}</div></div>
   <div class="field" style="margin-top:14px"><label>Periodo</label><div class="seg" id="cTri">${TRI_N.map((n,i)=>`<button data-v="${i}" class="${UI.tri===i?'on':''}">${n}</button>`).join('')}</div></div>
   <div class="btns" style="justify-content:flex-end;margin-top:16px"><button class="btn pri" data-close>Hecho</button></div>`,(m,close)=>{
    m.addEventListener('click',e=>{
      const a=e.target.closest('[data-carea]');if(a){UI.area=a.dataset.carea;setArea(UI.area);try{localStorage.setItem('evaluapp-area',UI.area)}catch(_){}m.querySelectorAll('[data-carea]').forEach(b=>{b.classList.toggle('on',b===a);b.querySelector('.badge').textContent=b===a?'Activa':''});render();return}
      const sb=e.target.closest('.seg button');if(sb){sb.parentElement.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===sb));if(sb.parentElement.id==='cCur'){UI.filtro=sb.dataset.v;UI.pcurso=sb.dataset.v}else UI.tri=+sb.dataset.v;render()}
    });
  });
}
function lrow(icon,color,title,sub,attrs,right=''){return `<button class="lrow" ${attrs}><span class="lic" style="--c:${color}">${icon}</span><span class="lt"><b>${title}</b>${sub?`<span>${sub}</span>`:''}</span>${right}<span class="chv">${ICONS.chev}</span></button>`}
const pct=p=>`<span class="pct ${p>=75?'hi':p>=40?'mid':p>0?'lo':'zero'}">${p} %</span>`;
function pills(attr,cur,items){return `<div class="pills">${items.map(([k,n])=>`<button data-${attr}="${k}" class="${cur===k?'on':''}">${n}</button>`).join('')}</div>`}
const inic=n=>(String(n).replace(/[^\p{L}]/gu,'').slice(0,2)||'?').toUpperCase();
const alumnosFiltro=()=>alumnosOrd().filter(a=>UI.filtro==='todos'||a.curso===UI.filtro);

function renderChrome(){
  const k=UI.tab,sec=SECS[k]||SECS.inicio;
  const root=document.documentElement.style;root.setProperty('--acc',`var(--a-${k})`);root.setProperty('--sec',`var(--s-${k})`);
  setHTML('side',`<div class="brand"><div class="logo"><img src="icons/mark.png" alt=""></div><div class="wm">Evalú<span>app</span><small>Tu herramienta docente</small></div></div>
   <button class="ctxrow side-ctx" data-act="ctx"><span>${esc(areaN(UI.area))} · ${triTxt(UI.tri)}</span>${ICONS.down}</button>
   ${NAV13.map(n=>`<button class="nav ${k===n?'on':''}" data-tab="${n}" style="${secVars(n)}">${ICONS[n]}${SECS[n].n}${n==='avisos'&&avisosN()?`<span class="nbadge">${avisosN()}</span>`:''}</button>`).join('')}
   <div class="foot"><div class="sync">${syncHTML()}</div></div>`);
  setHTML('top',k==='inicio'?'':`<div class="toprow"><div class="ttl2"><button class="back" data-tab="inicio" aria-label="Volver">${ICONS.back}</button><span class="ico2">${ICONS[k]}</span><span>${sec.n}</span></div><div class="sync deskonly">${syncHTML()}</div></div>`);
  document.getElementById('top').classList.toggle('empty',k==='inicio');
  const nb=(n,ic,lab)=>`<button class="${(k===n||(n==='diario'&&k==='prog'&&UI.ptab==='dia'))?'on':''}" data-tab="${n}">${ic}<span>${lab}</span>${n==='avisos'&&avisosN()?`<i class="nbadge">${avisosN()}</i>`:''}</button>`;
  setHTML('tabs',`<div class="in5">${nb('inicio',ICONS.inicio,'Inicio')}${nb('diario',ICONS.cal,'Diario')}<button class="fab" data-act="quick" aria-label="Acciones rápidas">${ICONS.plus}</button>${nb('avisos',ICONS.bell,'Avisos')}${nb('ajustes',ICONS.alumno,'Perfil')}</div>`);
}
function vInicio(){
  const r=resumen();
  const live={evaluar:!r.als?'':r.sinEval?`${r.sinEval} sin evaluar`:'',clase:r.alertas?`${r.alertas} ${r.alertas===1?'alerta':'alertas'}`:'',alumno:r.als?`${r.als}`:'',seneca:r.pct?`${r.pct} %`:'',prog:(()=>{const u=udsDe(UI.area).length;return u?`${u} ${u===1?'unidad':'unidades'}`:''})(),ajustes:Sync.ok()&&OPS.length?`${OPS.length} pendientes`:''};
  return `<div class="hero3">
    <div class="herotop"><button class="iconbtn ghost mobonly" data-act="drawer" aria-label="Menú">${ICONS.menu}</button></div>
    <img class="biglogo" src="icons/logo.png" alt="Evalúapp">
    <p class="tag">Tu herramienta docente</p>
    <div><button class="ctxchip" data-act="ctx"><span>${esc(areaN(UI.area))} · ${triTxt(UI.tri)}</span>${ICONS.down}</button></div>
    <svg class="wave" viewBox="0 0 1200 160" preserveAspectRatio="none"><path d="M0 90 C180 30 360 140 600 80 C840 20 1000 120 1200 60 L1200 160 L0 160Z" fill="rgba(46,170,160,.16)"/><path d="M0 120 C260 70 420 150 660 112 C880 78 1030 140 1200 100 L1200 160 L0 160Z" fill="rgba(40,110,170,.18)"/></svg>
  </div>
  <div class="tiles3">${['evaluar','clase','alumno','seneca','prog','ajustes'].map(k=>`<button class="tile3" data-tab="${k}" style="--ts:var(--t-${k})">${live[k]?`<span class="tbadge">${esc(live[k])}</span>`:''}${ICONS[k]}<b>${SECS[k].n}</b><span>${TILESUB[k]}</span></button>`).join('')}</div>`;
}
/* ---- avisos ---- */
function avisosData(){
  const L=[];const r=resumen();const regs=periodRegs();
  if(!S.config.alumnos.length)L.push({ic:'alumno',c:'var(--a-alumno)',t:'Aún no hay alumnos',s:'Añádelos en Ajustes para empezar a evaluar.',a:'data-tab="ajustes"'});
  const byAl={};alumnosOrd().forEach(al=>CRITS.forEach(x=>{if(!aplica(al,x.c))return;const v=nivelMedio(regs,al.id,x.c);if(v!=null&&v<2)(byAl[al.id]=byAl[al.id]||{al,l:[]}).l.push(x.c)}));
  Object.values(byAl).forEach(({al,l})=>L.push({ic:'alert',c:'var(--l1)',t:`${esc(al.nombre)} necesita refuerzo`,s:`${esc(areaN(UI.area))}: ${l.join(', ')}`,a:`data-veral="${al.id}"`}));
  if(r.als&&r.sinEval)L.push({ic:'evaluar',c:'var(--a-evaluar)',t:`${r.sinEval} ${r.sinEval===1?'criterio':'criterios'} sin evaluar`,s:`${esc(areaN(UI.area))} · ${triTxt(UI.tri)}`,a:'data-tab="evaluar"'});
  ['3','4'].forEach(c=>{if(!udActualDe(UI.area,c)&&udsDe(UI.area,c).length)L.push({ic:'layers',c:'var(--a-prog)',t:`${c}.º no tiene unidad en curso`,s:`Márcala en Programación para filtrar Evaluar (${esc(areaN(UI.area))})`,a:'data-goprog="uds"'})});
  const hoy=today(),frs=franjasDe(hoy);
  if(frs.length){const vac=frs.filter((fr,i)=>CURRICULO[fr.ar]&&!(S.prog[sesId(hoy,i)]&&JSON.stringify(S.prog[sesId(hoy,i)].d).match(/"act":"[^"]/))).length;if(vac)L.push({ic:'cal',c:'var(--teal)',t:`Diario de hoy: ${vac} ${vac===1?'sesión':'sesiones'} sin preparar`,s:'Por si alguien tiene que sustituirte',a:'data-goprog="dia"'})}
  if(Sync.ok()&&OPS.length)L.push({ic:'cloud',c:'var(--l2)',t:`${OPS.length} cambios sin subir a la hoja`,s:'Se subirán solos al recuperar la conexión',a:'data-act="syncNow"'});
  if(Sync.lastError)L.push({ic:'cloud',c:'var(--l1)',t:'Error al sincronizar',s:esc(Sync.lastError),a:'data-tab="ajustes"'});
  return L;
}
function avisosN(){try{return avisosData().length}catch(e){return 0}}
function vAvisos(){
  const L=avisosData();
  return `<h2>Avisos</h2>${ctxRow({curso:false})}<div class="lcard">${L.length?L.map(x=>lrow(ICONS[x.ic],x.c,x.t,x.s,x.a)).join(''):'<div class="empty"><b>Todo en orden</b>No hay nada pendiente en este periodo.</div>'}</div>`;
}
/* ---- acciones rápidas y menú ---- */
function quickSheet(){
  modal(`<h3>Acciones rápidas</h3><div class="lcard flat">
   ${lrow(ICONS.evaluar,'var(--a-evaluar)','Evaluación rápida','Evalúa el criterio que tienes entre manos','data-q="eval"')}
   ${lrow(ICONS.nota,'var(--a-alumno)','Nueva observación','Anota algo de un alumno','data-q="obs"')}
   ${lrow(ICONS.cal,'var(--teal)','Preparar el diario de hoy',may1(fLarga(today())),'data-q="dia"')}
   ${lrow(ICONS.layers,'var(--a-prog)','Nueva unidad o situación',esc(areaN(UI.area)),'data-q="ud"')}</div>`,(m,close)=>{
    m.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(!b)return;close();const q=b.dataset.q;
      if(q==='eval'){UI.tab='evaluar';UI.evTab='crit';UI.evDet=true;UI.fecha=today();render();scrollTo(0,0)}
      else if(q==='obs')pickAlumno(id=>obsModal(id));
      else if(q==='dia'){UI.tab='prog';UI.ptab='dia';UI.pfecha=today();render();scrollTo(0,0)}
      else if(q==='ud'){UI.tab='prog';UI.ptab='uds';render();udModal()}});
  });
}
function pickAlumno(fn){const als=alumnosFiltro();if(!als.length){toast('Añade alumnos en Ajustes');return}
  modal(`<h3>¿De quién?</h3><div class="lcard flat">${als.map(a=>lrow(`<span class="av">${esc(inic(a.nombre))}</span>`,'var(--a-alumno)',esc(a.nombre),a.curso+'.º',`data-pick="${a.id}"`)).join('')}</div>`,(m,close)=>{m.addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(b){close();fn(b.dataset.pick)}})})}
function drawer(){
  modal(`<div class="brand" style="margin-bottom:16px"><div class="logo"><img src="icons/mark.png" alt=""></div><div class="wm">Evalú<span>app</span><small>Tu herramienta docente</small></div></div>
   <div class="lcard flat">${NAV13.map(n=>lrow(ICONS[n],`var(--a-${n==='avisos'?'inicio':n==='diario'?'clase':n})`,SECS[n].n,SECS[n].sub,`data-tab="${n}"`)).join('')}</div>
   <div class="sync" style="margin-top:14px">${syncHTML()}</div>`,(m,close)=>{m.classList.add('drawer');m.addEventListener('click',e=>{if(e.target.closest('[data-tab]'))close()})});
}
/* ---- evaluar ---- */
function pctCrit(c,als){const regs=periodRegs().filter(r=>r.t==='niv'&&r.c===c);const ap=als.filter(al=>aplica(al,c));const ev=ap.filter(al=>regs.some(r=>r.a===al.id)).length;return ap.length?Math.round(ev/ap.length*100):0}
const vEvaluarDet=vEvaluar;
function vEvaluar13(){
  const als=alumnosFiltro();
  if(!S.config.alumnos.length)return vEvaluarDet();
  if(UI.evDet)return `<button class="backrow" data-act="evBack">${ICONS.back} Criterios</button>`+vEvaluarDet();
  const vis=critsVisibles();const ucurs=udsEnCurso().filter(u=>(u.d.crits||[]).length);
  const head=`<h2>Evaluar</h2>${pills('evtab',UI.evTab,[['crit','Criterios'],['rub','Rúbricas']])}${ctxRow()}`;
  if(UI.evTab==='rub')return head+`<div class="lcard">${CRITS.map(x=>`<details class="rubd"><summary><span class="code">${x.c}</span> ${esc(x.t)}${x.solo4?' <span class="muted small">(solo 4.º)</span>':''}</summary><div class="rub">${x.r.map((t,i)=>`<div><b><span class="sw" style="background:${LVC[i+1]}"></span>${i+1} · ${LVN[i+1]}</b>${esc(t)}</div>`).join('')}</div></details>`).join('')}</div>`;
  const low=vis.slice().sort((a,b)=>pctCrit(a.c,als)-pctCrit(b.c,als))[0];
  return head+(ucurs.length?`<button class="udbar ${UI.soloUd?'on':''}" data-act="soloUd" style="margin-bottom:12px"><span>${UI.soloUd?'Solo los criterios de':'Ver solo los criterios de'}</span><b>${ucurs.map(u=>esc(u.d.titulo)).join(' y ')}</b><span class="sw2">${UI.soloUd?'Ver todos':'Filtrar'}</span></button>`:'')+
   `<div class="lcard">${vis.map(x=>`<button class="lrow crit" data-evc="${x.c}"><span class="lt"><b>CE${x.ce} · ${x.c} ${esc(x.t)}${x.core?' ★':''}</b><span>${esc(CES[x.ce])}</span></span>${pct(pctCrit(x.c,als))}<span class="chv">${ICONS.chev}</span></button>`).join('')}</div>
   <div class="center"><button class="pillbtn blue" data-evc="${low?low.c:vis[0].c}">${ICONS.plus} Evaluación rápida</button></div>`;
}
/* ---- clase ---- */
const vClaseMapa=vClase;
function vClase13(){
  const als=alumnosFiltro();const n3=als.filter(a=>a.curso==='3').length,n4=als.filter(a=>a.curso==='4').length;
  const grupo=lrow(ICONS.clase,'var(--a-clase)',`${UI.filtro==='todos'?'3.º y 4.º':UI.filtro+'.º'} de Primaria`,`${als.length} ${als.length===1?'alumno':'alumnos'}${UI.filtro==='todos'?` · ${n3} de 3.º y ${n4} de 4.º`:''}`,'data-tab="ajustes"');
  const body=vClaseMapa();
  const [mapa,refuerzo]=body.split('<div class="card" style="margin-top:12px"><h3>Necesitan refuerzo');
  return `<h2>Clase</h2>${pills('cltab',UI.clTab,[['mapa','Mapa de calor'],['ref','Refuerzo']])}${ctxRow()}<div class="lcard" style="margin-bottom:12px">${grupo}</div>`+(UI.clTab==='mapa'?mapa.replace(/^<h2>[^<]*(<sup>[^<]*<\/sup>[^<]*)?<\/h2>/,''):'<div class="card"><h3>Necesitan refuerzo'+(refuerzo||''));
}
/* ---- alumno ---- */
const vAlumnoOld=vAlumno;
function vAlumno13(){
  const als=alumnosFiltro();
  if(!als.length)return `<h2>Alumno</h2>${ctxRow()}<div class="card empty"><b>Sin alumnos</b>Añádelos en Ajustes.</div>`;
  if(!als.find(a=>a.id===UI.alumno))UI.alumno=als[0].id;
  const i=als.findIndex(a=>a.id===UI.alumno),al=als[i];
  const regs=periodRegs();const crs=CRITS.filter(x=>aplica(al,x.c));
  const m=mediaAlumno(regs,al);const obs=regs.filter(r=>r.t==='obs'&&r.a===al.id).sort((a,b)=>b.f.localeCompare(a.f));
  const evs=crs.filter(x=>nivelMedio(regs,al.id,x.c)!=null).length;
  const sw=`<div class="stucard"><button class="iconbtn ghost" data-alnav="${(i-1+als.length)%als.length}" aria-label="Anterior" style="transform:rotate(180deg)">${ICONS.chev}</button><span class="av big">${esc(inic(al.nombre))}</span><span class="lt"><b>${esc(al.nombre)}</b><span>${al.curso}.º de Primaria</span></span><button class="iconbtn ghost" data-alnav="${(i+1)%als.length}" aria-label="Siguiente">${ICONS.chev}</button></div>`;
  let body='';
  if(UI.alTab==='ficha'){
    body=`<div class="kpis"><div class="kpi"><b style="color:${m!=null&&m<5?'var(--l1)':'var(--acc)'}">${m==null?'–':m.toFixed(1).replace('.',',')}</b><span>media orientativa</span></div><div class="kpi"><b>${evs}/${crs.length}</b><span>criterios evaluados</span></div><div class="kpi"><b>${regs.filter(r=>r.t==='niv'&&r.a===al.id).length}</b><span>registros</span></div><div class="kpi"><b>${obs.length}</b><span>observaciones</span></div></div>
     <div class="lcard" style="margin-top:12px">${lrow(ICONS.nota,'var(--a-alumno)','Nueva observación','Anótala con fecha y criterio',`data-obs="${al.id}"`)}${lrow(ICONS.chart,'var(--a-clase)','Progreso y evidencias','Competencias y observaciones','data-altab="seg"')}${lrow(ICONS.doc,'var(--a-seneca)','Copiar informe',`Texto para tutorías · ${esc(areaN(UI.area))}`,'data-act="informe"')}${lrow(ICONS.pen,'var(--a-ajustes)','Editar alumno','Nombre o iniciales y curso',`data-edal="${al.id}"`)}</div>`;
  }else if(UI.alTab==='eval'){
    body=`<div class="card">${crs.map(x=>{const v=nivelMedio(regs,al.id,x.c);return `<div class="crow"><span class="code">${x.c}</span><span>${esc(x.t)}</span><button class="pill" style="border:0;background:${colorNv(v)};color:${v==null?'var(--dim)':'var(--on-lv)'}" data-cell="${al.id}|${x.c}">${v==null?'·':aNota(v).toFixed(0)}</button></div>`}).join('')}</div>`;
  }else{
    const ceAvg=Object.keys(CES).map(ce=>{const vs=crs.filter(x=>x.ce==ce).map(x=>nivelMedio(regs,al.id,x.c)).filter(v=>v!=null);return [ce,vs.length?vs.reduce((a,b)=>a+b,0)/vs.length:null]});
    body=`<div class="card"><h3>Por competencia específica</h3><div class="bars">${ceAvg.map(([ce,v])=>`<div class="b"><span>CE${ce} ${CES[ce]}</span><div class="track"><div class="fill" style="width:${v==null?0:v/4*100}%;background:${colorNv(v)}"></div></div><b>${v==null?'–':v.toFixed(1).replace('.',',')}</b></div>`).join('')}</div></div>
     <div class="card" style="margin-top:12px"><h3>Observaciones</h3>${obs.length?obs.map(o=>`<div class="obs"><div class="meta"><span>${fmtF(o.f)}${o.c?' · '+o.c+' '+esc(CRIT[o.c]?CRIT[o.c].t:''):''}</span><a href="#" data-del="${o.id}" style="color:var(--l1)">Borrar</a></div>${esc(o.txt)}</div>`).join(''):'<div class="muted small">Sin observaciones en este periodo.</div>'}</div>`;
  }
  return `<h2>Alumno</h2>${sw}${pills('altab',UI.alTab,[['ficha','Ficha'],['eval','Evaluación'],['seg','Seguimiento']])}${ctxRow({curso:true})}${body}`;
}
/* ---- séneca ---- */
function vSeneca13(){
  const {als,crs,rows}=senecaData(UI.curso);
  const sync=Sync.ok()?lrow(ICONS.cloud,'var(--l3)','Hoja de Google conectada',OPS.length?`${OPS.length} cambios pendientes de subir`:'Tus notas están guardadas en tu Drive','data-tab="ajustes"'):lrow(ICONS.cloud,'var(--l2)','Hoja de Google sin conectar','Conéctala para tener los datos en el móvil y en el PC','data-tab="ajustes"');
  return `<h2>Séneca</h2>${ctxRow({curso:false})}
  <div class="lcard">${lrow(ICONS.copy,'var(--a-seneca)','Copiar tabla',`Notas de ${UI.curso}.º para pasarlas al cuaderno`,'data-act="copySen"')}${lrow(ICONS.dl,'var(--a-seneca)','Exportar a hoja de cálculo','Archivo CSV para Excel o Google Sheets','data-act="csvSen"')}${lrow(ICONS.ajustes,'var(--a-ajustes)','Configuración','Fechas de trimestres y conversión de niveles a nota','data-tab="ajustes"')}</div>
  <div class="lcard ${Sync.ok()?'ok':''}" style="margin-top:12px">${sync}</div>
  ${CURRICULO[UI.area].nota?`<div class="note" style="margin-top:12px">${esc(CURRICULO[UI.area].nota)}</div>`:''}
  <div style="margin:14px 0 10px">${pills('curso',UI.curso,[['3','3.º'],['4','4.º']])}</div>
  ${als.length?`<div class="hm-wrap"><table class="sn"><thead><tr><th>Alumno</th>${crs.map(x=>`<th>${x.c}</th>`).join('')}</tr></thead><tbody>${als.map((al,i)=>`<tr><td>${esc(al.nombre)}</td>${rows[i].map(v=>`<td class="v" style="color:${v===''?'var(--dim)':+v<5?'var(--l1)':'inherit'}">${v||'·'}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="small muted">Nota de 1 a 10 por criterio, en el orden del cuaderno de Séneca. Allí se calcula la nota del área con sus porcentajes.</p>`:`<div class="card empty">No hay alumnos de ${UI.curso}.º.</div>`}`;
}
/* ---- programación ---- */
const vProgOld=vProg;
function codUd(u){const l=udsDe(u.ar).filter(x=>(x.d.tipo==='SdA')===(u.d.tipo==='SdA'));return (u.d.tipo==='SdA'?'SA':'UD')+(l.findIndex(x=>x.id===u.id)+1)}
function vUds13(){
  let us=udsDe(UI.area,UI.pcurso);if(UI.utri!=='todas')us=us.filter(u=>(u.d.tri??0)===+UI.utri);
  return `${pills('utri',UI.utri,[['todas','Todas'],['0',TRI_N[0]],['1',TRI_N[1]],['2',TRI_N[2]]])}
   <div class="lcard">${us.length?us.map(u=>{const e=udEstado(u);return `<button class="lrow ud" data-ud="${u.id}"><span class="ucode ${u.d.tipo==='SdA'?'sa':''}">${codUd(u)}</span><span class="lt"><b>${esc(u.d.titulo||'Sin título')}</b><span>${u.d.ses||0}&nbsp;sesiones · ${TRI_N[u.d.tri??0].replace(' trim.','&nbsp;trimestre')} · ${CURSO_N[udCurso(u)].replace(/ /g,'&nbsp;')}</span></span><span class="uest ${e}">${EST_N[e]}</span><span class="chv">${ICONS.chev}</span></button>`}).join(''):`<div class="empty"><b>Sin unidades</b>Crea la primera con el botón de abajo.</div>`}</div>
   <div class="center"><button class="pillbtn lila" data-act="nuevaUd">${ICONS.plus} Nueva unidad</button></div>`;
}
function vProg13(){
  const titles={uds:'Unidades y situaciones',tri:'Temporalización',dia:'Diario de clase',hor:'Horario'};
  if(UI.ptab==='menu'){
    const n=udsDe(UI.area,UI.pcurso).length,hechas=udsDe(UI.area,UI.pcurso).filter(u=>u.d.hecha).length;
    return `<h2>Programación</h2>${ctxRow({tri:false})}<div class="lcard big">
     ${lrow(ICONS.layers,'#9b7be0','Unidades y situaciones',`${n} ${n===1?'unidad':'unidades'} · crea, edita y organiza`,'data-ptab="uds"')}
     ${lrow(ICONS.target,'#48b37f','Temporalización',`${hechas} de ${n} impartidas · distribución por trimestres`,'data-ptab="tri"')}
     ${lrow(ICONS.cal,'#3fb9c4','Diario de clase','Qué se hace cada día, para 3.º y para 4.º','data-ptab="dia"')}
     ${lrow(ICONS.clock,'#c9a24c','Horario','Tu semana y las indicaciones para sustitutos','data-ptab="hor"')}
     ${lrow(ICONS.doc,'#8d74d6','Exportar plan para sustitutos','Día o semana en PDF o documento de Google','data-act="expSem"')}</div>`;
  }
  const sub=UI.ptab==='uds'?vUds13():{tri:vTris,dia:vDiario,hor:vHorario}[UI.ptab]();
  return `<button class="backrow" data-ptab="menu">${ICONS.back} Programación</button><h2 class="subh">${titles[UI.ptab]}</h2>${['uds','tri'].includes(UI.ptab)?ctxRow({tri:false}):''}${sub}`;
}
VIEWS.inicio=vInicio;VIEWS.evaluar=vEvaluar13;VIEWS.clase=vClase13;VIEWS.alumno=vAlumno13;VIEWS.seneca=vSeneca13;VIEWS.prog=vProg13;VIEWS.avisos=vAvisos;
VIEWS.diario=()=>{UI.tab='prog';UI.ptab='dia';return vProg13()};

const _last={};
function setHTML(id,html){if(_last[id]===html)return false;const el=document.getElementById(id);if(!el)return false;el.innerHTML=html;_last[id]=html;return true}
function render(){
  const act=document.activeElement;if(act&&(['alNom','syUrl','syKey'].includes(act.id)||(act.closest&&act.closest('#view')&&(act.tagName==='TEXTAREA'||(act.tagName==='INPUT'&&act.type==='text')))))return;
  renderChrome();setHTML('view',VIEWS[UI.tab]());
  document.body.dataset.tab=UI.tab;
}
function cellModal(a,c){
  const al=S.config.alumnos.find(x=>x.id===a),cr=CRIT[c];
  const rs=periodRegs().filter(r=>r.a===a&&r.c===c).sort((x,y)=>y.f.localeCompare(x.f));
  modal(`<h3>${esc(al.nombre)} · ${c} ${esc(cr.t)}</h3>${rs.length?rs.map(r=>`<div class="hist"><span>${fmtF(r.f)}</span><span style="flex:1">${r.t==='niv'?`<span class="tag" style="background:${LVC[r.n]}">${r.n} · ${LVN[r.n]}</span>`:esc(r.txt)}</span><button class="btn sm danger" data-delm="${r.id}">Borrar</button></div>`).join(''):'<div class="muted">Sin registros en este periodo.</div>'}<div class="btns" style="justify-content:flex-end;margin-top:14px"><button class="btn" data-close>Cerrar</button></div>`,(m,close)=>{m.addEventListener('click',e=>{const d=e.target.closest('[data-delm]');if(d){delReg(d.dataset.delm);close();render();toast('Registro borrado')}})});
}
function obsModal(a){
  const al=S.config.alumnos.find(x=>x.id===a);
  modal(`<h3>Observación · ${esc(al.nombre)}</h3><div class="stack"><div class="field"><label>Criterio (opcional)</label><select id="obC"><option value="">Ninguno</option>${CRITS.filter(x=>aplica(al,x.c)).map(x=>`<option value="${x.c}" ${UI.tab==='evaluar'&&x.c===UI.crit?'selected':''}>${x.c} ${esc(x.t)}</option>`).join('')}</select></div><div class="field"><label>Fecha</label><input type="date" id="obF" value="${UI.fecha}"></div><textarea id="obT" placeholder="Qué has observado…"></textarea></div><div class="btns" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-close>Cancelar</button><button class="btn pri" id="obOk">Guardar</button></div>`,(m,close)=>{m.querySelector('#obT').focus();m.querySelector('#obOk').onclick=()=>{const t=m.querySelector('#obT').value.trim();if(!t){toast('Escribe la observación');return}addObs(a,m.querySelector('#obC').value,t,m.querySelector('#obF').value||UI.fecha);close();render();toast('Observación guardada')}});
}
function editAl(id){
  const al=S.config.alumnos.find(x=>x.id===id);
  modal(`<h3>Editar alumno</h3><div class="stack"><input type="text" id="eN" value="${esc(al.nombre)}" maxlength="40"><div class="seg" id="eC">${['3','4'].map(c=>`<button data-c="${c}" class="${al.curso===c?'on':''}">${c}.º</button>`).join('')}</div></div><div class="btns" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-close>Cancelar</button><button class="btn pri" id="eOk">Guardar</button></div>`,(m,close)=>{let cur=al.curso;m.querySelector('#eC').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;cur=b.dataset.c;m.querySelectorAll('#eC button').forEach(x=>x.classList.toggle('on',x===b))};m.querySelector('#eOk').onclick=()=>{const nm=m.querySelector('#eN').value.trim();if(!nm)return;S.config.alumnos=S.config.alumnos.map(x=>x.id===id?Object.assign({},x,{nombre:nm,curso:cur}):x);saveConfig();close();render()}});
}
function demo(){
  const noms=[['A.G.M.','3'],['B.R.L.','3'],['C.P.S.','3'],['D.M.T.','3'],['E.L.R.','4'],['F.S.G.','4'],['G.T.P.','4'],['H.V.C.','4']];
  const base=[3.2,2.4,1.6,2.9,3.5,2.1,2.8,1.8];
  const nuevos=noms.map(([n,c])=>({id:uid(),nombre:n+' (ej.)',curso:c}));
  S.config.alumnos=S.config.alumnos.concat(nuevos);saveConfig();
  const fechas=['2026-09-22','2026-10-06','2026-10-20','2026-11-03','2026-11-10'];
  nuevos.forEach((al,i)=>{CRITS.forEach(x=>{if(!aplica(al,x.c))return;fechas.forEach((f,j)=>{if(Math.random()<.45){let n=Math.round(base[i]+(Math.random()-.5)*1.6+j*.12);n=Math.max(1,Math.min(4,n));const r={id:uid(),t:'niv',a:al.id,c:x.c,n,f,ar:'mat'};putReg(r);OPS.push({op:'up',r})}})})});
  const ob={id:uid(),t:'obs',ar:'mat',a:nuevos[2].id,c:'2.2',txt:'Se bloquea con las restas llevando; mejora mucho con material manipulativo.',f:'2026-11-10'};putReg(ob);OPS.push({op:'up',r:ob});
  persist();Sync.schedule();UI.tri=0;render();toast('Ejemplo cargado');
}
function quitarEjemplo(){
  const ids=new Set(S.config.alumnos.filter(a=>/\(ej\.\)$/.test(a.nombre)).map(a=>a.id));
  if(!ids.size){toast('No hay alumnos de ejemplo');return}
  allRegsRaw().filter(r=>ids.has(r.a)).forEach(r=>{dropReg(r.id);OPS.push({op:'del',id:r.id})});
  S.config.alumnos=S.config.alumnos.filter(a=>!ids.has(a.id));saveConfig();render();toast('Ejemplo quitado');
}

document.addEventListener('click',e=>{
  const t=e.target.closest('button,a,[data-cell]');if(!t)return;
  const d=t.dataset;
  if(d.tab){if(d.tab==='diario'){UI.tab='prog';UI.ptab='dia';UI.pfecha=today()}else{UI.tab=d.tab;if(d.tab==='prog')UI.ptab='menu';if(d.tab==='evaluar')UI.evDet=false}render();scrollTo(0,0);return}
  if(d.goprog){UI.tab='prog';UI.ptab=d.goprog;render();scrollTo(0,0);return}
  if(d.evc){UI.crit=d.evc;UI.evDet=true;render();scrollTo(0,0);return}
  if(d.evtab){UI.evTab=d.evtab;render();return}
  if(d.cltab){UI.cltab=d.cltab;UI.clTab=d.cltab;render();return}
  if(d.altab){UI.alTab=d.altab;render();return}
  if(d.alnav){const als=alumnosFiltro();UI.alumno=als[+d.alnav].id;render();return}
  if(d.utri){UI.utri=d.utri;render();return}
  if(d.ptab){UI.ptab=d.ptab;render();return}
  if(d.pcurso){UI.pcurso=d.pcurso;render();return}
  if(d.junto!==undefined){toggleJunto(d.junto);return}
  if(d.ud){udModal(d.ud);return}
  if(d.pday){UI.pfecha=addDias(UI.pfecha,+d.pday);render();return}
  if(d.hadd){setHorario(H=>{const l=H[d.hadd];const last=l[l.length-1];l.push({ini:last?last.fin:'09:00',fin:'',ar:UI.area})});return}
  if(d.hdel){const [w,i]=d.hdel.split('|');setHorario(H=>{H[w].splice(+i,1)});return}
  if(d.hcopy){setHorario(H=>{H[d.hcopy]=JSON.parse(JSON.stringify(H[d.hcopy-1]||[]))});toast('Horario copiado');return}
  if(d.tri!==undefined&&t.closest('#triSeg')&&t.tagName==='BUTTON'){UI.tri=+d.tri;render();return}
  if(d.go){UI.tab=d.go;render();return}
  if(d.crit){UI.crit=d.crit;render();return}
  if(d.filtro){UI.filtro=d.filtro;render();return}
  if(d.lv){setNivel(d.al,UI.crit,+d.lv);return}
  if(d.obs){obsModal(d.obs);return}
  if(d.modo){UI.modo=d.modo;render();return}
  if(d.cell){const [a,c]=d.cell.split('|');cellModal(a,c);return}
  if(d.veral!==undefined){e.preventDefault();UI.alumno=d.veral;UI.tab='alumno';render();scrollTo(0,0);return}
  if(d.del){e.preventDefault();confirmar('¿Borrar esta observación?','Borrar',()=>{delReg(d.del);render()});return}
  if(d.curso){UI.curso=d.curso;render();return}
  if(d.edal){editAl(d.edal);return}
  if(d.rmal){const al=S.config.alumnos.find(x=>x.id===d.rmal);confirmar(`¿Quitar a ${al.nombre}? Sus registros se conservan en las copias, pero dejarán de verse.`,'Quitar',()=>{S.config.alumnos=S.config.alumnos.filter(x=>x.id!==d.rmal);saveConfig();render()});return}
  if(t.closest('#alCur')&&d.c){t.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===t));return}
  switch(d.act){
    case 'rub':UI.rub=!UI.rub;render();break;
    case 'area':areaModal();break;
    case 'ctx':ctxModal();break;
    case 'quick':quickSheet();break;
    case 'drawer':drawer();break;
    case 'evBack':UI.evDet=false;render();break;
    case 'soloUd':UI.soloUd=!UI.soloUd;render();break;
    case 'nuevaUd':udModal();break;
    case 'expDia':exportModal(false);break;
    case 'expSem':exportModal(true);break;
    case 'prox':toast('Programación llegará en la próxima versión');break;
    case 'demo':demo();break;
    case 'informe':copiar(informeTexto(S.config.alumnos.find(a=>a.id===UI.alumno)));break;
    case 'copySen':copiar(senecaTSV('\t'));break;
    case 'csvSen':descargar(`seneca-mates-${UI.curso}-${['1T','2T','3T','curso'][UI.tri]}.csv`,'﻿'+senecaTSV(';'));break;
    case 'backup':descargar(`evaluapp-copia-${today()}.json`,JSON.stringify(S,null,1),'application/json');break;
    case 'wipe':confirmar('¿Borrar todos los alumnos y registros? Descarga antes una copia.','Borrar todo',()=>{allRegsRaw().forEach(r=>{dropReg(r.id);OPS.push({op:'del',id:r.id})});Object.keys(S.prog).forEach(id=>OPS.push({op:'del',id}));S.prog={};S.config=Object.assign(DEF_CONFIG(),{notas:S.config.notas,tri:S.config.tri,horario:S.config.horario});saveConfig();render();toast('Datos borrados')});break;
    case 'quitarDemo':quitarEjemplo();break;
    case 'syncSave':guardarSync();break;
    case 'syncOff':confirmar('¿Desconectar la hoja de Google? Los datos se quedarán en este dispositivo y en la hoja.','Desconectar',()=>{SYNC={url:'',key:''};try{localStorage.setItem(LS,'{}')}catch(e){}Sync.status();render()});break;
    case 'syncNow':Sync.run();break;
  }
});
document.addEventListener('submit',e=>{
  if(e.target.id==='addAl'){e.preventDefault();const inp=document.getElementById('alNom');const nm=inp.value.trim();if(!nm)return;const cur=document.querySelector('#alCur .on').dataset.c;S.config.alumnos=S.config.alumnos.concat([{id:uid(),nombre:nm,curso:cur}]);saveConfig();inp.value='';inp.blur();render();document.getElementById('alNom').focus();toast('Alumno añadido')}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='pfecha'){UI.pfecha=t.value||today();render();return}
  if(t.dataset.sf!==undefined){guardarSesion(t.dataset.sf,t.dataset.sk,t.value);toast('Guardado');return}
  if(t.dataset.hw){const w=t.dataset.hw,i=+t.dataset.hi,k=t.dataset.hk,v=t.value;setHorario(H=>{H[w][i]=Object.assign({},H[w][i],{[k]:v});if(k==='fin'&&H[w][i+1]&&!H[w][i+1].ini)H[w][i+1].ini=v});return}
  if(t.id==='avisoSust'){S.config.avisoSust=t.value;saveConfig();toast('Guardado');return}
  if(t.id==='fecha'){UI.fecha=t.value||today();render()}
  else if(t.id==='selAl'){UI.alumno=t.value;render()}
  else if(t.dataset.nota!==undefined){const v=Math.max(1,Math.min(10,+t.value||1));S.config.notas=S.config.notas.slice();S.config.notas[+t.dataset.nota]=v;saveConfig();render()}
  else if(t.dataset.tri&&t.type==='date'){const [i,j]=t.dataset.tri.split('|').map(Number);S.config.tri=S.config.tri.map(x=>x.slice());S.config.tri[i][j]=t.value;saveConfig();render()}
  else if(t.id==='restore'&&t.files[0]){const fr=new FileReader();fr.onload=()=>{try{const d=JSON.parse(fr.result);if(!d.config||!d.months)throw 0;confirmar('¿Sustituir los datos actuales por los de la copia?','Restaurar',()=>{allRegsRaw().forEach(r=>OPS.push({op:'del',id:r.id}));Object.keys(S.prog).forEach(id=>OPS.push({op:'del',id}));S.config=Object.assign(DEF_CONFIG(),d.config);S.months=d.months;S.prog=d.prog||{};allRegsRaw().forEach(r=>OPS.push({op:'up',r}));Object.values(S.prog).forEach(p=>OPS.push({op:'up',r:toWire(p)}));saveConfig();render();toast('Copia restaurada')})}catch(err){toast('Ese archivo no es una copia válida')}};fr.readAsText(t.files[0]);t.value=''}
});
document.addEventListener('click',e=>{const b=e.target.closest('#alCur button');if(b){e.preventDefault()}},true);

async function guardarSync(){
  const url=document.getElementById('syUrl').value.trim(),key=document.getElementById('syKey').value.trim();
  if(!/^https:\/\/script\.google\.com\/.+\/exec$/.test(url)){toast('La URL debe empezar por https://script.google.com y acabar en /exec');return}
  if(key.length<16){toast('Pega la clave completa');return}
  const b=document.querySelector('[data-act="syncSave"]');b.disabled=true;b.textContent='Probando…';
  try{await Sync.call({action:'ping'},url,key);SYNC={url,key};localStorage.setItem(LS,JSON.stringify(SYNC));toast('Conectado con la hoja');render();Sync.run()}
  catch(e){toast(e.message||'No se pudo conectar');b.disabled=false;b.textContent='Conectar'}
}
if('serviceWorker' in navigator&&location.protocol==='https:'){
  navigator.serviceWorker.register('sw.js').then(reg=>{reg.update();setInterval(()=>reg.update(),30*60*1000)}).catch(()=>{});
  let recargado=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(recargado)return;recargado=true;location.reload()});
}
loadLocal();try{const a=localStorage.getItem('evaluapp-area');if(a&&AREAS.some(x=>x.id===a&&x.on))UI.area=a}catch(e){}setArea(UI.area);UI.tri=guessTri();if(UI.tri===3)UI.tri=0;render();Sync.status();Sync.run();
