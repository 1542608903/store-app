import { defineStore } from 'pinia';
import { IProduct } from 'src/types/product';
import { getSearch } from 'src/api/product';

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [] as IProduct[],
    count: 16,
  }),
  getters: {},
  actions: {
    /**
     * 保存商品
     */
    saveProduct(data: IProduct[]) {
      this.list.push(...data);
    },

    /**
     * 搜索商品
     * @param value
     */
    async searchProduct(value: string) {
      try {
        if (!value) {
          return;
        }
        this.list = [];
        await getSearch(value).then((res) => {
          const data = res.result?.list as IProduct[];
          if (data.length === 0) return;
          this.list = [...data.map((item) => item)];
        });
      } catch (error) {
        throw error;
      }
    },
    resetProductList() {
      if (this.list.length > 0) {
        return this.list;
      }
    },
    /**
     * 清除商品
     */
    clearProduct() {
      this.list = [];
    },
  },
});
