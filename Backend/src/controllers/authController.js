const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");
const bcrypt = require("bcrypt");
const { getUsuarios } = require("../services/api_istla");

const users = {
  admin: { password: bcrypt.hashSync("admin", 10), role: "admin" },
  vicerrector: {
    password: bcrypt.hashSync("vicerrector", 10),
    role: "vicerrector",
  },
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (
    users[username] &&
    (await bcrypt.compare(password, users[username].password))
  ) {
    const token = jwt.sign(
      { username, role: users[username].role },
      jwtConfig.secret,
      { expiresIn: "1h" }
    );
    res.cookie("authIstlaBecas", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });
    return res.json({
      message: "Login successful",
      user: { username, role: users[username].role },
    });
  }

  try {
    const usuarios = await getUsuarios();
    const estudiante = usuarios.find(
      (user) =>
        user.DOCUMENTO_USUARIOS === username && user.PERFIL === "ESTUDIANTE"
    );

    if (estudiante) {
      const token = jwt.sign(
        { ...estudiante, role: "estudiante" },
        jwtConfig.secret,
        { expiresIn: "30m" }
      );

      res.cookie("authIstlaBecas", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 30 *30 * 1000,
      });

      return res.json({ message: "Login successful", user: estudiante });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error en el proceso de login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("authIstlaBecas").json({ message: "Logout successful" });
};

module.exports = { login, logout };
