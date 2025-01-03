const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require("dayjs");

function convertToISODate(fecha) {
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) {
    return dayjs(fecha, "D/M/YYYY").add(1, "day").toDate();
  } else if (/^\d{4}-\d{2}-\d{2}T/.test(fecha)) {
    return dayjs(fecha).add(1, "day").toDate();
  } else {
    throw new Error("Formato de fecha no soportado");
  }
}

async function postVigenciaBecas(fecha_inicio, fecha_fin, periodo) {
  try {
    const fechaInicio = convertToISODate(fecha_inicio);
    const fechaFin = convertToISODate(fecha_fin);

    const estado = await prisma.istla_estado_solicitud.findFirst({
      where: {
        ESTADO: "En curso",
      },
    });

    const vigencia = await prisma.istla_vigencia_beca.create({
      data: {
        FECHA_INICIO: fechaInicio,
        FECHA_FIN: fechaFin,
        ID_ESTADO: estado.ID_ESTADO,
        ID_PERIODO: parseInt(periodo, 10),
      },
    });

    return vigencia;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message);
  }
}

async function deleteVigenciaBecas(id) {
  try {
    const vigencia = await prisma.istla_vigencia_beca.findFirst({
      where: {
        ID_VIGENCIA: parseInt(id, 10),
      },
    });

    const solicitud = await prisma.istla_solicitudes_beca.findFirst({
      where: {
        ID_VIGENCIA: vigencia.ID_VIGENCIA,
      },
    });

    if (solicitud) {
      const estado = await prisma.istla_estado_solicitud.findFirst({
        where: {
          ESTADO: "Finalizado",
        },
      });
      await prisma.istla_vigencia_beca.update({
        where: {
          ID_VIGENCIA: parseInt(id, 10),
        },
        data: {
          ID_ESTADO: estado.ID_ESTADO,
        },
      });
      return false;
    } else {
      await prisma.istla_vigencia_beca.delete({
        where: {
          ID_VIGENCIA: parseInt(id, 10),
        },
      });
      return true;
    }
  } catch (error) {
    throw new Error();
  }
}

async function updateVigenciaBecas(datos) {
  try {
    const fechaInicio = convertToISODate(datos.FECHA_INICIO);
    const fechaFin = convertToISODate(datos.FECHA_FIN);

    const vigencia = await prisma.istla_vigencia_beca.update({
      where: {
        ID_VIGENCIA: datos.ID_VIGENCIA,
      },
      data: {
        FECHA_INICIO: fechaInicio,
        FECHA_FIN: fechaFin,
      },
    });

    return vigencia;
  } catch (error) {
    throw new Error("Error al procesar las fechas");
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
  getVigenciaBecasActivas,
  deleteVigenciaBecas,
  updateVigenciaBecas,
};
