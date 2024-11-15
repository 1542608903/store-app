<script lang="ts" setup>
import { ICartItem } from 'src/types/cart';
import QuantityButton from 'src/components/cart/QuantityButton.vue';
import { ref, watch } from 'vue';

// 接收父组件传递的购物车数据
const props = defineProps({
  shoppingList: {
    type: Array as () => ICartItem[],
    required: true,
  },
  selectedAll: {
    type: Array as () => number[],
    required: true,
  },
});

const selectedItems = ref<number[]>([...props.selectedAll]);

// 监听父组件传递的选中状态，更新子组件的选中状态
watch(
  () => props.selectedAll,
  (newSelectedAll) => {
    selectedItems.value = newSelectedAll;
  }
);

// 触发父组件更新选中状态
const emit = defineEmits(['update:checke', 'update:number']);

// 更新购物车数量
const updateCartNumber = (itemId: number, newQuantity: number) => {
  emit('update:number', itemId, newQuantity);
};

// 更新选中状态
const updateSelectedItems = (updatedSelectedIds: number[]) => {
  emit('update:checke', updatedSelectedIds);
};
</script>

<template>
  <q-card
    flat
    bordered
    class="my-card"
    v-for="cart in props.shoppingList"
    :key="cart.id"
  >
    <q-item clickable>
      <!-- 复选框组 -->
      <q-item-section class="checkbox">
        <q-option-group
          v-model="selectedItems"
          :options="[{ label: '', value: cart.id }]"
          type="checkbox"
          color="primary"
          inline
          @update:model-value="updateSelectedItems($event)"
        />
      </q-item-section>

      <q-item-section style="max-width: 80px">
        <q-img
          :src="cart.product.goods_img"
          class="product-img"
          alt="商品图片"
          :ratio="1 / 1"
        />
      </q-item-section>

      <q-item-section class="center">
        <div class="text-h6">{{ cart.product.goods_name }}</div>
        <div class="text-subtitle2 text-red">
          ￥{{ cart.product.goods_price }}
        </div>
        <div class="flex justify-between items-center q-ma-xs">
          <QuantityButton
            :quantity="cart.number"
            :maxQuantity="10"
            :min-quantity="1"
            buttonSize="xs"
            @update:number="updateCartNumber(cart.id, $event)"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<style scoped>
.my-card {
  margin: 0;
  padding: 0;
}

.product-img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  background-color: rgba(165, 165, 165, 0.253);
  transition: transform 0.2s;
}

.product-img:hover {
  transform: scale(1.05);
}

.total-price {
  margin-left: 10px;
  font-weight: bold;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.q-option-group .q-option-label {
  display: none;
}

.checkbox {
  max-width: 40px;
}
</style>
