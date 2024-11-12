<script lang="ts" setup>
import { IAddress } from 'src/types/address';
import { ref } from 'vue';
import { QForm } from 'quasar';
const formRef = ref<QForm | null>(null);

const model = defineModel<boolean>();

const emit = defineEmits<{
  (e: 'update:submit', address: IAddress): void;
}>();

const address = ref<IAddress>({
  consignee: '',
  phone: '',
  address: '',
});

// 定义选中的值
const onSubmit = async (event: Event) => {
  event.preventDefault(); // 阻止默认表单提交
  if (formRef.value) {
    const valid = await formRef.value.validate(); // 等待验证结果
    if (valid) {
      emit('update:submit', address.value); // 触发父组件事件，传递地址数据
      model.value = false; // 提交后关闭对话框
    }
  }
};
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <!-- 地址对话框 -->
    <q-dialog v-model="model" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">添加地址</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" ref="formRef">
            <!-- 收件人 -->
            <q-input
              filled
              v-model="address.consignee"
              label="收件人"
              :rules="[(val) => !!val || '请输入收件人']"
            />
            <!-- 手机号 -->
            <q-input
              filled
              v-model="address.phone"
              label="手机号"
              :rules="[
                (val) =>
                  /^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/.test(val) ||
                  '请输入正确的手机号',
              ]"
            />
            <!-- 收件地址 -->
            <q-input
              filled
              v-model="address.address"
              label="收件地址"
              :rules="[(val) => !!val || '请输入收件地址']"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <!-- 取消按钮 -->
          <q-btn class="q-bt-custom" flat label="取消" @click="model = false" />
          <!-- 提交按钮 -->
          <q-btn
            class="q-bt-custom"
            flat
            label="创建"
            type="submit"
            @click="onSubmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.q-bt-custom {
  margin: 0 10px;
}
</style>
