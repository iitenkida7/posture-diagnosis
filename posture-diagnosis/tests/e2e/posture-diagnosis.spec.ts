import { test, expect } from '@playwright/test';

test.describe('姿勢診断アプリ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('初期表示が正常に動作する', async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/みんなの姿勢診断/);
    
    // メインヘッダーの確認
    await expect(page.locator('h1')).toContainText('みんなの姿勢診断');
    
    // 診断開始ボタンが表示されることを確認
    await expect(page.locator('#startBtn')).toBeVisible();
    
    // ランディングセクションが表示されることを確認
    await expect(page.locator('#landing')).toBeVisible();
    
    // その他のセクションが非表示であることを確認
    await expect(page.locator('#camera')).toBeHidden();
    await expect(page.locator('#questionnaire')).toBeHidden();
    await expect(page.locator('#result')).toBeHidden();
  });

  test('診断開始からカメラ画面への遷移', async ({ page, context }) => {
    // カメラ許可のモック
    await context.grantPermissions(['camera']);
    
    // 診断開始ボタンをクリック
    await page.click('#startBtn');
    
    // カメラセクションが表示されることを確認
    await expect(page.locator('#camera')).toBeVisible();
    await expect(page.locator('#landing')).toBeHidden();
    
    // カメラ関連の要素が表示されることを確認
    await expect(page.locator('#video')).toBeVisible();
    await expect(page.locator('#captureBtn')).toBeVisible();
    await expect(page.locator('#backBtn')).toBeVisible();
  });

  test('戻るボタンでランディングページに戻る', async ({ page, context }) => {
    await context.grantPermissions(['camera']);
    
    // カメラ画面に移動
    await page.click('#startBtn');
    await expect(page.locator('#camera')).toBeVisible();
    
    // 戻るボタンをクリック
    await page.click('#backBtn');
    
    // ランディングページに戻ることを確認
    await expect(page.locator('#landing')).toBeVisible();
    await expect(page.locator('#camera')).toBeHidden();
  });

  test('撮影からアンケート画面への遷移', async ({ page, context }) => {
    await context.grantPermissions(['camera']);
    
    // カメラ画面に移動
    await page.click('#startBtn');
    
    // 撮影ボタンをクリック
    await page.click('#captureBtn');
    
    // アンケートセクションが表示されることを確認
    await expect(page.locator('#questionnaire')).toBeVisible();
    await expect(page.locator('#camera')).toBeHidden();
    
    // アンケートフォームの要素が表示されることを確認
    await expect(page.locator('#questionForm')).toBeVisible();
    await expect(page.locator('select[name="deskwork"]')).toBeVisible();
    await expect(page.locator('select[name="exercise"]')).toBeVisible();
  });

  test('アンケート入力と分析実行', async ({ page, context }) => {
    await context.grantPermissions(['camera']);
    
    // アンケート画面まで進む
    await page.click('#startBtn');
    await page.click('#captureBtn');
    
    // アンケートに回答
    await page.selectOption('select[name="deskwork"]', '3-5');
    await page.selectOption('select[name="exercise"]', 'weekly');
    
    // 症状にチェック
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();
    
    // 分析開始ボタンをクリック
    await page.click('button[type="submit"]');
    
    // 結果画面が表示されることを確認（ローディング含む）
    await expect(page.locator('#result')).toBeVisible();
    await expect(page.locator('#questionnaire')).toBeHidden();
    
    // 分析完了まで待機（最大30秒）
    await expect(page.locator('#resultButtons')).toBeVisible({ timeout: 30000 });
    
    // 結果画面の要素が表示されることを確認
    await expect(page.locator('#shareBtn')).toBeVisible();
    await expect(page.locator('#retryBtn')).toBeVisible();
    await expect(page.locator('#resultContent')).toBeVisible();
  });

  test('完全な診断フローの実行', async ({ page, context }) => {
    await context.grantPermissions(['camera']);
    
    // 1. 診断開始
    await page.click('#startBtn');
    await expect(page.locator('#camera')).toBeVisible();
    
    // 2. 撮影
    await page.click('#captureBtn');
    await expect(page.locator('#questionnaire')).toBeVisible();
    
    // 3. アンケート回答
    await page.selectOption('select[name="deskwork"]', '8+');
    await page.selectOption('select[name="exercise"]', 'rarely');
    await page.check('input[type="checkbox"]');
    
    // 4. 分析実行
    await page.click('button[type="submit"]');
    await expect(page.locator('#result')).toBeVisible();
    
    // 5. 結果表示まで待機
    await expect(page.locator('#resultButtons')).toBeVisible({ timeout: 30000 });
    
    // 6. もう一度診断
    await page.click('#retryBtn');
    await expect(page.locator('#landing')).toBeVisible();
    
    // フォームがリセットされていることを確認
    await expect(page.locator('select[name="deskwork"]')).toHaveValue('');
  });

  test('レスポンシブデザインの確認', async ({ page }) => {
    // モバイルサイズでのテスト
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 基本要素が表示されることを確認
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#startBtn')).toBeVisible();
    
    // ボタンがクリック可能であることを確認
    await expect(page.locator('#startBtn')).toBeEnabled();
  });

  test('エラーハンドリング', async ({ page, context }) => {
    // カメラアクセスを拒否
    await context.grantPermissions([]);
    
    // 診断開始を試行
    await page.click('#startBtn');
    
    // エラーが発生してもアプリケーションが動作し続けることを確認
    // （具体的なエラー処理は実装に依存）
    await expect(page.locator('#startBtn')).toBeVisible();
  });

  test('アクセシビリティの基本確認', async ({ page }) => {
    // フォーカス可能な要素の確認
    await page.keyboard.press('Tab');
    await expect(page.locator('#startBtn')).toBeFocused();
    
    // ボタンのaria-labelやテキストの確認
    await expect(page.locator('#startBtn')).toContainText('診断');
  });
});