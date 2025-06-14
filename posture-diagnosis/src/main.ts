// メイン処理
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
    
    // セクション切り替え関数
    const showSection = (section: HTMLElement) => {
        [landingSection, cameraSection, questionnaireSection, resultSection].forEach(s => {
            s.classList.add('hidden');
        });
        section.classList.remove('hidden');
    };
    
    // 診断開始ボタン
    startBtn.addEventListener('click', () => {
        showSection(cameraSection);
        // カメラを初期化（次のタスクで実装）
    });
    
    // 戻るボタン
    backBtn.addEventListener('click', () => {
        showSection(landingSection);
    });
    
    // 撮影ボタン
    captureBtn.addEventListener('click', () => {
        // 撮影処理（次のタスクで実装）
        showSection(questionnaireSection);
    });
    
    // アンケートフォーム送信
    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // フォームデータを収集
        showSection(resultSection);
        // 結果を表示（後で実装）
    });
    
    // シェアボタン
    shareBtn.addEventListener('click', () => {
        // SNSシェア機能（後で実装）
        alert('シェア機能は準備中です');
    });
    
    // もう一度診断ボタン
    retryBtn.addEventListener('click', () => {
        showSection(landingSection);
    });
});