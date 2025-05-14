import axios from "axios";



const api = axios.create({
  baseURL: "http://10.89.240.70:5000/api/v1/",
  headers: {
    accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) =>{
    const token = localStorage.getItem("token");
    console.log(token);
    if(token){
      config.headers.Authorization = `${token}`
    }
    return config;
  }, (error) => Promise.reject(error)
)



const sheets = {
  getUsers: () => api.get("user"),
  postLogin: (user) => api.post("login/", user),
  deleteUser: (id_usuario) => api.delete(`user/${id_usuario}`),
  getEventos: () => api.get("evento"),
  deleteEvento: (id_evento) => api.delete(`evento/${id_evento}`),
};

export default sheets;
