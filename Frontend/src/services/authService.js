import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify({ ...response.data }));
            setAuthHeader(response.data.token);
        }
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};

export const logout = () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-access-token'];
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const isTokenExpired = (token) => {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
};

const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['x-access-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-access-token'];
    }
};

// Configura el interceptor
axios.interceptors.request.use(
    (config) => {
        const user = getCurrentUser();
        if (user && user.token) {
            config.headers['x-access-token'] = user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de token expirado
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            logout();
        }
        return Promise.reject(error);
    }
);
