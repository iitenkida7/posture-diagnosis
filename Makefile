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
	docker run --rm -v "$$(pwd)/posture-diagnosis:/app" -w /app node:18-alpine sh -c "npm install -g typescript && tsc"

.PHONY: serve
serve: build
	docker run --rm -v "$$(pwd)/posture-diagnosis:/app" -w /app -p 8000:8000 node:18-alpine sh -c "npm install -g http-server && http-server -p 8000"

.PHONY: clean
clean:
	cd posture-diagnosis && rm -rf assets/js/*.js assets/js/*.js.map

.PHONY: watch
watch:
	docker run --rm -it -v "$$(pwd)/posture-diagnosis:/app" -w /app node:18-alpine sh -c "npm install -g typescript && tsc --watch"