// HTML テンプレート関数
import { PostureInfo } from './posture-analyzer.js';
import { PoseVisualizer } from './pose-visualizer.js';

export class ResultTemplates {
    // メイン結果テンプレート
    static async generateResultHTML(result: PostureInfo, capturedImage: string | null = null): Promise<string> {
        const scoreColor = result.score >= 80 ? 'text-success-600' :
            result.score >= 60 ? 'text-warning-500' : 'text-error-500';

        // 姿勢可視化画像を生成
        let annotatedImage = capturedImage;
        if (capturedImage && result.visualizationData) {
            try {
                const visualizer = new PoseVisualizer();
                annotatedImage = await visualizer.generateAnnotatedImage(
                    capturedImage,
                    result.visualizationData
                );
                visualizer.destroy();
            } catch (error) {
                console.warn('姿勢可視化に失敗:', error);
                // エラー時は元画像を使用
            }
        }

        return `
            ${this.generateHeader(result, scoreColor)}
            ${annotatedImage ? this.generateImageSection(annotatedImage, result.visualizationData) : ''}
            ${this.generateProblemsAndRecommendations(result.problems, result.recommendations)}
        `;
    }

    // ヘッダー部分（スコアと名前）
    private static generateHeader(result: PostureInfo, scoreColor: string): string {
        return `
            <div class="text-center mb-10">
                <h3 class="text-4xl font-bold mb-6 text-primary-700">💖 ${result.name} 💖</h3>
                    <span class="text-6xl font-bold ${scoreColor}">${result.score}点</span>
                <p class="text-lg text-primary-600 font-semibold">${result.description}</p>
            </div>
        `;
    }

    // 撮影画像セクション（可視化版）
    private static generateImageSection(capturedImage: string, visualizationData?: any): string {
        const hasVisualization = visualizationData && visualizationData.keypoints.length > 0;
        const title = hasVisualization ? '🤖 AI姿勢分析結果' : '📸 撮影した写真';
        const description = hasVisualization
            ? '✨ 骨格線と問題箇所をAIが自動検出しました 💕'
            : '✨ この写真を分析しました 💕';

        return `
            <div class="mb-10 text-center">
                <h4 class="text-2xl font-bold mb-6 text-primary-700">
                    <span class="text-3xl mr-2">${hasVisualization ? '🤖' : '📸'}</span>
                    ${title}
                </h4>
                <div class="card-cute p-6 inline-block max-w-lg">
                    <img src="${capturedImage}" alt="姿勢分析結果の写真" 
                         class="w-full max-w-md mx-auto rounded-2xl shadow-lg border-4 border-primary-200">
                    <p class="text-primary-600 text-sm mt-4 font-semibold">
                        ${description}
                    </p>
                    ${hasVisualization ? this.generateVisualizationLegend() : ''}
                </div>
            </div>
        `;
    }

    // 可視化の凡例
    private static generateVisualizationLegend(): string {
        return `
            <div class="mt-4 text-left bg-primary-50 p-4 rounded-xl border-2 border-primary-200">
                <h5 class="font-bold text-primary-700 mb-2">📋 画像の見方</h5>
                <div class="text-xs text-primary-600 space-y-1">
                    <div>✅ <span class="text-green-500">■</span> グリーンの線：正常な骨格</div>
                    <div>🔴 <span class="text-red-500">■</span> 赤い線：問題箇所</div>
                    <div>⚪ 白い点：関節の位置</div>
                    <div>📊 左上：詳細な測定値</div>
                </div>
            </div>
        `;
    }

    // 問題点と改善提案を横並びで表示
    private static generateProblemsAndRecommendations(problems: string[], recommendations: string[]): string {
        return `
            <div class="grid md:grid-cols-2 gap-8">
                ${this.generateProblems(problems)}
                ${this.generateRecommendations(recommendations)}
            </div>
        `;
    }

    // 問題点セクション
    private static generateProblems(problems: string[]): string {
        if (problems.length === 0) {
            return `
                <div class="bg-success-50 p-6 rounded-super-cute border-2 border-success-200">
                    <h4 class="text-2xl font-bold mb-6 text-success-700 text-center">
                        <span class="text-3xl mr-2">🌟</span>
                        素晴らしい姿勢です！
                    </h4>
                    <div class="text-center">
                        <p class="text-success-700 font-semibold text-lg">
                            💕 問題は見つかりませんでした ✨
                        </p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="bg-error-50 p-6 rounded-super-cute border-2 border-error-200">
                <h4 class="text-2xl font-bold mb-6 text-error-700 text-center">
                    <span class="text-3xl mr-2">😰</span>
                    ちょっと気をつけたい症状
                </h4>
                <ul class="space-y-4">
                    ${problems.map(problem => this.generateProblemItem(problem)).join('')}
                </ul>
            </div>
        `;
    }

    // 問題点アイテム
    private static generateProblemItem(problem: string): string {
        return `
            <li class="flex items-start bg-white p-4 rounded-cute shadow-sm">
                <span class="text-error-500 mr-3 text-2xl">⚠️</span>
                <span class="text-error-700 font-semibold text-lg">${problem}</span>
            </li>
        `;
    }

    // 改善提案セクション
    private static generateRecommendations(recommendations: string[]): string {
        return `
            <div class="bg-success-50 p-6 rounded-super-cute border-2 border-success-200">
                <h4 class="text-2xl font-bold mb-6 text-success-700 text-center">
                    <span class="text-3xl mr-2">✨</span>
                    可愛く改善しちゃお！
                </h4>
                <ul class="space-y-4">
                    ${recommendations.map(rec => this.generateRecommendationItem(rec)).join('')}
                </ul>
            </div>
        `;
    }

    // 改善提案アイテム
    private static generateRecommendationItem(recommendation: string): string {
        return `
            <li class="flex items-start bg-white p-4 rounded-cute shadow-sm">
                <span class="text-success-500 mr-3 text-2xl">💕</span>
                <span class="text-success-700 font-semibold text-lg">${recommendation}</span>
            </li>
        `;
    }
}
