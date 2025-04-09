import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', () => {
  let content = ref('')
  function setContent(newContent) {
    content.value = newContent
  }
  return { content, setContent }
})
