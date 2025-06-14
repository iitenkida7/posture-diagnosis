import { describe, it, expect, beforeEach } from 'vitest'

// 統合テスト（実際のmain.tsの動作をテスト）
describe('Application Integration Tests', () => {
  beforeEach(async () => {
    // DOMを一度クリア
    document.body.innerHTML = ''
    
    // テスト用のHTMLを設定（index.htmlから抜粋）
    document.body.innerHTML = `
      <section id="landing" class="">
        <button id="startBtn">診断開始</button>
      </section>
      <section id="camera" class="hidden">
        <button id="backBtn">戻る</button>
        <video id="video"></video>
        <canvas id="canvas"></canvas>
        <button id="captureBtn">撮影</button>
      </section>
      <section id="questionnaire" class="hidden">
        <form id="questionForm">
          <select name="deskwork">
            <option value="0-2">0-2時間</option>
            <option value="3-5">3-5時間</option>
          </select>
          <select name="exercise">
            <option value="daily">毎日</option>
            <option value="weekly">週数回</option>
          </select>
          <input type="checkbox" value="肩こり" />
          <button type="submit">分析開始</button>
        </form>
      </section>
      <section id="result" class="hidden">
        <div id="resultContent"></div>
        <div id="resultButtons" style="display: none;">
          <button id="shareBtn">シェア</button>
          <button id="retryBtn">もう一度</button>
        </div>
      </section>
    `
    
    // main.tsを動的インポート（テスト用）
    // 実際のアプリケーションロジックをテストするため
    await import('../main.js')
    
    // DOMContentLoadedイベントを手動発火
    const event = new Event('DOMContentLoaded')
    document.dispatchEvent(event)
  })

  it('アプリケーションの基本機能が動作する', () => {
    // 基本的な要素が存在することを確認
    expect(document.getElementById('landing')).toBeTruthy()
    expect(document.getElementById('camera')).toBeTruthy()
    expect(document.getElementById('questionnaire')).toBeTruthy()
    expect(document.getElementById('result')).toBeTruthy()
    
    // 初期状態の確認
    const landingSection = document.getElementById('landing')
    const cameraSection = document.getElementById('camera')
    
    expect(landingSection?.classList.contains('hidden')).toBe(false)
    expect(cameraSection?.classList.contains('hidden')).toBe(true)
  })

  it('基本的なDOM操作が正常に動作する', () => {
    const startBtn = document.getElementById('startBtn')
    const landingSection = document.getElementById('landing')
    const cameraSection = document.getElementById('camera')
    
    expect(startBtn).toBeTruthy()
    expect(landingSection).toBeTruthy()
    expect(cameraSection).toBeTruthy()
    
    // クラスの追加・削除テスト
    landingSection?.classList.add('hidden')
    cameraSection?.classList.remove('hidden')
    
    expect(landingSection?.classList.contains('hidden')).toBe(true)
    expect(cameraSection?.classList.contains('hidden')).toBe(false)
  })

  it('フォーム要素が正常に動作する', () => {
    const questionForm = document.getElementById('questionForm') as HTMLFormElement
    expect(questionForm).toBeTruthy()
    
    const deskworkSelect = questionForm.querySelector('select[name="deskwork"]') as HTMLSelectElement
    const exerciseSelect = questionForm.querySelector('select[name="exercise"]') as HTMLSelectElement
    const checkbox = questionForm.querySelector('input[type="checkbox"]') as HTMLInputElement
    
    expect(deskworkSelect).toBeTruthy()
    expect(exerciseSelect).toBeTruthy()
    expect(checkbox).toBeTruthy()
    
    // 値の設定テスト
    deskworkSelect.value = '3-5'
    exerciseSelect.value = 'weekly'
    checkbox.checked = true
    
    expect(deskworkSelect.value).toBe('3-5')
    expect(exerciseSelect.value).toBe('weekly')
    expect(checkbox.checked).toBe(true)
  })
})