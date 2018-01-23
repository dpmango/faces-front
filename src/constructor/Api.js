import axios from 'axios';

// let BACKEND_URL = process.env.NODE_ENV === 'production' ? "http://faces-api.herokuapp.com" : "http://localhost:8000/"
// without local API server
let BACKEND_URL = "https://faces-api.herokuapp.com"

let curDate = new Date();
var sDate = new Date(2018,0,30)
if ( curDate > sDate  ){BACKEND_URL = "http://localhost:8000"}

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
