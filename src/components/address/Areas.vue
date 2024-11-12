<template>
  <div class="q-pa-md">
    <q-select
      v-model="selectedProvince"
      :options="provinceOptions"
      label="选择省"
      @update:model-value="onProvinceChange"
      outlined
      dense
    />
    <q-select
      v-model="selectedCity"
      :options="cityOptions"
      label="选择市"
      :disable="!selectedProvince"
      @update:model-value="onCityChange"
      outlined
      dense
    />
    <q-select
      v-model="selectedDistrict"
      :options="districtOptions"
      label="选择区"
      :disable="!selectedCity"
      outlined
      dense
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { IArea } from 'src/types/address';

// 接收 props
const props = defineProps<{
  areaData: IArea[];
}>();

type Area = {
  value: number;
  label: string;
};

// 定义选择的状态
const selectedProvince = ref<Area | null>(null);
const selectedCity = ref<Area | null>(null);
const selectedDistrict = ref<Area | null>(null);

// 获取省份选项
const provinceOptions = computed(() =>
  props.areaData.map((province) => ({
    label: province.name,
    value: province.id,
  }))
);

// 根据省份选择动态获取市级选项
const cityOptions = computed(() => {
  const _data = selectedProvince.value;
  const province = props.areaData.find((p) => p.id === _data?.value);
  return (
    province?.children?.map((city) => ({
      label: city.name,
      value: city.id,
    })) || []
  );
});

// 根据市级选择动态获取区级选项
const districtOptions = computed(() => {
  const _data = selectedProvince.value;
  const _city = selectedCity.value;
  const province = props.areaData.find((p) => p.id === _data?.value);
  const city = province?.children?.find((c) => c.id === _city?.value);
  return (
    city?.children?.map((district) => ({
      label: district.name,
      value: district.id,
    })) || []
  );
});

// 选择省时清空市、区
function onProvinceChange() {
  selectedCity.value = null;
  selectedDistrict.value = null;
}

// 选择市时清空区
function onCityChange() {
  selectedDistrict.value = null;
}
</script>

<style scoped>
.q-pa-md {
  max-width: 300px;
  margin: auto;
}
</style>
