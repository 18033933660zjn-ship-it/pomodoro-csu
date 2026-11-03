import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types'
import { StorageService } from '@/utils/storage'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>(StorageService.getCategories())

  function save() {
    StorageService.saveCategories(categories.value)
  }

  function getCategoryById(id: string): Category | undefined {
    return categories.value.find(c => c.id === id)
  }

  function addCategory(category: Omit<Category, 'id'>) {
    const newCat: Category = {
      ...category,
      id: `cat-${Date.now()}`
    }
    categories.value.push(newCat)
    save()
    return newCat
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      categories.value[idx] = { ...categories.value[idx], ...updates }
      save()
    }
  }

  function deleteCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
    save()
  }

  function reload() {
    categories.value = StorageService.getCategories()
  }

  return {
    categories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
    reload
  }
})
