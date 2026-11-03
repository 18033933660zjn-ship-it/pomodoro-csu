import { createRouter, createWebHistory } from 'vue-router'
import TimerView from '@/views/TimerView.vue'
import TasksView from '@/views/TasksView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import TimelineView from '@/views/TimelineView.vue'
import ReportsView from '@/views/ReportsView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'timer',
    component: TimerView
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: ScheduleView
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: TimelineView
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportsView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
