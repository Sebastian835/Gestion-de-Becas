const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getUsuarios = require("./api_istla");
const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

async function postSolicitudBeca(req, res) {
  try {
    const data = req.body;

    let fecha = data["fecha"];
    let fechaFormateada = dayjs(fecha).format("YYYY-MM-DD");

    const documentoBase64 = data["documento"];
    const base64Data = documentoBase64.replace(
      /^data:application\/pdf;base64,/,
      ""
    );
    const documentoBuffer = Buffer.from(base64Data, "base64");

    await prisma.istla_solicitudes_beca.create({
      data: {
        CEDULA_ESTUDIANTE: data["cedula_estudiante"],
        ID_TIPO_BECA: data["becaSeleccionada"], 
        ID_VIGENCIA: data["periodoBeca"],
        FECHA: new Date(fechaFormateada),
        ID_ESTADO: 1,
        DOCUMENTO_SOLICITUD: documentoBuffer,
      },
    });

    res.status(200).json();
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
}

async function getSolicitudes(req, res) {
  try {
    const solicitudes = await prisma.vista_solicitud_beca_detalle.findMany();
    const usuarios = await getUsuarios.getUsuarios();

    const usuariosMap = new Map();
    usuarios.forEach((usuario) => {
      usuariosMap.set(usuario.DOCUMENTO_USUARIOS, usuario);
    });

    const solicitudesDetalles = solicitudes.map((solicitud) => {
      const usuario = usuariosMap.get(solicitud.CEDULA_ESTUDIANTE);
      if (usuario) {
        return {
          ...solicitud,
          NOMBRES_USUARIOS:
            usuario.NOMBRES_USUARIOS + " " + usuario.APELLIDOS_USUARIOS,
          CORREO_USUARIOS: usuario.CORREO_USUARIOS,
        };
      }
    });

    res.json(solicitudesDetalles);
  } catch (error) {
    res.status(500).json({ error: "Error: " + error.message });
  }
}

async function getSolicitudId(req, res) {
  const { cedula } = req.query;
  try {
    const solicitud = await prisma.istla_solicitudes_beca.findFirst({
      where: {
        CEDULA_ESTUDIANTE: cedula,
        ID_ESTADO: {
          in: [1, 2],
        },
      },
    });

    if (solicitud) {
      return res.json({ existe: true });
    } else {
      return res.json({ existe: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Error: " + error.message });
  }
}

async function aprobarSolicitud(req, res) {
  const { id } = req.params;
  const idFormat = parseInt(id, 10);

  try {
    const transaction = await prisma.$transaction([
      prisma.istla_solicitudes_beca.update({
        where: { ID_SOLICITUD: idFormat },
        data: { ID_ESTADO: 2 },
      }),

      prisma.istla_documentos_obligatorios.create({
        data: {
          ID_SOLICITUD: idFormat,
          ID_ESTADO: 1,
        },
      }),
    ]);

    const registroDocumento = transaction[1];

    await prisma.istla_documentos_detalle.create({
      data: {
        ID_DOCUMENTOS_OBLIGATORIOS: registroDocumento.ID_DOCUMENTOS,
      },
    });

    res.status(200).json({
      message: "Solicitud aprobada",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al aprobar la solicitud: " + error.message });
  }
}

async function rechazarSolicitud(req, res) {
  const { id } = req.params;
  const idFormat = parseInt(id, 10);
  try {
    await prisma.istla_solicitudes_beca.delete({
      where: {
        
        ID_SOLICITUD: idFormat,
      },
    });
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ error: "Error: " + error.message });
  }
}

module.exports = {
  postSolicitudBeca,
  getSolicitudId,
  getSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
};
