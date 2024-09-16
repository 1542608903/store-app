<script setup>
import { useRouter } from 'vue-router'
import NoData from 'src/components/NoData.vue';

const reuter = useRouter()
function go() {
  reuter.push('/');

}
</script>
<template>
  <q-page v-if="false">
  </q-page>
  <NoData message="没有开发" icon="fa-solid fa-user" @confirm="go" button-text="去首页" v-else />

</template>
<style lang="css" scoped></style>
