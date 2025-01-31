import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/historico`;

export const getHistorico = async (cedula) => {
  try {
    const response = await axios.get(`${API_URL}/getHistorico/${cedula}`, {
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
