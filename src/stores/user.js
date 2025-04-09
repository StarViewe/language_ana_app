import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let userInfo = ref({
    username: '游客',
    email: 'none',
    phoneNumber: 'none',
    unit: 'none',
  })
  function setUserInfo(data) {
    userInfo.value = data
  }
  return { userInfo, setUserInfo }
})
