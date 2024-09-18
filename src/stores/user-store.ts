import { defineStore } from 'pinia';
import { IUser } from 'src/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as IUser,
    isLogin: false as boolean,
  }),
  getters: {},
  actions: {
    // 保存用户信息
    saveUserInfo(userInfo: IUser) {
      this.userInfo = userInfo;
      this.isLogin = true;
    },

    // 清除用户信息
    clearUserInfo() {
      this.userInfo = {} as IUser;
      this.isLogin = false;
    },
  },
  persist: {
    storage: localStorage,
  }
});
