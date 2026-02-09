exports.validateProgram = (req, res, next) => {
  const { name } = req.body;
  console.log('validateProgram invoked, next type:', typeof next);
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    return res.status(400).json({ error: 'El campo "name" es obligatorio y debe tener al menos 3 caracteres' });
  }
  next();
};
