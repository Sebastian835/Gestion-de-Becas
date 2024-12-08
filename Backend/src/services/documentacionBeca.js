const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const { getPeriodos } = require("./api_istla");

async function getEstadoDocumentos(req, res) {
  const { cedula } = req.query;

  try {
    const solicitud = await prisma.istla_solicitudes_beca.findFirst({
      where: {
        CEDULA_ESTUDIANTE: cedula,
        ESTADO: 2,
      },
      include: {
        istla_documentos_obligatorios: {
          where: {
            ESTADO: 1,
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
            ID_PERIODO: true,
            CEDULA_ESTUDIANTE: true,
          },
        },
      },
    });

    const periodos = await getPeriodos();
    const uploadDir = "./Documentos_Becas";
    const idPeriodo = documento.istla_solicitudes_beca.ID_PERIODO;
    const periodoEncontrado = periodos.find((p) => p.ID_PERIODO === idPeriodo);
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

module.exports = postDocumentos;

module.exports = { getEstadoDocumentos, postDocumentos };
