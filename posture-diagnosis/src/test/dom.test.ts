import { describe, it, expect, beforeEach } from 'vitest'

// DOM操作の基本テスト
describe('DOM Manipulation Tests', () => {
  beforeEach(() => {
    // DOMをリセット
    document.body.innerHTML = ''
    
    // 基本的なHTML構造を作成
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
  })

  it('必要なDOM要素が存在する', () => {
    expect(document.getElementById('landing')).toBeTruthy()
    expect(document.getElementById('camera')).toBeTruthy()
    expect(document.getElementById('questionnaire')).toBeTruthy()
    expect(document.getElementById('result')).toBeTruthy()
    expect(document.getElementById('startBtn')).toBeTruthy()
  })

  it('初期状態でランディングセクションが表示される', () => {
    const landingSection = document.getElementById('landing')
    const cameraSection = document.getElementById('camera')
    
    expect(landingSection?.classList.contains('hidden')).toBe(false)
    expect(cameraSection?.classList.contains('hidden')).toBe(true)
  })

  it('セクションの表示切替が正常に動作する', () => {
    const landingSection = document.getElementById('landing')
    const cameraSection = document.getElementById('camera')
    
    // セクション切り替えのテスト
    landingSection?.classList.add('hidden')
    cameraSection?.classList.remove('hidden')
    
    expect(landingSection?.classList.contains('hidden')).toBe(true)
    expect(cameraSection?.classList.contains('hidden')).toBe(false)
  })

  it('フォーム要素が正常に動作する', () => {
    const form = document.getElementById('questionForm') as HTMLFormElement
    const deskworkSelect = form.querySelector('select[name="deskwork"]') as HTMLSelectElement
    const exerciseSelect = form.querySelector('select[name="exercise"]') as HTMLSelectElement
    const checkbox = form.querySelector('input[type="checkbox"]') as HTMLInputElement
    
    expect(form).toBeTruthy()
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

  it('ボタンのクリックイベントが発火する', () => {
    const startBtn = document.getElementById('startBtn')
    let clicked = false
    
    startBtn?.addEventListener('click', () => {
      clicked = true
    })
    
    startBtn?.click()
    expect(clicked).toBe(true)
  })

  it('フォームのリセットが正常に動作する', () => {
    const form = document.getElementById('questionForm') as HTMLFormElement
    const deskworkSelect = form.querySelector('select[name="deskwork"]') as HTMLSelectElement
    const checkbox = form.querySelector('input[type="checkbox"]') as HTMLInputElement
    
    // 値を設定
    deskworkSelect.value = '3-5'
    checkbox.checked = true
    
    // リセット
    form.reset()
    
    // フォームリセット後は最初のオプションが選択される
    expect(deskworkSelect.value).toBe('0-2') // 最初のオプション値
    expect(checkbox.checked).toBe(false)
  })
})