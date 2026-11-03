<template>
  <component :is="resolvedIcon" :class="className" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  BookOpen,
  GraduationCap,
  Dumbbell,
  Code,
  Sparkles,
  Target,
  Clock,
  Heart,
  Briefcase,
  Coffee,
  CheckCircle2,
  Folder
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    name: string
    className?: string
  }>(),
  {
    className: 'w-4 h-4'
  }
)

const resolvedIcon = computed(() => {
  switch (props.name) {
    case 'BookOpen':
      return BookOpen
    case 'GraduationCap':
      return GraduationCap
    case 'Dumbbell':
      return Dumbbell
    case 'Code':
      return Code
    case 'Sparkles':
      return Sparkles
    case 'Target':
      return Target
    case 'Clock':
      return Clock
    case 'Heart':
      return Heart
    case 'Briefcase':
      return Briefcase
    case 'Coffee':
      return Coffee
    case 'CheckCircle2':
      return CheckCircle2
    default:
      return Folder
  }
})
</script>
