const express = require("express");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

router.use(verifyToken);

router.get("/", (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
