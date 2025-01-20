const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getReporte } = require("../controllers/reportsController");

router.use(verifyToken);

router.post("/generarReporte", getReporte);

module.exports = router;
