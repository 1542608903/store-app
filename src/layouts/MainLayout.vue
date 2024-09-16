<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>
        <!-- 搜索 -->
        <q-toolbar-title>简易商店</q-toolbar-title>
        <q-toolbar class="bg-primary text-white rounded-borders" style="max-width: 200px;">
          <q-space />
          <q-input dark dense standout v-model="text" input-class="text-right" class="q-ml-md" debounce="1000">
            <template v-slot:append>
              <q-icon v-if="text === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" @clear="getValue" />
            </template>
          </q-input>
        </q-toolbar>
        <div class="q-pa-md">
          <q-btn-dropdown class="glossy" color="purple"
            :icon="userStore.isLogin ? 'fa-solid fa-gear' : 'fa-solid fa-right-to-bracket'">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-toggle v-model="isDark" label="暗色模式" />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <div v-show="userStore.isLogin">
                  <q-avatar size="72px">
                    <img :src="userStore.userInfo.avatar">
                  </q-avatar>
                  <div class="text-subtitle1 q-mt-md q-mb-xs"></div>
                </div>

                <q-btn color="primary" :label="userStore.isLogin ? '注销' : '登录'" push size="md" v-close-popup
                  @click="userStore.isLogin ? userStore.clearUserInfo() : router.push('/login')" />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>

      <q-tabs dense>
        <q-route-tab class="my-tab-label" v-for="(tab, index) in tabs" :key="index" :to="tab.path" :icon="tab.meta.icon"
          :label="tab.meta.title" :disable="!userStore.isLogin && tab.path !== '/'" />
      </q-tabs>

    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserStore } from 'src/stores/user-store';
import { useProductStore } from 'src/stores/product-store';
import { generateRoutes } from 'src/router/routes';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
const userStore = useUserStore();
const productStore = useProductStore();
const tabs = generateRoutes();
const isDark = ref(false);
const $q = useQuasar();
const text = ref('');
const router = useRouter();

watch(isDark, () => {
  $q.dark.set(isDark.value);
})

watch(text, async () => {
  productStore.searchProduct(text.value);
})

defineOptions({
  name: 'MainLayout'
});

const getValue = () => {
}
</script>

<style>
a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
</style>
