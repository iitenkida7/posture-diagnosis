import { test, expect } from '@playwright/test'

test.describe('基本E2Eテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('ページが正常に読み込まれる', async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/みんなの姿勢診断/)
    
    // メインヘッダーの確認
    await expect(page.locator('h1')).toContainText('みんなの姿勢診断')
    
    // 診断開始ボタンが表示されることを確認
    await expect(page.locator('#startBtn')).toBeVisible()
  })

  test('基本的なナビゲーション', async ({ page }) => {
    // 診断開始ボタンをクリック
    await page.click('#startBtn')
    
    // カメラセクションが表示されるまで待機
    await expect(page.locator('#camera')).toBeVisible()
  })
})