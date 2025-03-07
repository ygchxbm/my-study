import request from "@/utils/request";
import axios from "axios";

export const login = (data) => {
    return request({
        url: 'user/login',
        method: 'post',
        data
    })
}

export const node_list = (data) => {
    const {project_id, father_id, type_id} = data
    return request({
        url: `node/list?project_id=${project_id}&father_id=${father_id}&type_id=${type_id}`,
        method: 'get',
    })
}

export const node_add = (data) => {
    return request({
        url: `node/add`,
        method: 'post',
        data: data
    })
}


export const node_delete = (node_id) => {
    return request({
        url: `node/delete`,
        method: 'post',
        data: {node_id}
    })
}
