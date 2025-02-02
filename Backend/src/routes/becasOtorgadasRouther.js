const express = require("express");
const fileUpload = require("express-fileupload");

const { verifyToken } = require("../middleware/auth");
const {
  getBecasOtorgadas,
  updateSincronizarFechas,
  getBecaVigente,
  updateBeca,
  getBecasPorcentajes,
  getPeriodosBecas,
  getBecasConteoTipo,
  getBecasPorCarrera,
  getBecasPorId,
  getBecasPorIdEstudiante,
  renovarBeca,
  verDocumentoRenovacion,
  updateCaducidadBeca,
} = require("../controllers/becasOtorgadasController");
const router = express.Router();

router.use(fileUpload());
router.use(verifyToken);

/**
 * @swagger
 * /api/becasOtorgadas/obtenerBecas:
 *   get:
 *     tags:
 *       - Becas Otorgadas
 *     summary: Obtener todas las becas otorgadas
 *     description: Retorna la lista de todas las becas que han sido otorgadas en el sistema
 *     responses:
 *       200:
 *         description: Lista de becas recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID_BECA:
 *                         type: integer
 *                         example: 1
 *                       CEDULA_ESTUDIANTE:
 *                         type: string
 *                         example: "1234567890"
 *                       TIPO_BECA:
 *                         type: string
 *                         example: "Beca Académica"
 *                       PORCENTAJE:
 *                         type: integer
 *                         example: 50
 *                       ID_PERIODO:
 *                         type: integer
 *                         example: 1
 *                       PERIODO_CADUCIDAD:
 *                         type: string
 *                         example: "2025-1"
 *                       ID_ESTADO:
 *                         type: integer
 *                         example: 1
 *                       ESTADO_BECA:
 *                         type: string
 *                         example: "Activa"
 *                       RENOVACION:
 *                         type: string
 *                         nullable: true
 *                         example: "2024-12-31"
 *                 - type: object
 *                   properties:
 *                     noHay:
 *                       type: boolean
 *                       example: true
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo las becas"
 */
router.get("/obtenerBecas", getBecasOtorgadas);

/**
 * @swagger
 * /api/becasOtorgadas/updateSincronizacion:
 *   get:
 *     tags:
 *       - Becas Otorgadas
 *     summary: Actualizar sincronización de fechas
 *     description: Actualiza la sincronización de fechas para todas las becas otorgadas
 *     responses:
 *       200:
 *         description: Fechas sincronizadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_BECA:
 *                     type: integer
 *                     example: 1
 *                   CEDULA_ESTUDIANTE:
 *                     type: string
 *                     example: "1234567890"
 *                   PERIODO_CADUCIDAD:
 *                     type: string
 *                     example: "2025-1"
 *                   FECHA_ACTUALIZACION:
 *                     type: string
 *                     format: date
 *                     example: "2024-02-01"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo las becas"
 */
router.get("/updateSincronizacion", updateSincronizarFechas);

/**
 * @swagger
 * /api/becasOtorgadas/becaVigente:
 *   get:
 *     tags:
 *       - Becas Otorgadas
 *     summary: Obtener beca vigente por cédula
 *     description: Retorna la beca vigente de un estudiante según su número de cédula
 *     parameters:
 *       - in: query
 *         name: cedula
 *         required: true
 *         description: Número de cédula del estudiante
 *         schema:
 *           type: string
 *           example: "1234567890"
 *     responses:
 *       200:
 *         description: Beca vigente recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_BECA:
 *                   type: integer
 *                   example: 1
 *                 CEDULA_ESTUDIANTE:
 *                   type: string
 *                   example: "1234567890"
 *                 TIPO_BECA:
 *                   type: string
 *                   example: "Beca Académica"
 *                 PORCENTAJE:
 *                   type: integer
 *                   example: 50
 *                 ID_PERIODO:
 *                   type: integer
 *                   example: 1
 *                 PERIODO_CADUCIDAD:
 *                   type: string
 *                   example: "2025-1"
 *                 ESTADO_BECA:
 *                   type: string
 *                   example: "Activa"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo las becas"
 */
router.get("/becaVigente", getBecaVigente);

router.get("/porcentajesBeca", getBecasPorcentajes);

router.get("/becasPeriodos", getPeriodosBecas);

router.get("/becasConteoTipo", getBecasConteoTipo);

router.get("/becasPorCarrera", getBecasPorCarrera);

router.get("/verDocumento", verDocumentoRenovacion);

router.get("/updateCaducidad", updateCaducidadBeca);

router.post("/getBecaById", getBecasPorId);

router.post("/renovacion", renovarBeca);

router.post("/becaExisteEstudiante", getBecasPorIdEstudiante);

router.put("/actualizarBeca", updateBeca);

module.exports = router;
