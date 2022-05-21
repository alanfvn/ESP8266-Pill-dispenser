import Axios from "axios";

const HttpMan = Axios.create({baseURL: 'http://192.168.1.100:3001/api'});

export default HttpMan;