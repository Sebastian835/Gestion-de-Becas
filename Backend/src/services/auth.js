const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function auth(usuario, password) {
  try {
    const user = await prisma.vista_usuarios.findFirst({
      where: {
        USUARIO: usuario,
      },
    });

    if (!user) {
      return null;
    }
    
    const validPassword = await bcrypt.compare(password, user.PASSWORD);
    if (!validPassword) {
      return null;
    }

    return user;
  } catch (error) {
    throw new Error("Error al autenticar");
  }
}

module.exports = {
  auth,
};
