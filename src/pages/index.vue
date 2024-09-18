<template>
  <q-page>
    <!-- 使用 q-infinite-scroll 来加载商品列表 -->
    <q-infinite-scroll @load="onLoad" :offset="200">
      <div class="product-grid row justify-center q-gutter-sm">
        <!-- 使用 q-intersection 来实现懒加载 -->
        <q-intersection v-for="(product, index) in productStore.list" :key="index" transition="scale" ssr-prerender
          once>
          <!-- 渲染商品列表项 -->
          <product-list :product="product" @add-cart="addCart" />
        </q-intersection>
      </div>

      <!-- 自定义加载中状态 -->
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar';
import { IProduct } from 'src/types/product';
import { useCartStore } from 'src/stores/cart-store';
import { useProductStore } from 'src/stores/product-store';
import ProductList from 'components/product/ProductList.vue';

const cartStore = useCartStore();
const productStore = useProductStore();


/**
 * 加载更多商品数据
 * @param index 当前的加载索引
 * @param done 加载完成后的回调函数
 */
const onLoad = async (index: number, done: () => void) => {
  await productStore.saveProduct(index, done);
};

/**
 * 将商品添加到购物车
 * @param product 要添加的商品
 */
const addCart = (product: IProduct): void => {
  Notify.create({
    message: `${product.goods_name} 已加入购物车`,
    color: 'red-6',
    textColor: 'white',
    icon: 'add_shopping_cart',
  });
  cartStore.addToCart(product);
};
</script>


<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
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
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 1024px 及以上时，显示三列 */
@media screen and (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
