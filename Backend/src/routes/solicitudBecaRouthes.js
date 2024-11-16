const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { postSolicitudBeca, getSolicitudId, getSolicitudes } = require('../services/solitudes_beca');

router.use(verifyToken);

router.post('/envioSolicitud', postSolicitudBeca);
router.get('/buscarSolicitud', getSolicitudId);
router.get('/solicitudes', getSolicitudes);

module.exports = router;
