<script setup lang="ts">
import {computed, h, onMounted, ref, shallowRef, watch} from 'vue'
import MindMap from "simple-mind-map"
import {createUid} from 'simple-mind-map/src/utils'
import {ContextMenu} from '@imengyu/vue3-context-menu'
import {ElDrawer, ElMessage} from 'element-plus'
import {Close, Discount} from '@element-plus/icons-vue'
import Drawer from "@/components/Drawer.vue"
import {node_add, node_adds, node_delete, node_modify} from "@/api"
import aiImage from "@/assets/image/AI.png"
import '@/assets/iconfont.js'
import {Node_item} from "@/api/interfance";
import {storeToRefs} from "pinia"
import {useNodeListStore} from "@/store/useNodeListStore";

const {updateNodeList} = useNodeListStore();
const {checkedNode} = storeToRefs(useNodeListStore());
const mindMapContainer = ref()
let mindMap = null;

watch(checkedNode, () => {
  let data: MindNodeData = {}
  if (checkedNode.value) {
    data = parseNode(checkedNode.value)
  }
  mindMap.updateData(data);
})


// 当前激活的节点列表
const activeNodes = shallowRef([])

const lastActiveNode = ref({});
const oneActiveResNodeData = computed(() => {
  if (activeNodes.value?.length > 0) {
    const uid = activeNodes.value[0].uid;
    return getResNode(uid);
  } else {
    return {}
  }
})

interface MindValueData {
  uid: string;
  text: string;
  note: string;
}

interface MindNodeData {
  data: MindValueData;
  children?: MindNodeData[];
}

//插入子节点
const insertChildNode = async (openEdit, fatherNodeList?: number[], appointNodeData: MindValueData[]) => {
  if (fatherNodeList.length === 0 && activeNodes.value.length === 0) {
    ElMessage.warning('请选择子节点插入的位置')
  }
  if (fatherNodeList.length === 0) {
    fatherNodeList = activeNodes.value
  }

  const {uid, text, note} = appointNodeData;
  for (const fatherNode of fatherNodeList) {
    const father_id = getResNode(fatherNode.uid).id;
    if (!father_id || !fatherNode) continue
    try {
      const sort_index = fatherNode.getChildrenLength() + 1;
      const res = await node_add({project_id: 1, father_id, "type_id": 1, sort_index, name: text, abs: note});
      const {id} = res.data
      Reflect.set(UIdMap, id, uid);
      Reflect.set(resNodeMap, uid, res.data);
      mindMap.execCommand('INSERT_CHILD_NODE', openEdit, [fatherNode], appointNodeData)
    } catch (e) {
      console.error(e)
    }
  }
}

//插入同级节点
const insertNode = async (openEdit, brotherNodeList?: number[], appointNodeData: MindNodeData[]) => {
  if (brotherNodeList.length === 0 && activeNodes.value.length === 0) {
    ElMessage.warning('请选择同级节点插入的位置')
  }
  if (brotherNodeList.length === 0) {
    brotherNodeList = activeNodes.value;
  }

  const {uid, text, note} = appointNodeData;
  for (const brotherNode of brotherNodeList) {
    const fatherNode = brotherNode.parent;
    if (!fatherNode) {
      ElMessage.warning("添加同级节点失败，只能拥有一个根节点");
      continue;
    }
    const father_id = getResNode(fatherNode.uid).id;
    if (!father_id) continue
    try {
      const sort_index = fatherNode.getChildrenLength();
      const res = await node_add({project_id: 1, father_id, "type_id": 1, sort_index, name: text, abs: note});
      const {id} = res.data
      Reflect.set(UIdMap, uid, id);
      Reflect.set(resNodeMap, uid, res.data);
      mindMap.execCommand('INSERT_NODE', openEdit, [brotherNode], appointNodeData)
    } catch (e) {
      console.error(e)
    }
  }

}

const drawerType = ref(1)


// 当前右键点击的类型
const type = ref('')
// 如果点击的节点，那么代表被点击的节点
const currentNode = shallowRef(null)

// 菜单显示的位置
const left = ref(0)
const top = ref(0)
// 是否显示菜单
const show = ref(false)

const optionsComponent = computed(() => {
  return {
    zIndex: 3,
    minWidth: 100,
    x: left.value,
    y: top.value,
    items: [
      // {
      //   label: h('div', {
      //     style: {
      //       fontSize: '14px',
      //       background: 'linear-gradient(45deg, #ff0000, #ff00b9, #0067ff)',
      //       '-webkit-background-clip': 'text',
      //       color: 'transparent',
      //     }
      //   }, 'AI用例衍生'),
      //   icon: h('img', {
      //     src: aiImage,
      //     style: {
      //       width: '16px',
      //       height: '16px',
      //     }
      //   }),
      //   onClick: () => {
      //     drawerVisible.value = true
      //   }
      // },
      {
        label: h('div', {
          style: {
            fontSize: '14px',
            background: 'linear-gradient(45deg, #ff0000, #ff00b9, #0067ff)',
            '-webkit-background-clip': 'text',
            color: 'transparent',
          }
        }, 'AI生成'),
        icon: h('img', {
          src: aiImage,
          style: {
            width: '16px',
            height: '16px',
          }
        }),
        onClick: () => {
          drawerVisible.value = true
          drawerType.value = 2
        },
        divided: 'down'
      },
      {
        label: '新增子节点',
        svgIcon: '#icon-zhuye',
        onClick: () => {
          insertChildNode(true, [], {
            uid: createUid(),
            text: '新节点',
            note: '备注内容'
          })
        }
      },
      {
        label: '新增同级节点',
        svgIcon: '#icon-zhuye',
        onClick: async () => {
          await insertNode(true, [], {
            uid: createUid(),
            text: '新节点',
            note: '备注内容'
          })
        }
      },
      // {
      //   label: '插入',
      //   svgIcon: '#icon-xinzeng',
      //   children: [
      //     {
      //       label: '图片',
      //     },
      //   ]
      // },
      // {
      //   label: '标记节点类型',
      //   svgIcon: '#icon-biaozhu',
      // },
      {
        label: h('div', {
          style: {
            fontSize: '14px',
            color: 'red',
          }
        }, '删除节点'),
        divided: 'up',
        svgIcon: '#icon-shanchu',

        onClick: async () => {
          if (activeNodes.value.length > 0) {
            const {uid} = activeNodes.value[0];
            const id = getResNode(uid).id;
            if (!id || id === 0) return
            const res = await node_delete(id)
            if (res.data) {
              mindMap.execCommand('REMOVE_NODE')
            }
          }
        }
      },
    ]
  }
})

// 记录鼠标右键按下的位置
const mousedownX = ref(0)
const mousedownY = ref(0)
const isMousedown = ref(false)


onMounted(async () => {
  mindMap = new MindMap({
    el: mindMapContainer.value,
    data: {},
    initRootNodePosition: ['20%', '50%'],
    richText: true
  });
  mindMap.setThemeConfig({
    backgroundColor: '#f7f7f7'
  })

  // 监听节点激活事件
  mindMap.on('node_active', (node, nodeList) => {
    activeNodes.value = nodeList
    lastActiveNode.value = nodeList[nodeList.length - 1]
  })


  //右键菜单
  const hide = () => {
    show.value = false
    left.value = 0
    top.value = 0
    type.value = ''
  }

  //点击svg画布
  mindMap.on('svg_mousedown', (e) => {
    // 如果不是右键点击直接返回
    if (e.which !== 3) {
      return
    }
    mousedownX.value = e.clientX
    mousedownY.value = e.clientY
    isMousedown.value = true
  })

  mindMap.on('mouseup', (e) => {
    if (!isMousedown.value) {
      return
    }
    isMousedown.value = false
    // 如果鼠标松开和按下的距离大于3，则不认为是点击事件
    if (
        Math.abs(mousedownX.value - e.clientX) > 3 ||
        Math.abs(mousedownX.value - e.clientY) > 3
    ) {
      hide()
      return
    }
    type.value = 'svg'
    left.value = e.clientX + 10
    top.value = e.clientY + 10
    show.value = true
  })

  //节点的右键菜单事件
  mindMap.on('node_contextmenu', (e, node) => {
    type.value = 'node'
    left.value = e.clientX + 10
    top.value = e.clientY + 10
    show.value = true
    currentNode.value = node
  })

  mindMap.on('node_click', hide)
  mindMap.on('draw_click', hide)
  mindMap.on('expand_btn_click', hide)

  // 监听节点内容变化
  mindMap.on('data_change_detail', (arr) => {
    arr.forEach(async item => {
      if (item?.oldData?.data) {
        let isEqual = true;
        ['text', 'note', 'uid'].forEach(key => {
          if (item.data.data[key] !== item.oldData.data[key]) {
            isEqual = false;
          }
        })
        if (!isEqual) {
          //文本变化
          const {text, note, uid} = item.data.data;
          const resNode = getResNode(uid);
          const {id, sort_index} = resNode
          const name1 = extractSimplifiedContentAndText(text)
          if (!id || typeof sort_index !== 'number' || isNaN(sort_index)) return
          await node_modify({node_id: id, sort_index, name: name1, abs: note});
        }
      }
    });
  });
})

//Drawer抽屉
const drawerVisible = ref(false)

interface EmitNodeList {
  data: {
    text: string;
    type_id: number;
  }
  children: EmitNodeList[]
}

const addNodes = async (father_id, emitNodeList: EmitNodeList[]) => {
  const parseRes = (emitNodeList: EmitNodeList[]) => {
    const arr = [];
    emitNodeList.forEach(({data, children}, index) => {
      const {text, type_id} = data;
      const obj = {
        project_id: 1,
        father_id,
        type_id,
        sort_index: index + 1,
        name: text,
        abs: '',
        children: []
      }
      arr.push(obj)
      if (children?.length > 0) {
        obj.children.push(...parseRes(children))
      }
    })

    return arr
  }

  const arr = parseRes(emitNodeList)
  try {
    await node_adds(arr)
    await updateNodeList()
  } catch (err) {

  }

  drawerVisible.value = false;
}

const parseNode = (node: Node_item) => {
  node.children.sort((a, b) => {
    return a.sort_index - b.sort_index
  })
  const data: MindNodeData = {}
  const {id, name, abs, children} = node
  const uid = createUid();
  Reflect.set(UIdMap, id, uid);
  Reflect.set(resNodeMap, uid, node);
  Reflect.set(data, "data", {text: name, uid, note: abs})
  Reflect.set(data, "children", [])
  if (children) {
    for (const item of children) {
      data.children.push(parseNode(item))
    }
  }
  return data
}

const extractSimplifiedContentAndText = (str) => {
  const regex = /<\/?p>/g;
  return str?.replace(regex, '');
}

const UIdMap = {}
const resNodeMap = {}
const getResNode = (uid) => {
  if (uid) {
    return Reflect.get(resNodeMap, uid)
  }
}


</script>

<template>
  <div class="flex flex-col h-full">
    <div ref="mindMapContainer" class="w-full h-full"></div>

    <context-menu
        v-model:show="show"
        :options="optionsComponent">
    </context-menu>
    <el-drawer v-model="drawerVisible" :show-close="false">
      <template #header="{ close, titleId }" class="p-0">
        <div class="flex items-baseline gap-2">
          <div class="border-1 px-1 border-green-400 text-green-400" style="font-size: 12px">模块</div>
          <b>{{ oneActiveResNodeData?.name }}</b>
          <div class="px-1 text-green-400" style="font-size: 12px">
            <el-icon>
              <Discount/>
            </el-icon>
            自建模型
          </div>
        </div>
        <el-icon class="cursor-pointer" @click="drawerVisible=false">
          <Close/>
        </el-icon>
      </template>
      <Drawer
          @addNodes="addNodes"
          :drawerType="drawerType"
          :drawerVisible="drawerVisible"
          :node_id=oneActiveResNodeData?.id
          :node_text=oneActiveResNodeData?.name
          :node_type_id=oneActiveResNodeData?.type_id
      />
    </el-drawer>
  </div>
</template>

<style scoped>
:deep(.el-drawer) {
  .el-drawer__header {
    background: #ffffff;
    border-bottom: 1px solid #c8c8c8;
    min-height: 48px;
    padding: 8px;
    margin: 0;
  }

  .el-drawer__body {
    padding: 0;
  }
}
</style>
