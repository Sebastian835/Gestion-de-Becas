require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');

const app = express();

app.use(cors());

app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1'; 

app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
