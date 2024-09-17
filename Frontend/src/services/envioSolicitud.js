import axios from 'axios';

const API_URL = 'http://localhost:3000/api/solicitudBeca'; 

export const envioSolicitud = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/envioSolicitud`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        throw error; 
    }
};
