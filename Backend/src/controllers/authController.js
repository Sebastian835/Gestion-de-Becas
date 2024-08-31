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
        const user = { username, role: users[username].role, token };
        return res.json(user);
    } else {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }
};

module.exports = { login };
