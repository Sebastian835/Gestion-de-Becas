const express = require("express");
const { verifyToken } = require("../middleware/auth");
const { getTiposBecasController } = require("../controllers/tipos_becasController");
const router = express.Router();

router.use(verifyToken);

router.get('/becas', getTiposBecasController);


module.exports = router;
