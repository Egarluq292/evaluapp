/**
 * Evalúapp · script de la hoja de Google · versión 1.3 (guarda también tu imagen de cabecera para todos tus dispositivos).
 *
 * Cómo instalarlo (una sola vez):
 * 1. Crea una hoja de cálculo nueva en el Drive de tu cuenta de educaand.
 * 2. Extensiones → Apps Script. Borra lo que haya y pega este archivo entero. Guarda.
 * 3. Elige la función «configurar» arriba y pulsa Ejecutar. Acepta los permisos.
 *    En el registro de ejecución aparecerá tu CLAVE: cópiala.
 * 4. Implementar → Nueva implementación → tipo «Aplicación web».
 *    Ejecutar como: Yo. Quién tiene acceso: Cualquier usuario.
 *    Copia la URL que acaba en /exec.
 * 5. En Evalúapp → Ajustes → Sincronización con Google, pega la URL y la clave.
 *
 * La clave NUNCA se sube al repositorio: solo está aquí y en tus dispositivos.
 */

const HOJA_REG = 'registros';
const HOJA_CFG = 'config';
const HOJA_AL = 'alumnos';
const COLS = ['id', 'tipo', 'alumno', 'criterio', 'nivel', 'fecha', 'texto', 'actualizado', 'area'];

function configurar() {
  const props = PropertiesService.getScriptProperties();
  let clave = props.getProperty('CLAVE');
  if (!clave) {
    clave = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('CLAVE', clave);
  }
  hoja_(HOJA_REG, COLS);
  hoja_(HOJA_AL, ['id', 'nombre', 'curso']);
  hoja_(HOJA_CFG);
  Logger.log('Tu clave para Evalúapp es: ' + clave);
}

/** Si alguna vez crees que la clave se ha filtrado, ejecuta esto y pon la nueva en la app. */
function cambiarClave() {
  PropertiesService.getScriptProperties().deleteProperty('CLAVE');
  configurar();
}

function doGet() {
  return salida_({ ok: true, app: 'Evalúapp' });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return salida_({ ok: false, error: 'Petición no válida' });
  }
  const clave = PropertiesService.getScriptProperties().getProperty('CLAVE');
  if (!clave || body.key !== clave) return salida_({ ok: false, error: 'Clave incorrecta' });

  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    if (body.action === 'ping') return salida_({ ok: true });
    if (body.action === 'pull') return salida_(Object.assign({ ok: true }, leerTodo_()));
    if (body.action === 'doc') return salida_(Object.assign({ ok: true }, crearDoc_(body)));
    if (body.action === 'cabPut') { guardarCab_(String(body.img || '')); return salida_({ ok: true }); }
    if (body.action === 'cabGet') return salida_({ ok: true, img: leerCab_() });
    if (body.action === 'push') {
      aplicar_(body.ops || []);
      return salida_({ ok: true });
    }
    return salida_({ ok: false, error: 'Acción desconocida' });
  } catch (err) {
    return salida_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function salida_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function hoja_(nombre, cabecera) {
  const ss = SpreadsheetApp.getActive();
  let h = ss.getSheetByName(nombre);
  if (!h) {
    h = ss.insertSheet(nombre);
    h.getRange('A:I').setNumberFormat('@'); // texto: evita que Sheets convierta fechas y niveles
    if (cabecera) {
      h.getRange(1, 1, 1, cabecera.length).setValues([cabecera]).setFontWeight('bold');
      h.setFrozenRows(1);
    }
  }
  if (cabecera && h.getLastColumn() < cabecera.length) {
    // hoja creada con una versión anterior: se añaden las columnas nuevas
    h.getRange(1, 1, 1, cabecera.length).setValues([cabecera]).setFontWeight('bold');
    h.getRange(1, 1, h.getMaxRows(), cabecera.length).setNumberFormat('@');
  }
  return h;
}

function fecha_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v);
}

function leerTodo_() {
  const raw = hoja_(HOJA_CFG).getRange('A1').getValue();
  const config = raw ? JSON.parse(raw) : null;
  const h = hoja_(HOJA_REG, COLS);
  const n = h.getLastRow() - 1;
  const regs = [];
  if (n > 0) {
    h.getRange(2, 1, n, COLS.length).getValues().forEach(v => {
      if (!v[0]) return;
      const r = { id: String(v[0]), t: String(v[1]), a: String(v[2]), c: String(v[3] || ''), f: fecha_(v[5]), ar: String(v[8] || 'mat') };
      if (r.t === 'niv') r.n = Number(v[4]); else r.txt = String(v[6]);
      regs.push(r);
    });
  }
  return { config: config, regs: regs };
}

function aplicar_(ops) {
  const h = hoja_(HOJA_REG, COLS);
  const n = h.getLastRow() - 1;
  let datos = n > 0 ? h.getRange(2, 1, n, COLS.length).getValues() : [];
  const idx = {};
  datos.forEach((v, i) => { if (v[0]) idx[v[0]] = i; });
  const ahora = new Date().toISOString();
  let tocado = false;

  ops.forEach(op => {
    if (op.op === 'up' && op.r && op.r.id) {
      const r = op.r;
      const fila = [r.id, r.t, r.a, r.c || '', r.t === 'niv' ? r.n : '', r.f, r.txt || '', ahora, r.ar || 'mat'];
      if (r.id in idx) datos[idx[r.id]] = fila;
      else { idx[r.id] = datos.length; datos.push(fila); }
      tocado = true;
    } else if (op.op === 'del' && op.id in idx) {
      datos[idx[op.id]] = null;
      delete idx[op.id];
      tocado = true;
    } else if (op.op === 'config' && op.config) {
      hoja_(HOJA_CFG).getRange('A1').setNumberFormat('@').setValue(JSON.stringify(op.config));
      escribirAlumnos_(op.config.alumnos || []);
    }
  });

  if (!tocado) return;
  datos = datos.filter(Boolean);
  if (n > 0) h.getRange(2, 1, n, COLS.length).clearContent();
  if (datos.length) {
    h.getRange(2, 1, datos.length, COLS.length)
      .setNumberFormat('@')
      .setValues(datos.map(f => f.map(x => String(x))));
  }
}

function escribirAlumnos_(alumnos) {
  const h = hoja_(HOJA_AL, ['id', 'nombre', 'curso']);
  const n = h.getLastRow() - 1;
  if (n > 0) h.getRange(2, 1, n, 3).clearContent();
  if (alumnos.length) {
    h.getRange(2, 1, alumnos.length, 3).setNumberFormat('@')
      .setValues(alumnos.map(a => [a.id, a.nombre, a.curso]));
  }
}

/** Crea un documento de Google con el plan de clase y devuelve su enlace. */
function crearDoc_(b) {
  const doc = DocumentApp.create(String(b.titulo || 'Plan de clase · Evalúapp'));
  const cuerpo = doc.getBody();
  const H = DocumentApp.ParagraphHeading;
  (b.bloques || []).forEach(x => {
    const t = String(x.t || '');
    if (x.k === 'h1') cuerpo.appendParagraph(t).setHeading(H.HEADING1);
    else if (x.k === 'h2') cuerpo.appendParagraph(t).setHeading(H.HEADING2);
    else if (x.k === 'h3') cuerpo.appendParagraph(t).setHeading(H.HEADING3);
    else if (x.k === 'li') cuerpo.appendListItem(t).setGlyphType(DocumentApp.GlyphType.BULLET);
    else cuerpo.appendParagraph(t);
  });
  const primero = cuerpo.getChild(0);
  if (cuerpo.getNumChildren() > 1 && primero.getType() === DocumentApp.ElementType.PARAGRAPH && !primero.asParagraph().getText()) primero.removeFromParent();
  doc.saveAndClose();
  return { url: doc.getUrl() };
}

/** Ejecútala una vez desde el editor para dar permiso a crear documentos. Crea uno de prueba y lo manda a la papelera. */
function autorizarDocumentos() {
  const d = DocumentApp.create('Prueba Evalúapp');
  DriveApp.getFileById(d.getId()).setTrashed(true);
  Logger.log('Permisos concedidos. Ya puedes crear planes desde Evalúapp.');
}

/* ---- Imagen de cabecera del plan (troceada: una celda admite 50 000 caracteres) ---- */
const HOJA_CAB = 'cabecera';
function guardarCab_(img) {
  const h = hoja_(HOJA_CAB);
  h.clear();
  if (!img) return;
  const trozos = [];
  for (let i = 0; i < img.length; i += 40000) trozos.push([img.slice(i, i + 40000)]);
  h.getRange(1, 1, trozos.length, 1).setNumberFormat('@').setValues(trozos);
}
function leerCab_() {
  const h = hoja_(HOJA_CAB);
  const n = h.getLastRow();
  if (!n) return '';
  return h.getRange(1, 1, n, 1).getValues().map(v => String(v[0] || '')).join('');
}

