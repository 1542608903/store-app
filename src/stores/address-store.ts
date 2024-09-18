import { defineStore } from 'pinia';
import { IAddress } from 'src/types/address';
import { createAddress, getAddress, updateDefault, deleteAddress } from 'src/api/address/index';
// import { Notify } from 'quasar';
export const useAddressStore = defineStore('address', {
  state: () => ({
    list: [] as IAddress[]
  }),
  getters: {

  },
  actions: {
    // 保存用户地址
    async saveAddress(address: IAddress) {
      await createAddress(address as IAddress).then((res) => {
        this.list = res.result?.address as IAddress[];
        return true;
      }).catch(() => {
        return false
      })
    },
    // 删除用户地址
    async deleteAddress(id: string) {
      await deleteAddress(id).then(() => {
        this.getAddress();
      })
    },
    async getAddress() {
      await getAddress().then((res) => {
        this.list = res.result?.address as IAddress[];
        return true
      }).catch(() => {
        return false
      })
    },
    // 获取默认地址
    getDefaultAddress() {
      return { ...this.list.filter(item => item.is_default)[0] }
    },
    // 判断是否是默认地址是返回true
    isDefaultAddress(id: string) {
      return this.list.filter(item => item.is_default).some(item => item.id === id)
    },

    // 接收id 设置默认地址
    async setDefaultAddress(id: string) {
      await updateDefault(id, true).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.getAddress();
        }
      })
      return id
    },
    // 清空用户地址
    clearAddress() {
      this.list = [];
    },
  },
  persist: {
    storage: localStorage,
  }
}

);
