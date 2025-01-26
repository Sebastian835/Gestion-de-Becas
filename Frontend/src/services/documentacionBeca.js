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
    throw error;
  }
};

export const postDocumentos = async (formdata) => {
  try {
    for (let [key, file] of formdata.entries()) {
      if (file instanceof File) {
        const newFile = new File([file], `${key}.pdf`, { type: file.type });
        formdata.set(key, newFile);
      }
    }

    const response = await axios.post(
      `${API_URL}/guardarDocumentos`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDocumentos = async () => {
  try {
    const response = await axios.get(`${API_URL}/documentosBeca`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};

export const postAprobarDocumentacion = async (id, porcentaje) => {
  try {
    const response = await axios.put(
      `${API_URL}/aprobarDocumentacion/${id}`,
      { porcentaje },
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

export const putDocumentacionReenvio = async (id, motivo) => {
  try {
    const response = await axios.put(
      `${API_URL}/reenvioDocumentacion/${id}`,
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

export const deleteRechazarDocumentacion = async (id, motivo) => {
  try {
    const response = await axios.post(
      `${API_URL}/rechazarDocumentacion/${id}`,
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
