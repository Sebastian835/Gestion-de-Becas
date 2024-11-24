import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tiposBecas';

export const getTiposBecas = async () => {
    try {
        const response = await axios.get(`${API_URL}/becas`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en la petición');
    }
};
