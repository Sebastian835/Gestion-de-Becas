const { postBecas, getBecas, updateSincronizacionFechas } = require("../services/becas_Otorgadas");

async function getBecasOtorgadas(req, res) {
  try {
    const becas = await getBecas();
    res.status(200).json(becas);
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

module.exports = {
  getBecasOtorgadas,
  updateSincronizarFechas,
};
