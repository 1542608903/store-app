<script lang="ts" setup>
import { IProduct } from 'src/types/product';

const props = defineProps<{ product: IProduct }>()
const emit = defineEmits(['addCart']);

const addCart = () => {
  emit('addCart', props.product);
}
</script>

<template>
  <q-card class="my-card">
    <q-item-section>
      <q-img :src="product.goods_img" class="q-card-img rounded-borders" />
    </q-item-section>
    <div class="good_title">
      <strong>{{ product.goods_name }}</strong>
    </div>
    <div class="content-box">
      <strong class="price"><strong>￥</strong> {{ product.goods_price }}</strong>
      <q-btn round color="red" icon="shopping_cart" size="sm" @click="addCart"></q-btn>
    </div>
  </q-card>
</template>

<style scoped>
/* 调整价格文字的大小 */
.price {
  font-size: 14px;
  color: rgb(179, 12, 12);
}

/* 图标按钮点击动画 */
.q-btn:active {
  transform: scale(0.9);
  transition: transform 0.3s;
}

.q-card {
  width: 150px;
  /* 调整卡片的宽度 */
  height: 220px;
  /* 调整卡片的高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  /* 添加内边距以增加空间 */
}

.q-card:hover {
  transform: scale(1.05);
  /* 减小放大效果 */
  transition: transform 0.3s;
  cursor: pointer;
}

.q-card-img {
  width: 140px;
  /* 调整图片的宽度 */
  height: 140px;
  /* 调整图片的高度 */
}

.good_title,
.content-box {
  width: 100%;
  color: #442626;
  /* 使标题和内容区域填充卡片宽度 */
}

.good_title {
  text-align: center;
  /* 使标题居中 */
  margin-bottom: 5px;
  /* 调整标题和内容之间的间距 */
}

.content-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  /* 调整内容区域的内边距 */
}
</style>
