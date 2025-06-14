// TensorFlow.js による実際の姿勢分析実装
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

// 姿勢タイプの定義
export enum PostureType {
    FORWARD_HEAD = 'forward_head',
    ROUNDED_SHOULDERS = 'rounded_shoulders',
    SWAYBACK = 'swayback',
    GOOD = 'good',
    MIXED = 'mixed'
}

// 姿勢タイプの情報
export interface PostureInfo {
    type: PostureType;
    name: string;
    description: string;
    score: number; // 0-100のスコア
    problems: string[];
    recommendations: string[];
    // 可視化用データを追加
    visualizationData?: {
        keypoints: poseDetection.Keypoint[];
        angles: {
            neckAngle: number;
            shoulderAngle: number;
            backAngle: number;
            confidence: number;
        };
        detectedIssues: string[];
    };
}

// アンケート回答
export interface QuestionnaireData {
    deskWorkHours: string;
    exerciseFrequency: string;
    symptoms: string[];
}

export class PostureAnalyzer {
    private detector: poseDetection.PoseDetector | null = null;
    private isInitialized = false;

    // 姿勢タイプの情報定義
    private postureDatabase: Record<PostureType, Omit<PostureInfo, 'type' | 'score'>> = {
        [PostureType.FORWARD_HEAD]: {
            name: '前傾頭位タイプ',
            description: '頭が前方に突き出た姿勢です。スマートフォンやPC作業が多い方に見られます。',
            problems: [
                '首や肩の慢性的な痛み',
                '頭痛やめまい',
                '呼吸が浅くなりやすい',
                '集中力の低下'
            ],
            recommendations: [
                '1時間ごとに首のストレッチを行う',
                'モニターの高さを目線に合わせる',
                '枕の高さを見直す',
                '胸部のストレッチを習慣化する'
            ]
        },
        [PostureType.ROUNDED_SHOULDERS]: {
            name: '巻き肩タイプ',
            description: '肩が前方に丸まった姿勢です。デスクワークが多い方に多く見られます。',
            problems: [
                '肩こりや背中の痛み',
                '胸部の圧迫感',
                '腕のしびれ',
                '姿勢の悪化'
            ],
            recommendations: [
                '胸筋のストレッチを毎日行う',
                '肩甲骨を寄せる運動を実施',
                'デスクの環境を改善する',
                '背筋を鍛えるエクササイズを追加'
            ]
        },
        [PostureType.SWAYBACK]: {
            name: '反り腰タイプ',
            description: '腰が過度に反った姿勢です。腹筋が弱い方に多く見られます。',
            problems: [
                '慢性的な腰痛',
                '股関節の痛み',
                '膝への負担増加',
                '消化器系の不調'
            ],
            recommendations: [
                '腹筋を強化するエクササイズ',
                '骨盤を正しい位置に保つ練習',
                '長時間の立ち仕事を避ける',
                'ストレッチポールを使った矯正'
            ]
        },
        [PostureType.GOOD]: {
            name: '理想的な姿勢',
            description: 'バランスの取れた良い姿勢です。この状態を維持しましょう。',
            problems: [],
            recommendations: [
                '現在の良い姿勢を維持する',
                '定期的な運動を続ける',
                '長時間同じ姿勢を避ける',
                'ストレッチを日課にする'
            ]
        },
        [PostureType.MIXED]: {
            name: '複合タイプ',
            description: '複数の姿勢の問題が組み合わさった状態です。総合的な改善が必要です。',
            problems: [
                '複数箇所の痛みや不調',
                '姿勢の左右差',
                '疲れやすい',
                '運動パフォーマンスの低下'
            ],
            recommendations: [
                '専門家による詳細な評価を推奨',
                '全身のバランスを整える運動',
                '生活習慣の総合的な見直し',
                '段階的な改善プログラムの実施'
            ]
        }
    };

    // TensorFlow.js PoseNet の初期化
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // WebGL バックエンドを設定（GPU 高速化）
            await tf.setBackend('webgl');
            await tf.ready();

            // MoveNet Lightning モデルを使用（軽量で高速）
            const model = poseDetection.SupportedModels.MoveNet;
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
            };

            this.detector = await poseDetection.createDetector(model, detectorConfig);
            this.isInitialized = true;
            console.log('✅ TensorFlow.js PoseNet 初期化完了');
        } catch (error) {
            console.error('❌ TensorFlow.js PoseNet 初期化エラー:', error);
            throw error;
        }
    }

    // Base64画像を HTMLImageElement に変換
    private async loadImageFromBase64(base64Data: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = base64Data;
        });
    }

    // 姿勢の角度を計算
    private calculatePostureAngles(keypoints: poseDetection.Keypoint[]): {
        neckAngle: number;
        shoulderAngle: number;
        backAngle: number;
        confidence: number;
    } {
        // 主要な関節点を取得
        const nose = keypoints.find(kp => kp.name === 'nose');
        const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
        const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
        const leftHip = keypoints.find(kp => kp.name === 'left_hip');
        const rightHip = keypoints.find(kp => kp.name === 'right_hip');

        // 信頼度チェック
        const avgConfidence = [nose, leftShoulder, rightShoulder, leftHip, rightHip]
            .filter(kp => kp)
            .reduce((sum, kp) => sum + (kp?.score || 0), 0) / 5;

        if (avgConfidence < 0.3) {
            return { neckAngle: 0, shoulderAngle: 0, backAngle: 0, confidence: avgConfidence };
        }

        // 肩と腰の中点を計算
        const shoulderCenter = {
            x: ((leftShoulder?.x || 0) + (rightShoulder?.x || 0)) / 2,
            y: ((leftShoulder?.y || 0) + (rightShoulder?.y || 0)) / 2
        };
        const hipCenter = {
            x: ((leftHip?.x || 0) + (rightHip?.x || 0)) / 2,
            y: ((leftHip?.y || 0) + (rightHip?.y || 0)) / 2
        };

        // 首の角度（前傾頭位チェック）
        const neckAngle = this.calculateAngle(
            { x: nose?.x || 0, y: nose?.y || 0 },
            shoulderCenter,
            { x: shoulderCenter.x, y: shoulderCenter.y - 100 } // 垂直基準線
        );

        // 肩の角度（巻き肩チェック）
        const shoulderAngle = Math.abs((leftShoulder?.x || 0) - (rightShoulder?.x || 0));

        // 背中の角度（反り腰チェック）
        const backAngle = this.calculateAngle(
            shoulderCenter,
            hipCenter,
            { x: hipCenter.x, y: hipCenter.y + 100 } // 垂直基準線
        );

        return {
            neckAngle,
            shoulderAngle,
            backAngle,
            confidence: avgConfidence
        };
    }

    // 3点間の角度を計算
    private calculateAngle(point1: {x: number, y: number}, point2: {x: number, y: number}, point3: {x: number, y: number}): number {
        const vector1 = { x: point1.x - point2.x, y: point1.y - point2.y };
        const vector2 = { x: point3.x - point2.x, y: point3.y - point2.y };

        const dot = vector1.x * vector2.x + vector1.y * vector2.y;
        const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
        const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

        const cos = dot / (mag1 * mag2);
        const angle = Math.acos(Math.max(-1, Math.min(1, cos))) * (180 / Math.PI);

        return angle;
    }

    // 角度から姿勢タイプを判定
    private determinePostureType(angles: ReturnType<typeof this.calculatePostureAngles>, questionnaire: QuestionnaireData): {
        type: PostureType;
        score: number;
    } {
        let score = 100;
        let detectedIssues: PostureType[] = [];

        // 首の前傾チェック（30度以上で問題）
        if (angles.neckAngle > 30) {
            detectedIssues.push(PostureType.FORWARD_HEAD);
            score -= 25;
        }

        // 肩の高さの差チェック（巻き肩判定）
        if (angles.shoulderAngle > 20) {
            detectedIssues.push(PostureType.ROUNDED_SHOULDERS);
            score -= 20;
        }

        // 背中の角度チェック（反り腰判定）
        if (angles.backAngle < 160 || angles.backAngle > 200) {
            detectedIssues.push(PostureType.SWAYBACK);
            score -= 15;
        }

        // アンケート結果での調整
        const symptoms = questionnaire.symptoms;
        if (symptoms.includes('neck') || symptoms.includes('headache')) score -= 10;
        if (symptoms.includes('shoulder')) score -= 10;
        if (symptoms.includes('back')) score -= 10;

        // 運動習慣での調整
        const exercise = questionnaire.exerciseFrequency;
        if (exercise === 'none') score -= 15;
        else if (exercise === 'daily' || exercise === 'weekly-4-5') score += 10;

        // 最終判定
        let finalType: PostureType;
        if (detectedIssues.length === 0) {
            finalType = PostureType.GOOD;
        } else if (detectedIssues.length >= 2) {
            finalType = PostureType.MIXED;
        } else {
            finalType = detectedIssues[0];
        }

        return {
            type: finalType,
            score: Math.max(0, Math.min(100, score))
        };
    }
    
    // 画像とアンケート結果から姿勢を分析（TensorFlow.js実装）
    async analyze(imageData: string, questionnaire: QuestionnaireData): Promise<PostureInfo> {
        try {
            // 初期化チェック
            if (!this.isInitialized || !this.detector) {
                console.log('🔄 TensorFlow.js を初期化中...');
                await this.initialize();
            }

            // Base64画像をHTMLImageElementに変換
            const img = await this.loadImageFromBase64(imageData);
            
            // 姿勢検出実行
            console.log('🔍 姿勢検出実行中...');
            const poses = await this.detector!.estimatePoses(img);
            
            if (poses.length === 0) {
                console.warn('⚠️ 人物が検出されませんでした');
                // フォールバック: アンケート結果のみで判定
                return this.fallbackAnalysis(questionnaire);
            }

            // 姿勢の角度を計算
            const angles = this.calculatePostureAngles(poses[0].keypoints);
            console.log('📐 検出された角度:', angles);

            if (angles.confidence < 0.3) {
                console.warn('⚠️ 検出精度が低いため、アンケート結果で補完');
                return this.fallbackAnalysis(questionnaire);
            }

            // 姿勢タイプとスコアを判定
            const { type, score } = this.determinePostureType(angles, questionnaire);

            // 検出された問題箇所を特定
            const detectedIssues: string[] = [];
            if (angles.neckAngle > 30) detectedIssues.push('forward_head');
            if (angles.shoulderAngle > 20) detectedIssues.push('rounded_shoulders');
            if (angles.backAngle < 160 || angles.backAngle > 200) detectedIssues.push('swayback');

            // 結果を返す
            const baseInfo = this.postureDatabase[type];
            console.log('✅ 姿勢分析完了:', { type, score, confidence: angles.confidence });
            
            return {
                type,
                score,
                name: baseInfo.name,
                description: `${baseInfo.description}（AI検出精度: ${Math.round(angles.confidence * 100)}%）`,
                problems: baseInfo.problems,
                recommendations: baseInfo.recommendations,
                visualizationData: {
                    keypoints: poses[0].keypoints,
                    angles,
                    detectedIssues
                }
            };

        } catch (error) {
            console.error('❌ TensorFlow.js姿勢分析エラー:', error);
            console.log('🔄 アンケート結果にフォールバック');
            return this.fallbackAnalysis(questionnaire);
        }
    }

    // アンケート結果のみでの分析（フォールバック）
    private fallbackAnalysis(questionnaire: QuestionnaireData): PostureInfo {
        let type: PostureType;
        let score: number = 70;
        
        const deskHours = questionnaire.deskWorkHours;
        const symptoms = questionnaire.symptoms;
        const exercise = questionnaire.exerciseFrequency;
        
        // アンケート結果ベースの判定ロジック
        if (deskHours === 'more-8' || deskHours === '6-8') {
            score -= 20;
            if (symptoms.includes('shoulder') || symptoms.includes('neck')) {
                type = PostureType.FORWARD_HEAD;
            } else if (symptoms.includes('back')) {
                type = PostureType.ROUNDED_SHOULDERS;
            } else {
                type = PostureType.MIXED;
            }
        } else if (symptoms.includes('back') && symptoms.includes('shoulder')) {
            score -= 15;
            type = PostureType.MIXED;
        } else if (symptoms.includes('back')) {
            score -= 10;
            type = PostureType.SWAYBACK;
        } else if (symptoms.length === 0 && (exercise === 'daily' || exercise === 'weekly-4-5')) {
            score = 85;
            type = PostureType.GOOD;
        } else {
            type = PostureType.MIXED;
        }
        
        if (exercise === 'none') score -= 10;
        else if (exercise === 'daily' || exercise === 'weekly-4-5') score += 10;
        
        score = Math.max(0, Math.min(100, score));
        
        const baseInfo = this.postureDatabase[type];
        return {
            type,
            score,
            name: baseInfo.name,
            description: `${baseInfo.description}（アンケート結果ベース）`,
            problems: baseInfo.problems,
            recommendations: baseInfo.recommendations
        };
    }
    
    // 改善度の計算（将来の実装用）
    calculateImprovement(before: PostureInfo, after: PostureInfo): number {
        return after.score - before.score;
    }
}