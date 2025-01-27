const { obtenerReporte } = require("../services/reports");
const path = require("path");

async function getReporte(req, res) {
  try {
    const filtros = req.body;
    const reporte = await obtenerReporte(filtros);
    res.status(200).json(reporte);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los usuarios." });
  }
}

async function downloadReporte(req, res) {
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "reporteGenerado",
    req.params.filename
  );
  try {
    res.download(filePath);
  } catch (error) {
    res.status(404).json({
      message: "Documento no encontrado",
    });
  }
}

module.exports = {
  getReporte,
  downloadReporte,
};
