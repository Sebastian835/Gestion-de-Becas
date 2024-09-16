const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { getTiposBecas } = require("../services/tipos_becas");
const router = express.Router();

router.use(verifyToken);

router.get("/tipoBeca", async (req, res) => {
  if (req.user.role !== "estudiante" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const tiposBecas = await getTiposBecas();
    res.json({ tiposBecas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/usuario', verifyToken, (req, res) => {
  try {
      res.json(req.user);
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
