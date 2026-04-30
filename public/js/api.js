// api.js - Cliente para comunicarse con la API REST
class APIClient {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.token = localStorage.getItem('token') || null;
  }

  // Método genérico para peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || data?.error || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ========== AUTENTICACIÓN ==========
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async registrarUsuario(data) {
    const payload = {
      Nombre:     data.nombre    || data.Nombre,
      Apellido:   data.apellido  || data.Apellido,
      Email:      data.email     || data.Email,
      Cedula:     data.cedula    || data.Cedula,
      Telefono:   data.telefono  || data.Telefono,
      Contrasena: data.contrasena || data.Contrasena || 'Vendedor123*',
      Estado:     data.estado    || data.Estado || 'Activo',
      IdRol:      parseInt(data.idRol || data.IdRol),
      IdSede:     parseInt(data.idSede || data.IdSede),
    };
    return this.request('/usuarios/registrar', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async login(email, password) {
    const res = await this.request('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ Email: email, Contrasena: password }),
    });
    if (res.token) this.setToken(res.token);
    return res;
  }

  async getProfile() {
    return this.request('/usuarios/profile');
  }

  // ========== USUARIOS ==========
  async listarUsuarios() {
    const res = await this.request('/usuarios');
    const data = res?.data || res || [];
    return data.map(u => ({
      id:       u.IdUsuario,
      cedula:   u.Cedula,
      nombre:   u.Nombre,
      apellido: u.Apellido,
      email:    u.Email,
      telefono: u.Telefono,
      estado:   u.Estado,
      rol:      u.rol?.Nombre || null,
      sede:     u.sede?.Nombre || null,
      idRol:    u.IdRol,
      idSede:   u.IdSede,
    }));
  }

  async obtenerUsuario(id) {
    const res = await this.request(`/usuarios/${id}`);
    return res?.data || res;
  }

  async actualizarUsuario(id, data) {
    const payload = {
      Nombre:   data.nombre   || data.Nombre,
      Apellido: data.apellido || data.Apellido,
      Email:    data.email    || data.Email,
      Cedula:   data.cedula   || data.Cedula,
      Telefono: data.telefono || data.Telefono,
      Estado:   data.estado   || data.Estado,
      IdRol:    parseInt(data.idRol  || data.IdRol),
      IdSede:   parseInt(data.idSede || data.IdSede),
    };
    const res = await this.request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  }

  async cambiarContrasena(id, contrasenaAntigua, contrasenaNueva) {
    return this.request(`/usuarios/${id}/cambiar-contrasena`, {
      method: 'POST',
      body: JSON.stringify({ contrasenaAntigua, contrasenaNueva }),
    });
  }

  async desactivarUsuario(id) {
    return this.request(`/usuarios/${id}/desactivar`, { method: 'PATCH' });
  }

  async activarUsuario(id) {
    return this.request(`/usuarios/${id}/activar`, { method: 'PATCH' });
  }

  // ========== ROLES ==========
  async listarRoles() {
    const res = await this.request('/roles');
    const data = res?.data || res || [];
    return data.map(r => ({ id: r.IdRol, nombre: r.Nombre }));
  }

  // ========== REGIONES ==========
  async listarRegiones() {
    const res = await this.request('/regiones');
    const data = res?.data || res || [];
    return data.map(r => ({
      id:          r.IdRegion,
      nombre:      r.Nombre,
      codigo:      r.Codigo,
      descripcion: r.Descripcion,
      estado:      r.Estado,
    }));
  }

  async obtenerRegion(id) {
    const res = await this.request(`/regiones/${id}`);
    return res?.data || res;
  }

  async crearRegion(data) {
    const payload = {
      Nombre:      data.nombre || data.Nombre,
      Codigo:      data.codigo || data.Codigo,
      Descripcion: data.descripcion || data.Descripcion,
      Estado:      data.estado || data.Estado || 'Activo',
    };
    const res = await this.request('/regiones', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  }

  async actualizarRegion(id, data) {
    const payload = {
      Nombre:      data.nombre || data.Nombre,
      Codigo:      data.codigo || data.Codigo,
      Descripcion: data.descripcion || data.Descripcion,
      Estado:      data.estado || data.Estado,
    };
    const res = await this.request(`/regiones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  }

  async eliminarRegion(id) {
    return this.request(`/regiones/${id}`, { method: 'DELETE' });
  }

  // ========== CIUDADES ==========
  async listarCiudades() {
    const res = await this.request('/ciudades');
    const data = res?.data || res || [];
    return data.map(c => ({
      id:          c.IdCiudad,
      nombre:      c.Nombre,
      codigo:      c.Codigo,
      descripcion: c.Descripcion,
      estado:      c.Estado,
      region:      c.region?.Nombre || null,
      idRegion:    c.IdRegion,
    }));
  }

  async obtenerCiudad(id) {
    const res = await this.request(`/ciudades/${id}`);
    return res?.data || res;
  }

  async crearCiudad(data) {
    const payload = {
      Nombre:      data.nombre || data.Nombre,
      Codigo:      data.codigo || data.Codigo,
      Descripcion: data.descripcion || data.Descripcion,
      Estado:      data.estado || data.Estado || 'Activo',
      IdRegion:    parseInt(data.regionId || data.IdRegion),
    };
    const res = await this.request('/ciudades', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  }

  async actualizarCiudad(id, data) {
    const payload = {
      Nombre:      data.nombre || data.Nombre,
      Codigo:      data.codigo || data.Codigo,
      Descripcion: data.descripcion || data.Descripcion,
      Estado:      data.estado || data.Estado,
      IdRegion:    parseInt(data.regionId || data.IdRegion),
    };
    const res = await this.request(`/ciudades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  }

  async eliminarCiudad(id) {
    return this.request(`/ciudades/${id}`, { method: 'DELETE' });
  }

  // ========== SEDES ==========
  async listarSedes() {
    const res = await this.request('/sedes');
    const data = res?.data || res || [];
    return data.map(s => ({
      id:          s.IdSede,
      nombre:      s.Nombre,
      codigo:      s.Codigo,
      descripcion: s.Descripcion,
      estado:      s.Estado,
      ciudad:      s.ciudad?.Nombre || null,
      idCiudad:    s.IdCiudad,
    }));
  }

  async obtenerSede(id) {
    const res = await this.request(`/sedes/${id}`);
    return res?.data || res;
  }

  async crearSede(data) {
    const payload = {
      Nombre:      data.nombre || data.Nombre,
      Codigo:      data.codigo || data.Codigo,
      Descripcion: data.descripcion || data.Descripcion,
      Estado:      data.estado || data.Estado || 'Activo',
      IdCiudad:    parseInt(data.ciudadId || data.IdCiudad),
    };
    const res = await this.request('/sedes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  }

  async actualizarSede(id, data) {
    const payload = {
      Nombre:      data.nombre || data.Nombre,
      Codigo:      data.codigo || data.Codigo,
      Descripcion: data.descripcion || data.Descripcion,
      Estado:      data.estado || data.Estado,
      IdCiudad:    parseInt(data.ciudadId || data.IdCiudad),
    };
    const res = await this.request(`/sedes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  }

  async eliminarSede(id) {
    return this.request(`/sedes/${id}`, { method: 'DELETE' });
  }

  // ========== CLIENTES ==========
  async crearCliente(data) {
    const res = await this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async listarClientes() {
    const res = await this.request('/clientes');
    return res?.data || res || [];
  }

  async obtenerCliente(id) {
    const res = await this.request(`/clientes/${id}`);
    return res?.data || res;
  }

  async actualizarCliente(id, data) {
    const res = await this.request(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async eliminarCliente(id) {
    return this.request(`/clientes/${id}`, { method: 'DELETE' });
  }

  async cambiarEstadoCliente(id, estadoId) {
    const res = await this.request(`/clientes/${id}/cambiar-estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estadoId }),
    });
    return res?.data || res;
  }

  // ========== PRODUCTOS ==========
  async crearProducto(data) {
    const res = await this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async listarProductos() {
    const res = await this.request('/productos');
    return res?.data || res || [];
  }

  async obtenerProducto(id) {
    const res = await this.request(`/productos/${id}`);
    return res?.data || res;
  }

  async actualizarProducto(id, data) {
    const res = await this.request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async eliminarProducto(id) {
    return this.request(`/productos/${id}`, { method: 'DELETE' });
  }

  async obtenerProductosStockBajo(minStock = 10) {
    const res = await this.request(`/productos/stock-bajo?minStock=${minStock}`);
    return res?.data || res || [];
  }

  async incrementarStock(id, cantidad) {
    const res = await this.request(`/productos/${id}/incrementar-stock`, {
      method: 'POST',
      body: JSON.stringify({ cantidad }),
    });
    return res?.data || res;
  }

  async decrementarStock(id, cantidad) {
    const res = await this.request(`/productos/${id}/decrementar-stock`, {
      method: 'POST',
      body: JSON.stringify({ cantidad }),
    });
    return res?.data || res;
  }

  // ========== PEDIDOS ==========
  async crearPedido(data) {
    const res = await this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async listarPedidos() {
    const res = await this.request('/pedidos');
    return res?.data || res || [];
  }

  async obtenerPedido(id) {
    const res = await this.request(`/pedidos/${id}`);
    return res?.data || res;
  }

  async obtenerPedidosCliente(clienteId) {
    const res = await this.request(`/pedidos/cliente/${clienteId}`);
    return res?.data || res || [];
  }

  async cancelarPedido(id) {
    return this.request(`/pedidos/${id}/cancelar`, { method: 'PATCH' });
  }

  async obtenerReporteVentas(startDate, endDate) {
    const res = await this.request(`/pedidos/reporte/ventas?startDate=${startDate}&endDate=${endDate}`);
    return res?.data || res;
  }

  // ========== RUTAS ==========
  async crearRuta(data) {
    const res = await this.request('/rutas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async listarRutas() {
    const res = await this.request('/rutas');
    return res?.data || res || [];
  }

  async obtenerRuta(id) {
    const res = await this.request(`/rutas/${id}`);
    return res?.data || res;
  }

  async obtenerRutasActivas() {
    const res = await this.request('/rutas/activas');
    return res?.data || res || [];
  }

  async obtenerRutasUsuario(usuarioId) {
    const res = await this.request(`/rutas/usuario/${usuarioId}`);
    return res?.data || res || [];
  }

  async actualizarRuta(id, data) {
    const res = await this.request(`/rutas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async eliminarRuta(id) {
    return this.request(`/rutas/${id}`, { method: 'DELETE' });
  }

  // ========== VISITAS ==========
  async crearVisita(data) {
    const res = await this.request('/visitas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async listarVisitas() {
    const res = await this.request('/visitas');
    return res?.data || res || [];
  }

  async obtenerVisita(id) {
    const res = await this.request(`/visitas/${id}`);
    return res?.data || res;
  }

  async actualizarVisita(id, data) {
    const res = await this.request(`/visitas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res?.data || res;
  }

  async eliminarVisita(id) {
    return this.request(`/visitas/${id}`, { method: 'DELETE' });
  }

  async obtenerVisitasValidas() {
    const res = await this.request('/visitas/validas');
    return res?.data || res || [];
  }

  async obtenerVisitasPorRuta(rutaId) {
    const res = await this.request(`/visitas/ruta/${rutaId}`);
    return res?.data || res || [];
  }

  async validarVisita(id, latitudReal, longitudReal) {
    const res = await this.request(`/visitas/${id}/validar`, {
      method: 'POST',
      body: JSON.stringify({ latitudReal, longitudReal }),
    });
    return res?.data || res;
  }

  async agregarObservacion(id, observacion) {
    const res = await this.request(`/visitas/${id}/observacion`, {
      method: 'POST',
      body: JSON.stringify({ observacion }),
    });
    return res?.data || res;
  }

  async obtenerEstadisticasVisitas(rutaId) {
    const res = await this.request(`/visitas/ruta/${rutaId}/estadisticas`);
    return res?.data || res;
  }

  // ========== COMISIONES ==========
  async calcularComision(visitaPedidoId, porcentaje) {
    const res = await this.request('/comisiones', {
      method: 'POST',
      body: JSON.stringify({ visitaPedidoId, porcentaje }),
    });
    return res?.data || res;
  }

  async listarComisiones() {
    const res = await this.request('/comisiones');
    return res?.data || res || [];
  }

  async obtenerComision(id) {
    const res = await this.request(`/comisiones/${id}`);
    return res?.data || res;
  }

  async obtenerComisionesPorPeriodo(startDate, endDate) {
    const res = await this.request(`/comisiones/periodo?startDate=${startDate}&endDate=${endDate}`);
    return res?.data || res || [];
  }

  async obtenerReporteComisiones(startDate, endDate) {
    const res = await this.request(`/comisiones/reporte?startDate=${startDate}&endDate=${endDate}`);
    return res?.data || res;
  }

  async pagarComision(id) {
    const res = await this.request(`/comisiones/${id}/pagar`, { method: 'PATCH' });
    return res?.data || res;
  }

  async rechazarComision(id) {
    const res = await this.request(`/comisiones/${id}/rechazar`, { method: 'PATCH' });
    return res?.data || res;
  }

  // Alias para el dashboard (si se necesita)
  async calcularComisiones() {
    // Llamada genérica para disparar el cálculo de comisiones desde el panel
    const res = await this.request('/comisiones/calcular', { method: 'POST' });
    return res?.data || res;
  }
}

// Instancia global
const api = new APIClient();

// ----- Utilidades visuales -----
function mostrarNotificacion(mensaje, tipo = 'success') {
  const notif = document.createElement('div');
  notif.className = `notificacion notif-${tipo}`;
  const icono = tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle';
  notif.innerHTML = `<i class="fas fa-${icono}"></i><span>${mensaje}</span>`;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

function confirmarAccion(mensaje) {
  return new Promise((resolve) => resolve(confirm(mensaje)));
}