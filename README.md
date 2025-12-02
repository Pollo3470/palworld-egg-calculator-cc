# 帕鲁配种路径计算器

幻兽帕鲁（Palworld）配种路径计算器，快速计算从起始帕鲁到目标帕鲁的最短配种路线。

🔗 **在线体验**: [https://palworld-egg.pollochen.com](https://palworld-egg.pollochen.com)

## 功能特性

- 🔍 **智能搜索** - 支持中文名称和 ID 模糊搜索帕鲁
- 🛤️ **最短路径** - 使用 BFS 算法计算配种代数最少的路径
- 📊 **多条方案** - 显示多条备选配种路线
- 🖼️ **头像展示** - 显示帕鲁头像，直观易懂
- 📱 **响应式设计** - 支持桌面和移动端

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 更新帕鲁数据（大版本更新时执行）
npm run fetch-data
```

## 项目结构

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 主页面
├── components/           # React 组件
│   ├── PalSelector.tsx   # 帕鲁选择器
│   ├── PalCard.tsx       # 帕鲁卡片
│   ├── PathDisplay.tsx   # 路径展示
│   └── BreedingStep.tsx  # 配种步骤
├── lib/                  # 核心逻辑
│   ├── breeding.ts       # 配种计算
│   ├── pathfinder.ts     # 最短路径算法
│   └── search.ts         # 模糊搜索
├── data/
│   └── pals.json         # 帕鲁数据
└── types/
    └── index.ts          # 类型定义

scripts/
└── fetch-data.ts         # 数据爬取脚本
```

## 数据来源

- 帕鲁基础数据: [paldb.cc](https://paldb.cc)
- 配种力数据: [PalCalc](https://github.com/tylercamp/palcalc)
- 帕鲁头像: paldb.cc CDN

## 配种机制

### 普通配种
后代配种力 = (父母1配种力 + 父母2配种力 + 1) / 2

系统选择配种力最接近该值的帕鲁作为后代。

### 特殊组合
某些特定的父母组合会产生固定的后代，这些特殊组合的产物只能通过该组合获得。

## 许可证

MIT License
