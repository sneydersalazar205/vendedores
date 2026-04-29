// vendedor.js - Lógica para el panel del vendedor
const api = new APIClient();

// Estado de la aplicación
let rutaActual = null;
let puntosClientes = [];

// DOM Elements
const userNameElement = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const btnAddClient = document.getElementById('btnAddClient');
const closeModalBtn = document.getElementById('closeModalBtn');
const btnCancelForm = document.getElementById('btnCancelForm');
const formNuevoCliente = document.getElementById('formNuevoCliente');
const modalNuevoCliente = document.getElementById('modalNuevoCliente');
const pointsList = document.getElementById('pointsList');

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
  // Autenticación omitida - acceso directo
  loadUserInfo();
  initEventListeners();
  cargarRutaDelVendedor();
});

function checkAuth() {
  // Autenticación omitida - acceso directo permitido
  console.log('Acceso sin autenticación permitido');
}

function loadUserInfo() {
  const userName = localStorage.getItem('userName') || 'Vendedor';
  userNameElement.textContent = userName;
}

function initEventListeners() {
  btnAddClient.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  btnCancelForm.addEventListener('click', closeModal);
  formNuevoCliente.addEventListener('submit', handleSubmitForm);
  logoutBtn.addEventListener('click', logout);
  
  // Cerrar modal si se hace clic fuera
  modalNuevoCliente.addEventListener('click', (e) => {
    if (e.target === modalNuevoCliente) {
      closeModal();
    }
  });
}

function logout() {
  api.logout();
  window.location.href = '/login.html';
}

// ========== CARGAR RUTA ==========
async function cargarRutaDelVendedor() {
  try {
    // Simulamos carga de ruta del vendedor
    // En producción, obtendrías la ruta del usuario actual desde la API
    rutaActual = {
      id: 1,
      nombre: 'Ruta Centro - Zona 1',
      vendedor: localStorage.getItem('userName') || 'Vendedor',
      sede: 'Sede Centro',
      fechaInicio: new Date().toLocaleDateString('es-CO'),
      clientes: [
        {
          id: 1,
          nombre: 'Juan García',
          calle: 'Carrera 45',
          numero: '23-40',
          barrio: 'Centro',
          ciudad: 'Bogotá',
          telefono: '3001234567',
          orden: 1
        },
        {
          id: 2,
          nombre: 'María López',
          calle: 'Carrera 48',
          numero: '15-60',
          barrio: 'La Candelaria',
          ciudad: 'Bogotá',
          telefono: '3015678901',
          orden: 3
        },
        {
          id: 3,
          nombre: 'Carlos Rodríguez',
          calle: 'Calle 13',
          numero: '8-50',
          barrio: 'Chapinero',
          ciudad: 'Bogotá',
          telefono: '3109876543',
          orden: 2
        }
      ]
    };

    document.getElementById('routeTitle').textContent = `${rutaActual.nombre}`;
    document.getElementById('routeSubtitle').textContent = `${rutaActual.fechaInicio} - ${rutaActual.vendedor}`;
    document.getElementById('sedeInfo').textContent = rutaActual.sede;

    // Ordenar clientes por calle descendente
    ordenarClientesPorCalle();
    mostrarPuntos();
  } catch (error) {
    console.error('Error al cargar ruta:', error);
    showError('Error al cargar la ruta');
  }
}

// ========== ORDENAR CLIENTES ==========
function ordenarClientesPorCalle() {
  if (!rutaActual || !rutaActual.clientes) return;
  
  // Ordenar por calle alfabéticamente (A a Z) - orden de visita ascendente
  rutaActual.clientes.sort((a, b) => {
    const calleA = a.calle.toLowerCase();
    const calleB = b.calle.toLowerCase();
    return calleA.localeCompare(calleB);
  });

  // Reasignar orden de visita
  rutaActual.clientes.forEach((cliente, index) => {
    cliente.orden = index + 1;
  });
}

// ========== MOSTRAR PUNTOS ==========
function mostrarPuntos() {
  const pointsList = document.getElementById('pointsList');
  pointsList.innerHTML = '';

  if (!rutaActual || rutaActual.clientes.length === 0) {
    pointsList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-map-pin"></i>
        <h3>Sin puntos de visita</h3>
        <p>Agrega el primer cliente para comenzar tu ruta</p>
      </div>
    `;
    return;
  }

  // Generar tarjetas de puntos
  puntosClientes = rutaActual.clientes.map(cliente => crearTarjetaPunto(cliente));
  pointsList.innerHTML = puntosClientes.join('');

  // Agregar event listeners a los botones
  document.querySelectorAll('.btn-visit').forEach(btn => {
    btn.addEventListener('click', handleVisitarPunto);
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', handleEliminarPunto);
  });
}

// ========== CREAR TARJETA DE PUNTO ==========
function crearTarjetaPunto(cliente) {
  const direccionCompleta = `${cliente.calle} #${cliente.numero}, ${cliente.barrio}`;
  const orden = cliente.orden || 0;

  return `
    <div class="timeline-item">
      <div class="timeline-marker">
        <i class="fas fa-map-marker-alt"></i>
        <span class="marker-label">${orden}°</span>
      </div>
      <div class="point-card" data-cliente-id="${cliente.id}">
        <div class="point-number">${orden}</div>
        <h3>${cliente.nombre}</h3>
        <div class="point-detail">
          <i class="fas fa-map-pin"></i>
          <span><strong>${cliente.calle}</strong> #${cliente.numero}</span>
        </div>
        <div class="point-detail">
          <i class="fas fa-home"></i>
          <span>${cliente.barrio}, ${cliente.ciudad}</span>
        </div>
        <div class="point-detail">
          <i class="fas fa-phone"></i>
          <span>${cliente.telefono}</span>
        </div>
        <div class="point-actions">
          <button class="btn-visit" data-cliente-id="${cliente.id}">
            <i class="fas fa-check-circle"></i> Visitado
          </button>
          <button class="btn-delete" data-cliente-id="${cliente.id}">
            <i class="fas fa-trash-alt"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  `;
}

// ========== EVENTOS DE PUNTOS ==========
function handleVisitarPunto(e) {
  const clienteId = parseInt(e.currentTarget.dataset.clienteId);
  console.log('Visitando cliente:', clienteId);
  
  // Cambiar estado visual
  e.currentTarget.style.opacity = '0.5';
  e.currentTarget.disabled = true;

  // Aquí iría la lógica para registrar la visita en la API
  setTimeout(() => {
    showSuccess('Visita registrada correctamente');
  }, 500);
}

function handleEliminarPunto(e) {
  const clienteId = parseInt(e.currentTarget.dataset.clienteId);
  
  if (!confirm('¿Eliminar este cliente de la ruta?')) {
    return;
  }

  if (rutaActual && rutaActual.clientes) {
    rutaActual.clientes = rutaActual.clientes.filter(c => c.id !== clienteId);
    mostrarPuntos();
    showSuccess('Cliente eliminado de la ruta');
  }
}

// ========== MODAL DE NUEVO CLIENTE ==========
function openModal() {
  modalNuevoCliente.classList.add('show');
  formNuevoCliente.reset();
}

function closeModal() {
  modalNuevoCliente.classList.remove('show');
  formNuevoCliente.reset();
}

async function handleSubmitForm(e) {
  e.preventDefault();

  const nuevoCliente = {
    id: Math.max(...rutaActual.clientes.map(c => c.id), 0) + 1,
    nombre: document.getElementById('clientNombre').value,
    calle: document.getElementById('clientCalle').value,
    numero: document.getElementById('clientNumero').value,
    barrio: document.getElementById('clientBarrio').value,
    ciudad: 'Bogotá', // Podría ser dinámico
    telefono: document.getElementById('clientTelefono').value,
    orden: 0
  };

  try {
    // Validación básica
    if (!nuevoCliente.nombre || !nuevoCliente.calle || !nuevoCliente.numero) {
      showError('Por favor completa todos los campos obligatorios');
      return;
    }

    // Agregar cliente a la ruta
    rutaActual.clientes.push(nuevoCliente);

    // Reordenar por calle
    ordenarClientesPorCalle();

    // Mostrar actualización
    mostrarPuntos();
    closeModal();

    showSuccess('Cliente agregado a la ruta correctamente');
  } catch (error) {
    console.error('Error al agregar cliente:', error);
    showError('Error al agregar el cliente: ' + error.message);
  }
}

// ========== NOTIFICACIONES ==========
function showSuccess(message) {
  showNotification(message, 'success');
}

function showError(message) {
  showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notificacion notif-${type}`;
  notif.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;

  const style = document.createElement('style');
  style.textContent = `
    .notificacion {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 14px 20px;
      border-radius: 8px;
      color: white;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .notif-success { background: #10b981; }
    .notif-error { background: #ef4444; }
    .notif-info { background: #3b82f6; }
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;

  if (!document.querySelector('style[data-notif]')) {
    style.setAttribute('data-notif', 'true');
    document.head.appendChild(style);
  }

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notif.remove();
    }, 300);
  }, 3000);
}
