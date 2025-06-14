// 姿勢可視化クラス - 骨格線と問題箇所をハイライト
import * as poseDetection from '@tensorflow-models/pose-detection';

export interface PoseVisualizationData {
    keypoints: poseDetection.Keypoint[];
    angles: {
        neckAngle: number;
        shoulderAngle: number;
        backAngle: number;
        confidence: number;
    };
    detectedIssues: string[];
}

export class PoseVisualizer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    
    constructor() {
        this.canvas = document.createElement('canvas');
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Canvas 2D context is not supported');
        }
        this.ctx = context;
    }

    // 画像に骨格線と問題箇所を描画して合成画像を生成
    async generateAnnotatedImage(
        originalImageBase64: string, 
        poseData: PoseVisualizationData
    ): Promise<string> {
        try {
            // 元画像を読み込み
            const img = await this.loadImage(originalImageBase64);
            
            // キャンバスサイズを画像に合わせる
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            
            // 元画像を描画
            this.ctx.drawImage(img, 0, 0);
            
            // 骨格線を描画
            this.drawSkeleton(poseData.keypoints);
            
            // 問題箇所をハイライト
            this.highlightIssues(poseData.keypoints, poseData.detectedIssues);
            
            // 角度情報を表示
            this.drawAngleInfo(poseData.keypoints, poseData.angles);
            
            // Base64として返す
            return this.canvas.toDataURL('image/jpeg', 0.9);
            
        } catch (error) {
            console.error('姿勢可視化エラー:', error);
            return originalImageBase64; // エラー時は元画像をそのまま返す
        }
    }

    // Base64画像をImageオブジェクトに変換
    private loadImage(base64Data: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = base64Data;
        });
    }

    // 骨格線を描画
    private drawSkeleton(keypoints: poseDetection.Keypoint[]): void {
        // 骨格の接続定義
        const connections = [
            // 頭部・首
            ['nose', 'left_eye'], ['nose', 'right_eye'],
            ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
            
            // 胴体の主要ライン
            ['left_shoulder', 'right_shoulder'], // 肩のライン
            ['left_shoulder', 'left_hip'], // 左サイド
            ['right_shoulder', 'right_hip'], // 右サイド
            ['left_hip', 'right_hip'], // 腰のライン
            
            // 腕
            ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
            ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
            
            // 脚
            ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
            ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
        ];

        // 基本の骨格線を描画（薄いピンク）
        this.ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)'; // primary-500
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';

        connections.forEach(([point1Name, point2Name]) => {
            const point1 = keypoints.find(kp => kp.name === point1Name);
            const point2 = keypoints.find(kp => kp.name === point2Name);
            
            if (point1 && point2 && point1.score > 0.3 && point2.score > 0.3) {
                this.ctx.beginPath();
                this.ctx.moveTo(point1.x, point1.y);
                this.ctx.lineTo(point2.x, point2.y);
                this.ctx.stroke();
            }
        });

        // 関節点を描画
        this.drawKeypoints(keypoints);
    }

    // 関節点を描画
    private drawKeypoints(keypoints: poseDetection.Keypoint[]): void {
        keypoints.forEach(point => {
            if (point.score > 0.3) {
                // 信頼度に基づいて色を変更
                const alpha = point.score;
                this.ctx.fillStyle = `rgba(219, 39, 119, ${alpha})`; // primary-600
                
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 白い縁取り
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
    }

    // 問題箇所をハイライト
    private highlightIssues(keypoints: poseDetection.Keypoint[], issues: string[]): void {
        if (issues.length === 0) return;

        // 問題箇所を赤でハイライト
        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'; // red-500
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';

        issues.forEach(issue => {
            switch (issue) {
                case 'forward_head':
                    this.highlightForwardHead(keypoints);
                    break;
                case 'rounded_shoulders':
                    this.highlightRoundedShoulders(keypoints);
                    break;
                case 'swayback':
                    this.highlightSwayback(keypoints);
                    break;
            }
        });
    }

    // 前傾頭位をハイライト
    private highlightForwardHead(keypoints: poseDetection.Keypoint[]): void {
        const nose = keypoints.find(kp => kp.name === 'nose');
        const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
        const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');

        if (nose && leftShoulder && rightShoulder) {
            const shoulderCenter = {
                x: (leftShoulder.x + rightShoulder.x) / 2,
                y: (leftShoulder.y + rightShoulder.y) / 2
            };

            // 頭部から肩への線を強調
            this.ctx.beginPath();
            this.ctx.moveTo(nose.x, nose.y);
            this.ctx.lineTo(shoulderCenter.x, shoulderCenter.y);
            this.ctx.stroke();

            // 警告アイコン
            this.drawWarningIcon(nose.x - 30, nose.y - 30, '🔴 前傾頭位');
        }
    }

    // 巻き肩をハイライト
    private highlightRoundedShoulders(keypoints: poseDetection.Keypoint[]): void {
        const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
        const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');

        if (leftShoulder && rightShoulder) {
            // 肩のラインを強調
            this.ctx.beginPath();
            this.ctx.moveTo(leftShoulder.x, leftShoulder.y);
            this.ctx.lineTo(rightShoulder.x, rightShoulder.y);
            this.ctx.stroke();

            // 警告アイコン
            const centerX = (leftShoulder.x + rightShoulder.x) / 2;
            const centerY = (leftShoulder.y + rightShoulder.y) / 2;
            this.drawWarningIcon(centerX - 40, centerY - 40, '🔴 巻き肩');
        }
    }

    // 反り腰をハイライト
    private highlightSwayback(keypoints: poseDetection.Keypoint[]): void {
        const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
        const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
        const leftHip = keypoints.find(kp => kp.name === 'left_hip');
        const rightHip = keypoints.find(kp => kp.name === 'right_hip');

        if (leftShoulder && rightShoulder && leftHip && rightHip) {
            const shoulderCenter = {
                x: (leftShoulder.x + rightShoulder.x) / 2,
                y: (leftShoulder.y + rightShoulder.y) / 2
            };
            const hipCenter = {
                x: (leftHip.x + rightHip.x) / 2,
                y: (leftHip.y + rightHip.y) / 2
            };

            // 体幹のラインを強調
            this.ctx.beginPath();
            this.ctx.moveTo(shoulderCenter.x, shoulderCenter.y);
            this.ctx.lineTo(hipCenter.x, hipCenter.y);
            this.ctx.stroke();

            // 警告アイコン
            this.drawWarningIcon(hipCenter.x - 40, hipCenter.y + 20, '🔴 反り腰');
        }
    }

    // 角度情報を表示
    private drawAngleInfo(keypoints: poseDetection.Keypoint[], angles: any): void {
        // 背景付きテキストボックス
        const infoX = 20;
        const infoY = 30;
        const lineHeight = 30;

        // 半透明背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(infoX - 10, infoY - 25, 300, 120);

        // テキスト設定
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';

        // 角度情報を表示
        this.ctx.fillText(`🔍 AI検出精度: ${Math.round(angles.confidence * 100)}%`, infoX, infoY);
        this.ctx.fillText(`📐 首の角度: ${Math.round(angles.neckAngle)}°`, infoX, infoY + lineHeight);
        this.ctx.fillText(`👤 肩の位置差: ${Math.round(angles.shoulderAngle)}px`, infoX, infoY + lineHeight * 2);
        this.ctx.fillText(`🏃 背中の角度: ${Math.round(angles.backAngle)}°`, infoX, infoY + lineHeight * 3);
    }

    // 警告アイコンを描画
    private drawWarningIcon(x: number, y: number, text: string): void {
        // 背景
        this.ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'; // red-500
        this.ctx.fillRect(x - 5, y - 5, text.length * 8 + 10, 25);

        // テキスト
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(text, x, y + 12);
    }

    // キャンバスをクリーンアップ
    destroy(): void {
        this.canvas.remove();
    }
}