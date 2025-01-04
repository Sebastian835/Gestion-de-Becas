import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/documentacionBeca`;

export const getDocumentosExistentes = async (cedula) => {
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

export const postDocumentos = async (formdata) => {

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

export const getDocumentos = async () => {
  try {
      const response = await axios.get(`${API_URL}/documentosBeca`, {
          withCredentials: true
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en la petición');
  }
};

export const postAprobarDocumentacion= async (id, porcentaje) => {
  try {
    const response = await axios.put(`${API_URL}/aprobarDocumentacion/${id}`, {porcentaje}, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    });
    return response.data;
  } catch (error) {
    console.error("Error al aprobar la solicitud:", error);
    throw error;
  }
};

export const putDocumentacionReenvio = async (id, motivo) => {
  try {
    const response = await axios.put(`${API_URL}/reenvioDocumentacion/${id}`, {motivo}, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    });
    return response.data;
  } catch (error) {
    console.error("Error al aprobar la solicitud:", error);
    throw error;
  }
};

export const deleteRechazarDocumentacion= async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/rechazarDocumentacion/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error al rechazar la solicitud:", error);
    throw error;
  }
};