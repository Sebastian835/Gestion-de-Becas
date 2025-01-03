import axios from "axios";

const API_URL = "http://localhost:3000/api/becasOtorgadas";

export const getBecasOtorgadas = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtenerBecas`, {
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

export const updateSincronizar = async () => {
  try {
    const response = await axios.get(`${API_URL}/updateSincronizacion`, {
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
