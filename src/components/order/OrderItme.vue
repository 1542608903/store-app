<template>
  <q-list bordered class="rounded-borders" style="max-width: 600px">
    <q-item-label header>订单项商品展示</q-item-label>
    <q-item v-for="(order, index) in props.orders" :key="index">
      <!-- 商品图片展示，使用滑动效果 -->
      <q-item-section top class="product-img-container">
        <div class="product-img">
          <q-img v-for="(item, index) in order.order_items" :key="index" class="rounded-borders img-slide"
            :src="item.good.goods_img" />
        </div>
      </q-item-section>
      <!-- 价格和数量信息 -->
      <q-item-section top side class="price">
        <div class="text-weight-bolder text-overline text-red">￥{{ order.total_price }}</div>
        <div>共{{ countNumber(order.order_items.map(itme => { return itme.quantity }) as []) }}件</div>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script lang="ts">
import { IOrder } from 'src/types/order';
export default {

  props: {
    orders: {
      type: Array as () => IOrder[]
    }
  },
  emits: [],
  setup(props) {

    console.log(props.orders);
    function countNumber(arr: []) {
      // arr 数组相加
      let sum = 0
      arr.forEach(item => {
        sum += item
      })
      return sum
    }
    return {
      props,
      countNumber
    }
  }
}
</script>
<style scoped>
.product-img-container {
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.product-img {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.product-img::-webkit-scrollbar {
  display: none;
  /* 隐藏 WebKit 浏览器（Chrome, Safari）滚动条 */
}

.img-slide {
  width: 80px;
  height: 80px;
  margin-right: 5px;
  background-color: rgba(165, 165, 165, 0.253);
}

.price {
  width: 80px;
  height: 100%;
  background-color: rgba(255, 255, 255, .5);
  position: absolute;
  right: 5px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0;
}
</style>
