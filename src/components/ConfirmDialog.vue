<template>
  <q-dialog v-model:model-value="props.confirmDialog" persistent>
    <q-card class="dialog-card">
      <!-- 标题部分，带图标 -->
      <q-card-section class="q-pb-none">
        <div class="text-h6 q-mb-sm title-section">
          <q-icon :name="icon" size="24px" class="icon" color="primary" />
          <span>{{ title }}</span>
        </div>
      </q-card-section>

      <!-- 消息内容 -->
      <q-card-section class="message-section">
        <p>{{ message }}</p>
      </q-card-section>

      <!-- 动作按钮 -->
      <q-card-actions align="right" class="q-pt-none">
        <q-btn flat label="取消" color="grey-8" @click="onCancel" />
        <q-btn flat label="确定" color="primary" @click="onConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    confirmDialog: {  // 父组件控制弹窗打开/关闭状态
      type: Boolean,
      default: false,
      required: true
    },
    title: {  // 弹窗标题
      type: String,
      default: '确认操作'
    },
    message: {  // 弹窗提示内容
      type: String,
      default: '你确定要执行此操作吗？'
    },
    icon: { // 图标
      type: String,
      default: 'fa-solid fa-trash'
    }
  },
  emits: ['confirm', 'cancel'],

  setup(props, { emit }) {

    // 用户点击确认按钮
    const onConfirm = () => {
      emit('confirm');
    };

    // 用户点击取消按钮
    const onCancel = () => {
      emit('cancel');
    };

    return {
      props,
      emit,
      onConfirm,
      onCancel
    };
  }
};
</script>

<style scoped>
.dialog-card {
  max-width: 400px;
  min-width: 300px;
  padding: 20px;
}

.title-section {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
}

.icon {
  margin-right: 10px;
}

.message-section p {
  font-size: 1rem;
  color: #606060;
  margin: 0;
  padding-bottom: 10px;
}

.q-card-actions .q-btn {
  font-size: 0.875rem;
  /* 调整按钮文字的大小 */
}
</style>
