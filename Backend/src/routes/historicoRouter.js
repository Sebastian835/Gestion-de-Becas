const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  historicoController,
} = require("../controllers/historicoController");

router.use(verifyToken);


router.get('/getHistorico/:cedula', historicoController.getHistorico);
router.get('/getSolicitudHistorico/:cedula/:periodo', historicoController.getSolicitudPDF);
router.get('/getDocumentos/:ruta', historicoController.getDocumentoArchivo);

module.exports = router;
