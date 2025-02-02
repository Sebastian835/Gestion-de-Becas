const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { getTiposBecasController } = require("../controllers/tipos_becasController");
const router = express.Router();

router.use(verifyToken);

/**
 * @swagger
 * /api/tiposBecas/becas:
 *   get:
 *     summary: Obtiene todos los tipos de becas
 *     tags: [Tipos de Becas]
 *     responses:
 *       200:
 *         description: Lista de tipos de becas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_TIPO_BECA:
 *                     type: integer
 *                     example: 1
 *                   TIPO_BECA:
 *                     type: string
 *                     example: "Beca Académica"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo las becas"
 */
router.get('/becas', getTiposBecasController);


module.exports = router;
