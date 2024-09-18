<script lang="ts">
import { IUser } from 'src/types/user';
export default {
  props: {
    user: {
      type: Object as () => IUser
    }
  },
  emits: ['on:confirm', 'on:cancel'],
  setup(props, { emit }) {

    const onConfirm = () => {
      emit('on:confirm')
    }
    const onCancel = () => {
      emit('on:cancel')
    }

    return {
      props,
      emit,
      onConfirm,
      onCancel
    }
  }
}
</script>
<template>

  <q-card class="my-card" style="max-width: 400px;">
    <q-card-section>
      <q-avatar rounded size="80px">
        <img :src="props.user?.avatar">
      </q-avatar>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">名称：{{ props.user?.nick_name }}</div>
      <div class="text-h6">账号：{{ props.user?.user_name }}</div>
      <div class="text-h6">邮箱：{{ props.user?.email }}</div>
    </q-card-section>
    <q-card-actions>
      <q-btn push color="primary" label="更新信息" icon="fa-solid fa-address-card" @click="onCancel" />
      <q-btn push align="between" color="primary" class="btn-fixed-width" label="修改密码" icon="password"
        @click="onConfirm" />
    </q-card-actions>
  </q-card>
</template>
<style scoped></style>
