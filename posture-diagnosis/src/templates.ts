// HTML テンプレート関数
import { PostureInfo } from './posture-analyzer.js';

export class ResultTemplates {
    // メイン結果テンプレート
    static generateResultHTML(result: PostureInfo): string {
        const scoreColor = result.score >= 80 ? 'text-success-600' : 
                          result.score >= 60 ? 'text-warning-500' : 'text-error-500';
        
        return `
            ${this.generateHeader(result, scoreColor)}
            ${this.generateProblems(result.problems)}
            ${this.generateRecommendations(result.recommendations)}
        `;
    }
    
    // ヘッダー部分（スコアと名前）
    private static generateHeader(result: PostureInfo, scoreColor: string): string {
        return `
            <div class="text-center mb-10">
                <h3 class="text-4xl font-bold mb-6 text-primary-700">💖 ${result.name} 💖</h3>
                <div class="icon-cute w-40 h-40 mb-6 mx-auto border-4 border-primary-400">
                    <span class="text-6xl font-bold ${scoreColor}">${result.score}</span>
                </div>
                <p class="text-lg text-primary-600 font-semibold">${result.description}</p>
            </div>
        `;
    }
    
    // 問題点セクション
    private static generateProblems(problems: string[]): string {
        if (problems.length === 0) return '';
        
        return `
            <div class="mb-10 bg-error-50 p-6 rounded-super-cute border-2 border-error-200">
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