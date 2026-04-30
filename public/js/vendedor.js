// vendedor.js - Panel del vendedor conectado a la API REST

// ========== ESTADO GLOBAL ==========
let perfilUsuario = null;
let rutasDelVendedor = [];
let rutaActiva = null;       // objeto mapeado de obtenerRutasUsuario
let estadosVisita = [];
let productosCache = [];
let puntoActual = null;      // rutadetalle seleccionado para registrar visita
let geoActual = null;        // { lat, lng } del GPS actual
let carritoVenta = {};       // { idProducto: cantidad }

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', async () => {
  if (!api.getToken()) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    api.logout();
    window.location.href = '/login.html';
  });

  document.getElementById('btnVolverRutas').addEventListener('click', mostrarSelectorRutas);

  // Modales
  document.getElementById('closeModalVisita').addEventListener('click', cerrarModalVisita);
  document.getElementById('cancelVisita').addEventListener('click', cerrarModalVisita);
  document.getElementById('modalVisita').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalVisita')) cerrarModalVisita();
  });
  document.getElementById('formVisita').addEventListener('submit', handleSubmitVisita);
  document.getElementById('visitaEstado').addEventListener('change', onEstadoVisitaChange);

  mostrarLoading(true);

  try {
    // Cargar datos en paralelo
    const [perfil, estados, productos] = await Promise.all([
      api.getProfile(),
      api.listarEstadosVisita(),
      api.listarProductos(),
    ]);

    perfilUsuario = perfil?.data || perfil;
    estadosVisita = estados;
    productosCache = (productos?.data || productos || []);

    document.getElementById('userName').textContent =
      `${perfilUsuario?.Nombre || ''} ${perfilUsuario?.Apellido || ''}`.trim() || 'Vendedor';

    // Cargar rutas del vendedor
    rutasDelVendedor = await api.obtenerRutasUsuario(perfilUsuario.IdUsuario);

    if (rutasDelVendedor.length === 0) {
      mostrarLoading(false);
      mostrarEmpty('No tienes rutas asignadas para hoy.');
      return;
    }

    if (rutasDelVendedor.length === 1) {
      // Una sola ruta → cargar directo
      await seleccionarRuta(rutasDelVendedor[0]);
    } else {
      mostrarSelectorRutas();
    }
  } catch (err) {
    console.error(err);
    mostrarEmpty('Error al cargar datos: ' + err.message);
  }
});

// ========== NAVEGACIÓN ENTRE VISTAS ==========
function mostrarLoading(visible) {
  document.getElementById('loadingState').style.display = visible ? 'block' : 'none';
  document.getElementById('rutaSelector').style.display = 'none';
  document.getElementById('rutaDetalle').style.display = 'none';
}

function mostrarEmpty(msg) {
  document.getElementById('loadingState').style.display = 'block';
  document.getElementById('loadingState').innerHTML = `
    <div class="empty-state">
      <i class="fas fa-map-pin" style="font-size:2rem;color:#9ca3af;"></i>
      <p style="color:#6b7280;margin-top:12px;">${msg}</p>
    </div>`;
}

function mostrarSelectorRutas() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('rutaDetalle').style.display = 'none';
  document.getElementById('rutaSelector').style.display = 'block';
  renderSelectorRutas();
}

function mostrarDetalleRuta() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('rutaSelector').style.display = 'none';
  document.getElementById('rutaDetalle').style.display = 'block';
}

// ========== SELECTOR DE RUTAS ==========
function renderSelectorRutas() {
  const container = document.getElementById('rutaCards');
  container.innerHTML = rutasDelVendedor.map(ruta => `
    <div class="ruta-card" onclick="seleccionarRuta(${JSON.stringify(ruta).replace(/"/g, '&quot;')})">
      <div class="ruta-card-icon"><i class="fas fa-route"></i></div>
      <div class="ruta-card-info">
        <h3>${ruta.nombre}</h3>
        <p><i class="fas fa-calendar-alt"></i> ${ruta.fecha}</p>
        <p><i class="fas fa-map-pin"></i> ${ruta.puntos.length} puntos</p>
        <span class="badge-estado ${ruta.estado === 'activa' ? 'badge-activa' : ''}">${ruta.estado || 'Pendiente'}</span>
      </div>
      <i class="fas fa-chevron-right ruta-card-arrow"></i>
    </div>
  `).join('');
}

// ========== SELECCIONAR RUTA ==========
async function seleccionarRuta(ruta) {
  rutaActiva = ruta;

  document.getElementById('routeTitle').textContent = ruta.nombre;
  document.getElementById('routeSubtitle').textContent = `${ruta.fecha} · ${ruta.puntos.length} puntos`;
  document.getElementById('sedeInfo').textContent =
    perfilUsuario?.sede?.Nombre || perfilUsuario?.sede || 'Sede Principal';

  mostrarDetalleRuta();
  renderPuntos(ruta.puntos);
}

// ========== RENDER TIMELINE DE PUNTOS ==========
function renderPuntos(puntos) {
  const list = document.getElementById('pointsList');

  if (!puntos || puntos.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-map-pin"></i>
        <h3>Sin puntos de visita</h3>
        <p>Esta ruta no tiene direcciones asignadas</p>
      </div>`;
    return;
  }

  const ordenados = [...puntos].sort((a, b) => (a.orden || 0) - (b.orden || 0));

  list.innerHTML = ordenados.map(punto => {
    const visitada = punto.estadoVisita && punto.estadoVisita !== 'Pendiente';
    const clienteNombre = punto.cliente?.nombre || 'Cliente sin nombre';
    const clienteTel = punto.cliente?.telefono || '—';

    return `
      <div class="timeline-item ${visitada ? 'visitado' : ''}" id="punto-${punto.idRutaDetalle}">
        <div class="timeline-marker">
          <i class="fas ${visitada ? 'fa-check-circle' : 'fa-map-marker-alt'}"></i>
          <span class="marker-label">${punto.orden}°</span>
        </div>
        <div class="point-card" data-id="${punto.idRutaDetalle}">
          <div class="point-number">${punto.orden}</div>
          <h3>${clienteNombre}</h3>
          <div class="point-detail">
            <i class="fas fa-map-pin"></i>
            <span>${punto.direccion}</span>
          </div>
          <div class="point-detail">
            <i class="fas fa-phone"></i>
            <span>${clienteTel}</span>
          </div>
          ${visitada
            ? `<div class="visit-badge visit-badge-done"><i class="fas fa-check"></i> ${punto.estadoVisita}</div>`
            : `<button class="btn-visit" onclick="abrirModalVisita(${punto.idRutaDetalle})">
                <i class="fas fa-clipboard-check"></i> Registrar visita
               </button>`
          }
        </div>
      </div>`;
  }).join('');
}

// ========== MODAL VISITA ==========
function abrirModalVisita(idRutaDetalle) {
  puntoActual = rutaActiva.puntos.find(p => p.idRutaDetalle === idRutaDetalle);
  if (!puntoActual) return;

  geoActual = null;
  carritoVenta = {};

  // Info del cliente
  const info = document.getElementById('modalVisitaInfo');
  info.innerHTML = `
    <div class="modal-cliente-nombre">
      <i class="fas fa-user"></i>
      ${puntoActual.cliente?.nombre || 'Dirección sin cliente'}
    </div>
    <div class="modal-cliente-dir">
      <i class="fas fa-map-pin"></i>
      ${puntoActual.direccion}
    </div>`;

  // Poblar estados
  const sel = document.getElementById('visitaEstado');
  sel.innerHTML = '<option value="">Seleccionar estado...</option>' +
    estadosVisita.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
  sel.value = '';

  document.getElementById('visitaObservacion').value = '';
  document.getElementById('ventaSection').style.display = 'none';
  document.getElementById('totalVenta').style.display = 'none';

  // Geolocalización
  setGeoStatus('checking', '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación GPS...');
  document.getElementById('modalVisita').classList.add('show');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        geoActual = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const hasCoordenadas = puntoActual.latDireccion && puntoActual.lngDireccion;

        if (hasCoordenadas) {
          const dist = calcularDistancia(
            geoActual.lat, geoActual.lng,
            puntoActual.latDireccion, puntoActual.lngDireccion
          );
          if (dist <= 50) {
            setGeoStatus('valid', `<i class="fas fa-check-circle"></i> Ubicación válida (${Math.round(dist)}m)`);
          } else {
            setGeoStatus('warn', `<i class="fas fa-exclamation-triangle"></i> Fuera de rango (${Math.round(dist)}m). Puede continuar.`);
          }
        } else {
          setGeoStatus('valid', '<i class="fas fa-check-circle"></i> Ubicación obtenida');
        }
      },
      () => {
        setGeoStatus('warn', '<i class="fas fa-exclamation-triangle"></i> No se pudo obtener GPS. Puede continuar.');
      },
      { timeout: 8000 }
    );
  } else {
    setGeoStatus('warn', '<i class="fas fa-exclamation-triangle"></i> GPS no disponible en este dispositivo.');
  }
}

function cerrarModalVisita() {
  document.getElementById('modalVisita').classList.remove('show');
  puntoActual = null;
  geoActual = null;
  carritoVenta = {};
}

function setGeoStatus(tipo, html) {
  const el = document.getElementById('geoStatus');
  el.className = `geo-status geo-${tipo}`;
  el.innerHTML = html;
}

function onEstadoVisitaChange() {
  const estadoId = parseInt(document.getElementById('visitaEstado').value);
  const estadoObj = estadosVisita.find(e => e.id === estadoId);
  const esVenta = estadoObj && estadoObj.nombre.toLowerCase().includes('venta');

  const section = document.getElementById('ventaSection');
  section.style.display = esVenta ? 'block' : 'none';

  if (esVenta && productosCache.length > 0) {
    renderProductosList();
  }
}

function renderProductosList() {
  const container = document.getElementById('productosList');
  container.innerHTML = productosCache.map(p => `
    <div class="producto-item">
      <div class="producto-info">
        <span class="producto-nombre">${p.Nombre || p.nombre}</span>
        <span class="producto-precio">$${Number(p.Precio || p.precio || 0).toLocaleString('es-CO')}</span>
        <span class="producto-stock">Stock: ${p.Stock || p.stock || 0}</span>
      </div>
      <div class="producto-cantidad">
        <button type="button" onclick="cambiarCantidad(${p.IdProducto || p.id}, -1)">−</button>
        <span id="cant-${p.IdProducto || p.id}">0</span>
        <button type="button" onclick="cambiarCantidad(${p.IdProducto || p.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

window.cambiarCantidad = function(idProducto, delta) {
  const actual = carritoVenta[idProducto] || 0;
  const nuevo = Math.max(0, actual + delta);
  const producto = productosCache.find(p => (p.IdProducto || p.id) === idProducto);
  const maxStock = producto?.Stock || producto?.stock || 99;

  carritoVenta[idProducto] = Math.min(nuevo, maxStock);
  document.getElementById(`cant-${idProducto}`).textContent = carritoVenta[idProducto];
  actualizarTotal();
};

function actualizarTotal() {
  let total = 0;
  for (const [idProd, cant] of Object.entries(carritoVenta)) {
    if (cant > 0) {
      const prod = productosCache.find(p => (p.IdProducto || p.id) === parseInt(idProd));
      if (prod) total += Number(prod.Precio || prod.precio || 0) * cant;
    }
  }
  const totalEl = document.getElementById('totalVenta');
  totalEl.style.display = total > 0 ? 'block' : 'none';
  document.getElementById('totalVentaValor').textContent = `$${total.toLocaleString('es-CO')}`;
}

// ========== SUBMIT VISITA ==========
async function handleSubmitVisita(e) {
  e.preventDefault();
  const btn = document.getElementById('submitVisita');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

  try {
    const idEstado = parseInt(document.getElementById('visitaEstado').value);
    if (!idEstado) throw new Error('Selecciona un estado de visita');

    const observacion = document.getElementById('visitaObservacion').value.trim();

    // 1. Registrar visita
    const visitaPayload = {
      IdRutaDetalle: puntoActual.idRutaDetalle,
      IdRutaUsuario: rutaActiva.idRutaUsuario,
      IdEstadoVisita: idEstado,
      Latitud: geoActual?.lat || null,
      Longitud: geoActual?.lng || null,
      Observacion: observacion || null,
      FechaHora: new Date().toISOString(),
    };

    const visitaRes = await api.crearVisita(visitaPayload);
    const visita = visitaRes?.data || visitaRes;

    // 2. Si hay productos en el carrito → crear pedido
    const items = Object.entries(carritoVenta)
      .filter(([, cant]) => cant > 0)
      .map(([idProd, cant]) => ({ IdProducto: parseInt(idProd), Cantidad: cant }));

    if (items.length > 0 && puntoActual.cliente?.id) {
      await api.crearPedido({
        clienteId: puntoActual.cliente.id,
        items,
        observaciones: observacion || '',
      });
    }

    // 3. Actualizar estado visual del punto
    const estadoObj = estadosVisita.find(ev => ev.id === idEstado);
    puntoActual.estadoVisita = estadoObj?.nombre || 'Visitado';
    renderPuntos(rutaActiva.puntos);

    cerrarModalVisita();
    showNotification('Visita registrada correctamente', 'success');
  } catch (err) {
    console.error(err);
    showNotification(err.message || 'Error al registrar visita', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-check"></i> Guardar visita';
  }
}

// ========== GEOLOCALIZACIÓN ==========
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ========== NOTIFICACIONES ==========
function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notificacion notif-${type}`;
  notif.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>`;

  if (!document.querySelector('style[data-notif]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notif', 'true');
    style.textContent = `
      .notificacion{position:fixed;top:20px;right:20px;padding:14px 20px;border-radius:8px;
        color:#fff;z-index:10000;animation:slideIn .3s ease-out;display:flex;align-items:center;
        gap:10px;box-shadow:0 4px 12px rgba(0,0,0,.15);}
      .notif-success{background:#10b981;}.notif-error{background:#ef4444;}.notif-info{background:#3b82f6;}
      @keyframes slideIn{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}
      @keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(400px);opacity:0}}`;
    document.head.appendChild(style);
  }

  document.body.appendChild(notif);
  setTimeout(() => {
    notif.style.animation = 'slideOut .3s ease-out';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Exponer para onclick en HTML
window.seleccionarRuta = seleccionarRuta;
window.abrirModalVisita = abrirModalVisita;
