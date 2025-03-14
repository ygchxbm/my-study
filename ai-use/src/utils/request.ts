import axios from "axios";
import {ElNotification} from 'element-plus'
import {useUserStore} from "@/store/useUserStore"

const request = axios.create({
    baseURL: "/api/v1",
    timeout: 60000,
})

const CODE_WHILE_LIST=[];

const errorHandler = (error) => {

}

request.interceptors.request.use(config => {
    const {getToken} = useUserStore()
    const token = getToken()
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
    }
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
export default request
