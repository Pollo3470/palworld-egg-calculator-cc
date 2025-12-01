/**
 * 帕鲁数据爬取脚本
 * 从 paldb.cc 和 PalCalc 获取配种数据
 * 运行方式: npm run fetch-data
 */

import * as fs from 'fs';
import * as path from 'path';

// 数据源 URL
const PALDB_URL = 'https://paldb.cc/json/iv_cn.json';
const PALCALC_URL = 'https://raw.githubusercontent.com/tylercamp/palcalc/main/PalCalc.Model/db.json';

// 帕鲁头像 CDN 模板
const ICON_CDN_TEMPLATE = 'https://cdn.paldb.cc/image/Pal/Texture/PalIcon/Normal/T_{code}_icon_normal.webp';

interface PaldbPal {
  Id: string;
  Name: string;
  NameEn: string;
  Code: string;
  Hp: number;
  ShotAttack: number;
  Defense: number;
  CaptureRate: number;
  IgnoreCombi?: boolean;
}

interface PalCalcPal {
  Name: string;
  Id: {
    PalDexNo: number;
    IsVariant: boolean;
  };
  BreedingPower: number;
  LocalizedNames: Record<string, string>;
}

interface PalCalcData {
  Pals: PalCalcPal[];
  UniqueBreedings?: Array<{
    Parent1: string;
    Parent2: string;
    Child: string;
  }>;
}

interface OutputPal {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  breedingPower: number;
  iconUrl: string;
  ignoreCombi: boolean;
}

interface OutputData {
  pals: OutputPal[];
  uniqueBreedings: Array<{
    parent1: string;
    parent2: string;
    child: string;
  }>;
  version: string;
  updatedAt: string;
}

async function fetchJSON<T>(url: string): Promise<T> {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

function formatPalId(palDexNo: number, isVariant: boolean): string {
  const baseId = palDexNo.toString().padStart(3, '0');
  return isVariant ? `${baseId}B` : baseId;
}

async function main() {
  try {
    // 获取数据
    const [paldbData, palcalcData] = await Promise.all([
      fetchJSON<PaldbPal[]>(PALDB_URL),
      fetchJSON<PalCalcData>(PALCALC_URL),
    ]);

    console.log(`Fetched ${paldbData.length} pals from paldb.cc`);
    console.log(`Fetched ${palcalcData.Pals.length} pals from PalCalc`);

    // 创建 PalCalc 数据的多种映射方式
    const palcalcByPaddedId = new Map<string, PalCalcPal>(); // "001", "001B"
    const palcalcByUnpaddedId = new Map<string, PalCalcPal>(); // "1", "1B"
    const palcalcByName = new Map<string, PalCalcPal>(); // 英文名

    for (const pal of palcalcData.Pals) {
      const paddedId = formatPalId(pal.Id.PalDexNo, pal.Id.IsVariant);
      const unpaddedId = pal.Id.IsVariant
        ? `${pal.Id.PalDexNo}B`
        : `${pal.Id.PalDexNo}`;

      palcalcByPaddedId.set(paddedId, pal);
      palcalcByUnpaddedId.set(unpaddedId, pal);
      palcalcByName.set(pal.Name.toLowerCase(), pal);
    }

    // 合并数据
    const pals: OutputPal[] = [];
    let matchedCount = 0;

    for (const pal of paldbData) {
      // 尝试多种方式匹配 PalCalc 数据
      let palcalcPal = palcalcByUnpaddedId.get(pal.Id);
      if (!palcalcPal && pal.Id) {
        // 尝试补零匹配
        const paddedId = pal.Id.replace(/^(\d+)(B?)$/, (_, num, suffix) =>
          num.padStart(3, '0') + suffix
        );
        palcalcPal = palcalcByPaddedId.get(paddedId);
      }
      if (!palcalcPal) {
        // 尝试英文名匹配
        palcalcPal = palcalcByName.get(pal.NameEn.toLowerCase());
      }

      if (palcalcPal) {
        matchedCount++;
      }

      // 如果 PalCalc 中没有该帕鲁的配种力数据，使用默认值
      const breedingPower = palcalcPal?.BreedingPower ?? 500;

      // 使用 ID，如果为空则使用 code 作为 ID
      const id = pal.Id || pal.Code;

      pals.push({
        id,
        name: pal.Name,
        nameEn: pal.NameEn,
        code: pal.Code,
        breedingPower,
        iconUrl: ICON_CDN_TEMPLATE.replace('{code}', pal.Code),
        ignoreCombi: pal.IgnoreCombi ?? false,
      });
    }

    // 处理特殊配种组合
    // 从 PalCalc 源码分析，特殊组合数据需要从游戏文件提取
    // 这里我们从 PalCalc 的 UniqueBreedings 字段获取（如果存在）
    const uniqueBreedings: OutputData['uniqueBreedings'] = [];

    // PalCalc 的 db.json 可能不包含 UniqueBreedings，需要从其他来源获取
    // 这里暂时使用已知的特殊组合列表
    const knownUniqueBreedings = [
      // 融合怪系列
      { parent1: 'Relaxaurus', parent2: 'Sparkit', child: 'Relaxaurus Lux' },
      { parent1: 'Incineram', parent2: 'Maraith', child: 'Incineram Noct' },
      { parent1: 'Mau', parent2: 'Pengullet', child: 'Mau Cryst' },
      { parent1: 'Vanwyrm', parent2: 'Foxcicle', child: 'Vanwyrm Cryst' },
      { parent1: 'Eikthyrdeer', parent2: 'Hangyu', child: 'Eikthyrdeer Terra' },
      { parent1: 'Elphidran', parent2: 'Surfent', child: 'Elphidran Aqua' },
      { parent1: 'Pyrin', parent2: 'Katress', child: 'Pyrin Noct' },
      { parent1: 'Mammorest', parent2: 'Wumpo', child: 'Mammorest Cryst' },
      { parent1: 'Mossanda', parent2: 'Grizzbolt', child: 'Mossanda Lux' },
      { parent1: 'Dinossom', parent2: 'Rayhound', child: 'Dinossom Lux' },
      { parent1: 'Jolthog', parent2: 'Pengullet', child: 'Jolthog Cryst' },
      { parent1: 'Frostallion', parent2: 'Helzephyr', child: 'Frostallion Noct' },
      { parent1: 'Kingpaca', parent2: 'Reindrix', child: 'Kingpaca Cryst' },
      { parent1: 'Lyleen', parent2: 'Menasting', child: 'Lyleen Noct' },
      { parent1: 'Leezpunk', parent2: 'Flambelle', child: 'Leezpunk Ignis' },
      { parent1: 'Blazehowl', parent2: 'Felbat', child: 'Blazehowl Noct' },
      { parent1: 'Robinquill', parent2: 'Fuddler', child: 'Robinquill Terra' },
      { parent1: 'Broncherry', parent2: 'Fuack', child: 'Broncherry Aqua' },
      { parent1: 'Surfent', parent2: 'Dumud', child: 'Surfent Terra' },
      { parent1: 'Gobfin', parent2: 'Rooby', child: 'Gobfin Ignis' },
      { parent1: 'Suzaku', parent2: 'Jormuntide', child: 'Suzaku Aqua' },
      { parent1: 'Reptyro', parent2: 'Foxcicle', child: 'Reptyro Cryst' },
      { parent1: 'Hangyu', parent2: 'Swee', child: 'Hangyu Cryst' },
      { parent1: 'Lyleen', parent2: 'Menasting', child: 'Lyleen Noct' },
      { parent1: 'Wumpo', parent2: 'Warsect', child: 'Wumpo Botan' },
    ];

    // 将英文名映射到 ID
    const nameToIdMap = new Map<string, string>();
    for (const pal of pals) {
      nameToIdMap.set(pal.nameEn.toLowerCase(), pal.id);
      nameToIdMap.set(pal.name, pal.id);
    }

    for (const combo of knownUniqueBreedings) {
      const parent1Id = nameToIdMap.get(combo.parent1.toLowerCase());
      const parent2Id = nameToIdMap.get(combo.parent2.toLowerCase());
      const childId = nameToIdMap.get(combo.child.toLowerCase());

      if (parent1Id && parent2Id && childId) {
        uniqueBreedings.push({
          parent1: parent1Id,
          parent2: parent2Id,
          child: childId,
        });
      }
    }

    // 输出数据
    const outputData: OutputData = {
      pals,
      uniqueBreedings,
      version: 'v0.6',
      updatedAt: new Date().toISOString(),
    };

    // 写入文件
    const outputPath = path.join(__dirname, '../src/data/pals.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');

    console.log(`\nData saved to ${outputPath}`);
    console.log(`Total pals: ${pals.length}`);
    console.log(`Matched with PalCalc: ${matchedCount}`);
    console.log(`Unique breeding combos: ${uniqueBreedings.length}`);

  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
}

main();
