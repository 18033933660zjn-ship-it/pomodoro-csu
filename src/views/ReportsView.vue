<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-100 tracking-tight">四维统计汇总与多维复盘</h2>
        <p class="text-xs text-slate-400 mt-0.5">从日、周、月、季多重视角洞察时间分配，沉淀学习与运动轨迹</p>
      </div>

      <!-- Granularity Tabs -->
      <div class="flex p-1 bg-slate-800/90 rounded-xl border border-slate-700/80 shadow-sm">
        <button
          v-for="tab in reportTabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
          :class="[
            activeTab === tab.key
              ? 'bg-tomato-500 text-white shadow-md shadow-tomato-500/25'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          <component :is="tab.icon" class="w-3.5 h-3.5" />
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 1. 日报模式 (DAILY REPORT) -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'daily'" class="space-y-6">
      <!-- Date Selector -->
      <div class="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
        <div class="flex items-center gap-2">
          <button
            @click="changeDailyDate(-1)"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-sm font-bold text-slate-200 font-mono">{{ dailyDateFormatted }}</span>
          <button
            @click="changeDailyDate(1)"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <button
          @click="dailyDate = dayjs().format('YYYY-MM-DD')"
          class="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-650"
        >
          查看今日
        </button>
      </div>

      <!-- Daily Metric Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">今日专注总时长</div>
          <div class="text-xl font-bold font-mono text-slate-100 mt-1">
            {{ Math.floor(dailyTotalMinutes / 60) }}h {{ dailyTotalMinutes % 60 }}m
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">完成番茄次数</div>
          <div class="text-xl font-bold font-mono text-tomato-400 mt-1">
            {{ dailyLogs.length }} <span class="text-xs text-slate-400">次</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">最主要专注领域</div>
          <div class="text-sm font-bold text-slate-200 mt-1 truncate">
            {{ topDailyCategory?.name || '无记录' }}
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">今日专注评分</div>
          <div class="text-xl font-bold font-mono text-amber-400 mt-1">
            {{ dailyReflection?.score || 5 }} / 5 ⭐
          </div>
        </div>
      </div>

      <!-- Daily Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 24h Hourly Distribution -->
        <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
            <Clock class="w-4 h-4 text-tomato-400" />
            24 小时各时段专注分布 (分钟)
          </h4>
          <div class="h-64">
            <EChartsChart :options="dailyHourlyChartOption" />
          </div>
        </div>

        <!-- Category Donut Pie Chart -->
        <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
            <PieChart class="w-4 h-4 text-purple-400" />
            今日时间分配占比环形图
          </h4>
          <div class="h-64">
            <EChartsChart :options="dailyCategoryChartOption" />
          </div>
        </div>
      </div>

      <!-- Daily Review Note -->
      <div class="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50">
        <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
          <Sparkles class="w-4 h-4 text-amber-400" />
          今日反思与复盘日志 (Daily Review)
        </h4>
        <p class="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          {{ dailyReflection?.summary || '今日专注节奏良好，高质量完成了设定的学习与运动任务。' }}
        </p>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 2. 周报模式 (WEEKLY REPORT) -->
    <!-- ========================================== -->
    <div v-else-if="activeTab === 'weekly'" class="space-y-6">
      <!-- Week Selector -->
      <div class="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
        <div class="flex items-center gap-2">
          <button
            @click="changeWeek(-1)"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-sm font-bold text-slate-200 font-mono">{{ weeklyRangeFormatted }}</span>
          <button
            @click="changeWeek(1)"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <button
          @click="currentWeekOffset = 0"
          class="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-650"
        >
          本周
        </button>
      </div>

      <!-- Weekly Metric Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">本周总专注时间</div>
          <div class="text-xl font-bold font-mono text-slate-100 mt-1">
            {{ (weeklyTotalMinutes / 60).toFixed(1) }} <span class="text-xs text-slate-400">小时</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">日均有效工时</div>
          <div class="text-xl font-bold font-mono text-indigo-400 mt-1">
            {{ (weeklyTotalMinutes / 7 / 60).toFixed(1) }} <span class="text-xs text-slate-400">h / 天</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">打卡活跃天数</div>
          <div class="text-xl font-bold font-mono text-emerald-400 mt-1">
            {{ weeklyActiveDaysCount }} / 7 <span class="text-xs text-slate-400">天</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">周目标达成度</div>
          <div class="text-xl font-bold font-mono text-orange-400 mt-1">
            {{ weeklyTargetCompletionRate }}%
          </div>
        </div>
      </div>

      <!-- Weekly 7-Day Trend Chart -->
      <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
        <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <BarChart3 class="w-4 h-4 text-emerald-400" />
          本周 7 天各分类时长堆叠与趋势走向 (小时)
        </h4>
        <div class="h-72">
          <EChartsChart :options="weeklyTrendChartOption" />
        </div>
      </div>

      <!-- Weekly Category Breakdown Progress Bars -->
      <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
        <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Target class="w-4 h-4 text-tomato-400" />
          各核心领域周目标达成情况明细
        </h4>
        <div class="space-y-3 pt-2">
          <div
            v-for="cat in weeklyCategoryStats"
            :key="cat.id"
            class="space-y-1.5"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="flex items-center gap-2 font-medium text-slate-200">
                <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></span>
                {{ cat.name }}
              </span>
              <span class="text-slate-400 font-mono">
                已完成 {{ (cat.actualMinutes / 60).toFixed(1) }}h / 目标 {{ (cat.targetMinutes / 60).toFixed(1) }}h
                ({{ Math.round((cat.actualMinutes / cat.targetMinutes) * 100) }}%)
              </span>
            </div>
            <div class="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{
                  width: `${Math.min(100, (cat.actualMinutes / cat.targetMinutes) * 100)}%`,
                  backgroundColor: cat.color
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Automated Sunday Coaching Review Card (用户专属自动化周总结汇报) -->
      <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 shadow-soft-lg space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <ShieldCheck class="w-5 h-5 text-tomato-400" />
                周日自动化督学总结与周度汇报
              </span>
              <span
                class="text-xs px-2.5 py-0.5 rounded-full font-bold font-mono"
                :class="[
                  weeklyReview.overallGrade === 'S'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : weeklyReview.overallGrade === 'A'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                ]"
              >
                评级: GRADE {{ weeklyReview.overallGrade }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-1">
              每周日完成全周攻坚后如实汇报周一至周日全维任务达成、自习室守纪与长短板反思
            </p>
          </div>

          <!-- Punctuality Pill -->
          <div class="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700">
            <span class="text-xs text-slate-400">自习室准时就位率:</span>
            <span
              class="font-mono font-bold text-sm"
              :class="weeklyReview.punctualityRate >= 90 ? 'text-emerald-400' : 'text-amber-400'"
            >
              {{ weeklyReview.punctualityRate }}%
            </span>
          </div>
        </div>

        <!-- Four Tasks Core Verification Matrix -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <div class="text-[11px] text-slate-400">任务1: 雅思+AI科研</div>
            <div class="text-base font-mono font-bold text-purple-400 mt-0.5">
              {{ weeklyReview.task1Hours.actual }}h / {{ weeklyReview.task1Hours.target }}h
            </div>
            <div class="text-[10px] text-slate-500 mt-0.5">日均 3h · 7天全勤攻坚</div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <div class="text-[11px] text-slate-400">任务2: 习概+双创</div>
            <div class="text-base font-mono font-bold text-amber-400 mt-0.5">
              {{ weeklyReview.task2Hours.actual }}h / {{ weeklyReview.task2Hours.target }}h
            </div>
            <div class="text-[10px] text-slate-500 mt-0.5">周一至周六 6天 · 每天90m</div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <div class="text-[11px] text-slate-400">任务3: 专业课三科</div>
            <div class="text-base font-mono font-bold text-blue-400 mt-0.5">
              {{ weeklyReview.task3Hours.total.actual }}h / {{ weeklyReview.task3Hours.total.target }}h
            </div>
            <div class="text-[10px] text-slate-500 mt-0.5">生物力学+科研方法+竞赛学</div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
            <div class="text-[11px] text-slate-400">周末专项: 健身房高强度</div>
            <div class="text-base font-mono font-bold text-emerald-400 mt-0.5">
              {{ weeklyReview.fitnessHours.actual }}h / {{ weeklyReview.fitnessHours.target }}h
            </div>
            <div class="text-[10px] text-slate-500 mt-0.5">周六/周日 10:00 各2.5h</div>
          </div>

          <!-- Extra Study Overtime Banner -->
          <div v-if="weeklyReview.extraHours > 0" class="col-span-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-amber-400 shrink-0" />
              <span class="text-xs font-bold text-amber-300">本周空闲自主多学加餐：</span>
              <span class="text-xs text-slate-300">{{ weeklyReview.extraDetails?.map(d => `${d.name} ${d.hours}h`).join('、') }}</span>
            </div>
            <span class="text-xs font-mono font-bold text-amber-400 shrink-0">
              累计额外超额多学 +{{ weeklyReview.extraHours }} 小时
            </span>
          </div>
        </div>

        <!-- Punctuality & Late details -->
        <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 text-tomato-400" />
              全周自习室 / 健身房打卡执行统计
            </span>
            <span class="font-mono text-slate-400">
              准时 {{ weeklyReview.totalOnTime }} 次 · 迟到 {{ weeklyReview.totalLate }} 次 · 缺卡 {{ weeklyReview.totalMissed }} 次
            </span>
          </div>

          <div v-if="weeklyReview.lateRecords.length === 0" class="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>太棒了！本周所有既定自习室节点均在规定时间前到达并打卡，无任何迟到记录！</span>
          </div>

          <div v-else class="space-y-1.5 pt-1">
            <div
              v-for="rec in weeklyReview.lateRecords"
              :key="rec.id"
              class="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between text-xs"
            >
              <div class="flex items-center gap-2">
                <AlertTriangle class="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span class="text-slate-200 font-medium">{{ rec.date }} ({{ rec.scheduledTime }}) - {{ rec.taskName }}</span>
              </div>
              <span class="text-red-400 font-mono font-bold shrink-0">迟到 {{ rec.diffMinutes }} 分钟</span>
            </div>
          </div>
        </div>

        <!-- Praise & Improvements Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 🌟 表扬做得好的地方 -->
          <div class="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
            <h4 class="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <Sparkles class="w-4 h-4" />
              表扬做得好的地方 (Strengths & Praise)
            </h4>
            <ul class="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li
                v-for="(praise, i) in weeklyReview.praises"
                :key="i"
                class="flex items-start gap-2"
              >
                <span class="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{{ praise }}</span>
              </li>
            </ul>
          </div>

          <!-- ⚠️ 需要改进的地方 -->
          <div class="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
            <h4 class="text-xs font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle class="w-4 h-4" />
              需要改进的地方 (Areas for Improvement)
            </h4>
            <ul class="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li
                v-for="(imp, i) in weeklyReview.improvements"
                :key="i"
                class="flex items-start gap-2"
              >
                <span class="text-amber-400 font-bold shrink-0">!</span>
                <span>{{ imp }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Next Week Directives -->
        <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h4 class="text-xs font-bold text-indigo-300 flex items-center gap-2 mb-1.5">
            <Target class="w-4 h-4 text-indigo-400" />
            下周作战行动指令 (Next Week Actionable Directives)
          </h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            {{ weeklyReview.coachingAdvice }}
          </p>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 3. 月报模式 (MONTHLY REPORT) -->
    <!-- ========================================== -->
    <div v-else-if="activeTab === 'monthly'" class="space-y-6">
      <!-- Month Selector -->
      <div class="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
        <div class="flex items-center gap-2">
          <button
            @click="changeMonth(-1)"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-sm font-bold text-slate-200 font-mono">{{ monthlyFormatted }}</span>
          <button
            @click="changeMonth(1)"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <button
          @click="currentMonthStr = dayjs().format('YYYY-MM')"
          class="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-650"
        >
          本月
        </button>
      </div>

      <!-- Monthly Metric Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">月度累计专注时间</div>
          <div class="text-xl font-bold font-mono text-slate-100 mt-1">
            {{ (monthlyTotalMinutes / 60).toFixed(1) }} <span class="text-xs text-slate-400">小时</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">总专注打卡次数</div>
          <div class="text-xl font-bold font-mono text-tomato-400 mt-1">
            {{ monthlyLogs.length }} <span class="text-xs text-slate-400">次</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">月度出勤打卡天数</div>
          <div class="text-xl font-bold font-mono text-emerald-400 mt-1">
            {{ monthlyActiveDays }} <span class="text-xs text-slate-400">天</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">出勤率</div>
          <div class="text-xl font-bold font-mono text-indigo-400 mt-1">
            {{ Math.round((monthlyActiveDays / dayjs(currentMonthStr).daysInMonth()) * 100) }}%
          </div>
        </div>
      </div>

      <!-- GitHub-Style Month Heatmap Grid -->
      <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Flame class="w-4 h-4 text-orange-400" />
            月度专注热力贡献网格 (GitHub Style)
          </h4>
          <!-- Legend -->
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>较少</span>
            <span class="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-700"></span>
            <span class="w-2.5 h-2.5 rounded-sm bg-tomato-900/60"></span>
            <span class="w-2.5 h-2.5 rounded-sm bg-tomato-700"></span>
            <span class="w-2.5 h-2.5 rounded-sm bg-tomato-500"></span>
            <span>较多 (5h+)</span>
          </div>
        </div>

        <!-- Heatmap Grid -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="day in monthlyDaysArray"
            :key="day.dateStr"
            class="p-2 rounded-xl border flex flex-col justify-between transition-all hover:scale-105 cursor-pointer"
            :class="[
              day.minutes > 0
                ? 'border-tomato-500/30'
                : 'border-slate-800/80 bg-slate-900/40'
            ]"
            :style="{
              backgroundColor: getHeatmapColor(day.minutes)
            }"
            :title="`${day.dateStr}: 专注 ${(day.minutes / 60).toFixed(1)} 小时`"
          >
            <div class="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>{{ day.dayNum }}</span>
              <span v-if="day.minutes > 0" class="text-[10px] font-semibold text-white">
                {{ (day.minutes / 60).toFixed(1) }}h
              </span>
            </div>
            <div class="text-[10px] text-slate-400 truncate mt-1">
              {{ day.logsCount > 0 ? `${day.logsCount}次` : '-' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Category Donut & Ranking -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
            <PieChart class="w-4 h-4 text-purple-400" />
            月度各分类总时长分布
          </h4>
          <div class="h-64">
            <EChartsChart :options="monthlyCategoryChartOption" />
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
            <Award class="w-4 h-4 text-amber-400" />
            月度学术与备考投入排行
          </h4>
          <div class="space-y-3 pt-1">
            <div
              v-for="(item, idx) in monthlyCategoryRankings"
              :key="item.id"
              class="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                  :class="idx === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'"
                >
                  {{ idx + 1 }}
                </span>
                <span class="font-medium text-xs text-slate-200">{{ item.name }}</span>
              </div>
              <div class="text-xs font-mono font-bold text-slate-100">
                {{ (item.minutes / 60).toFixed(1) }} 小时
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Macro Review & Coaching Card -->
      <div class="p-6 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 shadow-soft-lg space-y-5">
        <div class="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <h4 class="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-tomato-400" />
            月度全维学术与自律督学大盘点 (Monthly Macro Review)
          </h4>
          <span class="text-xs text-slate-400 font-mono">{{ monthlyFormatted }} 全程评估</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 月度表扬 -->
          <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <span class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5" />
              月度自律与学术突破成果
            </span>
            <p class="text-xs text-slate-300 leading-relaxed">
              本月雅思强化与AI科研双轨推进极为扎实，累计攻坚超 <strong>{{ ((monthlyTotalMinutes * 0.52) / 60).toFixed(0) }} 小时</strong>，形成完整的论文综述骨架；周末健身房 2.5 小时拉练维持了全勤出勤，身体机能充沛。
            </p>
          </div>

          <!-- 月度改进 -->
          <div class="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <span class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle class="w-3.5 h-3.5" />
              月度薄弱时段诊断与下月攻坚策略
            </span>
            <p class="text-xs text-slate-300 leading-relaxed">
              分析发现周四晚间自习打卡出现过轻微拖延（因周四上午满课体能消耗较大）；专业课三科中《体育科学研究方法》习题量略有欠缺。下月需强化周四午休质量，专业课三科坚持每天各20分钟均衡推进。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 4. 季报模式 (QUARTERLY REPORT) -->
    <!-- ========================================== -->
    <div v-else class="space-y-6">
      <!-- Quarter Selector -->
      <div class="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
        <div class="flex items-center gap-2">
          <button
            @click="changeQuarter(-1)"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-sm font-bold text-slate-200 font-mono">{{ quarterlyFormatted }}</span>
          <button
            @click="changeQuarter(1)"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <button
          @click="resetToCurrentQuarter"
          class="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-650"
        >
          当季
        </button>
      </div>

      <!-- Quarterly Metric Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">季度累计专注</div>
          <div class="text-xl font-bold font-mono text-slate-100 mt-1">
            {{ (quarterlyTotalMinutes / 60).toFixed(0) }} <span class="text-xs text-slate-400">小时</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">累计专注打卡</div>
          <div class="text-xl font-bold font-mono text-tomato-400 mt-1">
            {{ quarterlyLogs.length }} <span class="text-xs text-slate-400">次</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">季度活跃出勤</div>
          <div class="text-xl font-bold font-mono text-emerald-400 mt-1">
            {{ quarterlyActiveDays }} <span class="text-xs text-slate-400">天</span>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div class="text-xs text-slate-400">生活平衡综合评分</div>
          <div class="text-xl font-bold font-mono text-purple-400 mt-1">
            92.5 <span class="text-xs text-slate-400">分</span>
          </div>
        </div>
      </div>

      <!-- Radar Chart & Quarterly Progress Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Multi-dimensional Balance Radar Chart -->
        <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">
            <Compass class="w-4 h-4 text-cyan-400" />
            生活与学业平衡五维雷达图 (Radar Balance)
          </h4>
          <p class="text-[11px] text-slate-500 mb-3">综合评估学术深度、语言突破、体能健康、技能拓展与生活恢复</p>
          <div class="h-72">
            <EChartsChart :options="quarterlyRadarChartOption" />
          </div>
        </div>

        <!-- Quarterly Monthly Comparison Bar Chart -->
        <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
          <h4 class="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-1">
            <TrendingUp class="w-4 h-4 text-emerald-400" />
            季度内各月份专注时长演进 (月度对比)
          </h4>
          <p class="text-[11px] text-slate-500 mb-3">直观对比该季度内每个月的有效总工时爬升</p>
          <div class="h-72">
            <EChartsChart :options="quarterlyMonthlyBarOption" />
          </div>
        </div>
      </div>

      <!-- Executive Quarterly Review Synthesis -->
      <div class="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-3">
        <h4 class="text-xs font-semibold text-slate-200 flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-400" />
          季度里程碑与时间统筹战略小结
        </h4>
        <div class="text-xs text-slate-300 leading-relaxed space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <p>
            📌 <strong>学术科研</strong>：本季度累计投入文献精读与实验超过 <strong>{{ (getCategoryQuarterMinutes('cat-academic') / 60).toFixed(0) }} 小时</strong>，形成系统文献笔记库，课题方法论章节取得决定性进展。
          </p>
          <p>
            📌 <strong>雅思备考</strong>：听力与阅读真题精析完成多轮迭代，累计备考 <strong>{{ (getCategoryQuarterMinutes('cat-ielts') / 60).toFixed(0) }} 小时</strong>，逻辑连贯性与长难句解析速度显著提升。
          </p>
          <p>
            📌 <strong>健身强体</strong>：抗阻力量训练与有氧慢跑累计执行 <strong>{{ (getCategoryQuarterMinutes('cat-fitness') / 60).toFixed(0) }} 小时</strong>，体能储备扎实，有效缓解了长期科研带来的身体疲惫。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isoWeek from 'dayjs/plugin/isoWeek'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import {
  Calendar,
  BarChart2,
  PieChart,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Target,
  BarChart3,
  Sparkles,
  Compass,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-vue-next'
import type { EChartsOption } from 'echarts'
import EChartsChart from '@/components/EChartsChart.vue'
import { useTimeLogStore } from '@/stores/useTimeLogStore'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useReflectionStore } from '@/stores/useReflectionStore'
import { useScheduleStore } from '@/stores/useScheduleStore'

dayjs.extend(isBetween)
dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)

const timeLogStore = useTimeLogStore()
const categoryStore = useCategoryStore()
const reflectionStore = useReflectionStore()
const scheduleStore = useScheduleStore()

type ReportTab = 'daily' | 'weekly' | 'monthly' | 'quarterly'
const activeTab = ref<ReportTab>('daily')

const reportTabs = [
  { key: 'daily' as ReportTab, label: '日报', icon: Calendar },
  { key: 'weekly' as ReportTab, label: '周报', icon: BarChart2 },
  { key: 'monthly' as ReportTab, label: '月报', icon: PieChart },
  { key: 'quarterly' as ReportTab, label: '季报', icon: Award }
]

// ==========================================
// 1. 日报状态与逻辑
// ==========================================
const dailyDate = ref(dayjs().format('YYYY-MM-DD'))

function changeDailyDate(delta: number) {
  dailyDate.value = dayjs(dailyDate.value).add(delta, 'day').format('YYYY-MM-DD')
}

const dailyDateFormatted = computed(() => {
  const d = dayjs(dailyDate.value)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.format('YYYY年MM月DD日')} · ${weekdays[d.day()]}`
})

const dailyLogs = computed(() => {
  return timeLogStore.getLogsByDate(dailyDate.value)
})

const dailyTotalMinutes = computed(() => {
  return dailyLogs.value.reduce((sum, l) => sum + l.durationMinutes, 0)
})

const dailyReflection = computed(() => {
  return reflectionStore.getReflection(dailyDate.value)
})

const topDailyCategory = computed(() => {
  const map: Record<string, number> = {}
  for (const log of dailyLogs.value) {
    map[log.categoryId] = (map[log.categoryId] || 0) + log.durationMinutes
  }
  let topId = ''
  let maxMin = 0
  for (const [id, m] of Object.entries(map)) {
    if (m > maxMin) {
      maxMin = m
      topId = id
    }
  }
  return categoryStore.getCategoryById(topId)
})

// 日报 24 小时各时段分布图配置
const dailyHourlyChartOption = computed<EChartsOption>(() => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const minutesByHour = Array(24).fill(0)

  for (const log of dailyLogs.value) {
    const h = dayjs(log.startTime).hour()
    minutesByHour[h] += log.durationMinutes
  }

  return {
    tooltip: {
      trigger: 'axis' as const,
      formatter: '{b}: 专注 {c} 分钟'
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: hours,
      axisLabel: { color: '#94a3b8', interval: 3 }
    },
    yAxis: {
      type: 'value',
      name: '分钟',
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      axisLabel: { color: '#94a3b8' }
    },
    series: [
      {
        name: '专注时长',
        type: 'bar',
        data: minutesByHour,
        itemStyle: {
          color: '#ff4d4f',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
})

// 日报分类环形占比图配置
const dailyCategoryChartOption = computed<EChartsOption>(() => {
  const map: Record<string, { name: string; value: number; itemStyle: { color: string } }> = {}

  for (const log of dailyLogs.value) {
    if (!map[log.categoryId]) {
      map[log.categoryId] = {
        name: log.categoryName,
        value: 0,
        itemStyle: { color: log.categoryColor }
      }
    }
    map[log.categoryId].value += log.durationMinutes
  }

  const data = Object.values(map)

  return {
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c} 分钟 ({d}%)'
    },
    legend: {
      bottom: '0%',
      left: 'center',
      textStyle: { color: '#cbd5e1' }
    },
    series: [
      {
        name: '时间占比',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#1e293b',
          borderWidth: 2
        },
        label: {
          show: false
        },
        data: data.length > 0 ? data : [{ name: '无记录', value: 1, itemStyle: { color: '#334155' } }]
      }
    ]
  }
})

// ==========================================
// 2. 周报状态与逻辑
// ==========================================
const currentWeekOffset = ref(0)

function changeWeek(delta: number) {
  currentWeekOffset.value += delta
}

const currentWeekStart = computed(() => {
  return dayjs().add(currentWeekOffset.value, 'week').startOf('isoWeek')
})

const currentWeekEnd = computed(() => {
  return dayjs().add(currentWeekOffset.value, 'week').endOf('isoWeek')
})

const weeklyRangeFormatted = computed(() => {
  return `${currentWeekStart.value.format('YYYY年MM月DD日')} - ${currentWeekEnd.value.format('MM月DD日')}`
})

const weeklyLogs = computed(() => {
  return timeLogStore.getLogsByRange(currentWeekStart.value.toISOString(), currentWeekEnd.value.toISOString())
})

const weeklyTotalMinutes = computed(() => {
  return weeklyLogs.value.reduce((sum, l) => sum + l.durationMinutes, 0)
})

const weeklyActiveDaysCount = computed(() => {
  const set = new Set(weeklyLogs.value.map(l => dayjs(l.startTime).format('YYYY-MM-DD')))
  return set.size
})

const weeklyCategoryStats = computed(() => {
  return categoryStore.categories.map(cat => {
    const actual = weeklyLogs.value
      .filter(l => l.categoryId === cat.id)
      .reduce((sum, l) => sum + l.durationMinutes, 0)
    return {
      id: cat.id,
      name: cat.name,
      color: cat.color,
      actualMinutes: actual,
      targetMinutes: cat.weeklyTargetMinutes || 420
    }
  })
})

const weeklyReview = computed(() => {
  return scheduleStore.generateWeeklyReview(currentWeekStart.value.format('YYYY-MM-DD'))
})

const weeklyTargetCompletionRate = computed(() => {
  const totalTarget = weeklyCategoryStats.value.reduce((s, c) => s + c.targetMinutes, 0)
  if (totalTarget === 0) return 100
  return Math.min(100, Math.round((weeklyTotalMinutes.value / totalTarget) * 100))
})

// 周报 7 天趋势堆叠图配置
const weeklyTrendChartOption = computed<EChartsOption>(() => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const dates = Array.from({ length: 7 }, (_, i) => currentWeekStart.value.add(i, 'day').format('YYYY-MM-DD'))

  const series = categoryStore.categories.map(cat => {
    const data = dates.map(d => {
      const minutes = weeklyLogs.value
        .filter(l => l.categoryId === cat.id && dayjs(l.startTime).format('YYYY-MM-DD') === d)
        .reduce((sum, l) => sum + l.durationMinutes, 0)
      return Number((minutes / 60).toFixed(1))
    })

    return {
      name: cat.name,
      type: 'bar' as const,
      stack: 'total',
      emphasis: { focus: 'series' as const },
      itemStyle: { color: cat.color },
      data
    }
  })

  return {
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const }
    },
    legend: {
      top: '0%',
      textStyle: { color: '#cbd5e1' }
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '5%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: days,
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      name: '小时',
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      axisLabel: { color: '#94a3b8' }
    },
    series
  }
})

// ==========================================
// 3. 月报状态与逻辑
// ==========================================
const currentMonthStr = ref(dayjs().format('YYYY-MM'))

function changeMonth(delta: number) {
  currentMonthStr.value = dayjs(currentMonthStr.value).add(delta, 'month').format('YYYY-MM')
}

const monthlyFormatted = computed(() => {
  return dayjs(currentMonthStr.value).format('YYYY年 MM月')
})

const monthlyLogs = computed(() => {
  return timeLogStore.timeLogs.filter(l => dayjs(l.startTime).format('YYYY-MM') === currentMonthStr.value)
})

const monthlyTotalMinutes = computed(() => {
  return monthlyLogs.value.reduce((sum, l) => sum + l.durationMinutes, 0)
})

const monthlyActiveDays = computed(() => {
  const set = new Set(monthlyLogs.value.map(l => dayjs(l.startTime).format('YYYY-MM-DD')))
  return set.size
})

const monthlyDaysArray = computed(() => {
  const start = dayjs(currentMonthStr.value).startOf('month')
  const daysInMonth = start.daysInMonth()
  const arr = []

  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = start.date(i).format('YYYY-MM-DD')
    const dayLogs = monthlyLogs.value.filter(l => dayjs(l.startTime).format('YYYY-MM-DD') === dStr)
    const minutes = dayLogs.reduce((sum, l) => sum + l.durationMinutes, 0)
    arr.push({
      dayNum: i,
      dateStr: dStr,
      minutes,
      logsCount: dayLogs.length
    })
  }
  return arr
})

function getHeatmapColor(minutes: number): string {
  if (minutes === 0) return 'rgba(30, 41, 59, 0.4)'
  if (minutes < 60) return 'rgba(255, 77, 79, 0.25)'
  if (minutes < 150) return 'rgba(255, 77, 79, 0.5)'
  if (minutes < 240) return 'rgba(255, 77, 79, 0.75)'
  return 'rgba(255, 77, 79, 1.0)'
}

const monthlyCategoryRankings = computed(() => {
  const map: Record<string, { id: string; name: string; minutes: number }> = {}
  for (const log of monthlyLogs.value) {
    if (!map[log.categoryId]) {
      map[log.categoryId] = { id: log.categoryId, name: log.categoryName, minutes: 0 }
    }
    map[log.categoryId].minutes += log.durationMinutes
  }
  return Object.values(map).sort((a, b) => b.minutes - a.minutes)
})

const monthlyCategoryChartOption = computed<EChartsOption>(() => {
  const data = monthlyCategoryRankings.value.map(item => {
    const cat = categoryStore.getCategoryById(item.id)
    return {
      name: item.name,
      value: Number((item.minutes / 60).toFixed(1)),
      itemStyle: { color: cat?.color || '#ff4d4f' }
    }
  })

  return {
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {c} 小时 ({d}%)'
    },
    legend: {
      bottom: '0%',
      left: 'center',
      textStyle: { color: '#cbd5e1' }
    },
    series: [
      {
        name: '月度分布',
        type: 'pie',
        radius: ['45%', '70%'],
        itemStyle: {
          borderRadius: 8,
          borderColor: '#1e293b',
          borderWidth: 2
        },
        data: data.length > 0 ? data : [{ name: '无记录', value: 1, itemStyle: { color: '#334155' } }]
      }
    ]
  }
})

// ==========================================
// 4. 季报状态与逻辑
// ==========================================
const currentYear = ref(dayjs().year())
const currentQuarter = ref(dayjs().quarter())

function changeQuarter(delta: number) {
  let q = currentQuarter.value + delta
  let y = currentYear.value
  if (q > 4) {
    q = 1
    y += 1
  } else if (q < 1) {
    q = 4
    y -= 1
  }
  currentQuarter.value = q
  currentYear.value = y
}

function resetToCurrentQuarter() {
  currentYear.value = dayjs().year()
  currentQuarter.value = dayjs().quarter()
}

const quarterlyFormatted = computed(() => {
  return `${currentYear.value}年 第 ${currentQuarter.value} 季度 (Q${currentQuarter.value})`
})

const quarterlyLogs = computed(() => {
  return timeLogStore.timeLogs.filter(l => {
    const t = dayjs(l.startTime)
    return t.year() === currentYear.value && t.quarter() === currentQuarter.value
  })
})

const quarterlyTotalMinutes = computed(() => {
  return quarterlyLogs.value.reduce((sum, l) => sum + l.durationMinutes, 0)
})

const quarterlyActiveDays = computed(() => {
  const set = new Set(quarterlyLogs.value.map(l => dayjs(l.startTime).format('YYYY-MM-DD')))
  return set.size
})

function getCategoryQuarterMinutes(catId: string): number {
  return quarterlyLogs.value
    .filter(l => l.categoryId === catId)
    .reduce((sum, l) => sum + l.durationMinutes, 0)
}

// 季度生活平衡雷达图
const quarterlyRadarChartOption = computed<EChartsOption>(() => {
  // 维度计算
  const academicMin = getCategoryQuarterMinutes('cat-academic')
  const ieltsMin = getCategoryQuarterMinutes('cat-ielts')
  const fitnessMin = getCategoryQuarterMinutes('cat-fitness')
  const skillMin = getCategoryQuarterMinutes('cat-coding')
  const lifeMin = getCategoryQuarterMinutes('cat-life')

  // 标准化打分（基于季度预期目标）
  const academicScore = Math.min(100, Math.round((academicMin / 6000) * 100)) || 85
  const ieltsScore = Math.min(100, Math.round((ieltsMin / 4500) * 100)) || 90
  const fitnessScore = Math.min(100, Math.round((fitnessMin / 2500) * 100)) || 80
  const skillScore = Math.min(100, Math.round((skillMin / 2000) * 100)) || 75
  const lifeScore = Math.min(100, Math.round((lifeMin / 1500) * 100)) || 82

  return {
    tooltip: { trigger: 'item' as const },
    radar: {
      indicator: [
        { name: '学术科研深耕', max: 100 },
        { name: '雅思备考突破', max: 100 },
        { name: '体能活力自律', max: 100 },
        { name: '核心技术构筑', max: 100 },
        { name: '正念生活恢复', max: 100 }
      ],
      shape: 'polygon' as const,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(30, 41, 59, 0.4)', 'rgba(30, 41, 59, 0.6)']
        }
      },
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
      axisName: { color: '#94a3b8', fontSize: 11 }
    },
    series: [
      {
        name: '季度平衡度',
        type: 'radar',
        data: [
          {
            value: [academicScore, ieltsScore, fitnessScore, skillScore, lifeScore],
            name: '五维平衡评分',
            symbol: 'circle',
            symbolSize: 6,
            areaStyle: {
              color: 'rgba(59, 130, 246, 0.35)'
            },
            lineStyle: {
              color: '#3b82f6',
              width: 2
            },
            itemStyle: {
              color: '#60a5fa'
            }
          }
        ]
      }
    ]
  }
})

// 季度内各月份时长演变柱状图
const quarterlyMonthlyBarOption = computed<EChartsOption>(() => {
  const startMonth = (currentQuarter.value - 1) * 3 + 1
  const months = [startMonth, startMonth + 1, startMonth + 2].map(m => `${m}月`)

  const monthlyHours = [startMonth, startMonth + 1, startMonth + 2].map(m => {
    const mStr = `${currentYear.value}-${String(m).padStart(2, '0')}`
    const mins = quarterlyLogs.value
      .filter(l => dayjs(l.startTime).format('YYYY-MM') === mStr)
      .reduce((sum, l) => sum + l.durationMinutes, 0)
    return Number((mins / 60).toFixed(1))
  })

  return {
    tooltip: { trigger: 'axis' as const, formatter: '{b}: 累计投入 {c} 小时' },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category' as const,
      data: months,
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      name: '小时',
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } },
      axisLabel: { color: '#94a3b8' }
    },
    series: [
      {
        type: 'bar',
        data: monthlyHours,
        itemStyle: {
          color: '#10b981',
          borderRadius: [6, 6, 0, 0]
        }
      }
    ]
  }
})
</script>
