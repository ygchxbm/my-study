<script setup lang="ts">
import jsMind from 'jsmind'
import 'jsmind/draggable-node'
import 'jsmind/style/jsmind.css'
import {onMounted, ref} from "vue";

const jsmind_container = ref()

const jsmind_options = {
  editable: true,
  theme: 'success',
  container: jsmind_container.value
}
const jsmind_data = {
  meta: {
    name: 'jsMind sample',
    author: 'hizzgdev@163.com',
    version: '0.8.1',
  },
  format: 'node_tree',
  data: {
    id: 'root',
    topic: 'jsMind',
    children: [
      {
        id: 'easy',
        topic: 'Easy',
        direction: 'left',
        children: [
          {id: 'easy1', topic: 'Easy to show'},
          {id: 'easy2', topic: 'Easy to edit'},
          {id: 'easy3', topic: 'Easy to store'},
          {id: 'easy4', topic: 'Easy to embed'},
          {
            'id': 'other3',
            'background-image':
                'https://hizzgdev.github.io/jsmind/example/ant.png',
            'width': '100',
            'height': '100',
          },
        ],
      },
      // {
      //   id: 'open',
      //   topic: 'Open Source',
      //   direction: 'right',
      //   children: [
      //     {
      //       'id': 'open1',
      //       'topic':
      //           '<a href="https://github.com/hizzgdev/jsmind" target="_blank">on GitHub</a>',
      //       'background-color': '#eee',
      //       'foreground-color': 'blue',
      //     },
      //     {id: 'open2', topic: 'BSD License'},
      //   ],
      // },
      // {
      //   id: 'powerful',
      //   topic: 'Powerful',
      //   direction: 'right',
      //   children: [
      //     {id: 'powerful1', topic: 'Base on Javascript'},
      //     {id: 'powerful2', topic: 'Base on HTML5'},
      //     {id: 'powerful3', topic: 'Depends on you'},
      //   ],
      // },
      // {
      //   id: 'other',
      //   topic: 'test node',
      //   direction: 'left',
      //   children: [],
      // },
    ],
  },
}

onMounted(() => {
  let options = Object.assign(jsmind_options, {
    container: jsmind_container.value,
    editable: true, // 启用编辑功能,
    theme:'primary',
    view:{
      engine: 'canvas',
      draggable: true, // 启用拖动画布功能
      hide_scrollbars_when_draggable: true // 启用拖动时隐藏滚动条
    }

  });
  let jm = new jsMind(options);
  jm.show(jsmind_data);
})
</script>

<template>
  <div ref="jsmind_container" class="jsmind-container"></div>
</template>
<style scoped>
.jsmind-container {
  width: 1024px;
  height: 700px;
  border: solid 1px #ccc;
}
</style>
