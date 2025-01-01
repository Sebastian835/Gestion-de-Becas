import axios from "axios";

const API_URL = "http://localhost:3000/api/vigenciaBecas";

export const postCrearPlazoBecas = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/crearPlazoBecas`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    throw error;
  }
};

export const getPlazoBecas = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtenerVigenciaBecas`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};

export const getPlazoBecasActivas = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtenerVigenciaBecasActivas`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};


