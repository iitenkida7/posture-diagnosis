// カメラ機能の実装
export class CameraManager {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private guideCanvas: HTMLCanvasElement;
    private stream: MediaStream | null = null;
    
    constructor() {
        this.video = document.getElementById('videoElement') as HTMLVideoElement;
        this.canvas = document.createElement('canvas');
        this.guideCanvas = document.getElementById('guideCanvas') as HTMLCanvasElement;
    }
    
    // カメラの初期化
    async initialize(): Promise<void> {
        try {
            // カメラへのアクセス許可を要求
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user' // フロントカメラを使用
                }
            });
            
            this.video.srcObject = this.stream;
            
            // ビデオのメタデータが読み込まれたら、ガイドを描画
            this.video.addEventListener('loadedmetadata', () => {
                this.drawGuide();
            });
            
        } catch (error) {
            console.error('カメラの初期化に失敗しました:', error);
            alert('カメラへのアクセスが許可されませんでした。');
        }
    }
    
    // ガイドラインの描画
    private drawGuide(): void {
        const ctx = this.guideCanvas.getContext('2d');
        if (!ctx) return;
        
        // キャンバスのサイズをビデオに合わせる
        this.guideCanvas.width = this.video.videoWidth;
        this.guideCanvas.height = this.video.videoHeight;
        
        // クリア
        ctx.clearRect(0, 0, this.guideCanvas.width, this.guideCanvas.height);
        
        // 人型のガイドを描画
        const centerX = this.guideCanvas.width / 2;
        const centerY = this.guideCanvas.height / 2;
        
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)'; // 紫色
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        
        // 頭部（円）
        const headRadius = 40;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 120, headRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 胴体（長方形）
        const bodyWidth = 80;
        const bodyHeight = 120;
        ctx.beginPath();
        ctx.rect(centerX - bodyWidth / 2, centerY - 80, bodyWidth, bodyHeight);
        ctx.stroke();
        
        // 腕（線）
        ctx.beginPath();
        // 左腕
        ctx.moveTo(centerX - bodyWidth / 2, centerY - 60);
        ctx.lineTo(centerX - bodyWidth - 30, centerY - 20);
        // 右腕
        ctx.moveTo(centerX + bodyWidth / 2, centerY - 60);
        ctx.lineTo(centerX + bodyWidth + 30, centerY - 20);
        ctx.stroke();
        
        // 脚（線）
        ctx.beginPath();
        // 左脚
        ctx.moveTo(centerX - 20, centerY + 40);
        ctx.lineTo(centerX - 30, centerY + 120);
        // 右脚
        ctx.moveTo(centerX + 20, centerY + 40);
        ctx.lineTo(centerX + 30, centerY + 120);
        ctx.stroke();
        
        // 説明テキスト
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
        ctx.font = '16px Noto Sans JP';
        ctx.textAlign = 'center';
        ctx.fillText('ガイドに体を合わせてください', centerX, 30);
    }
    
    // 写真を撮影
    capture(): string | null {
        if (!this.video.videoWidth || !this.video.videoHeight) {
            return null;
        }
        
        // キャンバスのサイズを設定
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // ビデオフレームをキャンバスに描画
        const ctx = this.canvas.getContext('2d');
        if (!ctx) return null;
        
        ctx.drawImage(this.video, 0, 0);
        
        // 画像データをbase64形式で取得
        return this.canvas.toDataURL('image/jpeg', 0.8);
    }
    
    // カメラを停止
    stop(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}