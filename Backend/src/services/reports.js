const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  getPeriodos,
  getEstudiantes,
  getCarreraEstudiante,
  getUsuarios,
} = require("./api_istla");

async function obtenerReporte(filtros) {
  try {
    const { idPeriodo, idPeriodoFinal, todos } = filtros;
    const periodos = await getPeriodos();
    let estado = "";

    if (filtros.estado === "Activas") {
      estado = "Activa";
    } else if (filtros.estado === "Inactivas") {
      estado = "Inactiva";
    }
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
    const becas = await prisma.vista_becas_otorgadas.findMany({
      where:
        estado !== ""
          ? {
              ESTADO_BECA: estado,
              ...where,
            }
          : where,
      select: {
        CEDULA_ESTUDIANTE: true,
        TIPO_BECA: true,
        PORCENTAJE: true,
        ID_PERIODO: true,
        ESTADO_BECA: true,
      },
      orderBy: {
        ID_PERIODO: "asc",
      },
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
        ESTADO: beca.ESTADO_BECA,
      };
    });

    return obtenerReporteCarreras(becasConPeriodo, filtros);
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
      return obtenerReporteTipoBeca(estudiantesConCarrera, filtros);
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
      return obtenerReporteTipoBeca(estudiantesConCarrera, filtros);
    }
  } catch (error) {
    throw new error();
  }
}

async function obtenerReporteTipoBeca(data, filtros) {
  try {
    if (!filtros.tiposBecas) {
      return obtenerReporteNombres(data, filtros);
    } else {
      const estudiantesConTipoBeca = data.filter((estudiante) =>
        filtros.tiposBecas.includes(estudiante.TIPO_BECA)
      );
      return obtenerReporteNombres(estudiantesConTipoBeca, filtros);
    }
  } catch (error) {
    throw new error();
  }
}

async function obtenerReporteNombres(data, filtros) {
  try {
    if (!filtros.nombres) {
      return data;
    } else {
      const usuariosAPI = await getUsuarios();

      const capitalizarPalabras = (texto) => {
        return texto
          .toLowerCase()
          .split(" ")
          .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(" ");
      };

      const dataNombres = data.map((beca) => {
        const usuario = usuariosAPI.find(
          (user) => user.DOCUMENTO_USUARIOS === beca.CEDULA_ESTUDIANTE
        );

        return {
          ...beca,
          NOMBRE: usuario
            ? capitalizarPalabras(
                `${usuario.NOMBRES_USUARIOS.trim()} ${usuario.APELLIDOS_USUARIOS.trim()}`
              )
            : "Usuario no encontrado",
        };
      });

      return dataNombres;
    }
  } catch (error) {
    throw new error();
  }
}

module.exports = {
  obtenerReporte,
};
