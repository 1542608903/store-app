<script setup>
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store';
import { changePassword } from 'src/api/user';

// 组件
import NoData from 'src/components/NoData.vue';
import UserCard from 'src/components/user/UserCard.vue';
import MyDialog from 'src/components/MyDialog.vue';

const reuter = useRouter();
const userStore = useUserStore();
const isDialog = ref(false);

function go() {
  reuter.push('/');
}

function onDialog() {
  isDialog.value = true
}

onMounted(() => {

})
async function onConfirm(data) {
  if (!data.old_password && !data.new_password && !data.confirm_password) {
    return Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      position: 'top',
      message: '密码不能为空'
    })
  }
  isDialog.value = false
  const { old_password, new_password } = data
  await changePassword({ old_password, new_password }).then(res => {
    if (res.code === 0) {
      Notify.create({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        position: 'top',
        message: res.message
      })
    } else {
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        position: 'top',
        message: res.message
      })
    }
    data = undefined
  }).catch(err => {
    Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      position: 'top',
      message: '网络错误'
    })
    throw err
  })
}
function onCancel() {
  isDialog.value = false
}
</script>
<template>
  <q-page v-if="userStore.isLogin">
    <UserCard :user="userStore.userInfo" @on:confirm="onDialog" />
  </q-page>
  <NoData message="没有登录" icon="fa-solid fa-user" @confirm="go" button-text="去首页" v-else />
  <MyDialog :is-dialog="isDialog" dialog-title="修改密码" @on-cancel="onCancel" @on-confirm="onConfirm" />
</template>
<style scoped>
.my-card {
  margin: 0 auto;
}
</style>
