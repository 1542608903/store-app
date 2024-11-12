<template>
  <div class="login-register-container">
    <!-- 登录表单 -->
    <q-form v-if="isLonigForm" @submit="onSubmit('login')" class="login-form">
      <div class="logo-container">
        <!-- <span>logo</span> -->
      </div>
      <q-input
        filled
        v-model="userForm.user_name"
        type="text"
        label="账号 *"
        lazy-rules
        :rules="[(val) => !!val || '请输入账号']"
      />

      <q-input
        filled
        type="password"
        v-model="userForm.password"
        label="密码 *"
        lazy-rules
        :rules="[(val) => (!!val && val.length >= 6) || '请输入至少6位密码']"
      />
      <div class="code-container">
        <q-input
          dense
          type="text"
          v-model="userForm.code"
          label="验证码 *"
          lazy-rules
          :rules="[(val) => !!val || '请输入四位验证码']"
          style="max-width: 120px"
        />
        <div class="code" v-html="code" @click="getCaptchaSvg"></div>
      </div>
      <!-- <q-toggle v-model="accept" label="我接受许可和条款" /> -->
      <div class="accept-box">
        <q-checkbox v-model="accept" />
        <span @click="acceptRef?.open()">阅读许可和条款</span>
      </div>

      <div>
        <q-btn label="登录" type="submit" color="primary" />
        <q-btn label="去注册" @click="showRegisterForm" color="primary" flat />
      </div>
    </q-form>

    <!-- 注册表单 -->
    <q-form v-else @submit="onSubmit('register')" class="register-form">
      <div class="logo-container">
        <!-- <span>logo</span> -->
      </div>
      <q-input
        filled
        v-model="userForm.user_name"
        type="text"
        label="账号 *"
        lazy-rules
        :rules="[(val) => !!val || '请输入账号']"
      />
      <q-input
        filled
        v-model="userForm.email"
        type="email"
        label="邮箱 *"
        lazy-rules
        :rules="[
          (val) => (!!val && /.+@.+\..+/.test(val)) || '请输入正确的邮箱地址',
        ]"
      />
      <q-input
        filled
        v-model="userForm.nick_name"
        type="text"
        label="名称 *"
        lazy-rules
        :rules="[(val) => !!val || '请输入名称']"
      />
      <q-input
        filled
        type="password"
        v-model="userForm.password"
        label="密码 *"
        lazy-rules
        :rules="[(val) => (!!val && val.length >= 6) || '请输入至少6位密码']"
      />
      <q-input
        filled
        type="password"
        v-model="userForm.confirm_password"
        label="再次输入密码 *"
        lazy-rules
        :rules="[
          (val) =>
            (!!val && val === userForm.password) || '两次输入的密码不匹配',
        ]"
      />
      <div class="code-container">
        <q-input
          dense
          type="text"
          v-model="userForm.code"
          label="验证码 *"
          lazy-rules
          :rules="[(val) => !!val || '请输入四位验证码']"
          style="max-width: 120px"
        />
        <div class="code" v-html="code" @click="getCaptchaSvg"></div>
      </div>
      <!-- <q-toggle v-model="accept" label="我接受许可和条款" /> -->
      <div class="accept-box">
        <q-checkbox v-model="accept" />
        <span @click="acceptRef?.open()">阅读许可和条款</span>
      </div>

      <div class="row">
        <q-btn label="注册" type="submit" color="primary" />
        <q-btn label="去登录" @click="showRegisterForm" color="primary" flat />
      </div>
    </q-form>
  </div>
  <MyDialog
    ref="acceptRef"
    title="用户协议"
    icon="lightbulb_outline"
    @submit="(accept = true), acceptRef?.close()"
    @cancel="(accept = false), acceptRef?.close()"
  >
    <template v-slot:content>
      <span style="padding: 2px">
        <p class="accept-content">
          <span>(一)、本产品用于参考目的，不对任何损失负责。</span>
          <br />
          <span>(二)、不提供任何保证或担保。</span>
          <br />
          <span>(三)、 您理解并接受所有风险。</span>
        </p>
      </span>
    </template>
  </MyDialog>
</template>

<script lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { loginData } from 'src/types/user';
import { useRouter } from 'vue-router';
// 接口
import { login, register } from 'src/api/user';
import { getCaptcha, ICode } from 'src/api/captcha';

import { useUserStore } from 'src/stores/user-store';
import { IUser } from 'src/types/user';
import { saveToken } from 'src/utils/saveToken';
import type { Notify } from 'src/types';
import MyDialog from 'src/components/MyDialog.vue';
import { Dialog } from 'src/types/index';
export default {
  components: {
    MyDialog,
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const userStore = useUserStore();
    const acceptRef = ref<Dialog | null>(null);
    const isLonigForm = ref(true);
    const accept = ref(false);
    const code = ref('');
    // 表单数据
    const userForm = reactive<loginData>({
      user_name: 'admin',
      password: 'admin123',
      confirm_password: '',
      nick_name: '',
      email: '',
      code: '',
      codeKey: '',
    });

    function notifyUser(
      message: string,
      color: string = 'green-4',
      icon: string = 'fa-regular fa-circle-check',
      position: Notify = 'top'
    ) {
      $q.notify({
        message,
        color,
        position,
        icon,
      });
    }

    onMounted(async () => {
      getCaptchaSvg();
    });

    const getCaptchaSvg = async () => {
      const res = await getCaptcha();
      const result = res.result as ICode;
      code.value = result.code;
      userForm.codeKey = result.codeKey;
    };

    // 提交表单处理
    const onSubmit = async (formType: 'login' | 'register') => {
      if (!accept.value) {
        notifyUser(
          '您需要首先接受许可和条款',
          'red-5',
          'fa-solid fa-circle-exclamation'
        );
        return;
      }
      if (formType === 'login') {
        const { user_name, password, codeKey, code } = userForm;
        await login(user_name, password, codeKey as string, code as string)
          .then((res) => {
            if (res.code === 0) {
              notifyUser(res.message);
              // 保存用户信息
              userStore.saveUserInfo(res.result?.user as IUser);
              saveToken('accessToken', res.result?.accessToken as string);
              saveToken('rfreshToken', res.result?.refreshToken as string);

              // 跳转到首页
              router.push('/');
            } else {
              getCaptchaSvg();
              notifyUser(
                res.message,
                'red-5',
                'fa-solid fa-circle-exclamation'
              );
            }
          })
          .catch((err) => {
            getCaptchaSvg();
            notifyUser(
              err.response.data.message,
              'red-5',
              'fa-solid fa-circle-exclamation'
            );
          });
      } else if (formType === 'register') {
        await register(userForm)
          .then((res) => {
            if (res.code === 0) {
              notifyUser(res.message);
              isLonigForm.value = true;
            } else {
              getCaptchaSvg();
              notifyUser(
                res.message,
                'red-5',
                'fa-solid fa-circle-exclamation'
              );
            }
          })
          .catch((err) => {
            getCaptchaSvg();
            notifyUser(
              err.response.data.message,
              'red-5',
              'fa-solid fa-circle-exclamation'
            );
          });
      }
    };

    return {
      userForm,
      accept,
      onSubmit,
      isLonigForm,
      userStore,
      code,
      acceptRef,
      showRegisterForm: () => {
        isLonigForm.value = !isLonigForm.value;
      },
      getCaptchaSvg,
    };
  },
};
</script>

<style scoped>
/* 设置背景图 */
.login-register-container {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('/src/assets/img/login-bg.jpg') no-repeat center center;
  background-size: cover;
}

.logo-container {
  width: 100%;
  text-align: center;
  padding: 0;
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

/* 设置表单的最大宽度 */
.login-form,
.register-form {
  min-width: 360px;
  /* 半透明背景色增加可读性 */
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 10px;
}

/* 控制按钮的最小宽度 */
.q-btn {
  min-width: 120px;
}

/* 控制每个按钮之间的间距 */
.row {
  margin-top: 15px;
}

.label {
  margin: 0;
}
.code-container {
  display: flex;
  justify-content: space-between;
}
.code {
  width: 200px;
  height: 60px;
  cursor: pointer;
}
.accept-box {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.q-checkbox {
  margin: 0;
}
.accept-content {
  padding: 10px;
}
</style>
