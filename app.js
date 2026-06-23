// ── Data ────────────────────────────────────────────────────────────────────

const NACIONALES = [
  'bogotá','bogota','medellín','medellin','cartagena','santa marta',
  'san andrés','san andres','cali','barranquilla','bucaramanga','pereira','armenia'
];

const AIRLINE_IMGS = {
  'avianca':         'https://res.cloudinary.com/ultragroup/image/upload/v1772570770/sxn0fhbwlotfqzxhlhap.webp',
  'american airlines':'https://res.cloudinary.com/ultragroup/image/upload/v1772570768/xumidaahozl7hocm5jsk.webp',
  'united airlines': 'https://res.cloudinary.com/ultragroup/image/upload/v1772570770/urvko6j4kut9njhnch5o.webp',
  'latam':           'https://res.cloudinary.com/ultragroup/image/upload/v1772570769/uo6j5nae4fqax8qtp8jf.webp',
  'alaska airlines': 'https://res.cloudinary.com/ultragroup/image/upload/v1772570768/oqtn7m0uf2ljxodp1dhv.webp',
  'iberia':          'https://res.cloudinary.com/ultragroup/image/upload/v1772570769/rch92idzggjwpl20uvkt.webp',
  'wingo':           'https://res.cloudinary.com/ultragroup/image/upload/v1772570770/t1abqdq7dq7lysskfs9x.webp',
  'delta':           'https://res.cloudinary.com/ultragroup/image/upload/v1772570769/wdqjlmkxwanbysefrcea.webp',
  'jetsmart':        'https://res.cloudinary.com/ultragroup/image/upload/v1772570769/pduonmi3w44gsulwohsw.webp',
  'aircanada':       'https://res.cloudinary.com/ultragroup/image/upload/v1772570768/cfnpu8vxygkbmwrbzznm.webp',
  'arajet':          'https://res.cloudinary.com/ultragroup/image/upload/v1772570768/hrjenfy8ovmw1wyjuheh.webp',
};

const TIPOS_BY_PROG = {
  'PCO':      ['VUELOS','HOTELES'],
  'FICOHSA':  ['VUELOS','HOTELES','PROMOS'],
  'AUSTRO':   ['VUELOS','HOTELES','PROMOS'],
  'TYP':      ['VUELOS','HOTELES'],
  'BANORTE':  ['VUELOS','HOTELES'],
  'DAVIBANK': ['VUELOS','HOTELES'],
  'COOPENAE': ['VUELOS'],
};

const SCHEMAS = {
  'PCO-VUELOS':       ['enlace','enlaceTipoDeAerolinea','aerolinea','pais','salida','puntos','precio','acumulacion','redencion'],
  'PCO-HOTELES':      ['enlace','pais','puntos','precio','acumulacion','redencion'],
  'DAVIBANK-VUELOS':  ['enlace','enlaceTipoDeAerolinea','aerolinea','pais','salida','puntos','precio','valor'],
  'DAVIBANK-HOTELES': ['descuento','enlace','pais','puntos','precio','valor'],
  'FICOHSA-VUELOS':   ['enlace','enlaceTipoDeAerolinea','aerolinea','pais','salida','puntos'],
  'FICOHSA-HOTELES':  ['enlace','pais','hotel','puntos','descuento','estrellas'],
  'FICOHSA-PROMOS':   ['enlace','pais','hotel','puntos','descuento','estrellas'],
  'AUSTRO-VUELOS':    ['enlace','enlaceTipoDeAerolinea','aerolinea','pais','salida','puntos'],
  'AUSTRO-HOTELES':   ['enlace','pais','hotel','puntos','descuento','estrellas'],
  'AUSTRO-PROMOS':    ['enlace','pais','hotel','puntos','descuento','estrellas'],
  'TYP-VUELOS':       ['enlace','enlaceTipoDeAerolinea','aerolinea','pais','puntos'],
  'TYP-HOTELES':      ['enlace','pais','hotel','descuento','puntos'],
  'BANORTE-VUELOS':   ['enlace','pais','puntos'],
  'BANORTE-HOTELES':  ['enlace','pais','hotel','descuento','puntos'],
  'COOPENAE-VUELOS':  ['enlace','enlaceTipoDeAerolinea','aerolinea','pais','salida','precio'],
};

const FIELD_LABELS = {
  enlace:'URL enlace', enlaceTipoDeAerolinea:'URL o nombre aerolínea',
  aerolinea:'aerolínea', pais:'país / ciudad', salida:'ciudad salida',
  puntos:'puntos', precio:'precio', acumulacion:'acumulación',
  redencion:'redención', valor:'valor total', descuento:'descuento',
  hotel:'hotel', estrellas:'estrellas',
};

// ── State ────────────────────────────────────────────────────────────────────

let prog = '', tipo = '', items = [];

// ── Helpers ──────────────────────────────────────────────────────────────────

const key    = () => `${prog}-${tipo}`;
const schema = () => SCHEMAS[key()] || [];
const isNal  = p  => NACIONALES.includes((p || '').toLowerCase().trim());

function resolveImg(item) {
  const raw = (item.enlaceTipoDeAerolinea || '').trim();
  if (raw.startsWith('http')) return raw;
  const a = (item.aerolinea || raw || '').toLowerCase().trim();
  for (const k of Object.keys(AIRLINE_IMGS)) {
    if (a.includes(k) || k.includes(a)) return AIRLINE_IMGS[k];
  }
  return raw;
}

function fmtNum(v) {
  return String(v || '').replace(/,/g, '.');
}

function sortItems() {
  const sf = (a, b) => {
    const pa = parseFloat((a.precio || a.puntos || '0').replace(/[^0-9]/g, ''));
    const pb = parseFloat((b.precio || b.puntos || '0').replace(/[^0-9]/g, ''));
    return pa - pb;
  };
  return [...items.filter(i => !isNal(i.pais)).sort(sf),
          ...items.filter(i =>  isNal(i.pais)).sort(sf)];
}

// ── UI helpers ───────────────────────────────────────────────────────────────

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.style.display = 'block';
}
function hideError() {
  document.getElementById('error-msg').style.display = 'none';
}

function setStatus(state, text) {
  const dot  = document.getElementById('status-dot');
  const txt  = document.getElementById('status-text');
  dot.className = 'status-dot ' + state;
  txt.textContent = text;
}

function showSection(id, show = true) {
  document.getElementById(id).style.display = show ? 'block' : 'none';
}

// ── Sidebar: Programa ─────────────────────────────────────────────────────────

document.getElementById('prog-list').addEventListener('click', e => {
  const btn = e.target.closest('.nav-item');
  if (!btn) return;
  prog = btn.dataset.prog;
  tipo = '';
  items = [];
  document.querySelectorAll('#prog-list .nav-item').forEach(b => b.classList.toggle('on', b === btn));
  renderTipoList();
  updateColsHint();
  resetUpload();
  updateTopbar();
});

function renderTipoList() {
  const list = document.getElementById('tipo-list');
  list.innerHTML = '';
  if (!prog) { list.innerHTML = '<p class="nav-empty">Elige un programa</p>'; return; }
  (TIPOS_BY_PROG[prog] || []).forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'nav-item' + (t === tipo ? ' on' : '');
    btn.dataset.tipo = t;
    btn.textContent = t;
    btn.addEventListener('click', () => selTipo(t));
    list.appendChild(btn);
  });
}

function selTipo(t) {
  tipo = t;
  items = [];
  document.querySelectorAll('#tipo-list .nav-item').forEach(b => b.classList.toggle('on', b.dataset.tipo === t));
  updateColsHint();
  resetUpload();
  updateTopbar();
  setStatus('', 'Esperando archivo');
}

function updateTopbar() {
  const title = document.getElementById('topbar-title');
  title.textContent = prog && tipo
    ? `${prog} — ${tipo}`
    : 'Generador de HTML turístico';
}

function updateColsHint() {
  const hint = document.getElementById('cols-hint');
  const ct   = document.getElementById('cols-text');
  if (!prog || !tipo) { hint.style.display = 'none'; return; }
  hint.style.display = 'flex';
  ct.textContent = schema().join('   ·   ');
}

// ── File upload ───────────────────────────────────────────────────────────────

const dropZone  = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('over');
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });

function resetUpload() {
  fileInput.value = '';
  items = [];
  showSection('section-preview', false);
  showSection('section-generate', false);
  showSection('section-output', false);
  document.getElementById('stats-chips').style.display = 'none';
  hideError();
}

function handleFile(file) {
  if (!prog || !tipo) { showError('Selecciona primero el programa y tipo de producto en el menú lateral.'); return; }
  hideError();
  const ext = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();
  reader.onload = e => {
    try {
      let rows = [];
      if (ext === 'csv') {
        const lines = e.target.result.split('\n').filter(l => l.trim());
        const headers = parseCSVLine(lines[0]);
        rows = lines.slice(1).map(l => {
          const vals = parseCSVLine(l);
          const obj = {};
          headers.forEach((h, i) => obj[h.trim().toLowerCase()] = (vals[i] || '').trim());
          return obj;
        });
      } else {
        const wb = XLSX.read(e.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        rows = rows.map(r => {
          const obj = {};
          Object.keys(r).forEach(k => obj[k.toLowerCase().trim()] = String(r[k]).trim());
          return obj;
        });
      }
      processRows(rows);
    } catch (err) {
      showError('Error al leer el archivo: ' + err.message);
    }
  };
  if (ext === 'csv') reader.readAsText(file);
  else reader.readAsBinaryString(file);
}

function parseCSVLine(line) {
  const res = []; let cur = ''; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') { inQ = !inQ; }
    else if (line[i] === ',' && !inQ) { res.push(cur.trim()); cur = ''; }
    else cur += line[i];
  }
  res.push(cur.trim());
  return res;
}

function processRows(rows) {
  const sch = schema();
  const valid = rows.filter(r => Object.values(r).some(v => v));
  if (!valid.length) { showError('El archivo está vacío o no tiene datos válidos.'); return; }

  items = valid.map(r => {
    const obj = {};
    sch.forEach(f => {
      obj[f] = String(r[f] || r[f.toLowerCase()] || '').trim();
    });
    return obj;
  });

  renderPreview();
  updateStats();
  showSection('section-preview', true);
  showSection('section-generate', true);
  showSection('section-output', false);
  setStatus('loaded', `${items.length} items listos`);
}

// ── Preview table ─────────────────────────────────────────────────────────────

function renderPreview() {
  const sch  = schema();
  const tbl  = document.getElementById('preview-table');
  const show = items.slice(0, 10);

  let html = `<thead><tr><th>#</th><th>Tipo</th>`;
  sch.forEach(f => html += `<th>${FIELD_LABELS[f] || f}</th>`);
  html += `</tr></thead><tbody>`;

  show.forEach((it, i) => {
    const n = isNal(it.pais);
    html += `<tr><td style="color:#888">${i + 1}</td><td><span class="badge ${n ? 'badge-nal' : 'badge-int'}">${n ? 'Nal' : 'Int'}</span></td>`;
    sch.forEach(f => html += `<td title="${it[f] || ''}">${it[f] || '—'}</td>`);
    html += `</tr>`;
  });

  if (items.length > 10) {
    html += `<tr><td colspan="${sch.length + 2}" style="text-align:center;padding:10px;font-size:11px;color:#888">
      <span class="badge badge-more">+ ${items.length - 10} filas más</span>
    </td></tr>`;
  }
  html += `</tbody>`;
  tbl.innerHTML = html;
}

function updateStats() {
  const intC = items.filter(it => !isNal(it.pais)).length;
  const nalC = items.filter(it =>  isNal(it.pais)).length;
  document.getElementById('s-total').textContent = items.length;
  document.getElementById('s-int').textContent   = intC;
  document.getElementById('s-nal').textContent   = nalC;
  document.getElementById('stats-chips').style.display = 'flex';
}

// ── Generate HTML ─────────────────────────────────────────────────────────────

function generateHTML() {
  const sorted = sortItems();
  const k = key();
  let html = '';

  sorted.forEach((item, i) => {
    const n      = i + 1;
    const img    = resolveImg(item);
    const puntos = fmtNum(item.puntos);
    const precio = fmtNum(item.precio);
    const valor  = fmtNum(item.valor);
    const acum   = fmtNum(item.acumulacion);
    const reden  = fmtNum(item.redencion);
    const stars  = '★'.repeat(parseInt(item.estrellas) || 0);

    // helpers para el bloque de aerolínea
    const airlineLogoSpan = `
        <span class="airline-logo" style="position:absolute;top:-32px;left:-20px;display:flex;align-items:center;background:#fff;width:140px;height:80px;border-radius:80% 80% / 0 0 110px 80px;">
          <img style="height:20px;width:auto;padding-left:30px;margin-top:20px;" src="${img}" alt="${item.aerolinea}" loading="lazy" />
        </span>`;

    const destImg = (alt) =>
      `        <img src="${img}" alt="${alt}" loading="eager" fetchpriority="high" width="330px !important" height="180px !important" />`;

    const hotelImg = (alt) =>
      `        <img src="https://res.cloudinary.com/ultragroup/image/upload/v1754673498/clpc5ow7m8p2l7ym24ts.png" alt="${alt}" loading="eager" fetchpriority="high" width="330px !important" height="180px !important" />`;

    const verMas = `        <div class="slider-card__btn">Ver más</div>`;

    // ── Templates ──────────────────────────────────────────────────────────

    if (k === 'PCO-VUELOS') {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="Vuelos ida y regreso a ${item.pais} desde ${item.salida}" aria-label="Ver vuelos a ${item.pais} desde ${item.salida}">
    <div class="slider-card">
      <div class="slider-card__img">
${airlineLogoSpan}
${destImg(`Vuelos ida y regreso a ${item.pais} desde ${item.salida}`)}
        <span class="slider-card__img-icon"><img src="https://res.cloudinary.com/ultragroup/image/upload/v1713917026/b69dvxlp1eijbdckfzup.svg" alt="Icono de avión" loading="lazy" /></span>
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-description">Ida y regreso</p>
          <p class="slider-card__content-header-title">Vuelos a ${item.pais}</p>
          <p class="slider-card__content-header-subtitle">Saliendo desde ${item.salida}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Llévalo desde</p>
            <p class="slider-card__price--content">
              <span class="slider-card__price--points">${puntos} Puntos</span>
              <span class="slider-card__price--plus">+</span>
              <span class="slider-card__price--money">${precio}</span>
            </p>
          </div>
          <p class="slider-card__accumulation"><span class="slider-card__accumulation-description">Acumulas hasta</span><span class="slider-card__accumulation-value">${acum} Puntos</span></p>
          <p class="slider-card__redemption"><span class="slider-card__redemption-description">o redime con</span><span class="slider-card__redemption-value">${reden} Puntos</span></p>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (k === 'PCO-HOTELES') {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="Hotel en ${item.pais} | Lujo y Ubicación Ideal" aria-label="Ir a la página del hotel en ${item.pais}">
    <div class="slider-card">
      <div class="slider-card__img">
${hotelImg(`Hotel en ${item.pais} | Lujo y Ubicación Ideal`)}
        <span class="slider-card__img-icon"><img src="https://res.cloudinary.com/ultragroup/image/upload/v1737588442/i8w7qcnijntbopktfzyg.png" alt="Icono de hotel" loading="lazy" /></span>
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-description">Disfruta de hoteles en</p>
          <p class="slider-card__content-header-title">${item.pais}</p>
          <p class="slider-card__content-header-subtitle">4 días, 3 noches</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Llévalo desde</p>
            <p class="slider-card__price--content">
              <span class="slider-card__price--points">${puntos} Puntos</span>
              <span class="slider-card__price--plus">+</span>
              <span class="slider-card__price--money">${precio}</span>
            </p>
          </div>
          <p class="slider-card__accumulation"><span class="slider-card__accumulation-description">Acumulas hasta&nbsp;</span><span class="slider-card__accumulation-value">${acum} Puntos</span></p>
          <p class="slider-card__redemption"><span class="slider-card__redemption-description">o redime con</span><span class="slider-card__redemption-value">${reden} Puntos</span><br /><span class="slider-card__redemption-value" style="color:#4a4a4a">*Descuento ya aplicado en la tarifa.</span></p>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (k === 'DAVIBANK-VUELOS') {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="Vuelos a ${item.pais} desde ${item.salida}">
    <div class="slider-card">
      <div class="slider-card__img">
${airlineLogoSpan}
${destImg(`Vuelos a ${item.pais} desde ${item.salida}`)}
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-description">Ida y regreso</p>
          <p class="slider-card__content-header-title">Vuelos a ${item.pais}</p>
          <p class="slider-card__content-header-subtitle">Saliendo desde ${item.salida}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Llévalo desde</p>
            <p class="slider-card__price--content">
              <span class="slider-card__price--points">${puntos} Puntos</span>
              <span class="slider-card__price--plus">+</span>
              <span class="slider-card__price--money">${precio}</span>
            </p>
          </div>
          <p class="slider-card__accumulation"><span>Valor total:</span><span>${valor}</span></p>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (k === 'DAVIBANK-HOTELES') {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="Hotel en ${item.pais}">
    <div class="slider-card">
      <div class="slider-card__img">
${hotelImg(`Hotel en ${item.pais}`)}
        <span class="descuento-badge">${item.descuento}</span>
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-title">${item.pais}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Llévalo desde</p>
            <p class="slider-card__price--content">
              <span class="slider-card__price--points">${puntos} Puntos</span>
              <span class="slider-card__price--plus">+</span>
              <span class="slider-card__price--money">${precio}</span>
            </p>
          </div>
          <p><span>Valor total:</span> ${valor}</p>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (['FICOHSA-VUELOS','AUSTRO-VUELOS'].includes(k)) {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="Vuelos a ${item.pais} desde ${item.salida}">
    <div class="slider-card">
      <div class="slider-card__img">
${airlineLogoSpan}
${destImg(`Vuelos a ${item.pais}`)}
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-title">Vuelos a ${item.pais}</p>
          <p class="slider-card__content-header-subtitle">Saliendo desde ${item.salida}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Desde</p>
            <p class="slider-card__price--content"><span class="slider-card__price--points">${puntos} Puntos</span></p>
          </div>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (['FICOHSA-HOTELES','FICOHSA-PROMOS','AUSTRO-HOTELES','AUSTRO-PROMOS'].includes(k)) {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="${item.hotel} en ${item.pais}">
    <div class="slider-card">
      <div class="slider-card__img">
${hotelImg(`${item.hotel} en ${item.pais}`)}
        <span class="descuento-badge">${item.descuento}</span>
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-description">${stars}</p>
          <p class="slider-card__content-header-title">${item.hotel}</p>
          <p class="slider-card__content-header-subtitle">${item.pais}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Desde</p>
            <p class="slider-card__price--content"><span class="slider-card__price--points">${puntos} Puntos</span></p>
          </div>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (k === 'TYP-VUELOS') {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="Vuelos a ${item.pais}">
    <div class="slider-card">
      <div class="slider-card__img">
${airlineLogoSpan}
${destImg(`Vuelos a ${item.pais}`)}
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-title">Vuelos a ${item.pais}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Desde</p>
            <p class="slider-card__price--content"><span class="slider-card__price--points">${puntos} Puntos</span></p>
          </div>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (['TYP-HOTELES','BANORTE-HOTELES'].includes(k)) {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="${item.hotel} en ${item.pais}">
    <div class="slider-card">
      <div class="slider-card__img">
${hotelImg(`${item.hotel} en ${item.pais}`)}
        <span class="descuento-badge">${item.descuento}</span>
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-title">${item.hotel}</p>
          <p class="slider-card__content-header-subtitle">${item.pais}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Desde</p>
            <p class="slider-card__price--content"><span class="slider-card__price--points">${puntos} Puntos</span></p>
          </div>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (k === 'BANORTE-VUELOS') {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="Vuelos a ${item.pais}">
    <div class="slider-card">
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-title">Vuelos a ${item.pais}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Desde</p>
            <p class="slider-card__price--content"><span class="slider-card__price--points">${puntos} Puntos</span></p>
          </div>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    } else if (k === 'COOPENAE-VUELOS') {
      html += `<div class="slider-slide">
  <a href="${item.enlace}" class="slider-card__link" title="Vuelos a ${item.pais} desde ${item.salida}" aria-label="Ver vuelos a ${item.pais} desde ${item.salida}">
    <div class="slider-card">
      <div class="slider-card__img">
${airlineLogoSpan}
${destImg(`Vuelos a ${item.pais} desde ${item.salida}`)}
      </div>
      <div class="slider-card__content">
        <div class="slider-card__content-header">
          <p class="slider-card__content-header-description">Ida y regreso</p>
          <p class="slider-card__content-header-title">Vuelos a ${item.pais}</p>
          <p class="slider-card__content-header-subtitle">Saliendo desde ${item.salida}</p>
        </div>
        <div class="slider-card__values">
          <div class="slider-card__price">
            <p class="slider-card__price--description">Llévalo desde</p>
            <p class="slider-card__price--content"><span class="slider-card__price--money">${precio}</span></p>
          </div>
        </div>
${verMas}
      </div>
    </div>
  </a>
</div>

`;
    }
  });

  const box = document.getElementById('output-box');
  box.textContent = html.trim();
  document.getElementById('output-label').textContent = `HTML generado — ${prog} ${tipo} · ${sorted.length} cards`;
  showSection('section-output', true);
  setStatus('ready', 'HTML listo');
  document.getElementById('section-output').scrollIntoView({ behavior: 'smooth' });
}

// ── Copy / Download ───────────────────────────────────────────────────────────

function copyOut() {
  const text = document.getElementById('output-box').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copiado ✓';
    setTimeout(() => btn.textContent = 'Copiar', 2000);
  });
}

function downloadHTML() {
  const content = document.getElementById('output-box').textContent;
  const blob = new Blob([content], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${prog}_${tipo}_cards.html`;
  a.click();
}
