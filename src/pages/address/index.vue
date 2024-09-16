<template>
  <q-page v-if="addressStore.list.length > 0">
    <div class="q-gutter-md address-list">
      <q-list bordered class="rounded-borders" style="max-width: 600px">
        <q-item-label header>
          <q-btn round color="primary" icon="fa-solid fa-plus" @click="prompt = true" />
          &nbsp;
          <strong>添加地址</strong>
        </q-item-label>
        <q-separator spaced />
        <q-item v-for="(item, index) in addressStore?.list" :key="index" v-show="addressStore.list.length > 0">
          <q-item-section top class="col-2 gt-sm">
            <q-item-label class="q-mt-sm">{{ item?.consignee }}</q-item-label>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">
              <q-icon class="q-mr-xs" name="fa-solid fa-location-dot" color="positive"></q-icon>
              <span class="text-grey-8">{{ item?.address }}</span>
              <br>
              <q-icon class="q-mr-xs" name="fa-solid fa-mobile-screen-button" color="accent"></q-icon>
              <q-badge color="blue">{{ item?.phone }}</q-badge>
            </q-item-label>
          </q-item-section>
          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat dense round icon="delete"
                @click="openDeleteDialog(item?.id as string)" />
              <q-radio :model-value="item?.is_default ? item?.id : ''" :val="item?.id" checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                @update:model-value="isDialogSetAddress = true, addressId = item?.id as string" />
            </div>
          </q-item-section>
          <!-- <q-separator spaced /> -->
        </q-item>
      </q-list>
    </div>
  </q-page>

  <NoData v-else message="您没有添加地址" icon="fa-solid fa-location-dot" button-text="添加地址" @confirm="add" />

  <!-- 确认按键组件 -->
  <ConfirmDialog v-model="isDialogDelete" title="删除确认" message="你确定要删除这条记录吗？" icon="fa-solid fa-trash"
    @confirm="onDelete" />
  <ConfirmDialog v-model="isDialogSetAddress" title="设置为默认地址" message="你确定要设置为默认地址吗？" icon="fa-solid fa-location-dot"
    @confirm="setDefaultAddress" />

  <!-- 弹窗 -->
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">添加地址</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" ref="formRef">
            <!-- 收件人 -->
            <q-input filled v-model="address.consignee" label="收件人" :rules="[val => !!val || '请输入收件人']" />
            <!-- 手机号 -->
            <q-input filled v-model="address.phone" label="手机号" :rules="[
              val => /^1[3-9]\d{9}$/.test(val) || '请输入正确的手机号'
            ]" />
            <!-- 收件地址 -->
            <q-input filled v-model="address.address" label="收件地址" :rules="[val => !!val || '请输入收件地址']" />
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" @click="onReset" />
          <q-btn flat label="创建" type="submit" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { IAddress } from 'src/types/address';
import { useQuasar, QForm, } from 'quasar';
import { createAddress, getAddress, updateDefault, deleteAddress } from 'src/api/address';
import ConfirmDialog from 'src/components/ConfirmDialog.vue';
import { useAddressStore } from 'src/stores/address-store';
import NoData from 'src/components/NoData.vue';

export default {
  components: {
    // 局部注册组件
    ConfirmDialog,
    NoData
  },
  setup() {
    const $q = useQuasar();
    const formRef = ref<QForm | null>(null);
    const address = ref<IAddress>({
      id: '',
      consignee: '',
      phone: '',
      address: '',
      is_default: false,
      user_id: '',
    });

    const prompt = ref(false);
    const isDialogDelete = ref(false);
    const isDialogSetAddress = ref(false);
    const addressId = ref<string>('');
    const addressStore = useAddressStore();

    // 添加地址
    const onSubmit = async () => {
      if (formRef.value) {
        const valid = await formRef.value.validate(); // 等待验证结果
        if (valid) {
          await createAddress(address.value).then(res => {
            if (res.code === 0) {
              addressStore.list.push(res.result.address as IAddress);
              $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: '地址已添加成功'
              });
            }
          })
          onReset();
          prompt.value = false;
        }
      }
    };

    onMounted(async () => {
      await getAddress().then(res => {
        // 保存用户地址
        addressStore.saveAddress(res.result?.addressList);
      });
    });

    // 重置表单
    const onReset = () => {
      formRef.value?.resetValidation();
      prompt.value = false;
    };

    // 删除确认框开启
    const openDeleteDialog = (id: string) => {
      isDialogDelete.value = true;
      addressId.value = id as string;
    };

    const onDelete = async () => {
      if (addressStore.isDefaultAddress(addressId.value as string)) {
        return $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: '默认地址不能删除'
        })
      }

      await deleteAddress(addressId.value as string).then(res => {
        if (res.code === 0) {
          $q.notify({
            color: 'green-5',
            textColor: 'white',
            icon: 'cloud_done',
            message: '地址删除成功',
          });
        }
      })
      // 根据删除id 删除数组
      addressStore.deleteAddress(addressId.value as string);
      isDialogDelete.value = false;
      addressId.value = '';

    };


    const setDefaultAddress = async () => {
      isDialogSetAddress.value = true
      await updateDefault(addressId.value, true).then(res => {
        if (res.code === 0) {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: '设置默认地址成功'
          });
          // 更新默认地址
          addressStore.setDefaultAddress(addressId.value);
        }
      });
    };

    const add = () => {
      prompt.value = true;
    };

    return {
      address,
      prompt,
      formRef,
      onSubmit,
      onReset,
      isDialogDelete,
      openDeleteDialog,
      onDelete,
      isDialogSetAddress,
      setDefaultAddress,
      addressStore,
      add,
      addressId
    };
  }
};
</script>

<style scoped>
.address-list {
  max-width: 600px;
  margin: 0 auto;
}
</style>
