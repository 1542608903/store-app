<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">选择购物车中的商品</div>

        <!-- QOptionGroup 控制选中状态 -->
        <q-option-group
          v-model="selectedItems"
          :options="cartItems"
          type="checkbox"
          color="primary"
          inline
        />

        <div v-if="selectedItems.length > 0" class="q-mt-md">
          <div>选中的商品：</div>
          <ul>
            <li v-for="item in selectedItems" :key="item">
              {{ getItemName(item) }}
            </li>
          </ul>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      // 购物车商品数组
      cartItems: [
        { label: '商品1', value: 1 }, // value 为商品 id
        { label: '商品2', value: 2 },
        { label: '商品3', value: 3 },
        { label: '商品4', value: 4 },
      ],
      // 存储选中的商品id
      selectedItems: [2, 3], // 默认选中商品 2 和 3
    };
  },
  methods: {
    getItemName(itemId) {
      const item = this.cartItems.find((item) => item.value === itemId);
      return item ? item.label : '';
    },
  },
};
</script>

<style scoped>
.q-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
