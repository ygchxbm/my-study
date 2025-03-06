<script setup lang="ts">
import MindElixir from "mind-elixir";
import example from "mind-elixir/example";
import {onMounted, ref} from "vue";

const me = ref();
let data = MindElixir.new('游戏组队')
console.log(data)

let addNodeId: string = '';
onMounted(() => {
  me.value = new MindElixir({
    el: "#map",
    direction: MindElixir.RIGHT,
    locale:'zh_CN'
    // before: {
    //   insertSibling(el, obj) {
    //     console.log(el, obj)
    //     if (this.currentNode.nodeObj?.parent?.root) {
    //       return false
    //     }
    //     return true
    //   },
    //   async addChild(el, obj) {
    //     console.log(this.currentNode.nodeObj)
    //     addNodeId=this.currentNode.nodeObj.id
    //     if (this.currentNode.nodeObj?.parent?.root) {
    //       return false
    //     }
    //     return false
    //   },
    // },
  });
  me.value.init(example);

  me.value.bus.addListener('selectNode', (operation) => {
    addNodeId = operation.id;
    console.log(addNodeId)
  })
});


const addChild = () => {
  me.value.addChild(MindElixir.E(addNodeId), {
    topic: '新增节点'
  })
}

const refreshData = () => {
  me.value.refresh(MindElixir.new('刷新节点'))
}
</script>

<template>
  <div id="map"></div>
  <div>
    <div class="btnS">
      <button @click="addChild">addChild</button>
      <button @click="refreshData">refresh</button>
    </div>
  </div>
</template>

<style scoped>
#map {
  height: 500px;
  width: 100%;
}

.btnS {
  margin-top: 1em;
  display: flex;
  gap: 1em;

  button {
    background: #bababa;
  }
}
</style>
