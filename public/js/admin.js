// admin.js - Panel de administración principal
document.addEventListener('DOMContentLoaded', async () => {
  // Referencias DOM
  const navMenu = document.getElementById('navMenu');
  const sectionTitle = document.getElementById('sectionTitle');
  const sectionSubtitle = document.getElementById('sectionSubtitle');
  const dynamicContent = document.getElementById('dynamicContent');
  const globalSearch = document.getElementById('globalSearch');
  const logoutBtn = document.getElementById('logoutBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');

  let currentSection = 'dashboard';
  let allData = { regiones: [], ciudades: [], sedes: [], usuarios: [] }; // Cache

  // ---------- VERIFICACIÓN DE SESIÓN ----------
  // IF (!API.GETTOKEN()) {
  //   // SI NO HAY TOKEN, REDIRIGIR AL LOGIN (AJUSTA LA RUTA SEGÚN CORRESPONDA)
  //   WINDOW.LOCATION.HREF = '/LOGIN.HTML';
  //   RETURN;
  // }

  // Cargar perfil del usuario
  try {
    const profile = await api.getProfile();
    document.getElementById('userName').textContent = profile.nombre || 'Admin';
    document.getElementById('avatarUser').textContent = 
      (profile.nombre ? profile.nombre.charAt(0) + (profile.apellido ? profile.apellido.charAt(0) : '') : 'AD').toUpperCase();
  } catch (err) {
    console.warn('No se pudo cargar el perfil, usando datos por defecto');
  }

  // ---------- NAVEGACIÓN ----------
  navMenu.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (!navItem) return;
    const section = navItem.dataset.section;
    if (section) {
      currentSection = section;
      globalSearch.value = '';
      renderSection(section);
    }
  });

  // Búsqueda global
  globalSearch.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    filterCurrentTable(term);
  });

  // Cerrar sesión
  logoutBtn.addEventListener('click', () => {
    console.log('Sesión cerrada');
    alert('Sesión cerrada');
  });

  // Cerrar modal al hacer clic fuera
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ---------- FUNCIÓN PRINCIPAL DE RENDER ----------
  async function renderSection(section) {
    // Activar item del menú
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });

    // Mostrar loading
    dynamicContent.innerHTML = `<div class="empty-state"><p>Cargando...</p></div>`;

    try {
      switch (section) {
        case 'dashboard': await renderDashboard(); break;
        case 'regiones':  await renderRegiones(); break;
        case 'ciudades':  await renderCiudades(); break;
        case 'sedes':     await renderSedes(); break;
        case 'usuarios':  await renderUsuarios(); break;
        default: await renderDashboard();
      }
    } catch (error) {
      dynamicContent.innerHTML = `<div class="empty-state"><p>Error al cargar datos: ${error.message}</p></div>`;
    }
  }

  // ---------- DASHBOARD ----------
  async function renderDashboard() {
    sectionTitle.textContent = 'Panel de control';
    sectionSubtitle.textContent = 'Resumen general del sistema';

    // Obtener datos (si no están en caché, los pedimos)
    await refreshAllData();

    const totalRegiones = allData.regiones.length;
    const totalCiudades = allData.ciudades.length;
    const totalSedes = allData.sedes.length;
    const totalUsuarios = allData.usuarios.length;

    const activos = (arr, campo = 'estado') => arr.filter(item => item[campo] === 'Activo').length;

    let html = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-globe-americas"></i></div>
          <div class="stat-info"><h3>${totalRegiones}</h3><span>Regiones</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-city"></i></div>
          <div class="stat-info"><h3>${totalCiudades}</h3><span>Ciudades</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-building"></i></div>
          <div class="stat-info"><h3>${totalSedes}</h3><span>Sedes</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-users"></i></div>
          <div class="stat-info"><h3>${totalUsuarios}</h3><span>Usuarios</span></div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h2><i class="fas fa-chart-line"></i> Actividad reciente</h2>
        </div>
        <div class="table-responsive">
          <table>
            <thead><tr><th>Entidad</th><th>Total</th><th>Activos</th><th>Inactivos</th></tr></thead>
            <tbody>
              <tr><td>Regiones</td><td>${totalRegiones}</td><td>${activos(allData.regiones)}</td><td>${totalRegiones - activos(allData.regiones)}</td></tr>
              <tr><td>Ciudades</td><td>${totalCiudades}</td><td>${activos(allData.ciudades)}</td><td>${totalCiudades - activos(allData.ciudades)}</td></tr>
              <tr><td>Sedes</td><td>${totalSedes}</td><td>${activos(allData.sedes)}</td><td>${totalSedes - activos(allData.sedes)}</td></tr>
              <tr><td>Usuarios</td><td>${totalUsuarios}</td><td>${activos(allData.usuarios)}</td><td>${totalUsuarios - activos(allData.usuarios)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h2><i class="fas fa-user-check"></i> Últimos usuarios registrados</h2>
        </div>
        <div class="table-responsive">
          <table>
            <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th></tr></thead>
            <tbody>
              ${allData.usuarios.slice(0, 5).map(u => `
                <tr>
                  <td>${u.nombre} ${u.apellido}</td>
                  <td>${u.email}</td>
                  <td>${u.rol}</td>
                  <td><span class="badge ${u.estado === 'Activo' ? 'badge-success' : ''}">${u.estado}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    dynamicContent.innerHTML = html;
  }

  // ---------- SECCIÓN REGIONES ----------
  async function renderRegiones() {
    sectionTitle.textContent = 'Gestión de Regiones';
    sectionSubtitle.textContent = 'Administra las regiones geográficas';

    await refreshAllData();
    const data = allData.regiones;

    let html = buildStats(data, 'Regiones', 'Activas');
    html += buildTableCard('Listado de regiones', [
      { label: 'ID', key: 'id' },
      { label: 'Nombre', key: 'nombre' },
      { label: 'Código', key: 'codigo' },
      { label: 'Descripción', key: 'descripcion' },
      { label: 'Estado', key: 'estado', badge: true },
      { label: 'Acciones', actions: ['editar', 'eliminar'] }
    ], data, 'region');

    html += `<button class="btn-primary" style="margin-top:20px;" onclick="openModal('region')">
      <i class="fas fa-plus-circle"></i> Nueva región
    </button>`;

    dynamicContent.innerHTML = html;
  }

  // ---------- SECCIÓN CIUDADES ----------
  async function renderCiudades() {
    sectionTitle.textContent = 'Gestión de Ciudades';
    sectionSubtitle.textContent = 'Ciudades asociadas a regiones';

    await refreshAllData();
    const data = allData.ciudades;

    let html = buildStats(data, 'Ciudades', 'Activas');
    html += buildTableCard('Listado de ciudades', [
      { label: 'ID', key: 'id' },
      { label: 'Nombre', key: 'nombre' },
      { label: 'Código', key: 'codigo' },
      { label: 'Región', key: 'region' },
      { label: 'Estado', key: 'estado', badge: true },
      { label: 'Acciones', actions: ['editar', 'eliminar'] }
    ], data, 'ciudad');

    html += `<button class="btn-primary" style="margin-top:20px;" onclick="openModal('ciudad')">
      <i class="fas fa-plus-circle"></i> Nueva ciudad
    </button>`;

    dynamicContent.innerHTML = html;
  }

  // ---------- SECCIÓN SEDES ----------
  async function renderSedes() {
    sectionTitle.textContent = 'Gestión de Sedes';
    sectionSubtitle.textContent = 'Sedes físicas por ciudad';

    await refreshAllData();
    const data = allData.sedes;

    let html = buildStats(data, 'Sedes', 'Activas');
    html += buildTableCard('Listado de sedes', [
      { label: 'ID', key: 'id' },
      { label: 'Nombre', key: 'nombre' },
      { label: 'Código', key: 'codigo' },
      { label: 'Ciudad', key: 'ciudad' },
      { label: 'Dirección', key: 'direccion' },
      { label: 'Estado', key: 'estado', badge: true },
      { label: 'Acciones', actions: ['editar', 'eliminar'] }
    ], data, 'sede');

    html += `<button class="btn-primary" style="margin-top:20px;" onclick="openModal('sede')">
      <i class="fas fa-plus-circle"></i> Nueva sede
    </button>`;

    dynamicContent.innerHTML = html;
  }

  // ---------- SECCIÓN USUARIOS ----------
  async function renderUsuarios() {
    sectionTitle.textContent = 'Gestión de Usuarios';
    sectionSubtitle.textContent = 'Vendedores, supervisores y administradores';

    await refreshAllData();
    const data = allData.usuarios;

    let html = buildStats(data, 'Usuarios', 'Activos');
    html += buildTableCard('Usuarios del sistema', [
      { label: 'ID', key: 'id' },
      { label: 'Cédula', key: 'cedula' },
      { label: 'Nombre', key: 'nombre', concat: 'apellido' },
      { label: 'Email', key: 'email' },
      { label: 'Sede', key: 'sede' },
      { label: 'Rol', key: 'rol' },
      { label: 'Estado', key: 'estado', badge: true },
      { label: 'Acciones', actions: ['editar', 'activar/desactivar'] }
    ], data, 'usuario');

    html += `<button class="btn-primary" style="margin-top:20px;" onclick="openModal('usuario')">
      <i class="fas fa-user-plus"></i> Nuevo usuario
    </button>`;

    dynamicContent.innerHTML = html;
  }

  // ---------- FUNCIONES AUXILIARES DE VISTA ----------
  function buildStats(data, label, activoLabel) {
    const total = data.length;
    const activos = data.filter(item => item.estado === 'Activo').length;
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-layer-group"></i></div>
          <div class="stat-info"><h3>${total}</h3><span>${label}</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
          <div class="stat-info"><h3>${activos}</h3><span>${activoLabel}</span></div>
        </div>
      </div>
    `;
  }

  function buildTableCard(title, columns, data, entityType) {
    return `
      <div class="section-card">
        <div class="section-header">
          <h2>${title}</h2>
        </div>
        <div class="table-responsive">
          <table id="dataTable">
            <thead>
              <tr>${columns.map(col => `<th>${col.label}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map(row => {
                let tds = columns.map(col => {
                  if (col.actions) {
                    return `<td class="action-icons">
                      ${col.actions.includes('editar') ? `<i class="fas fa-edit" onclick="openModal('${entityType}', ${row.id})" title="Editar"></i>` : ''}
                      ${col.actions.includes('eliminar') ? `<i class="fas fa-trash-alt" onclick="eliminarEntidad('${entityType}', ${row.id})" title="Eliminar"></i>` : ''}
                      ${col.actions.includes('activar/desactivar') ? 
                        `<i class="fas ${row.estado === 'Activo' ? 'fa-user-slash' : 'fa-user-check'}" onclick="toggleEstadoUsuario(${row.id}, '${row.estado}')" title="${row.estado === 'Activo' ? 'Desactivar' : 'Activar'}"></i>` : ''}
                    </td>`;
                  }
                  let value;
                  if (col.concat) {
                    value = `${row[col.key]} ${row[col.concat] || ''}`;
                  } else {
                    value = row[col.key];
                  }
                  if (col.badge) {
                    return `<td><span class="badge ${value === 'Activo' ? 'badge-success' : ''}">${value || 'N/A'}</span></td>`;
                  }
                  return `<td>${value || '—'}</td>`;
                }).join('');
                return `<tr>${tds}</tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ---------- FILTRADO LOCAL ----------
  function filterCurrentTable(term) {
    const table = document.getElementById('dataTable');
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? '' : 'none';
    });
  }

  // ---------- APIS Y REFRESCO DE CACHÉ ----------
  async function refreshAllData() {
    try {
      const [regiones, ciudades, sedes, usuarios] = await Promise.all([
        api.listarRegiones(),
        api.listarCiudades(),
        api.listarSedes(),
        api.listarUsuarios()
      ]);
      allData.regiones = regiones;
      allData.ciudades = ciudades;
      allData.sedes = sedes;
      allData.usuarios = usuarios;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error;
    }
  }

  // ---------- MODAL GENÉRICO ----------
  window.openModal = function(entityType, id = null) {
    let formHtml = '';
    const isEdit = id !== null;
    let existing = null;

    if (isEdit) {
      // Buscar el elemento en la caché
      const cacheMap = {
        region: allData.regiones,
        ciudad: allData.ciudades,
        sede: allData.sedes,
        usuario: allData.usuarios
      };
      existing = cacheMap[entityType]?.find(item => item.id === id);
      if (!existing) {
        mostrarNotificacion('Elemento no encontrado', 'error');
        return;
      }
    }

    // Construir formulario según tipo
    formHtml += `<h3>${isEdit ? 'Editar' : 'Nuevo'} ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}</h3>`;
    formHtml += `<form id="modalForm">`;

    switch (entityType) {
      case 'region':
        formHtml += `
          <div class="form-group"><label>Nombre</label><input type="text" name="nombre" value="${existing?.nombre || ''}" required></div>
          <div class="form-group"><label>Código</label><input type="text" name="codigo" value="${existing?.codigo || ''}" required></div>
          <div class="form-group"><label>Descripción</label><textarea name="descripcion" rows="2">${existing?.descripcion || ''}</textarea></div>
          <div class="form-group"><label>Estado</label>
            <select name="estado">
              <option value="Activo" ${existing?.estado === 'Activo' ? 'selected' : ''}>Activo</option>
              <option value="Inactivo" ${existing?.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>
        `;
        break;
      case 'ciudad':
        formHtml += `
          <div class="form-group"><label>Nombre</label><input type="text" name="nombre" value="${existing?.nombre || ''}" required></div>
          <div class="form-group"><label>Código</label><input type="text" name="codigo" value="${existing?.codigo || ''}" required></div>
          <div class="form-group"><label>Región ID</label><input type="number" name="regionId" value="${existing?.regionId || ''}" required></div>
          <div class="form-group"><label>Estado</label>
            <select name="estado">
              <option value="Activo" ${existing?.estado === 'Activo' ? 'selected' : ''}>Activo</option>
              <option value="Inactivo" ${existing?.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>
        `;
        break;
      case 'sede':
        formHtml += `
          <div class="form-group"><label>Nombre</label><input type="text" name="nombre" value="${existing?.nombre || ''}" required></div>
          <div class="form-group"><label>Código</label><input type="text" name="codigo" value="${existing?.codigo || ''}" required></div>
          <div class="form-group"><label>Ciudad ID</label><input type="number" name="ciudadId" value="${existing?.ciudadId || ''}" required></div>
          <div class="form-group"><label>Dirección</label><input type="text" name="direccion" value="${existing?.direccion || ''}"></div>
          <div class="form-group"><label>Estado</label>
            <select name="estado">
              <option value="Activo" ${existing?.estado === 'Activo' ? 'selected' : ''}>Activo</option>
              <option value="Inactivo" ${existing?.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>
        `;
        break;
      case 'usuario':
        formHtml += `
          <div class="form-group"><label>Cédula</label><input type="text" name="cedula" value="${existing?.cedula || ''}" ${isEdit ? 'readonly' : 'required'}></div>
          <div class="form-group"><label>Nombre</label><input type="text" name="nombre" value="${existing?.nombre || ''}" required></div>
          <div class="form-group"><label>Apellido</label><input type="text" name="apellido" value="${existing?.apellido || ''}" required></div>
          <div class="form-group"><label>Email</label><input type="email" name="email" value="${existing?.email || ''}" required></div>
          <div class="form-group"><label>Sede ID</label><input type="number" name="sedeId" value="${existing?.sedeId || ''}" required></div>
          <div class="form-group"><label>Rol</label>
            <select name="rol">
              <option value="Vendedor" ${existing?.rol === 'Vendedor' ? 'selected' : ''}>Vendedor</option>
              <option value="Supervisor" ${existing?.rol === 'Supervisor' ? 'selected' : ''}>Supervisor</option>
              <option value="Admin" ${existing?.rol === 'Admin' ? 'selected' : ''}>Admin</option>
            </select>
          </div>
          <div class="form-group"><label>Estado</label>
            <select name="estado">
              <option value="Activo" ${existing?.estado === 'Activo' ? 'selected' : ''}>Activo</option>
              <option value="Inactivo" ${existing?.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
            </select>
          </div>
        `;
        break;
      default: return;
    }

    formHtml += `<div class="form-actions">
      <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
      <button type="submit" class="btn-primary">${isEdit ? 'Guardar cambios' : 'Crear'}</button>
    </div></form>`;

    modalContent.innerHTML = formHtml;
    modalOverlay.classList.add('active');

    // Manejar envío
    document.getElementById('modalForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const payload = Object.fromEntries(formData.entries());
      // Convertir campos numéricos
      if (payload.ciudadId) payload.ciudadId = parseInt(payload.ciudadId);
      if (payload.regionId) payload.regionId = parseInt(payload.regionId);
      if (payload.sedeId) payload.sedeId = parseInt(payload.sedeId);

      try {
        if (isEdit) {
          switch (entityType) {
            case 'region': await api.actualizarRegion(id, payload); break;
            case 'ciudad': await api.actualizarCiudad(id, payload); break;
            case 'sede': await api.actualizarSede(id, payload); break;
            case 'usuario': await api.actualizarUsuario(id, payload); break;
          }
          mostrarNotificacion('Actualizado correctamente');
        } else {
          switch (entityType) {
            case 'region': await api.crearRegion(payload); break;
            case 'ciudad': await api.crearCiudad(payload); break;
            case 'sede': await api.crearSede(payload); break;
            case 'usuario': await api.registrarUsuario(payload); break;
          }
          mostrarNotificacion('Creado correctamente');
        }
        closeModal();
        renderSection(currentSection); // Recargar datos
      } catch (error) {
        mostrarNotificacion(error.message || 'Error al guardar', 'error');
      }
    });
  };

  window.closeModal = function() {
    modalOverlay.classList.remove('active');
    modalContent.innerHTML = '';
  };

  // ---------- ACCIONES DIRECTAS (eliminar, cambiar estado) ----------
  window.eliminarEntidad = async function(entityType, id) {
    const confirmacion = await confirmarAccion('¿Estás seguro de eliminar este elemento?');
    if (!confirmacion) return;

    try {
      switch (entityType) {
        case 'region': await api.eliminarRegion(id); break;
        case 'ciudad': await api.eliminarCiudad(id); break;
        case 'sede': await api.eliminarSede(id); break;
        case 'usuario': await api.desactivarUsuario(id); break; // Soft delete
      }
      mostrarNotificacion('Eliminado correctamente');
      renderSection(currentSection);
    } catch (error) {
      mostrarNotificacion(error.message || 'Error al eliminar', 'error');
    }
  };

  window.toggleEstadoUsuario = async function(id, estadoActual) {
    try {
      if (estadoActual === 'Activo') {
        await api.desactivarUsuario(id);
      } else {
        await api.activarUsuario(id);
      }
      mostrarNotificacion('Estado actualizado');
      renderSection('usuarios');
    } catch (error) {
      mostrarNotificacion(error.message, 'error');
    }
  };

  // ---------- INICIALIZAR ----------
  await renderSection('dashboard');
});