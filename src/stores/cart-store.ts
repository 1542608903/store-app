import { defineStore } from 'pinia';
import { ICartItem } from 'src/types/cart';
import { getCartList } from 'src/api/cart';
export const useCartStore = defineStore('cart', {
  state: () => ({
    list: [] as ICartItem[],
    checkedAll: true,
    pageNum: 1,
    pageSize: 10,
  }),
  getters: {
    totalPrices(state) {
      let totalPrice = 0;
      state.list.map((item) => {
        if (item.selected) {
          totalPrice += item.product.goods_price * item.number;
        }
      });
      return Number(totalPrice.toFixed(2));
    },
  },

  actions: {
    // 添加购物车
    addCart(cart: ICartItem) {
      // 通过商品的 id 判断是否存在相同的商品
      const index = this.list.findIndex(
        (item) => item.goods_id === cart.goods_id
      );
      if (index !== -1) {
        // 如果存在相同的商品，数量 +1
        this.list[index].number = cart.number;
      } else {
        // 如果不存在，插入一条新的购物车项
        this.list.push(cart);
      }
    },

    saveCart(data: ICartItem[]) {
      this.list = data;
    },
    async queryCart() {
      try {
        const res = await getCartList(this.pageNum, this.pageSize);
        const data = (res.result?.list as ICartItem[]) || [];
        this.list = data;
      } catch (error) {
        throw error;
      }
    },

    // 清除所有选择的购物车
    clearCart() {
      this.list = this.list.filter((item: ICartItem) => item.selected);
    },

    // 删除购物车
    remove(ids: Array<number>) {
      this.list = this.list.filter((item) => !ids.includes(item.id));
    },

    updateCartList<T extends keyof ICartItem>(
      id: number,
      key: T,
      value: ICartItem[T]
    ) {
      const index = this.list.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.list[index][key] = value;
      }
    },
  },
  persist: {
    key: 'carts',
    storage: localStorage,
    pick: ['list', 'checkedAll'],
  },
});
