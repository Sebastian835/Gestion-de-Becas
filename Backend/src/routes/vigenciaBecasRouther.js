const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  postVigenciaBecasController,
  getVigenciaBecasController,
  getVigenciaBecasActivasController,
  deleteVigenciaBecasController,
  updateVigenciaBecasController,
} = require("../controllers/vigencia_BecasController");
const router = express.Router();

router.use(verifyToken);

/**
 * @swagger
 * /api/vigenciaBecas/crearPlazoBecas:
 *   post:
 *     summary: Crea un nuevo plazo de vigencia para becas
 *     description: Registra un nuevo periodo de vigencia para las becas con fecha de inicio, fin y periodo académico
 *     tags: [Vigencia de Becas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fechaInicio
 *               - fechaFin
 *               - periodo
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio del plazo
 *                 example: "2025-02-01"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 description: Fecha de fin del plazo
 *                 example: "2025-07-31"
 *               periodo:
 *                 type: integer
 *                 description: ID del periodo académico
 *                 example: 1
 *     responses:
 *       200:
 *         description: Plazo de vigencia creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_VIGENCIA:
 *                   type: integer
 *                   example: 1
 *                 FECHA_INICIO:
 *                   type: string
 *                   format: date
 *                   example: "2025-02-01"
 *                 FECHA_FIN:
 *                   type: string
 *                   format: date
 *                   example: "2025-07-31"
 *                 ID_PERIODO:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error creando el plazo."
 */

router.post("/crearPlazoBecas", postVigenciaBecasController);

/**
 * @swagger
 * /api/vigenciaBecas/obtenerVigenciaBecas:
 *   get:
 *     summary: Obtiene todos los plazos de vigencia de becas
 *     description: Retorna una lista de todos los plazos de vigencia registrados
 *     tags: [Vigencia de Becas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de plazos de vigencia obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_VIGENCIA:
 *                     type: integer
 *                     example: 1
 *                   FECHA_INICIO:
 *                     type: string
 *                     format: date
 *                     example: "2025-02-01"
 *                   FECHA_FIN:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-31"
 *                   ID_PERIODO:
 *                     type: integer
 *                     example: 1
 *                   ID_ESTADO:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los periodos"
 */
router.get("/obtenerVigenciaBecas", getVigenciaBecasController);

/**
 * @swagger
 * /api/vigenciaBecas/obtenerVigenciaBecasActivas:
 *   get:
 *     summary: Obtiene los plazos de vigencia activos
 *     description: Retorna una lista de los plazos de vigencia que están actualmente activos
 *     tags: [Vigencia de Becas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de plazos de vigencia activos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_VIGENCIA:
 *                     type: integer
 *                     example: 1
 *                   FECHA_INICIO:
 *                     type: string
 *                     format: date
 *                     example: "2025-02-01"
 *                   FECHA_FIN:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-31"
 *                   ID_PERIODO:
 *                     type: integer
 *                     example: 1
 *                   ID_ESTADO:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los periodos"
 */
router.get("/obtenerVigenciaBecasActivas", getVigenciaBecasActivasController);

/**
 * @swagger
 * /api/vigenciaBecas/eliminarPlazoBecas/{id}:
 *   delete:
 *     summary: Elimina un plazo de vigencia de beca
 *     description: Elimina un plazo de vigencia según su ID
 *     tags: [Vigencia de Becas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del plazo de vigencia a eliminar
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Plazo de vigencia eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_VIGENCIA:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Plazo eliminado exitosamente"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar el plazo."
 */
router.delete("/eliminarPlazoBecas/:id", deleteVigenciaBecasController);

/**
 * @swagger
 * /api/vigenciaBecas/actualizarPlazoBeca:
 *   put:
 *     summary: Actualiza un plazo de vigencia de beca
 *     description: Actualiza la información de un plazo de vigencia existente
 *     tags: [Vigencia de Becas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_VIGENCIA
 *               - FECHA_INICIO
 *               - FECHA_FIN
 *               - ID_PERIODO
 *             properties:
 *               ID_VIGENCIA:
 *                 type: integer
 *                 description: ID del plazo a actualizar
 *                 example: 1
 *               FECHA_INICIO:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de inicio
 *                 example: "2025-02-01"
 *               FECHA_FIN:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de fin
 *                 example: "2025-07-31"
 *               ID_PERIODO:
 *                 type: integer
 *                 description: ID del periodo académico
 *                 example: 1
 *     responses:
 *       200:
 *         description: Plazo de vigencia actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_VIGENCIA:
 *                   type: integer
 *                   example: 1
 *                 FECHA_INICIO:
 *                   type: string
 *                   format: date
 *                   example: "2025-02-01"
 *                 FECHA_FIN:
 *                   type: string
 *                   format: date
 *                   example: "2025-07-31"
 *                 ID_PERIODO:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar el plazo."
 */
router.put("/actualizarPlazoBeca", updateVigenciaBecasController);

module.exports = router;
