<script lang="ts">
import { ref } from 'vue';
export default {
  props: {
    skeleton: Boolean,
    time: {
      type: Number,
      default: 1000,
    },
  },
  setup(props) {
    const isSkeleton = ref<boolean>(props.skeleton);
    setTimeout(() => {
      isSkeleton.value = false;
    }, props.time);
    return { isSkeleton };
  },
};
</script>
<template>
  <q-card>
    <q-item class="product-item">
      <q-item-section>
        <q-skeleton width="100px" height="140px" square />
      </q-item-section>
      <q-item-section>
        <q-skeleton type="text" width="100px" height="30px" />
        <q-skeleton type="text" width="100px" height="20px" />
      </q-item-section>
    </q-item>
  </q-card>
</template>
<style lang="css" scoped>
.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 200px;
}
</style>
