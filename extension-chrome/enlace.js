/* Evalúapp para Séneca · se ejecuta en Evalúapp: toma la conexión con tu hoja sin tener que copiar ningún enlace */
(async () => {
  let s = null;
  try { s = JSON.parse(localStorage.getItem('evaluapp-sync') || 'null'); } catch (e) { }
  if (!s || !s.url || !s.key) return;
  const api = globalThis.browser || globalThis.chrome;
  let prev;
  try { if (!api.runtime || !api.runtime.id) return; prev = await api.storage.local.get(['url', 'key']); } catch (e) { return; }
  if (prev.url === s.url && prev.key === s.key) return;
  try { await api.storage.local.set({ url: s.url, key: s.key }); } catch (e) { return; }
  const d = document.createElement('div');
  d.textContent = 'Extensión de Séneca conectada con tu hoja';
  d.style.cssText = 'position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:99999;background:#1f2640;color:#fff;font:600 14px Inter,system-ui,sans-serif;padding:10px 16px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.25)';
  document.body.appendChild(d); setTimeout(() => d.remove(), 4000);
})();
