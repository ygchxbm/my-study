<script setup lang="ts">
import {watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {login} from "@/api";
import {useUserStore} from "@/store/useUserStore"

const {VITE_APP_OASIS_HOST, VITE_APP_OASIS_CLIENT_ID, VITE_APP_BASE_HOST} = import.meta.env;
const redirectUrl = import.meta.env.MODE == 'development' ? VITE_APP_BASE_HOST : `${window.origin}/Login`
const route = useRoute();
const router = useRouter();

const {getUser, setUser, removeUser} = useUserStore()


const onSubmit = async (code: any) => {
  if (!code) return;
  const res = await login({
    code: code,
    redirect_uri: redirectUrl
  })
  // const res = {
  //   code: 0,
  //   data: {
  //     access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MTI0NTc4MCwianRpIjoiMzA5YzZmNDgtNGNhMi00NGU2LTk3OTMtMDU1NGMzMzgwYjNkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJvYXNpc19vcGVuaWQiOiJvQzJEQzY1NzFOS0pDTVpZNVEwVkNRMFJETlpMRU1HIiwiYmlydGhkYXRlIjpudWxsLCJlbWFpbCI6Imh1Z2hAbGlnaHRwYXcuY29tIiwiZW1haWxfdmVyaWZpZWQiOm51bGwsImZhbWlseV9uYW1lIjpudWxsLCJnZW5kZXIiOm51bGwsImdpdmVuX25hbWUiOm51bGwsImxvY2FsZSI6bnVsbCwibWlkZGxlX25hbWUiOm51bGwsIm5hbWUiOm51bGwsInBob25lX251bWJlciI6bnVsbCwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpudWxsLCJwaWN0dXJlIjpudWxsLCJwcmVmZXJyZWRfdXNlcm5hbWUiOm51bGwsInByb2ZpbGUiOm51bGwsInN1YiI6Im9DMkRDNjU3MU5LSkNNWlk1UTBWQ1EwUkROWkxFTUciLCJvYXNpc191cGRhdGVkX2F0IjpudWxsLCJ3ZWJzaXRlIjpudWxsLCJ6b25laW5mbyI6bnVsbCwicm9sZV9pZCI6bnVsbCwiaWQiOjIsImNyZWF0ZWRfYXQiOiJUaHUsIDA2IE1hciAyMDI1IDA2OjMyOjE0IEdNVCIsInVwZGF0ZWRfYXQiOiJUaHUsIDA2IE1hciAyMDI1IDA2OjMyOjE0IEdNVCIsImRlbGV0ZWRfYXQiOm51bGx9LCJuYmYiOjE3NDEyNDU3ODAsImNzcmYiOiIzZWU2MmM2MS0xZTc4LTQ3NDAtYWNmNC0yYzkzNDU1ZGQyOTIiLCJleHAiOjE3NDE4NTA1ODB9.e1xbuf-9TfjJk71z0vLf7Yf3hccDpHkZ8FAVxMbeJrk",
  //     expires_in: 1741729620,
  //     userInfo: {
  //       id: 2, email: "hugh@lightpaw.com", oasis_openid: "oC2DC6571NKJCMZY5Q0VCQ0RDNZLEMG"
  //     }
  //   },
  //   message: ''
  // }
  if (res?.data.userInfo) {
    setUser(res.data.userInfo)
    await router.push('/')
  }
};

const oasisLogin = () => {
  const date = Date.now();
  location.href = `${VITE_APP_OASIS_HOST}/oauth2/auth?client_id=${VITE_APP_OASIS_CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=openid+offline&state=xgamebeauty${date}`;
};

watch(
    () => route.query.code,
    (newValue, oldValue) => {
      if (!newValue) return
      onSubmit(newValue);
    },
    {
      immediate: true,
    }
);
</script>

<template>
  <div class="w-screen h-screen bg-gray-800 grid justify-center">
    <div class="w-100 mt-100">
      <h3 class="text-2xl font-semibold text-gray-100 text-center mb-6">
        系统登陆
      </h3>
      <el-form label-position="right" label-width="80px">
        <el-form-item class="mb-6 -ml-20">
          <el-button type="primary" class="w-full" @click="oasisLogin">Oasis Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>

</style>
