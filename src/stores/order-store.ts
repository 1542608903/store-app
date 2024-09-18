import { defineStore } from 'pinia';
import { IOrder } from 'src/types/order';
import { IProductInfo } from 'src/types/product';
import { createOrder, getOrder } from 'src/api/order';

export const useOrderStore = defineStore('order', {
  state: () => ({
    list: [] as IOrder[],
  }),
  getters: {
  },
  actions: {
    async createOrderStore(data: IProductInfo[], id: string, total: number) {
      const res = await createOrder(data, id, total);
      this.list.push(res.result?.order as IOrder);
      return res?.code
    },
    async getOrderListStore() {
      await getOrder().then(res => {
        const data = res.result?.order as IOrder[]
        this.list = data
      }).catch(err => {
        throw err
      })
    },
  }
});
