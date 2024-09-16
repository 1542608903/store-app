<template>
  <div class="q-pa-md login-register-container">
    <!-- 登录表单 -->
    <q-form v-if="registerFormVisible" @submit="onSubmit('login')" @reset="onReset" class="q-gutter-md login-form">
      <q-input filled v-model="userForm.user_name" type="text" label="账号 *" lazy-rules
        :rules="[val => !!val || '请输入账号']" />

      <q-input filled type="password" v-model="userForm.password" label="密码 *" lazy-rules
        :rules="[val => !!val && val.length >= 6 || '请输入至少6位密码']" />

      <q-toggle v-model="accept" label="我接受许可和条款" />

      <div class="q-gutter-md row justify-between">
        <q-btn label="登录" type="submit" color="primary" />
        <q-btn label="清空" type="reset" color="primary" flat />
        <q-btn label="去注册" @click="showRegisterForm" color="primary" flat />
      </div>
    </q-form>

    <!-- 注册表单 -->
    <q-form v-else @submit="onSubmit('register')" @reset="onReset" class="q-gutter-md register-form">
      <q-input filled v-model="userForm.user_name" type="text" label="账号 *" lazy-rules
        :rules="[val => !!val || '请输入账号']" />
      <q-input filled v-model="userForm.email" type="email" label="邮箱 *" lazy-rules
        :rules="[val => !!val && /.+@.+\..+/.test(val) || '请输入正确的邮箱地址']" />
      <q-input filled v-model="userForm.nick_name" type="text" label="名称 *" lazy-rules
        :rules="[val => !!val || '请输入名称']" />
      <q-input filled type="password" v-model="userForm.password" label="密码 *" lazy-rules
        :rules="[val => !!val && val.length >= 6 || '请输入至少6位密码']" />
      <q-input filled type="password" v-model="userForm.confirm_password" label="再次输入密码 *" lazy-rules
        :rules="[val => !!val && val === userForm.password || '两次输入的密码不匹配']" />

      <q-toggle v-model="accept" label="我接受许可和条款" />

      <div class="q-gutter-md row justify-between">
        <q-btn label="注册" type="submit" color="primary" />
        <q-btn label="清空" type="reset" color="primary" flat />
        <q-btn label="去登录" @click="showRegisterForm" color="primary" flat />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { loginData } from 'src/types/user'
import { useRouter } from 'vue-router'
import { login, register } from 'src/api/user'
import { useUserStore } from 'src/stores/user-store';
import { IUser } from 'src/types/user';
import { saveToken } from 'src/utils/saveToken';

export default {
  setup() {
    const $q = useQuasar()
    const registerFormVisible = ref(true)
    const router = useRouter()
    const userStore = useUserStore()

    // 表单数据
    const userForm = reactive<loginData>({
      user_name: '',
      password: '',
      confirm_password: '',
      nick_name: '',
      email: ''
    })
    const accept = ref(false)

    // 提交表单处理
    const onSubmit = async (formType: 'login' | 'register') => {
      if (!accept.value) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: '您需要首先接受许可和条款'
        })
        return
      }

      if (formType === 'login') {
        await login(userForm).then((res) => {
          if (res.code === 0) {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: res.message,
              position: 'top',
            })
            // 保存用户信息
            userStore.saveUserInfo(res.result.user as IUser);
            saveToken('accessToken', res.result.accessToken as string);
            saveToken('rfreshToken', res.result.rfreshToken as string);
            // 跳转首页
            router.push('/');
          } else {
            $q.notify({
              type: 'negative',
              message: res.message,
              position: 'top',
            })
          }
        }).catch((err) => {
          $q.notify({
            type: 'negative',
            message: err.message
          })
        })
      } else if (formType === 'register') {
        await register(userForm).then((res) => {
          if (res.code === 0) {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: res.message,
              position: 'top',
            })
            // 跳转首页页
            router.push('/');
          } else {
            $q.notify({
              type: 'negative',
              message: res.message,
              position: 'top',
            })
          }
        }).catch((err) => {
          $q.notify({
            type: 'negative',
            message: err.message,
            position: 'top',
          })
        })
      }
    }

    // 重置表单
    const onReset = () => {
      userForm.user_name = ''
      userForm.password = ''
      userForm.confirm_password = ''
      userForm.nick_name = ''
      userForm.email = ''
      accept.value = false
    }

    // 显示注册表单
    const showRegisterForm = () => {
      registerFormVisible.value = !registerFormVisible.value
    }

    return {
      userForm,
      accept,
      onSubmit,
      onReset,
      registerFormVisible,
      showRegisterForm,
      userStore,
    }
  }
}
</script>

<style scoped>
/* 设置背景图 */
.login-register-container {
  position: absolute;
  right: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: url('/src/assets/img/login-bg.jpg') no-repeat center center;
  background-size: cover;
  color: #fff;
  /* 确保文字在背景图上可读 */
}

/* 设置表单的最大宽度 */
.login-form,
.register-form {
  width: 100%;
  max-width: 400px;
  /* 半透明背景色增加可读性 */
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 10px;
}

/* 控制按钮的最小宽度 */
.q-btn {
  min-width: 100px;
}

/* 控制每个按钮之间的间距 */
.row {
  margin-top: 15px;
}
</style>
