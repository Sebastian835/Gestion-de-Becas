const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const {
  getPeriodos,
  getEstudiantes,
  getCarreraEstudiante,
  getMatriculasEstudiante,
} = require("./api_istla");

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

    const estado = await prisma.istla_estado_solicitud.findFirst({
      where: {
        ESTADO: "Activa",
      },
    });

    if (porcentaje > 0) {
      await prisma.istla_becas_otorgadas.create({
        data: {
          ID_SOLICITUD: solicitud.ID_SOLICITUD,
          PORCENTAJE: parseInt(porcentaje, 10),
          PERIODO_CADUCIDAD: "Proximo Periodo",
          ID_ESTADO: estado.ID_ESTADO,
        },
      });
      return;
    }

    await prisma.istla_becas_otorgadas.create({
      data: {
        ID_SOLICITUD: solicitud.ID_SOLICITUD,
        PORCENTAJE: 0,
        PERIODO_CADUCIDAD: "Proximo Periodo",
        ID_ESTADO: estado.ID_ESTADO,
      },
    });

    return;
  } catch (error) {
    throw new Error("Error al obtener documentos");
  }
}

async function getBecas() {
  try {
    const becas = await prisma.vista_becas_otorgadas.findMany({
      where: {
        ID_ESTADO: {
          not: 6,
        },
      },
    });

    if (becas.length === 0) {
      return false;
    }

    const periodos = await getPeriodos();

    const becasConPeriodos = becas.map((beca) => {
      const periodoInicio = periodos.find(
        (p) => p.ID_PERIODO.toString() === beca.ID_PERIODO.toString()
      );

      if (beca.PERIODO_CADUCIDAD === "Proximo Periodo") {
        return {
          ...beca,
          NOMBRE_PERIODO: periodoInicio ? periodoInicio.NOMBRE_PERIODO : "",
          ID_PERIODO: undefined,
        };
      } else {
        const periodoCaducidad = periodos.find(
          (p) => p.ID_PERIODO.toString() === beca.PERIODO_CADUCIDAD.toString()
        );
        return {
          ...beca,
          NOMBRE_PERIODO: periodoInicio ? periodoInicio.NOMBRE_PERIODO : "",
          PERIODO_CADUCIDAD: periodoCaducidad
            ? periodoCaducidad.NOMBRE_PERIODO
            : beca.PERIODO_CADUCIDAD,
          ID_PERIODO: undefined,
        };
      }
    });

    return becasConPeriodos;
  } catch (error) {
    throw new Error("Error al obtener becas");
  }
}

async function getBecasById(cedula) {
  try {
    const becas = await prisma.vista_becas_otorgadas.findMany({
      where: {
        CEDULA_ESTUDIANTE: cedula,
      },
    });

    if (!becas || becas.length === 0) {
      return null;
    }

    const periodos = await getPeriodos();

    const becasConPeriodos = becas.map((beca) => {
      const periodoInicio = periodos.find(
        (p) => p.ID_PERIODO.toString() === beca.ID_PERIODO.toString()
      );

      if (beca.PERIODO_CADUCIDAD === "Proximo Periodo") {
        return {
          ...beca,
          NOMBRE_PERIODO: periodoInicio ? periodoInicio.NOMBRE_PERIODO : "",
          ID_PERIODO: undefined,
        };
      } else {
        const periodoCaducidad = periodos.find(
          (p) => p.ID_PERIODO.toString() === beca.PERIODO_CADUCIDAD.toString()
        );
        return {
          ...beca,
          NOMBRE_PERIODO: periodoInicio ? periodoInicio.NOMBRE_PERIODO : "",
          PERIODO_CADUCIDAD: periodoCaducidad
            ? periodoCaducidad.NOMBRE_PERIODO
            : beca.PERIODO_CADUCIDAD,
          ID_PERIODO: undefined,
        };
      }
    });

    return becasConPeriodos;
  } catch (error) {
    throw new Error("Error al obtener becas");
  }
}

async function getBecasByIdValidacionEstudiante(cedula) {
  try {
    const beca = await prisma.vista_becas_otorgadas.findFirst({
      where: {
        CEDULA_ESTUDIANTE: cedula,
        ID_ESTADO: {
          not: 6,
        },
      },
    });

    if (beca) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Error al obtener becas");
  }
}

async function getBecaCedula(cedula) {
  try {
    const solicitud = await prisma.istla_solicitudes_beca.findFirst({
      where: {
        CEDULA_ESTUDIANTE: cedula,
      },
    });
    if (!solicitud) return null;
    const beca = await prisma.istla_becas_otorgadas.findFirst({
      where: {
        ID_SOLICITUD: solicitud.ID_SOLICITUD,
      },
    });
    if (!beca) return null;
    return beca;
  } catch (error) {
    throw new Error("Error al obtener becas");
  }
}

async function updateDatoBeca(data) {
  try {
    const beca = await prisma.istla_becas_otorgadas.findFirst({
      where: {
        ID_BECA: data.ID_BECA,
      },
    });

    if (!beca) return null;

    if (data.ID_ESTADO) {
      const updateBeca = await prisma.istla_becas_otorgadas.update({
        where: {
          ID_BECA: beca.ID_BECA,
        },
        data: {
          PORCENTAJE: parseInt(data.PORCENTAJE, 10),
          ID_ESTADO: parseInt(data.ID_ESTADO, 10),
        },
      });
    } else {
      const updateBeca = await prisma.istla_becas_otorgadas.update({
        where: {
          ID_BECA: beca.ID_BECA,
        },
        data: {
          PORCENTAJE: parseInt(data.PORCENTAJE, 10),
        },
      });
    }
    return;
  } catch (error) {
    throw new Error("Error al obtener becas");
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

    const estudiantes = await getEstudiantes();

    const becasNotas = await Promise.all(
      becas.map(async (doc) => {
        const estudiante = estudiantes.find(
          (est) =>
            est.DOCUMENTO_ESTUDIANTES ===
            doc.istla_solicitudes_beca.CEDULA_ESTUDIANTE
        );

        if (estudiante) {
          const matriculas = await getMatriculasEstudiante(
            estudiante.ID_ESTUDIANTES
          );

          const matriculasOrdenadas = matriculas.sort(
            (a, b) =>
              parseInt(b.ID_PERIODO_MATRICULA) -
              parseInt(a.ID_PERIODO_MATRICULA)
          );

          promedioAnterior =
            matriculasOrdenadas.length > 1
              ? matriculasOrdenadas[1].NOTA_PROMEDIO
              : matriculasOrdenadas.length === 1
              ? matriculasOrdenadas[0].NOTA_PROMEDIO
              : null;

          return {
            ...doc,
            ID_ESTUDIANTE: estudiante.ID_ESTUDIANTES,
            PROMEDIO_2: promedioAnterior,
          };
        }

        // Si no encontramos el estudiante, retornamos el documento original
        return doc;
      })
    );

    const periodos = await getPeriodos();

    if (becasNotas.length === 0) return false;

    const periodoActualID =
      becas[0].istla_solicitudes_beca.istla_vigencia_beca.ID_PERIODO;

    const siguientePeriodo = periodos
      .filter((periodo) => parseInt(periodo.ID_PERIODO) > periodoActualID)
      .sort((a, b) => parseInt(a.ID_PERIODO) - parseInt(b.ID_PERIODO))[0];

    if (!siguientePeriodo) return false;

    const updatePromises = becasNotas.map((beca) =>
      prisma.istla_becas_otorgadas.update({
        where: {
          ID_BECA: beca.ID_BECA,
        },
        data: {
          PERIODO_CADUCIDAD: siguientePeriodo.ID_PERIODO,
          ID_ESTADO: 8,
          PROMEDIO_2: beca.PROMEDIO_2.toString(),
        },
      })
    );

    await Promise.all(updatePromises);

    return true;
  } catch (error) {
    throw new Error(
      "Error al actualizar períodos de caducidad: " + error.message
    );
  }
}

async function updateCaducidad() {
  try {
    const becas = await prisma.istla_becas_otorgadas.findMany({
      where: {
        RENOVACION: {
          not: null,
        },
        ID_ESTADO: {
          not: 6,
        },
      },
    });

    const periodos = await getPeriodos();
    if (becas.length === 0) return false;

    for (const beca of becas) {
      if (!beca.PERIODO_CADUCIDAD) continue;

      const periodosCaducidad = periodos.find(
        (p) => p.ID_PERIODO === beca.PERIODO_CADUCIDAD
      );
      if (!periodosCaducidad) continue;

      const periodoMayor = periodos.find(
        (p) => parseInt(p.ID_PERIODO) > parseInt(periodosCaducidad.ID_PERIODO)
      );

      if (periodoMayor && beca.ID_SOLICITUD) {
        await prisma.$transaction([
          // Actualizar beca otorgada
          prisma.istla_becas_otorgadas.update({
            where: { ID_BECA: beca.ID_BECA },
            data: { ID_ESTADO: 6 },
          }),
          // Actualizar solicitud
          prisma.istla_solicitudes_beca.update({
            where: { ID_SOLICITUD: beca.ID_SOLICITUD },
            data: { ID_ESTADO: 6 },
          }),
          // Actualizar documentos obligatorios
          prisma.istla_documentos_obligatorios.updateMany({
            where: { ID_SOLICITUD: beca.ID_SOLICITUD },
            data: { ID_ESTADO: 6 },
          }),
        ]);
      }
    }
    return true;
  } catch (error) {
    throw new Error(
      "Error al actualizar períodos de caducidad: " + error.message
    );
  }
}

async function getporcentajesBeca() {
  try {
    const becasTotal = await prisma.vista_becas_otorgadas.count();
    const becas50 = await prisma.vista_becas_otorgadas.count({
      where: {
        PORCENTAJE: 50,
      },
    });
    const becas25 = await prisma.vista_becas_otorgadas.count({
      where: {
        PORCENTAJE: 25,
      },
    });
    const becasOtras = await prisma.vista_becas_otorgadas.count({
      where: {
        PORCENTAJE: {
          notIn: [50, 25],
        },
      },
    });
    const becas = {
      total: becasTotal,
      becas50: becas50,
      becas25: becas25,
      becasOtras: becasOtras,
    };

    return becas;
  } catch (error) {
    throw new Error("Error al obtener becas");
  }
}

async function getBecasPeriodos() {
  try {
    const becasPorPeriodo = await prisma.$queryRaw`
      SELECT vg.ID_PERIODO, count(bo.ID_BECA) as total_becas
      FROM istla_becas_otorgadas bo
      INNER JOIN istla_solicitudes_beca sb ON bo.ID_SOLICITUD = sb.ID_SOLICITUD
      INNER JOIN istla_vigencia_beca vg ON sb.ID_VIGENCIA = vg.ID_VIGENCIA
      GROUP BY vg.ID_PERIODO
    `;

    const periodosAPI = await getPeriodos();

    const periodosMap = new Map(
      periodosAPI.map((periodo) => [periodo.ID_PERIODO, periodo.NOMBRE_PERIODO])
    );

    const periodos = becasPorPeriodo.map((beca) => ({
      periodo:
        periodosMap.get(String(beca.ID_PERIODO)) ||
        `Periodo ${beca.ID_PERIODO}`,
      total_becas: Number(beca.total_becas),
    }));

    return periodos;
  } catch (error) {
    throw new Error("Error al obtener becas con periodos");
  }
}

async function getBecasTipo() {
  try {
    const becas = await prisma.vista_becas_por_tipo.findMany();
    const becasProcesadas = becas.map((beca) => ({
      ...beca,
      Becas: Number(beca.Becas),
    }));
    return becasProcesadas;
  } catch (error) {
    throw new Error("Error al obtener becas por tipos");
  }
}

async function obtenerBecasPorCarrera() {
  try {
    const estudiantesConBecas = await prisma.vista_becas_otorgadas.findMany({
      select: {
        CEDULA_ESTUDIANTE: true,
      },
      distinct: ["CEDULA_ESTUDIANTE"],
    });

    const cedulas = estudiantesConBecas.map((e) => e.CEDULA_ESTUDIANTE);

    const estudiantesAPI = await getEstudiantes({
      where: {
        DOCUMENTO_ESTUDIANTES: {
          in: cedulas,
        },
      },
    });

    const cedulaToId = Object.fromEntries(
      estudiantesAPI.map((estudiante) => [
        estudiante.DOCUMENTO_ESTUDIANTES,
        estudiante.ID_ESTUDIANTES,
      ])
    );

    const promesasCarreras = estudiantesConBecas
      .filter((estudiante) => cedulaToId[estudiante.CEDULA_ESTUDIANTE])
      .map(async (estudiante) => {
        const idEstudiante = cedulaToId[estudiante.CEDULA_ESTUDIANTE];
        try {
          const matricula = await getCarreraEstudiante(idEstudiante);
          if (matricula?.length > 0) {
            const ultimaMatricula = matricula[matricula.length - 1];
            return {
              carrera: ultimaMatricula.NOMBRE_CARRERAS,
              idCarrera: ultimaMatricula.ID_CARRERA,
            };
          }
        } catch (error) {
          console.error(
            `Error al obtener carrera para estudiante ${idEstudiante}:`,
            error
          );
        }
        return null;
      });

    const resultadosCarreras = (await Promise.all(promesasCarreras)).filter(
      Boolean
    );

    const conteoCarreras = resultadosCarreras.reduce((acc, curr) => {
      acc[curr.carrera] = (acc[curr.carrera] || 0) + 1;
      return acc;
    }, {});

    const resultado = Object.entries(conteoCarreras)
      .map(([carrera, cantidadBecas]) => ({
        carrera,
        cantidadBecas,
      }))
      .sort((a, b) => b.cantidadBecas - a.cantidadBecas);

    return resultado;
  } catch (error) {
    throw error;
  }
}

async function postRenovacion(documento, cedula) {
  try {
    const rutaDocumentosEstudiante =
      await prisma.istla_solicitudes_beca.findFirst({
        where: {
          CEDULA_ESTUDIANTE: cedula,
          ID_ESTADO: { not: 6 },
        },
        select: {
          ID_SOLICITUD: true,
          CEDULA_ESTUDIANTE: true,
          istla_documentos_obligatorios: {
            select: {
              ID_DOCUMENTOS: true,
              CERTIFICADO_MATRICULA: true,
            },
          },
        },
      });

    const rutaBase =
      rutaDocumentosEstudiante.istla_documentos_obligatorios[0]
        .CERTIFICADO_MATRICULA;
    const rutaPartes = rutaBase.split("\\");
    const carpetaEstudiante = rutaPartes.slice(0, 3).join("\\");

    const extension = path.extname(documento.name);
    const nombreArchivo = `renovacionBeca${extension}`;
    const rutaCompleta = path.join(carpetaEstudiante, nombreArchivo);

    await documento.mv(rutaCompleta);

    const beca = await prisma.istla_becas_otorgadas.findFirst({
      where: {
        ID_SOLICITUD: rutaDocumentosEstudiante.ID_SOLICITUD,
      },
    });

    await prisma.istla_becas_otorgadas.update({
      where: {
        ID_BECA: beca.ID_BECA,
      },
      data: {
        RENOVACION: rutaCompleta,
      },
    });

    return rutaCompleta;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  postBecas,
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
};
