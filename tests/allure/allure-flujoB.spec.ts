import { expect, test } from '@playwright/test';
import { CarSelectionPage } from '../../pages/carSelectionPage';

test.describe('Flow B - Allure', () => {

    test.afterEach(async ({ page }, testInfo) => {
        const carSelection = new CarSelectionPage(page);
        await carSelection.captureFinalScreenshot(testInfo);

        const testName = testInfo.title;
        const status = testInfo.status;

        if (status === 'passed') {
            console.log(`\n✅ Test completed: "${testName}" - All OK`);
        } else if (status === 'failed') {
            console.log(`\n❌ Test failed: "${testName}" - Check evidence`);
        }
    });

    test.describe('Transmission Filters', () => {
        let carSelection: CarSelectionPage;

        test.beforeEach(async ({ page }) => {
            carSelection = new CarSelectionPage(page);
            await page.goto('/coches');
            await carSelection.acceptCookies();
            await expect(carSelection.getPageBody()).not.toContainText('¿No encncuentras lo que buscas?');
        });

        test('debería filtrar por cambio - Automático', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al aplicar filtro de cambio automático solo aparecen vehículos automáticos'
                },
                {
                    type: 'Criteria',
                    description: 'Todos los resultados deben tener cambio automático'
                }
            ],
            tag: '@cambio',
            description: 'Filtro de cambio automático muestra vehículos automáticos',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Transmission Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de cambio automático', async () => {
                await carSelection.selectMultipleFilters('Transmission', ['Automatic']);
            });

            await test.step('Then los resultados muestran solo vehículos automáticos', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('Automático');
            });
        });

        test('el usuario puede filtrar vehículos por cambio manual - Manual', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al aplicar filtro de cambio manual solo aparecen vehículos manuales'
                },
                {
                    type: 'Criteria',
                    description: 'El vehículo seleccionado debe tener transmisión manual'
                }
            ],
            tag: '@cambio',
            description: 'Filtro de cambio manual muestra vehículos manuales',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Transmission Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de cambio manual', async () => {
                await carSelection.filterByTransmission('Manual');
            });

            await test.step('Then verifica que los vehículos tienen cambio manual', async () => {
                const carFeatures = await carSelection.getFirstCarFeatures();
                expect('Manual').toBe(carFeatures.transmission);
            });
        });

        test('el usuario puede filtrar vehículos por cambio manual - Automático', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al aplicar filtro de cambio automático el vehículo seleccionado tiene transmisión automática'
                },
                {
                    type: 'Criteria',
                    description: 'El vehículo seleccionado debe tener transmisión automática'
                }
            ],
            tag: '@cambio',
            description: 'Filtro de cambio automático funciona correctamente',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Transmission Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de cambio automático', async () => {
                await carSelection.filterByTransmission('Automático');
            });

            await test.step('Then verifica que los vehículos tienen cambio automático', async () => {
                const carFeatures = await carSelection.getFirstCarFeatures();
                expect('Automático').toBe(carFeatures.transmission);
            });
        });
    });

    test.describe('Brand Filters', () => {
        let carSelection: CarSelectionPage;

        test.beforeEach(async ({ page }) => {
            carSelection = new CarSelectionPage(page);
            await page.goto('/coches');
            await carSelection.acceptCookies();
            await expect(carSelection.getPageBody()).not.toContainText('¿No encncuentras lo que buscas?');
        });

        test('debería filtrar por marca - BMW', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al filtrar por marca BMW solo aparecen vehículos de esa marca'
                },
                {
                    type: 'Criteria',
                    description: 'Todos los resultados deben contener la palabra BMW'
                }
            ],
            tag: '@marca',
            description: 'Filtro de marca BMW muestra solo vehículos BMW',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Brand Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de marca BMW', async () => {
                await carSelection.selectFilter('Brand', 'BMW');
            });

            await test.step('Then los resultados muestran solo vehículos BMW', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('BMW');
            });
        });

        test('debería filtrar por marca - Ford', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al filtrar por marca Ford solo aparecen vehículos de esa marca'
                },
                {
                    type: 'Criteria',
                    description: 'Todos los resultados deben contener la palabra Ford'
                }
            ],
            tag: '@marca',
            description: 'Filtro de marca Ford muestra solo vehículos Ford',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Brand Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de marca Ford', async () => {
                await carSelection.selectFilter('Brand', 'Ford');
            });

            await test.step('Then los resultados muestran solo vehículos Ford', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('Ford');
            });
        });

        test('debería filtrar por marca - Ford y Kia', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al aplicar múltiples filtros de marca aparecen vehículos de ambas marcas'
                },
                {
                    type: 'Criteria',
                    description: 'Los resultados deben contener Ford o Kia'
                }
            ],
            tag: '@marca',
            description: 'Filtros múltiples de marca (Ford y Kia)',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Brand Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtros múltiples de marca', async () => {
                await carSelection.selectMultipleFilters('Brand', ['Ford', 'Kia']);
            });

            await test.step('Then los resultados muestran vehículos Ford o Kia', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('Ford');
                await carSelection.resultsContainOnlyVehiclesWith('Kia');
            });
        });

        test('debería filtrar por marca y cambio - filtros combinados', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que se pueden combinar filtros de marca y cambio simultáneamente'
                },
                {
                    type: 'Criteria',
                    description: 'Los resultados deben contener ambas características'
                }
            ],
            tag: '@combinado',
            description: 'Filtros combinados de marca y cambio',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Combined Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de marca BMW y cambio automático', async () => {
                await carSelection.selectFilter('Brand', 'BMW');
                await carSelection.selectFilter('Transmission', 'Automatic');
            });

            await test.step('Then los resultados muestran vehículos BMW automáticos', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('BMW');
                await carSelection.resultsContainOnlyVehiclesWith('Automático');
            });

            await test.step('And then aplica filtro de marca Ford y cambio manual', async () => {
                await carSelection.clearAllActiveFilters();
                await carSelection.selectFilter('Brand', 'Ford');
                await carSelection.selectFilter('Transmission', 'Manual');
            });

            await test.step('Then los resultados muestran vehículos Ford manuales', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('Ford');
                await carSelection.resultsContainOnlyVehiclesWith('Manual');
            });
        });
    });

    test.describe('Car Type Filters', () => {
        let carSelection: CarSelectionPage;

        test.beforeEach(async ({ page }) => {
            carSelection = new CarSelectionPage(page);
            await page.goto('/coches');
            await carSelection.acceptCookies();
            await expect(carSelection.getPageBody()).not.toContainText('¿No encncuentras lo que buscas?');
        });

        test('debería filtrar por tipo de coche - Compacto', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al filtrar por tipo compacto solo aparecen vehículos compactos'
                },
                {
                    type: 'Criteria',
                    description: 'Todos los resultados deben ser vehículos compactos'
                }
            ],
            tag: '@tipo',
            description: 'Filtro de tipo Compacto muestra vehículos compactos',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Type Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de tipo Compacto', async () => {
                await carSelection.selectFilter('Car type', 'Compacto');
            });

            await test.step('Then los resultados muestran solo vehículos compactos', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('Compacto');
            });
        });

        test('debería filtrar por tipo de coche - Coupe', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al filtrar por tipo coupe solo aparecen vehículos coupe'
                },
                {
                    type: 'Criteria',
                    description: 'Todos los resultados deben ser vehículos coupe'
                }
            ],
            tag: '@tipo',
            description: 'Filtro de tipo Coupe muestra vehículos coupe',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Type Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de tipo Coupe', async () => {
                await carSelection.selectFilter('Car type', 'Coupe');
            });

            await test.step('Then los resultados muestran solo vehículos coupe', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('Coupe');
            });
        });

        test('debería filtrar por tipo de coche - Familiar', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al filtrar por tipo familiar solo aparecen vehículos familiares'
                },
                {
                    type: 'Criteria',
                    description: 'Todos los resultados deben ser vehículos familiares'
                }
            ],
            tag: '@tipo',
            description: 'Filtro de tipo Familiar muestra vehículos familiares',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Type Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de tipo Familiar', async () => {
                await carSelection.selectFilter('Car type', 'Familiar');
            });

            await test.step('Then los resultados muestran solo vehículos familiares', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('Familiar');
            });
        });

        test('debería filtrar por tipo de coche - SUV', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que al filtrar por tipo SUV solo aparecen vehículos SUV'
                },
                {
                    type: 'Criteria',
                    description: 'Todos los resultados deben ser vehículos SUV'
                }
            ],
            tag: '@tipo',
            description: 'Filtro de tipo SUV muestra vehículos SUV',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Type Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de tipo SUV', async () => {
                await carSelection.selectFilter('Car type', 'SUV');
            });

            await test.step('Then los resultados muestran solo vehículos SUV', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('SUV');
            });
        });

        test('debería filtrar por tipo de coche - selección múltiple', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que se pueden seleccionar múltiples tipos de coche a la vez'
                },
                {
                    type: 'Criteria',
                    description: 'Los resultados deben contener SUV o Familiar'
                }
            ],
            tag: '@tipo',
            description: 'Selección múltiple de tipos de coche (SUV y Familiar)',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Type Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtros múltiples SUV y Familiar', async () => {
                await carSelection.selectMultipleFilters('Car type', ['SUV', 'Familiar']);
            });

            await test.step('Then los resultados muestran vehículos SUV o Familiar', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('SUV');
                await carSelection.resultsContainOnlyVehiclesWith('Familiar');
            });
        });

        test('debería filtrar por tipo de coche - quitar filtros uno a uno', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que los filtros se pueden quitar individualmente'
                },
                {
                    type: 'Criteria',
                    description: 'Al quitar cada filtro, los resultados deben aumentar'
                }
            ],
            tag: '@tipo',
            description: 'Quitar filtros de tipo uno a uno',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Type Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario aplica filtro SUV', async () => {
                await carSelection.selectFilter('Car type', 'SUV');
                const countWithFilter = await carSelection.getVehicleCount();
                expect(countWithFilter).toBeGreaterThan(0);
            });

            await test.step('When remove el filtro SUV', async () => {
                await carSelection.selectFilter('Car type', 'SUV');
                await carSelection.closeFilterModalWithoutSelect();
                const countAfterRemove = await carSelection.getVehicleCount();
                expect(countAfterRemove).toBeGreaterThan(0);
            });

            await test.step('And applies filtro Compacto', async () => {
                await carSelection.selectFilter('Car type', 'Compacto');
                const countCompacto = await carSelection.getVehicleCount();
                expect(countCompacto).toBeGreaterThan(0);
            });

            await test.step('And remove el filtro Compacto', async () => {
                await carSelection.selectFilter('Car type', 'Compacto');
                await carSelection.closeFilterModalWithoutSelect();
                const countAfterCompacto = await carSelection.getVehicleCount();
                expect(countAfterCompacto).toBeGreaterThan(0);
            });

            await test.step('And applies filtro Familiar', async () => {
                await carSelection.selectFilter('Car type', 'Familiar');
                const countFamiliar = await carSelection.getVehicleCount();
                expect(countFamiliar).toBeGreaterThan(0);
            });

            await test.step('And remove el filtro Familiar', async () => {
                await carSelection.selectFilter('Car type', 'Familiar');
                await carSelection.closeFilterModalWithoutSelect();
                const countAfterFamiliar = await carSelection.getVehicleCount();
                expect(countAfterFamiliar).toBeGreaterThan(0);
            });

            await test.step('And applies filtro Coupe', async () => {
                await carSelection.selectFilter('Car type', 'Coupe');
                const countCoupe = await carSelection.getVehicleCount();
                expect(countCoupe).toBeGreaterThan(0);
            });

            await test.step('And remove el filtro Coupe', async () => {
                await carSelection.selectFilter('Car type', 'Coupe');
                await carSelection.closeFilterModalWithoutSelect();
                const countAfterCoupe = await carSelection.getVehicleCount();
                expect(countAfterCoupe).toBeGreaterThan(0);
            });
        });

        test('debería filtrar por marca y tipo de coche - filtros combinados', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que se pueden combinar filtros de marca y tipo de coche'
                },
                {
                    type: 'Criteria',
                    description: 'Los resultados deben contener ambas características'
                }
            ],
            tag: '@tipo',
            description: 'Filtros combinados de marca y tipo',
            severity: 'critical',
            feature: 'Flow B',
            story: 'Combined Filters'
        }, async ({ page }) => {
            await test.step('Given that the usuario está en la página de selección de coches', async () => {
            });

            await test.step('When aplica filtro de marca BMW y tipo SUV', async () => {
                await carSelection.selectFilter('Brand', 'BMW');
                await carSelection.selectFilter('Car type', 'SUV');
            });

            await test.step('Then los resultados muestran vehículos BMW SUV', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('BMW');
                await carSelection.resultsContainOnlyVehiclesWith('SUV');
            });

            await test.step('And then aplica filtro de marca Ford y tipo SUV', async () => {
                await carSelection.clearAllActiveFilters();
                await carSelection.selectFilter('Brand', 'Ford');
                await carSelection.selectFilter('Car type', 'SUV');
            });

            await test.step('Then los resultados muestran vehículos Ford SUV', async () => {
                await carSelection.resultsContainOnlyVehiclesWith('Ford');
                await carSelection.resultsContainOnlyVehiclesWith('SUV');
            });
        });

        test('debe mostrar mensaje claro cuando no hay vehículos que coincidan con los filtros', {
            annotation: [
                {
                    type: 'Description',
                    description: 'Verifica que cuando el usuario aplica filtros que no coinciden con ningún vehículo, se muestra un mensaje claro de "sin resultados" con opción para limpiar filtros'
                },
                {
                    type: 'Criteria',
                    description: '1) Debe mostrar título "No encuentras lo que buscas"\n2) Debe mostrar descripción explicativa\n3) Debe mostrar botón "Borrar filtros" funcionales'
                }
            ],
            tag: '@negativo',
            description: 'Mensaje de "sin resultados" cuando filtros no coinciden',
            severity: 'normal',
            feature: 'Flow B',
            story: 'Results Management'
        }, async ({ page }) => {
            await test.step('Given that the usuario aplica filtros de tipo Compacto y marca BMW', async () => {
                await carSelection.selectFilter('Car type', 'Compacto');
                await carSelection.selectFilter('Brand', 'BMW');
            });

            await test.step('When no hay vehículos que coincidan', async () => {
                const noResults = await carSelection.getNoResultsElements();
                await expect(noResults.title).toBeVisible();
                await expect(noResults.description).toBeVisible();
                await expect(noResults.clearFiltersButton).toBeVisible();
            });
        });
    });
});