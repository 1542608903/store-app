<template>
  <q-page class="q-pa-md" v-if="order.order_items.length > 0">
    <!-- 订单详情卡片 -->
    <q-card flat bordered class="order-card">
      <q-card-section>
        <!-- 订单编号和状态 -->
        <div class="row items-center justify-between q-mb-md">
          <div>
            <q-icon name="fa-solid fa-file-invoice" size="18px" class="q-mr-xs" />
            <span class="text-subtitle1">订单编号: {{ order.order_number }}</span>
          </div>
          <q-badge color="green" label="已付款" />
        </div>

        <!-- 下单时间 -->
        <div class="text-caption text-grey">
          <q-icon name="fa-solid fa-calendar-day" size="16px" class="q-mr-xs" />
          下单时间: {{ date.formatDate(order.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
        </div>
      </q-card-section>

      <!-- 商品列表 -->
      <q-separator />
      <q-list padding>
        <q-item v-for="(item, index) in order.order_items" :key="index" class="q-pa-none">
          <q-item-section avatar>
            <q-img :src="item.product.goods_img" class="rounded-borders" style="width: 80px; height: 80px;" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">{{ item.product.goods_name }}</q-item-label>
            <q-item-label caption>数量: {{ item.quantity }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label class="text-bold text-primary">￥{{ item.product.goods_price }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- 总价和付款信息 -->
      <q-separator />
      <q-card-section class="q-pa-md">
        <div class="row justify-between">
          <span class="text-bold">商品总价</span>
          <span class="text-bold">￥{{ order.total_price }}</span>
        </div>
        <div class="row justify-between q-mt-xs">
          <span class="text-bold">配送费用</span>
          <span class="text-bold">￥0.0</span>
        </div>
        <q-separator />
        <div class="row justify-between q-mt-md text-h6">
          <span class="text-bold">订单总价</span>
          <span class="text-bold text-primary">￥{{ order.total_price }}</span>
        </div>
      </q-card-section>

      <!-- 收货地址信息 -->
      <q-separator />
      <q-card-section>
        <div class="text-subtitle1 q-mb-md">收货地址</div>
        <div class="text-body2">
          <q-icon name="fa-solid fa-map-marker-alt" size="16px" class="q-mr-xs" />
          {{ order.address.address }}
        </div>
      </q-card-section>

      <!-- 操作按钮 -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="联系客服" color="primary" icon="fa-solid fa-headset" />
        <q-btn flat label="再次购买" color="green" icon="fa-solid fa-cart-plus" />
      </q-card-actions>
    </q-card>
  </q-page>
  <NoData v-else message="没有订单数据" icon="fa-solid fa-list-check" button-text="去主页" @confirm="router.push('/')" />
</template>

<script lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from 'src/stores/order-store';
import { getOrderById } from 'src/api/order';
import { IOrder, orderItems } from 'src/types/order';
import { IAddress } from 'src/types/address';
import { date } from 'quasar';
import NoData from 'src/components/NoData.vue';



export default {
  // 注册组件
  components: {
    NoData,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const orderStore = useOrderStore();
    const orderId = route.params.id;

    let order = reactive<IOrder>({
      id: '',
      user_id: '',
      address_id: '',
      total_price: 0,
      status: 0,
      order_number: '',
      createdAt: '',
      updatedAt: '',
      address: {} as IAddress,
      order_items: [] as orderItems[],
    })

    onMounted(async () => {
      await getOrderById(orderId as string).then(res => {
        const fetchedOrder = res.result?.order as IOrder;
        if (fetchedOrder) {
          // 更新 order 对象的属性
          order.id = fetchedOrder.id;
          order.user_id = fetchedOrder.user_id;
          order.address_id = fetchedOrder.address_id;
          order.total_price = fetchedOrder.total_price;
          order.status = fetchedOrder.status;
          order.order_number = fetchedOrder.order_number;
          order.createdAt = fetchedOrder.createdAt;
          order.updatedAt = fetchedOrder.updatedAt;
          order.address = fetchedOrder.address;
          order.order_items = fetchedOrder.order_items;
        }
      })
    })
    return {
      route,
      orderStore,
      orderId,
      order,
      date,
      router,
    }
  }
}




</script>

<style scoped>
.order-card {
  max-width: 600px;
  margin: 0 auto;
}

@media screen and (max-width: 599px) {
  .order-card {
    width: 100%;
    padding: 0;
  }
}
</style>
