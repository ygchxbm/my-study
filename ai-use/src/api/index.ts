import request from "@/utils/request";
import {Node_add_options, Ai_options, Node_modify_options} from "@/api/interfance"

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

export const node_add = (data: Node_add_options) => {
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

export const node_modify = ((data: Node_modify_options) => {
    return request({
        url: `node/modify`,
        method: 'post',
        data
    })
})

export const ai = ((data: Ai_options) => {
    const {type_id, node_id} = data
    if (!type_id || !node_id) return
    return request({
        url: `ai?type_id=${type_id}&node_id=${node_id}`,
        method: 'get',
    })
})

export const node_adds = (data: Node_add_options[]) => {
    return request({
        url: `node/adds`,
        method: 'post',
        data: {
            node_list:data
        }
    })
}
