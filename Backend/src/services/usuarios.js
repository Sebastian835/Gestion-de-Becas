const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function getRoles() {
  try {
    const roles = await prisma.istla_rol_usuario.findMany({
      where: {
        ID_ROL: {
          not: 1,
        },
      },
    });

    return roles;
  } catch (error) {
    throw new Error("Error los roles");
  }
}

async function getUsuarios() {
  try {
    const usuarios = await prisma.vista_usuarios.findMany({
      where: {
        ID_USUARIO: {
          not: 1,
        },
      },
      select: {
        ID_USUARIO: true,
        ROL: true,
        USUARIO: true,
        NOMBRES: true,
        APELLIDOS: true,
        CORREO: true,
        CEDULA: true,
        DESCRIPCION: true,
      },
    });

    return usuarios;
  } catch (error) {
    throw new Error("Error al obtener los usuarios");
  }
}

async function postUsuario(data) {
  try {
    const rol = await prisma.istla_rol_usuario.findFirst({
      where: {
        NOMBRE: data.ROL,
      },
    });

    const user = data.NOMBRES + "." + data.APELLIDOS;

    const usuario = await prisma.istla_usuarios.create({
      data: {
        NOMBRES: data.NOMBRES,
        APELLIDOS: data.APELLIDOS,
        USUARIO: user,
        PASSWORD: bcrypt.hashSync(data.PASSWORD, 10),
        ID_ROL: rol.ID_ROL,
        CORREO: data.CORREO,
        DESCRIPCION: data.DESCRIPCION || null,
      },
    });

    return usuario;
  } catch (error) {
    throw new Error("Error al obtener documentos: " + error.message);
  }
}

async function updateUsuario(data) {
  try {
    const rol = await prisma.istla_rol_usuario.findFirst({
      where: {
        NOMBRE: data.ROL,
      },
    });

    if (data.PASSWORD) {
      await prisma.istla_usuarios.update({
        where: {
          ID_USUARIO: data.ID_USUARIO,
        },
        data: {
          NOMBRES: data.NOMBRES,
          APELLIDOS: data.APELLIDOS,
          USUARIO: data.USUARIO,
          PASSWORD: bcrypt.hashSync(data.PASSWORD, 10),
          ID_ROL: rol.ID_ROL,
          CORREO: data.CORREO,
          DESCRIPCION: data.DESCRIPCION || null,
        },
      });
    } else {
      await prisma.istla_usuarios.update({
        where: {
          ID_USUARIO: data.ID_USUARIO,
        },
        data: {
          NOMBRES: data.NOMBRES,
          APELLIDOS: data.APELLIDOS,
          USUARIO: data.USUARIO,
          ID_ROL: rol.ID_ROL,
          CORREO: data.CORREO,
          DESCRIPCION: data.DESCRIPCION || null,
        },
      });
    }
    return;
  } catch (error) {
    throw new Error("Error al actualizar contraseña");
  }
  han
}

async function deleteUsuario(id) {
  try {
    const usuario = await prisma.istla_usuarios.delete({
      where: {
        ID_USUARIO: parseInt(id),
      },
    });
    return usuario;
  } catch (error) {
    throw new Error("Error al eleminar el usuario");
  }
}

module.exports = {
  getUsuarios,
  postUsuario,
  deleteUsuario,
  updateUsuario,
  getRoles,
};
