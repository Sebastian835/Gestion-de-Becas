const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  getReporte,
  downloadReporte,
} = require("../controllers/reportsController");

router.use(verifyToken);

/**
 * @swagger
 * /api/reportes/generarReporte:
 *   post:
 *     summary: Genera un nuevo reporte
 *     description: Genera un reporte basado en los filtros proporcionados
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Filtros para el reporte
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-01"
 *                 description: Fecha inicial para filtrar
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *                 description: Fecha final para filtrar
 *               tipoBeca:
 *                 type: string
 *                 example: "Académica"
 *                 description: Tipo de beca a filtrar
 *               estado:
 *                 type: string
 *                 example: "Aprobada"
 *                 description: Estado de las becas a filtrar
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombreArchivo:
 *                   type: string
 *                   example: "reporte_20250201.pdf"
 *                 datos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Datos del reporte generado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los usuarios."
 */
router.post("/generarReporte", getReporte);

/**
 * @swagger
 * /api/reportes/{filename}:
 *   get:
 *     summary: Descarga un reporte específico
 *     description: Descarga un reporte previamente generado usando su nombre de archivo
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         description: Nombre del archivo del reporte a descargar
 *         schema:
 *           type: string
 *         example: "reporte_20250201.pdf"
 *     responses:
 *       200:
 *         description: Reporte descargado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Reporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Documento no encontrado"
 */
router.get("/:filename", downloadReporte);

module.exports = router;
