import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cinestack-backend.onrender.com/api/v1',
    withCredentials: true
})

export default api