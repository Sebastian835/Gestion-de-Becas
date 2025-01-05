import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/usuarios`;

export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/getRoles`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error en la petición");
  }
};

export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/getUsuarios`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error en la petición");
  }
};

export const getUsuariosBusqueda = async (user) => {
  try {
    const response = await axios.get(`${API_URL}/getUsuarioBusqueda`, {
      params: { user },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error en la petición");
  }
};

export const crearUsuario = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/postUsuario`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error("Error en la petición");
  }
};

export const actualizarUsuario = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/updateUsuario`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error en la petición");
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteUsuario/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error("Error en la petición");
  }
};
