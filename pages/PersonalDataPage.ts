import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '../pages/basePage';

export class PersonalDataPage extends BasePage {
  /* =========================
   * LOCATORS
   * ========================= */

  private readonly fieldName: Locator;
  private readonly fieldLastName: Locator;
  private readonly fieldDateOfBirth: Locator;
  private readonly fieldAddress: Locator;
  private readonly fieldIdentification: Locator;
  private readonly buttonSend: Locator;

  constructor(page: Page) {
    super(page);

    this.fieldName = page.locator('input[type="text"]').first();
    this.fieldLastName = page.locator('input[type="text"]').nth(1);
    this.fieldDateOfBirth = page.locator('input[type="text"]').nth(2);
    this.fieldAddress = page.locator('input[type="text"]').nth(3);
    this.fieldIdentification = page.locator('input[type="text"]').nth(4);
    this.buttonSend = page.getByRole('button', { name: 'Continuar' });
  }

  /* =========================
   * NAVIGATION
   * ========================= */

  async waitForPersonalData(): Promise<void> {
    await this.fieldName.waitFor({ state: 'visible' });
    await this.fieldLastName.waitFor({ state: 'visible' });
    await this.fieldDateOfBirth.waitFor({ state: 'visible' });
    await this.fieldAddress.waitFor({ state: 'visible' });
    await this.fieldIdentification.waitFor({ state: 'visible' });
  }

  /* =========================
   * FORM ACTIONS
   * ========================= */

  async fillAddress(address: string): Promise<void> {
    const input = this.fieldAddress;
    await input.waitFor({ state: 'visible' });
    await input.click();
    await input.fill(address);

    const suggestionList = this.page.locator('ul[class*="suggestions"] li').first();

    try {
      await suggestionList.waitFor({ state: 'visible', timeout: 2000 });
      await suggestionList.click();
      await this.page.locator('ul[class*="suggestions"]').waitFor({ state: 'hidden', timeout: 2000 });
    } catch {
      // No hace nada si no hay sugerencias
    }
  }

  async fillPersonalData(name: string, lastName: string, dateOfBirth: string, address: string, identification: string): Promise<void> {
    await this.waitForPersonalData();

    await this.fieldName.fill(name);
    await this.fieldLastName.fill(lastName);
    await this.fieldDateOfBirth.fill(dateOfBirth);
    await this.fillAddress(address);
    await this.fieldIdentification.fill(identification);
  }

  async goToFinancialValidation(): Promise<void> {
    await this.buttonSend.click();
  }

  /* =========================
   * GETTERS (para tests)
   * ========================= */

  getFieldName(): Locator {
    return this.fieldName;
  }

  getFieldLastName(): Locator {
    return this.fieldLastName;
  }

  getFieldDateOfBirth(): Locator {
    return this.fieldDateOfBirth;
  }

  getFieldAddress(): Locator {
    return this.fieldAddress;
  }

  getFieldIdentification(): Locator {
    return this.fieldIdentification;
  }

  getButtonSend(): Locator {
    return this.buttonSend;
  }
}