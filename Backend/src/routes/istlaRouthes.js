const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getUsuariosController, getPeriodosController } = require("../controllers/api_istlaController");


router.use(verifyToken);

router.get("/periodosIstla", getPeriodosController);
router.get("/usuariosIstla", getUsuariosController);

module.exports = router;
