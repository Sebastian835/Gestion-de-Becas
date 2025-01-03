const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  postVigenciaBecasController,
  getVigenciaBecasController,
  getVigenciaBecasActivasController,
  deleteVigenciaBecasController,
  updateVigenciaBecasController
} = require("../controllers/vigencia_BecasController");
const router = express.Router();

router.use(verifyToken);

router.post("/crearPlazoBecas", postVigenciaBecasController);

router.get("/obtenerVigenciaBecas", getVigenciaBecasController);
router.get("/obtenerVigenciaBecasActivas", getVigenciaBecasActivasController);

router.delete("/eliminarPlazoBecas/:id", deleteVigenciaBecasController);

router.put("/actualizarPlazoBeca", updateVigenciaBecasController);



module.exports = router;
