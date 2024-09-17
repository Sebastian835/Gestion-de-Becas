const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

async function postSolicitudBeca(req, res) {
  try {
    const data = req.body;

    let fechaHora = data["fechaHora"];
    fechaHora = fechaHora.replace("a. m.", "AM").replace("p. m.", "PM");
    const fecha = dayjs(fechaHora, "D/M/YYYY, h:mm:ss A").toDate();
    const solicitudBeca = await prisma.istla_solicitudes_beca.create({
      data: {
        fecha_hora: fecha,
        tipo_beca: data["becaSeleccionada"],
        cedula: data["cedula"],
      },
    });

    const documentoBase64 = data["documento"];
    const base64Data = documentoBase64.replace(/^data:application\/pdf;base64,/, '');
    const documentoBuffer = Buffer.from(base64Data, 'base64');
    await prisma.istla_documento_solicitud.create({
      data: {
        id_solicitud_beca: solicitudBeca.id,
        documento: documentoBuffer,
      },
    });

    
    res.status(200).json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

module.exports = { postSolicitudBeca };
