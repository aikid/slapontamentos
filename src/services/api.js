import axios from  'axios';

const api = axios.create({
    baseURL: 'https://slpay.slcafes.com.br:8098/api',
});

export default api;