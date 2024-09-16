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
        res.result.list.forEach((item: IProduct) => {
          item.checked = false;
        })
        // 保存商品
        this.list.push(...res.result.list);
        done();
      })
    },
    /**
     * 搜索商品
     * @param value
     */
    async searchProduct(value: string) {
      try {
        const res = await getSearch(value);

        // 确保 res.result 和 res.result.list 存在且为数组
        if (res.result && Array.isArray(res.result.list)) {
          this.clearProduct();  // 清空旧商品

          // 使用 map 遍历商品列表
          res.result.list.map((item: IProduct) => {
            item.checked = false;
            this.list.push(item);  // 保存商品到列表中
          });
        } else {
          console.warn('Search result list is not available or is not an array:', res.result);
        }
      } catch (error) {
        console.error('Error occurred during product search:', error);
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
