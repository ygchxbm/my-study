<script setup lang="ts">
import { ref} from 'vue'
import {Close, CopyDocument, Loading, Position, Refresh, Switch} from '@element-plus/icons-vue'
import aiImage from "@/assets/image/AI.png"
import meImage from "@/assets/image/me.png"
import {ElMessage} from "element-plus";

const emit = defineEmits<{
  (e: 'addNodes', type_id: number, texts: string[]): void;
}>();

const props = defineProps<{
  drawerType: number;
  drawerVisible: boolean;
  node_id: number|undefined;
  node_text: string;
}>()


const newMessage = ref('');

// 发送消息
const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({sender: 'me', text: newMessage.value.trim()});
    newMessage.value = '';
    // TODO: 通过 WebSocket 发送消息
  }
};

//内容要求 nr
const nrValue = ref('')
const nrVisible = ref(false)
const trueNrVisible = () => {
  nrVisible.value = true
  nrValue.value = ''
}
const falseNrVisible = () => {
  nrVisible.value = false
}

const addNrValue = (value) => {
  nrValue.value += value + '\n\n'
}

const activeTypeId = ref(0);
const activeNodeTexts = ref<string[]>([]);

const createAi = async (type_id: number) => {
  activeTypeId.value = type_id;
  const {node_id, node_text} = props;
  if (!node_id || !node_text) return;
  const msg = {sender: 'me', text: ""};
  if (type_id === 4) {
    msg.text = `[需求]： <br><br>[功能模块]：${node_text}`
  } else if (type_id === 5) {
    msg.text = ""
  }
  messages.value.push(msg);

  messages.value.push({
    sender: 'other',
    type: 'loading',
  })

  // const res = await ai({type_id, node_id})
  // if (!res?.data?.length === 0) return
  // messages.value.pop()
  // const {data} = res
  // const obj = {
  //   sender: 'other',
  //   type: 'checkbox',
  //   data: [
  //     {
  //       id: 0,
  //       label: node_text,
  //       children: []
  //     }
  //   ]
  // }
  //
  // data.forEach((item, index) => {
  //   obj.data[0].children.push({
  //     id: index + 1,
  //     label: item
  //   })
  // })
  // messages.value.push(obj)

  setTimeout(() => {
    messages.value.pop()
    const res = {
      code: 0,
      data: ["新节点2创建功能测试", "新备注输入验证测试", "新备注保存与显示测试", "新节点2与现有节点关联测试", "新备注字符长度边界测试", "新备注特殊字符处理测试", "新节点2删除功能测试", "新备注编辑与更新测试", "新节点2权限控制测试", "新备注数据存储完整性测试"]
    }
    const {data} = res
    if (data?.length === 0) return
    const obj = {
      sender: 'other',
      type: 'checkbox',
      data: [
        {
          id: 0,
          label: "功能模块：好友组队功能",
          children: []
        }
      ]
    }

    data.forEach((item, index) => {
      obj.data[0].children.push({
        id: index + 1,
        label: item
      })
    })
    messages.value.push(obj)
    console.log(messages.value)
  }, 300)
}

const syncToMind = () => {
  if (activeNodeTexts.value.length > 0) {
    emit("addNodes", activeTypeId.value, activeNodeTexts.value)
  } else {
    ElMessage.warning('请勾选至少一个节点')
  }
}

const messages = ref([]);

const defaultProps = {
  children: 'children',
  label: 'label',
}

const handleNodeClick = (a, b) => {
  const {checkedNodes} = b;
  activeNodeTexts.value = checkedNodes.filter(({id}) => {
    return id
  }).map(({label}) => {
    return label
  });
}

const getCurrentTimeFormatted=()=> {
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
    <div class="flex-1 flex flex-col h-screen">
      <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        <div v-for="item in messages">
          <!--我方消息-->
          <div v-if="item.sender==='me'" class="flex gap-2 h-full justify-end">
            <div class="flex flex-col w-60 gap-2">
              <span class="self-end text-sm">{{getCurrentTimeFormatted()}}</span>
              <div class="relative">
                <div class="rounded-lg rounded-tr-none p-4 pt-6 text-white" style="background:#0075ff;box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;" v-html="item.text"></div>
                <div class="absolute rounded-tl-lg rounded-br-lg h-5 w-15 left-0 top-0 text-blue-900 text-center text-sm" style="background:#bbd3fa">助手</div>
              </div>
            </div>
            <img :src="meImage" alt="Avatar" class="w-8 h-8 rounded-full ml-2"/>
          </div>
          <!--对方消息-->
          <div v-if="item.sender==='other'" class="flex gap-2 h-full">
            <img :src="aiImage" alt="Avatar" class="w-8 h-8 rounded-full ml-2"/>
            <div class="flex flex-col gap-2">
              <span class="text-sm">{{getCurrentTimeFormatted()}}</span>
              <div class="rounded-lg rounded-tl-none p-4 " style="background: #f7f7f7; border: 1px solid #8ec6dd;box-shadow: rgba(0, 0, 0, 0.16) 0 1px 4px;">
                <div v-if="item.type==='checkbox'" class="pr-12">
                  <el-tree
                      @check="handleNodeClick"
                      style="max-width: 600px"
                      :data="item.data"
                      :props="defaultProps"
                      default-expand-all
                      show-checkbox/>
                </div>
                <div v-else-if="item.type==='loading'" class="flex" style="color: #4e80ff;">
                  <el-icon class="rotating-icon" style="font-size: 20px;margin-right: 4px">
                    <Loading/>
                  </el-icon>
                  <p class="text-sm" style="color:#4e80ff">正在输入......</p>
                </div>
              </div>
              <div v-if="item.type!=='loading'" class="flex ">
                <el-button size="small" :icon="Refresh">重新搜索</el-button>
                <el-button @click="syncToMind" size="small" :icon="Switch">同步到脑图</el-button>
                <el-button size="small" :icon="CopyDocument">拷贝</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col py-2 gap-2">
      <div class="flex gap-x-3">
        <button @click="createAi(5)" class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600">生成用例</button>
        <button @click="createAi(4)" class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600">生成测试点</button>
        <span v-if="drawerType===1">|</span>
        <button v-if="drawerType===1" class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600" @click="trueNrVisible">AI生成规则</button>
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
      <div v-if="nrVisible" class="w-full  absolute bottom-0 bg-white border-1 rounded-md border-blue-300">
        <div class="p-4 relative overflow-hidden">
          <p><b>AI生成规则</b></p>
          <div class="absolute right-4 top-4" @click="falseNrVisible">
            <el-icon class="">
              <Close/>
            </el-icon>
          </div>
          <div class="p-4">
            <span style="font-size: 12px;color: #b1b1b1">让AI助手依照您的特定规则来生成用例!</span>
            <el-input v-model="nrValue" type="textarea" :autosize="{ minRows: 5, maxRows: 8 }" class="mt-4 mb-1" placeholder="给定一些规则（内容要求/方向要求），生成更有效！"></el-input>
            <div class="flex gap-2 mt-1">
              <button @click="addNrValue('#内容要求')" class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600">内容要求</button>
              <button @click="addNrValue('#方向要求')" class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600">方向要求</button>
            </div>
            <el-button type="primary" class="float-end">复用上次内容</el-button>
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
</style>
