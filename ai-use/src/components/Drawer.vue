<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {Close, CopyDocument, Loading, Position, Refresh, Switch} from '@element-plus/icons-vue'
import {createUid} from 'simple-mind-map/src/utils'
import aiImage from "@/assets/image/AI.png"
import meImage from "@/assets/image/me.png"
import {ElMessage} from "element-plus";
import {ai} from "@/api";

interface EmitNode {
  data: {
    text: string;
    type_id: number;
  }
  children: EmitNode[]
}

const emit = defineEmits<{
  (e: 'addNodes', id: number, emitNodeList: EmitNode[]): void;
}>();

interface Message {
  id?: string;
  sender: string;
  type: string;
  text?: string;
  emitData?: EmitNode[];
  nodeData?: {}[];
}

const props = defineProps<{
  drawerType: number;
  drawerVisible: boolean;
  node_id: number | undefined;
  node_text: string | undefined;
  node_type_id: number | undefined;
}>()

watch(props, () => {
  if (props.drawerVisible) {
    // messageList.value.length = 0;
  }
})

const messageList = ref<Message[]>([]);
const messageMap: { [prop: string]: EmitNode } = {};
const loadingMessage = {
  sender: 'ai',
  type: 'loading',
};

const type_idMap = {
  4: '测试点',
  5: '测试用例'
}

const getTypeIdText = (type_id) => {
  return Reflect.get(type_idMap, type_id)
}

const aiCreate = async (type_id: number) => {
  const {node_text} = props;
  if (type_id === 4) {
    const myMsg: Message = {
      sender: 'me',
      type: 'text',
      text: `[需求]： <br><br>[功能模块]：${type_id === 4 ? node_text : ''}<br>`
    }
    messageList.value.push(myMsg);
    messageList.value.push(loadingMessage);

    // const res = {
    //   data: [
    //     '测试备注内容输入验证',
    //     "测试备注内容长度限制",
    //     '测试备注内容保存功能',
    //     '测试备注内容显示格式',
    //     '测试备注内容编辑功能',
    //   ]
    // }
    const res = await ai({type_id, node_id: props.node_id, rules: "", test_action: ""})
    const {data} = res
    if (data?.length === 0) return
    const id = createUid()
    const aiMsg: Message = {
      id,
      sender: 'ai',
      type: 'checkbox',
      emitData: [],
      nodeData: [{
        id,
        label: `功能模块：${node_text}`,
        children: []
      }]
    }
    const type_idText = getTypeIdText(type_id)
    data.forEach((text, index) => {
      aiMsg.emitData.push({
        data: {
          text: type_idText + (index + 1) + '：' + text,
          type_id: 4
        }
      })
      aiMsg.nodeData[0].children.push({
        id,
        label: type_idText + (index + 1) + '：' + text
      })
    })
    messageList.value.pop()
    Reflect.set(messageMap, aiMsg.id, aiMsg)
    messageList.value.push(aiMsg)
  } else if (type_id === 5) {
    const myMsg: Message = {
      sender: 'me',
      type: 'text',
      text: `[需求]： <br><br>[功能模块]：<br>[场景模块]：<br>[测试点]：${type_id === 5 ? node_text : ''}<br>[领域标签]：<br>[需求背景]：<br>[生成规则]：<br>`
    }
    messageList.value.push(myMsg);
    messageList.value.push(loadingMessage);

    const aiMsg: Message = {
      id: createUid(),
      sender: 'ai',
      type: 'text',
      emitData: [],
      nodeData: [{
        text: `功能模块：+${node_text}`
      }]
    }
    const res = await ai({type_id, node_id: props.node_id, rules: "", test_action: ""})
    const {data} = res
    if (data?.length === 0) return
    data.forEach((item) => {
      const {key, val} = item;
      const {teststep, testpc, testexp} = val;
      const length = testpc.length;
      if (length !== testpc.length) {
        debugger
      }

      const c1 = teststep.map((item) => {
        return {
          data: {
            text: item,
            type_id: 6,
          }
        }
      })

      const c2 = testpc.map((item, index) => {
        return {
          data: {
            text: item,
            type_id: 7,
          },
          children: [
            {
              data: {
                text: testexp[index],
                type_id: 8,
              }
            }
          ]
        }
      })

      aiMsg.emitData.push({
        data: {
          text: key,
          type_id: 5,
        },
        children: [...c1, ...c2]
      })
    })

    emitNodeList.value = aiMsg.emitData

    let text = '';
    data.forEach((item, index) => {
      const {key, val} = item;
      const {teststep, testpc, testexp} = val;
      const length = testpc.length;
      if (length !== testpc.length) {
        debugger
      }

      text += `${index + 1}、用例名称：${key}<br>`;
      text += `前置条件：<br>`;
      teststep.forEach((item, index) => {
        text += `  ${index + 1}.${item}<br>`;
      })
      text += `测试步骤：<br>`;
      testpc.forEach((item, index) => {
        text += `  ${index + 1}.${item}<br>`;
      })
      text += `预期结果：<br>`;
      testexp.forEach((item, index) => {
        text += `  ${index + 1}.${item}<br>`;
      })
      text += '<br>'
    })

    aiMsg.nodeData.text = text;

    messageList.value.pop()
    Reflect.set(messageMap, aiMsg.id, aiMsg)
    messageList.value.push(aiMsg)
  }
}

const emitNodeList = ref<EmitNode[]>([]);

const syncToMind = (id) => {
  const activeMessage = Reflect.get(messageMap, id)
  if (activeMessage&&activeMessage.length > 0) {
    emit("addNodes", props.node_id, activeMessage)
  } else {
    ElMessage.warning('请勾选至少一个节点')
  }
}

const handleNodeClick = (clickNode, arr) => {
  const {checkedNodes, halfCheckedNodes} = arr;
  const {id,children} = clickNode;
  if (halfCheckedNodes.length === 0 && checkedNodes.length === 0) {
    //取消所有勾选
    Reflect.set(messageMap, id, []);
  } else {
    if (children) {
      //全选
      const node = children.map(({label}) => {
        return {
          data: {
            text: label,
            type_id: 4
          },
          children: []
        }
      })
      Reflect.set(messageMap, id, node)
    } else {
      //单选
      const node = checkedNodes.map(({label}) => {
        return {
          data: {
            text: label,
            type_id: 4
          },
          children: []
        }
      })
      Reflect.set(messageMap, id, node)
    }
  }
}

// 发送消息
const newMessage = ref('');
const sendMessage = () => {
  if (newMessage.value.trim()) {
    messageList.value.push({sender: 'me', text: newMessage.value.trim()});
    newMessage.value = '';
    // TODO: 通过 WebSocket 发送消息
  }
};


//内容要求 nr

const aiRuleDialogText = ref("");
const aiRuleDialogSelected = ref("");
const aiRuleIDialogShow = ref(false);
const aiRuleDialogVisible = computed(() => {
  return props.node_type_id === 4 && aiRuleIDialogShow.value;
})

const addAiRuleText = (value) => {
  aiRuleDialogText.value += value + '\n\n'
}

const trueAiRuleShow = () => {
  aiRuleIDialogShow.value = true;
  aiRuleDialogText.value = "";
}

const getCurrentTimeFormatted = () => {
  // 创建一个新的 Date 对象，表示当前时间
  const now = new Date();

  // 获取小时、分钟和秒
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // 拼接成 HH:mm:ss 格式
  return `${hours}:${minutes}:${seconds}`;
}
</script>

<template>
  <!-- 聊天消息列表 -->
  <div class="flex h-full p-4 flex-col gap-4 relative overflow-hidden " style="background: #f8f8f8;">
    <div class="flex-1 flex flex-col overflow-y-auto">
      <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-4 ">
        <div v-for="item in messageList">
          <!--我方消息-->
          <div v-if="item.sender==='me'" class="flex gap-2 h-full justify-end">
            <div class="flex flex-col w-60 gap-2">
              <span class="self-end text-sm">{{ getCurrentTimeFormatted() }}</span>
              <div class="relative">
                <div class="rounded-lg rounded-tr-none p-4 pt-6 text-white" style="background:#0075ff;box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;" v-html="item.text"></div>
                <div class="absolute rounded-tl-lg rounded-br-lg h-5 w-15 left-0 top-0 text-blue-900 text-center text-sm" style="background:#bbd3fa">助手</div>
              </div>
            </div>
            <img :src="meImage" alt="Avatar" class="w-8 h-8 rounded-full ml-2"/>
          </div>
          <!--对方消息-->
          <div v-if="item.sender==='ai'" class="flex gap-2 h-full">
            <img :src="aiImage" alt="Avatar" class="w-8 h-8 rounded-full ml-2"/>
            <div class="flex flex-col gap-2">
              <span class="text-sm">{{ getCurrentTimeFormatted() }}</span>
              <div class="rounded-lg rounded-tl-none p-4 " style="background: #f7f7f7; border: 1px solid #8ec6dd;box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;">
                <div v-if="item.type==='checkbox'" class="pr-12">
                  <el-tree
                      @check="handleNodeClick"
                      style="max-width: 600px"
                      :data="item.nodeData"
                      default-expand-all
                      show-checkbox/>
                </div>
                <div v-else-if="item.type==='text'" v-html="item.nodeData.text" class="w-max-125 pr-12 text-sm leading-6 tracking-wide"></div>
                <div v-else-if="item.type==='loading'" class="flex" style="color: #4e80ff;">
                  <el-icon class="rotating-icon" style="font-size: 20px;margin-right: 4px">
                    <Loading/>
                  </el-icon>
                  <p class="text-sm" style="color:#4e80ff">正在输入......</p>
                </div>
              </div>
              <div v-if="item.type!=='loading'" class="flex ">
                <el-button size="small" :icon="Refresh">重新搜索</el-button>
                <el-button @click="syncToMind(item.id)" size="small" :icon="Switch">同步到脑图</el-button>
                <el-button size="small" :icon="CopyDocument">拷贝</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col py-2 gap-2">
      <div class="flex gap-x-3">
        <button @click="aiCreate(5)" class="hover-transition border-1 rounded-full px-2 py-0.5  text-xs cursor-pointer">生成用例</button>
        <button @click="aiCreate(4)" class="hover-transition border-1 rounded-full px-2 py-0.5  text-xs cursor-pointer">生成测试点</button>
        <span v-if="props.node_type_id===4">|</span>
        <button v-if="props.node_type_id===4" id="rainbow-text" class="hover-transition border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600"
                @click="trueAiRuleShow">AI生成规则
        </button>
      </div>
      <div class="relative">
        <el-input class="h-12" v-model="newMessage" @keyup.enter="sendMessage"></el-input>
        <button @click="sendMessage" class="absolute w-9 h-9 bg-blue-500 rounded-lg right-1.5 top-1.5 cursor-pointer">
          <el-icon size="24px" color="#ffffff" class="mt-1.5">
            <Position/>
          </el-icon>
        </button>
      </div>
    </div>
    <!--AI生成规则-->
    <Transition>
      <div v-if="aiRuleDialogVisible" class="absolute bottom-4 bg-white border-1 rounded-md border-blue-300" style="width:calc(100% - 32px)">
        <div class="p-4 relative overflow-hidden">
          <p><b>AI生成规则</b></p>
          <div class="absolute right-4 top-4" @click="aiRuleIDialogShow=false">
            <el-icon class="">
              <Close/>
            </el-icon>
          </div>
          <div class="p-4">
            <span style="font-size: 12px;color: #b1b1b1">让AI助手依照您的特定规则来生成用例!</span>
            <el-input v-model="aiRuleDialogText" type="textarea" :autosize="{ minRows: 5, maxRows: 8 }" class="mt-4 mb-1" placeholder="给定一些规则（内容要求/方向要求），生成更有效！"></el-input>
            <div class="flex gap-2 mt-1">
              <button @click="addAiRuleText('#内容要求')" class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600">内容要求</button>
              <button @click="addAiRuleText('#方向要求')" class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600">方向要求</button>
            </div>
            <el-button type="primary" class="float-end">确认添加</el-button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(200px);
  opacity: 0;
}

:deep(.el-tree) {
  background: #f7f7f7;
  --el-tree-node-hover-bg-color: #ffffff;

  .el-checkbox__input.is-checked .el-checkbox__inner {
    --el-checkbox-checked-bg-color: #0050db;

  }
}

/* 可以在 App.vue 的 <style> 标签内，或者在全局样式文件中 */
.rotating-icon {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hover-transition {
  border-color: #cad5e2;
  transition: all 0.3s;

  &:hover {
    color: #155dfc;
    border-color: #155dfc;
  }
}

#rainbow-text {
  /* 设置背景为彩虹渐变 */
  background: linear-gradient(45deg, #ff0000, #ff00b9, #0067ff);
  /* 将文字颜色设置为透明，以便背景显示 */
  -webkit-background-clip: text;
  color: transparent;
  /* 强制背景剪裁应用于文字 */
  -webkit-text-fill-color: transparent;
}
</style>
