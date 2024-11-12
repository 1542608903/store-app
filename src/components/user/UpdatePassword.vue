<script lang="ts">
import { ref, reactive } from 'vue';

export default {
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onCancel', 'onConfirm'],
  setup(props, { emit }) {
    const form = reactive({
      old_password: '',
      new_password: '',
      confirm_password: '',
    });

    const formRef = ref(null);
    // 校验规则
    const rules = {
      oldPassword: [(val: string) => !!val || '旧密码不能为空'],
      newPassword: [
        (val: string) => !!val || '新密码不能为空',
        (val: string) => val.length >= 6 || '新密码长度不能少于6位',
      ],
      confirmPassword: [
        (val: string) => !!val || '请再次确认新密码',
        (val: string) => val === form.new_password || '两次密码输入不一致',
      ],
    };

    return {
      props,
      form,
      rules,
      formRef,
      isPwd: ref(true),
      emit,
      onCancel() {
        emit('onCancel');
      },
      onConfirm() {
        const { confirm_password, ...data } = form;
        emit('onConfirm', data);
        return confirm_password;
      },
    };
  },
};
</script>

<template>
  <q-dialog v-model:model-value="props.isDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">密码修改</div>
      </q-card-section>
      <q-card-section class="q-pt-none form">
        <q-form @submit.prevent="onConfirm">
          <div style="max-width: 300px">
            <!-- 旧密码输入 -->
            <q-input
              bottom-slots
              v-model="form.old_password"
              label="旧密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="rules.oldPassword"
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
              v-model="form.new_password"
              label="新密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="rules.newPassword"
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
              v-model="form.confirm_password"
              label="确认新密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="rules.confirmPassword"
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
          <q-btn
            class="q-mr-md"
            push
            color="primary"
            label="取消"
            @click="onCancel"
          />
          <q-btn push color="primary" label="修改" @click="onConfirm" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
