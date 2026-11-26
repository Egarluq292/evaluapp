/* Evalúapp para Séneca · fondo: habla con la hoja de Google de Evalúapp */
browser.runtime.onMessage.addListener(async (msg) => {
  if (!msg || msg.tipo !== 'leer') return;
  const { url, key } = await browser.storage.local.get(['url', 'key']);
  if (!url || !key) return { error: 'Falta conectar la extensión con tu hoja.' };
  let r;
  try {
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key, action: 'pull' }) });
  } catch (e) { return { error: 'No hay conexión con tu hoja de Google.' }; }
  let j;
  try { j = await r.json(); } catch (e) { return { error: 'La hoja no ha respondido bien. Revisa la conexión.' }; }
  if (!j.ok) return { error: j.error || 'La hoja ha rechazado la petición (¿clave cambiada?).' };
  return { senPend: (j.config && j.config.senPend) || {} };
});
