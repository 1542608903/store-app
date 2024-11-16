<template>
  <q-page>
    <list-box class="list-box">
      <template v-slot:content>
        <q-scroll-area class="full-height">
          <q-infinite-scroll @load="onLoad" :offset="100" debounce="500">
            <div class="product-grid row justify-center q-gutter-sm">
              <product-item
                class="product-item"
                v-for="product in list"
                :key="product.id"
                :product="product"
              />
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner color="primary" size="3em" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-scroll-area>
      </template>
    </list-box>
  </q-page>
</template>

<script lang="ts" setup name="Home">
import { IProduct } from 'src/types/product';
import { getProducts } from 'src/api/product';
import { reactive } from 'vue';
import { useQuasar } from 'quasar';
import ProductItem from 'src/components/product/ProductItem.vue';
import ListBox from 'src/components/ListBox.vue';

const $q = useQuasar();
const list = reactive<IProduct[]>([]);

const notifyUser = (message: string, color: string) => {
  $q.notify({
    message,
    color,
    position: 'top',
  });
};

const onLoad = async (index: number, done: () => void) => {
  const pageSize = 12;
  await getProducts(index, pageSize)
    .then((res) => {
      const data = res.result?.list as IProduct[];
      setTimeout(() => {
        list.push(...data);
        done();
      }, 200);
    })
    .catch((error) => {
      notifyUser('出现错误', 'red-4');
      throw error;
    });
};
</script>

<style scoped>
.q-page {
  padding-top: 8px;
}

.list-box {
  margin: auto;
  height: calc(100vh - 178px);
  border: 0;
}

/* grid布局 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(200px, 1fr)
  ); /* 设置最小宽度为 200px */
  gap: 25px;
}

/* 小于 599px 时，显示单列 */
@media screen and (max-width: 599px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 600px 到 1023px 时，显示两列 */
@media screen and (min-width: 600px) and (max-width: 1023px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 1024px 及以上时，显示三列 */
@media screen and (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 商品卡片的样式 */
.product-item {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

/* 商品卡片 hover 效果 */
.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 商品图片样式 */
.product-item .q-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
}

/* 商品名和价格的样式 */
.product-item .text-h6 {
  font-size: 16px;
  font-weight: 600;
  margin: 10px;
  text-align: center;
}

.product-item .text-subtitle2 {
  font-size: 14px;
  color: #e60012;
  text-align: center;
  margin-bottom: 10px;
}

.product-item .q-btn {
  display: block;
  width: 100%;
  margin-top: 10px;
}

.product-item .product-info {
  padding: 15px;
}

/* 响应式优化 */
@media screen and (max-width: 599px) {
  .product-item .text-h6 {
    font-size: 14px;
  }

  .product-item .text-subtitle2 {
    font-size: 12px;
  }
}
</style>
