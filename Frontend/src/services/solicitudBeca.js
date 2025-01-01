import axios from "axios";

const API_URL = "http://localhost:3000/api/solicitudBeca";

export const postSolicitud = async (data) => {
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

export const getBuscarSolicitud = async (cedula) => {
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

export const getSolicitudes = async () => {
  try {
    const response = await axios.get(`${API_URL}/solicitudes`, {
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

export const putAprobarSolicitud = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/aprobarSolicitud/${id}`, {}, {
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

export const deleteRechazarSolicitud = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/rechazarSolicitud/${id}`, {
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
