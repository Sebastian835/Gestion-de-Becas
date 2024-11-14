const express = require('express');
const router = express.Router();
const { postSolicitudBeca } = require('../services/solitudes_beca');
const { getSolicitudId } = require('../services/solitudes_beca');


router.post('/envioSolicitud', postSolicitudBeca);
router.get('/buscarSolicitud', getSolicitudId);

module.exports = router;
