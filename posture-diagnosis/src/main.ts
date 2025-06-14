// メイン処理
import { CameraManager } from './camera.js';
import { PostureAnalyzer, QuestionnaireData, PostureInfo } from './posture-analyzer.js';

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
    questionForm.addEventListener('submit', (e) => {
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
            analysisResult = postureAnalyzer.analyze(capturedImage, questionnaireData);
            displayResult(analysisResult);
            showSection(resultSection);
        }
    });
    
    // 結果を表示する関数
    const displayResult = (result: PostureInfo) => {
        const resultContent = document.getElementById('resultContent');
        if (!resultContent) return;
        
        // スコアに応じた色を決定
        const scoreColor = result.score >= 80 ? 'text-green-600' : 
                          result.score >= 60 ? 'text-yellow-600' : 'text-red-600';
        
        resultContent.innerHTML = `
            <div class="text-center mb-10">
                <h3 class="text-4xl font-bold mb-6 text-pink-700">💖 ${result.name} 💖</h3>
                <div class="inline-flex items-center justify-center w-40 h-40 rounded-full bg-pink-100 mb-6 sparkle" style="background: linear-gradient(135deg, #ffc0cb, #ffb6c1); border: 4px solid #ff69b4;">
                    <span class="text-6xl font-bold ${scoreColor}">${result.score}</span>
                </div>
                <p class="text-lg text-pink-600 font-semibold">${result.description}</p>
            </div>
            
            ${result.problems.length > 0 ? `
                <div class="mb-10 bg-red-50 p-6 rounded-3xl border-2 border-red-200">
                    <h4 class="text-2xl font-bold mb-6 text-red-700 text-center">
                        <span class="text-3xl mr-2">😰</span>
                        ちょっと気をつけたい症状
                    </h4>
                    <ul class="space-y-4">
                        ${result.problems.map(problem => `
                            <li class="flex items-start bg-white p-4 rounded-2xl">
                                <span class="text-red-500 mr-3 text-2xl">⚠️</span>
                                <span class="text-red-700 font-semibold text-lg">${problem}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="bg-green-50 p-6 rounded-3xl border-2 border-green-200">
                <h4 class="text-2xl font-bold mb-6 text-green-700 text-center">
                    <span class="text-3xl mr-2">✨</span>
                    可愛く改善しちゃお！
                </h4>
                <ul class="space-y-4">
                    ${result.recommendations.map(rec => `
                        <li class="flex items-start bg-white p-4 rounded-2xl">
                            <span class="text-green-500 mr-3 text-2xl">💕</span>
                            <span class="text-green-700 font-semibold text-lg">${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
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
        showSection(landingSection);
    });
});