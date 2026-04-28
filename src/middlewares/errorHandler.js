// Middleware de manejo de errores global
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validar si es un error de Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: 'Violation of unique constraint',
      field: err.meta?.target?.[0],
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found',
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

// Middleware de log de peticiones
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

// Middleware para validar JSON
export const validateJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON',
    });
  }
  next();
};
