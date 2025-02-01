const {
  getDocumentos,
  putAprobarDocumentacion,
  putReenviarDocumentacion,
  deleteDocumentacion,
} = require("../services/documentacionBeca");

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://tesis.apps-sebas.org/api/documentacionBeca/accesoDocumentosBecas" //"https://becas.istla-sigala.edu.ec/api/documentacionBeca/accesoDocumentosBecas"
    : "http://localhost:3000/api/documentacionBeca/accesoDocumentosBecas";

async function getDocumentosController(req, res) {
  try {
    const documentos = await getDocumentos();

    if (!documentos) {
      return res.json({ noHay: true });
    }
    const documentosConURLs = documentos.map((doc) => {
      const docConURL = { ...doc };

      const fieldsToConvert = [
        "CERTIFICADO_MATRICULA",
        "COPIA_CEDULA",
        "CERTIFICADO_ASISTENCIA",
        "CERTIFICADO_PAGOS",
        "CERTIFICADO_DISCIPLINA",
      ];

      fieldsToConvert.forEach((field) => {
        if (docConURL[field] && typeof docConURL[field] === "string") {
          docConURL[field] = construirURLDocumento(baseURL, docConURL[field]);
        }
      });

      const documentosDetalles = docConURL.istla_documentos_detalle.map(
        (detalle) => {
          const detallesConURL = {};

          for (const key in detalle) {
            if (detalle[key] && typeof detalle[key] === "string") {
              detallesConURL[key] = construirURLDocumento(
                baseURL,
                detalle[key]
              );
            }
          }
          return detallesConURL;
        }
      );

      docConURL.istla_documentos_detalle = documentosDetalles;

      return docConURL;
    });

    res.status(200).json(documentosConURLs);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los documentos." });
  }
}

function construirURLDocumento(baseURL, archivo) {
  if (!archivo) return null;

  const rutaRelativa = archivo.replace(/^Documentos_Becas[\\/]/, "");
  return `${baseURL}/${rutaRelativa.replace(/\\/g, "/")}`;
}

async function putAceptarDocumentacionController(req, res) {
  try {
    const result = await putAprobarDocumentacion(
      req.params.id,
      req.body.porcentaje
    );

    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando el estado." });
  }
}

async function putReenviarDocumentacionController(req, res) {
  try {
    const result = await putReenviarDocumentacion(
      req.params.id,
      req.body.motivo
    );

    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al permitir el reenviar documentos" });
  }
}

async function deleteDocumentacionController(req, res) {
  try {
    const result = await deleteDocumentacion(req.params.id, req.body.motivo);

    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error elimnando los registros" });
  }
}

module.exports = {
  getDocumentosController,
  putAceptarDocumentacionController,
  putReenviarDocumentacionController,
  deleteDocumentacionController,
};
