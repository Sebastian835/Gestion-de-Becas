import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

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
    (error) => {
        if (error.response.status === 401) {
            logout();
        }
        return Promise.reject(error);
    }
);
