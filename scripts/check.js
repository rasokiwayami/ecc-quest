#!/usr/bin/env node
'use strict';

const fs       = require('fs');
const path     = require('path');
const os       = require('os');
const readline = require('readline');

const XP_PATH            = path.join(os.homedir(), '.claude', 'xp.json');
const PROGRESS_PATH      = path.join(__dirname, '..', 'progress.json');
const DOCS_DIR           = path.join(__dirname, '..', 'docs');
const GLOBAL_SETTINGS    = path.join(os.homedir(), '.claude', 'settings.json');
const CHECK_JS_PATH      = path.resolve(__filename);

// ── Starter projects ──────────────────────────────────────────

const STARTERS = [
  {
    id: 1,
    name: 'CLIタスク管理ツール',
    tag: '初心者向け・おすすめ',
    desc: 'タスクの追加・削除・一覧表示・完了マークをターミナルで操作',
    size: '全クエストをカバーできるちょうど良いサイズ',
    hints: `## どんなツール？
ターミナルで動くタスク管理ツール。

## 主な機能
- タスクの追加 / 削除 / 一覧表示
- 完了マーク（done/undone）
- JSONファイルでデータを永続保存
- フィルタリング（完了のみ・未完了のみ）

## 技術のポイント
- Node.js の fs モジュールでファイル読み書き
- コマンドライン引数のパース（process.argv）
- データの整合性（追加・削除のID管理）

## 推奨ステップ
1. まず「追加と一覧表示」だけ動かす
2. 削除・完了マークを追加
3. フィルタリングを追加
4. エラー処理を整える`,
  },
  {
    id: 2,
    name: 'Markdownブログジェネレーター',
    desc: 'Markdownファイルを読み込んで静的HTMLを生成するツール',
    tag: 'ファイル処理・変換処理が学べる',
    size: '中規模。第2章のWebアプリ文脈にも合う',
    hints: `## どんなツール？
Markdownで書いた記事を自動でHTMLに変換して静的サイトを生成。

## 主な機能
- Markdownファイルの読み込み・パース
- HTMLテンプレートへの埋め込み
- front matter（タイトル・日付・タグ）のパース
- 記事一覧ページの生成

## 技術のポイント
- 正規表現によるMarkdownパース（または軽量ライブラリ）
- テンプレートエンジンの実装
- ファイルシステムの走査

## 推奨ステップ
1. 見出し・本文だけのシンプルなHTML変換
2. front matterのパース追加
3. CSSスタイリング
4. 記事一覧の自動生成`,
  },
  {
    id: 3,
    name: '家計簿スクリプト',
    desc: '収支を記録・集計してレポートを出力するCLIツール',
    tag: 'データ管理・集計処理が学べる',
    size: '中規模。データの整合性テストが書きやすくTDDに最適',
    hints: `## どんなツール？
収入と支出を記録し、月次レポートやカテゴリ別集計を表示。

## 主な機能
- 収支の追加（金額・カテゴリ・日付・メモ）
- 月次サマリー（収入合計・支出合計・収支差）
- カテゴリ別集計
- CSV出力

## 技術のポイント
- 日付計算・フィルタリング
- 集計処理（reduce）
- CSVフォーマットの生成
- データバリデーション（金額が数値かどうかなど）

## 推奨ステップ
1. 収支の追加と一覧表示
2. 月次サマリーの計算
3. カテゴリ別集計
4. CSV出力`,
  },
  {
    id: 4,
    name: 'Discord Bot',
    desc: 'スラッシュコマンドに応答するDiscord Bot',
    tag: 'API連携・非同期処理が学べる',
    size: 'やや大きめ。API設計やセキュリティレビューが自然に発生する',
    hints: `## どんなBot？
Discordサーバーでスラッシュコマンドを受け取り、便利な機能を提供。

## 主な機能例
- /hello → あいさつ返答
- /reminder 10分後 → リマインダー通知
- /poll 質問 選択肢1 選択肢2 → 投票作成

## 技術のポイント
- discord.js ライブラリの使用
- 非同期処理（async/await）
- Webhookとイベント駆動設計
- 環境変数でのトークン管理（セキュリティ）

## 推奨ステップ
1. Botの登録・接続確認
2. /hello コマンドの実装
3. メイン機能（リマインダーor投票）の実装
4. エラー処理・セキュリティ確認`,
  },
];

// ── XP / Level data ───────────────────────────────────────────

const SKILL_XP = {
  'prp-prd':         80,
  'prp-plan':        80,
  'plan':            80,
  'tdd':            100,
  'prp-implement':  100,
  'code-review':     60,
  'security-review': 60,
  'prp-commit':      30,
  'prp-pr':          80,
  'deep-research':  100,
  'docs':            50,
  'prune':           60,
  'security-scan':   60,
  'simplify':        50,
};

const LEVELS = [
  { level: 1, xp: 0,     title: '見習い'   },
  { level: 2, xp: 1000,  title: '開発者'   },
  { level: 3, xp: 3000,  title: '熟練者'   },
  { level: 4, xp: 7000,  title: '職人'     },
  { level: 5, xp: 15000, title: 'マスター' },
  { level: 6, xp: 30000, title: '伝説'     },
];

const TROPHIES = {
  'first-prp-prd':        { name: '初体験: /prp-prd',        desc: '初めて /prp-prd を使用' },
  'first-plan':            { name: '初体験: /plan',            desc: '初めて /plan を使用' },
  'first-tdd':             { name: '初体験: /tdd',             desc: '初めて /tdd を使用' },
  'first-prp-implement':   { name: '初体験: /prp-implement',   desc: '初めて /prp-implement を使用' },
  'first-code-review':     { name: '初体験: /code-review',     desc: '初めて /code-review を使用' },
  'first-security-review': { name: '初体験: /security-review', desc: '初めて /security-review を使用' },
  'first-prp-commit':      { name: '初体験: /prp-commit',      desc: '初めて /prp-commit を使用' },
  'first-prp-pr':          { name: '初体験: /prp-pr',          desc: '初めて /prp-pr を使用' },
  'first-deep-research':   { name: '初体験: /deep-research',   desc: '初めて /deep-research を使用' },
  'first-docs':            { name: '初体験: /docs',            desc: '初めて /docs を使用' },
  'first-prune':           { name: '初体験: /prune',           desc: '初めて /prune を使用' },
  'first-security-scan':   { name: '初体験: /security-scan',   desc: '初めて /security-scan を使用' },
  'first-simplify':        { name: '初体験: /simplify',        desc: '初めて /simplify を使用' },
  'regular-tdd':           { name: '常連: /tdd',               desc: '/tdd を5回使用' },
  'regular-code-review':   { name: '常連: /code-review',       desc: '/code-review を5回使用' },
  'regular-prp-prd':       { name: '常連: /prp-prd',           desc: '/prp-prd を5回使用' },
  'mastery-tdd':           { name: '習得: /tdd',               desc: '/tdd を10回使用' },
  'mastery-code-review':   { name: '習得: /code-review',       desc: '/code-review を10回使用' },
  'all-skills':            { name: '全スキル解禁',              desc: 'すべてのECCスキルを最低1回使用' },
  'chapter1-clear':        { name: '第1章クリア',               desc: '第1章のすべてのクエストを完了' },
  'chapter2-clear':        { name: '第2章クリア',               desc: '第2章のすべてのクエストを完了' },
  'chapter3-clear':        { name: '第3章クリア',               desc: '第3章のすべてのクエストを完了' },
  'side-quester':          { name: 'サイドクエスター',           desc: 'サイドクエストを1本クリア' },
  'completionist':         { name: 'コンプリート',              desc: 'すべてのクエストをクリア' },
  'level-2':               { name: 'Lv2 開発者',                desc: 'Lv2に到達' },
  'level-3':               { name: 'Lv3 熟練者',                desc: 'Lv3に到達' },
  'level-4':               { name: 'Lv4 職人',                  desc: 'Lv4に到達' },
};

// ── Helpers ───────────────────────────────────────────────────

function ask(rl, prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

function loadXP() {
  if (!fs.existsSync(XP_PATH)) return initXP();
  try { return JSON.parse(fs.readFileSync(XP_PATH, 'utf8')); }
  catch {
    const bak = XP_PATH + '.bak';
    fs.copyFileSync(XP_PATH, bak);
    console.error(`⚠  xp.json が壊れていたため再生成しました（バックアップ: ${bak}）`);
    return initXP();
  }
}

function initXP() {
  const data = { level: 1, total_xp: 0, title: '見習い', skill_counts: {}, trophies: [], log: [] };
  saveXP(data);
  return data;
}

function saveXP(data) {
  fs.mkdirSync(path.dirname(XP_PATH), { recursive: true });
  fs.writeFileSync(XP_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function getLevel(totalXP) {
  let cur = LEVELS[0];
  for (const l of LEVELS) { if (totalXP >= l.xp) cur = l; }
  return cur;
}

function calcXP(skill, usedCount) {
  const base = SKILL_XP[skill] || 50;
  if (usedCount === 0) return Math.round(base * 1.0);
  if (usedCount < 4)   return Math.round(base * 0.7);
  if (usedCount < 9)   return Math.round(base * 0.5);
  return Math.round(base * 0.3);
}

function collectNewTrophies(xp, progress) {
  const have = new Set(xp.trophies.map(t => t.id));
  const earned = [];
  const add = id => { if (TROPHIES[id] && !have.has(id)) { earned.push(id); have.add(id); } };

  for (const [skill, count] of Object.entries(xp.skill_counts)) {
    if (count >= 1)  add(`first-${skill}`);
    if (count >= 5)  add(`regular-${skill}`);
    if (count >= 10) add(`mastery-${skill}`);
  }
  if (Object.keys(SKILL_XP).every(s => (xp.skill_counts[s] || 0) >= 1)) add('all-skills');
  const lvl = getLevel(xp.total_xp);
  for (let i = 2; i <= lvl.level; i++) add(`level-${i}`);

  if (progress) {
    const qs = progress.quests;
    if (['ch1-q01','ch1-q02','ch1-q03','ch1-q04'].every(id => qs[id]?.status === 'completed')) add('chapter1-clear');
    if (['ch2-q01','ch2-q02','ch2-q03','ch2-q04','ch2-q05','ch2-q06'].every(id => qs[id]?.status === 'completed')) add('chapter2-clear');
    if (['ch3-q01','ch3-q02','ch3-q03','ch3-q04'].every(id => qs[id]?.status === 'completed')) add('chapter3-clear');
    if (['sq-01','sq-02','sq-03'].some(id => qs[id]?.status === 'completed')) add('side-quester');
    if (Object.values(qs).every(q => q.status === 'completed')) add('completionist');
  }
  return earned;
}

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8')); }
  catch {
    console.error('❌  progress.json が見つかりません。まず以下を実行してください:');
    console.error('    node scripts/check.js init');
    process.exit(1);
  }
}

function saveProgress(data) {
  if (fs.existsSync(PROGRESS_PATH)) {
    fs.copyFileSync(PROGRESS_PATH, PROGRESS_PATH + '.bak');
  }
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function makeQuestTemplate(xp) {
  const cnt = s => xp.skill_counts[s] || 0;
  return {
    'ch1-q01': { title: 'プロジェクトのPRDを書く',            chapter: 1, required_skill: 'prp-prd',         required_count: 1, progress_count: 0, skill_count_at_activation: cnt('prp-prd'),         status: 'active',  completed_at: null },
    'ch1-q02': { title: '実装計画を立てる',                    chapter: 1, required_skill: 'plan',             required_count: 1, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch1-q03': { title: 'TDDで開発する（3回）',                chapter: 1, required_skill: 'tdd',              required_count: 3, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch1-q04': { title: 'コードを実装する（2回）',              chapter: 1, required_skill: 'prp-implement',   required_count: 2, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch2-q01': { title: 'WebアプリのPRDを書く（2回）',         chapter: 2, required_skill: 'prp-prd',         required_count: 2, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch2-q02': { title: 'Webアプリの計画を立てる（2回）',      chapter: 2, required_skill: 'plan',             required_count: 2, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch2-q03': { title: 'TDDでWebアプリを開発する（5回）',     chapter: 2, required_skill: 'tdd',              required_count: 5, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch2-q04': { title: 'Webアプリを実装する（3回）',           chapter: 2, required_skill: 'prp-implement',   required_count: 3, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch2-q05': { title: 'コードレビューを受ける（3回）',        chapter: 2, required_skill: 'code-review',     required_count: 3, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch2-q06': { title: 'セキュリティレビュー（2回）',          chapter: 2, required_skill: 'security-review', required_count: 2, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch3-q01': { title: 'コードをリファクタリング（3回）',      chapter: 3, required_skill: 'simplify',        required_count: 3, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch3-q02': { title: '不要コードを削除する（3回）',          chapter: 3, required_skill: 'prune',            required_count: 3, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch3-q03': { title: 'コミットを作成する（3回）',             chapter: 3, required_skill: 'prp-commit',      required_count: 3, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'ch3-q04': { title: 'PRを作成する（2回）',                  chapter: 3, required_skill: 'prp-pr',          required_count: 2, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'sq-01':   { title: '[サイド] 深いリサーチ（2回）',          chapter: 0, required_skill: 'deep-research',   required_count: 2, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'sq-02':   { title: '[サイド] ドキュメントを書く（3回）',    chapter: 0, required_skill: 'docs',             required_count: 3, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
    'sq-03':   { title: '[サイド] セキュリティスキャン（3回）',  chapter: 0, required_skill: 'security-scan',   required_count: 3, progress_count: 0, skill_count_at_activation: null,                   status: 'locked',  completed_at: null },
  };
}

function writeProjectBrief(starter) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  const content = `# プロジェクトブリーフ: ${starter.name}

> このファイルはスターターテンプレートです。
> Quest 01 で /prp-prd を使い、ここに書かれたヒントをもとに本格的なPRDを作成してください。

## プロジェクト概要
${starter.desc}

## 規模感
${starter.size}

## 実装ヒント
${starter.hints}

---
Quest 01 を始めるには:
1. Claude Code のチャットで \`/prp-prd\` を実行
2. このファイルの内容を参考にプロジェクトを説明する
3. 完了後: \`node scripts/check.js record prp-prd\`
`;
  fs.writeFileSync(path.join(DOCS_DIR, 'project-brief.md'), content, 'utf8');
}

// ── Commands ──────────────────────────────────────────────────

async function cmdInit(args) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  let playerName    = args[0];
  let projectDesc   = null;
  let selectedStarter = null;

  // Check if second arg is a starter number (1-5)
  const secondArg = args[1];
  if (secondArg && /^[1-5]$/.test(secondArg.trim())) {
    const num = parseInt(secondArg);
    selectedStarter = num <= 4 ? STARTERS[num - 1] : null;
    projectDesc = selectedStarter ? selectedStarter.name : null;
  } else if (secondArg) {
    projectDesc = secondArg;
  }

  // Interactive: ask for name if not provided
  if (!playerName) {
    process.stdout.write('\n');
    playerName = (await ask(rl, '  あなたの名前を入力してください: ')).trim() || 'プレイヤー';
  }

  // Interactive: show starter menu if no project selected yet
  if (!projectDesc && !selectedStarter) {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║   どんなプロジェクトを作りますか？               ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    for (const s of STARTERS) {
      console.log(`  ${s.id}. ${s.name}`);
      console.log(`     [${s.tag}]`);
      console.log(`     ${s.desc}\n`);
    }
    console.log('  5. 自分でプロジェクトを説明する\n');

    const choice = (await ask(rl, '  選択してください (1-5): ')).trim();
    const num = parseInt(choice);

    if (num >= 1 && num <= 4) {
      selectedStarter = STARTERS[num - 1];
      projectDesc = selectedStarter.name;
    } else if (num === 5 || isNaN(num)) {
      projectDesc = (await ask(rl, '  プロジェクトの説明を入力してください: ')).trim()
        || '（プロジェクトの説明をここに書いてください）';
    }
  }

  rl.close();

  const xp = loadXP();
  const progress = {
    player: playerName,
    project_description: projectDesc,
    starter: selectedStarter ? selectedStarter.id : null,
    started_at: new Date().toISOString(),
    current_quest: 'ch1-q01',
    quests: makeQuestTemplate(xp),
  };

  saveProgress(progress);

  if (selectedStarter) {
    writeProjectBrief(selectedStarter);
  }

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║       ECC Quest へようこそ！          ║');
  console.log('╚══════════════════════════════════════╝\n');
  console.log(`  プレイヤー  : ${playerName}`);
  console.log(`  プロジェクト: ${projectDesc}\n`);

  if (selectedStarter) {
    console.log(`  📄  プロジェクトブリーフを作成しました: docs/project-brief.md`);
    console.log(`     Quest 01 で /prp-prd を使う際に参考にしてください\n`);
  }

  console.log('  ── 次のステップ ────────────────────────────');
  console.log('  1. XP自動記録を設定する（初回のみ・推奨）:');
  console.log('     node scripts/check.js setup-hooks\n');
  console.log('  2. 進捗を確認する:');
  console.log('     node scripts/check.js status\n');
  console.log('  3. 最初のクエストを読む:');
  console.log('     quests/chapter1/q01-prp-prd.md\n');
}

function cmdStatus() {
  const progress = loadProgress();
  const xp = loadXP();
  const lvl = getLevel(xp.total_xp);
  const nextLvl = LEVELS.find(l => l.xp > xp.total_xp);

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log(`║  ${progress.player} の冒険ログ`.padEnd(47) + '║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`\n  Lv${lvl.level} ${lvl.title}  |  ${xp.total_xp.toLocaleString()} XP`);

  if (nextLvl) {
    const gap = nextLvl.xp - xp.total_xp;
    const pct = Math.round(((xp.total_xp - lvl.xp) / (nextLvl.xp - lvl.xp)) * 20);
    const bar = '█'.repeat(Math.max(0, pct)) + '░'.repeat(Math.max(0, 20 - pct));
    console.log(`  [${bar}] → Lv${nextLvl.level}まであと ${gap.toLocaleString()} XP`);
  }

  const usedSkills = Object.entries(xp.skill_counts).filter(([, c]) => c > 0);
  if (usedSkills.length > 0) {
    console.log('\n  ── スキル使用回数 ─────────────────────────');
    for (const [skill, count] of usedSkills.sort((a, b) => b[1] - a[1])) {
      const bar = '█'.repeat(Math.min(count, 15)) + '░'.repeat(Math.max(0, 15 - count));
      console.log(`  /${skill.padEnd(17)} ${bar} ${String(count).padStart(3)}回`);
    }
  }

  if (xp.trophies.length > 0) {
    console.log('\n  ── 獲得トロフィー ─────────────────────────');
    const recent = xp.trophies.slice(-8);
    for (const t of recent) console.log(`  🏆  ${t.name}`);
    if (xp.trophies.length > 8) console.log(`  ... 他 ${xp.trophies.length - 8} 個`);
    console.log(`  （全一覧: node scripts/check.js trophies）`);
  }

  console.log('\n  ── クエスト進捗 ───────────────────────────');
  const sections = [
    ['第1章: 小さなスクリプト', Object.entries(progress.quests).filter(([id]) => id.startsWith('ch1'))],
    ['第2章: Webアプリ',        Object.entries(progress.quests).filter(([id]) => id.startsWith('ch2'))],
    ['第3章: チーム開発',        Object.entries(progress.quests).filter(([id]) => id.startsWith('ch3'))],
    ['サイドクエスト',           Object.entries(progress.quests).filter(([id]) => id.startsWith('sq'))],
  ];

  for (const [label, quests] of sections) {
    console.log(`\n  【${label}】`);
    for (const [, q] of quests) {
      const icon = q.status === 'completed' ? '✅' : q.status === 'active' ? '▶ ' : '🔒';
      const detail = q.status === 'active'
        ? ` (/${q.required_skill} を ${q.progress_count}/${q.required_count}回 使用済み)`
        : '';
      console.log(`  ${icon}  ${q.title}${detail}`);
    }
  }

  console.log('\n──────────────────────────────────────────────\n');
}

function cmdRecord(args) {
  const raw = args[0];
  if (!raw) { console.error('使用法: node scripts/check.js record <skill-name>'); process.exit(1); }

  const skill = raw.replace(/^\//, '').replace(/^everything-claude-code:/, '');
  if (!SKILL_XP[skill]) { console.log(`ℹ  /${skill} は追跡対象外のスキルです。`); return; }

  const xp = loadXP();
  const progress = loadProgress();
  const prevCount = xp.skill_counts[skill] || 0;
  const earned = calcXP(skill, prevCount);

  xp.skill_counts[skill] = prevCount + 1;
  xp.total_xp += earned;
  xp.log.push({ at: new Date().toISOString(), skill, xp: earned, total_count: prevCount + 1 });

  const prevLvl = getLevel(xp.total_xp - earned);
  const newLvl  = getLevel(xp.total_xp);
  xp.level = newLvl.level;
  xp.title = newLvl.title;

  const activeId = progress.current_quest;
  let questMsg = '';
  if (activeId && progress.quests[activeId]) {
    const q = progress.quests[activeId];
    if (q.required_skill === skill && q.status === 'active') {
      q.progress_count++;
      if (q.progress_count >= q.required_count) {
        q.status = 'completed';
        q.completed_at = new Date().toISOString();
        questMsg = `\n🎯  クエストクリア！「${q.title}」`;

        const ids = Object.keys(progress.quests);
        const nextId = ids[ids.indexOf(activeId) + 1];
        if (nextId) {
          const next = progress.quests[nextId];
          next.status = 'active';
          next.skill_count_at_activation = xp.skill_counts[next.required_skill] || 0;
          progress.current_quest = nextId;
          questMsg += `\n▶  次のクエスト: 「${next.title}」`;
        } else {
          progress.current_quest = null;
          questMsg += '\n🎊  すべてのクエストをクリア！おめでとうございます！';
        }
      } else {
        const rem = q.required_count - q.progress_count;
        questMsg = `\n📊  クエスト進捗: /${skill} をあと${rem}回使用してください (${q.progress_count}/${q.required_count})`;
      }
    }
  }

  const newTrophies = collectNewTrophies(xp, progress);
  for (const id of newTrophies) {
    xp.trophies.push({ id, name: TROPHIES[id].name, earned_at: new Date().toISOString() });
  }

  saveXP(xp);
  saveProgress(progress);

  const label = prevCount === 0 ? '(初回!)' : prevCount < 4 ? '(習熟中)' : prevCount < 9 ? '(慣れてきた)' : '(完全習得)';
  console.log(`\n✨  +${earned} XP  /${skill} ${prevCount + 1}回目 ${label}`);
  console.log(`   合計: ${xp.total_xp.toLocaleString()} XP  |  Lv${newLvl.level} ${newLvl.title}`);

  if (newLvl.level > prevLvl.level) console.log(`\n🎉  レベルアップ！ Lv${newLvl.level} ${newLvl.title} に到達！`);
  for (const id of newTrophies) { if (TROPHIES[id]) console.log(`🏆  トロフィー獲得: ${TROPHIES[id].name}`); }
  if (questMsg) console.log(questMsg);
  console.log('');
}

function cmdTrophies() {
  const xp = loadXP();
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║        トロフィーコレクション          ║');
  console.log('╚══════════════════════════════════════╝\n');

  if (xp.trophies.length === 0) {
    console.log('  まだトロフィーがありません。ECCスキルを使って獲得しよう！\n');
    return;
  }

  for (const t of xp.trophies) {
    const date = t.earned_at ? new Date(t.earned_at).toLocaleDateString('ja-JP') : '';
    console.log(`  🏆  ${t.name.padEnd(28)} ${date}`);
  }

  const total = Object.keys(TROPHIES).length;
  console.log(`\n  取得済み: ${xp.trophies.length} / ${total} 個\n`);
}

function cmdAutoRecord() {
  try {
    const raw = process.env.CLAUDE_TOOL_INPUT || '{}';
    const input = JSON.parse(raw);
    const skill = (input.skill || '').replace(/^everything-claude-code:/, '');
    if (skill && SKILL_XP[skill]) cmdRecord([skill]);
  } catch { /* silent — called from hook */ }
}

function cmdSetupHooks() {
  let settings = {};
  if (fs.existsSync(GLOBAL_SETTINGS)) {
    try {
      fs.copyFileSync(GLOBAL_SETTINGS, GLOBAL_SETTINGS + '.bak');
      settings = JSON.parse(fs.readFileSync(GLOBAL_SETTINGS, 'utf8'));
    } catch {
      console.error('⚠  settings.json の読み込みに失敗しました。');
      process.exit(1);
    }
  }

  if (!settings.hooks) settings.hooks = {};
  if (!settings.hooks.PostToolUse) settings.hooks.PostToolUse = [];

  const hookCommand = `node "${CHECK_JS_PATH}" auto-record`;
  const already = settings.hooks.PostToolUse.some(entry =>
    Array.isArray(entry.hooks) && entry.hooks.some(h => h.command === hookCommand)
  );

  if (already) {
    console.log('\n✓  ECC Quest フックはすでに登録されています。\n');
    return;
  }

  settings.hooks.PostToolUse.push({
    matcher: 'Skill',
    hooks: [{ type: 'command', command: hookCommand }],
  });

  fs.mkdirSync(path.dirname(GLOBAL_SETTINGS), { recursive: true });
  fs.writeFileSync(GLOBAL_SETTINGS, JSON.stringify(settings, null, 2), 'utf8');

  console.log('\n✅  ECC Quest フックを登録しました！');
  console.log('   ECCスキルを使うと自動でXPが記録されます。');
  console.log(`   設定ファイル: ${GLOBAL_SETTINGS}\n`);
}

// ── Main ──────────────────────────────────────────────────────

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case 'init':
    cmdInit(args).catch(e => { console.error(e.message); process.exit(1); });
    break;
  case 'status':       cmdStatus();       break;
  case 'record':       cmdRecord(args);   break;
  case 'trophies':     cmdTrophies();     break;
  case 'setup-hooks':  cmdSetupHooks();   break;
  case 'auto-record':  cmdAutoRecord();   break;
  default:
    console.log('\nECC Quest - コマンド一覧:');
    console.log('  node scripts/check.js init              # 対話式でゲーム開始');
    console.log('  node scripts/check.js init "名前" 1     # スターター1を選んで開始');
    console.log('  node scripts/check.js status            # 進捗・XP確認');
    console.log('  node scripts/check.js record <skill>    # XPを手動記録');
    console.log('  node scripts/check.js trophies          # トロフィー一覧');
    console.log('  node scripts/check.js setup-hooks       # XP自動記録の設定\n');
}
