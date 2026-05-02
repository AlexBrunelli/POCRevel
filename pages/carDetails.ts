/* Page Object Model for the Cars / Car Details page */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CarDetails extends BasePage {
  /* =========================
   * Locators
   * ========================= */

  // Botón para aceptar el vehiculo seleccionado
  private readonly nextButton: Locator;

  // formulario de registro , nombre, email, telefono, checkbox de terminos y condiciones
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly termsCheckbox: Locator;
  private readonly continueButton: Locator;
  private readonly carName: Locator;
  private readonly carFeaturesContainer: Locator;
  private readonly emailErrorMessage: Locator;

  constructor(page: Page) {
    super(page);

    /**
     * Botón de cookies (selector accesible)
     */
    this.nextButton = page.getByRole('button', { name: 'Siguiente' });


    this.carName = page.getByRole('heading', { level: 1 });

    this.carFeaturesContainer = page.locator('div').filter({
      has: page.locator('img[src*="eco-categories"]')
    });

    /**
     * Formulario de registro
     */
    this.nameInput = page.locator('input[name="name"]');

    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone number"]');
    this.termsCheckbox = page.locator('input[name="terms"]');


    this.continueButton = page.getByRole('button', { name: 'Continuar ›' });

    this.emailErrorMessage = this.page.getByText('El correo no tiene el formato correcto', { exact: false });
  }

/* =========================
   * NAVIGATION
   * ========================= */

  async waitForCarDetailsPage(): Promise<void> {
    await this.carName.waitFor({ state: 'visible' });
    await this.nextButton.waitFor({ state: 'visible' });
  }

  async acceptCar(): Promise<void> {
    if (await this.nextButton.isVisible()) {
      await this.nextButton.click();
    }
  }

  /* =========================
   * FORM ACTIONS
   * ========================= */

  async fillRegistrationForm(name: string, email: string, phone: string): Promise<void> {
    console.log(`🔹 Registration form completed for: ${name} (${email})`);
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.checkTerms();
    await this.continueButton.click();
  }

  async checkTerms(): Promise<void> {
    await this.termsCheckbox.scrollIntoViewIfNeeded();
    await this.termsCheckbox.check({ force: true });
  }

  async submitEmptyForm(): Promise<void> {
    console.log(`⚠️ Sending empty form - validating errors`);
    await this.continueButton.click();
  }

  /* =========================
   * VERIFICATIONS
   * ========================= */

async hasError(): Promise<boolean> {
    return (await this.emailErrorMessage.count()) > 0;
  }

  async getCarName(): Promise<string | null> {
    return (await this.carName.textContent())
      ?.replace(/\s +/g, ' ')
      .trim() ?? null;
  }

  async getCarFeatures(): Promise<string[]> {
    const features = await this.carFeaturesContainer.locator('li').allTextContents();
    return features.map(feature => feature.trim()).filter(feature => feature.length > 0);
  }

  /* =========================
   * GETTERS (para tests)
   * ========================= */

  getCarNameLocator(): Locator {
    return this.carName;
  }

  getEmailErrorLocator(): Locator {
    return this.emailErrorMessage;
  }

  getEmailInput(): Locator {
    return this.emailInput;
  }

  getErrorMessages(): Locator {
    return this.page.locator('form').locator('p').filter({ hasText: /obligatorio|correo|teléfono|privacidad/i });
  }
}