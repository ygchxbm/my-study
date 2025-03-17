import {defineStore} from "pinia";
import {ref, computed} from "vue";
import {node_list} from "@/api";
import {ElLoading} from 'element-plus'

export const useNodeListStore = defineStore("nodeLister", () => {
    const nodeList = ref([]);

    const checkedNodeId = ref()

    const checkedNode = computed(() => {
        let res = null;
        for (const node of nodeList.value) {
            if (node.id == checkedNodeId.value) {
                res = node;
                break
            }
        }
        return res;
    })

    const updateNodeList = async (node) => {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.4)'
        })
        try {
            const res = await node_list({"project_id": 1, "father_id": 0, "type_id": 1});
            if (!res?.data?.length || res.data.length === 0) return
            nodeList.value = res.data;
        } catch (err) {
            console.error(err)
        } finally {
            loading.close()
        }
    }

    const setCheckedNodeId = async (id: number) => {
        await updateNodeList()
        checkedNodeId.value = id
    }

    return {nodeList, updateNodeList, setCheckedNodeId, checkedNode}
})
