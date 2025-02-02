const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  postSolicitudBeca,
  getSolicitudId,
  getSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
} = require("../services/solitudes_beca");

router.use(verifyToken);

/**
 * @swagger
 * /api/solicitudBeca/envioSolicitud:
 *   post:
 *     summary: Crea una nueva solicitud de beca
 *     tags: [Solicitud de Beca]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cedula_estudiante
 *               - nombre_estudiante
 *               - becaSeleccionada
 *               - periodoBeca
 *               - fecha
 *               - documento
 *             properties:
 *               cedula_estudiante:
 *                 type: string
 *                 description: Cédula del estudiante
 *                 example: "1234567890"
 *               nombre_estudiante:
 *                 type: string
 *                 description: Nombre completo del estudiante
 *                 example: "Juan Pérez"
 *               becaSeleccionada:
 *                 type: integer
 *                 description: ID del tipo de beca
 *                 example: 1
 *               periodoBeca:
 *                 type: integer
 *                 description: ID del periodo de vigencia
 *                 example: 1
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la solicitud
 *                 example: "2025-02-01"
 *               documento:
 *                 type: string
 *                 description: Documento PDF en formato base64
 *                 example: "data:application/pdf;base64,JVBERi0xLjcKCjEgMC..."
 *     responses:
 *       200:
 *         description: Solicitud creada exitosamente
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error en el servidor"
 */
router.post("/envioSolicitud", postSolicitudBeca);

/**
 * @swagger
 * /api/solicitudBeca/buscarSolicitud:
 *   get:
 *     summary: Obtiene todas las solicitudes de beca activas
 *     description: Retorna todas las solicitudes de beca que no están en estado Finalizado o Rechazada
 *     tags: [Solicitud de Beca]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     noHay:
 *                       type: boolean
 *                       example: true
 *                       description: Indica que no hay solicitudes activas
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID_SOLICITUD:
 *                         type: integer
 *                         example: 1
 *                       CEDULA_ESTUDIANTE:
 *                         type: string
 *                         example: "1234567890"
 *                       FECHA:
 *                         type: string
 *                         format: date
 *                         example: "2025-02-01"
 *                       TIPO_BECA:
 *                         type: string
 *                         example: "Beca Académica"
 *                       DOCUMENTO_SOLICITUD:
 *                         type: string
 *                         format: binary
 *                       ESTADO:
 *                         type: string
 *                         example: "Pendiente"
 *                       ID_PERIODO:
 *                         type: integer
 *                         example: 1
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: Mensaje de error"
 */
router.get("/buscarSolicitud", getSolicitudId);

/**
 * @swagger
 * /api/solicitudBeca/solicitudes:
 *   get:
 *     summary: Obtiene todas las solicitudes de beca activas
 *     description: Retorna todas las solicitudes de beca excluyendo las que están en estado Finalizado o Rechazada
 *     tags: [Solicitud de Beca]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     noHay:
 *                       type: boolean
 *                       description: Indica que no hay solicitudes activas
 *                       example: true
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/SolicitudBecaDetalle'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: Error interno del servidor"
 *
 * components:
 *   schemas:
 *     SolicitudBecaDetalle:
 *       type: object
 *       properties:
 *         ID_SOLICITUD:
 *           type: integer
 *           example: 1
 *         CEDULA_ESTUDIANTE:
 *           type: string
 *           example: "1234567890"
 *         FECHA:
 *           type: string
 *           format: date
 *           example: "2025-02-01"
 *         TIPO_BECA:
 *           type: string
 *           example: "Beca Académica"
 *         DOCUMENTO_SOLICITUD:
 *           type: string
 *           format: binary
 *         ESTADO:
 *           type: string
 *           example: "Pendiente"
 *         ID_PERIODO:
 *           type: integer
 *           example: 1
 */
router.get("/solicitudes", getSolicitudes);

/**
 * @swagger
 * /api/solicitudBeca/aprobarSolicitud/{id}:
 *   put:
 *     summary: Aprueba una solicitud de beca
 *     description: Actualiza el estado de la solicitud a aprobado y crea los registros de documentación necesarios
 *     tags: [Solicitud de Beca]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la solicitud de beca
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitud aprobada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitud aprobada"
 *       500:
 *         description: Error al aprobar la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al aprobar la solicitud: mensaje de error"
 */
router.put("/aprobarSolicitud/:id", aprobarSolicitud);

/**
 * @swagger
 * /api/solicitudBeca/rechazarSolicitud/{id}:
 *   post:
 *     summary: Rechaza una solicitud de beca
 *     description: Elimina una solicitud de beca según su ID
 *     tags: [Solicitud de Beca]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la solicitud a rechazar
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
 *                 description: Motivo del rechazo de la solicitud
 *                 example: "No cumple con los requisitos mínimos"
 *     responses:
 *       200:
 *         description: Solicitud rechazada exitosamente
 *       500:
 *         description: Error al rechazar la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error: Error al eliminar la solicitud"
 */
router.post("/rechazarSolicitud/:id", rechazarSolicitud);

module.exports = router;
