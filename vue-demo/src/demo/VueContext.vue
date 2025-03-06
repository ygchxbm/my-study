<script setup lang="ts">
import {ref} from "vue";
import { ContextMenu, ContextMenuGroup, ContextMenuSeparator, ContextMenuItem } from '@imengyu/vue3-context-menu';

const show = ref(false)
const optionsComponent = ref({
  zIndex: 3,
  minWidth: 230,
  x: 500,
  y: 200
})
const onButtonClick = (e: MouseEvent) => {
  show.value = true;
  optionsComponent.value.x = e.x;
  optionsComponent.value.y = e.y;
}
const onMenuClick=(v)=>{
  console.log(v)
}
</script>

<template>
  <context-menu
      v-model:show=show
      :options=optionsComponent
  >
    <context-menu-item label="Simple item" @click="onMenuClick(1)" />
    <context-menu-sperator /><!--use this to add sperator-->
    <context-menu-group label="Menu with child">
      <context-menu-item label="Item1" @click="onMenuClick(2)" />
      <context-menu-item label="Item2" @click="onMenuClick(3)" />
      <context-menu-group label="Child with v-for 50">
        <context-menu-item v-for="index of 50" :key="index" :label="'Item3-'+index" @click="onLoopMenuClick(index)" />
      </context-menu-group>
    </context-menu-group>
  </context-menu>
  <button @click="onButtonClick">click</button>
</template>

<style scoped>

</style>
