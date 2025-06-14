// メイン処理
import { CameraManager } from './camera.js';
import { PostureAnalyzer, QuestionnaireData, PostureInfo } from './posture-analyzer.js';
import { ResultTemplates } from './templates.js';

// グローバル変数
let cameraManager: CameraManager;
let postureAnalyzer: PostureAnalyzer;
let capturedImage: string | null = null;
let analysisResult: PostureInfo | null = null;

document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const landingSection = document.getElementById('landing') as HTMLElement;
    const cameraSection = document.getElementById('camera') as HTMLElement;
    const questionnaireSection = document.getElementById('questionnaire') as HTMLElement;
    const resultSection = document.getElementById('result') as HTMLElement;

    const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    const backBtn = document.getElementById('backBtn') as HTMLButtonElement;
    const captureBtn = document.getElementById('captureBtn') as HTMLButtonElement;
    const questionForm = document.getElementById('questionForm') as HTMLFormElement;
    const shareBtn = document.getElementById('shareBtn') as HTMLButtonElement;
    const retryBtn = document.getElementById('retryBtn') as HTMLButtonElement;

    // マネージャーの初期化
    cameraManager = new CameraManager();
    postureAnalyzer = new PostureAnalyzer();
    
    // TensorFlow.js の事前初期化（バックグラウンドで実行）
    postureAnalyzer.initialize().catch(error => {
        console.warn('TensorFlow.js事前初期化に失敗:', error);
    });

    // セクション切り替え関数
    const showSection = (section: HTMLElement) => {
        [landingSection, cameraSection, questionnaireSection, resultSection].forEach(s => {
            s.classList.add('hidden');
        });
        section.classList.remove('hidden');
    };

    // 診断開始ボタン
    startBtn.addEventListener('click', async () => {
        showSection(cameraSection);
        // カメラを初期化
        await cameraManager.initialize();
    });

    // 戻るボタン
    backBtn.addEventListener('click', () => {
        cameraManager.stop();
        showSection(landingSection);
    });

    // 撮影ボタン
    captureBtn.addEventListener('click', () => {
        // 撮影処理
        capturedImage = cameraManager.capture();
        if (capturedImage) {
            cameraManager.stop();
            showSection(questionnaireSection);
        } else {
            alert('撮影に失敗しました。もう一度お試しください。');
        }
    });

    // アンケートフォーム送信
    questionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // フォームデータを収集
        const deskWorkHours = (questionForm.querySelector('select[name="deskwork"]') as HTMLSelectElement)?.value || '';
        const exerciseFrequency = (questionForm.querySelector('select[name="exercise"]') as HTMLSelectElement)?.value || '';

        // チェックボックスから症状を収集
        const symptoms: string[] = [];
        questionForm.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
            symptoms.push((checkbox as HTMLInputElement).value);
        });

        const questionnaireData: QuestionnaireData = {
            deskWorkHours,
            exerciseFrequency,
            symptoms
        };

        // 姿勢を分析
        if (capturedImage) {
            try {
                const resultContent = document.getElementById('resultContent');
                if (!resultContent) return;

                showSection(resultSection);
                
                // 段階的なローディングメッセージで信頼性を演出
                const loadingMessages = [
                    { text: '🤖 AI が姿勢を検出中...', duration: 1500 },
                    { text: '📐 骨格の角度を計算中...', duration: 1200 },
                    { text: '🧠 姿勢パターンを分析中...', duration: 1000 },
                    { text: '✨ 改善提案を生成中...', duration: 1300 }
                ];

                // 段階的にメッセージを表示
                for (let i = 0; i < loadingMessages.length; i++) {
                    const message = loadingMessages[i];
                    resultContent.innerHTML = `
                        <div class="text-center py-12">
                            <div class="rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
                            <p class="text-primary-600 font-semibold text-lg">${message.text}</p>
                            <div class="mt-4 w-64 bg-primary-100 rounded-full h-2 mx-auto">
                                <div class="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                                     style="width: ${((i + 1) / loadingMessages.length) * 100}%"></div>
                            </div>
                            <p class="text-primary-500 text-sm mt-2">${Math.round(((i + 1) / loadingMessages.length) * 100)}% 完了</p>
                        </div>
                    `;
                    
                    // メッセージごとに待機
                    await new Promise(resolve => setTimeout(resolve, message.duration));
                }
                
                // 実際の姿勢分析を実行（バックグラウンドで既に開始）
                analysisResult = await postureAnalyzer.analyze(capturedImage, questionnaireData);
                
                // 最終ローディング
                resultContent.innerHTML = `
                    <div class="text-center py-12">
                        <div class="animate-pulse">
                            <div class="w-16 h-16 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span class="text-white text-2xl">✨</span>
                            </div>
                        </div>
                        <p class="text-primary-600 font-semibold text-lg">🎉 分析完了！結果を表示中...</p>
                    </div>
                `;
                
                // 少し待ってから結果表示
                await new Promise(resolve => setTimeout(resolve, 800));
                
                if (analysisResult) {
                    await displayResult(analysisResult);
                    // 結果表示後にボタンを表示
                    const resultButtons = document.getElementById('resultButtons');
                    if (resultButtons) {
                        resultButtons.style.display = 'flex';
                    }
                }
            } catch (error) {
                console.error('姿勢分析エラー:', error);
                alert('姿勢分析中にエラーが発生しました。もう一度お試しください。');
                showSection(questionnaireSection);
            }
        }
    });

    // 結果を表示する関数
    const displayResult = async (result: PostureInfo) => {
        const resultContent = document.getElementById('resultContent');
        if (!resultContent) return;

        const html = await ResultTemplates.generateResultHTML(result, capturedImage);
        resultContent.innerHTML = html;
    };

    // シェアボタン
    shareBtn.addEventListener('click', () => {
        if (!analysisResult) return;

        // シェア用のテキストを作成
        const shareText = `✨【姿勢診断やってみた】💕
私の姿勢タイプは「${analysisResult.name}」でした！
スコア: ${analysisResult.score}点 🌸

みんなもやってみて〜💖
#みんなの姿勢診断 #姿勢改善 #女子力アップ`;

        // Twitter シェア（実装例）
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(twitterUrl, '_blank');
    });

    // もう一度診断ボタン
    retryBtn.addEventListener('click', () => {
        capturedImage = null;
        analysisResult = null;
        questionForm.reset();
        
        // ボタンを非表示に戻す
        const resultButtons = document.getElementById('resultButtons');
        if (resultButtons) {
            resultButtons.style.display = 'none';
        }
        
        showSection(landingSection);
    });
});
