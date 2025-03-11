<script setup lang="ts">
import {ref, onMounted, computed, shallowRef} from 'vue'
import MindMap from "simple-mind-map"
import {createUid} from 'simple-mind-map/src/utils'
import {ContextMenu, ContextMenuGroup, ContextMenuSeparator, ContextMenuItem} from '@imengyu/vue3-context-menu'
import {ElDrawer} from 'element-plus'
import {Close, Discount} from '@element-plus/icons-vue'
import Drawer from "@/components/Drawer.vue"
import {node_add, node_list, node_delete, node_modify, node_adds} from "@/api"
import RichText from 'simple-mind-map/src/plugins/RichText.js'
import _ from "lodash"

const mindMapContainer = ref()
let mindMap = null

// 当前激活的节点列表
const activeNodes = shallowRef([])
const activeNodeId = computed(() => {
  if (activeNodes.value?.length > 0) {
    return getId(activeNodes.value[0].uid)
  } else {
    return undefined
  }
})

const activeNodeText = computed(() => {
  if (activeNodes.value?.length > 0) {
    return activeNodes.value[0].nodeData.data.text
  } else {
    return ''
  }
})

// 记录前进回退
const isStart = ref(true)
const isEnd = ref(true)


const buttons = ref([
  {
    label: '插入图片',
    handler: () => {
      activeNodes.value.forEach((node) => {
        node.setImage({
          url: 'https://lxqnsys.oss-cn-beijing.aliyuncs.com/qlx/xh2AXkBxYm5jGe5fD7DWYrC5b.png',
          title: '图片的标题或描述',
          width: 100,// 图片的宽高也不能少
          height: 100
        })
      })
    }
  },
  {
    label: '插入图标',
    handler: () => {
      const iconList = ['priority_1', 'priority_2']
      activeNodes.value.forEach(node => {
        node.setIcon(iconList)
      })
    }
  },
  {
    label: '插入超链接',
    handler: () => {
      activeNodes.value.forEach(node => {
        node.setHyperlink('http://lxqnsys.com/', '理想青年实验室')
      })
    }
  },
  {
    label: '插入备注',
    handler: () => {
      activeNodes.value.forEach(node => {
        node.setNote('备注内容')
      })
    }
  },
  {
    label: '插入标签',
    handler: () => {
      activeNodes.value.forEach(node => {
        node.setTag(['标签1', '标签2'])
      })
    }
  },
  {
    label: '插入概要',
    handler: () => {
      mindMap.execCommand('ADD_GENERALIZATION', {
        text: '自定义概要内容'
      })
    }
  },
  {
    label: '插入关联线',
    handler: () => {
      mindMap.associativeLine.createLineFromActiveNode()
    }
  },
  {
    label: '回退',
    handler: () => {
      mindMap.execCommand('BACK')
    }
  },
  {
    label: '前进',
    handler: () => {
      mindMap.execCommand('FORWARD')
    }
  },
  {
    label: '插入兄弟节点',
    handler: () => {
      mindMap.execCommand('INSERT_NODE')
    }
  },
  {
    label: '插入子节点',
    handler: () => {
      mindMap.execCommand('INSERT_CHILD_NODE')
    }
  },
  {
    label: '删除节点',
    handler: () => {
      mindMap.execCommand('REMOVE_NODE')
    }
  },
  {
    label: '设置背景颜色',
    handler: () => {
      mindMap.setThemeConfig({
        backgroundColor: '#eeeff1'
      })
    }
  },
])

const drawerType = ref(1)

const menuData = ref([
  {
    label: 'AI用例衍生',
    type: 1,//item
    handler: () => {
      drawerVisible.value = true
    },
  },
  {
    label: 'AI生成',
    type: 1,//item
    handler: () => {
      drawerVisible.value = true
      drawerType.value = 2
    },
  },
  {
    type: 3,//分割线
  },
  {
    label: '新增子节点',
    type: 1,//item
    handler: async () => {
      if (activeNodes.value.length === 0) return
      const father_id = getId(activeNodes.value[0]?.uid);
      if (!father_id) return
      const name = "新节点";
      const abs = "新备注";
      const res = await node_add({"project_id": 1, father_id, "type_id": 1, name, abs});
      if (!res.data) return
      const {id} = res.data
      const uid = createUid();
      Reflect.set(UIdMap, uid, id);
      console.log(uid)
      mindMap.execCommand('INSERT_CHILD_NODE', false, [], {
        uid,
        text: name,
        note: abs
      })
    },
  },
  {
    label: '新增邻节点',
    type: 1,//item
    handler: async () => {
      if (activeNodes.value.length === 0) return

      const {parent} = activeNodes.value[0]
      if (!parent) return
      const father_id = getId(parent?.uid);
      if (!father_id) return
      const name = "新节点";
      const abs = "新备注";
      const res = await node_add({"project_id": 1, father_id, "type_id": 1, name, abs});
      if (!res.data) return
      const {id} = res.data
      const uid = createUid();
      Reflect.set(UIdMap, uid, id);
      mindMap.execCommand('INSERT_NODE', false, [], {
        uid,
        text: name,
        note: abs
      })
    },
  },
  {
    label: '收起',
    type: 2,//group
  },
  {
    label: '插入',
    type: 2,
    children: [
      {
        label: '图片',
        type: 1,//item
        handler: () => {
          activeNodes.value.forEach((node) => {
            node.setImage({
              url: 'https://lxqnsys.oss-cn-beijing.aliyuncs.com/qlx/xh2AXkBxYm5jGe5fD7DWYrC5b.png',
              title: '图片的标题或描述',
              width: 100,// 图片的宽高也不能少
              height: 100
            })
          })
        }
      },
      {
        label: '图标',
        type: 1,//item
        handler: () => {
          const iconList = ['priority_1', 'priority_2']
          activeNodes.value.forEach(node => {
            node.setIcon(iconList)
          })
        }
      },
      {
        label: '备注',
        type: 1,//item
        handler: () => {
          activeNodes.value.forEach(node => {
            node.setNote('备注内容')
          })
        }
      },
      {
        label: '标签',
        type: 1,//item
        handler: () => {
          activeNodes.value.forEach(node => {
            node.setTag(['标签1', '标签2'])
          })
        }
      },
      {
        label: '超链接',
        type: 1,//item
        handler: () => {
          activeNodes.value.forEach(node => {
            node.setHyperlink('http://lxqnsys.com/', '理想青年实验室')
          })
        }
      },
      {
        label: '概要',
        type: 1,//item
        handler: () => {
          mindMap.execCommand('ADD_GENERALIZATION', {
            text: '自定义概要内容'
          })
        }
      },
      {
        label: '关联线',
        type: 1,//item
        handler: () => {
          mindMap.associativeLine.createLineFromActiveNode()
        }
      },
    ]
  },
  {
    label: '删除节点',
    type: 1,
    handler: async () => {
      if (activeNodes.value.length > 0) {
        const {uid} = activeNodes.value[0];
        const id = getId(uid);
        if (!id || id === 0) return
        const res = await node_delete(id)
        if (res.data) {
          mindMap.execCommand('REMOVE_NODE')
        }
      }
    },
  },
])

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
    minWidth: 230,
    x: left.value,
    y: top.value,
  }
})


// 记录鼠标右键按下的位置
const mousedownX = ref(0)
const mousedownY = ref(0)
const isMousedown = ref(false)


const UIdMap = {}
const getId = (uid) => {
  if (uid) {
    return UIdMap[uid]
  }
}

onMounted(async () => {
  const nodeList = await node_list({"project_id": 1, "father_id": 0, "type_id": 1})
  // await node_delete(4)
  if (nodeList.data.length < 1) return
  const data = parseNode(nodeList.data[0])

  mindMap = new MindMap({
    el: mindMapContainer.value,
    data,
    initRootNodePosition: ['left', 'center'],
    richText: true
  });

  MindMap.usePlugin(RichText, {})

  // 监听节点激活事件
  mindMap.on('node_active', (node, nodeList) => {
    activeNodes.value = nodeList
  })

  // 前进回退事件
  mindMap.on('back_forward', (index, len) => {
    isStart.value = index <= 0
    isEnd.value = index >= len - 1
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
      if (item?.oldData?.data && !_.isEqual(item.data.data, item.oldData.data)) {
        //文本变化
        const {text, note, uid} = item.data.data;
        const node_id = getId(uid);
        console.log({text, note, node_id})
        if (!node_id) return
        await node_modify({node_id, name: text, abs: note});
      }
    });
  });
})


//Drawer抽屉
const drawerVisible = ref(false)

const addNodes = async (type_id: number, texts: string[]) => {
  console.log(type_id)
  console.log(texts)
  const obj = []
  const father_id = activeNodes.value?.length > 0 ? getId(activeNodes.value[0].uid) : ''
  texts.forEach(text => {
    obj.push({
      project_id: 1,
      father_id,
      type_id: type_id,
      name: text,
      abs: '',
    })
  })

  const res = await node_adds(obj)
  if (res?.data?.length === 0) return
  const {data} = res;
  const childList = []
  data.forEach(({id, name, abs}) => {
    const uid = createUid();
    Reflect.set(UIdMap, uid, id);
    childList.push({
      data: {
        uid,
        text: name,
        note: abs
      }
    })
  })

  mindMap.execCommand('INSERT_MULTI_CHILD_NODE', [], childList)
  drawerVisible.value = false;
}

const parseNode = (node) => {
  const data = {}
  const {id, name, abs, children} = node
  const uid = createUid();
  Reflect.set(UIdMap, uid, id);
  Reflect.set(data, "data", {text: name, uid, note: abs})
  Reflect.set(data, "children", [])
  if (children) {
    for (const item of children) {
      data.children.unshift(parseNode(item))
    }
  }
  return data
}

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="toolbar flex gap-2 p-2 items-center flex-wrap">
      <button
          v-for="(button, index) in buttons"
          :key="index"
          @click="button.handler"
          class="h-10 px-4 bg-amber-200 rounded"
      >
        {{ button.label }}
      </button>
    </div>
    <div ref="mindMapContainer" class="w-full h-full"></div>
    <context-menu
        v-model:show="show"
        :options="optionsComponent">
      <template v-for="item in menuData">
        <context-menu-item v-if="item?.type===1" :label="item.label" @click="item.handler"></context-menu-item>
        <context-menu-group v-if="item?.type===2" :label="item.label">
          <template v-for="i in item.children">
            <context-menu-item v-if="i?.type===1" :label="i.label" @click="i.handler"></context-menu-item>
            <context-menu-separator v-if="i?.type===3"/>
          </template>
        </context-menu-group>
        <context-menu-separator v-if="item?.type===3"/>
      </template>
    </context-menu>
    <el-drawer v-model="drawerVisible" :show-close="false">
      <template #header="{ close, titleId }" class="p-0">
        <div class="flex items-baseline gap-2">
          <div class="border-1 px-1 border-green-400 text-green-400" style="font-size: 12px">模块</div>
          <b><span>{{ activeNodes?.length > 0 ? activeNodes[0].nodeData.data.text : '' }}</span></b>
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
          :node_id=activeNodeId
          :node_text=activeNodeText
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
