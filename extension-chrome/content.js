const browser = globalThis.browser || globalThis.chrome;
/* Evalúapp para Séneca · se ejecuta en las páginas de Séneca.
   Solo actúa en la ventana de calificar una actividad (selector de alumnado + casillas de nota por criterio). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const norm = t => String(t || '').normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();
  const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const RE_COD = /^\s*([A-ZÑ]{2,6}\.\d+\.\d+\.\d+)\./;

  /* ---------- lectura de la ventana de Séneca ---------- */
  const ventana = () => { const s = $('#selecbuscadoralumnado'); return s ? s.closest('.modal-content') || document : null; };
  const alumnoActual = () => { const s = $('#selecbuscadoralumnado'); return s && s.selectedOptions[0] ? s.selectedOptions[0].textContent.trim() : ''; };
  const idActual = () => { const i = $('#X_NOTACTEVA'); return i ? i.value : ''; };
  const listaAlumnos = () => $$('#selecbuscadoralumnado option').map(o => o.textContent.trim());
  function casillas() {
    const v = ventana(); if (!v) return [];
    return $$('input.notaCriterioModal', v).map(inp => {
      const td = inp.closest('td') || inp.closest('tr');
      const lab = td ? $('label', td) : null;
      const m = lab ? lab.textContent.match(RE_COD) : null;
      return m ? { inp, cod: m[1] } : null;
    }).filter(Boolean);
  }
  const claveActividad = () => { const c = casillas()[0]; return c ? c.cod.split('.').slice(0, 2).join('.') : ''; };
  const botonGuardar = () => $$('.modal-footer button', ventana() || document).find(b => /guardar/i.test(b.textContent));

  /* ---------- estado ---------- */
  let tabla = null; // { area, curso, tri, gen, datos:{ 'Apellidos, Nombre': { 'MAT.3.1.1': '7.67' } } }
  let porNombre = {};
  let nombresTabla = [];
  const tituloSeneca = () => { const h = $('.modal-title', ventana() || document); return h ? (h.childNodes[0] ? h.childNodes[0].textContent : h.textContent).trim() : ''; };
  let sobrescribir = false;
  let ocupado = false;

  async function leerTabla() {
    const r = await browser.runtime.sendMessage({ tipo: 'leer' });
    if (!r || r.error) throw new Error(r ? r.error : 'No se pudo leer la hoja.');
    const clave = claveActividad();
    const sp = r.senPend || {};
    const fuentes = sp.ult ? [sp.ult] : Object.values(sp);
    tabla = fuentes.length ? fuentes[0] : null;
    porNombre = {}; nombresTabla = [];
    fuentes.forEach(t => Object.entries(t.datos || {}).forEach(([n, o]) => { const k = norm(n); if (!porNombre[k]) nombresTabla.push(n); porNombre[k] = Object.assign(porNombre[k] || {}, o); }));
    return clave;
  }

  /* Rellena las casillas del alumno que está abierto. Devuelve un resumen. */
  function rellenarActual() {
    const notas = porNombre[norm(alumnoActual())];
    const res = { alumno: alumnoActual(), puestas: 0, yaTenian: 0, sinDato: 0, sinAlumno: !notas };
    if (!notas) return res;
    casillas().forEach(({ inp, cod }) => {
      const v = notas[cod];
      if (v == null || v === '') { res.sinDato++; return; }
      if (inp.value !== '' && !sobrescribir) { res.yaTenian++; return; }
      const n = Math.max(1, Math.min(10, parseFloat(v)));
      if (!isFinite(n)) { res.sinDato++; return; }
      inp.focus();
      inp.value = String(Math.round(n * 100) / 100);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
      inp.blur();
      res.puestas++;
    });
    return res;
  }

  async function guardarYEsperar() {
    const b = botonGuardar(); if (!b) throw new Error('No encuentro el botón «Guardar y continuar».');
    const antes = idActual();
    b.click();
    for (let t = 0; t < 100; t++) { // hasta 20 s
      await espera(200);
      if (idActual() && idActual() !== antes && casillas().length) { await espera(300); return true; }
      if (!ventana()) return false; // la ventana se ha cerrado
    }
    throw new Error('Séneca no ha pasado al siguiente alumno. Revisa si ha mostrado algún aviso.');
  }

  /* ---------- interfaz ---------- */
  const escala = () => Math.max(1, Math.min(3, window.innerWidth / (screen.width || window.innerWidth)));
  function css() {
    if ($('#evp-css')) return;
    const st = document.createElement('style'); st.id = 'evp-css';
    st.textContent = `
#evp-fab{position:fixed;right:14px;bottom:18px;z-index:2147483646;border:0;border-radius:999px;padding:.7em 1.1em;font:700 15px/1 system-ui,sans-serif;background:#7c5cff;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.35);transform-origin:bottom right}
#evp-panel{position:fixed;inset:auto 0 0 0;z-index:2147483647;background:#14213a;color:#eef2fb;font:15px/1.45 system-ui,sans-serif;border-radius:18px 18px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.4);padding:16px 16px 20px;max-height:85vh;overflow:auto;transform-origin:bottom left}
#evp-panel h3{margin:0 0 6px;font-size:18px}#evp-panel p{margin:6px 0}
#evp-panel .evp-box{background:#1c2c4a;border-radius:12px;padding:10px 12px;margin:10px 0}
#evp-panel .evp-warn{background:#3a2c12;color:#ffe2a8}#evp-panel .evp-ok{background:#123a2a;color:#b8f3d6}#evp-panel .evp-err{background:#3a1620;color:#ffc2cc}
#evp-panel button{border:0;border-radius:12px;padding:12px 14px;font:700 15px system-ui,sans-serif;margin:6px 0;width:100%;background:#2a3b5e;color:#eef2fb}
#evp-panel button.evp-pri{background:#7c5cff;color:#fff}#evp-panel button:disabled{opacity:.45}
#evp-panel label{display:flex;gap:10px;align-items:center;margin:8px 0}#evp-panel input[type=checkbox]{width:20px;height:20px}
#evp-panel textarea{width:100%;min-height:70px;border-radius:10px;border:1px solid #3b4d72;background:#0e1830;color:#eef2fb;padding:8px;font:14px system-ui,sans-serif;box-sizing:border-box}
#evp-panel .evp-x{position:absolute;right:10px;top:8px;width:auto;background:none;font-size:22px;padding:4px 10px;margin:0}
#evp-panel ul{margin:4px 0 0;padding-left:20px}`;
    document.head.appendChild(st);
  }
  function aplicarEscala(el) { const e = escala(); el.style.zoom = ''; if (e > 1.05) el.style.transform = `scale(${e})`; if (el.id === 'evp-panel' && e > 1.05) { el.style.right = 'auto'; el.style.width = (100 / e) + 'vw'; el.style.maxHeight = (85 / e) + 'vh'; el.style.boxSizing = 'border-box'; } }

  function panel(html) {
    let p = $('#evp-panel');
    if (!p) { p = document.createElement('div'); p.id = 'evp-panel'; document.body.appendChild(p); }
    p.innerHTML = `<button class="evp-x" data-evp="cerrar" aria-label="Cerrar">×</button>${html}`;
    aplicarEscala(p);
    return p;
  }
  const cerrar = () => { const p = $('#evp-panel'); if (p) p.remove(); };

  async function abrir() {
    const { url, key } = await browser.storage.local.get(['url', 'key']);
    if (!url || !key) return pantallaConectar();
    if (!ventana() || !casillas().length) return panel(`<h3>Evalúapp</h3><div class="evp-box">Abre una actividad del cuaderno y la ventana de calificar a un alumno (la que tiene el selector de alumnos y las casillas de nota). Después vuelve a pulsar «Evalúapp».</div><button data-evp="conectar">Cambiar la conexión</button>`);
    panel(`<h3>Evalúapp</h3><div class="evp-box">Leyendo tus notas de la hoja…</div>`);
    let clave;
    try { clave = await leerTabla(); } catch (e) { return panel(`<h3>Evalúapp</h3><div class="evp-box evp-err">${esc(e.message)}</div><button data-evp="abrir">Reintentar</button><button data-evp="conectar">Cambiar la conexión</button>`); }
    if (!tabla) return panel(`<h3>Evalúapp</h3><div class="evp-box evp-warn">En tu hoja no hay ninguna actividad enviada.<br>En Evalúapp: Evaluar → abre la actividad → «Pasar a Séneca» → <b>«Enviar a la extensión»</b>.</div><button data-evp="abrir">Volver a leer</button>`);
    resumen(clave);
  }

  function resumen(clave, aviso = '') {
    const nombres = listaAlumnos();
    const conNotas = nombres.filter(n => porNombre[norm(n)]);
    const sinNotas = nombres.filter(n => !porNombre[norm(n)]);
    const enTabla = nombresTabla;
    const noEnSeneca = enTabla.filter(n => !nombres.some(x => norm(x) === norm(n)));
    const cods = new Set(casillas().map(c => c.cod));
    const codsTabla = new Set(Object.values(porNombre).flatMap(o => Object.keys(o)));
    const comunes = [...codsTabla].filter(c => cods.has(c));
    const gen = tabla.gen ? new Date(tabla.gen).toLocaleString('es-ES', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    const tit = tabla.titulo || '', tS = tituloSeneca();
    const cursos = tabla.cursos ? tabla.cursos.map(c => c + '.º').join(' y ') : (tabla.curso ? tabla.curso + '.º' : '');
    panel(`<h3>Evalúapp${tit ? ' · «' + esc(tit) + '»' : ' · ' + esc(clave)}</h3>
      <p>${esc(tabla.area || '')}${cursos ? ' · ' + esc(cursos) : ''}${tabla.tri ? ' · ' + esc(tabla.tri) : ''}${gen ? ` · enviado el ${esc(gen)}` : ''}</p>
      ${tit && tS && norm(tit) !== norm(tS) ? `<div class="evp-box evp-warn">Ojo: en Evalúapp la actividad se llama «${esc(tit)}» y en Séneca tienes abierta «${esc(tS)}». Comprueba que es la misma.</div>` : ''}
      ${aviso}
      <div class="evp-box">
        <b>${conNotas.length}</b> de ${nombres.length} alumnos de esta actividad tienen notas en Evalúapp.<br>
        <b>${comunes.length}</b> ${comunes.length === 1 ? 'criterio coincide' : 'criterios coinciden'} con los de esta actividad${comunes.length ? ` (${esc(comunes.join(', '))})` : ''}.
      </div>
      ${sinNotas.length ? `<div class="evp-box evp-warn">Sin notas en Evalúapp (no se tocan): ${esc(sinNotas.join('; '))}</div>` : ''}
      ${noEnSeneca.length ? `<div class="evp-box evp-warn">Nombres de Evalúapp que no aparecen aquí tal cual (revisa cómo los escribiste): ${esc(noEnSeneca.join('; '))}</div>` : ''}
      <label><input type="checkbox" id="evp-sob" ${sobrescribir ? 'checked' : ''}> Sustituir también las notas que ya hay en Séneca</label>
      <button class="evp-pri" data-evp="uno" ${comunes.length ? '' : 'disabled'}>Rellenar a ${esc(alumnoActual())}</button>
      <button data-evp="todos" ${comunes.length && conNotas.length ? '' : 'disabled'}>Rellenar y guardar a todos</button>
      <p style="font-size:13px;opacity:.8">«Rellenar» solo escribe en las casillas; para guardar pulsa «Guardar y continuar» de Séneca. «Rellenar y guardar a todos» lo hace alumno por alumno, empezando por el que está abierto.</p>`);
  }

  async function todos(clave) {
    const nombres = listaAlumnos();
    const empieza = nombres.indexOf(alumnoActual());
    const total = nombres.length - Math.max(0, empieza);
    if (!confirm(`Se rellenarán y GUARDARÁN en Séneca ${total} alumnos, desde ${alumnoActual()} hasta el final de la lista.\n${sobrescribir ? 'Se SUSTITUIRÁN las notas que ya existan.' : 'Las casillas que ya tienen nota no se tocan.'}\n\n¿Continuar?`)) return;
    ocupado = true; const log = [];
    try {
      for (let k = 0; k < total; k++) {
        panel(`<h3>Evalúapp</h3><div class="evp-box">Alumno ${k + 1} de ${total}: ${esc(alumnoActual())}…</div>`);
        const r = rellenarActual(); log.push(r);
        await espera(250);
        const sigue = await guardarYEsperar();
        if (!sigue) break;
        if (k < total - 1 && nombres.indexOf(alumnoActual()) <= nombres.indexOf(r.alumno)) break; // ha vuelto al principio
      }
      informe(clave, log, '');
    } catch (e) { informe(clave, log, e.message); }
    finally { ocupado = false; }
  }

  function informe(clave, log, error) {
    const puestas = log.reduce((a, r) => a + r.puestas, 0);
    panel(`<h3>Evalúapp</h3>
      ${error ? `<div class="evp-box evp-err">${esc(error)}</div>` : ''}
      <div class="evp-box evp-ok"><b>${puestas}</b> ${puestas === 1 ? 'nota puesta' : 'notas puestas'} en ${log.filter(r => r.puestas).length} alumnos.</div>
      <div class="evp-box"><ul>${log.map(r => `<li>${esc(r.alumno)}: ${r.sinAlumno ? 'sin notas en Evalúapp' : `${r.puestas} puestas${r.yaTenian ? `, ${r.yaTenian} ya tenían nota` : ''}`}</li>`).join('')}</ul></div>
      <p style="font-size:13px;opacity:.85">Comprueba dos o tres alumnos en el cuaderno de Séneca antes de dar el trabajo por terminado.</p>
      <button data-evp="cerrar">Cerrar</button>`);
  }

  function pantallaConectar(msg = '') {
    panel(`<h3>Conectar con Evalúapp</h3>
      <p><b>La forma fácil:</b> abre Evalúapp en este mismo navegador (con tu hoja conectada) y la extensión se conecta sola. Después vuelve aquí y pulsa «Evalúapp».</p>
      <p>O pega aquí el enlace de Evalúapp → Ajustes → Hoja de Google → «Conectar otro dispositivo». <b>No</b> es lo que copia «Enviar a la extensión»: ese botón solo deja las notas preparadas en tu hoja.</p>
      ${msg}
      <textarea id="evp-link" placeholder="https://egarluq292.github.io/evaluapp/#conectar=…"></textarea>
      <button class="evp-pri" data-evp="guardar-con">Conectar</button>`);
  }
  async function guardarConexion() {
    const t = ($('#evp-link') || {}).value || '';
    const m = t.match(/#conectar=([A-Za-z0-9+/=%_-]+)/);
    let c = null;
    try { c = JSON.parse(atob(decodeURIComponent(m[1]))); } catch (e) { }
    if (!c || !c.url || !c.key) return pantallaConectar('<div class="evp-box evp-err">Ese enlace no es válido. Cópialo entero desde Evalúapp.</div>');
    await browser.storage.local.set({ url: c.url, key: c.key });
    abrir();
  }

  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-evp]'); if (!b || ocupado) return;
    e.preventDefault(); e.stopPropagation();
    const a = b.dataset.evp, clave = claveActividad();
    if (a === 'cerrar') return cerrar();
    if (a === 'abrir') return abrir();
    if (a === 'conectar') return pantallaConectar();
    if (a === 'guardar-con') return guardarConexion();
    sobrescribir = !!($('#evp-sob') && $('#evp-sob').checked);
    if (a === 'uno') { const r = rellenarActual(); return resumen(clave, `<div class="evp-box ${r.puestas ? 'evp-ok' : 'evp-warn'}">${esc(r.alumno)}: ${r.sinAlumno ? 'no tiene notas en Evalúapp.' : `${r.puestas} ${r.puestas === 1 ? 'nota puesta' : 'notas puestas'}${r.yaTenian ? `; ${r.yaTenian} ya tenían nota y no se han tocado` : ''}. Pulsa «Guardar y continuar» en Séneca.`}</div>`); }
    if (a === 'todos') return todos(clave);
  }, true);

  /* Botón flotante: solo cuando está abierta la ventana de calificar */
  function boton() {
    css();
    let f = $('#evp-fab');
    const hay = !!$('#selecbuscadoralumnado');
    if (hay && !f) { f = document.createElement('button'); f.id = 'evp-fab'; f.type = 'button'; f.textContent = 'Evalúapp'; f.dataset.evp = 'abrir'; document.body.appendChild(f); aplicarEscala(f); }
    if (!hay && f && !ocupado) { f.remove(); cerrar(); }
  }
  new MutationObserver(() => boton()).observe(document.documentElement, { childList: true, subtree: true });
  boton();
})();
