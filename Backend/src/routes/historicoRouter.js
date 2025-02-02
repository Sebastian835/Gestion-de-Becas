const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { historicoController } = require("../controllers/historicoController");

router.use(verifyToken);

/**
 * @swagger
 * /api/historico/getHistorico/{cedula}:
 *   get:
 *     summary: Obtiene el histórico de becas de un estudiante
 *     description: Retorna el historial completo de becas asociadas a una cédula de estudiante
 *     tags: [Histórico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del estudiante
 *         schema:
 *           type: string
 *         example: "1234567890"
 *     responses:
 *       200:
 *         description: Histórico encontrado exitosamente o false si no existe
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: boolean
 *                   example: false
 *                   description: Cuando no hay histórico
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       CEDULA_ESTUDIANTE:
 *                         type: string
 *                         example: "1234567890"
 *                       TIPO_BECA:
 *                         type: string
 *                         example: "Beca Académica"
 *                       PERIODO_SOLICITUD:
 *                         type: integer
 *                         example: 1
 *                       PERIODO_CADUCIDAD:
 *                         type: string
 *                         example: "2025-1"
 *                       PORCENTAJE:
 *                         type: integer
 *                         example: 75
 *                       ESTADO:
 *                         type: string
 *                         example: "Aprobada"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener el histórico"
 */
router.get("/getHistorico/:cedula", historicoController.getHistorico);

/**
 * @swagger
 * /api/historico/getSolicitudHistorico/{cedula}/{periodo}:
 *   get:
 *     summary: Obtiene el PDF de una solicitud específica
 *     description: Retorna el documento PDF de una solicitud de beca basado en la cédula del estudiante y el periodo
 *     tags: [Histórico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         description: Cédula del estudiante
 *         schema:
 *           type: string
 *         example: "1234567890"
 *       - in: path
 *         name: periodo
 *         required: true
 *         description: Periodo académico de la solicitud
 *         schema:
 *           type: string
 *         example: "2025-1"
 *     responses:
 *       200:
 *         description: PDF de la solicitud
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Faltan parámetros requeridos"
 *       404:
 *         description: Documento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No se encontró el documento solicitado"
 */
router.get(
  "/getSolicitudHistorico/:cedula/:periodo",
  historicoController.getSolicitudPDF
);

/**
 * @swagger
 * /api/historico/getDocumentos/{ruta}:
 *   get:
 *     summary: Obtiene un documento PDF específico
 *     description: Retorna un documento PDF basado en su ruta en el sistema
 *     tags: [Histórico]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ruta
 *         required: true
 *         description: Ruta codificada del documento (debe empezar con 'Documentos_Becas')
 *         schema:
 *           type: string
 *         example: "Documentos_Becas/2025/solicitud_001.pdf"
 *     responses:
 *       200:
 *         description: Documento PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acceso denegado"
 *       404:
 *         description: Archivo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Archivo no encontrado"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener el archivo"
 */
router.get("/getDocumentos/:ruta", historicoController.getDocumentoArchivo);

module.exports = router;
