const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  getBecasOtorgadas,
  updateSincronizarFechas
} = require("../controllers/becasOtorgadasController");
const router = express.Router();

router.use(verifyToken);

router.get("/obtenerBecas", getBecasOtorgadas);
router.get("/updateSincronizacion", updateSincronizarFechas);


module.exports = router;
