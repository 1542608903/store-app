<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
// import { IOrder } from 'src/types/order';
import OrderItme from 'src/components/order/OrderItme.vue';
import NoData from 'src/components/NoData.vue';
import { useOrderStore } from 'src/stores/order-store';
// import { Notify } from 'quasar';


const reuter = useRouter()
const orderStore = useOrderStore()

onMounted(async () => {
  await orderStore.getOrderListStore();
})

</script>
<template>
  <q-page v-if="orderStore.list?.length > 0">
    <OrderItme :orders="orderStore.list" class="order-itme" />
  </q-page>

  <NoData message="您没有订单" icon="fa-solid fa-clipboard-list" @confirm="reuter.push('/')" button-text="去首页" v-else />
</template>
<style scoped>
.order-itme {
  margin: 0 auto;
}
</style>
