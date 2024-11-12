<template>
  <q-page v-if="order.order_items?.length > 0">
    <ListBox class="list-box">
      <template v-slot:header> </template>
      <template v-slot:content>
        <!-- 订单详情卡片 -->
        <q-card flat bordered class="order-card">
          <q-card-section>
            <!-- 订单编号和状态 -->
            <div class="row items-center justify-between q-mb-md">
              <div>
                <q-icon
                  name="fa-solid fa-file-invoice"
                  size="18px"
                  class="q-mr-xs"
                />
                <span class="text-subtitle1"
                  >订单编号: {{ order?.order_number }}</span
                >
              </div>
              <q-badge
                :color="colorComputed"
                :label="order.state ? '已付款' : '未付款'"
              />
            </div>

            <!-- 下单时间 -->
            <div class="text-caption text-grey">
              <q-icon
                name="fa-solid fa-calendar-day"
                size="16px"
                class="q-mr-xs"
              />
              下单时间:
              {{ date.formatDate(order.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
            </div>
          </q-card-section>

          <!-- 商品列表 -->
          <q-separator />
          <!-- padding -->
          <q-list>
            <q-scroll-area style="height: 250px">
              <q-item
                v-for="(item, index) in order?.order_items"
                :key="index"
                class="q-pa-none"
                :to="{ path: `/detail`, query: { ...item.product } }"
              >
                <q-item-section avatar>
                  <q-img
                    :src="item.product?.goods_img"
                    class="rounded-borders"
                    style="width: 80px; height: 80px"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">{{
                    item.product?.goods_name
                  }}</q-item-label>
                  <q-item-label caption>数量: {{ item.quantity }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-bold text-primary q-mr-md">
                    <PriceDisplay
                      :total-price="item.price as number"
                      is-unit="￥"
                      size="xs"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-scroll-area>
          </q-list>
          <q-separator />
          <q-card-section class="q-pa-md">
            <div class="row justify-between">
              <span class="text-bold">商品总价</span>
              <PriceDisplay
                :total-price="order.total_price as number"
                is-unit="￥"
                size="xs"
              />
            </div>
            <div class="row justify-between q-mt-xs">
              <span class="text-bold">配送费用</span>
              <span class="text-bold">￥0.0</span>
            </div>
            <q-separator />
            <div class="row justify-between q-mt-md">
              <span class="text-bold text-h6">订单总价</span>
              <PriceDisplay
                :total-price="order.total_price as number"
                is-unit="￥"
                size="lg"
              />
            </div>
          </q-card-section>

          <!-- 收货地址信息 -->
          <q-separator />
          <q-card-section>
            <div class="text-subtitle1 q-mb-md">收货地址</div>
            <div class="text-body2">
              <q-icon
                name="fa-solid fa-map-marker-alt"
                size="16px"
                class="q-mr-xs"
              />
              {{ order.address.address }}
            </div>
          </q-card-section>

          <!-- 操作按钮 -->
          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              flat
              label="联系客服"
              color="primary"
              icon="fa-solid fa-headset"
            />

            <q-btn
              flat
              :label="order.state ? '再次购买' : '付款'"
              :color="colorComputed"
              :icon="
                order.state !== 0
                  ? 'fa-solid fa-cart-plus'
                  : 'fa-brands fa-google-pay'
              "
              @click="payLoading(order.id as number, order.state as number)"
            />
          </q-card-actions>
          <q-inner-loading :showing="visible" label="支付中...">
            <q-spinner-hourglass color="purple" size="5.5em" />
          </q-inner-loading>
        </q-card>
      </template>
    </ListBox>
  </q-page>
</template>

<script lang="ts" name="OrderDetail">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from 'src/stores/order-store';
import { getOrderById, orderStateUpdateById } from 'src/api/order';
import { IOrder, orderItems } from 'src/types/order';
import { IAddress } from 'src/types/address';
import { date, useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user-store';

import PriceDisplay from 'src/components/PriceDisplay.vue';
import ListBox from 'src/components/ListBox.vue';

export default {
  // 注册组件
  components: {
    PriceDisplay,
    ListBox,
  },
  setup() {
    const userStore = useUserStore();
    const isLogin = userStore.isLogin;
    const route = useRoute();
    const router = useRouter();
    const orderStore = useOrderStore();
    const orderId = ref(route.params.id);
    const $q = useQuasar();
    const visible = ref(false);
    const order = ref<IOrder>({
      id: undefined,
      user_id: undefined,
      address_id: undefined,
      total_price: undefined,
      state: 0,
      order_number: undefined,
      createdAt: '',
      updatedAt: '',
      address: {} as IAddress,
      order_items: [] as orderItems[],
    });
    const colorComputed = computed(() => (order.value.state ? 'green' : 'red'));

    onMounted(async () => {
      if (!isLogin) return; //是否是登录状态
      await getOrderById(Number(orderId.value)).then((res) => {
        if (res.code === 0) {
          order.value = res.result as IOrder;
        }
      });
    });

    const pay = (id: number, state: number) => {
      if (!isLogin) return; //是否是登录状态
      if (state === 0) {
        orderStateUpdateById(id)
          .then((res) => {
            const data = res.result as IOrder;
            if (res.code === 0) {
              $q.notify({
                message: '支付成功',
                position: 'top',
                color: 'green',
              });
              order.value.state = data.state;
            }
          })
          .catch((error) => {
            $q.notify({
              message: '支付失败',
              position: 'top',
              color: 'green',
            });
            throw error;
          });
      } else {
        // 重新创建订单的方法
        $q.notify({
          message: '未开发',
          position: 'top',
          color: 'green',
        });
      }
    };
    return {
      route,
      orderStore,
      orderId,
      order,
      date,
      router,
      colorComputed,
      visible,
      goBack: () => {
        router.back();
      },
      payLoading: (id: number, state: number) => {
        visible.value = true;
        setTimeout(() => {
          pay(id, state);
          visible.value = false;
        }, 3000);
      },
    };
  },
};
</script>

<style scoped>
.q-page {
  padding-top: 8px;
}
.back-header {
  width: 100%;
  height: 40px;
}
.order-card {
  max-width: 600px;
  height: 100%;
  margin: 0 auto;
}

@media screen and (max-width: 599px) {
  .order-card {
    width: 100%;
    padding: 0;
  }
}
.list-box {
  height: (100vh - 200px);
  margin: 0 auto;
}
</style>
