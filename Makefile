# 姿勢診断アプリ開発用 Makefile

.PHONY: help dev build clean install

# デフォルトターゲット
help:
	@echo "利用可能なコマンド:"
	@echo "  make dev     - 開発モード（リアルタイムコンパイル）"
	@echo "  make build   - プロダクションビルド"
	@echo "  make install - 依存関係のインストール"
	@echo "  make clean   - ビルドファイルの削除"

# 開発モード（リアルタイムコンパイル）
dev:
	cd posture-diagnosis && npm run dev

# プロダクションビルド
build:
	cd posture-diagnosis && npm run build

# 依存関係のインストール
install:
	cd posture-diagnosis && npm install

# ビルドファイルの削除
clean:
	cd posture-diagnosis && rm -rf assets/js/* assets/css/output.css
