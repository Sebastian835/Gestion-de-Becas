const express = require('express');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.use(verifyToken);

router.get('/admin-only', (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ message: 'Admin content' });
});

router.get('/student-content', (req, res) => {
    if (req.user.role !== 'estudiante' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ message: 'Student content' });
});

module.exports = router;