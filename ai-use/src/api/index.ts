import request from "@/utils/request";
import axios from "axios";

export const login = (param) => {
    return request({
        url: 'user/login',
        method: 'post',
        data: param
    })
}

export const login1 = (param) => {
    return axios.post('/api/v1/user/login',param)
}

export const login2 = (param) => {
     request.post('user/login', param).then((response) => {
         // 保存 token 到本地存储
         if (response?.data.token) {
             localStorage.setItem('token', response.data.token);
         }
         return response;
     });
}


