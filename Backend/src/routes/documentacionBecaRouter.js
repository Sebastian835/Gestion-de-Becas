const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  getEstadoDocumentos,
  postDocumentos,
} = require("../services/documentacionBeca");
const {
  getDocumentosController,
  putAceptarDocumentacionController,
  putReenviarDocumentacionController,
  deleteDocumentacionController,
} = require("../controllers/documentos_becasController");
const path = require("path");
const { upload } = require("../config/multerConfig");

router.use(verifyToken);

router.get("/obtenerEstadoDocumentos", getEstadoDocumentos);

router.get("/documentosBeca", getDocumentosController);

router.use(
  "/accesoDocumentosBecas",
  (req, res, next) => {
    const decodedUrl = decodeURIComponent(req.url);
    if (decodedUrl.toLowerCase().endsWith(".pdf")) {
      res.set("Content-Type", "application/pdf");
      res.set("Content-Disposition", 'inline; filename="documento.pdf"');
    }

    next();
  },
  express.static(path.join(process.cwd(), "Documentos_Becas"), {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath).toLowerCase() === ".pdf") {
        res.set("Content-Type", "application/pdf");
        res.set("Content-Disposition", 'inline; filename="documento.pdf"');
      }
    },
  })
);

router.post("/rechazarDocumentacion/:id", deleteDocumentacionController);

router.put("/aprobarDocumentacion/:id", putAceptarDocumentacionController);

router.put("/reenvioDocumentacion/:id", putReenviarDocumentacionController);

const DOCUMENTOS_OBLIGATORIOS = [
  "CERTIFICADO_MATRICULA",
  "COPIA_CEDULA",
  "CERTIFICADO_ASISTENCIA",
  "CERTIFICADO_PAGOS",
  "CERTIFICADO_DISCIPLINA",
];

const DOCUMENTOS_DETALLE = [
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
];

router.post(
  "/guardarDocumentos",
  upload.fields([
    { name: "periodo" },
    { name: "usuario" },
    { name: "id_documento_pendiente" },
    ...DOCUMENTOS_OBLIGATORIOS.map((doc) => ({ name: doc })),
    ...DOCUMENTOS_DETALLE.map((doc) => ({ name: doc })),
  ]),
  postDocumentos
);

module.exports = router;
