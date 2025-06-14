# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

- 色々なコードを試す実験プロジェクトです。
- 実験なのでモックアップです。バックエンドが不要で、一旦はブラウザで動作するものをつくります。

## 技術

- **HTML5**: Single-page application structure
- **Vite**: 高速モダン開発ツール（HMR、TypeScript、PostCSS統合）
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: For mobile menu toggle, smooth scrolling, and form handling
- **Google Fonts**: ~~Noto Sans~~ JP for Japanese typography

## 　開発環境

- **Docker完全統一** - ローカル環境を汚さない完全コンテナ化
- Node.jsコンテナでVite開発サーバー、ビルド、プレビューを統一管理
- Docker Composeで複雑なコマンドを管理（docker-compose.yml）
- あとで簡単に実行できるよう、頻度が高そうなコマンド群は、Makefile に自動で記載して管理
- **ローカルNode.js不要** - 全ての開発作業をDocker経由で実行
- 技術スタックや開発環境の会話がなされたときには、CLAUDE.md に自動で追加する

## 現在のプロジェクト

### みんなの姿勢診断 (posture-diagnosis/)
- カメラで姿勢を撮影して分析するWebアプリ
- 女子大生向けのポップなピンクデザイン
- 戦略的なカラーパレット管理（Tailwind CSS）
- **Vite**による高速開発環境（HMR、TypeScript、Tailwind CSS統合）
- **Docker完全統一開発** - ローカルNode.js不要
- 主な開発コマンド（プロジェクトルートから実行、全てDocker経由）:
  - `make dev` - 開発サーバー起動（http://localhost:8001）
  - `make build` - プロダクションビルド
  - `make preview` - ビルド版プレビューサーバー
  - `make install` - 依存関係インストール

## Code Architecture

- html と JS（TypeScript は分離する）
- コメントは日本語で記述

## Key Considerations

- 利用者は日本人です。表示は日本語にしてください。
