# ECC Quest — クイックスタート

5分でゲームを始める手順書。

---

## 前提条件（まだの場合）

**Claude Code** がなければ: [claude.ai/code](https://claude.ai/code) からインストール

**ECC プラグイン**がなければ: Claude Code のチャットで実行
```
/plugin marketplace add https://github.com/affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

---

## 1. ゲームを開始する

```bash
node scripts/check.js init
```

名前とプロジェクトを入力するとゲームが始まる。  
プロジェクトが決まっていない場合は、表示される4つのスターターから選べる。

---

## 2. XP自動記録を設定する（初回のみ・推奨）

```bash
node scripts/check.js setup-hooks
```

これを実行すると、ECCスキルを使うたびに**自動でXPが記録**される。  
設定は一度だけでよい（`~/.claude/settings.json` に書き込まれる）。

---

## 3. 最初のクエストを確認する

```bash
node scripts/check.js status
```

現在のクエスト・XP・レベルが表示される。  
最初のクエストは `quests/chapter1/q01-prp-prd.md` を読む。

---

## 4. Claude Code を ecc-quest から起動する

> ⚠️ **重要**: ゲームルールは `ecc-quest/.claude/CLAUDE.md` に書かれており、  
> **ecc-quest ディレクトリを作業ディレクトリにして Claude Code を起動したときのみ**有効になる。

```bash
# ecc-quest ディレクトリで Claude Code を起動する
cd ecc-quest
claude  # または Claude Code の IDE拡張機能でこのフォルダを開く
```

自分のプロジェクトのファイルは、Claude Code のチャットで相対パスや絶対パスで参照できる。

---

## 5. ECCスキルを使う

クエストの指示に従い、Claude Code のチャットでスキルを実行する。

例:
```
/prp-prd
```

XP自動記録を設定済みであれば、スキル完了後に自動でXPが記録される。

---

## 6. 繰り返す

クエストをクリアすると次のクエストが解放される。`status` で進捗を確認しながら進める。

---

## 章の概要

| 章 | テーマ | 主なスキル |
|---|---|---|
| 第1章 | 小さなスクリプト | `/prp-prd` `/plan` `/tdd` `/prp-implement` |
| 第2章 | Webアプリ開発 | `/code-review` `/security-review` |
| 第3章 | チーム開発・出荷 | `/simplify` `/prune` `/prp-commit` `/prp-pr` |
| サイドクエスト | 探索と深化 | `/deep-research` `/docs` `/security-scan` |

---

## コマンド一覧

```bash
node scripts/check.js init              # ゲーム開始
node scripts/check.js setup-hooks       # XP自動記録の設定（初回のみ）
node scripts/check.js status            # 進捗確認
node scripts/check.js record <skill>    # XP手動記録（自動記録未設定時）
node scripts/check.js trophies          # トロフィー一覧
```
