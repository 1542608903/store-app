<script lang="ts" setup>
import { IProduct } from 'src/types/product';

const props = defineProps<{ products: IProduct[] }>()
const emits = defineEmits(['update-remove'])
const deleteProduct = (index: string) => {
  emits('update-remove', index)
}

</script>

<template>
  <div class="q-ma-xs cart-item" v-for="(product, index) in props.products" :key="index">
    <q-card class="my-card">
      <q-card-section horizontal>
        <div class="q-pa-md q-ma-xs" style="display: flex; align-items: center;">
          <q-checkbox v-model="product.checked" size="sm" />
        </div>
        <q-img class="col" :src="product.goods_img" width="100px" />
        <q-card-section class="q-pt-xs">
          <div class="items-center">
            <div class="col text-h6 ellipsis">
              {{ product.goods_name }}
            </div>
            <div class="text-orange text-subtitle2 q-mt-sm">
              ￥{{ product.goods_price }}
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <div class="q-pa-md" style="display: inline-block;">
            <q-input v-model.number="product.goods_num" type="number" min="1" max="99" dense filled
              style="max-width: 70px;" />
          </div>
          <q-btn flat round icon="fa-solid fa-trash" size="sm" color="red" @click="deleteProduct(product.id)" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.cart-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.q-card {
  max-width: 400px;
  display: flex;
}
</style>
