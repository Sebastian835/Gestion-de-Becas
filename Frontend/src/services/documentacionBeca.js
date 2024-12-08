import axios from "axios";

const API_URL = "http://localhost:3000/api/documentacionBeca";

export const buscarDocumentos = async (cedula) => {
  try {
    const response = await axios.get(`${API_URL}/obtenerEstadoDocumentos`, {
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

export const guardarDocumentos = async (formdata) => {

  try {
    const response = await axios.post(`${API_URL}/guardarDocumentos`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al guardar los Documentos: ", error);
    throw error;
  }
};

