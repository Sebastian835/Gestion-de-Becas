const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getTiposBecas() {
  try {
    const tiposBecas = await prisma.istla_tipo_beca.findMany();
    return tiposBecas;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message); 
  }
}

module.exports = {
  getTiposBecas,
};
