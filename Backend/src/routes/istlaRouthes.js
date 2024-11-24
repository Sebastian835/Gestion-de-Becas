const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { getPeriodos } = require("../services/api_istla");

router.use(verifyToken);

router.get("/periodosIstla", getPeriodos);

module.exports = router;
