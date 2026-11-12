const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlPath = path.resolve('d:/番茄ToDo/docs/专业课三科与习概核心考点梳理整合手册.html');
const pdfWorkspacePath = path.resolve('d:/番茄ToDo/docs/专业课三科与习概核心考点梳理整合手册.pdf');
const pdfArtifactPath = path.resolve('C:/Users/18033/.gemini/antigravity/brain/12a8bf2b-83cb-474f-8c20-9add3939e44e/专业课三科与习概核心考点梳理整合手册.pdf');

const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>体育专业课三科与习概理论核心考点梳理整合手册</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 13.5px;
    }
    .cover-header {
      border-bottom: 3px solid #2563eb;
      padding-bottom: 14px;
      margin-bottom: 22px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .main-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .sub-title {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
    }
    .meta-badge {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 9999px;
      white-space: nowrap;
    }
    h2 {
      font-size: 17px;
      color: #0f172a;
      border-left: 5px solid #2563eb;
      padding-left: 10px;
      margin-top: 24px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 14.5px;
      color: #1e3a8a;
      margin-top: 16px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    p {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: justify;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 10px;
      padding-left: 20px;
    }
    li {
      margin-bottom: 5px;
    }
    .callout {
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
      padding: 10px 14px;
      margin: 12px 0;
      page-break-inside: avoid;
    }
    .callout-amber {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
    }
    .callout-emerald {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
    }
    .callout-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
      font-size: 13.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 12.5px;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .formula-box {
      background: #f1f5f9;
      border: 1px dashed #94a3b8;
      border-radius: 6px;
      padding: 8px 12px;
      font-family: "Courier New", Courier, monospace;
      font-size: 13px;
      color: #0f172a;
      margin: 8px 0;
      text-align: center;
      font-weight: 600;
    }
    .page-break {
      page-break-before: always;
    }
    .footer-note {
      margin-top: 25px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <div class="cover-header">
    <div>
      <h1 class="main-title">体育专业核心课与习概知识点整合手册</h1>
      <p class="sub-title">学术攻关研习档案 · 运动生物力学 / 运动竞赛组织编排 / 习概理论体系</p>
    </div>
    <div class="meta-badge">
      研习用时: 90分钟 · 2026年权威整合版
    </div>
  </div>

  <!-- MODULE 1 -->
  <h2>模块一：运动生物力学（Sports Biomechanics）核心脉络</h2>
  
  <h3>1. 人体运动生物力学特征与力学基础</h3>
  <p>运动生物力学通过物理学定律解析人体运动结构与动作效能，其基本分析范畴涵盖运动学（Kinematics）与动力学（Kinetics）：</p>
  <ul>
    <li><strong>人体质心（Center of Mass, COM）</strong>：人体各环节质量分布的几何中心。在腾空起跳运动中，质心运动轨迹仅受重力作用呈抛物线运动，肢体在空中的相对位置调整（如拉杆、折叠）不改变质心轨迹，但会动态改变局部环节的相对高度。</li>
    <li><strong>解剖学运动平面与轴心</strong>：矢状面（屈伸运动）、额状面/冠状面（外展内收、侧屈）、水平面（水平屈伸、旋内旋外）。</li>
  </ul>

  <h3>2. 骨骼肌力学特性三大核心定律</h3>
  <div class="callout">
    <div class="callout-title">📌 骨骼肌经典力学特性总结</div>
    <table>
      <thead>
        <tr>
          <th>力学特性</th>
          <th>生化与解剖学机理</th>
          <th>动作与训练指导意义</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>肌力 - 长度关系<br>(Force-Length)</strong></td>
          <td>肌小节在<strong>最适初长度（约 100%~120% 静息长度）</strong>时，肌球蛋白粗肌丝与肌动蛋白细肌丝的横桥结合数目达到峰值，产生最大主动收缩张力。过度拉长或极度缩短都会减少横桥有效结合数。</td>
          <td>起跳深蹲蓄力时避免过度下蹲导致肌肉肌节处于不利短缩位；充分利用预拉伸维持最优初长度。</td>
        </tr>
        <tr>
          <td><strong>肌力 - 速度关系<br>(Force-Velocity)</strong></td>
          <td><strong>向心收缩</strong>时，肌力与收缩速度呈反比（希尔双曲线方程）；<strong>离心收缩</strong>时，肌张力随拉长速度增加而增大，可承受高达 1.2~1.5 倍最大等长收缩力。</td>
          <td>大重量深蹲（如 120kg）主要在低速高力量区间募集高门槛 Type IIx 快肌纤维；离心制动能产生巨大机械张力。</td>
        </tr>
        <tr>
          <td><strong>拉长 - 缩短周期<br>(SSC 周期)</strong></td>
          <td>肌肉先进行离心拉长，紧接着快速向心收缩。包含：① 肌梭牵张反射激活兴奋；② 串联弹性成分（SEC，特别是肌腱）中机械弹性势能的储存与极速回弹释放。</td>
          <td>保加利亚分腿蹲与弹跳下蹲（Depth Jump）的核心机制，下潜过渡时间越短，弹性势能耗散越少，爆发力越强。</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>3. 垂直起跳与着地缓冲动力学（冲量 - 动量定理）</h3>
  <div class="formula-box">
    动量定理： I = ∫ F dt = Δp = m · (v_离地 - v_初始)
  </div>
  <ul>
    <li><strong>起跳蹬伸阶段</strong>：在推蹬时间内，地面反作用力（GRF）超出体重的合力对时间积分即为净正向垂直冲量。冲量越大，垂直离地瞬时初速度 v_离地 越高，腾空高度越高。</li>
    <li><strong>着地缓冲阶段</strong>：下落着地时身体动量瞬间归零（Δp 固定）。若膝关节僵直（硬着地），制动时间 Δt 极短，瞬间峰值冲击力（Peak Impact Force）呈指数级上升，极易诱发髌韧带炎与 ACL 撕裂；通过<strong>踝、膝、髋三关节协调深屈曲（软着地）</strong>，延长作用时间 Δt，显著削减瞬时冲击峰值，由肌肉离心收缩吸收动能。</li>
  </ul>

  <h3>4. 空中姿态控制与角动量守恒定律</h3>
  <div class="formula-box">
    角动量守恒： L = I · ω = ∑ (m_i · r_i²) · ω = 常数 (腾空无外力矩状态)
  </div>
  <p>人体离地腾空后处于无外力矩状态，总角动量守恒：</p>
  <ul>
    <li><strong>旋转加速机制</strong>：收缩肢体、双手贴紧躯干 ➔ 身体相对旋转轴的转动半径 r 减小 ➔ 转动惯量 I 减小 ➔ 角速度 ω 显著增加（空翻、跳水、篮球旋转过人）。</li>
    <li><strong>旋转制动与稳定机制</strong>：伸展肢体、张开双臂 ➔ 转动惯量 I 迅速增大 ➔ 角速度 ω 骤降 ➔ 稳定身体平衡确保平稳着地。</li>
  </ul>

  <div class="page-break"></div>

  <!-- MODULE 2 -->
  <h2>模块二：运动竞赛学 —— 运动竞赛组织与赛制编排全景</h2>

  <h3>1. 运动竞赛组织基本工作程序</h3>
  <p>运动竞赛组织工作分为三个严密阶段：</p>
  <ol>
    <li><strong>赛前筹备</strong>：制定并发布《竞赛规程》（包括比赛名称、目的、时间地点、参赛办法、竞赛办法、录取名次与奖励、申诉仲裁规定）；组建组委会、裁判委员会；召开领队联席技术会议与抽签仪式。</li>
    <li><strong>赛中执行</strong>：检录、执裁、成绩记录与审核、编排记录公告、现场应急与医疗保障。</li>
    <li><strong>赛后总结</strong>：公布最终名次、颁奖典礼、竞赛资料归档、裁判员工作考核与物资清点。</li>
  </ol>

  <h3>2. 淘汰赛制（Elimination Tournaments）原理与精确计算</h3>
  <div class="callout callout-emerald">
    <div class="callout-title">📐 淘汰赛计算公式与规则</div>
    <table>
      <thead>
        <tr>
          <th>赛制类别</th>
          <th>比赛总场次公式 (X)</th>
          <th>总轮次数公式 (R)</th>
          <th>轮空与种子位排定规则</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>单淘汰赛<br>(不争第3名)</strong></td>
          <td>X = N - 1<br>(争第3名时 X = N)</td>
          <td>2^R ≥ N<br>的最小整数 R</td>
          <td>
            • <strong>轮空队数（Bye）</strong>：B = 2^R - N。<br>
            • 轮空必须安排在<strong>第一轮</strong>，且优先给予种子队。<br>
            • <strong>种子队设置</strong>：种子数为 2、4、8 等，分别放置于上下半区的首尾位，确保高顺位种子队在决赛前不提前相遇。
          </td>
        </tr>
        <tr>
          <td><strong>双淘汰赛</strong></td>
          <td>X = 2N - 1<br>(总决赛加赛时 X = 2N)</td>
          <td>胜者组轮次 +<br>败者组轮次</td>
          <td>每支参赛队必须<strong>输掉两场比赛</strong>才被最终淘汰。败者跌入败者组继续竞争，最终由胜者组冠军与败者组冠军争夺总冠军。</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>3. 循环赛制（Round-Robin Tournaments）与贝格尔编排法</h3>
  <p><strong>基本计算公式</strong>：设参赛队数为 N。</p>
  <ul>
    <li><strong>总场次公式</strong>：X = N × (N - 1) / 2</li>
    <li><strong>总轮次数（R）与每轮场次</strong>：
      <ul>
        <li>若 <strong>N 为偶数</strong>：总轮次 R = N - 1；每轮比赛场次 = N / 2。</li>
        <li>若 <strong>N 为奇数</strong>：总轮次 R = N；每轮比赛场次 = (N - 1) / 2（每轮必有一支队轮空）。</li>
      </ul>
    </li>
  </ul>

  <div class="callout">
    <div class="callout-title">🔄 贝格尔编排法（顺时针/逆时针轮转法）实例解析（以 6 支球队为例）</div>
    <p>将最大号“6”固定在每轮的第一号位（左上方），其余队伍按 1~5 依次排列并逆时针/顺时针轮转：</p>
    <table>
      <thead>
        <tr>
          <th>第一轮</th>
          <th>第二轮</th>
          <th>第三轮</th>
          <th>第四轮</th>
          <th>第五轮</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1 - 6<br>2 - 5<br>3 - 4</td>
          <td>6 - 4<br>5 - 3<br>1 - 2</td>
          <td>2 - 6<br>3 - 1<br>4 - 5</td>
          <td>6 - 5<br>1 - 4<br>2 - 3</td>
          <td>3 - 6<br>4 - 2<br>5 - 1</td>
        </tr>
      </tbody>
    </table>
    <p style="font-size: 11.5px; color: #64748b; margin-top: 4px;">注：横线左侧为主场，右侧为客场；偶数队伍最大号左右交替，以保证各队主客场数量均衡。</p>
  </div>

  <h3>4. 循环赛名次判定与破平规则（Tie-breaking）</h3>
  <ol>
    <li><strong>常规积分制</strong>：胜一场得 2 分（或 3 分），负一场得 1 分（或 0 分），弃权得 0 分。积分多者名次列前。</li>
    <li><strong>两队积分相同</strong>：直接依据两队相互比赛的胜负关系判定，胜者名次列前。</li>
    <li><strong>三队或三队以上积分相同</strong>：依次比较相互间胜负场次 ➔ 相互间得失分率（得分 ÷ 失分，率大者列前）➔ 全组总得失分率 ➔ 抽签判定。</li>
  </ol>

  <div class="page-break"></div>

  <!-- MODULE 3 -->
  <h2>模块三：习近平新时代中国特色社会主义思想（习概）核心脉络</h2>

  <h3>1. 时代背景、核心课题与划时代历史地位</h3>
  <ul>
    <li><strong>时代背景</strong>：中国特色社会主义进入新时代，中华民族伟大复兴进入不可逆转的历史进程，世界处于百年未有之大变局。</li>
    <li><strong>核心课题</strong>：
      <ol>
        <li>新时代坚持和发展什么样的中国特色社会主义、怎样坚持和发展中国特色社会主义；</li>
        <li>建设什么样的社会主义现代化强国、怎样建设社会主义现代化强国；</li>
        <li>建设什么样的长期执政的马克思主义政党、怎样建设长期执政的马克思主义政党。</li>
      </ol>
    </li>
    <li><strong>历史地位</strong>：当代中国马克思主义、二十一世纪马克思主义，中华文化和中国精神的时代精华，实现了马克思主义中国化时代化新的飞跃。</li>
  </ul>

  <h3>2. 核心架构：“十个明确”、“十四个坚持”、“十三个方面成就”</h3>
  <div class="callout callout-amber">
    <div class="callout-title">🏛️ 思想体系的四梁八柱逻辑体系</div>
    <table>
      <thead>
        <tr>
          <th>体系支柱</th>
          <th>在体系中的逻辑定位</th>
          <th>核心关键要点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>“十个明确”</strong></td>
          <td><strong>思想核心与世界观层面</strong><br>理论体系的“四梁八柱”</td>
          <td>
            ① 中国共产党领导是中国特色社会主义最本质特征；<br>
            ② 总任务是实现社会主义现代化和民族复兴；<br>
            ③ 社会主要矛盾是人民美好生活需要与不平衡不充分发展的矛盾；<br>
            ④ “五位一体”总体布局和“四个全面”战略布局；<br>
            ⑤ 全面深化改革总目标；⑥ 全面推进依法治国总目标；<br>
            ⑦ 坚持和完善社会主义基本经济制度；⑧ 新时代强军目标；<br>
            ⑨ 中国特色大国外交；⑩ 全面从严治党伟大工程。
          </td>
        </tr>
        <tr>
          <td><strong>“十四个坚持”</strong></td>
          <td><strong>基本方略与方法论层面</strong><br>行动纲领与实践指南</td>
          <td>坚持党对一切工作的领导、坚持以人民为中心、坚持全面深化改革、坚持新发展理念、坚持人民当家作主、坚持全面依法治国、坚持社会主义核心价值体系、坚持在发展中保障和改善民生、坚持人与自然和谐共生、坚持总体国家安全观、坚持党对军队的绝对领导、坚持“一国两制”推进祖国统一、坚持推动构建人类命运共同体、坚持全面从严治党。</td>
        </tr>
        <tr>
          <td><strong>“十三个方面成就”</strong></td>
          <td><strong>历史性变革与实践成果</strong><br>实践检验维度的具体呈现</td>
          <td>全面涵盖坚持党的全面领导、全面从严治党、经济建设、全面深化改革开放、政治建设、全面依法治国、文化建设、社会建设、生态文明建设、国防和军队建设、维护国家安全、坚持“一国两制”推进祖国统一、外交工作。</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>3. “六个必须坚持”—— 世界观与方法论的精髓</h3>
  <p>党的二十大报告明确提出，继续推进实践基础上的理论创新，必须牢牢把握好新时代中国特色社会主义思想的世界观和方法论：</p>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0;">
    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px 10px;">
      <strong>① 坚持人民至上</strong>：站稳人民立场，把人民放在心中最高位置。
    </div>
    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px 10px;">
      <strong>② 坚持自信自立</strong>：中国的事情必须由中国人民自己作主张、自己来处理。
    </div>
    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px 10px;">
      <strong>③ 坚持守正创新</strong>：守马克思主义之正，创实践和认识之新。
    </div>
    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px 10px;">
      <strong>④ 坚持问题导向</strong>：聚焦实践中遇到的新问题，在解决问题中推进发展。
    </div>
    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px 10px;">
      <strong>⑤ 坚持系统观念</strong>：统筹兼顾，前瞻性思考、全局性谋划、整体性推进。
    </div>
    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px 10px;">
      <strong>⑥ 坚持胸怀天下</strong>：秉持天下为公，推动构建人类命运共同体。
    </div>
  </div>

  <h3>4. 体育强国建设与中国式现代化的内在结合</h3>
  <p>体育是提高人民健康水平的重要途径，是满足人民群众对美好生活向往、促进人的全面发展的重要手段，是国家文化软实力的重要体现：</p>
  <ul>
    <li><strong>全民健身与健康中国国家战略</strong>：构建更高水平的全民健身公共服务体系，推动群众体育、竞技体育、体育产业协同协调发展；</li>
    <li><strong>中华体育精神与文化自信</strong>：弘扬“为国争光、无私奉献、科学求实、遵纪守法、团结协作、顽强拼搏”的中华体育精神，为实现强国复兴凝聚磅礴的精神力量。</li>
  </ul>

  <div class="footer-note">
    <span>番茄ToDo 专属学术研习档案库 · 专业课三科与习概考点梳理手册</span>
    <span>生成时间: 2026-11-12 · 权威归档</span>
  </div>

</body>
</html>
`;

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML written successfully to:', htmlPath);

// Convert to PDF using Google Chrome headless
console.log('Generating PDF via Headless Chrome...');
const chromePath = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
const cmd = `"${chromePath}" --headless=new --disable-gpu --print-to-pdf="${pdfWorkspacePath}" --no-pdf-header-footer "file:///${htmlPath.replace(/\\\\/g, '/')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('PDF generated successfully at:', pdfWorkspacePath);
  
  // Also copy to artifact directory
  fs.copyFileSync(pdfWorkspacePath, pdfArtifactPath);
  console.log('PDF copied to artifact path:', pdfArtifactPath);
} catch (e) {
  console.error('Failed to generate PDF via Chrome:', e);
}
