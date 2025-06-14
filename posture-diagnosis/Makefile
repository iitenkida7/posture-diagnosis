# みんなの姿勢診断 - Makefile

.PHONY: help
help:
	@echo "make serve      - 開発サーバーを起動"
	@echo "make build      - TypeScriptをコンパイル"
	@echo "make clean      - ビルド成果物を削除"

.PHONY: build
build:
	tsc

.PHONY: serve
serve: build
	python3 -m http.server 8000

.PHONY: clean
clean:
	rm -rf assets/js/*.js assets/js/*.js.map

.PHONY: watch
watch:
	tsc --watch

.PHONY: docker-serve
docker-serve:
	docker run --rm -v "$$(pwd):/app" -w /app node:18-alpine sh -c "npm install -g typescript && tsc"
	docker run --rm -v "$$(pwd):/app" -w /app -p 8000:8000 python:3-alpine python -m http.server 8000