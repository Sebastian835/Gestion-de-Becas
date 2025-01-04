import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/user`;

export async function getUser() {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return null;
    }
    throw error;
  }
}
