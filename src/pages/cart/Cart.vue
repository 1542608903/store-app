<script setup lang="ts" name="Cart">
import { computed, onMounted, reactive, ref } from 'vue';
import { useAddressStore } from 'src/stores/address-store';
import {
  updateOneNumber,
  updateOneChecke,
  checkeAllCart,
  getCartList,
  removes,
} from 'src/api/cart';
import { useQuasar, debounce, throttle } from 'quasar';
import { ICartItem } from 'src/types/cart';
import type { Product } from 'src/types/product';
import { useRouter } from 'vue-router';
import { createOrder } from 'src/api/order';
import { IOrder } from 'src/types/order';
import { Dialog } from 'src/types/index';

// 组件
import ListBox from 'src/components/ListBox.vue';
// import CartItem from 'components/cart/CartItem.vue';
import ShoppingCartItem from 'components/cart/ShoppingCartItem.vue';
import NoData from 'src/components/NoData.vue';
import MyDialog from 'src/components/MyDialog.vue';
import PriceDisplay from 'src/components/PriceDisplay.vue';

const $q = useQuasar();
const router = useRouter();
const addressStore = useAddressStore();
const cancelRef = ref<Dialog | null>(null);
const payRef = ref<Dialog | null>(null);
const list = reactive<ICartItem[]>([]); // 购物车列表
const checked = ref<boolean>(false); // 是否全选
const pageNum = 1; //当前页
const pageSize = 999; // 每页条数
const visible = ref(false);

onMounted(async () => {
  const res = await getCartList(pageNum, pageSize);
  const data = res.result.list as ICartItem[];
  list.push(...data);

  if (list.filter((item) => item.selected).length === list.length) {
    checked.value = true;
  } else {
    checked.value = false;
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
}, 600);

// 计算
const countPrice = computed(() => {
  return list.reduce((pre, cur) => {
    if (cur.selected) {
      return pre + cur.number * cur.product.goods_price;
    }
    return pre;
  }, 0);
});

/**
  * 多选
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
};
  */

// 多选
const checke = debounce(async (ids: Array<number>) => {
  // 发送请求
  await updateOneChecke(ids);

  // 判断是否全选
  if (ids.length === list.length) {
    checked.value = true;
  } else {
    checked.value = false;
  }

  list.forEach((item) => {
    if (ids.includes(item.id)) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  });
}, 1000);

// 全选
const all = debounce(async (e: boolean) => {
  if (typeof e !== 'boolean') return;

  if (e) {
    // 发送请求
    await checkeAllCart(e);
    const ids = [];
    for (let i = 0; i < list.length; i++) {
      list[i].selected = true;
      ids.push(list[i].id);
    }
  } else {
    await checkeAllCart(e);
    for (let i = 0; i < list.length; i++) {
      list[i].selected = false;
    }
  }
}, 600);

// 删除购物车
const remove = throttle(async () => {
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

  const items = { ids: ids };
  //删除购物车
  await removes(items).then((res) => {
    if (res.code === 0) {
      cancelRef.value?.close();
      // 保存
      const data = list.filter((item) => !ids.includes(item.id));
      // 清空
      list.length = 0;
      // 重新赋值
      list.push(...data);
    }
  });
}, 1000);

/**
 *
 */
const createLoading = () => {
  visible.value = true;
  payRef.value?.close();
  setTimeout(() => {
    visible.value = false;
    create();
  }, 3000);
};
const create = throttle(async () => {
  try {
    const res = await addressStore.query();

    if (!res) {
      return notifyUser('您没有地址', 'red-5');
    }

    if (!res?.is_default) {
      return notifyUser('地址不是默认地址', 'red-5');
    }
    const id = res.id;

    const total = countPrice.value;

    const data = list
      .filter((item) => item.selected)
      .map<Product>((item) => ({
        id: item.goods_id,
        goods_price: item.product.goods_price,
        quantity: item.number,
        addressId: id as number,
        total: +total,
      }));

    if (data?.length === 0) return notifyUser('您还没选择商品', 'red');

    await createOrder(data).then((res) => {
      const order = res.result as IOrder;
      if (res.code === 0) {
        remove(); // 删除购物车
        router.push({ path: `/order-detail/${order.id}` }); // 跳转订单详情
      }
    });
  } catch (error) {
    notifyUser('支付失败', 'red-5');
    throw error;
  }
}, 1000);

const goPay = () => {
  router.push({ path: '/' });
};
</script>
<template>
  <q-page>
    <list-box class="list-box" title="购物车">
      <template v-slot:content>
        <q-scroll-area class="full-height" v-if="list.length > 0">
          <ShoppingCartItem
            :shopping-list="list"
            :selected-all="
              list.filter((item) => item.selected).map((item) => item.id)
            "
            @update:number="updateNumberDebounce"
            @update:checke="checke"
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
              :total-price="countPrice"
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
    <!-- 支付加载动画 -->
    <q-inner-loading :showing="visible">
      <q-spinner-ios color="primary" size="4em" />
      <!-- <q-spinner-gears size="50px" color="primary" /> -->
    </q-inner-loading>
    <MyDialog
      ref="cancelRef"
      title="您确认是否删除已选中的购物车"
      @submit="remove"
    />
    <MyDialog ref="payRef" title="您确认是否购买" @submit="createLoading" />
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
