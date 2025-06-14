# みんなの姿勢診断 🤖💕

AI-powered posture analysis web application for cute posture improvement!

## 🌟 概要

カメラで撮影するだけで、AIがあなたの姿勢をリアルタイム分析！女子大生向けのポップで可愛いデザインで、楽しく姿勢改善ができるWebアプリです。

### 主な機能

- 🤖 **TensorFlow.js による本格AI姿勢分析**
- 📸 **カメラ撮影 + 可愛いロボットガイド**
- 🎨 **視覚的フィードバック**（グリーン=正常、レッド=問題箇所）
- 📋 **アンケート連動の詳細診断**
- 💖 **個別改善提案**
- 📱 **SNSシェア機能**

## 🎯 ターゲット

- **メインターゲット**: 女子大生
- **デザイン**: ポップで可愛いピンク系
- **UX**: 楽しく、わかりやすく

## 🚀 技術スタック

- **Frontend**: HTML5, TypeScript, Tailwind CSS
- **AI**: TensorFlow.js MoveNet (姿勢検出)
- **Build**: Vite (高速開発環境)
- **Development**: Docker完全統一環境

## 🛠️ 開発環境

### 必要な環境

- Docker & Docker Compose
- ローカルNode.js不要（全てDocker経由）

### コマンド

```bash
# 依存関係インストール
make install

# 開発サーバー起動
make dev
# → http://localhost:8000

# プロダクションビルド
make build

# ビルド版プレビュー
make preview
```

## 📁 プロジェクト構成

```
posture-diagnosis/
├── src/
│   ├── main.ts              # メインアプリケーション
│   ├── camera.ts            # カメラ管理
│   ├── posture-analyzer.ts  # AI姿勢分析
│   ├── pose-visualizer.ts   # 骨格線可視化
│   ├── templates.ts         # HTML生成
│   └── styles/
│       └── input.css        # Tailwind CSS
├── public/
│   └── favicon.svg          # 🤖ロボットfavicon
├── index.html               # メインHTML
├── vite.config.js           # Vite設定
├── tailwind.config.js       # Tailwind設定
└── docker-compose.yml       # Docker環境
```

## 🎨 特徴的な機能

### AI姿勢分析
- 17個の関節点から角度計算
- 前傾頭位、巻き肩、反り腰を自動検出
- 信頼度表示付き

### 視覚的フィードバック
- 骨格線でポーズ可視化
- 問題箇所を赤色でハイライト
- 正常部位をグリーンで表示

### UX設計
- 段階的ローディング（約5秒）で信頼感演出
- 診断中はボタン非表示で集中促進
- 可愛い🤖ガイドで親しみやすさ

## 📸 スクリーンショット

[カメラ画面] → [AI分析中] → [結果表示]

## 🤝 コントリビュート

Issues and Pull Requests are welcome!

## 📄 ライセンス

MIT License

---

Made with 💖 and 🤖 AI technology
