import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/reportes`;
const API_PRELIMINAR = `${import.meta.env.VITE_API_URL}/becasOtorgadas`;

export const postReportes = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/generarReporte`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};

export const downloadReport = async (filename) => {
  try {
    window.open(`${API_URL}/${filename}`, "_blank");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};

export const downloadPreliminar = async () => {
  try {
    const response = await axios.get(`${API_PRELIMINAR}/preliminar`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};
