const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

async function postSolicitudBeca(req, res) {
  try {
    const data = req.body;
    

    let fecha = data["fecha"];
    let fechaFormateada = dayjs(fecha).format("YYYY-MM-DD");

    const documentoBase64 = data["documento"];
    const base64Data = documentoBase64.replace(/^data:application\/pdf;base64,/, '');
    const documentoBuffer = Buffer.from(base64Data, 'base64');

    await prisma.istla_solicitudes_beca.create({
      data: {        
        tipo_beca: data["becaSeleccionada"], 
        cedula: data["cedula_estudiante"],       
        fecha: new Date(fechaFormateada),
        estado: 1,
        documento_solicitud: documentoBuffer
      },
    });

    res.status(200).json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

module.exports = { postSolicitudBeca };
