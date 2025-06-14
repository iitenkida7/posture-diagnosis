# プロジェクト共通 Makefile

.PHONY: help
help:
	@echo "=== みんなの姿勢診断 ==="
	@echo "make serve  - サーバーを起動"
	@echo "make build  - TypeScriptをコンパイル"
	@echo "make clean  - ビルド成果物を削除"

# みんなの姿勢診断
.PHONY: build
build:
	docker compose run --rm node

.PHONY: serve
serve: build
	docker compose run --rm --service-ports node-serve

.PHONY: clean
clean:
	cd posture-diagnosis && rm -rf assets/js/*.js assets/js/*.js.map

.PHONY: watch
watch:
	docker compose run --rm node-watch