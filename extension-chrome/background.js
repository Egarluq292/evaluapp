/* Evalúapp para Séneca (Chrome) · fondo: habla con la hoja de Google de Evalúapp */
async function leer() {
  const { url, key } = await chrome.storage.local.get(['url', 'key']);
  if (!url || !key) return { error: 'Falta conectar la extensión con tu hoja.' };
  let r;
  try {
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key, action: 'pull' }) });
  } catch (e) { return { error: 'No hay conexión con tu hoja de Google.' }; }
  let j;
  try { j = await r.json(); } catch (e) { return { error: 'La hoja no ha respondido bien. Revisa la conexión.' }; }
  if (!j.ok) return { error: j.error || 'La hoja ha rechazado la petición (¿clave cambiada?).' };
  return { senPend: (j.config && j.config.senPend) || {} };
}
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg || msg.tipo !== 'leer') return false;
  leer().then(sendResponse, () => sendResponse({ error: 'Error inesperado al leer tu hoja.' }));
  return true;
});
