const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const baseURL = "https://www.istla-sigala.edu.ec/public";

async function getToken() {
  try {
    const form = new FormData();
    form.append("username", process.env.USERNAME_ISTLA);
    form.append("password", process.env.PASSWORD_ISTLA);

    const response = await axios.post(`${baseURL}/login-api`, form, {
      headers: form.getHeaders(),
    });
    return response.data.token;
  } catch (error) {
    throw error;
  }
}

async function getUsuarios() {
  try {
    const token = await getToken();
    const response = await axios.get(`${baseURL}/ver-usuarios`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getPeriodos() {
  try {
    const token = await getToken();
    const response = await axios.get(`${baseURL}/ver-periodos`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUsuarios,
  getPeriodos,
};
