import axios from 'axios';

let BACKEND_URL = process.env.NODE_ENV === 'production' ? "http://faces-api.herokuapp.com" : "http://localhost:8000/"

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// headers -- 'X-CSRF-Token': token
// credentials: 'same-origin'

export default api;
