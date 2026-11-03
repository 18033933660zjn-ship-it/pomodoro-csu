import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DailyReflection } from '@/types'
import { StorageService } from '@/utils/storage'

export const useReflectionStore = defineStore('reflections', () => {
  const reflections = ref<Record<string, DailyReflection>>(StorageService.getReflections())

  function save() {
    StorageService.saveReflections(reflections.value)
  }

  function getReflection(dateStr: string): DailyReflection | undefined {
    return reflections.value[dateStr]
  }

  function setReflection(reflection: DailyReflection) {
    reflections.value[reflection.date] = reflection
    save()
  }

  function reload() {
    reflections.value = StorageService.getReflections()
  }

  return {
    reflections,
    getReflection,
    setReflection,
    reload
  }
})
