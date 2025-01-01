const {
  postVigenciaBecas,
  getVigenciaBecas,
  getVigenciaBecasActivas
} = require("../services/vigencia_beca");

async function postVigenciaBecasController(req, res) {
  try {
    const vigencia = await postVigenciaBecas(
      req.body.fechaInicio,
      req.body.fechaFin,
      req.body.periodo
    );
    res.status(200).json(vigencia);
  } catch (error) {
    res.status(500).json({ error: "Error creando el plazo." });
  }
}

async function getVigenciaBecasController(req, res) {
  try {
    const vigencia = await getVigenciaBecas();
    res.status(200).json(vigencia);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

async function getVigenciaBecasActivasController(req, res) {
  try {
    const vigencia = await getVigenciaBecasActivas();
    res.status(200).json(vigencia);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo las becas" });
  }
}

module.exports = {
  postVigenciaBecasController,
  getVigenciaBecasController,
  getVigenciaBecasActivasController
};
