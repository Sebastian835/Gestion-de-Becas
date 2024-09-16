const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const bcrypt = require('bcrypt');

const users = {
    admin: { password: bcrypt.hashSync('admin', 10), role: 'admin' },
    estudiante: { password: bcrypt.hashSync('estudiante', 10), role: 'estudiante' },
    vicerrector: { password: bcrypt.hashSync('vicerrector', 10), role: 'vicerrector' }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (users[username] && await bcrypt.compare(password, users[username].password)) {
        const token = jwt.sign({ username, role: users[username].role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000
        });
        return res.json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
};

const logout = (req, res) => {
    res.cookie('token', '', { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(0) 
    });
    res.json({ message: 'Logout successful' });
};

module.exports = { login, logout };
