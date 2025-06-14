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
            <div class="text-center mb-8">
                <h3 class="text-3xl font-bold mb-4">${result.name}</h3>
                <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-purple-100 mb-4">
                    <span class="text-5xl font-bold ${scoreColor}">${result.score}</span>
                </div>
                <p class="text-gray-600">${result.description}</p>
            </div>
            
            ${result.problems.length > 0 ? `
                <div class="mb-8">
                    <h4 class="text-xl font-bold mb-4 text-gray-800">
                        <span class="inline-block w-8 h-8 bg-red-100 rounded-full text-center mr-2">⚠️</span>
                        注意すべき症状
                    </h4>
                    <ul class="space-y-2">
                        ${result.problems.map(problem => `
                            <li class="flex items-start">
                                <span class="text-red-500 mr-2">•</span>
                                <span class="text-gray-700">${problem}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div>
                <h4 class="text-xl font-bold mb-4 text-gray-800">
                    <span class="inline-block w-8 h-8 bg-green-100 rounded-full text-center mr-2">💡</span>
                    改善のためのアドバイス
                </h4>
                <ul class="space-y-2">
                    ${result.recommendations.map(rec => `
                        <li class="flex items-start">
                            <span class="text-green-500 mr-2">✓</span>
                            <span class="text-gray-700">${rec}</span>
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
        const shareText = `【姿勢診断結果】\\n私の姿勢タイプは「${analysisResult.name}」でした！\\nスコア: ${analysisResult.score}点\\n\\n#みんなの姿勢診断`;
        
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