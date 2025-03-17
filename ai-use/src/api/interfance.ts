export interface Base_res {
    code: number;
    message: string;
}

export interface Login_options {
    code: string;
    redirect_uri: string
}

export interface Node_list_options extends Base_res {
    father_id: number;
    project_id: number;
    type_id: number;
}


export interface Node_item {
    id: number;
    father_id: number;
    name: string;
    abs: string;
    project_id: number;
    type_id: number;
    sort_index:number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    children: Node_item[]
}


export interface Node_list_res extends Base_res {
    data: Node_item[]
}

export interface Node_add_options {
    father_id: number;
    name: string;
    abs: string;
    project_id: number;
    type_id: number;
    sort_index:number;
}

export interface Node_add_res {
    id: number;
    father_id: number;
    name: string;
    abs: string;
    project_id: number;
    type_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}


export interface Node_modify_options {
    node_id: number;
    sort_index:number;
    name: string;
    abs: string;
}

export interface Ai_options {
    type_id: number;
    node_id: number;
    rules:string;
    test_action:string;
}

export interface Node_adds_options extends Node_add_options{
    children:Node_adds_options[]
}
