const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  getUsuariosController,
  getPeriodosController,
  getEstudiantesController,
  getCarrerasController
} = require("../controllers/api_istlaController");

router.use(verifyToken);

router.get("/periodosIstla", getPeriodosController);
router.get("/usuariosIstla", getUsuariosController);
router.get("/estudiantesIstla", getEstudiantesController);
router.get("/carrerasIstla", getCarrerasController);


module.exports = router;
