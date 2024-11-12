import { defineStore } from 'pinia';
import { IUser } from 'src/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as IUser,
    isLogin: false,
  }),
  getters: {},
  actions: {
    // 保存用户信息
    saveUserInfo(userInfo: IUser) {
      this.userInfo = userInfo;
      this.isLogin = true;
    },
  },
  persist: {
    storage: localStorage,
  },
});
