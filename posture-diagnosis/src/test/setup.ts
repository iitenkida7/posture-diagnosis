// テストセットアップファイル
import '@testing-library/dom'
import { vi, beforeEach } from 'vitest'

// グローバルなDOM要素をセットアップ
beforeEach(() => {
  // DOM要素をクリア
  document.body.innerHTML = ''
  
  // 基本的なHTML構造を作成
  document.body.innerHTML = `
    <section id="landing" class="hidden">
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

// MediaDevices APIのモック
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }]
    })
  }
})

// HTMLCanvasElement のモック
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  drawImage: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  canvas: { width: 640, height: 480 }
})

HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock-image')

// HTMLVideoElement のモック
Object.defineProperty(HTMLVideoElement.prototype, 'videoWidth', {
  get: () => 640
})
Object.defineProperty(HTMLVideoElement.prototype, 'videoHeight', {
  get: () => 480
})

// TensorFlow.js のモック
vi.mock('@tensorflow/tfjs', () => ({
  ready: vi.fn().mockResolvedValue(undefined),
  loadLayersModel: vi.fn(),
  tensor3d: vi.fn(),
  dispose: vi.fn(),
  setBackend: vi.fn().mockResolvedValue(undefined),
  getBackend: vi.fn().mockReturnValue('webgl')
}))

vi.mock('@tensorflow-models/pose-detection', () => ({
  createDetector: vi.fn().mockResolvedValue({
    estimatePoses: vi.fn().mockResolvedValue([{
      keypoints: [
        { x: 100, y: 100, name: 'nose', score: 0.9 },
        { x: 90, y: 150, name: 'left_shoulder', score: 0.8 },
        { x: 110, y: 150, name: 'right_shoulder', score: 0.8 }
      ]
    }])
  }),
  SupportedModels: {
    MoveNet: 'MoveNet'
  }
}))

// window.alert のモック
window.alert = vi.fn()

// window.open のモック  
window.open = vi.fn()