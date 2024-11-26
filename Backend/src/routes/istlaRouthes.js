const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getPeriodos } = require("../services/api_istla");
const { getUsuariosController } = require("../controllers/api_istlaController");


router.use(verifyToken);

router.get("/periodosIstla", getPeriodos);
router.get("/usuariosIstla", getUsuariosController);

module.exports = router;
