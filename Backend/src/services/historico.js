require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getPeriodos } = require("./api_istla");

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://tesis.apps-sebas.org"
    : "http://localhost:3000";

const historicoService = {
  async getHistorico(cedula) {
    try {
      const historico = await prisma.vista_historico.findMany({
        where: {
          CEDULA_ESTUDIANTE: cedula,
        },
        orderBy: {
          PERIODO_SOLICITUD: "desc",
        },
      });
      
      if (historico.length === 0) {
        return false;
      }
      const historicoFormateado = historico.map((item, index) => ({
        ...item,
        id_historico: index + 1,
        SOLICITUD: `${BASE_URL}/api/historico/getSolicitudHistorico/${item.CEDULA_ESTUDIANTE}/${item.PERIODO_SOLICITUD}`,
        RENOVACION: item.RENOVACION
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.RENOVACION
            )}`
          : null,
        CERTIFICADO_MATRICULA: item.CERTIFICADO_MATRICULA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_MATRICULA
            )}`
          : null,
        COPIA_CEDULA: item.COPIA_CEDULA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.COPIA_CEDULA
            )}`
          : null,
        CERTIFICADO_PAGOS: item.CERTIFICADO_PAGOS
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_PAGOS
            )}`
          : null,
        CERTIFICADO_ASISTENCIA: item.CERTIFICADO_ASISTENCIA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_ASISTENCIA
            )}`
          : null,
        CERTIFICADO_DISCIPLINA: item.CERTIFICADO_DISCIPLINA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_DISCIPLINA
            )}`
          : null,
        CERTIFICADO_APROBACION_SEMESTRE: item.CERTIFICADO_APROBACION_SEMESTRE
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_APROBACION_SEMESTRE
            )}`
          : null,
        CERTIFICADO_NOTA: item.CERTIFICADO_NOTA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_NOTA
            )}`
          : null,
        TRAYECTORIA_DEPORTIVA: item.TRAYECTORIA_DEPORTIVA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.TRAYECTORIA_DEPORTIVA
            )}`
          : null,
        INFORME_FEDERACIONDEPORTIVA: item.INFORME_FEDERACIONDEPORTIVA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.INFORME_FEDERACIONDEPORTIVA
            )}`
          : null,
        RECONOCIMIENTO_HEROE: item.RECONOCIMIENTO_HEROE
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.RECONOCIMIENTO_HEROE
            )}`
          : null,
        INFORME_ACTIVIDADES_CLUB: item.INFORME_ACTIVIDADES_CLUB
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.INFORME_ACTIVIDADES_CLUB
            )}`
          : null,
        INFORME_BIENESTAR_CLUB: item.INFORME_BIENESTAR_CLUB
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.INFORME_BIENESTAR_CLUB
            )}`
          : null,
        CARNE_MSP: item.CARNE_MSP
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CARNE_MSP
            )}`
          : null,
        FICHA_SOCIOECONOMICA: item.FICHA_SOCIOECONOMICA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.FICHA_SOCIOECONOMICA
            )}`
          : null,
        MECANIZADO_IESS: item.MECANIZADO_IESS
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.MECANIZADO_IESS
            )}`
          : null,
        CERTIFICADO_IESS: item.CERTIFICADO_IESS
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_IESS
            )}`
          : null,
        DECLARACION_IMPUESTOS: item.DECLARACION_IMPUESTOS
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.DECLARACION_IMPUESTOS
            )}`
          : null,
        PARTIDA_DEFUNCION: item.PARTIDA_DEFUNCION
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.PARTIDA_DEFUNCION
            )}`
          : null,
        DECLARATORIA_ZONA_EMERGENCIA: item.DECLARATORIA_ZONA_EMERGENCIA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.DECLARATORIA_ZONA_EMERGENCIA
            )}`
          : null,
        CERTIFICADO_MEDICO_DEPENDENCIA: item.CERTIFICADO_MEDICO_DEPENDENCIA
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_MEDICO_DEPENDENCIA
            )}`
          : null,
        INFORME_POLICIAL: item.INFORME_POLICIAL
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.INFORME_POLICIAL
            )}`
          : null,
        CERTIFICADO_MEDICO_PERSONAL: item.CERTIFICADO_MEDICO_PERSONAL
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.CERTIFICADO_MEDICO_PERSONAL
            )}`
          : null,
        OTRO_DOCUMENTO: item.OTRO_DOCUMENTO
          ? `${BASE_URL}/api/historico/getDocumentos/${encodeURIComponent(
              item.OTRO_DOCUMENTO
            )}`
          : null,
      }));

      const periodos = await getPeriodos();
      const historicoFormateadoPeriodo = historicoFormateado.map((item) => {
        const periodoSolicitud = periodos.find(
          (periodo) => periodo.ID_PERIODO === item.PERIODO_SOLICITUD.toString()
        );
      
        const periodoCaducidad = item.PERIODO_CADUCIDAD 
          ? periodos.find(
              (periodo) => periodo.ID_PERIODO === item.PERIODO_CADUCIDAD
            )
          : null;
      
        return {
          ...item,
          PERIODO_SOLICITUD: periodoSolicitud ? periodoSolicitud.NOMBRE_PERIODO : 'No disponible',
          PERIODO_CADUCIDAD: periodoCaducidad ? periodoCaducidad.NOMBRE_PERIODO : null
        };
      });
      return historicoFormateadoPeriodo;
    } catch (error) {
      throw new Error("Error al obtener histórico");
    }
  },

  async getSolicitudPDF(cedula, periodo) {
    try {
      const historico = await prisma.vista_historico.findFirst({
        where: {
          CEDULA_ESTUDIANTE: cedula,
          PERIODO_SOLICITUD: parseInt(periodo),
        },
        select: {
          SOLICITUD: true,
        },
      });

      if (!historico) {
        throw new Error("No se encontró el documento");
      }

      return historico.SOLICITUD;
    } catch (error) {
      throw new Error("Error al obtener el PDF de la solicitud");
    }
  },

};

module.exports = { historicoService };
