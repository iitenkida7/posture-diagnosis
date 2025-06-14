# プロジェクト共通 Makefile

.PHONY: help
help:
	@echo "=== みんなの姿勢診断 ==="
	@echo "make serve     - サーバーを起動"
	@echo "make build     - TypeScript/CSS をビルド"
	@echo "make build-ts  - TypeScript のみビルド"
	@echo "make build-css - Tailwind CSS のみビルド"
	@echo "make clean     - ビルド成果物を削除"
	@echo "make install   - 依存関係をインストール"

# 依存関係のインストール
.PHONY: install
install:
	docker compose run --rm node-install

# みんなの姿勢診断
.PHONY: build
build:
	docker compose run --rm node-build

.PHONY: build-ts
build-ts:
	docker compose run --rm node

.PHONY: build-css
build-css:
	docker compose run --rm node-css

.PHONY: serve
serve: build
	docker compose run --rm --service-ports node-serve

.PHONY: clean
clean:
	cd posture-diagnosis && rm -rf assets/js/*.js assets/js/*.js.map assets/css/output.css

.PHONY: watch
watch:
	docker compose run --rm node-watch

.PHONY: dev
dev:
	docker compose run --rm node-dev