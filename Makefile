# 姿勢診断アプリ開発用 Makefile（Docker統一版）

.PHONY: help dev build preview install clean

# デフォルトターゲット
help:
	@echo "利用可能なコマンド（全てDocker経由）:"
	@echo "  make dev     - 開発サーバー起動（http://localhost:8000）"
	@echo "  make build   - プロダクションビルド"
	@echo "  make preview - ビルド版プレビューサーバー"
	@echo "  make install - 依存関係のインストール"
	@echo "  make clean   - ビルドファイルの削除"

# 開発サーバー（Docker）
dev:
	docker-compose up node-dev

# プロダクションビルド（Docker）
build:
	docker-compose run --rm node-build

# ビルド版プレビュー（Docker）
preview:
	docker-compose up node-preview

# 依存関係のインストール（Docker）
install:
	docker-compose run --rm node-install

# ビルドファイルの削除
clean:
	cd posture-diagnosis && rm -rf dist
