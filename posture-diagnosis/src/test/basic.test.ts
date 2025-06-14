import { describe, it, expect } from 'vitest'

// 基本的な動作確認テスト
describe('Basic Functionality Tests', () => {
  it('数学計算が正しく動作する', () => {
    expect(2 + 2).toBe(4)
    expect(Math.max(1, 2, 3)).toBe(3)
  })

  it('文字列操作が正しく動作する', () => {
    const text = 'みんなの姿勢診断'
    expect(text.length).toBeGreaterThan(0)
    expect(text.includes('姿勢')).toBe(true)
  })

  it('配列操作が正しく動作する', () => {
    const symptoms = ['肩こり', '腰痛', '頭痛']
    expect(symptoms.length).toBe(3)
    expect(symptoms.includes('肩こり')).toBe(true)
  })

  it('オブジェクト操作が正しく動作する', () => {
    const questionnaire = {
      deskWorkHours: '3-5',
      exerciseFrequency: 'weekly',
      symptoms: ['肩こり']
    }
    
    expect(questionnaire.deskWorkHours).toBe('3-5')
    expect(questionnaire.symptoms.length).toBe(1)
  })

  it('DOM要素の基本操作が動作する', () => {
    // 新しい要素を作成
    const button = document.createElement('button')
    button.textContent = 'テストボタン'
    button.id = 'test-button'
    
    // bodyに追加
    document.body.appendChild(button)
    
    // 取得してテスト
    const foundButton = document.getElementById('test-button')
    expect(foundButton).toBeTruthy()
    expect(foundButton?.textContent).toBe('テストボタン')
    
    // クリーンアップ
    document.body.removeChild(button)
  })

  it('CSS クラス操作が動作する', () => {
    const div = document.createElement('div')
    div.className = 'test-class'
    
    expect(div.classList.contains('test-class')).toBe(true)
    
    div.classList.add('hidden')
    expect(div.classList.contains('hidden')).toBe(true)
    
    div.classList.remove('hidden')
    expect(div.classList.contains('hidden')).toBe(false)
  })

  it('環境変数とNode.js APIが利用可能', () => {
    // プロセス環境のテスト
    expect(typeof process).toBe('object')
    expect(typeof process.env).toBe('object')
  })
})