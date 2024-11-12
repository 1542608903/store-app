<template>
  <q-dialog v-model="model" persistent>
    <q-card class="dialog-card">
      <q-card-section class="row items-center">
        <q-avatar :icon="props.icon" color="primary" text-color="white" />
        <span class="q-ml-sm">{{ props.message }}</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="取消" color="primary" />
        <q-btn flat label="确认" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const model = ref(false);

const props = defineProps({
  message: {
    type: String,
    default: '你确定要执行此操作吗？',
  },
  icon: {
    type: String,
    default: 'fa-solid fa-trash',
  },
});

const emit = defineEmits(['update:confirm']);

const confirm = () => {
  close();
  emit('update:confirm');
};

const open = () => (model.value = true);
const close = () => (model.value = false);

defineExpose({ open, close });
</script>

<style scoped>
.dialog-card {
  max-width: 400px;
  min-width: 300px;
  padding: 20px;
}
</style>
