<script setup lang="ts">
import Header from "@/layout/Header.vue";
import Aside from "@/layout/Aside.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Aside/>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  width: 100%;
  height: 100%;

  .el-container {
    width: 100%;
    height: 100%;
  }

  .el-header {
    padding: 0;
  }

  .el-main {
    padding: 0;
  }
}

</style>
