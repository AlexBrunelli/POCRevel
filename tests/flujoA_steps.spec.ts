import { test, expect } from '@playwright/test';
import { CarSelectionPage } from '../pages/carSelectionPage';
import { CarDetails } from '../pages/carDetails';
import { PersonalDataPage } from '../pages/PersonalDataPage';
import { FinancialValidationPage } from '../pages/FinancialValidationPage';
import {
    generateFirstName,
    generateEmail,
    generateSpanishPhone,
    generateLastName,
    generateDateOfBirth,
    getRandomAddress,
    generateIdentification
} from '../utils/dataGenerator';

test.describe('Flujo A - Con Steps', () => {

    test.afterEach(async ({ page }, testInfo) => {
        const cardetails = new CarDetails(page);
        await cardetails.captureFinalScreenshot(test.info());

        const testName = testInfo.title;
        const status = testInfo.status;

        if (status === 'passed') {
            console.log(`\n✅ Test completado: "${testName}" - Todo OK`);
        } else if (status === 'failed') {
            console.log(`\n❌ Test falló: "${testName}" - Revisar evidencia`);
        }
    });

    test.describe('Positivo', () => {
        test('Completar flujo de contratación', {
            annotation: [
                {
                    type: 'Descripción',
                    description: 'Verifica que un usuario puede completar todo el flujo de contratación desde selección de coche hasta validación financiera'
                },
                {
                    type: 'Criterio',
                    description: 'El usuario debe poder seleccionar un coche, completar el registro, introducir datos personales y llegar a validación financiera'
                }
            ]
        }, async ({ page }) => {
            const carSelection = new CarSelectionPage(page);
            const cardetails = new CarDetails(page);
            const personalData = new PersonalDataPage(page);
            const financialValidation = new FinancialValidationPage(page);

            const firstName = generateFirstName();
            const email = generateEmail();
            const phone = generateSpanishPhone();
            const lastName = generateLastName();
            const dateOfBirth = generateDateOfBirth();
            const address = getRandomAddress();
            const identification = generateIdentification();

            console.log(`
            🔹 Generated Data
            -----------------
            Name : ${firstName} ${lastName}
            DOB  : ${dateOfBirth}
            Addr : ${address}
            ID   : ${identification}
            Email: ${email}
            Phone: ${phone}
        `);

            // GIVEN
            await test.step('Dado que el usuario accede a la web de alquiler de coches', async () => {
                await page.goto('/coches');
                await carSelection.acceptCookies();
                await expect(carSelection.getPageBody()).not.toContainText('¿No encncuentras lo que buscas?');
            });

            // AND
            await test.step('Y selecciona un coche disponible', async () => {
                const carName = await carSelection.getFirstCarName();
                await carSelection.selectFirstCar();
                await cardetails.waitForCarDetailsPage();
                const detailsTitle = await cardetails.getCarName();
                expect(detailsTitle).toContain(carName);
                await cardetails.acceptCar();
            });

            // WHEN
            await test.step('Cuando completa el formulario de registro con datos válidos', async () => {
                await cardetails.fillRegistrationForm(firstName, email, phone);
            });

            // AND
            await test.step('Y completa los datos personales', async () => {
                await personalData.fillPersonalData(firstName, lastName, dateOfBirth, address, identification);
                await personalData.goToFinancialValidation();
            });

            // THEN
            await test.step('Entonces el sistema avanza a validación financiera', async () => {
                const isOnFinancialValidation = await financialValidation.isOnFinancialValidationPage();
                expect(isOnFinancialValidation).toBe(true);
            });
        });
    });

    test.describe('Negativo', () => {
        test.beforeEach(async ({ page }) => {
            const carSelection = new CarSelectionPage(page);
            const cardetails = new CarDetails(page);
            await page.goto('/coches');
            await carSelection.acceptCookies();
            await carSelection.selectFirstCar();
            await cardetails.waitForCarDetailsPage();
            await cardetails.acceptCar();
        });

        test('debe rechazar email incorrecto', {
            annotation: [
                {
                    type: 'Descripción',
                    description: 'Verifica que el sistema rechaza emails sin dominio @driverevel.com'
                },
                {
                    type: 'Criterio',
                    description: 'El mensaje de error debe indicar formato de correo incorrecto'
                }
            ],
            tag: '@negativo'
        }, async ({ page }) => {
            const cardetails = new CarDetails(page);
            const invalidEmail = 'invalidEmail@invalido';
            const validName = generateFirstName();
            const validPhone = generateSpanishPhone();

            // GIVEN
            await test.step('Dado que el usuario está en el formulario de registro', async () => {
            });

            // WHEN
            await test.step('Cuando intenta registrar un email sin dominio válido', async () => {
                await cardetails.fillRegistrationForm(validName, invalidEmail, validPhone);
            });

            // THEN
            await test.step('Entonces el sistema muestra error de validación', async () => {
                const errorEmail = cardetails.getEmailErrorLocator().first();
                await expect(errorEmail).toBeVisible();
                await expect(errorEmail).toHaveText('El correo no tiene el formato correcto');
            });
        });

        test('debe mostrar errores al enviar formulario vacio', {
            annotation: [
                {
                    type: 'Descripción',
                    description: 'Verifica que al enviar el formulario sin completar campos, se muestran todos los errores de validación'
                },
                {
                    type: 'Criterio',
                    description: 'Debe mostrar errores para: nombre, email, teléfono y términos'
                }
            ],
            tag: '@negativo'
        }, async ({ page }) => {
            const cardetails = new CarDetails(page);

            // GIVEN
            await test.step('Dado que el usuario está en el formulario de registro', async () => {
            });

            // WHEN
            await test.step('Cuando envía el formulario sin completar campos', async () => {
                await cardetails.submitEmptyForm();
            });

            // THEN
            await test.step('Entonces el sistema muestra errores de validación', async () => {
                await expect(page.getByText('Este campo es obligatorio')).toBeVisible();
                await expect(page.getByText('Introduce tu correo electrónico')).toBeVisible();
                await expect(page.getByText('Introduce tu teléfono de contacto')).toBeVisible();
                await expect(page.getByText('Para continuar acepta la política de privacidad.')).toBeVisible();
            });
        });
    });
});