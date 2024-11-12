<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user-store';
import { getOrder } from 'src/api/order';
import { IOrder } from 'src/types/order';

import ListBox from 'src/components/ListBox.vue';
import Pagination from 'src/components/Pagination.vue';
import OrderItem from 'src/components/order/OrderItme.vue';
import NoData from 'src/components/NoData.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const $q = useQuasar();
const userStore = useUserStore();
const current = ref(1);
const totalPage = ref(0);
const list = reactive<IOrder[]>([]);

onMounted(() => {
  getOrderList(current.value);
});

const getOrderList = async (current: number) => {
  if (!userStore.isLogin) return;
  try {
    const pageSize = 20;
    const { result, ...res } = await getOrder(current, pageSize);
    const data: IOrder[] = result?.list as IOrder[];
    totalPage.value = result?.total as number;
    if (data.length === 0) {
      $q.notify({
        message: '没有订单',
        color: 'red-5',
        position: 'top',
      });
    }
    if (res.code === 0) {
      list.splice(0, list.length, ...data);
    }
  } catch (error) {
    throw error;
  }
};

// 跳转到主页
const toHome = () => {
  router.push({ name: 'Home' });
};
</script>
<template>
  <q-page>
    <list-box class="list-box">
      <template v-slot:content>
        <q-scroll-area
          class="full-height"
          v-if="list?.length && list?.length > 0"
        >
          <order-item
            class="order-item"
            v-for="order in list"
            :key="order.id"
            :order="order"
          />
        </q-scroll-area>
        <NoData
          class="fixed-center"
          v-else
          icon="fa-solid fa-cart-arrow-down"
          message="您没有商品"
          button-text="去下单"
          @confirm="toHome"
        />
      </template>
      <template v-slot:footer>
        <Pagination
          class="list-foot"
          @update:current="getOrderList"
          :total-page="totalPage || 0"
        />
      </template>
    </list-box>
  </q-page>
</template>
<style scoped>
.q-page {
  padding-top: 8px;
}

.list-box {
  margin: auto;
  position: relative;
  padding-bottom: 55px;
}

.order-item {
  overflow-x: hidden;
}

.list-foot {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
