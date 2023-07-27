<template>
  <span style="font-size: 0.75rem; line-height: 1rem; padding: 0 0.5rem;">今日访问人数 {{ count }}</span>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const setVisitUrl = 'https://e4f011f364b0-15729517808414078489.ngrok-free.app/blog/setVisit'

const count = ref(0)

;(async () => {
  const { data } = await axios.get(setVisitUrl)
  count.value = data.data
})()
</script>