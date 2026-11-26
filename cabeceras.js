/* Evalúapp · cabeceras originales para el plan diario (sin personajes ni marcas de terceros). */
const CABECERAS = {
 heroes: { n: 'Superpoderes', svg: (t) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
 <defs>
  <pattern id="ht" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3" fill="#000" opacity=".08"/></pattern>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient>
 </defs>
 <rect width="300" height="300" fill="#e9a6a6"/><rect x="300" width="300" height="300" fill="#9fb4dc"/><rect x="600" width="300" height="300" fill="#f2d27a"/><rect x="900" width="300" height="300" fill="#e9a6a6"/>
 <rect width="1200" height="300" fill="url(#ht)"/>
 <g fill="#ffffff" opacity=".35">${[...Array(12)].map((_,i)=>`<polygon points="600,150 ${600+900*Math.cos(i*Math.PI/6)},${150+900*Math.sin(i*Math.PI/6)} ${600+900*Math.cos(i*Math.PI/6+.18)},${150+900*Math.sin(i*Math.PI/6+.18)}"/>`).join('')}</g>
 <path d="M0 300V232h40v-30h34v18h30v-52h44v64h26v-36h40v46h30v-80h52v70h24v-40h38v54h30v-24h44v-60h40v84h28v-44h46v58h24v-96h54v80h26v-34h40v50h30v-70h46v58h24v-30h44v46h30v-84h50v74h26v-40h42v52h30v-60h44v72h28v-30h44v40h40V300Z" fill="#5b5f8a" opacity=".55"/>
 <rect width="1200" height="300" fill="url(#fade)"/>
 <g transform="translate(600,58) scale(1.18,1)"><path d="M-170 -26 L-150 -40 L-120 -30 L-90 -44 L-60 -32 L-20 -46 L10 -32 L50 -46 L80 -30 L120 -42 L150 -28 L176 -36 L166 -10 L182 10 L160 22 L170 44 L136 36 L110 50 L76 38 L40 52 L6 38 L-30 50 L-62 36 L-96 48 L-126 34 L-160 44 L-152 20 L-180 8 L-160 -8Z" fill="#fff8d6" stroke="#2b2b2b" stroke-width="3"/>
  <text y="14" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="40" letter-spacing="2" fill="#d6453d" transform="scale(0.85,1)" stroke="#2b2b2b" stroke-width="1.2">¡HOY PUEDES SER UN HÉROE!</text></g>
 <text x="600" y="210" text-anchor="middle" font-family="'Amatic SC', 'Comic Sans MS', cursive" font-weight="700" font-size="92" fill="#2f6f77">${t}</text>
</svg>`},
 pizarra: { n: 'Pizarra', svg: (t) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
 <defs><radialGradient id="pz" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#3f6b55"/><stop offset="1" stop-color="#26463a"/></radialGradient></defs>
 <rect width="1200" height="300" fill="url(#pz)"/>
 <rect x="0" y="282" width="1200" height="18" fill="#8a6a45"/><rect x="0" y="0" width="1200" height="12" fill="#8a6a45"/>
 <g fill="none" stroke="#f4f1e6" stroke-width="3" stroke-linecap="round" opacity=".55">
  <text x="70" y="90" font-family="'Amatic SC',cursive" font-size="54" fill="#f4f1e6" stroke="none">2 + 3 = 5</text>
  <text x="980" y="96" font-family="'Amatic SC',cursive" font-size="58" fill="#f4f1e6" stroke="none">A b C</text>
  <circle cx="1080" cy="220" r="10"/><ellipse cx="1080" cy="220" rx="44" ry="16"/><ellipse cx="1080" cy="220" rx="44" ry="16" transform="rotate(60 1080 220)"/><ellipse cx="1080" cy="220" rx="44" ry="16" transform="rotate(-60 1080 220)"/>
  <path d="M110 230 l60 -40 l14 14 l-60 40 z M110 230 l-6 22 l20 -8"/>
  <path d="M230 210 q20 -30 40 0 t40 0"/>
  <path d="M900 230 l30 -50 l30 50 z"/>
 </g>
 <text x="600" y="190" text-anchor="middle" font-family="'Amatic SC', cursive" font-weight="700" font-size="96" fill="#fbf8ee">${t}</text>
 <path d="M380 222 q220 18 440 0" stroke="#f2d27a" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
</svg>`},
 acuarela: { n: 'Acuarela', svg: (t) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
 <defs><filter id="blur"><feGaussianBlur stdDeviation="28"/></filter></defs>
 <rect width="1200" height="300" fill="#fbf8f2"/>
 <g filter="url(#blur)" opacity=".75"><circle cx="120" cy="80" r="130" fill="#9fd5c9"/><circle cx="420" cy="230" r="120" fill="#f6c8b8"/><circle cx="760" cy="60" r="140" fill="#c9c2ef"/><circle cx="1080" cy="220" r="150" fill="#f7e19c"/></g>
 <g fill="#2f6f77" opacity=".35"><circle cx="980" cy="70" r="6"/><circle cx="1010" cy="96" r="4"/><circle cx="210" cy="240" r="5"/><circle cx="240" cy="214" r="3"/></g>
 <text x="600" y="185" text-anchor="middle" font-family="'Amatic SC', cursive" font-weight="700" font-size="96" fill="#2f5560">${t}</text>
</svg>`},
 espacio: { n: 'Espacio', svg: (t) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
 <defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2550"/><stop offset="1" stop-color="#3b2a6b"/></linearGradient></defs>
 <rect width="1200" height="300" fill="url(#sky)"/>
 <g fill="#fff">${[...Array(70)].map((_,i)=>`<circle cx="${(i*173)%1200}" cy="${(i*97)%300}" r="${(i%3)*0.8+0.6}" opacity="${0.4+(i%5)/10}"/>`).join('')}</g>
 <circle cx="1060" cy="90" r="46" fill="#f2b880"/><ellipse cx="1060" cy="90" rx="78" ry="14" fill="none" stroke="#f7dcb0" stroke-width="5" transform="rotate(-18 1060 90)"/>
 <g transform="translate(130 200) rotate(-35)"><path d="M0 -60 q22 26 22 70 h-44 q0 -44 22 -70z" fill="#eef1f8"/><circle cy="-8" r="9" fill="#6fb6e8"/><path d="M-22 10 l-16 22 h16z M22 10 l16 22 h-16z" fill="#e2675e"/><path d="M-12 12 q12 34 24 0z" fill="#f2b84b"/></g>
 <text x="600" y="190" text-anchor="middle" font-family="'Amatic SC', cursive" font-weight="700" font-size="96" fill="#ffffff">${t}</text>
</svg>`}
};
