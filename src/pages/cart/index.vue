<script lang="ts" setup>
import { ref, onMounted } from 'vue';
// import { useRouter } from 'vue-router'
import { useCartStore } from 'src/stores/cart-store';
import { useAddressStore } from 'src/stores/address-store';
import { IProductInfo } from 'src/types/product';
import { ICartItem } from 'src/types/cart';
import { useOrderStore } from 'src/stores/order-store';
// 组件
import { Notify } from 'quasar';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import CarItem from 'components/cart/CartItem.vue'
import NoData from 'src/components/NoData.vue';

const cartStore = useCartStore();
const orderStore = useOrderStore();
const addressStore = useAddressStore();
const isOpenPayDialog = ref(false);
// const router = useRouter();


onMounted(async () => {
  await cartStore.getCartList();
})

const checkedAll = (i: boolean) => {
  cartStore.checkAll(i)

}
const selectedOne = (value: ICartItem) => {
  cartStore.checkOne(value)
}
const openPyaDialog = () => {
  isOpenPayDialog.value = true;
}
const closePayDalog = () => {
  isOpenPayDialog.value = false;
}

const remove = (id: string) => {
  const i = +id
  cartStore.removeCart([i]);
}

const createOrderList = async () => {

  const address = addressStore.getDefaultAddress();
  // 判断是否是默认地址
  if (!address.is_default) {
    return Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '请先添加默认收货地址'
    })
  }
  // 获取购物车中选中的商品
  const list: IProductInfo[] = cartStore.getCheckedList();
  const total = cartStore.total;

  const res = await orderStore.createOrderStore(list, address.id as string, total);
  if (res === 0) {
    // 成功
    isOpenPayDialog.value = false;
    cartStore.clearCart();
    Notify.create({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '支付成功'
    })
  } else {
    // 失败
    Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '支付失败'
    })
  }
}

const refresh = () => {
  // 刷新页面
  location.reload();
}

</script>
<template>
  <q-page v-if="cartStore.list.length > 0">
    <div class="cart-title">
      <div class="q-pl-xs">
        <q-checkbox class="q-ml-md" v-model:model-value="cartStore.checkedAll" size="sm"
          @update:model-value="checkedAll(cartStore.checkedAll)" v-if="cartStore.list.length > 0 ? true : false"
          label="全选/反选" />
      </div>
    </div>
    <CarItem :cart-item="cartStore.list" @update-remove="remove" @selected-one="selectedOne" />
    <div class="cart-foot bg-indigo">
      <strong class="text-subtitle2 text-weight-bolder text-warning q-ml-lg">结算：{{ cartStore.totalPrice }}</strong>
      <q-btn class="q-mr-lg" push color="amber" icon="fa-brands fa-google-pay" @click="openPyaDialog" />
    </div>
  </q-page>
  <NoData v-else message="购物车为空" icon="fa-solid fa-cart-arrow-down" button-text="刷新" @confirm="refresh" />

  <!-- 确认弹窗组件 -->
  <ConfirmDialog :confirm-dialog="isOpenPayDialog" :message="'￥' + cartStore.totalPrice.toString() + '确认支付吗？'"
    title="支付" icon="fa-brands fa-google-pay" @confirm="createOrderList" @cancel="closePayDalog" />
</template>
<style scoped>
.q-page {
  margin: 0 auto;
  border: 1px solid #ccc;
  position: relative;
}

.cart-title {
  width: 400px;
  margin: 0 auto;
}

.cart-foot {
  width: 100%;
  height: 60px;
  background-color: #ccc;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
