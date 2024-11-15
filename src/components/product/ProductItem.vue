<script lang="ts">
import { defineComponent, ref } from 'vue';
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
    show: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['addCart', 'update:click'],
  setup(props, { emit }) {
    const loading = ref(props.show);

    setTimeout(() => {
      loading.value = false;
    }, 1000);

    return {
      props,
      loading,
      emit,
      addCart(product: IProduct) {
        emit('addCart', product);
      },
    };
  },
});
</script>

<template>
  <q-card v-if="loading">
    <q-item class="product-item">
      <q-item-section class="product-image-section">
        <q-skeleton class="product-image" square />
      </q-item-section>
      <q-item-section>
        <q-skeleton type="text" width="100px" height="30px" />
        <q-skeleton type="text" width="100px" height="20px" />
      </q-item-section>
    </q-item>
  </q-card>
  <q-card v-else>
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
      <q-item-section class="product-title-section">
        <q-item-label>{{ product.goods_name }}</q-item-label>
      </q-item-section>

      <q-item-section class="product-price-section">
        <PriceDisplay
          :total-price="product.goods_price"
          is-unit="￥"
          size="xs"
          style="color: red"
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
  width: 100%;
  height: 200px;
}

.product-image-section {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  width: 100px;
  height: 100px;
  margin: 2px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #d6d6d6b2;
}

.product-title-section {
  font-weight: bold;
}

.product-price-section {
  display: flex;
  align-items: center;
  width: 100%;
}

.add-to-cart-btn {
  min-width: 40px;
  padding: 0;
}
</style>
