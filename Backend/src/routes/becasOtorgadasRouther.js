const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  getBecasOtorgadas,
  updateSincronizarFechas,
  getBecaVigente,
  updateBeca,
  getBecasPorcentajes,
  getPeriodosBecas,
  getBecasConteoTipo,
  getBecasPorCarrera
} = require("../controllers/becasOtorgadasController");
const router = express.Router();

router.use(verifyToken);

router.get("/obtenerBecas", getBecasOtorgadas);
router.get("/updateSincronizacion", updateSincronizarFechas);
router.get("/becaVigente", getBecaVigente);
router.get("/porcentajesBeca", getBecasPorcentajes);
router.get("/becasPeriodos", getPeriodosBecas);
router.get("/becasConteoTipo", getBecasConteoTipo);
router.get("/becasPorCarrera", getBecasPorCarrera);


router.put("/actualizarBeca", updateBeca);


module.exports = router;
