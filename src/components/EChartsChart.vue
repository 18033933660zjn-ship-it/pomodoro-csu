<template>
  <div ref="chartRef" class="w-full h-full min-h-[220px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  options: echarts.EChartsOption
  loading?: boolean
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value, 'dark', {
    renderer: 'svg'
  })

  chartInstance.setOption({
    backgroundColor: 'transparent',
    ...props.options
  })

  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize()
  })
  resizeObserver.observe(chartRef.value)
}

watch(
  () => props.options,
  (newOpt) => {
    if (chartInstance) {
      chartInstance.setOption({
        backgroundColor: 'transparent',
        ...newOpt
      }, { notMerge: true })
    }
  },
  { deep: true }
)

watch(
  () => props.loading,
  (isLoading) => {
    if (!chartInstance) return
    if (isLoading) {
      chartInstance.showLoading({
        text: '加载图表中...',
        color: '#ff4d4f',
        textColor: '#94a3b8',
        maskColor: 'rgba(15, 23, 42, 0.6)'
      })
    } else {
      chartInstance.hideLoading()
    }
  }
)

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

defineExpose({
  getInstance: () => chartInstance,
  resize: () => chartInstance?.resize()
})
</script>
