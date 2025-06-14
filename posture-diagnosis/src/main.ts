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
        
        resultContent.innerHTML = ResultTemplates.generateResultHTML(result);
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