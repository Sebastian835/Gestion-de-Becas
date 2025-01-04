import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/vigenciaBecas`;

export const postCrearPlazoBecas = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/crearPlazoBecas`, data, {
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

export const deletePlazoBecas = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminarPlazoBecas/${id}`, {
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

export const getPlazoBecas = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtenerVigenciaBecas`, {
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

export const getPlazoBecasActivas = async () => {
  try {
    const response = await axios.get(`${API_URL}/obtenerVigenciaBecasActivas`, {
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

export const putActualizarPlazoBecas = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/actualizarPlazoBeca`, data, {
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


