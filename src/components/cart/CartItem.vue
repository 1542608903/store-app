<script lang="ts" setup name="CartItem">
import { ref } from 'vue';
import { ICartItem } from 'src/types/cart';
import QuantityButton from 'src/components/cart/QuantityButton.vue';

const props = defineProps({
  value: {
    type: Object as () => ICartItem,
    required: true,
  },
});

const emit = defineEmits(['update:checke', 'update:number']);
const cart = ref(props.value);

const updateCartNumber = (number: number) => {
  if (cart.value.number !== number) {
    // 触发事件
    emit('update:number', props.value.id, number);
  }
};
</script>

<template>
  <q-card flat bordered class="my-card">
    <q-item clickable>
      <q-checkbox
        :model-value="props.value.selected"
        class="q-mr-md"
        @update:model-value="emit('update:checke', cart)"
      />
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
            @update:number="updateCartNumber"
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
</style>
