const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

console.log('SERVER RUNNING FROM:', __filename);
console.log('WORKDIR:', process.cwd());

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/programs', require('./routes/programRoutes'));

// Error handler
app.use(require('./middleware/errorHandler'));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('MongoDB error:', err.message));

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
