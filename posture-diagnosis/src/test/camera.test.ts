import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CameraManager } from '../camera'

describe('CameraManager', () => {
  let cameraManager: CameraManager
  let mockVideo: HTMLVideoElement
  let mockCanvas: HTMLCanvasElement

  beforeEach(() => {
    cameraManager = new CameraManager()
    mockVideo = document.getElementById('video') as HTMLVideoElement
    mockCanvas = document.getElementById('canvas') as HTMLCanvasElement
  })

  describe('initialize', () => {
    it('カメラの初期化が正常に動作する', async () => {
      const mockStream = {
        getTracks: () => [{ stop: vi.fn() }]
      }
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue(mockStream as any)
      
      await cameraManager.initialize()
      
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: { width: 640, height: 480 }
      })
      expect(mockVideo.srcObject).toBe(mockStream)
    })

    it('カメラアクセスが拒否された場合のエラーハンドリング', async () => {
      const error = new Error('Permission denied')
      vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(error)
      
      await expect(cameraManager.initialize()).rejects.toThrow('Permission denied')
    })
  })

  describe('capture', () => {
    it('画像の撮影が正常に動作する', async () => {
      // カメラを初期化
      const mockStream = {
        getTracks: () => [{ stop: vi.fn() }]
      }
      vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue(mockStream as any)
      await cameraManager.initialize()
      
      // 撮影実行
      const capturedImage = cameraManager.capture()
      
      expect(capturedImage).toBe('data:image/png;base64,mock-image')
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png')
    })

    it('初期化前の撮影はnullを返す', () => {
      const capturedImage = cameraManager.capture()
      expect(capturedImage).toBeNull()
    })
  })

  describe('stop', () => {
    it('カメラストリームの停止が正常に動作する', async () => {
      const mockTrack = { stop: vi.fn() }
      const mockStream = {
        getTracks: () => [mockTrack]
      }
      
      vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue(mockStream as any)
      await cameraManager.initialize()
      
      cameraManager.stop()
      
      expect(mockTrack.stop).toHaveBeenCalled()
      expect(mockVideo.srcObject).toBeNull()
    })

    it('初期化前のstop呼び出しはエラーを発生させない', () => {
      expect(() => cameraManager.stop()).not.toThrow()
    })
  })
})