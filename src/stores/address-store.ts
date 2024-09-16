import { defineStore } from 'pinia';
import { IAddress } from 'src/types/address';

export const useAddressStore = defineStore('address', {
  state: () => ({
    list: [] as IAddress[],
  }),
  getters: {

  },
  actions: {
    // 保存用户地址
    saveAddress(list?: IAddress[], address?: IAddress) {
      if (list) {
        this.list = list;
      } else {
        this.list.push(address as IAddress);
      }
    },
    // 删除用户地址
    deleteAddress(id: string) {
      this.list = this.list.filter((item) => item.id !== id);
    },
    // 获取默认地址
    getDefaultAddress(): IAddress {
      return { ...this.list.filter((item) => item.is_default === true)[0] }
    },
    // 判断是否是默认地址是返回true
    isDefaultAddress(id: string) {
      const isDefault = this.list.filter((item) => item.id === id && item.is_default === true).length > 0 ? true : false;
      return isDefault
    },
    // 接收id 设置默认地址
    setDefaultAddress(id: string) {
      this.list.forEach((item) => {
        if (item.id === id) {
          item.is_default = true;
        } else {
          item.is_default = false; // Ensure only one item is set as default
        }
      });
    },
    // 清空用户地址
    clearAddress() {
      this.list = [];
    },
  },
});
