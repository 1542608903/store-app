<template>
  <q-item class="q-mt-xs" :to="{ path: `/order-detail/${order.id}` }">
    <q-item-section top class="product-img-container">
      <div class="text-caption text-grey q-mb-xs">
        <q-icon name="fa-solid fa-calendar-day" size="16px" class="q-mr-xs" />
        下单时间: {{ date.formatDate(order.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
      </div>
      <q-scroll-area
        style="height: 90px; margin-right: 100px"
        :thumb-style="{
          right: '4px',
          borderRadius: '5px',
          background: 'info',
          width: '8px',
        }"
      >
        <div class="row no-wrap">
          <q-img
            v-for="(item, i) in order.order_items"
            :key="i"
            class="rounded-borders img-slide"
            :src="item.product?.goods_img"
            alt="商品图片"
            lazy-src
            spinner-color="primary"
            :ratio="1 / 1"
          />
        </div>
      </q-scroll-area>
    </q-item-section>
    <q-item-section top side class="price">
      <PriceDisplay
        class="text-red"
        :total-price="order.total_price as number"
        is-unit="￥"
      />
      <div class="text-caption">
        共{{
          countNumber(
            order?.order_items.map((item) => item.quantity) as number[]
          )
        }}件
      </div>
      <q-badge :color="order.state ? 'green' : 'blue'">
        {{ order.state ? '已支付' : '未支付' }}
      </q-badge>
    </q-item-section>
  </q-item>
  <q-separator v-bind="$attrs" />
</template>

<script lang="ts">
import { IOrder } from 'src/types/order';
// useAttrs
import { defineComponent } from 'vue';
import { date } from 'quasar';
import PriceDisplay from 'src/components/PriceDisplay.vue';
export default defineComponent({
  components: {
    PriceDisplay,
  },
  props: {
    order: {
      type: Object as () => IOrder,
      required: true,
    },
  },

  setup(props) {
    function countNumber(arr: number[]) {
      return arr.reduce((sum, item) => sum + item, 0);
    }
    return {
      countNumber,
      props,
      date,
    };
  },
});
</script>

<style scoped>
.q-item {
  display: flex;
  justify-content: center;
}

.product-img::-webkit-scrollbar {
  display: none;
}

.img-slide {
  width: 80px;
  height: 80px;
  margin-right: 5px;
  background-color: rgba(165, 165, 165, 0.253);
  transition: transform 0.2s;
}

.img-slide:hover {
  transform: scale(1.05);
}

.price {
  width: 100px;
  height: 100%;
  position: absolute;
  background-color: rgba(39, 39, 39, 0.644);
  right: 5px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0;
  color: white;
}
</style>
