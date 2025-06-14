import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PostureAnalyzer, QuestionnaireData } from '../posture-analyzer'

describe('PostureAnalyzer', () => {
  let analyzer: PostureAnalyzer
  let mockQuestionnaireData: QuestionnaireData

  beforeEach(() => {
    analyzer = new PostureAnalyzer()
    mockQuestionnaireData = {
      deskWorkHours: '3-5',
      exerciseFrequency: 'weekly',
      symptoms: ['肩こり', '腰痛']
    }
  })

  describe('initialize', () => {
    it('TensorFlow.jsの初期化が正常に動作する', async () => {
      await analyzer.initialize()
      
      // TensorFlow.jsのready関数が呼ばれることを確認
      expect(vi.mocked(require('@tensorflow/tfjs').ready)).toHaveBeenCalled()
    })
  })

  describe('analyze', () => {
    it('姿勢分析が正常に動作する', async () => {
      const mockImageData = 'data:image/png;base64,mock-image'
      
      await analyzer.initialize()
      const result = await analyzer.analyze(mockImageData, mockQuestionnaireData)
      
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('score')
      expect(result).toHaveProperty('description')
      expect(result).toHaveProperty('advice')
      expect(result).toHaveProperty('color')
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })

    it('異なるアンケート回答で異なる結果を返す', async () => {
      const mockImageData = 'data:image/png;base64,mock-image'
      
      const questionnaire1: QuestionnaireData = {
        deskWorkHours: '8+',
        exerciseFrequency: 'rarely',
        symptoms: ['肩こり', '腰痛', '頭痛']
      }
      
      const questionnaire2: QuestionnaireData = {
        deskWorkHours: '0-2',
        exerciseFrequency: 'daily',
        symptoms: []
      }
      
      await analyzer.initialize()
      const result1 = await analyzer.analyze(mockImageData, questionnaire1)
      const result2 = await analyzer.analyze(mockImageData, questionnaire2)
      
      // 運動不足のユーザーの方がスコアが低いことを確認
      expect(result1.score).toBeLessThan(result2.score)
    })

    it('画像データが不正な場合のエラーハンドリング', async () => {
      const invalidImageData = 'invalid-image-data'
      
      await analyzer.initialize()
      
      await expect(
        analyzer.analyze(invalidImageData, mockQuestionnaireData)
      ).rejects.toThrow()
    })
  })

  describe('スコア計算の妥当性', () => {
    it('デスクワーク時間が長いほどスコアが下がる', async () => {
      const mockImageData = 'data:image/png;base64,mock-image'
      
      const shortDeskWork: QuestionnaireData = {
        ...mockQuestionnaireData,
        deskWorkHours: '0-2'
      }
      
      const longDeskWork: QuestionnaireData = {
        ...mockQuestionnaireData,
        deskWorkHours: '8+'
      }
      
      await analyzer.initialize()
      const shortResult = await analyzer.analyze(mockImageData, shortDeskWork)
      const longResult = await analyzer.analyze(mockImageData, longDeskWork)
      
      expect(shortResult.score).toBeGreaterThan(longResult.score)
    })

    it('運動頻度が高いほどスコアが上がる', async () => {
      const mockImageData = 'data:image/png;base64,mock-image'
      
      const dailyExercise: QuestionnaireData = {
        ...mockQuestionnaireData,
        exerciseFrequency: 'daily'
      }
      
      const rarelyExercise: QuestionnaireData = {
        ...mockQuestionnaireData,
        exerciseFrequency: 'rarely'
      }
      
      await analyzer.initialize()
      const dailyResult = await analyzer.analyze(mockImageData, dailyExercise)
      const rarelyResult = await analyzer.analyze(mockImageData, rarelyExercise)
      
      expect(dailyResult.score).toBeGreaterThan(rarelyResult.score)
    })

    it('症状が多いほどスコアが下がる', async () => {
      const mockImageData = 'data:image/png;base64,mock-image'
      
      const noSymptoms: QuestionnaireData = {
        ...mockQuestionnaireData,
        symptoms: []
      }
      
      const manySymptoms: QuestionnaireData = {
        ...mockQuestionnaireData,
        symptoms: ['肩こり', '腰痛', '頭痛', '眼精疲労']
      }
      
      await analyzer.initialize()
      const noSymptomsResult = await analyzer.analyze(mockImageData, noSymptoms)
      const manySymptomsResult = await analyzer.analyze(mockImageData, manySymptoms)
      
      expect(noSymptomsResult.score).toBeGreaterThan(manySymptomsResult.score)
    })
  })
})