<template>
  <q-page>
    <q-infinite-scroll @load="onLoad" :offset="200">
      <div class="product-grid">
        <div v-for="(product, index) in productStore.list" :key="index" class="product-item">
          <product-list :product="product" @add-cart="addCart"></product-list>
        </div>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar'
import { IProduct } from 'src/types/product';
import { useCartStore } from 'src/stores/cart-store';
import { useProductStore } from 'src/stores/product-store';
import ProductList from 'components/product/ProductList.vue';
// import { watch } from 'vue';

const cartStore = useCartStore();
const productStore = useProductStore();
// const data = reactive<IProduct[]>([]);

const onLoad = (index: number, done: () => void) => {
  setTimeout(async () => {
    productStore.saveProduct(index, done)
  }, 1000)
}

const addCart = (data: IProduct): void => {
  Notify.create({
    message: `${data.goods_name}加入购物车`,
    color: 'red-6',
    textColor: 'white',
    icon: 'add_shopping_cart',
  })
  cartStore.addToCart(data);
}
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
  max-width: 1000px;
  margin: 0 auto;
}

/* 控制每个商品项 */
.product-item {
  display: flex;
  justify-content: center;
}

/* 小于 599px 时，显示单列 */
@media screen and (max-width: 599px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 600px 到 1023px 时，显示两列 */
@media screen and (min-width: 600px) and (max-width: 1023px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 1024px 及以上时，显示三列 */
@media screen and (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
