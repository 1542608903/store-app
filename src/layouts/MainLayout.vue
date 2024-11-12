<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
        </q-avatar>
        <q-toolbar-title></q-toolbar-title>
        <!-- 搜索 -->
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-space />
          <div class="search-box">
            <q-input
              dark
              dense
              standout
              v-model="text"
              input-class="text-right"
              debounce="1000"
              label="搜索"
              @update:model-value="search(text)"
              @focus="showList = true"
              @blur="showList = false"
            >
              <template v-slot:append>
                <q-icon v-if="text === ''" name="search" />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="text = ''"
                />
              </template>
            </q-input>
            <q-list class="list" v-show="showList">
              <q-scroll-area class="list-scroll-area">
                <q-item
                  clickable
                  v-ripple
                  v-for="item in list"
                  :key="item.id"
                  :to="{ path: `/detail`, query: { ...item } }"
                >
                  <q-item-section avatar>
                    <q-img
                      width="80px"
                      :ratio="1"
                      :src="item.goods_img"
                      spinner-color="white"
                    />
                  </q-item-section>
                  <q-item-section>{{ item.goods_name }}</q-item-section>
                </q-item>
              </q-scroll-area>
            </q-list>
          </div>
        </q-toolbar>
        <div class="q-pa-md">
          <q-btn-dropdown
            :icon="
              userStore.isLogin
                ? 'fa-solid fa-gear'
                : 'fa-solid fa-right-to-bracket'
            "
            style="max-width: 70px"
          >
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-toggle
                  v-model="isDark"
                  :icon="isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'"
                  @update:model-value="openDark(isDark)"
                  :label="isDark ? 'Dark' : 'Light'"
                />
              </div>
              <q-separator vertical inset class="q-mx-lg" />
              <div class="column items-center">
                <div v-show="userStore.isLogin">
                  <q-avatar size="72px">
                    <img :src="userStore.userInfo.avatar" />
                  </q-avatar>
                  <div class="text-subtitle1 q-mt-md q-mb-xs"></div>
                </div>

                <q-btn
                  color="primary"
                  :label="userStore.isLogin ? '注销' : '登录'"
                  push
                  size="md"
                  v-close-popup
                  @click="
                    userStore.isLogin ? loginOut() : router.push('/login')
                  "
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>

      <q-tabs dense>
        <q-route-tab
          class="my-tab-label"
          v-for="(tab, index) in tabs"
          :key="index"
          :to="tab.path"
          :icon="tab.icon"
          :label="tab.title"
          :disable="!userStore.isLogin && tab.path !== '/'"
        />
      </q-tabs>
    </q-header>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <!-- :exclude="['ProductDetail', 'Cart', 'OrderDetail']" -->
        <keep-alive :include="['Home']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getMenus } from 'src/router/routes';
import useSearchProduct from 'src/hooks/useSearchProduct';

const userStore = useUserStore();
const router = useRouter();
const $q = useQuasar();
const tabs = getMenus();
const text = ref('');
const isDark = ref(false);
const showList = ref(false);
const { searchProduct, list } = useSearchProduct();

const openDark = (v: boolean) => {
  $q.dark.set(isDark.value);
  isDark.value = v;
};

const search = async (text: string) => {
  // 排除无效字符 例如空格

  if (text.length < 1) {
    return;
  }
  console.log(text.length);
  showList.value = true;
  await searchProduct(text);
};

const loginOut = () => {
  localStorage.clear();
  $q.notify({
    message: '注销成功！正在退出',
    color: 'green-4',
    icon: 'fa-regular fa-circle-check',
    position: 'top',
  });

  setTimeout(() => {
    window.location.href = '/';
  }, 2000);
};

defineOptions({
  name: 'MainLayout',
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
.list {
  margin-top: 6px;
  height: auto;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  z-index: 999;
  transition: margin-bottom 1s;
}
.list-scroll-area {
  width: inherit;
  height: 300px;
}

.q-item {
  /* width: 300px; */
  margin: 0 auto;
  background-color: rgba(241, 241, 241, 0.911);
  color: #000;
}
</style>
