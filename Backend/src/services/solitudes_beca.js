const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require("dayjs");
const getUsuarios = require("./api_istla");
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
        ID_TIPO_BECA: data["becaSeleccionada"],
        CEDULA_ESTUDIANTE: data["cedula_estudiante"],
        ID_PERIODO : data["periodo"],
        FECHA: new Date(fechaFormateada),
        ESTADO: 1,
        DOCUMENTO_SOLICITUD: documentoBuffer,
      },
    });

    res.status(200).json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

async function getSolicitudId(req, res) {
  const { cedula } = req.query;

  try {
    const solicitud = await prisma.istla_solicitudes_beca.findFirst({
      where: {
        CEDULA_ESTUDIANTE: cedula,
        ESTADO: 1,
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
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ error: "Error: " + error.message });
  }
}

module.exports = { postSolicitudBeca, getSolicitudId, getSolicitudes };
