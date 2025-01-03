const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPeriodos } = require("./api_istla");

async function postBecas(id, porcentaje) {
  try {
    const documentos = await prisma.istla_documentos_obligatorios.findFirst({
      where: {
        ID_DOCUMENTOS: parseInt(id, 10),
      },
    });
    const solicitud = await prisma.istla_solicitudes_beca.findFirst({
      where: {
        ID_SOLICITUD: documentos.ID_SOLICITUD,
      },
    });

    if (porcentaje > 0) {
      await prisma.istla_becas_otorgadas.create({
        data: {
          ID_SOLICITUD: solicitud.ID_SOLICITUD,
          PORCENTAJE: parseInt(porcentaje, 10),
          PERIODO_CADUCIDAD: "Proximo Periodo",
          ESTADO: 1,
        },
      });
      return;
    }

    await prisma.istla_becas_otorgadas.create({
      data: {
        ID_SOLICITUD: solicitud.ID_SOLICITUD,
        PORCENTAJE: 0,
        PERIODO_CADUCIDAD: "Proximo Periodo",
        ESTADO: 1,
      },
    });

    return;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message);
  }
}

async function getBecas() {
  try {
    const becas = await prisma.vista_becas_otorgadas.findMany();
    const periodos = await getPeriodos();

    const becasConPeriodo = becas.map((beca) => {
      const periodo = periodos.find(
        (p) => p.ID_PERIODO.toString() === beca.ID_PERIODO.toString()
      );

      if (periodo) {
        return {
          ...beca,
          NOMBRE_PERIODO: periodo.NOMBRE_PERIODO,
          ID_PERIODO: undefined,
        };
      }
    });

    return becasConPeriodo;
  } catch (error) {
    throw new Error("Error al obtener becas: " + error.message);
  }
}

async function updateSincronizacionFechas() {
  try {
    const becas = await prisma.istla_becas_otorgadas.findMany({
      where: {
        PERIODO_CADUCIDAD: "Proximo Periodo",
      },
      include: {
        istla_solicitudes_beca: {
          include: {
            istla_vigencia_beca: {
              select: {
                ID_PERIODO: true,
                FECHA_INICIO: true,
                FECHA_FIN: true,
              },
            },
          },
        },
      },
    });

    const periodos = await getPeriodos();
    
    if (becas.length === 0) return false;
    
    const periodoActualID = becas[0].istla_solicitudes_beca.istla_vigencia_beca.ID_PERIODO;
    
    const siguientePeriodo = periodos.find(periodo => 
      parseInt(periodo.ID_PERIODO) > periodoActualID
    );
    
    if (!siguientePeriodo) return false;
    
    const updatePromises = becas.map(beca => 
      prisma.istla_becas_otorgadas.update({
        where: {
          ID_BECA: beca.ID_BECA
        },
        data: {
          PERIODO_CADUCIDAD: siguientePeriodo.NOMBRE_PERIODO
        }
      })
    );
    
    await Promise.all(updatePromises);
    
    return true;
    
  } catch (error) {
    throw new Error("Error al actualizar períodos de caducidad: " + error.message);
  }
}

module.exports = {
  postBecas,
  getBecas,
  updateSincronizacionFechas,
};
