import { defineStore } from 'pinia';
import { IProduct } from 'src/types/product';
import { getProducts, getSearch } from 'src/api/product';

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [] as IProduct[],
    count: 20,
  }),
  getters: {

  },
  actions: {
    /**
     * 获取商品
     * @param index
     * @param done
     */
    async saveProduct(index: number, done: () => void) {
      await getProducts(index, this.count).then((res) => {
        const data = res.result?.list as IProduct[];
        if (data.length === 0) {
          done();
          return;
        }
        // 更新产品列表
        this.list = [...this.list, ...data.map(item => item)];
        // 调用 done() 表示数据加载完成
        done();
      }).catch((error) => {

        done();
        throw error;
      });
    },
    /**
     * 搜索商品
     * @param value
     */
    async searchProduct(value: string) {
      try {
        await getSearch(value).then((res) => {
          const data = res.result?.list as IProduct[];
          if (data.length === 0) return;
          this.clearProduct();
          this.list = [...data.map(item => item)];
        })
      } catch (error) {
        throw error
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
