const express = require('express');
const Program = require('../models/Program');
const auth = require('../middleware/auth');
const { validateProgram } = require('../middleware/validateProgram');

const router = express.Router();

// Listar programas (público)
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find().populate('owner', 'username email');
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un programa por id (público)
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('owner', 'username email');
    if (!program) return res.status(404).json({ error: 'Programa no encontrado' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear programa (protegido)
router.post('/', auth, validateProgram, async (req, res) => {
  try {
    const { name, description, status, priority, tags, version } = req.body;
    const program = new Program({
      name,
      description,
      status,
      priority,
      tags,
      version,
      owner: req.user.id
    });

    await program.save();
    res.status(201).json(program);
  } catch (error) {
    console.error('Program create error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Actualizar programa (protegido, solo propietario)
router.put('/:id', auth, validateProgram, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ error: 'Programa no encontrado' });
    if (program.owner.toString() !== req.user.id) return res.status(403).json({ error: 'No autorizado' });

    const updates = req.body;
    Object.assign(program, updates);
    program.updatedAt = Date.now();

    await program.save();
    res.json(program);
  } catch (error) {
    console.error('Program update error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Eliminar programa (protegido, solo propietario)
router.delete('/:id', auth, async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ error: 'Programa no encontrado' });
    if (program.owner.toString() !== req.user.id) return res.status(403).json({ error: 'No autorizado' });

    await program.deleteOne();
    res.json({ message: 'Programa eliminado' });
  } catch (error) {
    console.error('Program delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
