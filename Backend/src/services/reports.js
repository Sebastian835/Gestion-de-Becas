const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  getPeriodos,
  getEstudiantes,
  getCarreraEstudiante,
  getUsuarios,
} = require("./api_istla");
const {
  getBecasPeriodos,
  getBecasTipo,
  obtenerBecasPorCarrera,
} = require("./becas_Otorgadas");

const { handleReport, handleReportPreliminar } = require("../reports/index");

async function obtenerReporte(filtros) {
  try {
    const { idPeriodo, idPeriodoFinal, todos, estado } = filtros;

    let dataNo = false;
    if (filtros.data === false) {
      dataNo = true;
    }

    let periodoConteo = null;
    let tipoBecaConteo = null;
    let carreraConteo = null;
    if (filtros.conteo) {
      if (filtros.conteo.includes("periodos")) {
        periodoConteo = await getBecasPeriodos();
      }

      if (filtros.conteo.includes("tipoBeca")) {
        tipoBecaConteo = await getBecasTipo();
      }

      if (filtros.conteo.includes("carrera")) {
        carreraConteo = await obtenerBecasPorCarrera();
      }
    }
    if (dataNo) {
      const pdfPath = await handleReport(
        false,
        periodoConteo,
        tipoBecaConteo,
        carreraConteo,
        filtros.graficosGenerales || false,
        false
      );
      return pdfPath;
    }
    const periodos = await getPeriodos();

    let where = {};

    if (!todos) {
      if (idPeriodo && !idPeriodoFinal) {
        where.ID_PERIODO = parseInt(idPeriodo);
      } else if (idPeriodo && idPeriodoFinal) {
        where.ID_PERIODO = {
          gte: Math.min(parseInt(idPeriodo), parseInt(idPeriodoFinal)),
          lte: Math.max(parseInt(idPeriodo), parseInt(idPeriodoFinal)),
        };
      }
    }

    if (estado && estado.length > 0) {
      where.ESTADO_BECA = {
        in: Array.isArray(estado) ? estado : [estado],
      };
    }
    const becas = await prisma.vista_reporte.findMany({
      where,
      select: {
        CEDULA_ESTUDIANTE: true,
        TIPO_BECA: true,
        PORCENTAJE: true,
        ID_PERIODO: true,
        ESTADO: true,
        NOMBRE: filtros.nombres ? true : false,
      },
      orderBy: filtros.nombres
        ? { NOMBRE: "asc" }
        : { CEDULA_ESTUDIANTE: "asc" },
    });

    const becasConPeriodo = becas.map((beca) => {
      const periodInfo = periodos.find(
        (p) => p.ID_PERIODO === String(beca.ID_PERIODO)
      );
      return {
        CEDULA_ESTUDIANTE: beca.CEDULA_ESTUDIANTE,
        TIPO_BECA: beca.TIPO_BECA,
        PORCENTAJE: beca.PORCENTAJE,
        PERIODO: periodInfo.NOMBRE_PERIODO,
        ESTADO: beca.ESTADO,
        NOMBRE: beca.NOMBRE,
      };
    });

    if (becasConPeriodo.length === 0) {
      return false;
    }
    const report = await obtenerReporteCarreras(becasConPeriodo, filtros);

    const conteoTotal = report.length;

    const pdfPath = await handleReport(
      report,
      periodoConteo,
      tipoBecaConteo,
      carreraConteo,
      filtros.graficosGenerales || false,
      conteoTotal
    );

    const data = {
      report,
      pdfPath,
    };

    return data;
  } catch (error) {
    throw new error();
  }
}

async function obtenerPreliminar() {
  try {
    const becasPreliminares = await prisma.view_becas_preliminar.findMany({
      orderBy: { NOMBRE_ESTUDIANTE: "asc" },
    });
    const pdfPath = await handleReportPreliminar(becasPreliminares);
    return pdfPath;
  } catch (error) {
    throw new error();
  }
}

async function obtenerReporteCarreras(data, filtros) {
  try {
    const estudiantesAPI = await getEstudiantes();
    const cedulaToId = {};
    estudiantesAPI.forEach((estudiante) => {
      cedulaToId[estudiante.DOCUMENTO_ESTUDIANTES] = estudiante.ID_ESTUDIANTES;
    });

    if (!filtros.carreras) {
      const promesasCarreras = data.map(async (estudiante) => {
        const idEstudiante = cedulaToId[estudiante.CEDULA_ESTUDIANTE];
        if (idEstudiante) {
          try {
            const matricula = await getCarreraEstudiante(idEstudiante);
            if (matricula && matricula.length > 0) {
              const ultimaMatricula = matricula[matricula.length - 1];
              return {
                ...estudiante,
                CARRERA: ultimaMatricula.NOMBRE_CARRERAS,
              };
            }
          } catch (error) {
            return estudiante;
          }
        }
        return estudiante;
      });

      const estudiantesConCarrera = await Promise.all(promesasCarreras);
      const estudiantesOrdenados = estudiantesConCarrera.sort((a, b) => {
        if (filtros.nombres) {
          return a.NOMBRE.localeCompare(b.NOMBRE);
        } else {
          return a.CEDULA_ESTUDIANTE.localeCompare(b.CEDULA_ESTUDIANTE);
        }
      });

      return obtenerReporteTipoBeca(estudiantesOrdenados, filtros);
    } else {
      const promesasCarreras = data.map(async (estudiante) => {
        const idEstudiante = cedulaToId[estudiante.CEDULA_ESTUDIANTE];
        if (idEstudiante) {
          try {
            const matricula = await getCarreraEstudiante(idEstudiante);
            if (matricula && matricula.length > 0) {
              const ultimaMatricula = matricula[matricula.length - 1];
              if (filtros.carreras.includes(ultimaMatricula.ID_CARRERA)) {
                return {
                  ...estudiante,
                  CARRERA: ultimaMatricula.NOMBRE_CARRERAS,
                };
              }
              return null;
            }
          } catch (error) {
            return null;
          }
        }
        return null;
      });

      const estudiantesConCarrera = (
        await Promise.all(promesasCarreras)
      ).filter((estudiante) => estudiante !== null);

      const estudiantesOrdenados = estudiantesConCarrera.sort((a, b) => {
        if (filtros.nombres) {
          return a.NOMBRE.localeCompare(b.NOMBRE);
        } else {
          return a.CEDULA_ESTUDIANTE.localeCompare(b.CEDULA_ESTUDIANTE);
        }
      });

      return obtenerReporteTipoBeca(estudiantesOrdenados, filtros);
    }
  } catch (error) {
    throw new error();
  }
}

async function obtenerReporteTipoBeca(data, filtros) {
  try {
    let resultado;
    if (!filtros.tiposBecas) {
      resultado = data;
    } else {
      resultado = data.filter((estudiante) =>
        filtros.tiposBecas.includes(estudiante.TIPO_BECA)
      );
    }

    return resultado.sort((a, b) => {
      if (filtros.nombres) {
        return a.NOMBRE.localeCompare(b.NOMBRE);
      } else {
        return a.CEDULA_ESTUDIANTE.localeCompare(b.CEDULA_ESTUDIANTE);
      }
    });
  } catch (error) {
    throw new error();
  }
}

module.exports = {
  obtenerReporte,
  obtenerPreliminar,
};
