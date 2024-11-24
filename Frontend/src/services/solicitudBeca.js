import axios from "axios";

const API_URL = "http://localhost:3000/api/solicitudBeca";

export const envioSolicitud = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/envioSolicitud`, data, {
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

export const buscarSolicitud = async (cedula) => {
  try {
    const response = await axios.get(`${API_URL}/buscarSolicitud`, {
      params: { cedula },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar la solicitud:", error);
    throw error;
  }
};

export const solicitudes = async () => {
  try {
    const response = await axios.get(`${API_URL}/solicitudes`,{
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar la solicitud:", error);
    throw error;
  }
};


