import axios from  'axios';

const api = axios.create({
    //baseURL: 'https://2btech.com.br/app/2telapi',
    baseURL: 'https://2btech.com.br/app/hml/2telapi',
});

export default api;