const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  usuarios,
  crearUsuario,
  busquedaUsuario,
  actualizarUsuario,
  eliminarUsuario,
  roles,
} = require("../controllers/usuariosController");

const router = express.Router();

router.use(verifyToken);

/**
 * @swagger
 * /api/usuarios/getRoles:
 *   get:
 *     summary: Obtiene todos los roles
 *     description: Retorna la lista de roles disponibles en el sistema
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_ROL:
 *                     type: integer
 *                     example: 1
 *                   NOMBRE:
 *                     type: string
 *                     example: "admin"
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los roles"
 */
router.get("/getRoles", roles);

/**
 * @swagger
 * /api/usuarios/getUsuarios:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista de todos los usuarios registrados en el sistema
 *     responses:
 *       200:
 *         description: Lista de usuarios recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_USUARIO:
 *                     type: integer
 *                     example: 1
 *                   CEDULA:
 *                     type: string
 *                     example: "1234567890"
 *                   USUARIO:
 *                     type: string
 *                     example: "usuario1"
 *                   NOMBRES:
 *                     type: string
 *                     example: "Juan"
 *                   APELLIDOS:
 *                     type: string
 *                     example: "Pérez"
 *                   CORREO:
 *                     type: string
 *                     example: "juan.perez@email.com"
 *                   DESCRIPCION:
 *                     type: string
 *                     nullable: true
 *                     example: "Usuario estándar"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los usuarios"
 */
router.get("/getUsuarios", usuarios);

/**
 * @swagger
 * /api/usuarios/getUsuarioBusqueda:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Buscar usuarios por criterio
 *     description: Permite buscar usuarios según un criterio especificado
 *     parameters:
 *       - in: query
 *         name: user
 *         required: true
 *         description: Criterio de búsqueda para filtrar usuarios
 *         schema:
 *           type: string
 *           example: "juan"
 *     responses:
 *       200:
 *         description: Usuario(s) encontrado(s) exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_USUARIO:
 *                     type: integer
 *                     example: 1
 *                   CEDULA:
 *                     type: string
 *                     example: "1234567890"
 *                   USUARIO:
 *                     type: string
 *                     example: "usuario1"
 *                   NOMBRES:
 *                     type: string
 *                     example: "Juan"
 *                   APELLIDOS:
 *                     type: string
 *                     example: "Pérez"
 *                   CORREO:
 *                     type: string
 *                     example: "juan.perez@email.com"
 *                   DESCRIPCION:
 *                     type: string
 *                     nullable: true
 *                     example: "Usuario estándar"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error obteniendo los usuarios"
 */
router.get("/getUsuarioBusqueda", busquedaUsuario);

/**
 * @swagger
 * /api/usuarios/postUsuario:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Crear nuevo usuario
 *     description: Crea un nuevo usuario en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CEDULA:
 *                 type: string
 *                 example: "1234567890"
 *               USUARIO:
 *                 type: string
 *                 example: "usuario1"
 *               NOMBRES:
 *                 type: string
 *                 example: "Juan"
 *               APELLIDOS:
 *                 type: string
 *                 example: "Pérez"
 *               PASSWORD:
 *                 type: string
 *                 example: "contraseña123"
 *               CORREO:
 *                 type: string
 *                 example: "juan.perez@email.com"
 *               DESCRIPCION:
 *                 type: string
 *                 example: "Usuario estándar"
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_USUARIO:
 *                   type: integer
 *                   example: 1
 *                 CEDULA:
 *                   type: string
 *                   example: "1234567890"
 *                 USUARIO:
 *                   type: string
 *                   example: "usuario1"
 *                 NOMBRES:
 *                   type: string
 *                   example: "Juan"
 *                 APELLIDOS:
 *                   type: string
 *                   example: "Pérez"
 *                 CORREO:
 *                   type: string
 *                   example: "juan.perez@email.com"
 *                 DESCRIPCION:
 *                   type: string
 *                   example: "Usuario estándar"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error creando usuario"
 */
router.post("/postUsuario", crearUsuario);

/**
 * @swagger
 * /api/usuarios/updateUsuario:
 *   put:
 *     tags:
 *       - Usuarios
 *     summary: Actualizar usuario existente
 *     description: Actualiza los datos de un usuario existente en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_USUARIO
 *             properties:
 *               ID_USUARIO:
 *                 type: integer
 *                 example: 1
 *               CEDULA:
 *                 type: string
 *                 example: "1234567890"
 *               USUARIO:
 *                 type: string
 *                 example: "usuario1"
 *               NOMBRES:
 *                 type: string
 *                 example: "Juan"
 *               APELLIDOS:
 *                 type: string
 *                 example: "Pérez"
 *               PASSWORD:
 *                 type: string
 *                 example: "nuevacontraseña123"
 *               CORREO:
 *                 type: string
 *                 example: "juan.perez@email.com"
 *               DESCRIPCION:
 *                 type: string
 *                 example: "Usuario actualizado"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_USUARIO:
 *                   type: integer
 *                   example: 1
 *                 CEDULA:
 *                   type: string
 *                   example: "1234567890"
 *                 USUARIO:
 *                   type: string
 *                   example: "usuario1"
 *                 NOMBRES:
 *                   type: string
 *                   example: "Juan"
 *                 APELLIDOS:
 *                   type: string
 *                   example: "Pérez"
 *                 CORREO:
 *                   type: string
 *                   example: "juan.perez@email.com"
 *                 DESCRIPCION:
 *                   type: string
 *                   example: "Usuario actualizado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al cambiar contraseña"
 */
router.put("/updateUsuario", actualizarUsuario);

/**
 * @swagger
 * /api/usuarios/deleteUsuario/{id}:
 *   delete:
 *     tags:
 *       - Usuarios
 *     summary: Eliminar usuario
 *     description: Elimina un usuario del sistema según su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID_USUARIO:
 *                   type: integer
 *                   example: 1
 *                 CEDULA:
 *                   type: string
 *                   example: "1234567890"
 *                 USUARIO:
 *                   type: string
 *                   example: "usuario1"
 *                 NOMBRES:
 *                   type: string
 *                   example: "Juan"
 *                 APELLIDOS:
 *                   type: string
 *                   example: "Pérez"
 *                 CORREO:
 *                   type: string
 *                   example: "juan.perez@email.com"
 *                 DESCRIPCION:
 *                   type: string
 *                   example: "Usuario eliminado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error a eliminar usuario"
 */
router.delete("/deleteUsuario/:id", eliminarUsuario);

module.exports = router;
