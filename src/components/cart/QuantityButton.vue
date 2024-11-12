<template>
  <div class="quantity-control">
    <q-btn
      flat
      icon="remove"
      @click="updateNumber(cartNumber, 'decrease')"
      class="btn-left q-mr-md del-default"
      :disabled="cartNumber <= minQuantity"
      :style="buttonStyles"
    />
    <div class="quantity">
      <span>{{ cartNumber }}</span>
      <q-popup-edit
        v-model.number="cartNumber"
        auto-save
        v-slot="scope"
        @hide="updateNumber(cartNumber, 'update')"
      >
        <q-input
          v-model.number="scope.value"
          dense
          autofocus
          counter
          @keyup.enter="scope.set"
        />
      </q-popup-edit>
    </div>
    <q-btn
      flat
      icon="add"
      @click="updateNumber(cartNumber, 'increase')"
      class="btn-right q-ml-md del-default"
      :disabled="cartNumber >= maxQuantity"
      :style="buttonStyles"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

export default defineComponent({
  props: {
    quantity: {
      type: Number,
      required: true,
    },
    maxQuantity: {
      type: Number,
      default: 99,
    },
    minQuantity: {
      type: Number,
      default: 1,
    },
    buttonSize: {
      type: String as () => 'xs' | 'sm' | 'md' | 'lg' | 'xl',
      default: 'md',
    },
  },
  emits: ['update:number'],
  setup(props, { emit }) {
    const cartNumber = ref(props.quantity | 0);
    const updateNumber = (
      number: number,
      type: 'increase' | 'decrease' | 'update'
    ) => {
      switch (type) {
        case 'increase':
          if (cartNumber.value < props.maxQuantity) {
            cartNumber.value++;
            emit('update:number', cartNumber.value);
          }
          break;
        case 'decrease':
          if (cartNumber.value > props.minQuantity) {
            cartNumber.value--;
            emit('update:number', cartNumber.value);
          }
          break;
        default:
          if (number > props.maxQuantity) {
            cartNumber.value = props.maxQuantity;
          } else if (number < props.minQuantity) {
            cartNumber.value = props.minQuantity;
          } else {
            emit('update:number', number);
          }
          break;
      }
    };

    const buttonStyles = computed(() => {
      const sizes: Record<
        string,
        { width: string; height: string; fontSize: string }
      > = {
        xs: {
          width: '24px',
          height: '24px',
          fontSize: '0.6rem',
        },
        sm: {
          width: '32px',
          height: '32px',
          fontSize: '0.8rem',
        },
        md: {
          width: '40px',
          height: '40px',
          fontSize: '1rem',
        },
        lg: {
          width: '48px',
          height: '48px',
          fontSize: '1.2rem',
        },
        xl: {
          width: '56px',
          height: '56px',
          fontSize: '1.4rem',
        },
      };

      return sizes[props.buttonSize] || sizes.md; // Default to 'md'
    });

    return {
      cartNumber,
      buttonStyles,
      emit,
      updateNumber,
    };
  },
});
</script>

<style lang="scss" scoped>
.del-default {
  margin: 0;
  padding: 0;
}
.quantity-control {
  display: flex;
  align-items: center;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border: 1px solid rgb(158, 158, 158);
}

.quantity {
  width: 50px;
  height: 24.69px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-left: 1px solid rgb(158, 158, 158);
  border-right: 1px solid rgb(158, 158, 158);
}
.q-btn {
  color: rgb(90, 90, 90);
}
.btn-left {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.btn-right {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
