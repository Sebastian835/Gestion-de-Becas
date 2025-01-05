const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  Usuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  roles,
} = require("../controllers/usuariosController");

const router = express.Router();

router.use(verifyToken);

router.get("/getRoles", roles);

router.get("/getUsuarios", Usuarios);

router.post("/postUsuario", crearUsuario);

router.put("/updateUsuario", actualizarUsuario);

router.delete("/deleteUsuario/:id", eliminarUsuario);

module.exports = router;
