<script lang="ts">
import { ref, defineComponent } from 'vue';
import { IProduct } from 'src/types/product';


export default defineComponent({
  name: 'ProductList',
  props: {
    product: {
      type: Object as () => IProduct,
      default: () => { },
    },
  },
  emits: ['addCart'],
  setup(props, { emit }) {

    const isSkeleton = ref(true);
    // 开启isSkeleton 1秒后改为false
    setTimeout(() => {
      isSkeleton.value = false;
    }, 1000)
    return {
      props,
      isSkeleton,
      addCart(product: IProduct) {
        emit('addCart', product);
      },
    }
  }

})

</script>

<template>
  <q-card class="my-card">
    <q-item-section class="goods-img">
      <!-- 使用骨架加载动画占位图片 -->
      <q-skeleton v-if="isSkeleton" type="rect" class="q-card-img rounded-borders" />
      <q-img v-else :src="product?.goods_img" class="q-card-img rounded-borders" />
    </q-item-section>

    <!-- 商品标题 -->
    <div class="goods_title">
      <q-skeleton v-if="isSkeleton" type="text" />
      <strong v-else>{{ product?.goods_name }}</strong>
    </div>

    <!-- 商品价格与按钮 -->
    <div class="content-box">
      <q-skeleton v-if="isSkeleton" type="rect" width="50px" height="20px" />
      <strong class="price" v-else><strong>￥</strong> {{ product?.goods_price }}</strong>

      <q-skeleton v-if="isSkeleton" type="QBtn" width="32px" height="32px" />
      <q-btn v-else round color="red" icon="shopping_cart" size="sm" @click="addCart(product)"></q-btn>
    </div>
  </q-card>
</template>

<style scoped>
/* 调整价格文字的大小 */
.price {
  font-size: 14px;
  color: rgb(179, 12, 12);
}

/* 图标按钮点击动画 */
.q-btn:active {
  transform: scale(0.9);
  transition: transform 0.3s;
}

.q-card {
  width: 150px;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.q-card:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
  cursor: pointer;
}

.goods_img {
  margin: 0;
  padding: 0;
}

.q-card-img {
  width: 130px;
  height: 130px;
}

.goods_title,
.content-box {
  width: 100%;
  color: #442626;
}

.goods_title {
  text-align: center;
  margin-bottom: 5px;
}

.content-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}
</style>
