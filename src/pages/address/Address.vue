<template>
  <q-page class="address-page" v-if="list.length > 0">
    <list-box class="list-box">
      <template v-slot:header>
        <q-item-label header class="header">
          <div class="header-add">
            <!--               icon="fa-solid fa-plus" -->
            <q-btn
              flat
              label="添加"
              color="primary"
              @click="(isAdd = true), dialogRef?.open()"
            />
          </div>
          <div><strong class="text-h7">收货地址</strong></div>
          <div class="header-edit">
            <!--               icon="fa-solid fa-gear" -->
            <q-btn
              flat
              label="编辑"
              :color="!showHandle ? 'primary' : 'red-11'"
              @click="show()"
            />
          </div>
        </q-item-label>
        <q-separator spaced />
      </template>
      <template v-slot:content>
        <AddressItem
          class="item"
          v-for="item in list"
          :key="item.id"
          :data="item"
          @update:del="onDelete"
          @update:radio="setAddredd"
          @update:edit="edit"
          v-model="item.is_default"
          :show="showHandle"
        />
      </template>
    </list-box>
  </q-page>
  <NoData
    v-else
    message="您没有添加地址"
    icon="fa-solid fa-location-dot"
    button-text="添加地址"
    @confirm="dialogRef?.open()"
  />
  <MyDialog
    ref="dialogRef"
    :title="isAdd ? '创建地址' : '修改地址'"
    :icon="isAdd ? 'fa-solid fa-file-circle-plus' : 'fa-solid fa-pen-to-square'"
    @submit="onSubmit"
    :is-add="isAdd"
  >
    <template v-slot:content>
      <q-form ref="formRef" @submit="onSubmit" class="q-pa-md">
        <!-- 收件人 -->
        <q-input
          filled
          v-model="address.consignee"
          label="收件人"
          :rules="[(val) => !!val || '请输入收件人']"
          style="min-width: 300px"
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
    </template>
  </MyDialog>
</template>

<script lang="ts">
import { onMounted, ref, defineComponent, reactive } from 'vue';
import { IAddress } from 'src/types/address';
import { useQuasar } from 'quasar';
import { useAddressStore } from 'src/stores/address-store';
import { QForm } from 'quasar';
// api
import {
  createAddress,
  getAddress,
  updateDefault,
  deleteAddress,
  updateAddress,
} from 'src/api/address/index';
// 组件
import NoData from 'src/components/NoData.vue';
import ListBox from 'src/components/ListBox.vue';
import AddressItem from 'src/components/address/AddressItem.vue';
import MyDialog from 'src/components/MyDialog.vue';

import { Dialog } from 'src/types/index';
export default defineComponent({
  components: {
    NoData,
    ListBox,
    AddressItem,
    MyDialog,
  },

  setup() {
    const $q = useQuasar();
    const addressStore = useAddressStore();
    const address = ref<IAddress>({
      id: undefined,
      consignee: '',
      phone: '',
      address: '',
    });
    const formRef = ref<QForm | null>(null);
    const dialogRef = ref<Dialog | null>(null);
    const isAdd = ref(true);
    const showHandle = ref(false);
    const list = reactive<IAddress[]>([]);

    onMounted(async () => {
      await getAddressList();
    });

    /**
     * 获取地址列表
     * @async
     */
    const getAddressList = async () => {
      await getAddress().then((res) => {
        const data = res.result?.list as IAddress[];
        if (res?.code === 0) {
          // 循环添加到list里
          for (let i = 0; i < data.length; i++) {
            list.push(data[i]);
          }
        }
      });
    };

    const delAddress = (id: number) => {
      for (let i = 0; i < list.length; i++) {
        // 找到要删除的数据
        if (list[i].id === id) {
          // 是否是默认地址
          if (list[i].is_default) {
            $q.notify({
              message: '默认地址不能删除',
              position: 'top',
              icon: 'warning',
              textColor: 'white',
            });
          } else {
            // 删除掉
            list.splice(i, 1);
          }
        }
      }
    };

    /**
     * 设置默认地址
     * @params id 地址id
     * */
    const settingDefault = (id: number) => {
      for (let i = 0; i < list.length; i++) {
        // 先找到默认地址
        if (list[i].is_default) {
          list[i].is_default = false;
        }
        // 再找到当前地址
        if (list[i].id === id) {
          list[i].is_default = true;
        }
      }
    };

    const onDelete = async (id: number, value: boolean) => {
      if (value) {
        $q.notify({
          message: '默认地址不能删除',
          position: 'top',
          color: 'red',
        });
        return;
      }

      await deleteAddress(id as number)
        .then((res) => {
          $q.notify({
            message: res.message,
            position: 'top',
            color: 'green',
          });
          addressStore.deleteAddressStore(id);
          delAddress(id);
        })
        .catch((error) => {
          const message = error.response.data.message;
          $q.notify({
            message: message,
            position: 'top',
            color: 'red',
          });
          throw error;
        });
    };

    const setAddredd = async (id: number) => {
      await updateDefault(id)
        .then((res) => {
          $q.notify({
            message: res.message,
            position: 'top',
            color: 'green',
          });
          addressStore.updateAddressStore(id);
          settingDefault(id);
        })
        .catch((error) => {
          $q.notify({
            message: '设置默认地址失败,请联系管理员',
            position: 'top',
            color: 'red',
          });
          throw error;
        });
    };

    const onSubmit = async () => {
      if (formRef.value) {
        const valid = await formRef.value.validate();
        if (valid) {
          if (isAdd.value) {
            // 创建地址
            await createAddress(address.value as IAddress).then((res) => {
              $q.notify({
                message: res.message,
                position: 'top',
                color: 'green',
              });
              const data = res.result as IAddress;
              list.push(data);
            });
          } else {
            // 编辑地址
            const data = {
              id: address.value.id,
              consignee: address.value.consignee,
              phone: address.value.phone,
              address: address.value.address,
            };
            await updateAddress(data)
              .then((res) => {
                $q.notify({
                  message: res.message,
                  position: 'top',
                  color: 'green',
                });
              })

              .catch((error) => {
                const message = error.response.data.message;
                $q.notify({
                  message: message,
                  position: 'top',
                  color: 'green',
                });
              });
          }
          dialogRef.value?.close();
        }
      }
    };

    const edit = (data: IAddress) => {
      dialogRef.value?.open();
      address.value = data;
      isAdd.value = false;
    };
    return {
      address,
      addressStore,
      formRef,
      dialogRef,
      isAdd,
      showHandle,
      list,
      onDelete,
      setAddredd,
      onSubmit,
      edit,
      show: () => {
        showHandle.value = !showHandle.value;
      },
    };
  },
});
</script>

<style scoped>
.q-page {
  padding-top: 8px;
}
.header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-add,
.header-edit {
  margin: 0;
  padding: 0;
  margin-top: 10px;
}
.list-box {
  margin: auto;
}
</style>
