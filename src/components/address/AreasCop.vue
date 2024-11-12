<template>
  <div class="q-pa-md">
    <!-- <q-select
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
    /> -->
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Area {
  id: number;
  name: string;
}

// 接收 props
const props = defineProps<{
  areaData: Area[];
}>();

console.log('传入的区域数据:', props.areaData);

// 1. 地级市 (XX0100-XX2000 和 XX5100-XX7000)
const prefectureLevelCities = computed(() =>
  props.areaData.filter(
    (area) =>
      (area.id % 10000 >= 100 && area.id % 10000 < 2000) ||
      (area.id % 10000 >= 5100 && area.id % 10000 < 7000)
  )
);

// 2. 地区/自治州 (XX2100-XX5000)
const autonomousPrefectures = computed(() =>
  props.areaData.filter(
    (area) => area.id % 10000 >= 2100 && area.id % 10000 < 5000
  )
);
// 3. 省直管县级单位 (XX90XX)
const provinceDirectlyCountyUnits = computed(() =>
  props.areaData.filter(
    (area) => area.id % 10000 >= 9000 && area.id % 10000 < 9100
  )
);

// 4. 地级市代管县级市 (XXXX81-XXXX99)
const countyLevelCitiesUnderPrefecture = computed(() =>
  props.areaData.filter((area) => area.id % 100 >= 81 && area.id % 100 <= 99)
);

// 打印不同级别的分类
console.log('地级市:', prefectureLevelCities.value);
console.log('地区/自治州:', autonomousPrefectures.value);
console.log('省直管县级单位:', provinceDirectlyCountyUnits.value);
console.log('地级市代管县级市:', countyLevelCitiesUnderPrefecture.value);
</script>

<style scoped>
.q-pa-md {
  max-width: 300px;
  margin: auto;
}
</style>
