const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");

const { getUsuarios, loginIstla } = require("../services/api_istla");
const { auth } = require("../services/auth");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const autenticacion = await auth(username, password);
    if (autenticacion) {
      const token = jwt.sign(
        { username, role: autenticacion.ROL },
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
        message: "Login exitoso",
        user: { username, role: autenticacion.ROL },
      });
    } else {
      const userLoginIstla = await loginIstla(username, password);
      if (userLoginIstla) {
        const usuarios = await getUsuarios();
        const estudiante = usuarios.find(
          (user) =>
            user.CORREO_USUARIOS === username && user.PERFIL === "ESTUDIANTE"
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
            maxAge: 60 * 60 * 1000,
          });
          return res.json({
            message: "Login exitoso",
            user: estudiante,
            role: "estudiante",
          });
        } else {
          return res.status(401).json({ message: "Credenciales Invalidas" });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
};

const logout = (req, res) => {
  res.clearCookie("authIstlaBecas").json({ message: "Se cerro la sesion" });
};

module.exports = { login, logout };
