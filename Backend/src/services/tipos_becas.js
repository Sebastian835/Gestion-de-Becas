const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTiposBecas(req, res) {
  try {
    const tiposBecas = await prisma.istla_tipo_beca.findMany();
    res.json(tiposBecas);
  } catch (error) {
    console.error("Error al obtener tipos de becas:", error);
    res.status(500).json({ error: "Error: " + error.message });
  }
}

module.exports = {
  getTiposBecas,
};
