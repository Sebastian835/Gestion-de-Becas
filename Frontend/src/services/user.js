import axios from 'axios';

export async function getUser() {
    try {
        const response = await axios.get('http://localhost:3000/api/user', { withCredentials: true });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return null;
        }
        throw error;
    }
}
