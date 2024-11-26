const { getUsuarios } = require('../services/api_istla');

async function getUsuariosController(req, res) {
  try {
    const usuarios = await getUsuarios(); 
    res.status(200).json(usuarios); 
  } catch (error) {
    console.error("Error obteniendo periodos:", error.message);
    res.status(500).json({ error: "Error obteniendo los usuairos." });
  }
}

module.exports = {
  getUsuariosController,
};
