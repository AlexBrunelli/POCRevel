/* Page Object Model for the Cars / Car Selection page */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CarSelectionPage extends BasePage {
  /* =========================
   * LOCATORS
   * ========================= */

  private readonly acceptCookiesButton: Locator;
  private readonly promotionsFilter: Locator;
  private readonly carCards: Locator;
  private readonly carImage: Locator;
  private readonly carName: Locator;
  private readonly carFeatures: Locator;
  private readonly fuel: Locator;
  private readonly type: Locator;
  private readonly transmission: Locator;

  constructor(page: Page) {
    super(page);

    this.acceptCookiesButton = page.getByRole('button', { name: 'Aceptar' });
    this.promotionsFilter = page.getByRole('link', { name: 'Ofertas' });

    this.carCards = page
      .locator('li')
      .filter({
        has: page.locator('.CarCard_card__image__4CqwS'),
      })
      .locator('a');

    this.carImage = page.getByRole('img');
    this.carName = page.locator('p.Text_displayS__fCIwN.mb-modulor.Text_text-ellipsis__OyhMd').first();
    this.carFeatures = page
      .locator('.CarCard_card__footer__dOKwN')
      .first();

    this.fuel = page
      .locator('.CarCard_card__footer__dOKwN')
      .first()
      .locator('p')
      .nth(0);

    this.type = page
      .locator('.CarCard_card__footer__dOKwN')
      .first()
      .locator('p')
      .nth(1);

    this.transmission = page
      .locator('.CarCard_card__footer__dOKwN')
      .first()
      .locator('p')
      .nth(2);
  }

  /* =========================
   * NAVIGATION
   * ========================= */

  async open(): Promise<void> {
    await this.page.goto('/coches');
    await this.waitForPageReady();
  }

  /* =========================
   * FORM ACTIONS
   * ========================= */

  async acceptCookies(): Promise<void> {
    const acceptButton = this.acceptCookiesButton;
    await acceptButton.waitFor({ state: 'visible' });
    await acceptButton.click();
    await acceptButton.waitFor({ state: 'hidden' });
  }

  async filterByPromotions(): Promise<void> {
    await this.promotionsFilter.click();
    await this.waitForPageReady();
  }

  getFirstCar(): Locator {
    return this.carCards.first();
  }

  async selectFirstCar(): Promise<void> {
    const carName = await this.getFirstCarName();
    const features = await this.getFirstCarFeatures();

    console.log(`
  🔹 Coche seleccionado: ${carName}
     └ Combustible: ${features.fuel} | Cambio: ${features.transmission} | Tipo: ${features.type}
  `);

    await this.getFirstCar().click();
  }

  /* =========================
   * VERIFICATIONS
   * ========================= */

  async getFirstCarName(): Promise<string | null> {
    return (await this.carName.textContent())
      ?.replace(/\s+/g, ' ')
      .trim() ?? null;
  }

  getFirstCarImage(): Locator {
    return this.getFirstCar().getByRole('img');
  }

  async getFirstCarFeatures() {
    const [type, transmission, fuel] = await Promise.all([
      await this.type.textContent(),
      await this.transmission.textContent(),
      await this.fuel.textContent(),
    ]);

    return {
      type: type?.trim() ?? '',
      transmission: transmission?.trim() ?? '',
      fuel: fuel?.trim() ?? '',
    };
  }

  async selectFilter(filterName: string, value: string): Promise<void> {
    console.log(`🔹 Filtro aplicado: ${filterName} = ${value}`);
    await this.page.locator('div').filter({ hasText: new RegExp(`^${filterName}$`) }).first().click();
    
    if (filterName === 'Marca') {
      const allBrandsLink = this.page.getByText('Ver todas las marcas');
      if (await allBrandsLink.isVisible()) {
        await allBrandsLink.click();
      }
    }
    
    await this.page.locator('div').filter({ hasText: new RegExp(`^${value}$`) }).first().click();
    await this.closeFilterModal();
  }

  private async closeFilterModal(): Promise<void> {
    const closeButton = this.page.locator('.FilterShortcutButton_modal__close__button__aF86H').first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
    await this.page.locator('body').click({ position: { x: 0, y: 0 } });
  }

  async resultsContainOnlyVehiclesWith(characteristic: string): Promise<string[]> {
    await this.carCards.first().waitFor({ state: 'visible' });

    const matchingVehicles = this.carCards.filter({
      hasText: new RegExp(characteristic, 'i'),
    });

    const count = await matchingVehicles.count();
    const elements = await matchingVehicles.locator('p').all();
    const texts = await Promise.all(elements.map(el => el.textContent()));
    return [count.toString(), characteristic, ...texts.filter(t => t !== null)];
  }

  async selectMultipleFilters(filterName: string, values: string[]): Promise<void> {
    console.log(`🔹 Filtros múltiples aplicados: ${filterName} = ${values.join(', ')}`);
    await this.page.locator('div').filter({ hasText: new RegExp(`^${filterName}$`) }).first().click();
    
    if (filterName === 'Marca') {
      const allBrandsLink = this.page.getByText('Ver todas las marcas');
      if (await allBrandsLink.isVisible()) {
        await allBrandsLink.click();
        await this.page.waitForTimeout(500);
      }
    }
    
    const modalContent = this.page.locator('[class*="FilterShortcutButton_modal"], [class*="modal"]').first();
    if (await modalContent.isVisible().catch(() => false)) {
      await modalContent.evaluate(el => el.scrollTo(0, 500));
    }
    
    for (const value of values) {
      const valueLocator = this.page.locator('div').filter({ hasText: new RegExp(`^${value}$`) }).first();
      await valueLocator.waitFor({ state: 'visible', timeout: 10000 });
      await valueLocator.click();
      await this.page.waitForTimeout(300);
    }
    await this.closeFilterModalWithoutSelect();
  }

  async closeFilterModalWithoutSelect(): Promise<void> {
    const modal = this.page.getByRole('dialog');
    await this.page.keyboard.press('Escape');
    await modal.waitFor({ state: 'hidden' });
  }

  async clearAllActiveFilters(): Promise<void> {
    const filters = this.page.getByTestId('active-filter');

    while (await filters.count() > 0) {
      await filters.first().getByTestId('remove-filter').click();
      await filters.first().waitFor({ state: 'detached' });
    }
  }

  async getVehicleCount(): Promise<number> {
    await this.waitForCars();
    return await this.carCards.count();
  }

  async waitForCars(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.carCards.first().waitFor({ timeout: 30000 });
  }

  async getNoResultsElements() {
    return {
      title: this.page.getByText('¿No encuentras lo que buscas?', { exact: true }),
      description: this.page.getByText(
        'No te preocupes. Indícanos qué coche estas buscando y te avisamos cuando este disponible.',
        { exact: true }
      ),
      clearFiltersButton: this.page.getByRole('button', { name: 'Borrar filtros' }),
    };
  }

  async filterByTransmission(transmission: 'Manual' | 'Automático'
  ): Promise<void> {
    await this.selectFilter('Cambio', transmission);
    await this.closeFilterModalWithoutSelect();
    await this.page.waitForTimeout(1500);
  }
}