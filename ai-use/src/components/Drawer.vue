<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import {Position, Close} from '@element-plus/icons-vue'
import aiImage from "@/assets/image/AI.png"
import meImage from "@/assets/image/me.png"

const props = defineProps(['drawerVisible'])
// watch(props, (newVal, oldVal) => {
//   if(!newVal.drawerVisible){
//     nrVisible.value=false
//   }
// })

//与AI聊天框 lt
const messages = ref([
  {sender: 'other', text: '你好！', avatar: aiImage},
  {sender: 'me', text: '你好，有什么可以帮你的？', avatar: meImage},
]);
// 新消息
const newMessage = ref('');

// 发送消息
const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({sender: 'me', text: newMessage.value.trim()});
    newMessage.value = '';
    // TODO: 通过 WebSocket 发送消息
  }
};
// 模拟接收消息
const receiveMessage = (text) => {
  messages.value.push({sender: 'other', text, avatar: aiImage});
};

// 模拟 WebSocket 接收消息
onMounted(() => {
  setTimeout(() => {
    receiveMessage('这是一个模拟的回复消息。');
  }, 2000);
});


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
</script>

<template>
  <!-- 聊天消息列表 -->
  <div class="flex h-full p-4 flex-col gap-4 relative overflow-hidden bg-gray-100">
    <div class="flex-1 flex flex-col h-screen">
      <div class="flex-1 p-4 overflow-y-auto">
        <div v-for="(message, index) in messages" :key="index" class="mb-4">
          <div :class="['flex',message.sender === 'me' ? 'justify-end' : 'justify-start']" class="items-center">
            <!-- 接收方头像 -->
            <img
                v-if="message.sender === 'other'"
                :src="message.avatar"
                alt="Avatar"
                class="w-8 h-8 rounded-full mr-2"
            />
            <!-- 消息气泡 -->
            <div :class="['max-w-[70%] p-3 rounded-lg',message.sender === 'me'? 'bg-blue-500 text-white': 'bg-gray-200 text-gray-800',]">
              {{ message.text }}
            </div>

            <!-- 发送方头像 -->
            <img
                v-if="message.sender === 'me'"
                :src="message.avatar"
                alt="Avatar"
                class="w-8 h-8 rounded-full ml-2"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col py-2 gap-2">
      <div class="flex gap-x-3">
        <button class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600">生成用例</button>
        <button class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600">生成测试点</button>
        <span>|</span>
        <button class="border-1 rounded-full px-2 py-0.5 border-slate-300 text-xs cursor-pointer hover:text-blue-600" @click="trueNrVisible">AI生成规则</button>
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
</style>
