import { defineStore } from 'pinia';
import { IProduct, IProductInfo } from 'src/types/product';
import { watch } from 'vue';
export const useCartStore = defineStore('cart', {
  state: () => ({
    cartList: [] as IProduct[],
    total: 0 as number,
    checkedAll: false as boolean,
  }),
  getters: {
    // 商品列表数量
    cartListLength(state) {
      // 计算每一项商品选择时的数量之和
      return state.cartList.reduce((total, item) => total + item.goods_num, 0);
    },
    // 商品总价
    cartTotalPrice(state) {
      let totalPrice = 0;
      state.cartList.forEach((item) => {
        if (item.checked) {
          totalPrice += item.goods_price * item.goods_num;
        }
      });
      // 结果保留后两位
      state.total = +totalPrice.toFixed(2);
      return +totalPrice.toFixed(2);
    },

    // 监听checkedAll
    watchCheckedAll(state) {
      watch(() => state.checkedAll, (checkedAll) => {
        state.cartList.forEach((item) => {
          item.checked = checkedAll;
        })
      })
    }
  },
  actions: {
    // 判断商品id是否相等相等就增加商品的数量否则push到cartList数组中
    addToCart(item: IProduct) {
      const index = this.cartList.findIndex((cartItem) => cartItem.id === item.id);
      if (index !== -1) {
        this.cartList[index].goods_num += 1;
      } else {
        this.cartList.push({ ...item, goods_num: 1 });
      }
    },
    updateCartNum(id: string, num: number) {
      const index = this.cartList.findIndex((item) => item.id === id);
      if (index !== -1) {
        if (num <= 0) {
          this.removeCart(id);
          return;
        }
        this.cartList[index].goods_num = num;
      }
    },
    // 删除购物车商品
    removeCart(id: string) {
      const index = this.cartList.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.cartList.splice(index, 1);
      }
    },
    // 清空购物车
    clearCart() {
      this.cartList = [];
    },
    // 单选
    checkOne(id: string, checked: boolean) {
      const index = this.cartList.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.cartList[index].checked = checked;
      }
    },
    // // 全选和反选
    checkAll() {
      this.cartList.forEach((item) => {
        item.checked = this.checkedAll;
      })
    },
    // 获取所有选中的商品
    getCheckedList() {
      const checkedList = this.cartList.filter((item) => item.checked);
      return checkedList.map((item) => {
        return {
          id: item.id,
          goods_price: item.goods_price,
          quantity: item.goods_num,
        } as IProductInfo;
      });
    }
  },
});
