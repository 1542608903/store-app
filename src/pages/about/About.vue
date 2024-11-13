<template>
  <q-page class="about-page">
    <q-card class="q-pa-md singe-line" flat bordered>
      <q-card-section>
        <!-- 标题部分 -->
        <div class="q-mb-md text-center">
          <p class="text-h5 text-primary q-mb-xs">项目信息</p>
          <p class="text-subtitle2 text-grey-6">了解我们的基本信息</p>
        </div>

        <!-- 公司名称 -->
        <q-item-label class="text-h6 text-primary"
          >项目名称：{{ info.name }}</q-item-label
        >

        <!-- 联系方式 -->
        <q-item-label class="text-h6 text-primary">
          <span>我的邮箱：</span>
          <a :href="`mailto:${info.email}`" class="q-link">{{ info.email }}</a>
        </q-item-label>

        <!-- 项目地址 -->
        <q-item-label class="text-h6 text-primary"
          >项目地址：
          <a :href="info.address" class="q-link">Github</a></q-item-label
        >
        <!-- 备案号 -->
        <q-item-label class="text-h6 text-primary"
          >我的备案：<a href="https://beian.miit.gov.cn/#/Integrated/index">{{
            info.icp
          }}</a>
        </q-item-label>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    const info = ref({
      name: '伟大的公司有限公司',
      description: '我们是一家专注于提供优质服务的公司',
      address: 'https://github.com/1542608903/store-app',
      email: '255474348@qq.com',
      icp: '琼ICP备xxxxxxx号',
    });
    return {
      info,
    };
  },
};
</script>

<style scoped>
.q-card {
  max-width: 600px;
  background-color: #fff;
  margin: 0 auto;
}

.q-card-section {
  padding: 20px;
}

.q-item-label {
  font-weight: bold;
  color: #333;
}

.q-item-section {
  font-size: 14px;
  color: #555;
}

.q-link {
  text-decoration: none;
  color: #027be3;
}

.q-link:hover {
  text-decoration: underline;
}
.singe-line {
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
}
</style>
