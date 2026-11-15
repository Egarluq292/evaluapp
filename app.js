/* ============ DATOS DEL CURRÍCULO (Orden de 30 de mayo de 2023, Matemáticas, segundo ciclo) ============ */
const CES={1:'Interpretar situaciones',2:'Resolver problemas',3:'Conjeturar y razonar',4:'Pensamiento computacional',5:'Conexiones',6:'Comunicar y representar',7:'Destrezas personales',8:'Trabajo en equipo'};
const CRITS=[
 {c:'1.1',ce:1,core:1,t:'Comprender el problema',d3:'Reconoce problemas cotidianos y empieza a comprender sus preguntas y los mensajes que contienen.',d4:'Reconoce problemas cotidianos, comprende sus preguntas e interpreta sus mensajes.',r:['No identifica la pregunta ni los datos, ni siquiera con ayuda.','Identifica la pregunta o algunos datos con ayuda.','Identifica la pregunta y los datos relevantes de forma autónoma.','Descarta datos irrelevantes y reformula el problema con sus palabras.']},
 {c:'1.2',ce:1,core:1,t:'Representar el problema',d3:'Empieza a representar la situación con material, esquemas o diagramas.',d4:'Representa la situación con material, esquemas o diagramas, solo y en equipo.',r:['No representa la situación.','La representa con material o dibujo guiado, con errores.','Elige y hace un dibujo, esquema o montaje que refleja el problema.','Usa representaciones variadas y explica por qué le ayudan.']},
 {c:'2.1',ce:2,core:1,t:'Elegir estrategias',d3:'Empieza a comparar y emplear estrategias de forma pautada.',d4:'Compara y emplea estrategias y toma decisiones.',r:['No aplica ninguna estrategia.','Aplica la estrategia que le sugiere el docente.','Elige por sí mismo una estrategia adecuada.','Compara varias estrategias y elige la más eficaz.']},
 {c:'2.2',ce:2,core:1,t:'Resolver y calcular',d3:'Obtiene soluciones con una estrategia conocida, tanteando y con analogías sencillas.',d4:'Obtiene soluciones con estrategias conocidas, tanteo y analogías.',r:['No llega a una solución o comete errores de cálculo graves.','Llega a la solución con ayuda o con errores de cálculo.','Obtiene la solución con cálculos correctos.','Resuelve por más de un camino o estima antes de calcular.']},
 {c:'2.3',ce:2,core:1,solo4:1,t:'Comprobar la solución',d3:'',d4:'Demuestra y describe la corrección de las soluciones y su coherencia con el contexto.',r:['No revisa la solución.','Revisa solo si se le pide, sin detectar errores.','Comprueba que la solución tiene sentido en el contexto.','Detecta y corrige sus errores y lo justifica.']},
 {c:'3.1',ce:3,t:'Patrones y conjeturas',d3:'Realiza y empieza a analizar conjeturas sencillas sobre patrones, de forma pautada.',d4:'Analiza conjeturas, explora fenómenos y argumenta conclusiones.',r:['No reconoce regularidades.','Reconoce un patrón sencillo con ayuda.','Descubre el patrón, lo continúa y formula una conjetura.','Comprueba sus conjeturas y explica la regla.']},
 {c:'3.2',ce:3,t:'Plantear problemas',d3:'Pone ejemplos de problemas cotidianos y empieza a plantear preguntas.',d4:'Da ejemplos de problemas, plantea preguntas y argumenta conclusiones.',r:['No propone ejemplos ni preguntas.','Propone preguntas copiando modelos.','Inventa problemas o preguntas coherentes con una situación.','Inventa problemas originales y razona posibles conclusiones.']},
 {c:'4.1',ce:4,t:'Secuencias de pasos',d3:'Empieza a automatizar situaciones cotidianas paso a paso, de forma pautada.',d4:'Automatiza situaciones cotidianas y define la rutina.',r:['No ordena los pasos de una tarea.','Ordena los pasos con ayuda.','Describe la secuencia de pasos de tareas cotidianas.','Crea y mejora secuencias, y detecta y corrige fallos.']},
 {c:'4.2',ce:4,t:'Usar herramientas',d3:'Se inicia en el manejo de herramientas adecuadas para resolver problemas.',d4:'Emplea herramientas tecnológicas adecuadas para resolver problemas.',r:['No usa herramientas adecuadas.','Usa herramientas (regla, calculadora, apps…) con ayuda.','Elige y usa la herramienta adecuada de forma autónoma.','Las usa con eficacia y sabe cuándo no hacen falta.']},
 {c:'5.1',ce:5,core:1,t:'Conectar con la vida diaria',d3:'Empieza a conectar las matemáticas con sus experiencias y la vida cotidiana.',d4:'Conecta las matemáticas con la vida cotidiana y resuelve situaciones de su entorno.',r:['No relaciona lo aprendido con situaciones reales.','Lo relaciona si se le dan ejemplos.','Aplica lo aprendido a situaciones de su entorno.','Propone por sí mismo nuevas situaciones donde aplicarlo.']},
 {c:'5.2',ce:5,t:'Interpretar información gráfica',d3:'Identifica conexiones con la vida cotidiana interpretando información gráfica.',d4:'Interpreta esas situaciones y las relaciona con contextos reales.',r:['No extrae información de tablas o gráficos.','Lee datos aislados con ayuda.','Interpreta tablas y gráficos sencillos.','Compara datos y saca conclusiones propias.']},
 {c:'6.1',ce:6,core:1,t:'Lenguaje matemático',d3:'Reconoce lenguaje matemático sencillo y usa vocabulario básico oralmente.',d4:'Comprende mensajes en distintos formatos y se expresa oralmente y por escrito.',r:['No usa vocabulario matemático.','Usa algunos términos, con imprecisiones.','Usa el vocabulario adecuado oralmente y por escrito.','Se expresa con precisión y ayuda a otros a hacerlo.']},
 {c:'6.2',ce:6,core:1,t:'Explicar el proceso',d3:'Empieza a explicar oralmente o con dibujos los pasos y resultados.',d4:'Explica pasos y resultados con lenguaje verbal y gráfico, en papel o digital.',r:['No explica cómo lo ha hecho.','Explica parte del proceso con ayuda.','Explica los pasos y el resultado de forma ordenada.','Explica y justifica con claridad, apoyándose en dibujos o medios digitales.']},
 {c:'7.1',ce:7,t:'Emociones y perseverancia',d3:'Empieza a identificar sus emociones ante retos, pide ayuda si la necesita y persevera.',d4:'Identifica y gestiona sus emociones, con autoconfianza y perseverancia.',r:['Abandona ante la dificultad.','Persiste con apoyo constante.','Mantiene el esfuerzo y pide ayuda cuando la necesita.','Afronta los retos con confianza y autonomía.']},
 {c:'7.2',ce:7,t:'Actitud ante el error',d3:'Muestra esfuerzo y flexibilidad y valora el error como oportunidad.',d4:'Además, muestra actitudes colaborativas y participativas.',r:['Rechaza u oculta el error.','Acepta el error cuando se le señala.','Usa el error para mejorar.','Busca sus propios errores y los aprovecha para aprender.']},
 {c:'8.1',ce:8,t:'Colaborar en equipo',d3:'Participa con respeto y empieza a colaborar y a resolver conflictos.',d4:'Colabora activamente y establece relaciones saludables e igualitarias.',r:['No participa o dificulta el trabajo del grupo.','Participa si se le pide.','Colabora con respeto y ayuda a resolver conflictos.','Dinamiza el grupo e integra a todos.']},
 {c:'8.2',ce:8,t:'Responsabilidad en el equipo',d3:'Respeta el reparto de tareas y practica la escucha activa.',d4:'Participa en el reparto de tareas, asume responsabilidades y se comunica con eficacia.',r:['No asume su tarea.','Asume su tarea con recordatorios.','Cumple su parte y escucha a los demás.','Organiza tareas y se comunica de forma eficaz.']}
];
const AREAS=[
 {id:'mat',n:'Matemáticas',ciclo:'2.º ciclo · 3.º y 4.º',on:1},
 {id:'len',n:'Lengua Castellana y Literatura',ciclo:'2.º ciclo · 3.º y 4.º'},
 {id:'cmn',n:'Conocimiento del Medio Natural, Social y Cultural',ciclo:'2.º ciclo · 3.º y 4.º'}
];
const LVN=['','Inicio','En proceso','Conseguido','Destacado'];
const LVC=['var(--l0)','var(--l1)','var(--l2)','var(--l3)','var(--l4)'];
const TRI_N=['1.er trim.','2.º trim.','3.er trim.','Curso'];
const CRIT=Object.fromEntries(CRITS.map(x=>[x.c,x]));

/* ============ ESTADO ============ */
const DEF_CONFIG=()=>({alumnos:[],notas:[3,5,7,9],tri:[['2026-09-01','2026-12-31'],['2027-01-01','2027-03-31'],['2027-04-01','2027-06-30']]});
let S={config:DEF_CONFIG(),months:{}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function guessTri(){const t=today();const i=S.config.tri.findIndex(([a,b])=>t>=a&&t<=b);return i<0?3:i}
let UI={area:'mat',tab:'inicio',tri:0,crit:'1.1',fecha:today(),rub:true,modo:'nivel',alumno:null,curso:'3',filtro:'todos'};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtF=f=>{const [y,m,d]=f.split('-');return d+'/'+m+'/'+y.slice(2)};

/* ============ ALMACENAMIENTO (nube privada + copia local) ============ */
const APP_VERSION='1.1.0';
const LK='evaluapp-datos',LO='evaluapp-cambios',LS='evaluapp-sync';
let OPS=[];let SYNC={url:'',key:''};
function persist(){try{localStorage.setItem(LK,JSON.stringify(S));localStorage.setItem(LO,JSON.stringify(OPS))}catch(e){}}
function loadLocal(){try{const r=localStorage.getItem(LK);if(r){const d=JSON.parse(r);S.config=Object.assign(DEF_CONFIG(),d.config||{});S.months=d.months||{}}OPS=JSON.parse(localStorage.getItem(LO)||'[]');SYNC=Object.assign({url:'',key:''},JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}}
function putReg(r){for(const m in S.months){const i=S.months[m].findIndex(x=>x.id===r.id);if(i>=0){S.months[m]=S.months[m].slice();S.months[m].splice(i,1)}}const m=mk(r.f);S.months[m]=(S.months[m]||[]).concat([r])}
function dropReg(id){for(const m in S.months){const i=S.months[m].findIndex(x=>x.id===id);if(i>=0){S.months[m]=S.months[m].slice();S.months[m].splice(i,1)}}}
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
     if(vacia&&(S.config.alumnos.length||allRegsRaw().length)){
       OPS=[{op:'config',config:S.config}].concat(allRegsRaw().map(r=>({op:'up',r})));persist();
       this.busy=false;return this.run();
     }
     if(!vacia||!OPS.length){S.config=Object.assign(DEF_CONFIG(),j.config||{});S.months={};(j.regs||[]).forEach(r=>{const m=mk(r.f);(S.months[m]=S.months[m]||[]).push(r)});OPS.forEach(applyOp);persist();render()}
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
function setSync(k,t){SYNCST=[k,t];document.querySelectorAll('.sync').forEach(el=>el.innerHTML=syncHTML());if(UI.tab==='inicio'||UI.tab==='ajustes'){const v=document.getElementById('view');if(v&&!document.querySelector('.modal-bg'))render()}}

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
 prog:{n:'Programación',sub:'Unidades y situaciones'},
 ajustes:{n:'Ajustes',sub:'Datos y copias'}
};
const NAV=['inicio','evaluar','clase','alumno','seneca','ajustes'];
const MOBNAV=['inicio','evaluar','clase','alumno','seneca'];
const cursoEsc=()=>{const d=new Date();const y=d.getMonth()>=8?d.getFullYear():d.getFullYear()-1;return `${y}/${y+1}`};
const secVars=k=>`--navbg:var(--s-${k});--navacc:var(--a-${k})`;
function renderChrome(){
  const k=UI.tab,sec=SECS[k];
  const root=document.documentElement.style;root.setProperty('--acc',`var(--a-${k})`);root.setProperty('--sec',`var(--s-${k})`);
  document.getElementById('side').innerHTML=`<div class="brand"><div class="logo"><img src="icons/logo.svg" alt=""></div><div class="wm">Evalú<span>app</span><small>Panel docente</small></div></div>
   <button class="areacard area" data-act="area" style="margin:0 0 16px;padding:11px 12px"><div class="ico" style="width:34px;height:34px">${ICONS.area}</div><div style="min-width:0"><b style="font-size:14px">${esc(areaAct().n)}</b><span>Cambiar área</span></div></button>
   ${NAV.map(n=>`<button class="nav ${k===n?'on':''}" data-tab="${n}" style="${secVars(n)}">${ICONS[n]}${SECS[n].n}</button>`).join('')}
   <div class="foot"><div class="sync">${syncHTML()}</div></div>`;
  const showTri=['inicio','clase','alumno','seneca'].includes(k);
  document.getElementById('top').innerHTML=`<div class="toprow">
     ${k==='inicio'?`<div class="sync">${syncHTML()}</div>`
     :`<div class="ttl"><button class="back" data-tab="inicio" aria-label="Volver">${ICONS.chev}</button><div class="ico">${ICONS[k]}</div><div>${sec.n}<small>${esc(areaAct().n)}<span class="deskonly"> · ${sec.sub}</span></small></div></div>`}
     <div class="topright">${k==='inicio'?'':`<div class="sync">${syncHTML()}</div>`}${k!=='ajustes'?`<button class="iconbtn mobonly" data-tab="ajustes" aria-label="Ajustes">${ICONS.ajustes}</button>`:''}</div></div>
     ${showTri?`<div class="trirow"><div class="seg" id="triSeg">${TRI_N.map((n,i)=>`<button class="${UI.tri===i?'on':''}" data-tri="${i}">${n}</button>`).join('')}</div></div>`:''}`;
  document.getElementById('tabs').innerHTML=`<div class="in">${MOBNAV.map(n=>`<button class="${k===n?'on':''}" data-tab="${n}" style="${secVars(n)}">${ICONS[n]}${SECS[n].n}</button>`).join('')}</div>`;
}
function resumen(){
  const als=S.config.alumnos,regs=periodRegs();
  let tot=0,ev=0;const alertAl=new Set();
  als.forEach(al=>CRITS.forEach(x=>{if(!aplica(al,x.c))return;tot++;const v=nivelMedio(regs,al.id,x.c);if(v!=null){ev++;if(v<2)alertAl.add(al.id)}}));
  const sinEval=CRITS.filter(x=>als.some(al=>aplica(al,x.c))&&!regs.some(r=>r.t==='niv'&&r.c===x.c)).length;
  return {als:als.length,tot,ev,alertas:alertAl.size,sinEval,pct:tot?Math.round(ev/tot*100):0};
}
function vInicio(){
  const r=resumen();
  const tiles=[
   ['evaluar','Criterios y rúbricas',!r.als?'Sin alumnos':r.sinEval?`${r.sinEval} sin evaluar`:'Todos con datos'],
   ['clase','Mapa de calor y alertas',!r.als?'Sin alumnos':r.alertas?`${r.alertas} con alertas`:'Sin alertas'],
   ['alumno','Ficha y seguimiento',`${r.als} ${r.als===1?'alumno':'alumnos'}`],
   ['seneca','Traslado de notas',`${r.pct} % con nota`],
   ['prog','Unidades y situaciones','Próximamente'],
   ['ajustes','Datos y copias',Sync.ok()?(OPS.length?`${OPS.length} pendientes`:'Sincronizado'):'Sin sincronizar']
  ];
  return `<div class="hero2"><span class="yr">${cursoEsc().replace('/',' / ')}</span><img class="cap" src="icons/logo.svg" alt=""><h1>Evalú<span>app</span></h1><p>Tu herramienta docente</p>
   <svg class="wave" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 70 C200 20 380 110 600 66 C820 22 1000 96 1200 50 L1200 120 L0 120Z" fill="rgba(94,230,204,.10)"/><path d="M0 92 C240 50 420 120 640 86 C860 52 1020 110 1200 78 L1200 120 L0 120Z" fill="rgba(72,140,230,.12)"/></svg></div>
  <button class="areacard" data-act="area"><div class="ico">${ICONS.area}</div><div><b>${esc(areaAct().n)}</b><span>2.º ciclo · ${TRI_N[UI.tri]==='Curso'?'curso completo':TRI_N[UI.tri].replace('trim.','trimestre')}</span></div><div class="chg">Cambiar ${ICONS.chev.replace('<svg','<svg width="16" height="16"')}</div></button>
  <div class="tiles">${tiles.map(([k,sub,live])=>`<button class="tile ${k==='prog'?'soon':''}" ${k==='prog'?'data-act="prox"':`data-tab="${k}"`} style="--ts:var(--t-${k});--ta:var(--a-${k})">${ICONS[k]}<b>${SECS[k].n}</b><span class="sub">${sub}</span><span class="live">${esc(live)}</span></button>`).join('')}</div>`;
}
function areaModal(){
  modal(`<h3>Área</h3>${AREAS.map(a=>`<button class="opt ${a.id===UI.area?'on':''}" data-area="${a.id}" ${a.on?'':'disabled'}><div><b>${esc(a.n)}</b><span>${a.ciclo}</span></div><span class="badge">${a.id===UI.area?'Activa':a.on?'Disponible':'Próximamente'}</span></button>`).join('')}<p class="small muted" style="margin:14px 2px 0">El alumnado es el mismo en todas las áreas; los criterios y las notas son propios de cada una.</p><div class="btns" style="justify-content:flex-end;margin-top:12px"><button class="btn" data-close>Cerrar</button></div>`,(m,close)=>{m.addEventListener('click',e=>{const b=e.target.closest('[data-area]');if(b&&!b.disabled){UI.area=b.dataset.area;try{localStorage.setItem('evaluapp-area',UI.area)}catch(_){ }close();render()}})});
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
  const cr=CRIT[UI.crit];
  const regsHoy=allRegs().filter(r=>r.f===UI.fecha);
  const shown=als.filter(a=>UI.filtro==='todos'||a.curso===UI.filtro);
  return `<h2>Evaluar</h2>
  <div class="card stack">
    <div class="toolbar" style="margin:0">
      <div class="field" style="flex:1;min-width:150px"><label>Fecha</label><input type="date" id="fecha" value="${UI.fecha}"></div>
      <div class="field" style="flex:1;min-width:150px"><label>Curso</label><div class="seg" id="filtro">${[['todos','Todos'],['3','3.º'],['4','4.º']].map(([k,n])=>`<button data-filtro="${k}" class="${UI.filtro===k?'on':''}">${n}</button>`).join('')}</div></div>
    </div>
    <div class="critbar">${CRITS.map(x=>`<button class="chip ${UI.crit===x.c?'on':''}" data-crit="${x.c}">${x.c}${x.core?'<span class="core">★</span>':''}</button>`).join('')}</div>
    <div class="critinfo"><div><div class="ce">CE${cr.ce} · ${CES[cr.ce]}</div><div class="t">${cr.c} ${esc(cr.t)}</div>
      <div class="small muted" style="margin-top:4px">${cr.d3?`<b>3.º:</b> ${esc(cr.d3)}<br>`:''}<b>4.º:</b> ${esc(cr.d4)}</div></div>
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
  const als=alumnosOrd();
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
  let t=`Informe de Matemáticas · ${al.nombre} (${al.curso}.º) · ${per}\n\n`;
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
const VIEWS={inicio:vInicio,evaluar:vEvaluar,clase:vClase,alumno:vAlumno,seneca:vSeneca,ajustes:vAjustes};
function render(){
  const act=document.activeElement;if(act&&['alNom','syUrl','syKey'].includes(act.id))return;
  renderChrome();document.getElementById('view').innerHTML=VIEWS[UI.tab]();
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
  if(d.tab){UI.tab=d.tab;render();scrollTo(0,0);return}
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
    case 'prox':toast('Programación llegará en la próxima versión');break;
    case 'demo':demo();break;
    case 'informe':copiar(informeTexto(S.config.alumnos.find(a=>a.id===UI.alumno)));break;
    case 'copySen':copiar(senecaTSV('\t'));break;
    case 'csvSen':descargar(`seneca-mates-${UI.curso}-${['1T','2T','3T','curso'][UI.tri]}.csv`,'﻿'+senecaTSV(';'));break;
    case 'backup':descargar(`evaluapp-copia-${today()}.json`,JSON.stringify(S,null,1),'application/json');break;
    case 'wipe':confirmar('¿Borrar todos los alumnos y registros? Descarga antes una copia.','Borrar todo',()=>{allRegsRaw().forEach(r=>{dropReg(r.id);OPS.push({op:'del',id:r.id})});S.config=Object.assign(DEF_CONFIG(),{notas:S.config.notas,tri:S.config.tri});saveConfig();render();toast('Datos borrados')});break;
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
  if(t.id==='fecha'){UI.fecha=t.value||today();render()}
  else if(t.id==='selAl'){UI.alumno=t.value;render()}
  else if(t.dataset.nota!==undefined){const v=Math.max(1,Math.min(10,+t.value||1));S.config.notas=S.config.notas.slice();S.config.notas[+t.dataset.nota]=v;saveConfig();render()}
  else if(t.dataset.tri&&t.type==='date'){const [i,j]=t.dataset.tri.split('|').map(Number);S.config.tri=S.config.tri.map(x=>x.slice());S.config.tri[i][j]=t.value;saveConfig();render()}
  else if(t.id==='restore'&&t.files[0]){const fr=new FileReader();fr.onload=()=>{try{const d=JSON.parse(fr.result);if(!d.config||!d.months)throw 0;confirmar('¿Sustituir los datos actuales por los de la copia?','Restaurar',()=>{allRegsRaw().forEach(r=>OPS.push({op:'del',id:r.id}));S.config=Object.assign(DEF_CONFIG(),d.config);S.months=d.months;allRegsRaw().forEach(r=>OPS.push({op:'up',r}));saveConfig();render();toast('Copia restaurada')})}catch(err){toast('Ese archivo no es una copia válida')}};fr.readAsText(t.files[0]);t.value=''}
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
loadLocal();try{const a=localStorage.getItem('evaluapp-area');if(a&&AREAS.some(x=>x.id===a&&x.on))UI.area=a}catch(e){}UI.tri=guessTri();if(UI.tri===3)UI.tri=0;render();Sync.status();Sync.run();
