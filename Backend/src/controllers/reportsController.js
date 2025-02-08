const { obtenerReporte, obtenerPreliminar } = require("../services/reports");
const path = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');  


async function getReporte(req, res) {
  try {
    const filtros = req.body;
    const reporte = await obtenerReporte(filtros);
    res.status(200).json(reporte);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los usuarios." });
  }
}

async function getPreliminar(req, res) {
  try {
    const reporte = await obtenerPreliminar();
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
    await fs.access(filePath);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
    
    const fileStream = fsSync.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error en stream:', error);
      res.status(500).json({
        message: "Error al leer el archivo",
      });
    });
  } catch (error) {
    console.error('Error en descarga:', error);
    res.status(404).json({
      message: "Documento no encontrado",
    });
  }
}


module.exports = {
  getReporte,
  downloadReporte,
  getPreliminar,
};
