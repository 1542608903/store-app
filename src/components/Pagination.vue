<script>
import { ref } from 'vue';

export default {
  props: {
    totalPage: {
      type: Number,
      default: 1,
    },
  },
  emits: ['update:current'],
  setup(props, { emit }) {
    const current = ref(1);
    return {
      props,
      current,
      emit,
    };
  },
};
</script>
<template>
  <q-toolbar class="bg-primary text-white rounded-borders">
    <q-pagination
      v-model="current"
      color="deep-orange"
      :max="props.totalPage"
      :max-pages="5"
      boundary-numbers
      @update:model-value="emit('update:current', current)"
    />
  </q-toolbar>
</template>
<style scoped>
.q-toolbar {
  display: flex;
  justify-content: center;
}
</style>
