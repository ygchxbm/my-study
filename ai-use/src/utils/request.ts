import axios from "axios";
import {ElLoading, ElNotification} from 'element-plus'

const request = axios.create({
    baseURL: "/api/v1",
    timeout: 5000,
})

const CODE_WHILE_LIST=[];

const errorHandler = (error) => {

}

request.interceptors.request.use(config => {
    return config
},errorHandler)

request.interceptors.response.use((response)=>{
    const {data}=response;
    if(data.code!==0&&!CODE_WHILE_LIST.includes(response.config.url)){
        let title = '请求失败'
        ElNotification({
            title,
            message: data.msg || data.message,
            type: 'error'
        })
        return Promise.reject(new Error(data.msg || data.message || 'Error'))
    }
    return response.data
},errorHandler)
console.log(request);
export default request
