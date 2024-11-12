import { defineStore } from 'pinia';
import { IOrder } from 'src/types/order';
import { getOrder } from 'src/api/order';

export const useOrderStore = defineStore('order', {
  state: () => ({
    list: [] as IOrder[],
  }),
  getters: {},
  actions: {
    async OrderListStore(pageNum: number = 1, pageSize: number = 5) {
      await getOrder(pageNum, pageSize)
        .then((res) => {
          const data = res.result?.list as IOrder[];
          if (res.code === 0 && data.length > 0) {
            this.list = data;
          }
        })
        .catch((error) => {
          throw error;
        });
    },
  },
});
