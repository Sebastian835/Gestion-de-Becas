const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { getTiposBecas } = require("../services/tipos_becas");
const router = express.Router();

router.use(verifyToken);

router.get('/becas', getTiposBecas);

module.exports = router;
