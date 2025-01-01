const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  postVigenciaBecasController,
  getVigenciaBecasController,
  getVigenciaBecasActivasController
} = require("../controllers/vigencia_BecasController");
const router = express.Router();

router.use(verifyToken);

router.post("/crearPlazoBecas", postVigenciaBecasController);

router.get("/obtenerVigenciaBecas", getVigenciaBecasController);
router.get("/obtenerVigenciaBecasActivas", getVigenciaBecasActivasController);


module.exports = router;
