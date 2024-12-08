const { getUsuarios, getPeriodos } = require('../services/api_istla');

async function getUsuariosController(req, res) {
  try {
    const usuarios = await getUsuarios(); 
    res.status(200).json(usuarios); 
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los usuairos." });
  }
}

async function getPeriodosController(req, res) {
  try {
    const periodos = await getPeriodos(); 
    res.status(200).json(periodos); 
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los periodos." });
  }
}

module.exports = {
  getUsuariosController,
  getPeriodosController,
};
