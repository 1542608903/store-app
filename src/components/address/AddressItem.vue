<script lang="ts" setup>
import { IAddress } from 'src/types/address';
const props = defineProps({
  data: {
    type: Object as () => IAddress,
    required: true,
  },
  show: {
    type: Boolean,
  },
});
const emit = defineEmits(['update:del', 'update:radio', 'update:edit']);
</script>

<template>
  <q-item clickable v-ripple active-class="text-orange">
    <q-item-section avatar>
      <div>
        <q-radio
          :model-value="props.data.is_default"
          :val="true"
          v-show="show"
          @update:model-value="() => emit('update:radio', props.data.id)"
        />
      </div>
    </q-item-section>
    <q-item-section>
      <div class="address-info">
        <div class="info-row">
          <q-icon name="fa-solid fa-user" size="xs" class="info-icon" />
          <q-badge outline color="primary" :label="props.data.consignee" />
          <q-badge class="q-ml-md" color="blue">
            {{ props.data.phone }}
          </q-badge>
          <q-badge
            v-if="props.data.is_default"
            class="q-ml-md info-text"
            color="orange"
            text-color="black"
            label="默认"
          />
        </div>
        <div class="info-row">
          <q-icon name="fa-solid fa-location-dot" size="xs" class="info-icon" />
          <!-- <q-badge
            class="badge-address"
            color="orange"
            text-color="black"
            :label="props.data.address"
            style="font-size: 0.9rem"
          /> -->
          <span class="info-text">{{ props.data.address }}</span>
        </div>
      </div>
    </q-item-section>
    <q-item-section side v-if="show">
      <div class="actions">
        <q-btn
          flat
          color="primary"
          class="edit-button"
          icon="fa-solid fa-pen-to-square"
          @click="emit('update:edit', props.data)"
        />
        <q-btn
          flat
          color="negative"
          class="del-button"
          icon="fa-solid fa-trash-can"
          @click="emit('update:del', props.data.id, props.data.is_default)"
        />
      </div>
    </q-item-section>
  </q-item>
  <q-separator v-bind="$attrs" />
</template>

<style scoped>
.address-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px; /* 为信息项添加间隔 */
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px; /* 行间隔 */
}

.info-icon {
  margin-right: 8px; /* 图标和文本间的间距 */
  color: #42a5f5; /* 图标颜色 */
}
.default-box {
  width: 40px;
  padding: 1px;
  text-align: center;
  background-color: #ffa500;
  border-radius: 4px;
}
.info-text {
  font-size: 14px; /* 字体大小 */
  color: #db5151; /* 字体颜色 */
}
.del-button,
.edit-button {
  width: 30px;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
