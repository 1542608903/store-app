import { defineStore } from 'pinia';
import { IAddress } from 'src/types/address';
import { queryAddress } from 'src/api/address';

export const useAddressStore = defineStore('address', {
  state: () => ({
    list: [] as IAddress[],
  }),
  getters: {},
  actions: {
    saveAddress(data: IAddress[]) {
      this.list = data;
    },

    deleteAddressStore(id: number) {
      const i = this.list.findIndex((item) => item.id === id);
      this.list.splice(i, 1);
    },
    updateAddressStore(id: number) {
      // 确保找到了目标地址
      const j = this.list.findIndex((item) => item.id === id);
      if (j === -1) return;
      // 将当前默认项重置为 false，并设置目标项为 true
      this.list.forEach((item) => (item.is_default = false));
      this.list[j].is_default = true;
    },
    async query(): Promise<IAddress> {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await queryAddress();
          const data = res.result as IAddress;
          resolve(data);
        } catch (error) {
          reject(error);
        }
      })
    },
  },
  persist: {
    storage: localStorage,
  },
});
