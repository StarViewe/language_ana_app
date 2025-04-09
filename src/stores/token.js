import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', () => {
  let tokenInfo = ref('')
  let token = computed(() => {
    try {
      return tokenInfo.value || window.localStorage.getItem('TokenInfo') || ''
    } catch (err) {
      console.error(err)
      window.localStorage.setItem('TokenInfo', '')
      throw new Error('格式错误')
    }
  })
  function setToken(data) {
    tokenInfo.value = data
    window.localStorage.setItem('TokenInfo', data)
  }

  return { token, setToken }
})
