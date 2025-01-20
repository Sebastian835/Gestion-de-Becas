const {
  getBecas,
  updateSincronizacionFechas,
  getBecaCedula,
  updateDatoBeca,
  getporcentajesBeca,
  getBecasPeriodos,
  getBecasTipo,
  obtenerBecasPorCarrera,
} = require("../services/becas_Otorgadas");

async function getBecasOtorgadas(req, res) {
  try {
    const becas = await getBecas();
    res.status(200).json(becas);
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

module.exports = {
  getBecasOtorgadas,
  updateSincronizarFechas,
  getBecaVigente,
  updateBeca,
  getBecasPorcentajes,
  getPeriodosBecas,
  getBecasConteoTipo,
  getBecasPorCarrera,
};
