import clienteRepository from '../repositories/clienteRepository.js';

export class ClienteService {
  // Mapear campos del frontend al schema de Prisma
  mapearCampos(data) {
    const mapeado = {};
    
    // Mapear campos con nombres diferentes
    if (data.nombre) {
      // Si viene un nombre completo, intentar dividirlo
      const partes = data.nombre.trim().split(' ');
      mapeado.PrimerNombre = partes[0] || null;
      mapeado.SegundoNombre = partes[1] || null;
      mapeado.PrimerApellido = partes[2] || null;
    }
    
    if (data.PrimerNombre) mapeado.PrimerNombre = data.PrimerNombre;
    if (data.SegundoNombre) mapeado.SegundoNombre = data.SegundoNombre;
    if (data.PrimerApellido) mapeado.PrimerApellido = data.PrimerApellido;
    
    // Mapear campos con el mismo nombre pero diferente caso
    if (data.cedula) mapeado.Cedula = data.cedula;
    if (data.Cedula) mapeado.Cedula = data.Cedula;
    
    if (data.telefono) mapeado.Telefono = data.telefono;
    if (data.Telefono) mapeado.Telefono = data.Telefono;
    
    if (data.email) mapeado.Email = data.email;
    if (data.Email) mapeado.Email = data.Email;
    
    if (data.idEstadoCliente) mapeado.IdEstadoCliente = parseInt(data.idEstadoCliente);
    if (data.IdEstadoCliente) mapeado.IdEstadoCliente = parseInt(data.IdEstadoCliente);
    
    // Otros campos que podrían venir
    if (data.nit) mapeado.Cedula = data.nit; // NIT se mapea como Cedula
    if (data.direccion) mapeado.Direccion = data.direccion;
    if (data.Direccion) mapeado.Direccion = data.Direccion;
    
    return mapeado;
  }

  // Crear cliente
  async crearCliente(data) {
    // Mapear campos del frontend
    const dataMapeada = this.mapearCampos(data);
    
    // Validar que al menos exista un nombre
    if (!dataMapeada.PrimerNombre) {
      throw new Error('El nombre es requerido');
    }

    // Validar que el email no exista
    if (dataMapeada.Email) {
      const existeEmail = await clienteRepository.findByEmail(dataMapeada.Email);
      if (existeEmail) {
        throw new Error('El email ya está registrado');
      }
    }

    // Validar que la cédula no exista
    if (dataMapeada.Cedula) {
      const existeCedula = await clienteRepository.findByCedula(dataMapeada.Cedula);
      if (existeCedula) {
        throw new Error('La cédula ya está registrada');
      }
    }

    return clienteRepository.create(dataMapeada);
  }

  // Obtener cliente completo
  async obtenerCliente(clienteId) {
    const cliente = await clienteRepository.findById(clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    return cliente;
  }

  // Listar clientes
  async listarClientes(filters = {}) {
    return clienteRepository.findAll(filters);
  }

  // Actualizar cliente
  async actualizarCliente(clienteId, data) {
    // Mapear campos del frontend
    const dataMapeada = this.mapearCampos(data);
    
    // Validar que el nuevo email no exista en otro cliente
    if (dataMapeada.Email) {
      const cliente = await clienteRepository.findByEmail(dataMapeada.Email);
      if (cliente && cliente.IdCliente !== parseInt(clienteId)) {
        throw new Error('El email ya está registrado');
      }
    }

    return clienteRepository.update(clienteId, dataMapeada);
  }

  // Eliminar cliente
  async eliminarCliente(clienteId) {
    return clienteRepository.delete(clienteId);
  }

  // Obtener clientes por estado
  async obtenerClientesPorEstado(estadoId) {
    return clienteRepository.findByEstado(estadoId);
  }

  // Cambiar estado del cliente
  async cambiarEstadoCliente(clienteId, estadoId) {
    return clienteRepository.update(clienteId, {
      IdEstadoCliente: estadoId,
    });
  }

  // Obtener clientes con deuda
  async obtenerClientesConDeuda() {
    const clientes = await clienteRepository.findAll();
    // Aquí puedes agregar lógica para filtrar clientes con deuda
    return clientes.filter(c => c.IdEstadoCliente); // Ejemplo básico
  }
}

export default new ClienteService();
