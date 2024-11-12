<template>
  <q-page class="bg-blue">
    <div class="text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 30vh">404</div>
        <div class="text-h2">Oops. Nothing here...</div>
        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="blue"
          unelevated
          to="/"
          label="Go Home"
          no-caps
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ErrorNotFound',
});
</script>
