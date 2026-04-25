# ECC Quest

ECCスキルを体系的に習得するためのゲームです。  
自分のプロジェクトを持ち込み、ECCスキルを使いながらクエストを進めます。  
ゲームクリア後も日常開発でXPが蓄積し続ける**永続的なモチベーションツール**です。

---

## 前提条件

### 1. Node.js
バージョン不問。[nodejs.org](https://nodejs.org) からインストール。

### 2. Claude Code CLI
[claude.ai/code](https://claude.ai/code) からインストール。

### 3. ECC（Everything Claude Code）プラグイン
Claude Code のチャットで以下を実行:

```
/plugin marketplace add https://github.com/affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

---

## 特徴

- **自分のプロジェクトで遊ぶ**: 架空の課題ではなく、実際に作りたいものを題材にする
- **XP & レベルシステム**: ECCスキルを使うたびにXPが貯まり、レベルアップする
- **トロフィー**: スキル初使用・5回・10回達成などでトロフィーを獲得
- **スキル使用回数の可視化**: どのスキルを何回使ったか一目でわかる
- **ゲームクリア後も継続**: `~/.claude/xp.json` に永続記録。日常開発でもXPが増え続ける
- **npm install不要**: Node.js標準モジュールのみ

---

## 構成（2層アーキテクチャ）

```
【永続XPトラッカー】（グローバル）
~/.claude/xp.json          ← レベル・XP・スキル使用回数・トロフィー

【ゲームリポジトリ】（このリポジトリ）
ecc-quest/
├── progress.json          ← クエスト進捗
├── scripts/check.js       ← CLIツール
├── quests/
│   ├── chapter1/          ← 第1章: 小さなスクリプト
│   ├── chapter2/          ← 第2章: Webアプリ
│   ├── chapter3/          ← 第3章: チーム開発
│   └── sidequests/        ← サイドクエスト（任意）
└── .claude/CLAUDE.md      ← ゲームルール（Claude Code が自動読込み）
```

---

## クイックスタート

> 詳しい手順は [QUICKSTART.md](QUICKSTART.md) を参照。

### 1. リポジトリをcloneする

```bash
git clone https://github.com/rasokiwayami/ecc-quest.git
cd ecc-quest
```

### 2. ゲームを開始する（対話式）

```bash
node scripts/check.js init
```

名前と作りたいプロジェクトを入力するとゲームが始まります。  
プロジェクトが決まっていない場合はスターターから選べます。

### 3. XP自動記録の設定（推奨）

```bash
node scripts/check.js setup-hooks
```

これを実行すると、ECCスキルを使うたびに**自動でXPが記録**されます。

### 4. 進捗を確認する

```bash
node scripts/check.js status
```

### 5. 最初のクエストを読む

```
quests/chapter1/q01-prp-prd.md
```

---

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `node scripts/check.js init` | ゲーム開始（対話式） |
| `node scripts/check.js setup-hooks` | XP自動記録の設定（初回のみ） |
| `node scripts/check.js status` | 進捗・XP・スキル使用回数を表示 |
| `node scripts/check.js record <skill>` | ECCスキル使用を手動記録してXP付与 |
| `node scripts/check.js trophies` | 獲得トロフィー一覧 |

---

## XP・レベル設計

| レベル | 必要XP | 称号 |
|--------|--------|------|
| 1 | 0 | 見習い |
| 2 | 1,000 | 開発者 |
| 3 | 3,000 | 熟練者 |
| 4 | 7,000 | 職人 |
| 5 | 15,000 | マスター |
| 6 | 30,000 | 伝説 |

ゲーム全体でのXP総量は約3,500 XP。**Lv3到達ギリギリの緊張感**が設計の核心です。  
Lv4以上は日常開発でECCスキルを使い続けることが必要です。

### スキル熟練度

| 使用回数 | XP倍率 |
|---------|--------|
| 初回 | ×1.0 |
| 2〜4回目 | ×0.7 |
| 5〜9回目 | ×0.5 |
| 10回以上 | ×0.3 |

---

## クエスト構成

### 第1章: 小さなスクリプト（合計 〜700 XP）
1. PRDを書く（`/prp-prd` × 1）
2. 実装計画を立てる（`/plan` × 1）
3. TDDで開発する（`/tdd` × 3）
4. コードを実装する（`/prp-implement` × 2）

### 第2章: Webアプリ（合計 〜1,200 XP）
5〜10. より大規模なプロジェクトで同スキルを再体験 + コードレビュー・セキュリティレビュー

### 第3章: チーム開発（合計 〜900 XP）
11〜14. リファクタリング・コミット・PR作成を中心に

### サイドクエスト（合計 〜700 XP）
- deep-research / docs / security-scan（任意・追加XP）

