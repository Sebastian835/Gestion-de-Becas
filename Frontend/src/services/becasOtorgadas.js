import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/becasOtorgadas`;

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

export const getBecasById = async (cedula) => {
  try {
    const response = await axios.post(
      `${API_URL}/getBecaById`,
      { cedula },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error en la petición");
  }
};

export const getBecasByIdEstudiante = async (cedula) => {
  try {
    const response = await axios.post(
      `${API_URL}/becaExisteEstudiante`,
      { cedula },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error en la petición");
  }
};

export const getBecaVigente = async (cedula) => {
  try {
    const response = await axios.get(`${API_URL}/becaVigente`, {
      params: { cedula },
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

export const updateBeca = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/actualizarBeca`, data, {
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

export const updateCaducidad = async () => {
  try {
    const response = await axios.get(`${API_URL}/updateCaducidad`, {
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

export const updatePorcentaje = async () => {
  try {
    const response = await axios.get(`${API_URL}/updatePorcentaje`, {
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

export const getPorcentajesBecas = async () => {
  try {
    const response = await axios.get(`${API_URL}/porcentajesBeca`, {
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

export const getBecasPeriodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/becasPeriodos`, {
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

export const getBecasTipo = async () => {
  try {
    const response = await axios.get(`${API_URL}/becasConteoTipo`, {
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

export const getBecasPorCarrera = async () => {
  try {
    const response = await axios.get(`${API_URL}/becasPorCarrera`, {
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

export const enviarRenovacionBeca = async (documento, cedula) => {
  try {
    const formData = new FormData();
    formData.append("documento", documento);
    formData.append("cedula", cedula);

    const response = await axios.post(`${API_URL}/renovacion`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al enviar la renovación");
  }
};
