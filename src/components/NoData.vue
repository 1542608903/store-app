<template>
  <q-page class="flex flex-center">
    <div class="content">
      <q-icon :name="props.icon" color="orange" size="50px" />
      <div class="text-h6 q-mt-md">
        {{ props.message }}
      </div>
      <q-btn :label="props.buttonText" color="primary" class="q-mt-md" @click="onConfirm" />
    </div>
  </q-page>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'No Data Available'
    },
    icon: {
      type: String,
      default: 'fa-solid fa-box-tissue'
    },
    buttonText: {
      type: String,
      default: 'Refresh'
    }
  },

  emits: ['confirm'],
  setup(props, { emit }) {
    const onConfirm = () => {
      emit('confirm');
    };

    return {
      props,
      onConfirm
    };
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
