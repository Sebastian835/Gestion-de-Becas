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
