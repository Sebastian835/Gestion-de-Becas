import axios from "axios";
import Swal from "sweetalert2";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { username, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const logout = () => {
  axios.post(`${API_URL}/logout`, {}, { withCredentials: true }).then(() => {});
};

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    if (error.response.status === 401) {
      Swal.fire({
        icon: "warning",
        title: "Sesión Expirada",
        text: "Tu sesión está a punto de cerrarse.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        logout();
      });
    }
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            return Promise.resolve(); 
        }
        return Promise.reject(error); 
    }
);

