import axios from  'axios';

const api = axios.create({
    baseURL: 'https://telemetria.slcafes.com.br:8095',
});

export default api;