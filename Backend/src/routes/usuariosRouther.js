const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  usuarios,
  crearUsuario,
  busquedaUsuario,
  actualizarUsuario,
  eliminarUsuario,
  roles,
} = require("../controllers/usuariosController");

const router = express.Router();

router.use(verifyToken);

router.get("/getRoles", roles);

router.get("/getUsuarios", usuarios);

router.get("/getUsuarioBusqueda", busquedaUsuario);

router.post("/postUsuario", crearUsuario);

router.put("/updateUsuario", actualizarUsuario);

router.delete("/deleteUsuario/:id", eliminarUsuario);

module.exports = router;
