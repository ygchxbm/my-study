<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

let isAnimate = false;
const msg = '大苏打实打实大苏打实打实大撒大撒大苏打撒大苏打实打实大苏打实打实大苏打实打实'

const rollListNode = ref<HTMLElement | null>(null);
const rollBar = (val: number) => {
  if (isAnimate) {
    return
  }
  if (rollListNode.value) {
    if (val === 1) {
      smoothScrollTo(rollListNode.value, rollListNode.value.scrollLeft + 320 * 4, 500)
    } else {
      smoothScrollTo(rollListNode.value, rollListNode.value.scrollLeft - 320 * 4, 500)
    }
    isAnimate = true;
  }
}


function smoothScrollTo(element: HTMLElement, to: number, duration: number) {
  let start = element.scrollLeft,
      change = to - start,
      currentTime = 0,
      increment = 20;

  const animateScroll = () => {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollLeft = val;
    scrollLeft.value = val
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      element.scrollLeft = to; // 确保最终位置精确
      scrollLeft.value = to;
      isAnimate = false
    }
  };

  // 简单的缓动函数
  const easeInOutQuad = function (t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  animateScroll(); // 开始动画
}

// 使用示例
// const scrollableDiv = document.getElementById('scrollableDiv');
// smoothScrollTo(scrollableDiv, 500, 1000); // 滚动到scrollLeft为500的位置，动画时长1000毫秒

const hRollNode = ref<HTMLElement | null>(null);
onMounted(() => {
  if (hRollNode.value) {
  }
})


const scrollLeft = ref<number>(0)

watch(scrollLeft, (newVal) => {
  if (hRollNode.value) {
    if (newVal <= 0) {
      hRollNode.value.style.setProperty('--left-btn-opacity', '0')
    } else if (newVal >= 2560) {
      hRollNode.value.style.setProperty('--right-btn-opacity', '0')
    } else {
      hRollNode.value.style.setProperty('--left-btn-opacity', '0.9')
      hRollNode.value.style.setProperty('--right-btn-opacity', '0.9')
    }

  }
}, {immediate: true})

const hoverText = ref<HTMLElement | null>(null);
const rollItemOver = (e: Event, val: number) => {
  if (isAnimate) {
    return
  }
  if (hoverText.value && e.target && hRollNode.value) {
    hoverText.value.style.opacity = '1';
    hoverText.value.style.top = ((e.target as HTMLElement)?.offsetTop + (e.target as HTMLElement).offsetHeight + 30).toString() + 'px';
    debugger
    hoverText.value.style.left = ((e.target as HTMLElement).getBoundingClientRect().left - hRollNode.value.getBoundingClientRect().left).toString() + 'px';
    hoverText.value.innerText = val + msg;
  }
}

const rollItemOut = (e: Event) => {
  if (hoverText.value && e.target) {
    hoverText.value.style.opacity = '0';
  }
}
</script>

<template>
  <div class="main">
    <div class="dialog">
      <div ref="hRollNode" class="h-roll">
        <ul ref="rollListNode" class="roll-list">
          <li @mouseover="rollItemOver($event,item)" @mouseout="rollItemOut($event)" class="roll-item" v-for="item in 10">{{ item + msg }}</li>
        </ul>
        <button class="left-btn" @click="rollBar(0)"><</button>
        <button class="right-btn" @click="rollBar(1)">></button>
        <div ref="hoverText" class="hover-text">123123</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .dialog {
    width: 1280px;
    height: 50%;
    background-color: #f8f8f8;

    .h-roll {
      height: 100px;
      width: 100%;
      transition: all 1s;
      position: relative;
      --left-btn-opacity: 0;
      --right-btn-opacity: 0.9;

      .roll-list {
        margin: 0;
        padding: 0;
        height: 100%;
        list-style: none;
        display: flex;
        overflow-y: hidden;
        overflow-x: auto;
        flex-wrap: nowrap;
        align-items: center;

        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */

        ::-webkit-scrollbar {
          display: none;
        }

        .roll-item {
          height: 90px;
          width: 300px;
          background-color: #e7e7e7;
          flex-shrink: 0;
          border-radius: 5px;
          padding: 10px;
          box-sizing: border-box;
          margin: 0 10px;

          &:hover {
            cursor: pointer;
            outline: 2px solid black;
          }
        }
      }

      .left-btn {
        left: 10px;
      }

      .right-btn {
        right: 10px;
      }

      button {
        background-color: #ffffff;
        opacity: 0;
        width: 40px;
        height: 40px;
        padding: 5px;
        border-radius: 50%;
        outline: none;
        border: none;
        box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
        position: absolute;
        top: calc(50% - 20px);
      }

      .hover-text {
        width: 300px;
        border: 1px solid black;
        padding: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        transition: opacity 0.5s;

        &::before {
          content: ""; /* 必须设置内容，否则伪元素不会显示 */
          position: absolute; /* 绝对定位 */
          top: -10px; /* 将三角形向上移动，使其位于div上方 */
          left: 50%; /* 三角形中心点与div中心点对齐 */
          transform: translateX(-50%); /* 向左移动自身宽度的一半，以确保三角形居中对齐 */
          width: 0; /* 宽度为0 */
          height: 0; /* 高度为0 */
          border-left: 10px solid transparent; /* 左边框透明 */
          border-right: 10px solid transparent; /* 右边框透明 */
          border-bottom: 10px solid #949494; /* 底边框为实色，形成三角形 */
        }
      }

      &:hover {
        .left-btn {
          opacity: var(--left-btn-opacity);
        }

        .right-btn {
          opacity: var(--right-btn-opacity);
        }

        button {
          transition: opacity 0.5s;
        }
      }
    }




  }
}
</style>
