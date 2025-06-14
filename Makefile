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
	cd posture-diagnosis && tsc

.PHONY: serve
serve: build
	cd posture-diagnosis && python3 -m http.server 8000

.PHONY: clean
clean:
	cd posture-diagnosis && rm -rf assets/js/*.js assets/js/*.js.map

.PHONY: watch
watch:
	cd posture-diagnosis && tsc --watch

.PHONY: docker
docker:
	docker run --rm -v "$$(pwd)/posture-diagnosis:/app" -w /app node:18-alpine sh -c "npm install -g typescript && tsc"
	docker run --rm -v "$$(pwd)/posture-diagnosis:/app" -w /app -p 8000:8000 python:3-alpine python -m http.server 8000