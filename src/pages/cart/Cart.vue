<script setup lang="ts" name="Cart">
import { onMounted, reactive, ref } from 'vue';
import { useAddressStore } from 'src/stores/address-store';
import {
  updateOneNumber,
  updateOneChecke,
  checkeAllCart,
  getCartList,
  removes,
} from 'src/api/cart';
import { useQuasar, debounce } from 'quasar';
import { ICartItem } from 'src/types/cart';
import type { Product } from 'src/types/product';
import { useRouter } from 'vue-router';
import { createOrder } from 'src/api/order';
import { IOrder } from 'src/types/order';
import { Dialog } from 'src/types/index';

// 组件
import ListBox from 'src/components/ListBox.vue';
import CartItem from 'components/cart/CartItem.vue';
import NoData from 'src/components/NoData.vue';
import MyDialog from 'src/components/MyDialog.vue';
import PriceDisplay from 'src/components/PriceDisplay.vue';

const addressStore = useAddressStore();
const $q = useQuasar();
const cancelRef = ref<Dialog | null>(null);
const payRef = ref<Dialog | null>(null);
const router = useRouter();
const list = reactive<ICartItem[]>([]);
const checked = ref<boolean>(false);
const arr = ref<Array<number>>([]);
const arrs = reactive<Array<number>>([]);
const totalPrice = ref(0);
const sum = ref(0);

onMounted(async () => {
  const pageNum = 1;
  const pageSize = 999;
  const res = await getCartList(pageNum, pageSize);
  const data = res.result.list as [];

  for (let i = 0; i < data.length; i++) {
    list.push(data[i]);
  }
  const len = list.filter((item) => item.selected === true).length;

  if (len === data.length) {
    checked.value = true;
    count(); // 计算
  }
});

// 通知封装函数
const notifyUser = (message: string, color: string) => {
  $q.notify({
    message,
    position: 'top',
    color,
  });
};

const updateNumberDebounce = debounce(async (id: number, number: number) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i].number = number;
      await updateOneNumber(id, number);
    }
  }
  count();
}, 400);

// 计算
const count = () => {
  arr.value = [];
  arrs.length = 0;
  var s = 0;
  for (let i = 0; i < list.length; i++) {
    let price = Number(list[i].product.goods_price);
    if (list[i].selected === true) {
      arr.value.push(list[i].number * price);
      arrs.push(list[i].id);
    } else {
      arrs.splice(list[i].id);
    }
  }
  for (let i = 0; i < arr.value.length; i++) {
    s += arr.value[i];
  }
  sum.value = s;
};

// 多选
const radio = async (item: ICartItem, index: number) => {
  if (list[index].selected) {
    list[index].selected = false;
    // 发请求
    const id = list[index].id;
    await updateOneChecke(id, false);
    checked.value = false;
  } else {
    list[index].selected = true;
    // 发请求
    const id = list[index].id;
    await updateOneChecke(id, true);
    let a = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].selected === true) {
        a++;
      }
      if (a == list.length) {
        checked.value = true;
      }
    }
  }
  count();
};
// 全选
const all = async (e: boolean) => {
  if (e === null) return;
  if (e) {
    for (let i = 0; i < list.length; i++) {
      // 选中
      list[i].selected = true;
    }
    // 发送请求
    await checkeAllCart(true);
  } else {
    for (let i = 0; i < list.length; i++) {
      // 不选中
      list[i].selected = false;
    }
    // 发送请求
    await checkeAllCart(false);
  }
  count();
};
// 删除购物车
const cartRemove = async () => {
  // 初始化
  const ids: Array<number> = [];

  for (let i = 0; i < list.length; i++) {
    if (list[i].selected) {
      ids.push(list[i].id);
    }
  }

  if (ids.length === 0) {
    return notifyUser('您还没选择商品', 'red');
  }

  //删除购物车
  await removes(ids).then((res) => {
    if (res.code === 0) {
      cancelRef.value?.close();
      const data = list.filter((item) => !ids.includes(item.id));
      list.length = 0;
      list.push(...data);
    }
  });
};

const create = async () => {
  try {
    const res = await addressStore.query();

    if (!res) {
      return notifyUser('您没有地址', 'red-5');
    }

    if (!res?.is_default) {
      return notifyUser('地址不是默认地址', 'red-5');
    }
    const id = res.id;

    const total = +totalPrice.value.toFixed(2);

    const data = list
      .filter((item) => item.selected)
      .map<Product>((item) => ({
        id: item.goods_id,
        goods_price: item.product.goods_price,
        quantity: item.number,
        addressId: id as number,
        total: total,
      }));

    if (data?.length === 0) return notifyUser('您还没选择商品', 'red');

    await createOrder(data).then((res) => {
      const order = res.result as IOrder;
      if (res.code === 0) {
        cartRemove(); // 删除购物车
        router.push({ path: `/order-detail/${order.id}` }); // 创建订单成功后跳转
      }
    });
  } catch (error) {
    notifyUser('支付失败', 'red-5');
    throw error;
  }
};
const goPay = () => {
  router.push({ path: '/' });
};
</script>
<template>
  <q-page>
    <list-box class="list-box" title="购物车">
      <template v-slot:content>
        <q-scroll-area class="full-height" v-if="list.length > 0">
          <cart-item
            class="cart-item"
            v-for="(cart, index) in list"
            :key="cart.goods_id"
            :value="cart"
            @update:number="updateNumberDebounce"
            @update:checke="radio(cart, index)"
          />
        </q-scroll-area>
        <NoData
          class="fixed-center"
          v-else
          icon="fa-solid fa-cart-arrow-down"
          message="您没有商品"
          button-text="去购买"
          @confirm="goPay"
        />
      </template>
      <template v-slot:footer>
        <div class="footer-box q-gutter-y-md column">
          <q-toolbar class="bg-primary shadow-2 rounded-borders">
            <q-checkbox round v-model="checked" @update:model-value="all" />
            <q-separator vertical inset />
            <q-btn
              flat
              round
              dense
              icon="fa-solid fa-trash-can"
              color="orange-6"
              class="q-ml-sm"
              @click="cancelRef?.open()"
            />
            <q-space />
            <q-separator vertical inset />
            <PriceDisplay
              :total-price="sum"
              is-unit="￥"
              class="q-mr-sm text-orange-6"
            />
            <q-btn
              flat
              round
              dense
              color="white"
              class="q-ml-sm"
              label="支付"
              @click="payRef?.open()"
            />
          </q-toolbar>
        </div>
      </template>
    </list-box>

    <MyDialog
      ref="cancelRef"
      title="您确认是否删除已选中的购物车"
      @submit="cartRemove"
    />
    <MyDialog ref="payRef" title="您确认是否购买" @submit="create" />
  </q-page>
</template>

<style scoped>
.q-page {
  padding-top: 8px;
}
.list-box {
  margin: 0 auto;
  position: relative;
  /* padding-bottom: 55px; */
  background-color: rgba(143, 140, 140, 0);
  padding-bottom: 55px;
}
.footer-box {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.cart-item {
  width: 90%;
  margin: 0 auto;
  background-color: rgba(250, 250, 250, 0.993);
  margin-top: 2%;
}
</style>
