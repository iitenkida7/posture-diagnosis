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

        // 人型のガイドを描画（ピンク系の塗りつぶし）
        const centerX = this.guideCanvas.width / 2;
        const centerY = this.guideCanvas.height / 2;

        // ピンク系のグラデーション（透過度を上げて薄く）
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
        gradient.addColorStop(0, 'rgba(236, 72, 153, 0.3)'); // primary-500 薄く
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.2)'); // primary-500 さらに薄く

        // 塗りつぶし色を設定
        ctx.fillStyle = gradient;
        ctx.strokeStyle = 'rgba(219, 39, 119, 0.4)'; // primary-600 薄く
        ctx.lineWidth = 3;

        // ロボット顔の追加 🤖（大きく）
        const headCenterX = centerX;
        const headCenterY = centerY - 130;
        
        // 顔の文字を描画（大きく）
        ctx.fillStyle = 'rgba(219, 39, 119, 0.8)'; // primary-600 少し透過
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🤖', headCenterX, headCenterY);

        // 胴体（角丸長方形）- 塗りつぶし
        const bodyWidth = 90;
        const bodyHeight = 130;
        const bodyX = centerX - bodyWidth / 2;
        const bodyY = centerY - 90;
        const radius = 20;

        ctx.beginPath();
        ctx.moveTo(bodyX + radius, bodyY);
        ctx.lineTo(bodyX + bodyWidth - radius, bodyY);
        ctx.quadraticCurveTo(bodyX + bodyWidth, bodyY, bodyX + bodyWidth, bodyY + radius);
        ctx.lineTo(bodyX + bodyWidth, bodyY + bodyHeight - radius);
        ctx.quadraticCurveTo(bodyX + bodyWidth, bodyY + bodyHeight, bodyX + bodyWidth - radius, bodyY + bodyHeight);
        ctx.lineTo(bodyX + radius, bodyY + bodyHeight);
        ctx.quadraticCurveTo(bodyX, bodyY + bodyHeight, bodyX, bodyY + bodyHeight - radius);
        ctx.lineTo(bodyX, bodyY + radius);
        ctx.quadraticCurveTo(bodyX, bodyY, bodyX + radius, bodyY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 腕（太い線で描画）
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(219, 39, 119, 0.4)'; // primary-600 薄く

        // 左腕
        ctx.beginPath();
        ctx.moveTo(centerX - bodyWidth / 2, centerY - 50);
        ctx.lineTo(centerX - bodyWidth - 25, centerY - 10);
        ctx.stroke();

        // 右腕
        ctx.beginPath();
        ctx.moveTo(centerX + bodyWidth / 2, centerY - 50);
        ctx.lineTo(centerX + bodyWidth + 25, centerY - 10);
        ctx.stroke();

        // 脚（太い線で描画）
        ctx.lineWidth = 17;

        // 左脚
        ctx.beginPath();
        ctx.moveTo(centerX - 25, centerY + 40);
        ctx.lineTo(centerX - 35, centerY + 130);
        ctx.stroke();

        // 右脚
        ctx.beginPath();
        ctx.moveTo(centerX + 25, centerY + 40);
        ctx.lineTo(centerX + 35, centerY + 130);
        ctx.stroke();

        // 手と足（小さな円）
        ctx.fillStyle = 'rgba(219, 39, 119, 0.4)';

        // 左手
        ctx.beginPath();
        ctx.arc(centerX - bodyWidth - 25, centerY - 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // 右手
        ctx.beginPath();
        ctx.arc(centerX + bodyWidth + 25, centerY - 10, 12, 0, Math.PI * 2);
        ctx.fill();

        // 左足
        ctx.beginPath();
        ctx.arc(centerX - 35, centerY + 130, 15, 0, Math.PI * 2);
        ctx.fill();

        // 右足
        ctx.beginPath();
        ctx.arc(centerX + 35, centerY + 130, 15, 0, Math.PI * 2);
        ctx.fill();

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
