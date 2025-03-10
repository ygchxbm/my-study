<script setup lang="ts">
import {useUserStore} from "@/store/useUserStore"
import {useRouter} from "vue-router"

const router = useRouter()
const {removeUser, removeToken} = useUserStore()
const logOut = async () => {
  removeUser()
  removeToken()
  router.push('/login')
}
</script>

<template>
  <div class="h-full flex justify-end items-center" style="background: #2f3d70;">
    <div class="mr-10">
      <el-dropdown placement="bottom-start">
        <el-button> 用户</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>

</style>
