# 姿勢診断アプリ開発用 Makefile（Docker統一版）

.PHONY: help dev build preview install clean test test-unit test-e2e lint type-check

# デフォルトターゲット
help:
	@echo "利用可能なコマンド（全てDocker経由）:"
	@echo "  make dev       - 開発サーバー起動（http://localhost:8000）"
	@echo "  make build     - プロダクションビルド"
	@echo "  make preview   - ビルド版プレビューサーバー"
	@echo "  make install   - 依存関係のインストール"
	@echo "  make test      - 全テスト実行（ユニット + E2E）"
	@echo "  make test-unit - ユニットテスト実行"
	@echo "  make test-e2e  - E2Eテスト実行"
	@echo "  make lint      - コードリンティング"
	@echo "  make type-check - TypeScript型チェック"
	@echo "  make clean     - ビルドファイルの削除"

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

# 全テスト実行
test:
	docker-compose run --rm node-test npm run test:run

# ユニットテスト実行
test-unit:
	docker-compose run --rm node-test npm run test:run

# E2Eテスト実行
test-e2e:
	@echo "Setting up E2E test environment..."
	docker-compose run --rm node-test bash -c "npx playwright install chromium && npm run test:e2e"

# コードリンティング
lint:
	docker-compose run --rm node-test npm run lint

# TypeScript型チェック
type-check:
	docker-compose run --rm node-test npm run type-check

# ビルドファイルの削除
clean:
	cd posture-diagnosis && rm -rf dist
