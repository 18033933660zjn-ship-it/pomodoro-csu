import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types'
import { StorageService } from '@/utils/storage'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(StorageService.getTasks())

  function save() {
    StorageService.saveTasks(tasks.value)
  }

  const activeTasks = computed(() => tasks.value.filter(t => !t.completed))
  const completedTasks = computed(() => tasks.value.filter(t => t.completed))

  function getTasksByCategory(categoryId: string) {
    return tasks.value.filter(t => t.categoryId === categoryId)
  }

  function addTask(task: { categoryId: string; title: string; estimatedPomodoros?: number; notes?: string }) {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      categoryId: task.categoryId,
      title: task.title,
      completed: false,
      estimatedPomodoros: task.estimatedPomodoros || 2,
      completedPomodoros: 0,
      notes: task.notes || '',
      createdAt: new Date().toISOString()
    }
    tasks.value.unshift(newTask)
    save()
    return newTask
  }

  function toggleTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      task.completedAt = task.completed ? new Date().toISOString() : undefined
      save()
    }
  }

  function incrementTaskPomodoro(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completedPomodoros += 1
      save()
    }
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tasks.value[idx] = { ...tasks.value[idx], ...updates }
      save()
    }
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
    save()
  }

  function reload() {
    tasks.value = StorageService.getTasks()
  }

  return {
    tasks,
    activeTasks,
    completedTasks,
    getTasksByCategory,
    addTask,
    toggleTask,
    incrementTaskPomodoro,
    updateTask,
    deleteTask,
    reload
  }
})
