import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api/auth';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};

export const logout = () => {
    axios.post(`${API_URL}/logout`, {}, { withCredentials: true }).then(() => {
    }).catch((error) => {
        console.error('Logout failed:', error);
    });
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
            // await Swal.fire({
            //     icon: 'warning',
            //     title: 'Sesión Expirada',
            //     text: 'Tu sesión está a punto de cerrarse.',
            //     showConfirmButton: false,
            //     timer: 3000 
            // });
            logout();
        }
        return Promise.reject(error);
    }
);