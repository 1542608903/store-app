<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import type { userForm, IUser } from 'src/types/user';
import { userEdit } from 'src/api/user';
import { upload } from 'src/api/upload';
import { useQuasar, QForm } from 'quasar';
const isDisable = ref(true);
const userStore = useUserStore();
const $q = useQuasar();
const formRef = ref<QForm | null>(null);
const form = ref<userForm>({
  email: userStore?.userInfo.email || '',
  nick_name: userStore?.userInfo.nick_name || '',
  avatar: userStore?.userInfo.avatar || '',
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

type fileTypeVerifyRes = {
  result: boolean;
  type: string;
};

const saveEdit = async () => {
  if (formRef.value) {
    const valid = await formRef.value.validate();
    if (valid) {
      // 数组组合
      const data: userForm = {
        email: form.value.email,
        nick_name: form.value.nick_name,
        avatar: form.value.avatar,
      };
      // 判断数据是否发生修改
      if (
        data.email === userStore?.userInfo.email &&
        data.nick_name === userStore?.userInfo.nick_name &&
        data.avatar === userStore?.userInfo.avatar
      ) {
        notifyUser('数据未发生修改', 'red-4');
        isDisable.value = true;
        return;
      }
      // 发送修改请求
      await userEdit(data)
        .then((res) => {
          notifyUser(res.message);
          isDisable.value = true;
          const result = res?.result.user as IUser;
          if (result?.nick_name) {
            userStore.$patch((state) => {
              state.userInfo.avatar = result.avatar;
              state.userInfo.nick_name = result.nick_name;
              state.userInfo.email = result.email;
            });
          }
        })
        .catch(() => {
          notifyUser('修改失败', 'red-4');
        });
    } else {
      notifyUser('请填写完整', 'red-4');
    }
  }
};

const fileTypeVerify = (files: FileList): Array<fileTypeVerifyRes> => {
  if (files.length === 0) {
    return [];
  }
  // 存放结果
  const arr = [];
  const imgType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (imgType.includes(file.type)) {
      arr.push({ result: true, type: file.type });
    } else {
      arr.push({ result: false, type: file.type });
    }
  }
  return arr;
};
const changeFile = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files!;

  const res = fileTypeVerify(files);

  for (let i = 0; i < files.length; i++) {
    if (!res[i].result) {
      notifyUser('请选择图片文件', 'red-4');
      return;
    }
  }

  const file = files[0];
  const formData = new FormData();
  formData.append('file', file);
  await uploadAvatar(formData);
};

// 上次头像
const uploadAvatar = async (file: FormData) => {
  await upload(file)
    .then((res) => {
      form.value.avatar = res.result.url as string;
    })
    .catch((error) => {
      const message = error.response.data.message;
      notifyUser(message, 'red-4');
    });
};
</script>
<template>
  <q-page>
    <q-card class="my-card">
      <q-item-section avatar class="avatar-section">
        <div class="file-select" v-if="!isDisable">
          <input type="file" @change="changeFile($event)" />
          <label for="">选择头像</label>
        </div>
        <div class="avatar">
          <q-avatar size="100px">
            <img :src="form.avatar" />
          </q-avatar>
        </div>
      </q-item-section>
      <q-card-section class="section">
        <q-form ref="formRef">
          <q-input
            v-model="form.nick_name"
            label="昵称"
            :disable="isDisable"
            :rules="[(val) => !!val || '请输入昵称']"
          />
          <q-input
            v-model="form.email"
            label="邮箱"
            :disable="isDisable"
            :rules="[
              (val) =>
                /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
                  val
                ) || '请输入正确的邮箱格式',
            ]"
          />
          <q-input
            v-model="userStore.userInfo.user_name"
            label="账号"
            :disable="true"
            :rules="[(v) => !!v || '请输入账号']"
          />
        </q-form>
      </q-card-section>
      <q-card-actions class="actions" vertical>
        <q-btn color="primary" @click="isDisable = !isDisable">编辑</q-btn>
        <q-btn color="green-5" @click="saveEdit" :disable="isDisable"
          >保存</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<style lang="css" scoped>
.q-page {
  padding-top: 8px;
}
.my-card {
  max-width: 600px;
  max-height: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.section {
  display: flex;
  flex-direction: column;
}
.q-input {
  width: 200px;
}
.file-select {
  width: 100px;
  height: 100px;
  cursor: pointer;
  background-color: #35353570;
  border-radius: 100%;
  position: absolute;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.file-select input {
  opacity: 0;
  width: 100px;
  height: 100px;
}
.file-select label {
  position: absolute;
  width: 100px;
  top: 50px;
  left: 50px;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 16px;
  z-index: 2000;
  text-align: center;
  pointer-events: none;
}
.actions {
  display: flex;
  align-items: center;
}
.q-btn {
  width: 300px;
}
</style>
