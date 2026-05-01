/* Base page object model for all pages in the application */
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  protected async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  
  /**
   * Devuelve un locator del texto en el body
   * para validar que no aparece un mensaje genérico
   */
  getPageBody() {
    return this.page.locator('body');
  }


  /**
   * Generanmos una captura de pantalla al finalizar cada flujo para evidenciar el resultado final
   */
  async captureFinalScreenshot(testInfo: any): Promise<void> {
    await testInfo.attach('Evidencia final', {
      body: await this.page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
}
