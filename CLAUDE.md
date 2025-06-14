# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

- 色々なコードを試す実験プロジェクトです。
- 実験なのでモックアップです。バックエンドが不要で、一旦はブラウザで動作するものをつくります。

## 技術

- **HTML5**: Single-page application structure
- **Tailwind CSS**: Utility-first CSS framework (loaded via CDN)
- **TypeScript**: For mobile menu toggle, smooth scrolling, and form handling
- **Google Fonts**: ~~Noto Sans~~ JP for Japanese typography

## 　開発環境

- コンパイルなどは、Docker を利用して環境を汚さないように配慮。
- あとで簡単に実行できるよう、頻度が高そうなコマンド群は、Makefile に自動で記載して管理。
- 技術スタックや開発環境の会話がなされたときには、CLAUDE.md に自動で追加する。

## 現在のプロジェクト

### みんなの姿勢診断 (posture-diagnosis/)
- カメラで姿勢を撮影して分析するWebアプリ
- 主な開発コマンド:
  - `make serve` - 開発サーバー起動
  - `make build` - TypeScriptコンパイル
  - `make docker-serve` - Docker環境でサーバー起動

## Code Architecture

- html と JS（TypeScript は分離する）
- コメントは日本語で記述

## Key Considerations

- 利用者は日本人です。表示は日本語にしてください。
