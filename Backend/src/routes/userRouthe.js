const express = require("express");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.use(verifyToken);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtiene la información del usuario autenticado
 *     tags: [Usuario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "usuario123"
 *                 role:
 *                   type: string
 *                   example: "estudiante"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/", (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
