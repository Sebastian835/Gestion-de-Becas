import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getTiposBecas = async () => {
    try {
        const response = await axios.get(`${API_URL}/tipoBeca`, {
            withCredentials: true
        });
        return response.data.tiposBecas;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en la petición');
    }
};
