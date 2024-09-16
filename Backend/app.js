require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const cookieParser = require('cookie-parser');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1'; 

app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
