<template>
  <q-page>
    <q-card class="user-center-card">
      <q-card-section>
        <div class="user-info">
          <q-btn round @click="avatarRef?.open()">
            <router-link to="user-edit">
              <q-avatar size="80px">
                <img :src="userStore.userInfo?.avatar" />
              </q-avatar>
            </router-link>
          </q-btn>
          <div class="q-ml-md info-box">
            <div class="name-edit">
              <q-icon
                class="q-mb-xs q-mr-xs"
                name="fa-solid fa-user"
                size="20px"
              />
              <q-badge
                v-if="nameEdit"
                color="purple"
                class="q-mb-xs"
                style="font-size: 16px"
              >
                {{ userStore.userInfo?.nick_name }}
              </q-badge>
            </div>
            <div>
              <q-icon
                class="q-mr-xs"
                name="fa-regular fa-envelope"
                size="20px"
              />
              <q-badge color="blue" style="font-size: 14px">
                {{ userStore.userInfo?.email }}
              </q-badge>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />
      <q-list>
        <q-item clickable to="/address">
          <q-item-section>
            <q-item-label class="text-bold">地址管理</q-item-label>
            <q-item-label caption>查看我的地址</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fa-solid fa-address-book" />
          </q-item-section>
        </q-item>
        <q-item clickable to="/order">
          <q-item-section>
            <q-item-label class="text-bold">我的订单</q-item-label>
            <q-item-label caption>查看所有订单</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fa-solid fa-list" />
          </q-item-section>
        </q-item>
        <q-item clickable @click="showPwd = true">
          <q-item-section>
            <q-item-label class="text-bold">修改密码</q-item-label>
            <q-item-label caption>修改密码</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fa-solid fa-unlock-keyhole" />
          </q-item-section>
        </q-item>
        <q-item clickable to="/user-edit">
          <q-item-section>
            <q-item-label class="text-bold">修改信息</q-item-label>
            <q-item-label caption>编辑个人信息</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fa-solid fa-user-pen" />
          </q-item-section>
        </q-item>
        <q-item clickable to="/about">
          <q-item-section>
            <q-item-label class="text-bold">关于项目</q-item-label>
            <q-item-label caption>关于我的项目</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fa-solid fa-address-book" />
          </q-item-section>
        </q-item>
        <q-item clickable @click="logoutRef?.open()">
          <q-item-section>
            <q-item-label class="text-bold text-negative"
              >退出登录</q-item-label
            >
            <q-item-label caption>退出当前账号</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="fa-solid fa-right-to-bracket" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
  <MyDialog ref="logoutRef" title="是否退出登录？" @submit="logout" />
  <q-dialog v-model="showPwd" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">密码修改</div>
      </q-card-section>
      <q-card-section class="q-pt-none form">
        <q-form @submit="passwordUpdate" ref="formPwdRef">
          <div style="max-width: 300px">
            <!-- 旧密码输入 -->
            <q-input
              bottom-slots
              v-model="formPassword.old_password"
              label="旧密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val: string) => !!val || '旧密码不能为空']"
            >
              <template v-slot:prepend>
                <q-icon name="fa-solid fa-lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- 新密码输入 -->
            <q-input
              bottom-slots
              v-model="formPassword.new_password"
              label="新密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="[
    (val: string) => !!val || '新密码不能为空',
    (val: string) => val.length >= 6 || '新密码长度不能少于6位',
  ]"
            >
              <template v-slot:prepend>
                <q-icon name="fa-solid fa-lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- 确认密码输入 -->
            <q-input
              bottom-slots
              v-model="formPassword.confirm_password"
              label="确认新密码"
              :type="isPwd ? 'password' : 'text'"
              :rules=" [
    (val: string) => !!val || '请再次确认新密码',
    (val: string) => val === formPassword.new_password || '两次密码输入不一致',
  ]"
            >
              <template v-slot:prepend>
                <q-icon name="fa-solid fa-lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </q-form>
      </q-card-section>
      <!-- 操作 -->
      <q-card-actions align="right" class="text-primary">
        <div>
          <q-btn flat color="primary" label="取消" @click="showPwd = false" />
          <q-btn flat color="primary" label="修改" @click="passwordUpdate" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useQuasar, QForm } from 'quasar';
import { useUserStore } from 'src/stores/user-store';
import type { userForm } from 'src/types/user';
import { updatePassword } from 'src/api/user';

import { Dialog } from 'src/types/index';

// 组件
import MyDialog from 'src/components/MyDialog.vue';

const $q = useQuasar();

const userStore = useUserStore();

const isPwd = ref(false);
const showPwd = ref(false);
const nameEdit = ref(true);
const logoutRef = ref<Dialog | null>(null);
const avatarRef = ref<Dialog | null>(null);
const formPwdRef = ref<QForm | null>(null);

const formPassword = ref<userForm>({
  old_password: '',
  new_password: '',
  confirm_password: '',
});

const notifyUser = (
  message: string = '成功',
  color: string = 'green-4',
  icon: string = 'cloud_done'
) => {
  $q.notify({
    message,
    position: 'top',
    color,
    icon,
  });
};

const logout = () => {
  localStorage.clear();
  notifyUser('退出成功');
  setTimeout(() => {
    window.location.href = '/';
  }, 500);
};

const passwordUpdate = async () => {
  if (formPwdRef.value) {
    const valid = await formPwdRef.value?.validate();
    if (valid) {
      const form = {
        new_password: formPassword.value.new_password,
        old_password: formPassword.value.old_password,
      };
      await updatePassword(form).then((res) => {
        if (res.code === 0) {
          notifyUser(res.message);
        } else {
          notifyUser(res.message, 'red-4');
        }
      });
    }
  }
};
</script>

<style scoped>
.q-page {
  padding-top: 8px;
}

.user-center-card {
  max-width: 600px;
  margin: 0 auto;
}

.name-edit {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info img {
  border-radius: 50%;
}
.info-box {
  margin-left: 30px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
</style>
