const { getTiposBecas  } = require('../services/tipos_becas');

async function getTiposBecasController(req, res) {
  try {
    const becas = await getTiposBecas(); 
    res.status(200).json(becas); 
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

module.exports = {
    getTiposBecasController,
};
