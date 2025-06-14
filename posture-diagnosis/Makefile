# みんなの姿勢診断 - Makefile

# デフォルトのターゲット
.PHONY: help
help:
	@echo "利用可能なコマンド:"
	@echo "  make serve      - 開発サーバーを起動"
	@echo "  make build      - TypeScriptをコンパイル"
	@echo "  make watch      - TypeScriptを監視モードでコンパイル"
	@echo "  make clean      - ビルド成果物を削除"
	@echo "  make docker-build - Docker環境でビルド"
	@echo "  make docker-serve - Docker環境でサーバー起動"

# TypeScriptのコンパイル
.PHONY: build
build:
	@echo "TypeScriptをコンパイル中..."
	@if command -v tsc > /dev/null 2>&1; then \
		tsc; \
	else \
		echo "TypeScriptがインストールされていません。"; \
		echo "npm install -g typescript を実行してください。"; \
		exit 1; \
	fi
	@echo "コンパイル完了！"

# 監視モードでTypeScriptをコンパイル
.PHONY: watch
watch:
	@echo "TypeScriptを監視モードで起動..."
	@tsc --watch

# 開発サーバーの起動
.PHONY: serve
serve: build
	@echo "開発サーバーを起動中..."
	@if command -v python3 > /dev/null 2>&1; then \
		echo "http://localhost:8000 でアクセスできます"; \
		echo "Ctrl+C で停止"; \
		python3 -m http.server 8000; \
	elif command -v python > /dev/null 2>&1; then \
		echo "http://localhost:8000 でアクセスできます"; \
		echo "Ctrl+C で停止"; \
		python -m SimpleHTTPServer 8000; \
	else \
		echo "Pythonがインストールされていません。"; \
		exit 1; \
	fi

# ビルド成果物の削除
.PHONY: clean
clean:
	@echo "ビルド成果物を削除中..."
	@rm -rf assets/js/*.js assets/js/*.js.map
	@echo "削除完了！"

# Docker環境でのビルド
.PHONY: docker-build
docker-build:
	@echo "Docker環境でビルド中..."
	@docker run --rm -v "$$(pwd):/app" -w /app node:18-alpine sh -c "npm install -g typescript && tsc"
	@echo "Dockerビルド完了！"

# Docker環境での開発サーバー起動
.PHONY: docker-serve
docker-serve: docker-build
	@echo "Docker環境で開発サーバーを起動中..."
	@echo "http://localhost:8000 でアクセスできます"
	@echo "Ctrl+C で停止"
	@docker run --rm -v "$$(pwd):/app" -w /app -p 8000:8000 python:3-alpine python -m http.server 8000

# インストール（初回セットアップ用）
.PHONY: install
install:
	@echo "開発環境をセットアップ中..."
	@if command -v npm > /dev/null 2>&1; then \
		npm install -g typescript; \
		echo "TypeScriptをインストールしました"; \
	else \
		echo "npmがインストールされていません"; \
		echo "Node.jsをインストールしてください"; \
	fi