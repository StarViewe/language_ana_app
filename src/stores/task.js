import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', () => {
  let tasks = ref([])
  function setTasks(newTask) {
    tasks.value = [...tasks.value, newTask]
  }

  return { tasks, setTasks }
})
