<template>
  <div class="carousel-container">
    <q-carousel v-model="slide" swipeable animated infinite autoplay interval="3000" control-color="white"
      prev-icon="keyboard_arrow_left" next-icon="keyboard_arrow_right" navigation navigation-position="bottom"
      class="carousel">
      <q-carousel-slide v-for="(slideImages, index) in chunkedImages" :key="index">
        <div class="image-container">
          <q-img v-for="(image, i) in slideImages" :key="i" :src="image" class="carousel-img"
            :placeholder-src="image" />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 当前轮播的索引
const slide = ref(0)

// 图片数组
const images = [
  'https://cdn.quasar.dev/img/mountains.jpg',
  'https://cdn.quasar.dev/img/parallax1.jpg',
  'https://cdn.quasar.dev/img/parallax2.jpg',
  'https://cdn.quasar.dev/img/mountains.jpg',
  'https://cdn.quasar.dev/img/parallax1.jpg',
  'https://cdn.quasar.dev/img/parallax2.jpg'
]

// 将图片按每3张一组进行拆分
const chunkedImages = computed(() => {
  const chunkSize = 3
  const result = []
  for (let i = 0; i < images.length; i += chunkSize) {
    result.push(images.slice(i, i + chunkSize))
  }
  return result
})
</script>

<style scoped>
.carousel-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.carousel {
  height: 300px;
}

.image-container {
  display: flex;
  justify-content: space-between;
}

.carousel-img {
  width: 32%;
  /* 设置图片宽度为父容器的32% */
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}
</style>
