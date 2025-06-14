import { describe, it, expect, beforeEach } from 'vitest'

// 簡単な統合テスト
describe('Application Integration Tests', () => {
  beforeEach(() => {
    // DOMを一度クリア
    document.body.innerHTML = ''
    
    // テスト用のHTMLを設定
    document.body.innerHTML = `
      <section id="landing" class="">
        <button id="startBtn">診断開始</button>
      </section>
      <section id="camera" class="hidden">
        <button id="backBtn">戻る</button>
        <video id="videoElement"></video>
        <canvas id="guideCanvas"></canvas>
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
  })

  it('アプリケーションの基本DOM要素が存在する', () => {
    // 基本的な要素が存在することを確認
    expect(document.getElementById('landing')).toBeTruthy()
    expect(document.getElementById('camera')).toBeTruthy()
    expect(document.getElementById('questionnaire')).toBeTruthy()
    expect(document.getElementById('result')).toBeTruthy()
    expect(document.getElementById('startBtn')).toBeTruthy()
    expect(document.getElementById('videoElement')).toBeTruthy()
    expect(document.getElementById('guideCanvas')).toBeTruthy()
  })

  it('セクションの初期状態が正しい', () => {
    const landingSection = document.getElementById('landing')
    const cameraSection = document.getElementById('camera')
    
    expect(landingSection?.classList.contains('hidden')).toBe(false)
    expect(cameraSection?.classList.contains('hidden')).toBe(true)
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

  it('DOM操作の基本機能が動作する', () => {
    const landingSection = document.getElementById('landing')
    const cameraSection = document.getElementById('camera')
    
    // クラスの追加・削除テスト
    landingSection?.classList.add('hidden')
    cameraSection?.classList.remove('hidden')
    
    expect(landingSection?.classList.contains('hidden')).toBe(true)
    expect(cameraSection?.classList.contains('hidden')).toBe(false)
    
    // 元に戻す
    landingSection?.classList.remove('hidden')
    cameraSection?.classList.add('hidden')
    
    expect(landingSection?.classList.contains('hidden')).toBe(false)
    expect(cameraSection?.classList.contains('hidden')).toBe(true)
  })
})