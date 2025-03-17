import axios from "axios";
import {useUserStore} from "@/store/useUserStore"
import {ElLoading, ElNotification} from 'element-plus'

const request = axios.create({
    baseURL: "/api/v1",
    timeout: 60000,
})

const CODE_WHILE_LIST=[];

const errorHandler = (error) => {
    loading?.close()
}
let loading: { close(): void }
request.interceptors.request.use(config => {
    const {getToken} = useUserStore()
    const token = getToken()
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
    }
    // loading = ElLoading.service({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.4)'
    // })
    return config
},errorHandler)

request.interceptors.response.use((response)=>{
    const {data}=response;
    loading?.close()
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
