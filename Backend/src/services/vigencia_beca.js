const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function postVigenciaBecas(fecha_inicio, fecha_fin, periodo) {
  try {
    const estado = await prisma.istla_estado_solicitud.findFirst({
      where: {
        ESTADO: "En curso",
      },
    });

    const vigencia = await prisma.istla_vigencia_beca.create({
      data: {
        FECHA_INICIO: fecha_inicio,
        FECHA_FIN: fecha_fin,
        ID_ESTADO: estado.ID_ESTADO,
        ID_PERIODO: parseInt(periodo, 10),
      },
    });

    return vigencia;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message);
  }
}

async function getVigenciaBecas() {
  try {
    const vigenciaBecas = await prisma.istla_vigencia_beca.findMany({
      include: {
        istla_estado_solicitud: {
          select: {
            ESTADO: true,
          },
        },
      },
    });

    return vigenciaBecas;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message); 
  }
}

async function getVigenciaBecasActivas() {
  try {
    const vigenciaBecas = await prisma.istla_vigencia_beca.findMany({
      where: {
        ID_ESTADO: 5,
      }, 
      include: {
        istla_estado_solicitud: {
          select: {
            ESTADO: true,
          },
        },
      },
    });

    return vigenciaBecas;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message); 
  }
}

module.exports = {
  postVigenciaBecas,
  getVigenciaBecas,
  getVigenciaBecasActivas
};
