<template>
  <div class="space-y-6 pb-12">
    <!-- Top Header Bar -->
    <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 backdrop-blur-md shadow-xl">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-2xl">
          🏀
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-extrabold text-white tracking-tight">身体管家 · 篮球高绩效与运动科学中心</h1>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
              SPORTS SCIENCE LAB
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">
            190cm / 95kg 半职业2号位 · 减脂增肌重塑周期 · 基于 BJSM / NSCA / ACSM 文献与 CNS 神经负荷调控
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Date Selector -->
        <div class="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs text-slate-300">
          <Calendar class="w-3.5 h-3.5 text-orange-400" />
          <input
            type="date"
            v-model="athleteStore.selectedDate"
            class="bg-transparent border-0 text-slate-200 text-xs focus:ring-0 cursor-pointer outline-none"
          />
        </div>

        <!-- Sync From Daily Logs Button -->
        <button
          @click="handleSyncFromLogs"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="自动提取当天已在番茄钟记录的健身、练球与反思日记数据"
        >
          <RefreshCw class="w-3.5 h-3.5 text-cyan-400" :class="{ 'animate-spin': isSyncingLogs }" />
          <span>从番茄ToDo提取</span>
        </button>

        <!-- Copy Prompt Report Button -->
        <button
          @click="copyPromptReport"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]"
          title="生成符合提示词规范的标准汇报文本，一键发给AI"
        >
          <Copy class="w-3.5 h-3.5" />
          <span>{{ copySuccess ? '已复制汇报模板！' : '复制AI汇报文本' }}</span>
        </button>

        <!-- Save Button -->
        <button
          @click="handleSave"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save class="w-3.5 h-3.5" />
          <span>{{ saveSuccess ? '已保存诊断！' : '保存记录' }}</span>
        </button>
      </div>
    </div>

    <!-- Quick Performance KPI Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      <!-- Readiness Score -->
      <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-sm relative overflow-hidden">
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>综合机能得分</span>
          <Activity class="w-4 h-4 text-orange-400" />
        </div>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-100">{{ currentForm.diagnosis?.overallScore || 90 }}</span>
          <span class="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
        <div class="mt-1 text-[11px] font-semibold text-orange-400 truncate">
          {{ currentForm.diagnosis?.statusTag || '高转化窗口' }}
        </div>
      </div>

      <!-- S&C Volume -->
      <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-sm">
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>力量与抗阻负荷</span>
          <Dumbbell class="w-4 h-4 text-emerald-400" />
        </div>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-100">{{ currentForm.strength.durationMinutes }}</span>
          <span class="text-xs text-slate-400">分钟</span>
        </div>
        <div class="mt-1 text-[11px] text-emerald-400 truncate">
          {{ currentForm.strength.phase }}
        </div>
      </div>

      <!-- Basketball Workload -->
      <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-sm">
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>篮球专项与SSC</span>
          <Trophy class="w-4 h-4 text-amber-400" />
        </div>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-100">{{ currentForm.basketball.durationMinutes }}</span>
          <span class="text-xs text-slate-400">分钟</span>
        </div>
        <div class="mt-1 text-[11px] text-amber-400 truncate">
          RPE: {{ currentForm.basketball.rpe }}/10 · {{ currentForm.basketball.highIntensityJumps }}次起跳
        </div>
      </div>

      <!-- Tendon & Joint Risk -->
      <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-sm">
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>髌腱应力与晨僵</span>
          <ShieldCheck class="w-4 h-4" :class="currentForm.biomechanics.patellarTendonPain <= 2 ? 'text-emerald-400' : 'text-rose-400'" />
        </div>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl font-black" :class="currentForm.biomechanics.patellarTendonPain <= 2 ? 'text-slate-100' : 'text-rose-400'">
            {{ currentForm.biomechanics.patellarTendonPain }}
          </span>
          <span class="text-xs text-slate-400">/ 10分</span>
        </div>
        <div class="mt-1 text-[11px] truncate" :class="currentForm.biomechanics.patellarTendonPain <= 2 ? 'text-emerald-400' : 'text-rose-400'">
          {{ currentForm.biomechanics.patellarTendonPain <= 2 ? '肌腱适应性良好' : '有反应性微损伤' }}
        </div>
      </div>

      <!-- Sleep & Recovery -->
      <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-sm">
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>睡眠时长与心率</span>
          <Moon class="w-4 h-4 text-cyan-400" />
        </div>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-100">{{ currentForm.recovery.sleepDurationHours }}</span>
          <span class="text-xs text-slate-400">h / {{ currentForm.recovery.restingHeartRate || 58 }} bpm</span>
        </div>
        <div class="mt-1 text-[11px] text-cyan-400 truncate">
          {{ currentForm.recovery.deepSleepPerception === 'deep' ? '极佳慢波深睡' : '神经状态恢复' }}
        </div>
      </div>
    </div>

    <!-- Main Content Grid: Left Form Input, Right Scientific Diagnosis Screen -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column (7 cols): Five Pillars Data Entry -->
      <div class="lg:col-span-7 space-y-5">
        <!-- 1. 篮球专项训练 -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold">1</span>
              <h2 class="text-sm font-bold text-slate-100">篮球专项训练 (On-Court Workload)</h2>
            </div>
            <span class="text-xs text-orange-400/90 font-mono">球场实战与技术动力定型</span>
          </div>

          <!-- Modules Chips -->
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-2">训练模块 (可多选)</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="mod in basketballModuleOptions"
                :key="mod"
                type="button"
                @click="toggleBasketballModule(mod)"
                class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                :class="currentForm.basketball.modules.includes(mod)
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'"
              >
                {{ mod }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Duration -->
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">
                训练时长: <span class="text-orange-400 font-bold font-mono">{{ currentForm.basketball.durationMinutes }}</span> 分钟
              </label>
              <input
                type="range"
                v-model.number="currentForm.basketball.durationMinutes"
                min="0"
                max="180"
                step="5"
                class="w-full accent-orange-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <!-- RPE -->
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">
                主观疲劳 RPE: <span class="text-amber-400 font-bold font-mono">{{ currentForm.basketball.rpe }}</span> / 10
              </label>
              <input
                type="range"
                v-model.number="currentForm.basketball.rpe"
                min="1"
                max="10"
                step="1"
                class="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <!-- High Intensity Jumps -->
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">
                起跳次数: <span class="text-cyan-400 font-bold font-mono">{{ currentForm.basketball.highIntensityJumps }}</span> 次
              </label>
              <input
                type="number"
                v-model.number="currentForm.basketball.highIntensityJumps"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-orange-500 font-mono"
                placeholder="预估高强度起跳次数"
              />
            </div>
          </div>

          <!-- Deceleration & Contact -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">急停制动与变向频度 (Deceleration)</label>
              <input
                type="text"
                v-model="currentForm.basketball.decelerations"
                placeholder="如：运球变向突破、急停跳投抗疲劳手感建立"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">身体对抗强度等级</label>
              <select
                v-model="currentForm.basketball.contactIntensity"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="low">低对抗 (以投篮手感与战术空跑为主)</option>
                <option value="medium">中等对抗 (半场1v1 / 3v3 有身体接触)</option>
                <option value="high">高对抗 (全场 5v5 强身体碰撞)</option>
                <option value="match">正规高强度比赛 (极速冲刺与高对抗)</option>
              </select>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">球场体感、投篮手感与细节备注</label>
            <textarea
              v-model="currentForm.basketball.notes"
              rows="2"
              placeholder="记录球场第一步爆发力、下肢疲劳对出手弧线的影响、抗疲劳控制感等..."
              class="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-orange-500 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- 2. 力量与体能训练 -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">2</span>
              <h2 class="text-sm font-bold text-slate-100">力量与体能训练 (S&C Session)</h2>
            </div>
            <span class="text-xs text-emerald-400/90 font-mono">最大机械张力与弹跳基础</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">训练阶段与核心目标</label>
              <select
                v-model="currentForm.strength.phase"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="最大力量">最大绝对力量 (85%+ 1RM 强负荷攻坚)</option>
                <option value="爆发力/RFD">爆发力与力量发展速率 (RFD / 速度力量)</option>
                <option value="法式对比抗阻">法式对比抗阻 (French Contrast / 复合增强)</option>
                <option value="核心与旋转力">核心刚性与旋转爆发力 (抗旋转与后侧链)</option>
                <option value="超量恢复与减载">主动超量恢复与肌腱减载 (Deload)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">
                力量训练时长: <span class="text-emerald-400 font-bold font-mono">{{ currentForm.strength.durationMinutes }}</span> 分钟
              </label>
              <input
                type="range"
                v-model.number="currentForm.strength.durationMinutes"
                min="0"
                max="180"
                step="5"
                class="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">主要复合动作与负荷 (重量/组数/RIR保留次数)</label>
            <input
              type="text"
              v-model="currentForm.strength.primaryLifts"
              placeholder="如：深蹲120kg 4组 + 保加利亚分腿蹲30kg哑铃5组 + 核心四重奏"
              class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">弹跳训练 (Plyometrics) 与地面接触类型</label>
            <input
              type="text"
              v-model="currentForm.strength.plyometricsVolume"
              placeholder="如：靠墙静蹲VMO等长激活 / 快速SSC弹跳 / 跨步跳深"
              class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">动作生物力学细节与泵感反馈</label>
            <textarea
              v-model="currentForm.strength.notes"
              rows="2"
              placeholder="记录深蹲深度、膝关节是否内扣代偿、单腿支撑稳定度、核心刚性锁死感..."
              class="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 resize-none"
            ></textarea>
          </div>
        </div>

        <!-- 3. 骨骼肌与关节生物力学状态 -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm font-bold">3</span>
              <h2 class="text-sm font-bold text-slate-100">骨骼肌与关节状态 (Biomechanics & Joint Check)</h2>
            </div>
            <span class="text-xs text-rose-400/90 font-mono">肌腱胶原健康与伤病预警</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Patellar Tendon Pain Slider -->
            <div class="sm:col-span-2 p-3 rounded-xl bg-slate-900/60 border border-slate-700/80">
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="font-medium text-slate-200">髌腱/四头肌腱压痛与晨僵评分 (0-10)</span>
                <span
                  class="font-mono font-bold text-sm px-2 py-0.5 rounded"
                  :class="currentForm.biomechanics.patellarTendonPain <= 2 ? 'bg-emerald-500/20 text-emerald-400' : currentForm.biomechanics.patellarTendonPain <= 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'"
                >
                  {{ currentForm.biomechanics.patellarTendonPain }} 分
                  ({{ currentForm.biomechanics.patellarTendonPain === 0 ? '完全无痛' : currentForm.biomechanics.patellarTendonPain <= 2 ? '微紧无压痛' : currentForm.biomechanics.patellarTendonPain <= 5 ? '轻度压痛/晨僵' : '急性不适' }})
                </span>
              </div>
              <input
                type="range"
                v-model.number="currentForm.biomechanics.patellarTendonPain"
                min="0"
                max="10"
                step="1"
                class="w-full accent-rose-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div class="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 (极佳无感)</span>
                <span>3 (阈值预警)</span>
                <span>6 (反应性肌腱病)</span>
                <span>10 (严重疼痛)</span>
              </div>
            </div>

            <!-- Ankle Foot Feel -->
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">踝关节与足底筋膜体感</label>
              <select
                v-model="currentForm.biomechanics.ankleFootFeel"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="optimal">正常稳定 (弹性充沛，无足底紧绷)</option>
                <option value="mild_tight">轻度紧绷 (变向急停后足底筋膜偏紧)</option>
                <option value="sore">明显酸痛 (跟腱或足跟滑囊微痛，需筋膜松解)</option>
                <option value="protective">代偿保护 (活动受限，需制动保护)</option>
              </select>
            </div>

            <!-- Hip & Spine -->
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">腰椎/骨盆/髋关节活动度</label>
              <select
                v-model="currentForm.biomechanics.hipSpineMobility"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="optimal">骨盆中立灵动 (髋屈伸与胸椎旋转充分)</option>
                <option value="pelvic_tilt">骨盆轻微代偿 (屈髋肌紧张，略有骨盆前倾)</option>
                <option value="lumbar_tight">下背腰椎紧绷 (深蹲后竖脊肌泵感偏强)</option>
                <option value="hip_restricted">髋关节内收/外展受限 (需泡沫轴滚压松解)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">关节体感与代偿预防备注</label>
            <input
              type="text"
              v-model="currentForm.biomechanics.patellarTendonNotes"
              placeholder="记录靠墙静蹲/西班牙蹲等长加载后的舒缓体感，是否存在晨僵现象..."
              class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <!-- 4. 围训练期营养与水合 -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">4</span>
              <h2 class="text-sm font-bold text-slate-100">围训练期营养与水合 (Nutrition & Hydration)</h2>
            </div>
            <span class="text-xs text-blue-400/90 font-mono">生化代谢、糖原回补与抗炎</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">
                优质蛋白总量: <span class="text-blue-400 font-bold font-mono">{{ currentForm.nutrition.proteinGPerKg }}</span> g/kg
              </label>
              <input
                type="number"
                v-model.number="currentForm.nutrition.proteinGPerKg"
                step="0.1"
                min="0.8"
                max="3.0"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">碳水供能与肌糖原充实感</label>
              <select
                v-model="currentForm.nutrition.carbEnergyFeel"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="optimal">供能充沛稳定 (糖原饱满，无低血糖眩晕)</option>
                <option value="moderate">适中均衡 (满足训练消耗)</option>
                <option value="low">偏空乏不足 (第四节体能下坠，亟需补碳)</option>
                <option value="surplus">超量充实 (高碳水超补阶段)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">
                全天饮水量: <span class="text-cyan-400 font-bold font-mono">{{ currentForm.nutrition.waterIntakeMl }}</span> ml
              </label>
              <input
                type="number"
                v-model.number="currentForm.nutrition.waterIntakeMl"
                step="100"
                min="500"
                max="6000"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <!-- Urine Color Level 1-5 -->
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-700/80">
            <div class="flex items-center justify-between text-xs mb-2">
              <span class="font-medium text-slate-200">全天水合状态 (尿液色卡 1-5 级)</span>
              <span class="font-mono text-xs text-cyan-300">
                等级 {{ currentForm.nutrition.urineColorLevel }}:
                {{ currentForm.nutrition.urineColorLevel <= 2 ? '💧 极佳水合 (细胞渗透压平衡)' : currentForm.nutrition.urineColorLevel === 3 ? '⚠️ 轻微脱水 (建议补水300ml)' : '🚨 中重度缺水 (电解质与粘稠风险)' }}
              </span>
            </div>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="lvl in 5"
                :key="lvl"
                type="button"
                @click="currentForm.nutrition.urineColorLevel = lvl"
                class="py-1.5 rounded-lg border text-xs font-bold transition-all text-center"
                :class="[
                  currentForm.nutrition.urineColorLevel === lvl ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100',
                  lvl === 1 ? 'bg-cyan-100 text-slate-900 border-cyan-300' :
                  lvl === 2 ? 'bg-amber-100 text-slate-900 border-amber-300' :
                  lvl === 3 ? 'bg-amber-200 text-slate-900 border-amber-400' :
                  lvl === 4 ? 'bg-amber-300 text-slate-900 border-amber-500' :
                  'bg-amber-500 text-slate-950 border-amber-600'
                ]"
              >
                {{ lvl }} 级
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">围训练期补给与抗炎补剂构成</label>
            <input
              type="text"
              v-model="currentForm.nutrition.supplementsDetail"
              placeholder="如：瑞幸标准美式 + 97%高纯鱼油2粒 + 5g一水肌酸 + 15:00坚果25g"
              class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <!-- 5. 睡眠架构与神经恢复 -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">5</span>
              <h2 class="text-sm font-bold text-slate-100">睡眠架构与神经恢复 (Recovery & Sleep)</h2>
            </div>
            <span class="text-xs text-indigo-400/90 font-mono">生长激素脉冲与中枢自律平衡</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">就寝时间</label>
              <input
                type="time"
                v-model="currentForm.recovery.bedTime"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">醒来时间</label>
              <input
                type="time"
                v-model="currentForm.recovery.wakeTime"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">总睡眠时长 (h)</label>
              <input
                type="number"
                v-model.number="currentForm.recovery.sleepDurationHours"
                step="0.1"
                min="3"
                max="14"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">晨起心率 (bpm)</label>
              <input
                type="number"
                v-model.number="currentForm.recovery.restingHeartRate"
                min="40"
                max="110"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                placeholder="58"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">慢波深度睡眠感知</label>
              <select
                v-model="currentForm.recovery.deepSleepPerception"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="deep">极佳沉浸深睡 (醒后精神焕发，无疲劳沉重)</option>
                <option value="good">良好平稳 (睡眠连贯，极少夜醒)</option>
                <option value="fair">较浅多梦 (REM快速眼动偏多，晨起略重)</option>
                <option value="poor">碎片化浅睡 (频繁夜醒，中枢未充分关机)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">中枢神经兴奋度 (CNS Balance)</label>
              <select
                v-model="currentForm.recovery.cnsExcitement"
                class="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="normal">神经平稳平衡 (专注敏锐，作息规律)</option>
                <option value="relaxed">身心松弛愉悦 (副交感神经主导恢复)</option>
                <option value="wired_tired">身心疲倦但神经亢奋 (交感神经过度激活)</option>
                <option value="heavy_fatigue">重度神经钝化 (反应迟钝，需强制卸载)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (5 cols): Sports Science AI Diagnosis Screen -->
      <div class="lg:col-span-5 space-y-5">
        <!-- Diagnosis Screen Card -->
        <div class="bg-gradient-to-b from-slate-800/90 via-slate-800/60 to-slate-900 border border-orange-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4 sticky top-6">
          <!-- Background Glow -->
          <div class="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">🔬</span>
              <div>
                <h3 class="text-sm font-extrabold text-white tracking-wide">运动科学总监诊断与决策</h3>
                <p class="text-[10px] text-orange-400 font-mono">PEER-REVIEWED DIAGNOSTIC ENGINE</p>
              </div>
            </div>
            <button
              @click="recalculateDiagnosis"
              class="p-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 transition-all text-xs flex items-center gap-1 font-semibold"
              title="根据当前填报指标重新计算科学诊断"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>重新诊断</span>
            </button>
          </div>

          <!-- Diagnostic Modules -->
          <div v-if="currentForm.diagnosis" class="space-y-3.5 text-xs">
            <!-- 模块一 -->
            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
              <div class="flex items-center gap-1.5 text-orange-400 font-bold">
                <Activity class="w-3.5 h-3.5" />
                <span>模块一：中枢神经（CNS）与急慢性负荷 (ACWR)</span>
              </div>
              <p class="text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
                {{ currentForm.diagnosis.cnsAcwrEvaluation }}
              </p>
            </div>

            <!-- 模块二 -->
            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
              <div class="flex items-center gap-1.5 text-amber-400 font-bold">
                <Trophy class="w-3.5 h-3.5" />
                <span>模块二：篮球专项技术与体能动力链转化</span>
              </div>
              <p class="text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
                {{ currentForm.diagnosis.kineticChainTransfer }}
              </p>
            </div>

            <!-- 模块三 -->
            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
              <div class="flex items-center gap-1.5 text-rose-400 font-bold">
                <ShieldCheck class="w-3.5 h-3.5" />
                <span>模块三：骨骼肌腱病理预警与主动防伤 (Prehab)</span>
              </div>
              <p class="text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
                {{ currentForm.diagnosis.prehabProtocol }}
              </p>
            </div>

            <!-- 模块四 -->
            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
              <div class="flex items-center gap-1.5 text-blue-400 font-bold">
                <Apple class="w-3.5 h-3.5" />
                <span>模块四：生化营养与睡眠神经调控处方</span>
              </div>
              <p class="text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
                {{ currentForm.diagnosis.biochemNutritionPrescription }}
              </p>
            </div>

            <!-- 模块五 -->
            <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5">
              <div class="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Zap class="w-3.5 h-3.5 fill-current" />
                <span>模块五：次日【训练负荷-球场表现】处方化指令</span>
              </div>
              <p class="text-emerald-200/90 leading-relaxed whitespace-pre-line text-[11px]">
                {{ currentForm.diagnosis.nextDayPrescription }}
              </p>
            </div>
          </div>

          <!-- Bottom Prompt Copy Card -->
          <div class="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between text-xs">
            <span class="text-orange-300 font-medium">随时复制并在当前对话中与我深度交流</span>
            <button
              @click="copyPromptReport"
              class="px-2.5 py-1 rounded-lg bg-orange-500 text-slate-950 font-bold hover:bg-orange-400 transition-colors flex items-center gap-1"
            >
              <Copy class="w-3 h-3" />
              <span>{{ copySuccess ? '已复制' : '复制汇报' }}</span>
            </button>
          </div>
        </div>

        <!-- Historical Performance Anchors -->
        <div class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-300 font-semibold border-b border-slate-700/60 pb-2">
            <span class="flex items-center gap-1.5">
              <Flame class="w-3.5 h-3.5 text-orange-400" />
              近期大重量与球场关键突破节点
            </span>
            <span class="text-[10px] text-slate-500 font-mono">点击直接回溯</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="anchor in historicalAnchors"
              :key="anchor.date"
              @click="loadHistoricalDate(anchor.date)"
              class="p-2.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center justify-between group"
              :class="athleteStore.selectedDate === anchor.date
                ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'"
            >
              <div>
                <div class="font-bold text-slate-200 group-hover:text-white flex items-center gap-2">
                  <span>{{ anchor.date }}</span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-orange-400 font-mono">{{ anchor.tag }}</span>
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5 truncate max-w-[240px]">
                  {{ anchor.desc }}
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-slate-300">
                {{ anchor.metrics }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import {
  Activity,
  Dumbbell,
  Trophy,
  ShieldCheck,
  Moon,
  Copy,
  Save,
  RefreshCw,
  Calendar,
  Apple,
  Zap,
  Flame
} from 'lucide-vue-next'
import { useAthleteStore } from '@/stores/useAthleteStore'
import type { AthleteDailyRecord } from '@/types'

const athleteStore = useAthleteStore()

const copySuccess = ref(false)
const saveSuccess = ref(false)
const isSyncingLogs = ref(false)

const basketballModuleOptions = [
  '投篮专项',
  '运球脚步',
  '半场技战术',
  '全场对抗 5v5',
  '球场专项体能',
  '急停跳投抗疲劳',
  '羽毛球主动恢复'
]

// Current reactive form state
const currentForm = reactive<AthleteDailyRecord>(
  JSON.parse(JSON.stringify(athleteStore.currentRecord))
)

// Watch date or store record changes (including cloud/server reload) and update form
watch(
  () => [athleteStore.selectedDate, athleteStore.records[athleteStore.selectedDate]?.updatedAt],
  ([newDate]) => {
    const dateStr = typeof newDate === 'string' ? newDate : athleteStore.selectedDate
    const r = athleteStore.records[dateStr] || athleteStore.createEmptyRecord(dateStr)
    Object.assign(currentForm, JSON.parse(JSON.stringify(r)))
  }
)

function toggleBasketballModule(mod: string) {
  const idx = currentForm.basketball.modules.indexOf(mod)
  if (idx > -1) {
    currentForm.basketball.modules.splice(idx, 1)
  } else {
    currentForm.basketball.modules.push(mod)
  }
}

function handleSyncFromLogs() {
  isSyncingLogs.value = true
  try {
    const updated = athleteStore.syncFromDailyLogs(athleteStore.selectedDate)
    Object.assign(currentForm, JSON.parse(JSON.stringify(updated)))
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 2000)
  } finally {
    isSyncingLogs.value = false
  }
}

function recalculateDiagnosis() {
  currentForm.diagnosis = athleteStore.runScientificDiagnosis(currentForm)
  athleteStore.saveRecord(currentForm)
}

function handleSave() {
  athleteStore.saveRecord(currentForm)
  saveSuccess.value = true
  setTimeout(() => {
    saveSuccess.value = false
  }, 2000)
}

async function copyPromptReport() {
  // 确保先同步当前表单到 store
  athleteStore.saveRecord(currentForm)
  const text = athleteStore.generatePromptText(athleteStore.selectedDate)

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2500)
  } catch (err) {
    console.error('Failed to copy text', err)
  }
}

function loadHistoricalDate(date: string) {
  athleteStore.selectedDate = date
}

const historicalAnchors = computed(() => {
  return Object.values(athleteStore.records)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(r => {
      const sMin = r.strength.durationMinutes || 0
      const bMin = r.basketball.durationMinutes || 0
      const metricParts: string[] = []
      if (sMin > 0) metricParts.push(`${sMin}m力量`)
      if (bMin > 0) metricParts.push(`${bMin}m专项`)
      if (metricParts.length === 0) metricParts.push('恢复日')

      return {
        date: r.date,
        tag: r.diagnosis?.statusTag?.split('·')[0] || r.strength.phase || '日常记录',
        desc: r.strength.primaryLifts || r.basketball.notes || r.nutrition.mealsDetail || '综合体能与健康追踪',
        metrics: metricParts.join(' + ')
      }
    })
})
</script>
