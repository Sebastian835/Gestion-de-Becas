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

/**
 * @swagger
 * /api/documentacionBeca/obtenerEstadoDocumentos:
 *   get:
 *     summary: Obtiene el estado de los documentos de una solicitud de beca
 *     description: Retorna el estado de los documentos pendientes para una solicitud según la cédula del estudiante
 *     tags: [Documentación de Beca]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cedula
 *         required: true
 *         description: Cédula del estudiante
 *         schema:
 *           type: string
 *         example: "1234567890"
 *     responses:
 *       200:
 *         description: Estado de documentos obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     existeSolicitud:
 *                       type: boolean
 *                       example: false
 *                       description: Indica si existe una solicitud activa
 *                 - type: object
 *                   properties:
 *                     existeDocumentacion:
 *                       type: boolean
 *                       example: false
 *                       description: Indica si existe documentación pendiente
 *                 - type: object
 *                   properties:
 *                     id_documento_pendiente:
 *                       type: integer
 *                       example: 1
 *                       description: ID del documento pendiente
 *                     tipo_beca:
 *                       type: string
 *                       example: "Beca Académica"
 *                       description: Tipo de beca solicitada
 *                     perido_beca:
 *                       type: string
 *                       example: "2025-1"
 *                       description: Periodo académico de la beca
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: Error al obtener el estado de los documentos"
 */
router.get("/obtenerEstadoDocumentos", getEstadoDocumentos);

/**
 * @swagger
 * /api/documentacionBeca/documentosBeca:
 *   get:
 *     summary: Obtiene todos los documentos de becas
 *     description: Retorna la lista de documentos con sus URLs construidas
 *     tags: [Documentación de Beca]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de documentos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     noHay:
 *                       type: boolean
 *                       example: true
 *                       description: Indica que no hay documentos
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID_DOCUMENTOS:
 *                         type: integer
 *                         example: 1
 *                       CERTIFICADO_MATRICULA:
 *                         type: string
 *                         example: "http://localhost:3000/api/accesoDocumentosBecas/certificado_1.pdf"
 *                       COPIA_CEDULA:
 *                         type: string
 *                         example: "http://localhost:3000/api/accesoDocumentosBecas/cedula_1.pdf"
 *                       CERTIFICADO_ASISTENCIA:
 *                         type: string
 *                         example: "http://localhost:3000/api/accesoDocumentosBecas/asistencia_1.pdf"
 *                       CERTIFICADO_PAGOS:
 *                         type: string
 *                         example: "http://localhost:3000/api/accesoDocumentosBecas/pagos_1.pdf"
 *                       CERTIFICADO_DISCIPLINA:
 *                         type: string
 *                         example: "http://localhost:3000/api/accesoDocumentosBecas/disciplina_1.pdf"
 *                       istla_documentos_detalle:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             FICHA_SOCIOECONOMICA:
 *                               type: string
 *                               example: "http://localhost:3000/api/accesoDocumentosBecas/ficha_1.pdf"
 *                             MECANIZADO_IESS:
 *                               type: string
 *                               example: "http://localhost:3000/api/accesoDocumentosBecas/mecanizado_1.pdf"
 *                             # ... otros documentos de detalle
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los documentos."
 */
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

/**
 * @swagger
 * /api/documentacionBeca/rechazarDocumentacion/{id}:
 *   post:
 *     summary: Rechaza la documentación de una beca
 *     description: Elimina/Rechaza la documentación asociada a una solicitud de beca
 *     tags: [Documentación de Beca]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la documentación a rechazar
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motivo
 *             properties:
 *               motivo:
 *                 type: string
 *                 description: Motivo del rechazo de la documentación
 *                 example: "Documentos incompletos o ilegibles"
 *     responses:
 *       200:
 *         description: Documentación rechazada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Documentación rechazada exitosamente"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error elimnando los registros"
 */
router.post("/rechazarDocumentacion/:id", deleteDocumentacionController);

/**
 * @swagger
 * /api/documentacionBeca/aprobarDocumentacion/{id}:
 *   put:
 *     summary: Aprueba la documentación de una beca
 *     description: Actualiza el estado de la documentación a aprobado y asigna el porcentaje de la beca
 *     tags: [Documentación de Beca]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la documentación a aprobar
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - porcentaje
 *             properties:
 *               porcentaje:
 *                 type: integer
 *                 description: Porcentaje de beca asignado
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 75
 *     responses:
 *       200:
 *         description: Documentación aprobada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Documentación aprobada exitosamente"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error actualizando el estado."
 */
router.put("/aprobarDocumentacion/:id", putAceptarDocumentacionController);

/**
 * @swagger
 * /api/documentacionBeca/reenvioDocumentacion/{id}:
 *   put:
 *     summary: Permite el reenvío de documentación
 *     description: Actualiza el estado para permitir que el estudiante reenvíe documentación
 *     tags: [Documentación de Beca]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la documentación a reenviar
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motivo
 *             properties:
 *               motivo:
 *                 type: string
 *                 description: Motivo por el cual se solicita el reenvío de documentos
 *                 example: "Documentos ilegibles, favor reenviar con mejor calidad"
 *     responses:
 *       200:
 *         description: Reenvío de documentación habilitado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Reenvío de documentación habilitado exitosamente"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al permitir el reenviar documentos"
 */
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

/**
 * @swagger
 * /api/documentacionBeca/guardarDocumentos:
 *   post:
 *     summary: Guarda documentos de beca
 *     description: Endpoint interno para guardar documentos obligatorios y de detalle
 *     tags: [Documentación de Beca]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               periodo:
 *                 type: string
 *                 description: Periodo académico
 *               usuario:
 *                 type: string
 *                 description: Usuario que realiza la solicitud
 *               id_documento_pendiente:
 *                 type: string
 *                 description: ID del documento pendiente
 *               # Los documentos requeridos varían según el tipo de beca.
 *               # Se deben enviar los documentos obligatorios y adicionales
 *               # que correspondan al tipo de beca específico.
 */

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
