# Evalúapp

App web (PWA) para evaluar por criterios y rúbricas en el aula y trasladar las notas a Séneca.
Primera área: Matemáticas, segundo ciclo de Primaria (Orden de 30 de mayo de 2023, Andalucía).

- **Web:** https://egarluq292.github.io/evaluapp/
- **Datos:** se guardan en el dispositivo y, si se conecta, en una hoja de Google de la cuenta de educaand mediante `apps-script/Codigo.gs`.
- **Nada de datos del alumnado ni claves en este repositorio**, que es público.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html`, `styles.css`, `app.js` | La app |
| `sw.js` | Funcionamiento sin conexión y actualización automática |
| `manifest.webmanifest`, `icons/` | Instalación como app |
| `apps-script/Codigo.gs` | Script de la hoja de Google (se pega en Apps Script, no se ejecuta desde aquí) |

## Al publicar cambios

1. Sube `APP_VERSION` en `app.js` (MAYOR.MENOR.PARCHE).
2. Sube el número de `CACHE` en `sw.js`.
