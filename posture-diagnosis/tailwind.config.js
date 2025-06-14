/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 戦略的カラーパレット - 女子大生向けポップデザイン
      colors: {
        // プライマリーカラー（メインピンク）
        'primary': {
          50: '#fef7ff',   // 最も薄いピンク（背景用）
          100: '#fceef8',  // 薄いピンク（カード背景）
          200: '#f9d5e8',  // ライトピンク（ボーダー）
          300: '#f5b3d1',  // ソフトピンク（アクセント）
          400: '#f093fb',  // ビビッドピンク（ボタン等）
          500: '#ec4899',  // 標準ピンク（メインカラー）
          600: '#db2777',  // ダークピンク（ホバー）
          700: '#be185d',  // 濃いピンク（テキスト）
          800: '#9d174d',  // 最も濃いピンク
          900: '#831843',  // 超濃いピンク
        },
        
        // セカンダリーカラー（アクセント用）
        'accent': {
          50: '#fff0f5',   // パウダーピンク
          100: '#ffe4e6',  // ローズホワイト
          200: '#fecdd3',  // ライトローズ
          300: '#fda4af',  // ローズ
          400: '#fb7185',  // コーラルピンク
          500: '#f43f5e',  // ローズレッド
          600: '#e11d48',  // ダークローズ
          700: '#be123c',  // 濃いローズ
          800: '#9f1239',  // ダークレッド
          900: '#881337',  // 最も濃いレッド
        },
        
        // 成功色（緑系）
        'success': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // メイン成功色
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        // 警告色（オレンジ系）
        'warning': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // メイン警告色
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        
        // エラー色（赤系）
        'error': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // メインエラー色
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // ニュートラル（グレー系）
        'neutral': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      
      // カスタムフォントファミリー
      fontFamily: {
        'cute': ['M PLUS Rounded 1c', 'sans-serif'],
        'sans': ['M PLUS Rounded 1c', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      
      // カスタムボーダー半径
      borderRadius: {
        'cute': '1.5rem',  // 24px - 可愛い丸み
        'super-cute': '2rem',  // 32px - より可愛い丸み
      },
      
      // カスタムボックスシャドウ
      boxShadow: {
        'cute': '0 10px 25px -5px rgba(236, 72, 153, 0.1), 0 4px 6px -2px rgba(236, 72, 153, 0.05)',
        'cute-lg': '0 20px 50px -12px rgba(236, 72, 153, 0.25)',
        'cute-xl': '0 25px 60px -12px rgba(236, 72, 153, 0.35)',
      },
      
      // カスタムアニメーション
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce-cute': 'bounce 1s infinite',
        'pulse-cute': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        sparkle: {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: '1'
          },
          '50%': { 
            transform: 'scale(1.1) rotate(180deg)',
            opacity: '0.8'
          },
        }
      },
      
      // カスタムスペーシング
      spacing: {
        'cute': '1.25rem',  // 20px
        'super-cute': '2.5rem',  // 40px
      }
    },
  },
  plugins: [],
}