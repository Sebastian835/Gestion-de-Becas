import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/solicitudBeca`;

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
    throw error;
  }
};

export const putAprobarSolicitud = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/aprobarSolicitud/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRechazarSolicitud = async (id, motivo) => {
  try {
    const response = await axios.post(
      `${API_URL}/rechazarSolicitud/${id}`,
      { motivo },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
