export interface Node_add_options {
    project_id: number;
    father_id: number;
    type_id: number;
    name: string;
    abs: string;
}

export interface Node_modify_options {
    node_id: number;
    name: string;
    abs: string;
}

export interface Ai_options {
    type_id: number;
    node_id: number;
}
