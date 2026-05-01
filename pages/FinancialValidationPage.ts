import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '../pages/basePage';

export class FinancialValidationPage extends BasePage {
    /* =========================
     * LOCATORS
     * ========================= */

    private readonly headingSelectOption: Locator;
    private readonly optionConnectAccount: Locator;
    private readonly optionQuickConsultationBySMS: Locator;
    private readonly optionUploadDocuments: Locator;

    constructor(page: Page) {
        super(page);

        this.headingSelectOption = page.getByRole('heading', { name: 'Selecciona una opción' });
        this.optionConnectAccount = page.getByText('Conecta tu cuenta online');
        this.optionQuickConsultationBySMS = page.getByText('Consulta rápida por SMS');
        this.optionUploadDocuments = page.getByText('Sube tus documentos');
    }

    /* =========================
     * VERIFICATIONS
     * ========================= */

    async isOnFinancialValidationPage(): Promise<boolean> {
        try {
            await this.headingSelectOption.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    /* =========================
     * GETTERS (para tests)
     * ========================= */

    getHeadingSelectOption(): Locator {
        return this.headingSelectOption;
    }

    getOptionConnectAccount(): Locator {
        return this.optionConnectAccount;
    }

    getOptionQuickConsultationBySMS(): Locator {
        return this.optionQuickConsultationBySMS;
    }

    getOptionUploadDocuments(): Locator {
        return this.optionUploadDocuments;
    }
}