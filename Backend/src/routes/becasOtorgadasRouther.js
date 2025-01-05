const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  getBecasOtorgadas,
  updateSincronizarFechas,
  getBecaVigente,
  updateBeca
} = require("../controllers/becasOtorgadasController");
const router = express.Router();

router.use(verifyToken);

router.get("/obtenerBecas", getBecasOtorgadas);
router.get("/updateSincronizacion", updateSincronizarFechas);
router.get("/becaVigente", getBecaVigente);

router.put("/actualizarBeca", updateBeca);



module.exports = router;
