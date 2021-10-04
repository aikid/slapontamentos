import axios from  'axios';

const api = axios.create({
    baseURL: 'https://telemetria.slcafes.com.br:8096',
});

export default api;