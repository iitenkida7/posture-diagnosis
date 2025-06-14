# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

- 色々なコードを試す実験プロジェクトです。
- 実験なのでモックアップです。バックエンドが不要で、一旦はブラウザで動作するものをつくります。

## 技術

- **HTML5**: Single-page application structure
- **Vite**: 高速モダン開発ツール（HMR、TypeScript、PostCSS 統合）
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: For mobile menu toggle, smooth scrolling, and form handling
- **Google Fonts**: ~~Noto Sans~~ JP for Japanese typography

## 　開発環境

- **Docker 完全統一** - ローカル環境を汚さない完全コンテナ化
- Node.js コンテナで Vite 開発サーバー、ビルド、プレビューを統一管理
- Docker Compose で複雑なコマンドを管理（docker-compose.yml）
- あとで簡単に実行できるよう、頻度が高そうなコマンド群は、Makefile に自動で記載して管理
- **ローカル Node.js 不要** - 全ての開発作業を Docker 経由で実行
- 技術スタックや開発環境の会話がなされたときには、CLAUDE.md に自動で追加する

## Git フロー

- **GitHub Flow 開発** - main への直コミット禁止
- 機能開発・バグ修正は feature ブランチで作業
- Pull Request 経由で main ブランチにマージ
- main ブランチは常にデプロイ可能な状態を維持

## テスト戦略

- **包括的テストカバレッジ** - ユニット・統合・E2E テスト
- **Vitest** - 高速ユニットテスト（TypeScript、ESM 対応）
- **Playwright** - クロスブラウザ E2E テスト（Chrome、Firefox、Safari、モバイル）
- **GitHub Actions 分離** - CI（テスト）とCD（デプロイ）を明確に分離
- **Docker テスト統一** - ローカル・CI 環境の一致
- **品質ゲート** - lint、型チェック、テスト全通過が必須

## GitHub Actions 構成

- **`.github/workflows/ci.yml`** - 全ブランチでテスト実行（PR・push時）
- **`.github/workflows/deploy.yml`** - mainブランチのみデプロイ（テスト通過後）

## 品質チェック

- **型安全性確保** - TypeScript 厳格モード、型エラーゼロ
- **ビルド成功確認** - Vite プロダクションビルド正常完了
- **基本テスト通過** - DOM操作、文字列・配列操作、環境確認

## 現在のプロジェクト

### みんなの姿勢診断 (posture-diagnosis/)

- カメラで姿勢を撮影して分析する Web アプリ
- 女子大生向けのポップなピンクデザイン
- 戦略的なカラーパレット管理（Tailwind CSS）
- **Vite**による高速開発環境（HMR、TypeScript、Tailwind CSS 統合）
- **Docker 完全統一開発** - ローカル Node.js 不要
- 主な開発コマンド（プロジェクトルートから実行、全て Docker 経由）:
  - `make dev` - 開発サーバー起動（http://localhost:8000）
  - `make build` - プロダクションビルド
  - `make preview` - ビルド版プレビューサーバー
  - `make install` - 依存関係インストール
  - `make test` - 全テスト実行（ユニット + E2E）
  - `make test-unit` - ユニットテスト実行
  - `make test-e2e` - E2Eテスト実行  
  - `make lint` - コードリンティング
  - `make type-check` - TypeScript型チェック

## Code Architecture

- html と JS（TypeScript は分離する）
- コメントは日本語で記述

## Key Considerations

- 利用者は日本人です。表示は日本語にしてください。
