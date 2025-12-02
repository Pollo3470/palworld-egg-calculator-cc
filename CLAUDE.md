# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

帕鲁配种路径计算器 - A Palworld breeding path calculator that finds the shortest breeding routes from a starting Pal to a target Pal using BFS algorithm.

**Live site**: https://palworld-egg.pollochen.com

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run fetch-data   # Update Pal data from external sources (run on game version updates)
```

## Architecture

### Core Algorithm Flow

1. **Data Layer** (`src/data/pals.json`) - Static JSON containing all Pals with breeding power values
2. **Breeding Graph** (`src/lib/breeding.ts`) - Builds adjacency list where each Pal maps to possible offspring with partner info
3. **Pathfinding** (`src/lib/pathfinder.ts`) - BFS traversal to find shortest breeding paths

### Breeding Mechanics

- **Normal breeding**: Offspring power = floor((parent1 + parent2 + 1) / 2), matched to closest Pal
- **Unique combos**: Hardcoded parent pairs that produce specific offspring (stored in `uniqueBreedings`)
- **Excluded Pals**: `ignoreCombi: true` marks Pals that cannot breed (e.g., Terraria crossover creatures)

### Data Pipeline

`scripts/fetch-data.ts` merges data from two sources:
- **paldb.cc** - Pal names (Chinese/English), IDs, codes
- **PalCalc (GitHub)** - Breeding power values

ID matching handles format differences: paldb uses "1", "1B" while PalCalc uses "001", "001B".

### Key Components

- `PalSelector` - Autocomplete search with fuzzy matching on Chinese name/ID
- `PathDisplay` - Renders multiple breeding paths with step-by-step visualization
- `PalImage` - Handles CDN image loading with fallback to text placeholder
