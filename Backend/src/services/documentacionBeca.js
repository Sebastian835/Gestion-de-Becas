const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const { getPeriodos } = require("./api_istla");
const { postBecas } = require("./becas_Otorgadas");

const eliminarCarpetaEstudiante = async (rutaCarpeta) => {
  try {
    const carpetaCompleta = path.join("Documentos_Becas", rutaCarpeta);
    await fs.promises.rm(carpetaCompleta, {
      recursive: true,
      force: true,
    });
    return true;
  } catch (error) {
    return false;
  }
 };

async function getEstadoDocumentos(req, res) {
  const { cedula } = req.query;

  try {
    const solicitud = await prisma.istla_solicitudes_beca.findFirst({
      where: {
        CEDULA_ESTUDIANTE: cedula,
        ID_ESTADO: 2,
      },
      include: {
        istla_documentos_obligatorios: {
          where: {
            ID_ESTADO: 1,
          },
        },
        istla_tipo_beca: true,
      },
    });

    if (!solicitud) {
      return res.json({ existeSolicitud: false });
    }
    const vigencia = await prisma.istla_vigencia_beca.findFirst({
      where: {
        ID_VIGENCIA: solicitud.ID_VIGENCIA,
      },
    });

    const periodos = await getPeriodos();

    const nombrePeriodo = periodos.find(
      (periodo) => parseInt(periodo.ID_PERIODO) === vigencia.ID_PERIODO
    );

    if (solicitud.istla_documentos_obligatorios.length > 0) {
      const documentoPendiente = solicitud.istla_documentos_obligatorios[0];
      return res.json({
        id_documento_pendiente: documentoPendiente.ID_DOCUMENTOS,
        tipo_beca: solicitud.istla_tipo_beca.TIPO_BECA,
        perido_beca: nombrePeriodo.NOMBRE_PERIODO,
      });
    } else {
      return res.json({ existeDocumentacion: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Error: " + error.message });
  }
}

async function getDocumentos() {
  try {
    const documentos = await prisma.istla_documentos_obligatorios.findMany({
      where: {
        istla_estado_solicitud: {
          ESTADO: {
            not: "Finalizado",
          },
        },
      },
      include: {
        istla_documentos_detalle: true,
        istla_estado_solicitud: {
          select: {
            ESTADO: true,
          },
        },
        istla_solicitudes_beca: {
          select: {
            CEDULA_ESTUDIANTE: true,
            ID_VIGENCIA: true,
            istla_tipo_beca: {
              select: {
                TIPO_BECA: true,
              },
            },
            istla_vigencia_beca: {
              select: {
                ID_PERIODO: true,
              },
            },
          },
        },
      },
    });
    
    if (documentos.length === 0) {
      return false;
    }

    return documentos;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message);
  }
}

async function putAprobarDocumentacion(id, porcentaje) {
  try {
    const estado = await prisma.istla_estado_solicitud.findFirst({
      where: {
        ESTADO: "Aprobada",
      },
    });

    const document = await prisma.istla_documentos_obligatorios.update({
      where: {
        ID_DOCUMENTOS: parseInt(id, 10),
      },
      data: {
        ID_ESTADO: estado.ID_ESTADO,
      },
    });

    await postBecas(id, porcentaje);

    return {
      status: 200,
      message: "Documentación aprobada",
    };
  } catch (error) {
    return {
      status: 500,
      error: "Error al aprobar la solicitud: " + error.message,
    };
  }
}

async function putReenviarDocumentacion(id, motivo) {
  try {
    const estado = await prisma.istla_estado_solicitud.findFirst({
      where: {
        ESTADO: "Pendiente",
      },
    });

    const document = await prisma.istla_documentos_obligatorios.update({
      where: {
        ID_DOCUMENTOS: parseInt(id, 10),
      },
      data: {
        ID_ESTADO: estado.ID_ESTADO,
      },
    });

    if (document.CERTIFICADO_MATRICULA) {
      const periodo = document.CERTIFICADO_MATRICULA.split("\\")[1];
      const carpetaEstudiante = document.CERTIFICADO_MATRICULA.split("\\")[2];
      await eliminarCarpetaEstudiante(periodo + "\\" + carpetaEstudiante);

      return {
        status: 200,
        message: "Documentación aprobada para reevnio",
      };
    } else {
      return {
        status: 200,
        message: "Documentación aprobada para reevnio",
      };
    }
  } catch (error) {
    return {
      status: 500,
      error: "Error al aprobar reenvio de solicitud: " + error.message,
    };
  }
}

async function deleteDocumentacion(id, motivo) {
  try {
    const estado = await prisma.istla_estado_solicitud.findFirst({
      where: {
        ESTADO: "Rechazada",
      },
    });

    const result = await prisma.$transaction(async (prisma) => {
      const document = await prisma.istla_documentos_obligatorios.update({
        where: {
          ID_DOCUMENTOS: parseInt(id, 10),
        },
        data: {
          ID_ESTADO: estado.ID_ESTADO,
          MOTIVO_RECHAZO: motivo,
        },
      });

      await prisma.istla_solicitudes_beca.update({
        where: {
          ID_SOLICITUD: parseInt(document.ID_SOLICITUD, 10),
        },
        data: {
          ID_ESTADO: estado.ID_ESTADO,
        },
      });

      return {
        status: 200,
        message: "Solicitud rechazada",
      };
    });

    return result;
  } catch (error) {
    return {
      status: 500,
      error: "Error al eliminar la solicitud: " + error.message,
    };
  }
}

async function postDocumentos(req, res) {
  try {
    const { id_documento_pendiente } = req.body;

    // Obtener documento con relaciones
    const documento = await prisma.istla_documentos_obligatorios.findFirst({
      where: { ID_DOCUMENTOS: parseInt(id_documento_pendiente, 10) },
      include: {
        istla_solicitudes_beca: {
          select: { CEDULA_ESTUDIANTE: true },
        },
      },
    });

    // Actualizar documentos obligatorios
    for (const [fieldname, files] of Object.entries(req.files)) {
      const filePath = files[0].path;

      if (isDocumentoObligatorio(fieldname)) {
        await updateDocumentoObligatorio(
          id_documento_pendiente,
          fieldname,
          filePath
        );
        continue;
      }

      if (isDocumentoDetalle(fieldname)) {
        await updateDocumentoDetalle(
          id_documento_pendiente,
          fieldname,
          filePath
        );
      }
    }

    res.status(200).json({ message: "Documentos procesados correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar los documentos." });
  }
}

const isDocumentoObligatorio = (fieldname) => {
  return [
    "CERTIFICADO_MATRICULA",
    "COPIA_CEDULA",
    "CERTIFICADO_ASISTENCIA",
    "CERTIFICADO_PAGOS",
    "CERTIFICADO_DISCIPLINA",
  ].includes(fieldname);
};

const isDocumentoDetalle = (fieldname) => {
  return [
    "FICHA_SOCIOECONOMICA",
    "MECANIZADO_IESS",
    "CERTIFICADO_IESS",
    "DECLARACION_IMPUESTOS",
    "DECLARATORIA_ZONA_EMERGENCIA",
    "PARTIDA_DEFUNCION",
    "CERTIFICADO_MEDICO_DEPENDENCIA",
    "INFORME_POLICIAL",
    "CERTIFICADO_MEDICO_PERSONAL",
    "OTRO_DOCUMENTO",
    "CERTIFICADO_APROBACION_SEMESTRE",
    "CERTIFICADO_NOTA",
    "TRAYECTORIA_DEPORTIVA",
    "INFORME_FEDERACIONDEPORTIVA",
    "RECONOCIMIENTO_HEROE",
    "INFORME_ACTIVIDADES_CLUB",
    "INFORME_BIENESTAR_CLUB",
    "CARNE_MSP",
  ].includes(fieldname);
};

async function updateDocumentoObligatorio(id, fieldname, filePath) {
  return prisma.istla_documentos_obligatorios.update({
    where: { ID_DOCUMENTOS: parseInt(id, 10) },
    data: {
      [fieldname]: filePath,
      ID_ESTADO: 4,
      FECHA: new Date(),
    },
  });
}

async function updateDocumentoDetalle(id, fieldname, filePath) {
  const detalle = await prisma.istla_documentos_detalle.findFirst({
    where: { ID_DOCUMENTOS_OBLIGATORIOS: parseInt(id, 10) },
  });

  if (detalle) {
    await prisma.istla_documentos_detalle.update({
      where: { ID_DETALLE: detalle.ID_DETALLE },
      data: { [fieldname]: filePath },
    });
  }
}

module.exports = {
  getEstadoDocumentos,
  postDocumentos,
  getDocumentos,
  putAprobarDocumentacion,
  putReenviarDocumentacion,
  deleteDocumentacion,
};
