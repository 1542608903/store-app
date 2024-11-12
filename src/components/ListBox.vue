<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题',
    },
  },
  setup(props) {
    return {
      props,
    };
  },
};
</script>
<template>
  <q-list bordered class="rounded-borders">
    <!-- 头部插槽 -->
    <slot name="header"></slot>
    <!-- 内容插槽 -->
    <slot name="content"></slot>
    <!-- 脚部-插槽 -->
    <slot name="footer"></slot>
  </q-list>
</template>
<style scoped>
.q-list {
  max-width: 600px;
  height: calc(100vh - 132px);
}
</style>
