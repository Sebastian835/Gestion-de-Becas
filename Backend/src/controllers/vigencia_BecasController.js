const {
  postVigenciaBecas,
  getVigenciaBecas,
  getVigenciaBecasActivas,
  deleteVigenciaBecas,
  updateVigenciaBecas,
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
    res.status(500).json({ error: "Error obteniendo los periodos" });
  }
}

async function getVigenciaBecasActivasController(req, res) {
  try {
    const vigencia = await getVigenciaBecasActivas();
    res.status(200).json(vigencia);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los periodos" });
  }
}

async function deleteVigenciaBecasController(req, res) {
  try {
    const vigencia = await deleteVigenciaBecas(req.params.id);
    res.status(200).json(vigencia);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el plazo." });
  }
}

async function updateVigenciaBecasController(req, res) {
  try {
    const vigencia = await updateVigenciaBecas(req.body);
    res.status(200).json(vigencia);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el plazo." });
  }
}



module.exports = {
  postVigenciaBecasController,
  getVigenciaBecasController,
  getVigenciaBecasActivasController,
  deleteVigenciaBecasController,
  updateVigenciaBecasController,
};
