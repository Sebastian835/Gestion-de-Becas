const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { postSolicitudBeca } = require('../services/solitudes_beca');
const { getSolicitudId } = require('../services/solitudes_beca');
const { getSolicitudes } = require('../services/solitudes_beca');

router.use(verifyToken);

router.post('/envioSolicitud', postSolicitudBeca);
router.get('/buscarSolicitud', getSolicitudId);
router.get('/solicitudes', getSolicitudes);

module.exports = router;
