const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  getReporte,
  downloadReporte,
} = require("../controllers/reportsController");

router.use(verifyToken);

router.get("/:filename", downloadReporte);

router.post("/generarReporte", getReporte);

module.exports = router;
