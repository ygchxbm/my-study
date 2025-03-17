<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import {useNodeListStore} from "@/store/useNodeListStore";
import {storeToRefs} from "pinia"

const {updateNodeList, setCheckedNodeId} = useNodeListStore();
const {nodeList} = storeToRefs(useNodeListStore());


const itemClick = async (id) => {
  await setCheckedNodeId(id);
}
onMounted(async () => {
  await updateNodeList();
  isShow.value = true;
  const id=nodeList.value[0].id
  itemClick(id)
})

const isShow = ref(false);
</script>

<template>
  <div class="w-full h-full px-3 py-2">
    <div class="h-22 mb-4 bg-white rounded-xl flex justify-center items-center text-blue-800">Demo流程演示</div>
    <el-menu default-active="1-0" :default-openeds="['1']" >
      <el-sub-menu index="1">
        <template #title>项目</template>
        <el-menu-item @click="itemClick(id)" v-for="({name,id},index) in nodeList" :key="index" :index="'1-'+index">{{ name }}</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>


</template>

<style scoped>
:deep(.el-menu ) {
  border-radius: 8px;
  background: transparent;
  border: none;

  --item-height: 40px;
  --item-radius: 8px;
  --el-menu-hover-bg-color: #dad9dc;
  --el-menu-active-color: #4e80ff;

  .el-sub-menu__title {
    height: var(--item-height);
    border-radius: var(--item-radius);
  }

  .el-menu-item {
    height: var(--item-height);
    border-radius: var(--item-radius);
    text-align: center;
  }
}
</style>
