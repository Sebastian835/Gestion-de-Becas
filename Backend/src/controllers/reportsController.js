const { obtenerReporte } = require("../services/reports");

async function getReporte(req, res) {
  try {
    const filtros = req.body;
    const reporte = await obtenerReporte(filtros);
    res.status(200).json(reporte);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los usuarios." });
  }
}

module.exports = {
  getReporte,
};
