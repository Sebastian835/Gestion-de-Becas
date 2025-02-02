const express = require("express");
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger')

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
