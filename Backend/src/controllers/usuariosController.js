const {
  getUsuarios,
  postUsuario,
  updateUsuario,
  deleteUsuario,
  getRoles,
} = require("../services/usuarios");

async function roles(req, res) {
  try {
    const roles = await getRoles();

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los roles" });
  }
}

async function Usuarios(req, res) {
  try {
    const users = await getUsuarios();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los usuarios" });
  }
}

async function crearUsuario(req, res) {
  try {
    const data = req.body;
    const user = await postUsuario(data);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creando usuario" });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const data = req.body;
    const user = await updateUsuario(data);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    const user = await deleteUsuario(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error a eliminar usuario" });
  }
}

module.exports = {
  Usuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  roles,
};
