<script lang="ts">
import { defineComponent } from 'vue';
import { IProduct } from 'src/types/product';
import PriceDisplay from 'src/components/PriceDisplay.vue';
export default defineComponent({
  name: 'ProductList',
  components: {
    PriceDisplay,
  },
  props: {
    product: {
      type: Object as () => IProduct,
      default: () => {},
    },
  },
  emits: ['addCart', 'update:click'],
  setup(props, { emit }) {
    return {
      props,
      emit,
      addCart(product: IProduct) {
        emit('addCart', product);
      },
    };
  },
});
</script>

<template>
  <q-card>
    <q-item
      clickable
      class="product-item"
      @click="emit('update:click', product)"
      :to="{ path: `/detail`, query: { ...product } }"
    >
      <!-- 商品图片 -->
      <q-item-section class="product-image-section">
        <q-img
          :src="product.goods_img"
          :alt="product.goods_name"
          class="product-image"
        />
      </q-item-section>
      <!-- 商品信息 -->
      <q-item-section class="product-name-section">
        <q-item-label>{{ product.goods_name }}</q-item-label>
      </q-item-section>

      <q-item-section class="product-actions-section">
        <PriceDisplay
          class="product-price"
          :total-price="product.goods_price"
          is-unit="￥"
          size="xs"
          style="color: red"
        />
        <!-- 加入购物车按钮 -->
        <q-btn
          v-if="false"
          class="add-to-cart-btn"
          flat
          color="primary"
          icon="add_shopping_cart"
          @click.stop="addCart(product)"
        />
      </q-item-section>
    </q-item>
  </q-card>
</template>

<style scoped>
.product-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-image-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  object-fit: cover;
  border-radius: 8px;
}

.product-name-section {
  text-align: center;
  font-weight: bold;
}

.product-actions-section {
  display: flex;
  align-items: center;
  width: 100%;
}

.product-price {
  color: #409eff;
}

.add-to-cart-btn {
  min-width: 40px;
  padding: 0;
}
</style>
