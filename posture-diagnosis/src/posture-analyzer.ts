// 姿勢分析のモック実装

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
}

// アンケート回答
export interface QuestionnaireData {
    deskWorkHours: string;
    exerciseFrequency: string;
    symptoms: string[];
}

export class PostureAnalyzer {
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
    
    // 画像とアンケート結果から姿勢を分析（モック実装）
    analyze(imageData: string, questionnaire: QuestionnaireData): PostureInfo {
        // 実際の実装では、ここで画像解析APIを呼び出す
        // 今回はモックなので、アンケート結果に基づいて判定
        
        let type: PostureType;
        let score: number;
        
        // デスクワーク時間と症状から姿勢タイプを推定
        const deskHours = questionnaire.deskWorkHours;
        const symptoms = questionnaire.symptoms;
        const exercise = questionnaire.exerciseFrequency;
        
        // スコアの初期値
        score = 70;
        
        // デスクワーク時間による判定
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
        
        // 運動習慣によるスコア調整
        if (exercise === 'none') {
            score -= 10;
        } else if (exercise === 'daily' || exercise === 'weekly-4-5') {
            score += 10;
        }
        
        // スコアの範囲を0-100に制限
        score = Math.max(0, Math.min(100, score));
        
        // 結果を返す
        const baseInfo = this.postureDatabase[type];
        return {
            type,
            score,
            name: baseInfo.name,
            description: baseInfo.description,
            problems: baseInfo.problems,
            recommendations: baseInfo.recommendations
        };
    }
    
    // 改善度の計算（将来の実装用）
    calculateImprovement(before: PostureInfo, after: PostureInfo): number {
        return after.score - before.score;
    }
}