# Playwright Guidelines

## Objetivo del documento

Definir estándares para:

- Estabilidad de tests
- Mantenibilidad
- Escalabilidad
- Buenas prácticas de automatización

---

## Estructura del proyecto

```
/tests
  ├── *.spec.ts           # Tests E2E
  ├── fixtures/           # Fixtures reutilizables
  └── data/              # Datos de test (JSON)
/pages
  ├── basePage.ts        # Clase base abstracta
  ├── components/        # Componentes reutilizables
  ├── flows/             # Flujos de usuario
  └── *.ts              # Page Objects por página
/utils
  ├── helpers/           # Funciones helper
  └── constants/        # Constantes globales
```

---

## Reglas de testing

### SIEMPRE

- Usar `getByRole()` o selectores accesibles
- Usar esperas implícitas de Playwright
- Validaciones claras con `expect`
- Tests independientes entre sí

### NUNCA

- Usar `waitForTimeout()` salvo justificación documentada
- Usar selectores frágiles (`nth-child`, clases dinámicas)
- Forzar clicks (`force: true`) salvo justificación expresa

---

## Selectores (Regla crítica)

Orden de prioridad:

1. `getByRole()` - Más accesible y estable
2. `getByLabel()`
3. `getByText()`
4. `getByTestId()` - Para elementos sin rol semántico
5. `locator()` con selectores CSS estables - Última opción

### Ejemplos

```typescript
// ✅ Correcto
await page.getByRole('button', { name: 'Buscar coche' }).click();
await page.getByLabel('Nombre').fill('Juan');
await page.getByText('Aceptar').click();
await page.getByTestId('submit-form').click();

// ❌ Incorrecto
await page.locator('button:nth-child(3)').click();
await page.locator('.CarCard_card__image__hash').click();
```

---

## Esperas

### Correcto

```typescript
// ✅ Usar expect para esperas
await expect(locator).toBeVisible();
await expect(locator).toBeEnabled();

// ✅ Esperar por state
await locator.waitFor({ state: 'visible' });
```

### Incorrecto

```typescript
// ❌ Nunca usar waitForTimeout
await page.waitForTimeout(3000);
```

**Excepción**: Solo usar `waitForTimeout()` cuando:

- animations CSS conocidas que no tienen wait state
- Documentarreason en comentario

---

## Page Object Model (POM)

### Reglas

- NO lógica de test dentro de páginas
- Métodos reutilizables
- Nombres claros y descriptivos
- Locators privados, métodos públicos

### Estructura recomendada

```typescript
class HomePage {
  // Locators privados
  private readonly searchButton: Locator;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    this.searchButton = page.getByRole('button', { name: 'Buscar' });
    this.searchInput = page.getByLabel('Buscar coche');
  }

  // Métodos públicos reutilizables
  async searchCar(brand: string): Promise<void> {
    await this.searchInput.fill(brand);
    await this.searchButton.click();
  }
}
```

### Extensiones del POM

- **Components**: Bloques UI reutilizables (header, footer, modal)
- **Flows**: Secuencias de acciones complejas (ej: completar formulario)

---

## Reintentos y estabilidad

- Configurar `retries` en `playwright.config.ts` para CI
- NO usar retries para ocultar fallos reales
- Usar `test.describe.each()` para data-driven testing

---

## Datos de test

### Ubicación

`/tests/data/`

### Formato recomendado JSON

```json
{
  "user": {
    "firstName": "Test",
    "lastName": "User",
    "dni": "00000000A"
  },
  "cars": [
    {
      "brand": "Toyota",
      "model": "Corolla"
    }
  ]
}
```

### Carga de datos

```typescript
import testData from './data/testData.json';

test('Ejemplo', async ({ page }) => {
  const user = testData.user;
  await page.getByLabel('Nombre').fill(user.firstName);
});
```

---

## Fixtures

### Ubicación

`/tests/fixtures/`

### Ejemplo

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup
    await page.goto('/login');
    await page.getByLabel('Usuario').fill('test');
    await page.getByLabel('Contraseña').fill('password');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await use(page);
    // Teardown
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  },
});
```

---

## Anti-patrones

### NUNCA hacer

- ❌ Forzar clicks para evitar overlays
  ```typescript
  // ❌
  await button.click({ force: true });
  // ✅
  await button.click();
  // Si hay overlay, cerrarlo primero
  await page.getByRole('button', { name: 'Cerrar' }).click();
  ```

- ❌ Añadir waits innecesarios
  ```typescript
  // ❌
  await page.waitForTimeout(5000);
  await expect(locator).toBeVisible();
  // ✅
  await expect(locator).toBeVisible({ timeout: 10000 });
  ```

- ❌ Tests largos tipo "end-to-end gigante"
  - Dividir en tests pequeños y independientes
  - Un test = una validación

---

## Configuración recomendada

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

---

## Filosofía del proyecto

- Preferir **estabilidad** sobre velocidad
- Preferir **claridad** sobre complejidad
- Tests deben **detectar problemas reales**, no ocultarlos

---

## Resumen rápido para IA

- Usar `getByRole` siempre que sea posible
- Nunca usar `waitForTimeout` sin justificación
- No usar `force: true` salvo bloqueo real
- Tests independientes entre sí
- POM sin lógica de test
- Datos separados en `/tests/data/`
- Validaciones con `expect`
- Locators privados, métodos públicos
- Fixtures para setup reutilizables

---

## Mantenimiento

- Este documento es la **fuente de verdad** para cualquier automatización
- Cualquier cambio debe pasar por revisión del equipo
- Actualizar cuando se añadan nuevos patrones o anti-patrones