<template>
  <q-page>
    <list-box class="list-box">
      <template v-slot:content>
        <q-scroll-area class="full-height">
          <q-infinite-scroll @load="onLoad" :offset="100" debounce="500"
            ><div class="product-grid row justify-center q-gutter-sm">
              <product-item
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
// 组件
import { useQuasar } from 'quasar';
import ProductItem from 'src/components/product/ProductItem.vue';
import ListBox from 'src/components/ListBox.vue';
const $q = useQuasar();
const list = reactive<IProduct[]>([]);

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

/**
 * 加载更多商品数据
 * @param index 当前的加载索引
 * @param done 加载完成后的回调函数
 */

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
}

/* grid布局 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
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
</style>
