import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/istla`;

export const getperiodosIstla = async () => {
  try {
    const response = await axios.get(`${API_URL}/periodosIstla`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};

export const getUsuariosIstla = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuariosIstla`, {
      withCredentials: true,
    });
    const usuariosFormateados = response.data.map((usuario) => ({
      label: `${usuario.NOMBRES_USUARIOS.trim()} ${usuario.APELLIDOS_USUARIOS.trim()} - ${
        usuario.DOCUMENTO_USUARIOS
      }`,
      value: usuario.DOCUMENTO_USUARIOS,
    }));
    const usuariosFiltrados = usuariosFormateados.slice(4);

    return usuariosFiltrados;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};
