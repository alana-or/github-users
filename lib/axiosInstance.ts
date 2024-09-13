import axios from 'axios';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: process.env.BASE,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
  },
});

export default axiosInstance;
