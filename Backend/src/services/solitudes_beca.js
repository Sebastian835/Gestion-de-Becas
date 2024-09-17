const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function postSolicitudBeca(req, res) {
    try {
        const data = req.body;

        res.status(200).json();
    } catch (error) {
        console.error('Error en la solicitud:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = { postSolicitudBeca };

