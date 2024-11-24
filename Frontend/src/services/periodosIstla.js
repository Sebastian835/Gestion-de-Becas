import axios from "axios";

const API_URL = "http://localhost:3000/api/istla";

export const getperiodosIstla = async () => {
  try {
    const response = await axios.get(`${API_URL}/periodosIstla`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en la petición");
  }
};
