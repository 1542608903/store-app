import { watch } from 'vue';
import { defineStore } from 'pinia';
import { IProduct, IProductInfo } from 'src/types/product';
import { createCart, getCartList, selectAllCart, unSelectAllCart, removeCart, selectOneCart } from 'src/api/cart';
import { ICartItem } from 'src/types/cart';
import { debounce } from 'quasar'



const debouncedSelectOneCart = debounce(async (id: number, number: number, selected: boolean) => {
  await selectOneCart(id, { goods_num: number, selected });
}, 1500);

export const useCartStore = defineStore('cart', {
  state: () => ({
    list: [] as ICartItem[],
    total: 0 as number,
    checkedAll: false as boolean,
  }),
  getters: {
    // 商品总价
    totalPrice(state) {
      let totalPrice = 0;
      state.list.forEach((item) => {
        if (item.selected) {
          // 计算每一项商品选择时的总价
          totalPrice += item.product.goods_price * item.number;
        }
      });
      // 结果保留后两位
      state.total = +totalPrice.toFixed(2);
      return +totalPrice.toFixed(2);
    },

    // 监听checkedAll
    watchCheckedAll(state) {
      watch(() => state.checkedAll, (checkedAll) => {
        state.list.forEach((item) => {
          item.product.checked = checkedAll;
        })
      })
    }
  },

  actions: {
    async getCartList() {
      await getCartList().then(res => {
        const data = res.result?.list as ICartItem[]
        this.list = data.map((item: ICartItem) => {
          return {
            ...item,
            product: {
              ...item.product,
              goods_num: item.number
            }
          }
        })
      }).catch(err => {
        throw err
      })
    },
    async addToCart(product: IProduct) {
      const goods_id = product.id
      const goods_num = 1
      await createCart(goods_id, goods_num).then(res => {
        return res
      }).catch(err => {
        throw err
      })

    },
    // 删除购物车商品
    async removeCart(ids: Array<number>) {

      await removeCart(ids);
      this.getCartList();
    },
    // 清空购物车
    async clearCart() {
      const ids: Array<number> = [];
      this.list.filter((item) => {
        return item.selected ? ids.push(item.id) : null;
      });
      await removeCart(ids);
      this.list = [];
    },
    // 单选
    async checkOne(value: ICartItem) {
      debouncedSelectOneCart(value.id, value.number, value.selected);
    },
    // // 全选和反选
    async checkAll(value: boolean) {
      if (value) {
        await selectAllCart();
        this.getCartList();
      } else {
        await unSelectAllCart();
        this.getCartList();
      }
    },
    // 获取所有选中的商品
    getCheckedList() {
      const checkedList = this.list.filter((item) => item.selected);
      return checkedList.map((item) => {
        return {
          id: item.product.id,
          goods_price: item.product.goods_price,
          quantity: item.number,
        } as IProductInfo;
      });
    }
  },
});
