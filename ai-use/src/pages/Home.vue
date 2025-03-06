<script setup lang="ts">
import {ref, onMounted, computed, shallowRef} from 'vue'
import MindMap from "simple-mind-map"
import {ContextMenu, ContextMenuGroup, ContextMenuSeparator, ContextMenuItem} from '@imengyu/vue3-context-menu';
import {Edit} from "@element-plus/icons-vue";

const mindMapContainer = ref()
let mindMap = null

// 当前激活的节点列表
const activeNodes = shallowRef([])

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

const menuData = ref([
  {
    label: '新增子节点',
    handler: () => {
      mindMap.execCommand('INSERT_CHILD_NODE')
    },
  },
  {
    label: '新增邻节点',
    handler: () => {
      mindMap.execCommand('INSERT_NODE')
    },
  },
  {
    label: '收起',
    handler: () => {

    },
  },
  {
    label: '插入',
    children: [
      {
        label: '图片',
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
        handler: () => {
          const iconList = ['priority_1', 'priority_2']
          activeNodes.value.forEach(node => {
            node.setIcon(iconList)
          })
        }
      },
      {
        label: '备注',
        handler: () => {
          activeNodes.value.forEach(node => {
            node.setNote('备注内容')
          })
        }
      },
      {
        label: '标签',
        handler: () => {
          activeNodes.value.forEach(node => {
            node.setTag(['标签1', '标签2'])
          })
        }
      },
      {
        label: '超链接',
        handler: () => {
          activeNodes.value.forEach(node => {
            node.setHyperlink('http://lxqnsys.com/', '理想青年实验室')
          })
        }
      },
      {
        label: '概要',
        handler: () => {
          mindMap.execCommand('ADD_GENERALIZATION', {
            text: '自定义概要内容'
          })
        }
      },
      {
        label: '关联线',
        handler: () => {
          mindMap.associativeLine.createLineFromActiveNode()
        }
      },
    ]
  },
  {
    label: '删除节点',
    handler: () => {
      mindMap.execCommand('REMOVE_NODE')
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

const onMenuClick = (e) => {
  console.log(e)
}

const onLoopMenuClick = (e) => {
  console.log(e)
}

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

onMounted(() => {
  mindMap = new MindMap({
    el: mindMapContainer.value,
    data: {
      "data": {
        "text": "根节点"
      },
      "children": [
        {
          "data": {
            "text": "二级节点"
          },
          "children": []
        },
        {
          "data": {
            "text": "二级节点"
          },
          "children": []
        }
      ]
    },
    initRootNodePosition: ['left', 'center']
  });

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
    debugger
  })

  //点击node节点
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
})

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
        :options="optionsComponent"
    >
      <context-menu-item label="AI 用例衍生"/>
      <!--      <context-menu-item label="AI 生成"/>-->
      <!--            <context-menu-item label="新增子节点"/>-->
      <!--      <template #default>-->
      <!--        <span style="display: inline-flex; align-items: center;">-->
      <!--          <i class="your-icon-class"> <Edit style="width: 1em; height: 1em; margin-right: 8px"/></i> &lt;!&ndash; 替换为你的图标 &ndash;&gt;-->
      <!--          <span style="margin-left: 8px;">AI 用例衍生</span>-->
      <!--        </span>-->
      <!--      </template>-->
      <!--      <context-menu-item label="新增邻节点"/>-->
      <!--      <context-menu-group label="收起">-->
      <!---->
      <!--      </context-menu-group>-->
      <!--      <context-menu-group label="插入">-->
      <!---->
      <!--      </context-menu-group>-->
      <!--      <context-menu-group label="标记节点类型">-->
      <!---->
      <!--      </context-menu-group>-->
      <!--      <template v-for="item in menuData">-->
      <!--        <context-menu-item v-if="!item?.children" :label="item.label" @click="item.handler"></context-menu-item>-->
      <!--        <context-menu-group v-else :label="item.label">-->
      <!--          <template v-for="i in item.children">-->
      <!--            <context-menu-item :label="i.label" @click="i.handler"></context-menu-item>-->
      <!--          </template>-->
      <!--        </context-menu-group>-->
      <!--      </template>-->
    </context-menu>
  </div>
</template>

<style scoped>

</style>
