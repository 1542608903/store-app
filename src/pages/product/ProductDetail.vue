<template>
  <q-page>
    <list-box class="list-box">
      <template v-slot:header>
        <q-toolbar class="bg-secondary rounded-borders">
          <q-btn
            flat
            dense
            icon="fa-solid fa-chevron-left"
            class="q-mr-sm"
            @click="goBack"
          />
          <q-separator vertical inset />
          <span class="q-ml-md">商品详情</span>
        </q-toolbar>
      </template>
      <template v-slot:content>
        <div class="product-detail-page">
          <!-- 商品图片 -->
          <div class="product-image-container">
            <q-img
              :src="product?.goods_img"
              :alt="product?.goods_name"
              class="product-image"
            />
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <!-- 商品名称 -->
            <!-- <h1 class="product-name">{{ product?.goods_name }}</h1> -->
            <p class="text-h6">{{ product?.goods_name }}</p>
            <!-- 商品价格 -->
            <p class="product-price">￥{{ product?.goods_price }}</p>

            <!-- 商品描述 -->
            <div class="product-description">
              <p><span>库存：</span>{{ product?.goods_num }}</p>
            </div>

            <!-- 操作按钮 -->
            <div class="product-actions">
              <q-btn
                push
                color="primary"
                icon="add_shopping_cart"
                label="加入购物车"
                class="add-to-cart-btn"
                @click="addCart"
              />
              <q-btn
                push
                color="secondary"
                icon="payment"
                label="立即购买"
                class="buy-now-btn"
                @click="create"
              />
            </div>
          </div>
        </div>
      </template>
    </list-box>
  </q-page>
</template>

<script setup lang="ts" name="ProductDetail">
import { useRouter } from 'vue-router';
import { IProduct, Product } from 'src/types/product';
import ListBox from 'src/components/ListBox.vue';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { createCart } from 'src/api/cart';
import { createOrder } from 'src/api/order';
import { queryAddress } from 'src/api/address';
import { IAddress } from 'src/types/address';
import { IOrder } from 'src/types/order';
const route = useRoute();
const product = ref<IProduct>();
const router = useRouter();
const $q = useQuasar();

/**
 * 通知封装函数
 * @param message
 * @param color
 */
const notifyUser = (message: string, color: string) => {
  $q.notify({
    message,
    color,
    position: 'top',
  });
};

onMounted(() => {
  product.value = route.query as unknown as IProduct;
});

function goBack() {
  router.back();
}

/**
 * 将商品添加到购物车
 * @param product 要添加的商品
 */
const addCart = async () => {
  try {
    let userString = localStorage.getItem('user');
    let isLogin: boolean = false;
    if (userString) {
      const user = JSON.parse(userString);
      isLogin = user.isLogin;
    }

    if (!isLogin) {
      return notifyUser('登录后再进行操作', 'green');
    }

    const id = product.value?.id as number;
    const res = await createCart(id);
    if (res.code === 0) {
      notifyUser(res.message, 'green');
      router.push({ path: '/cart' });
    } else {
      notifyUser(res.message, 'red');
    }
  } catch (error) {
    notifyUser('出现错误!请联系管理员', 'red-4');
  }
};

const create = async () => {
  try {
    let userString = localStorage.getItem('user');
    let isLogin: boolean = false;
    if (userString) {
      const user = JSON.parse(userString);
      isLogin = user.isLogin;
    }

    if (!isLogin) {
      return notifyUser('登录后再进行操作', 'green');
    }
    const res = await queryAddress();
    const address = res.result as IAddress;

    if (res?.code !== 0) {
      notifyUser(res.message, 'red-5');
      return;
    }

    const data: Product[] = [];

    data.push({
      id: Number(product.value?.id),
      goods_price: product.value?.goods_price as number,
      quantity: 1,
      addressId: address.id as number,
      total: Number(product.value?.goods_price),
    });

    await createOrder(data).then((res) => {
      if (res.code === 0) {
        const order = res.result as IOrder;
        notifyUser('订单创建成功', 'green-4');
        router.push({ path: `/order-detail/${order.id}` });
      }
    });
  } catch (error) {
    notifyUser('订单创建失败', 'red-5');
    throw error;
  }
};
</script>

<style scoped>
.list-box {
  margin: 0 auto;
}
.back-btn {
  margin-bottom: 16px;
}

.product-image-container {
  text-align: center;
}

.product-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 24px;
}

.product-info {
  text-align: center;
}

.product-name {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.product-price {
  font-size: 20px;
  color: #409eff;
  margin: 16px 0;
}

.product-description {
  margin-bottom: 24px;
  color: #606266;
}

.product-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.add-to-cart-btn,
.buy-now-btn {
  padding: 12px 24px;
}
</style>
