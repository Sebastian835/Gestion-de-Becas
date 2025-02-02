const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  getUsuariosController,
  getPeriodosController,
  getEstudiantesController,
  getCarrerasController,
} = require("../controllers/api_istlaController");

router.use(verifyToken);

/**
 * @swagger
 * /api/istla/periodosIstla:
 *   get:
 *     summary: Obtiene todos los periodos académicos
 *     description: Retorna la lista de periodos académicos disponibles
 *     tags: [ISTLA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de periodos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_PERIODO:
 *                     type: integer
 *                     example: 1
 *                   PERIODO:
 *                     type: string
 *                     example: "2025-1"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los periodos."
 */
router.get("/periodosIstla", getPeriodosController);

/**
 * @swagger
 * /api/istla/usuariosIstla:
 *   get:
 *     summary: Obtiene todos los usuarios del sistema
 *     description: Retorna la lista de usuarios registrados
 *     tags: [ISTLA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_USUARIO:
 *                     type: integer
 *                     example: 1
 *                   USUARIO:
 *                     type: string
 *                     example: "juanperez"
 *                   NOMBRES:
 *                     type: string
 *                     example: "Juan"
 *                   APELLIDOS:
 *                     type: string
 *                     example: "Pérez"
 *                   CORREO:
 *                     type: string
 *                     format: email
 *                     example: "juan.perez@ejemplo.com"
 *                   CEDULA:
 *                     type: string
 *                     example: "1234567890"
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
router.get("/usuariosIstla", getUsuariosController);

/**
 * @swagger
 * /api/istla/estudiantesIstla:
 *   get:
 *     summary: Obtiene todos los estudiantes
 *     description: Retorna la lista de estudiantes registrados
 *     tags: [ISTLA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_ESTUDIANTES:
 *                     type: integer
 *                     example: 1
 *                   DOCUMENTO_ESTUDIANTES:
 *                     type: string
 *                     example: "1234567890"
 *                   NOMBRES_ESTUDIANTES:
 *                     type: string
 *                     example: "Juan"
 *                   APELLIDOS_ESTUDIANTES:
 *                     type: string
 *                     example: "Pérez"
 *                   CORREO_ESTUDIANTES:
 *                     type: string
 *                     format: email
 *                     example: "juan.perez@ejemplo.com"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los periodos."
 */
router.get("/estudiantesIstla", getEstudiantesController);

/**
 * @swagger
 * /api/istla/carrerasIstla:
 *   get:
 *     summary: Obtiene todas las carreras
 *     description: Retorna la lista de carreras disponibles
 *     tags: [ISTLA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carreras obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_CARRERA:
 *                     type: integer
 *                     example: 1
 *                   NOMBRE_CARRERA:
 *                     type: string
 *                     example: "Ingeniería en Sistemas"
 *                   FACULTAD:
 *                     type: string
 *                     example: "Ingeniería"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los periodos."
 */
router.get("/carrerasIstla", getCarrerasController);

module.exports = router;
