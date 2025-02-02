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

/**
 * @swagger
 * /api/becasOtorgadas/porcentajesBeca:
 *   get:
 *     tags:
 *       - Becas
 *     summary: Obtiene los porcentajes de las becas
 *     description: Retorna una lista con los porcentajes de becas existentes
 *     responses:
 *       200:
 *         description: Lista de porcentajes de becas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   porcentaje:
 *                     type: number
 *                     description: Porcentaje de la beca
 *                     example: 50
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error obteniendo las becas"
 */
router.get("/porcentajesBeca", getBecasPorcentajes);

/**
 * @swagger
 * /api/becasOtorgadas/becasPeriodos:
 *   get:
 *     tags:
 *       - Becas
 *     summary: Obtiene los periodos de becas
 *     description: Retorna una lista con los periodos académicos que tienen becas asignadas
 *     responses:
 *       200:
 *         description: Lista de periodos de becas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   periodo:
 *                     type: integer
 *                     description: ID del periodo académico
 *                     example: 2024
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error obteniendo las becas"
 */
router.get("/becasPeriodos", getPeriodosBecas);

/**
 * @swagger
 * /api/becasOtorgadas/becasConteoTipo:
 *   get:
 *     tags:
 *       - Becas
 *     summary: Obtiene el conteo de becas por tipo
 *     description: Retorna una lista con la cantidad de becas agrupadas por su tipo
 *     responses:
 *       200:
 *         description: Conteo de becas por tipo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tipo_beca:
 *                     type: string
 *                     description: Tipo de beca
 *                     example: "Deportiva"
 *                   cantidad:
 *                     type: integer
 *                     description: Cantidad de becas de ese tipo
 *                     example: 25
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error obteniendo las becas"
 */
router.get("/becasConteoTipo", getBecasConteoTipo);

/**
 * @swagger
 * /api/becasOtorgadas/becasPorCarrera:
 *   get:
 *     tags:
 *       - Becas
 *     summary: Obtiene las becas distribuidas por carrera
 *     description: Retorna una lista con la cantidad de becas agrupadas por carrera universitaria
 *     responses:
 *       200:
 *         description: Lista de becas por carrera obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   carrera:
 *                     type: string
 *                     description: Nombre de la carrera
 *                     example: "Ingeniería en Sistemas"
 *                   total_becas:
 *                     type: integer
 *                     description: Número total de becas en esa carrera
 *                     example: 15
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error obteniendo las becas"
 */
router.get("/becasPorCarrera", getBecasPorCarrera);

/**
 * @swagger
 * /api/becasOtorgadas/verDocumento:
 *   get:
 *     tags:
 *       - Becas
 *     summary: Visualiza un documento de renovación de beca
 *     description: Retorna el archivo del documento solicitado según la ruta proporcionada
 *     parameters:
 *       - in: query
 *         name: ruta
 *         required: true
 *         description: Ruta del documento a visualizar
 *         schema:
 *           type: string
 *           example: "/documentos/renovaciones/doc1.pdf"
 *     responses:
 *       200:
 *         description: Documento obtenido exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Ruta no proporcionada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Ruta no proporcionada"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al obtener el documento"
 */
router.get("/verDocumento", verDocumentoRenovacion);

/**
 * @swagger
 * /api/becasOtorgadas/updateCaducidad:
 *   get:
 *     tags:
 *       - Becas
 *     summary: Actualiza la caducidad de las becas
 *     description: Verifica y actualiza el estado de caducidad de las becas según sus fechas
 *     responses:
 *       200:
 *         description: Caducidad de becas actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de confirmación
 *                   example: "Caducidad de becas actualizada correctamente"
 *                 actualizadas:
 *                   type: integer
 *                   description: Número de becas actualizadas
 *                   example: 5
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error obteniendo las becas"
 */
router.get("/updateCaducidad", updateCaducidadBeca);

/**
 * @swagger
 * /api/becasOtorgadas/getBecaById:
 *   post:
 *     tags:
 *       - Becas
 *     summary: Obtiene las becas por ID de estudiante
 *     description: Retorna todas las becas asociadas a la cédula de un estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cedula
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Cédula del estudiante
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Becas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_beca:
 *                     type: integer
 *                     description: ID de la beca
 *                     example: 1
 *                   tipo_beca:
 *                     type: string
 *                     description: Tipo de beca asignada
 *                     example: "Académica"
 *                   porcentaje:
 *                     type: integer
 *                     description: Porcentaje de la beca
 *                     example: 75
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error obteniendo las becas"
 */
router.post("/getBecaById", getBecasPorId);

/**
 * @swagger
 * /api/becasOtorgadas/renovacion:
 *   post:
 *     tags:
 *       - Becas
 *     summary: Realiza la renovación de una beca
 *     description: Procesa la solicitud de renovación de beca con el documento requerido
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cedula
 *               - documento
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Cédula del estudiante
 *                 example: "1234567890"
 *               documento:
 *                 type: string
 *                 format: binary
 *                 description: Documento PDF de renovación de beca
 *     responses:
 *       200:
 *         description: Renovación procesada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *                   example: "Documento recibido correctamente"
 *       400:
 *         description: Error en la validación de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error de validación
 *                   example: "No se ha enviado ningún documento"
 *             examples:
 *               sinDocumento:
 *                 value:
 *                   error: "No se ha enviado ningún documento"
 *               formatoInvalido:
 *                 value:
 *                   error: "El archivo debe ser PDF"
 *               tamañoExcedido:
 *                 value:
 *                   error: "El archivo excede los 2MB permitidos"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error al procesar la renovación"
 */
router.post("/renovacion", renovarBeca);

/**
 * @swagger
 * /api/becasOtorgadas/becaExisteEstudiante:
 *   post:
 *     tags:
 *       - Becas
 *     summary: Verifica si un estudiante tiene beca asignada
 *     description: Valida si existe una beca asociada a la cédula del estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cedula
 *             properties:
 *               cedula:
 *                 type: string
 *                 description: Cédula del estudiante
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Verificación realizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 existe:
 *                   type: boolean
 *                   description: Indica si el estudiante tiene beca
 *                   example: true
 *                 beca:
 *                   type: object
 *                   description: Información de la beca si existe
 *                   properties:
 *                     id_beca:
 *                       type: integer
 *                       description: ID de la beca
 *                       example: 1
 *                     tipo_beca:
 *                       type: string
 *                       description: Tipo de beca asignada
 *                       example: "Académica"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error obteniendo las becas"
 */
router.post("/becaExisteEstudiante", getBecasPorIdEstudiante);

/**
 * @swagger
 * /api/becasOtorgadas/actualizarBeca:
 *   put:
 *     tags:
 *       - Becas
 *     summary: Actualiza información de una beca
 *     description: Actualiza los datos de una beca existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_beca
 *             properties:
 *               id_beca:
 *                 type: integer
 *                 description: ID de la beca a actualizar
 *                 example: 1
 *               porcentaje:
 *                 type: integer
 *                 description: Nuevo porcentaje de la beca
 *                 example: 75
 *               periodo_caducidad:
 *                 type: string
 *                 description: Nuevo periodo de caducidad
 *                 example: "2024-2"
 *               id_estado:
 *                 type: integer
 *                 description: Nuevo estado de la beca
 *                 example: 1
 *               renovacion:
 *                 type: string
 *                 description: Estado de renovación
 *                 example: "Pendiente"
 *     responses:
 *       200:
 *         description: Beca actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_beca:
 *                   type: integer
 *                   description: ID de la beca actualizada
 *                   example: 1
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de confirmación
 *                   example: "Beca actualizada correctamente"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 *                   example: "Error obteniendo las becas"
 */
router.put("/actualizarBeca", updateBeca);

module.exports = router;
