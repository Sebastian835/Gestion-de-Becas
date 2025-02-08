const path = require("path");
const {
  getBecas,
  updateSincronizacionFechas,
  getBecaCedula,
  updateDatoBeca,
  getporcentajesBeca,
  getBecasPeriodos,
  getBecasTipo,
  obtenerBecasPorCarrera,
  getBecasById,
  getBecasByIdValidacionEstudiante,
  postRenovacion,
  updateCaducidad,
  updatePorcentaje
} = require("../services/becas_Otorgadas");

async function getBecasOtorgadas(req, res) {
  try {
    const becas = await getBecas();

    if (!becas) {
      return res.json({ noHay: true });
    }

    res.status(200).json(becas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function getBecasPorId(req, res) {
  try {
    const cedula = req.body.cedula;
    const becas = await getBecasById(cedula);
    res.status(200).json(becas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function getBecasPorIdEstudiante(req, res) {
  try {
    const cedula = req.body.cedula;
    const beca = await getBecasByIdValidacionEstudiante(cedula);
    res.status(200).json(beca);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function getBecaVigente(req, res) {
  try {
    const { cedula } = req.query;
    const beca = await getBecaCedula(cedula);

    res.status(200).json(beca);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function updateBeca(req, res) {
  try {
    const data = req.body;
    const beca = await updateDatoBeca(data);

    res.status(200).json(beca);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function updateSincronizarFechas(req, res) {
  try {
    const becas = await updateSincronizacionFechas();
    res.status(200).json(becas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function updateCaducidadBeca(req, res) {
  try {
    const caducar = await updateCaducidad();
    res.status(200).json(caducar);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function updatePorcentajeBeca(req, res) {
  try {
    const updateBecas = await updatePorcentaje();
    res.status(200).json(updateBecas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function getBecasPorcentajes(req, res) {
  try {
    const becas = await getporcentajesBeca();
    res.status(200).json(becas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function getPeriodosBecas(req, res) {
  try {
    const becas = await getBecasPeriodos();
    res.status(200).json(becas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function getBecasConteoTipo(req, res) {
  try {
    const becas = await getBecasTipo();
    res.status(200).json(becas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function getBecasPorCarrera(req, res) {
  try {
    const becas = await obtenerBecasPorCarrera();
    res.status(200).json(becas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function renovarBeca(req, res) {
  try {
    const { cedula } = req.body;
    const documento = req.files.documento;

    if (!documento) {
      return res
        .status(400)
        .json({ error: "No se ha enviado ningún documento" });
    }

    if (documento.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "El archivo debe ser PDF" });
    }

    if (documento.size > 2000000) {
      return res
        .status(400)
        .json({ error: "El archivo excede los 2MB permitidos" });
    }

    await postRenovacion(documento, cedula);

    res.status(200).json({ message: "Documento recibido correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la renovación" });
  }
}

async function verDocumentoRenovacion(req, res) {
  try {
    const { ruta } = req.query;

    if (!ruta) {
      return res.status(400).json({ error: "Ruta no proporcionada" });
    }

    const rutaCompleta = path.resolve(ruta);
    res.sendFile(rutaCompleta);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el documento" });
  }
}

module.exports = {
  getBecasOtorgadas,
  updateSincronizarFechas,
  getBecaVigente,
  updateBeca,
  getBecasPorcentajes,
  getPeriodosBecas,
  getBecasConteoTipo,
  getBecasPorCarrera,
  getBecasPorId,
  getBecasPorIdEstudiante,
  renovarBeca,
  verDocumentoRenovacion,
  updateCaducidadBeca,
  updatePorcentajeBeca,
};
