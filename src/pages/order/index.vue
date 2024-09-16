<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { getOrder } from 'src/api/order';
import { IOrder } from 'src/types/order';
import OrderItme from 'src/components/order/OrderItme.vue';
import NoData from 'src/components/NoData.vue';
import { Notify } from 'quasar';

const orders: IOrder[] = reactive([])
const reuter = useRouter()

onMounted(() => {
  getOrder().then(res => {
    if (res.result && res.result.length > 0) {
      orders.push(...res.result);
    } else {
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: '您没有订单'
      })
    }
  }).catch(err => {
    Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: err.message
    })
  })
})

function go() {
  reuter.push('/');
}
</script>
<template>
  <q-page v-if="orders.length > 0">
    <OrderItme :orders="orders" class="order-itme" />
  </q-page>

  <NoData message="您没有订单" icon="fa-solid fa-clipboard-list" @confirm="go" button-text="去首页" v-else />
</template>
<style scoped>
.order-itme {
  margin: 0 auto;
}
</style>
