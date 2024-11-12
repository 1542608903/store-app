<script setup>
import VuePictureCropper, { cropper } from 'vue-picture-cropper';

import { ref } from 'vue';
console.log(cropper);

const pic = ref(null);
const onFile = (e) => {
  console.log(e);
};
</script>
<template>
  <div class="bg-red" style="width: 500px; height: 500px">
    <input type="file" @click="onFile" />
    <template>
      <VuePictureCropper
        :boxStyle="{
          width: '100%',
          height: '100%',
          backgroundColor: '#f8f8f8',
          margin: 'auto',
        }"
        :img="pic"
        :options="{
          viewMode: 1,
          dragMode: 'crop',
          aspectRatio: 16 / 9,
        }"
      />
    </template>
  </div>
</template>
<style lang="css" scoped></style>
<!-- <script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const prompt = ref(false);

const open = () => (prompt.value = true);
const colse = () => (prompt.value = true);
const files = ref(null);

// 暴露
defineExpose({
  open,
  colse,
});

const onRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} 文件未通过验证约束`,
  });
};

const addFile = (file) => {
  files.value = file;
};

const emit = defineEmits(['upload:file']);

const handleFile = () => {
  emit('upload:file', files.value);
  colse();
};
</script>
<template>
  <div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">头像上传</div>
        </q-card-section>
        <q-card-section class="upload-box q-pt-none">
          <q-uploader
            :auto-upload="false"
            hide-upload-btn
            @added="addFile"
            style="max-width: 400px"
            label="选择头像"
            multiple
            accept=".jpg, image/*"
            @rejected="onRejected"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup />
          <q-btn flat label="上传" @click="handleFile" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style lang="css" scoped>
.upload-box {
  display: flex;
  justify-content: center;
}
</style> -->
