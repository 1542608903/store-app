<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useCartStore } from 'src/stores/cart-store';
import { useAddressStore } from 'src/stores/address-store';
import { IProductInfo } from 'src/types/product';
import { createOrder } from 'src/api/order';
// 组件
import { Notify } from 'quasar';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import CarItem from 'components/cart/CartItem.vue'
import NoData from 'src/components/NoData.vue';

const cartStore = useCartStore();
const addressStore = useAddressStore();
const isOpenDelDialog = ref(false);
const deleteId = ref<string>('');
const isOpenPayDialog = ref(false);
const router = useRouter();

const checkedAll = () => {
  cartStore.cartList.forEach((item) => {
    item.checked = cartStore.checkedAll
  })
}
const openDeleteDialog = (id: string) => {
  deleteId.value = id;
  isOpenDelDialog.value = true;
};
const openPyaDialog = () => {
  isOpenPayDialog.value = true;
}
const remove = () => {
  cartStore.removeCart(deleteId.value)
}

const createOrderList = async () => {
  const list: IProductInfo[] = cartStore.getCheckedList();
  const address = addressStore.getDefaultAddress();
  const total = cartStore.total;
  if (address.is_default === false) {
    return Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '请您选择默认地址'
    })
  }
  await createOrder(list, address.id as string, total).then(res => {
    if (res.code === 0) {
      Notify.create({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: '订单已创建成功'
      })
      // 清空购物车
      list.forEach((item) => {
        cartStore.removeCart(item.id)
      })
      // 跳转订单页
      router.push('/order')
    }

  }).catch(err => {
    Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: err.message
    })
  })
}
const refresh = () => {
  // 刷新页面
  location.reload();
}
</script>
<template>
  <q-page v-if="cartStore.cartList.length > 0">
    <div class="cart-title">
      <div class="q-pl-xs">
        <q-checkbox class="q-ml-md" v-model="cartStore.checkedAll" size="sm" @update:model-value="checkedAll"
          v-if="cartStore.cartList.length > 0 ? true : false" label="全选/反选" />
      </div>
    </div>
    <CarItem :products="cartStore.cartList" @update-remove="openDeleteDialog" />
    <div class="cart-foot bg-indigo">
      <strong class="text-subtitle2 text-weight-bolder text-warning q-ml-lg">结算：{{ cartStore.cartTotalPrice }}</strong>
      <q-btn class="q-mr-lg" push color="amber" icon="fa-brands fa-google-pay" @click="openPyaDialog" />
    </div>
  </q-page>
  <NoData v-else message="购物车为空" icon="fa-solid fa-cart-arrow-down" button-text="刷新" @confirm="refresh" />

  <!-- 确认弹窗组件 -->
  <ConfirmDialog v-model="isOpenDelDialog" message="确定要删除购物车吗？" title="删除购物车" icon="fa-solid fa-trash"
    @confirm="remove" />
  <ConfirmDialog v-model="isOpenPayDialog" message="确定要支付吗？" title="支付" icon="fa-brands fa-google-pay"
    @confirm="createOrderList" />
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
