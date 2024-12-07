<template>
  <q-page>
    <list-box class="list-box">
      <template v-slot:header>
        <q-toolbar class="bg-primary rounded-borders nav-bar">
          <q-btn
            flat
            dense
            icon="fa-solid fa-chevron-left"
            class="q-mr-sm"
            @click="goBack"
          />
          <q-separator vertical inset />
          <span class="q-ml-md text-white">商品详情</span>
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
              :ratio="1 / 1"
            />
          </div>

          <!-- 商品信息 -->
          <div class="product-info">
            <!-- 商品名称 -->
            <p class="product-name text-h5">{{ product?.goods_name }}</p>
            <!-- 商品价格 -->
            <p class="product-price text-h6">￥{{ product?.goods_price }}</p>

            <!-- 商品描述 -->
            <div class="product-description">
              <p><strong>库存：</strong>{{ product?.goods_num }}</p>
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
import { useQuasar, throttle } from 'quasar';
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
const addCart = throttle(async () => {
  try {
    const id = product.value?.id as number;
    const res = await createCart(id);
    if (res.code === 0) {
      notifyUser(res.message, 'green');
      router.push({ path: '/cart' });
    } else {
      notifyUser(res.message, 'red');
    }
  } catch (error) {
    // notifyUser('系统出现问题', 'red-4');
  }
}, 1000);

/**
 * 创建订单
 */
const create = throttle(async () => {
  try {
    // 是否登录
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
    // notifyUser('系统出现问题', 'red-4');
  }
}, 1000);
</script>

<style scoped>
.list-box {
  margin: 0 auto;
}

.nav-bar {
  background-color: #409eff;
}

.product-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.product-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.product-image {
  max-width: 350px;
  max-height: 350px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.product-info {
  text-align: center;
}

.product-name {
  font-size: 26px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.product-price {
  font-size: 24px;
  color: #e60012;
  margin-bottom: 16px;
}

.product-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.product-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.add-to-cart-btn,
.buy-now-btn {
  padding: 12px 24px;
  /* font-size: 16px; */
  border-radius: 8px;
}

.add-to-cart-btn {
  background-color: #409eff;
  color: white;
}

.buy-now-btn {
  background-color: #ff5722;
  color: white;
}

.add-to-cart-btn:hover {
  background-color: #007bff;
}

.buy-now-btn:hover {
  background-color: #f44336;
}

/* 移动设备优化 */
@media screen and (max-width: 768px) {
  .product-image {
    max-width: 200px;
    max-height: 200px;
  }

  .product-name {
    font-size: 22px;
  }

  .product-price {
    font-size: 20px;
  }
}
</style>
