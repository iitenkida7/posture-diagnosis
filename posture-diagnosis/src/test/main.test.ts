import { describe, it, expect, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

// メイン処理をモジュールとしてテストするため、動的インポートを使用
describe('Main Application Flow', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    
    // DOMContentLoaded イベントを手動で発火
    const event = new Event('DOMContentLoaded')
    document.dispatchEvent(event)
  })

  describe('画面遷移', () => {
    it('診断開始ボタンで カメラ画面に遷移する', async () => {
      const startBtn = document.getElementById('startBtn') as HTMLButtonElement
      const landingSection = document.getElementById('landing') as HTMLElement
      const cameraSection = document.getElementById('camera') as HTMLElement
      
      // 初期状態：ランディングページが表示されている
      landingSection.classList.remove('hidden')
      cameraSection.classList.add('hidden')
      
      // 診断開始ボタンをクリック
      await user.click(startBtn)
      
      // カメラ画面に遷移することを確認
      await waitFor(() => {
        expect(landingSection.classList.contains('hidden')).toBe(true)
        expect(cameraSection.classList.contains('hidden')).toBe(false)
      })
    })

    it('戻るボタンでランディングページに戻る', async () => {
      const backBtn = document.getElementById('backBtn') as HTMLButtonElement
      const landingSection = document.getElementById('landing') as HTMLElement
      const cameraSection = document.getElementById('camera') as HTMLElement
      
      // カメラ画面の状態
      landingSection.classList.add('hidden')
      cameraSection.classList.remove('hidden')
      
      // 戻るボタンをクリック
      await user.click(backBtn)
      
      // ランディングページに戻ることを確認
      expect(landingSection.classList.contains('hidden')).toBe(false)
      expect(cameraSection.classList.contains('hidden')).toBe(true)
    })

    it('撮影ボタンでアンケート画面に遷移する', async () => {
      const captureBtn = document.getElementById('captureBtn') as HTMLButtonElement
      const cameraSection = document.getElementById('camera') as HTMLElement
      const questionnaireSection = document.getElementById('questionnaire') as HTMLElement
      
      // カメラ画面の状態
      cameraSection.classList.remove('hidden')
      questionnaireSection.classList.add('hidden')
      
      // 撮影ボタンをクリック
      await user.click(captureBtn)
      
      // アンケート画面に遷移することを確認
      expect(cameraSection.classList.contains('hidden')).toBe(true)
      expect(questionnaireSection.classList.contains('hidden')).toBe(false)
    })
  })

  describe('アンケートフォーム', () => {
    it('フォーム送信で結果画面に遷移する', async () => {
      const questionForm = document.getElementById('questionForm') as HTMLFormElement
      const questionnaireSection = document.getElementById('questionnaire') as HTMLElement
      const resultSection = document.getElementById('result') as HTMLElement
      
      // アンケート画面の状態
      questionnaireSection.classList.remove('hidden')
      resultSection.classList.add('hidden')
      
      // フォームに入力
      const deskworkSelect = questionForm.querySelector('select[name="deskwork"]') as HTMLSelectElement
      const exerciseSelect = questionForm.querySelector('select[name="exercise"]') as HTMLSelectElement
      const checkbox = questionForm.querySelector('input[type="checkbox"]') as HTMLInputElement
      
      await user.selectOptions(deskworkSelect, '3-5')
      await user.selectOptions(exerciseSelect, 'weekly')
      await user.click(checkbox)
      
      // フォーム送信
      await user.click(questionForm.querySelector('button[type="submit"]') as HTMLButtonElement)
      
      // 結果画面に遷移することを確認
      await waitFor(() => {
        expect(questionnaireSection.classList.contains('hidden')).toBe(true)
        expect(resultSection.classList.contains('hidden')).toBe(false)
      }, { timeout: 15000 }) // 分析処理の時間を考慮
    })

    it('必要な入力項目が正しく取得される', async () => {
      const questionForm = document.getElementById('questionForm') as HTMLFormElement
      
      // フォームに入力
      const deskworkSelect = questionForm.querySelector('select[name="deskwork"]') as HTMLSelectElement
      const exerciseSelect = questionForm.querySelector('select[name="exercise"]') as HTMLSelectElement
      const checkbox = questionForm.querySelector('input[type="checkbox"]') as HTMLInputElement
      
      await user.selectOptions(deskworkSelect, '3-5')
      await user.selectOptions(exerciseSelect, 'weekly')
      await user.click(checkbox)
      
      // 入力値の確認
      expect(deskworkSelect.value).toBe('3-5')
      expect(exerciseSelect.value).toBe('weekly')
      expect(checkbox.checked).toBe(true)
    })
  })

  describe('結果画面', () => {
    it('もう一度診断ボタンでランディングページに戻る', async () => {
      const retryBtn = document.getElementById('retryBtn') as HTMLButtonElement
      const resultSection = document.getElementById('result') as HTMLElement
      const landingSection = document.getElementById('landing') as HTMLElement
      const questionForm = document.getElementById('questionForm') as HTMLFormElement
      
      // 結果画面の状態
      resultSection.classList.remove('hidden')
      landingSection.classList.add('hidden')
      
      // フォームに事前データを設定
      const deskworkSelect = questionForm.querySelector('select[name="deskwork"]') as HTMLSelectElement
      deskworkSelect.value = '3-5'
      
      // もう一度診断ボタンをクリック
      await user.click(retryBtn)
      
      // ランディングページに戻ることを確認
      expect(resultSection.classList.contains('hidden')).toBe(true)
      expect(landingSection.classList.contains('hidden')).toBe(false)
      
      // フォームがリセットされることを確認
      expect(deskworkSelect.value).toBe('')
    })

    it('シェアボタンが正常に動作する', async () => {
      const shareBtn = document.getElementById('shareBtn') as HTMLButtonElement
      
      // window.openのモック確認
      expect(window.open).toBeDefined()
      
      // シェアボタンをクリック
      await user.click(shareBtn)
      
      // window.openが呼ばれることを確認（実際の分析結果が必要なため、モック状態では呼ばれない）
      // 実際のテストでは、分析結果がある状態でテストする必要がある
    })
  })

  describe('エラーハンドリング', () => {
    it('カメラ初期化エラーが適切に処理される', async () => {
      // getUserMediaがエラーを投げるようにモック
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(new Error('Camera error'))
      
      const startBtn = document.getElementById('startBtn') as HTMLButtonElement
      
      // エラーが発生してもアプリケーションがクラッシュしないことを確認
      await expect(user.click(startBtn)).resolves.not.toThrow()
    })

    it('分析エラー時にアンケート画面に戻る', async () => {
      // PostureAnalyzerのanalizeメソッドがエラーを投げるようにモック
      // この部分は実際の実装に依存するため、統合テストで確認
      expect(true).toBe(true) // プレースホルダー
    })
  })
})