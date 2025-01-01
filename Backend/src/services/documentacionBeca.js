const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const { getPeriodos } = require("./api_istla");

const eliminarCarpetaEstudiante = async (rutaCarpeta) => {
  try {
    const carpetaCompleta = path.join(
      "Documentos_Becas",
      "OCTUBRE2024MARZO2025",
      rutaCarpeta
    );
    await fs.promises.rm(carpetaCompleta, {
      recursive: true,
      force: true,
    });
    return true;
  } catch (error) {
    console.error("Error al eliminar la carpeta:", error);
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

    if (solicitud.istla_documentos_obligatorios.length > 0) {
      const documentoPendiente = solicitud.istla_documentos_obligatorios[0];
      return res.json({
        id_documento_pendiente: documentoPendiente.ID_DOCUMENTOS,
        tipo_beca: solicitud.istla_tipo_beca.TIPO_BECA,
      });
    } else {
      return res.json({ existeDocumentacion: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Error: " + error.message });
  }
}

async function postDocumentos(req, res) {
  try {
    const { id_documento_pendiente, usuario } = req.body;
    const usuarioFormat = usuario.replace(/\s+/g, "");

    const documento = await prisma.istla_documentos_obligatorios.findFirst({
      where: {
        ID_DOCUMENTOS: parseInt(id_documento_pendiente, 10),
      },
      include: {
        istla_solicitudes_beca: {
          select: {
            CEDULA_ESTUDIANTE: true,
            istla_vigencia_beca: { 
              select: {
                ID_PERIODO: true,
              },
            },
          },
        },
      },
    });
    
  
    const periodos = await getPeriodos();
    const uploadDir = "./Documentos_Becas";
    const idPeriodo = documento.istla_solicitudes_beca.istla_vigencia_beca.ID_PERIODO;
    const periodoEncontrado = periodos.find((p) => p.ID_PERIODO === String(idPeriodo));
    const periodoFormat = periodoEncontrado.NOMBRE_PERIODO.replace(/\s+/g, "");

    const periodoDir = path.join(uploadDir, periodoFormat);
    if (!fs.existsSync(periodoDir)) {
      fs.mkdirSync(periodoDir, { recursive: true });
    }

    const usuarioDir = path.join(periodoDir, usuarioFormat);
    if (!fs.existsSync(usuarioDir)) {
      fs.mkdirSync(usuarioDir, { recursive: true });
    }

    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return;
      }
      const pdfFiles = files.filter((file) => file.endsWith(".pdf"));
      pdfFiles.forEach((file) => {
        const oldPath = path.join(uploadDir, file);
        const newPath = path.join(usuarioDir, file);

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            return;
          }
        });
      });
    });

    Object.keys(req.files).forEach((fieldname) => {
      req.files[fieldname].forEach((file) => {
        file.destination = usuarioDir;
        file.path = path.join(usuarioDir, file.filename);
      });
    });

    Object.keys(req.files).forEach(async (fieldname) => {
      const file = req.files[fieldname][0];

      if (
        fieldname === "CERTIFICADO_MATRICULA" ||
        fieldname === "COPIA_CEDULA" ||
        fieldname === "CERTIFICADO_ASISTENCIA" ||
        fieldname === "CERTIFICADO_PAGOS" ||
        fieldname === "CERTIFICADO_DISCIPLINA"
      ) {
        await prisma.istla_documentos_obligatorios.update({
          where: {
            ID_DOCUMENTOS: parseInt(id_documento_pendiente, 10),
          },
          data: {
            [fieldname]: file.path,
            ID_ESTADO: 4,
            FECHA: new Date(),
          },
        });
      }

      if (
        fieldname === "CERTIFICADO_APROBACION_SEMESTRE" ||
        fieldname === "CERTIFICADO_NOTA" ||
        fieldname === "TRAYECTORIA_DEPORTIVA" ||
        fieldname === "INFORME_FEDERACIONDEPORTIVA" ||
        fieldname === "RECONOCIMIENTO_HEROE" ||
        fieldname === "INFORME_ACTIVIDADES_CLUB" ||
        fieldname === "INFORME_BIENESTAR_CLUB" ||
        fieldname === "CARNE_MSP" ||
        fieldname === "FICHA_SOCIOECONOMICA" ||
        fieldname === "MECANIZADO_IESS" ||
        fieldname === "CERTIFICADO_IESS" ||
        fieldname === "DECLARACION_IMPUESTOS" ||
        fieldname === "DECLARATORIA_ZONA_EMERGENCIA" ||
        fieldname === "PARTIDA_DEFUNCION" ||
        fieldname === "CERTIFICADO_MEDICO_DEPENDENCIA" ||
        fieldname === "INFORME_POLICIAL" ||
        fieldname === "CERTIFICADO_MEDICO_PERSONAL" ||
        fieldname === "OTRO_DOCUMENTO"
      ) {
        const detalleExistente =
          await prisma.istla_documentos_detalle.findFirst({
            where: {
              ID_DOCUMENTOS_OBLIGATORIOS: parseInt(id_documento_pendiente, 10),
            },
          });

        if (detalleExistente) {
          await prisma.istla_documentos_detalle.update({
            where: {
              ID_DETALLE: detalleExistente.ID_DETALLE,
            },
            data: {
              [fieldname]: file.path,
            },
          });
        }
      }
    });

    res.status(200).json({ message: "Documentos procesados correctamente." });
  } catch (error) {
    console.error("Error al procesar los documentos:", error);
    res.status(500).json({ error: "Error al procesar los documentos." });
  }
}

async function getDocumentos() {
  try {
    const documentos = await prisma.istla_documentos_obligatorios.findMany({
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
            istla_tipo_beca: {
              select: {
                TIPO_BECA: true,
              },
            },
          },
        },
      },
    });
    return documentos;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message);
  }
}

async function putAprobarDocumentacion(id) {
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

    const carpetaEstudiante = document.CERTIFICADO_MATRICULA.split("\\")[2];
    await eliminarCarpetaEstudiante(carpetaEstudiante);

    return {
      status: 200,
      message: "Documentación aprobada para reevnio",
    };
  } catch (error) {
    return {
      status: 500,
      error: "Error al aprobar reenvio de solicitud: " + error.message,
    };
  }
}

async function deleteDocumentacion(id) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const document = await prisma.istla_documentos_obligatorios.findUnique({
        where: {
          ID_DOCUMENTOS: parseInt(id, 10),
        },
        include: {
          istla_documentos_detalle: true,
        },
      });

      const carpetaEstudiante = document.CERTIFICADO_MATRICULA.split("\\")[2];
      await eliminarCarpetaEstudiante(carpetaEstudiante);

      await prisma.istla_documentos_detalle.delete({
        where: {
          ID_DETALLE: document.istla_documentos_detalle[0].ID_DETALLE,
        },
      });

      await prisma.istla_documentos_obligatorios.delete({
        where: {
          ID_DOCUMENTOS: parseInt(id, 10),
        },
      });

      await prisma.istla_solicitudes_beca.delete({
        where: {
          ID_SOLICITUD: parseInt(document.ID_SOLICITUD, 10),
        },
      });

      return {
        status: 200,
        message: "Documentación eliminada",
      };
    });

    return result;
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error.message);
    return {
      status: 500,
      error: "Error al eliminar la solicitud: " + error.message,
    };
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
