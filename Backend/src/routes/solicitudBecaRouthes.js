const express = require('express');
const router = express.Router();
const { postSolicitudBeca } = require('../services/solitudes_beca');


router.post('/envioSolicitud', postSolicitudBeca);

module.exports = router;
