const express = require("express");
const fileUpload = require('express-fileupload');

const { verifyToken } = require("../middleware/auth");
const {
  getBecasOtorgadas,
  updateSincronizarFechas,
  getBecaVigente,
  updateBeca,
  getBecasPorcentajes,
  getPeriodosBecas,
  getBecasConteoTipo,
  getBecasPorCarrera,
  getBecasPorId,
  getBecasPorIdEstudiante,
  renovarBeca,
  verDocumentoRenovacion,
  updateCaducidadBeca
} = require("../controllers/becasOtorgadasController");
const router = express.Router();

router.use(fileUpload());
router.use(verifyToken);

router.get("/obtenerBecas", getBecasOtorgadas);
router.get("/updateSincronizacion", updateSincronizarFechas);
router.get("/becaVigente", getBecaVigente);
router.get("/porcentajesBeca", getBecasPorcentajes);
router.get("/becasPeriodos", getPeriodosBecas);
router.get("/becasConteoTipo", getBecasConteoTipo);
router.get("/becasPorCarrera", getBecasPorCarrera)
router.get("/verDocumento", verDocumentoRenovacion);
router.post("/becaExisteEstudiante", getBecasPorIdEstudiante);
router.get("/updateCaducidad", updateCaducidadBeca);

router.post("/getBecaById", getBecasPorId);
router.post("/renovacion", renovarBeca);

router.put("/actualizarBeca", updateBeca);


module.exports = router;
