<template>
  <div class="q-gutter-y-md">
    <div class="q-gutter-xs" :class="`size-${size}`">
      <span v-if="$props.align === 'left'" class="integer-part">{{
        isUnit
      }}</span>
      <span class="integer-part">{{ integerPart }}</span>
      <span>.</span>
      <span class="decimal-part">{{ decimalPart }}</span>
      <span v-if="$props.align === 'right'">{{ isUnit }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    totalPrice: {
      type: [Number, String],
      required: true,
    },
    isUnit: {
      type: String,
    },
    size: {
      type: String,
      default: 'xs',
      validator: (value: string) => ['xs', 'sm', 'md', 'lg'].includes(value),
    },
    align: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'right'].includes(value),
    },
  },

  setup(props) {
    const price = computed(() => parseFloat(props.totalPrice.toString()));
    const priceStr = computed(() => price.value.toFixed(2));

    const integerPart = computed(() => {
      const [integer] = priceStr.value.split('.');
      return integer;
    });

    const decimalPart = computed(() => {
      const [, decimal] = priceStr.value.split('.');
      return decimal;
    });
    return {
      integerPart,
      decimalPart,
    };
  },
});
</script>

<style lang="scss" scoped>
$size-xs-integer: 1.1em;
$size-xs-decimal: 0.8em;

$size-sm-integer: 1.2em;
$size-sm-decimal: 1em;

$size-md-integer: 1.4em;
$size-md-decimal: 1em;

$size-lg-integer: 1.6em;
$size-lg-decimal: 1.1em;

span {
  margin: 0;
  padding: 0;
}

.integer-part,
.decimal-part {
  font-weight: bold;
}

// 默认样式
.decimal-part {
  font-size: $size-sm-decimal; // 默认字体大小
}

// 大小样式
.size-xs {
  .integer-part {
    font-size: $size-xs-integer;
  }

  .decimal-part {
    font-size: $size-xs-decimal;
  }
}

.size-sm {
  .integer-part {
    font-size: $size-sm-integer;
  }

  .decimal-part {
    font-size: $size-sm-decimal;
  }
}

.size-md {
  .integer-part {
    font-size: $size-md-integer;
  }

  .decimal-part {
    font-size: $size-md-decimal;
  }
}

.size-lg {
  .integer-part {
    font-size: $size-lg-integer;
  }

  .decimal-part {
    font-size: $size-lg-decimal;
  }
}

// 媒体查询以适配移动端
@media (max-width: 600px) {
  .size-xs .integer-part {
    font-size: 1em;
  }

  .size-xs .decimal-part {
    font-size: 0.7em;
  }

  .size-sm .integer-part {
    font-size: 1.1em;
  }

  .size-sm .decimal-part {
    font-size: 0.9em;
  }

  .size-md .integer-part {
    font-size: 1.2em;
  }

  .size-md .decimal-part {
    font-size: 1em;
  }

  .size-lg .integer-part {
    font-size: 1.4em;
  }

  .size-lg .decimal-part {
    font-size: 1.2em;
  }
}
</style>
