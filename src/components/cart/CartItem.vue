<script lang="ts">
import { ICartItem } from 'src/types/cart';
export default {
  props: {
    cartItem: {
      type: Array as () => ICartItem[],
      default: () => []
    }
  },
  emits: ['update-remove', 'selected-one'],
  setup(props, { emit }) {
    return {
      props,
      removeCart: (index: number) => {
        emit('update-remove', index)
      },
      selectedOne: (index: ICartItem, number?: number) => {
        emit('selected-one', index, number)
      }
    }
  }
}
</script>

<template>
  <div class="q-ma-xs cart-item" v-for="(item, index) in props.cartItem" :key="index">
    <q-card class="my-card">
      <q-card-section horizontal>
        <div class="q-pa-md q-ma-xs" style="display: flex; align-items: center;">
          <q-checkbox v-model="item.selected" size="sm" @update:model-value="selectedOne(item)" />
        </div>
        <q-img class="col" :src="item.product.goods_img" width="100px" />
        <q-card-section class="q-pt-xs">
          <div class="items-center">
            <div class="col text-h6 ellipsis">
              {{ item.product.goods_name }}
            </div>
            <div class="text-orange text-subtitle2 q-mt-sm">
              ￥{{ item.product.goods_price }}
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <div class="q-pa-md" style="display: inline-block;">
            <q-input v-model.number="item.number" type="number" min="1" dense style="max-width: 70px;"
              @update:model-value="selectedOne(item)" label="数量" />
          </div>
          <q-btn flat round icon="fa-solid fa-trash" size="sm" color="red" @click="removeCart(item.id)" />
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
