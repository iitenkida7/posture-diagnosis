# プロジェクト共通 Makefile

.PHONY: help
help:
	@echo "=== みんなの姿勢診断 ==="
	@echo "make posture-serve  - 姿勢診断アプリのサーバーを起動"
	@echo "make posture-build  - 姿勢診断アプリのTypeScriptをコンパイル"
	@echo "make posture-clean  - 姿勢診断アプリのビルド成果物を削除"

# みんなの姿勢診断
.PHONY: posture-build
posture-build:
	cd posture-diagnosis && tsc

.PHONY: posture-serve
posture-serve: posture-build
	cd posture-diagnosis && python3 -m http.server 8000

.PHONY: posture-clean
posture-clean:
	cd posture-diagnosis && rm -rf assets/js/*.js assets/js/*.js.map

.PHONY: posture-watch
posture-watch:
	cd posture-diagnosis && tsc --watch

.PHONY: posture-docker-serve
posture-docker-serve:
	docker run --rm -v "$$(pwd)/posture-diagnosis:/app" -w /app node:18-alpine sh -c "npm install -g typescript && tsc"
	docker run --rm -v "$$(pwd)/posture-diagnosis:/app" -w /app -p 8000:8000 python:3-alpine python -m http.server 8000