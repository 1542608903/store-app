<script setup lang="ts">
import { ref } from 'vue';
const isDialog = ref(false);
const open = () => (isDialog.value = true);
const close = () => {
  isDialog.value = false;
};

defineExpose({ open, close });

const emit = defineEmits(['submit', 'cancel']);

defineProps({
  title: String,
  showIcon: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: 'fa-solid fa-circle-info',
  },
  isAdd: {
    type: Boolean,
    default: true,
  },
});

const confirm = () => {
  emit('submit');
};
</script>
<template>
  <q-dialog v-model="isDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center">
        <!-- <q-avatar :icon="icon" color="primary" text-color="white" /> -->
        <q-icon :name="icon" color="primary" text-color="white" size="md" />
        <span class="q-ml-sm">{{ title }}</span>
      </q-card-section>
      <q-card-section>
        <slot name="content"></slot>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="取消"
          color="primary"
          @click="emit('cancel'), (isDialog = false)"
        />
        <q-btn
          flat
          :label="isAdd ? '确定' : '修改'"
          color="primary"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<style scoped></style>
