import request from "@/utils/request";
import {Node_add_options, Ai_options, Node_modify_options, Node_list_res, Login_options, Node_list_options, Node_add_res, Node_adds_options} from "@/api/interfance"
import {AxiosResponse} from "axios";

export const login = (data: Login_options) => {
    return request({
        url: 'user/login',
        method: 'post',
        data
    })
}

export const node_list = (data: Node_list_options): Promise<Node_list_res> => {
    const {project_id, father_id, type_id} = data
    return request({
        url: `node/list?project_id=${project_id}&father_id=${father_id}&type_id=${type_id}`,
        method: 'get',
    })
}


export const node_add = (data: Node_add_options):Promise<Node_add_res> => {
    return request({
        url: `node/add`,
        method: 'post',
        data: data
    })
}


export const node_delete = (node_id:number) => {
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
        url: `ai`,
        method: 'post',
        data
    })
})

export const node_adds = (data: Node_adds_options[]) => {
    return request({
        url: `node/adds`,
        method: 'post',
        data: {
            node_list: data
        }
    })
}
