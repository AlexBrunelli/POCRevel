# Playwright E2E Tests

**Proyecto de automatización de pruebas end-to-end para la aplicación web de Revel.**

## Tecnologías Utilizadas

| Categoría | Tecnología | Descripción |
|-----------|------------|-------------|
| **Test Automation** | Playwright | Framework principal de testing E2E |
| **Reports** | Allure Report | Reportes avanzados con features/stories |
| **Data Generation** | Faker.js | Generación de datos de test dinámicos |
| **CI/CD** | GitHub Actions | Pipeline de integración continua |
| **IA** | OpenCode | Asistente de IA para desarrollo de código |

> Este proyecto ha sido desarrollado con asistencia de IA utilizando OpenCode.

## Estructura del Proyecto

```
playwright.config/
├── tests/
│   ├── allure/                   # Tests con annotations Allure (POC)
│   │   ├── allure-flujoA.spec.ts
│   │   └── allure-flujoB.spec.ts
│   ├── flujoA_steps.spec.ts     # Tests de flujo principal CON steps
│   └── flujoB_steps.spec.ts     # Tests de filtros CON steps
├── pages/                        # Page Objects
│   ├── basePage.ts
│   ├── carSelectionPage.ts
│   ├── carDetails.ts
│   ├── PersonalDataPage.ts
│   └── FinancialValidationPage.ts
├── utils/
│   └── dataGenerator.ts
├── playwright.config.ts
├── allure.config.ts              # Config específica para Allure
└── PLAYWRIGHT_GUIDELINES.md
```

## Archivos de Tests

### Versión con Steps (Recomendada)

| Archivo | Descripción | Tests |
|---------|-------------|-------|
| `flujoA_steps.spec.ts` | Tests de flujo principal | 3 |
| `flujoB_steps.spec.ts` | Tests de filtros | 15 |

**Características:**
- ✅ test.steps con estructura Given/When/Then
- ✅ Annotations con Descripción y Criterio
- ✅ Logs amigables en consola
- ✅ Captura de screenshot automática al final
- ✅ Tags para filtrado de tests

### Versión Allure (POC)

| Archivo | Tests |
|---------|-------|
| `allure-flujoA.spec.ts` | 3 |
| `allure-flujoB.spec.ts` | 15 |

Incluye annotations Allure: description, severity, feature, story.

## Prerrequisitos

- Node.js 18+
- npm
- Java (necesario para Allure Report)

### Dependencias del Proyecto

```bash
npm install
```

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| `@playwright/test` | ^1.59.1 | Test runner principal |
| `@faker-js/faker` | ^10.4.0 | Generación de datos de test |
| `@types/node` | ^25.6.0 | Tipos TypeScript |
| `allure-playwright` | ^3.7.1 | Reporter Allure |
| `playwright` | (peer) | Navegadores para automatización |

## Ejecutar Tests

### Tests estándar (HTML)

```bash
# Tests flujo A
npx playwright test tests/flujoA_steps.spec.ts

# Tests flujo B
npx playwright test tests/flujoB_steps.spec.ts

# Todos los tests
npx playwright test
```

### Por tag

```bash
npx playwright test --grep "@negativo"
npx playwright test --grep "@cambio"
npx playwright test --grep "@marca"
npx playwright test --grep "@tipo"
```

### Con reporter específico

```bash
npx playwright test --reporter=list
npx playwright test --reporter=html
```

## Reportes

### Reporte HTML (Default de Playwright)

```bash
# Ejecutar tests - se genera reporte HTML automáticamente
npx playwright test

# Abrir reporte HTML
npx playwright show-report
```

### Reporte Allure (POC - Alternativa)

```bash
# 1. Ejecutar tests con configuración Allure
npx playwright test --config=allure.config.ts

# 2. Generar reporte HTML
npx allure generate allure-results -o allure-report

# 3. Abrir reporte en navegador
npx allure open allure-report
```

**Annotations Allure:**

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `description` | Descripción corta del test | "Usuario completa flujo completo" |
| `severity` | Nivel de criticidad | `blocker`, `critical`, `normal`, `minor`, `trivial` |
| `feature` | Feature epic | "Flujo A", "Flujo B" |
| `story` | User story | "Contratación", "Filtros de búsqueda" |

**Severity por tipo de test:**
| Tipo de Test | Severity |
|--------------|----------|
| Positivos (happy path) | `critical` |
| Negativos (validación) | `normal` |

### Comparación de Reportes

| Aspecto | HTML | Allure |
|---------|------|--------|
| Interfaz | Explorador web | Explorador web |
| Adjuntos | Screenshots, videos, trace | Screenshots, videos, logs |
| Estructura | Lista de tests | Features/Stories/epics |
| Tags | Soportado | Soportado |

## Tags disponibles

### Tags de Categoría
- `@negativo` - Tests que verifican comportamiento de error
- `@positivo` - Tests que verifican flujo correcto

### Tags de Filtros (flujoB)
- `@marca` - Tests de filtro por marca
- `@cambio` - Tests de filtro por tipo de cambio
- `@tipo` - Tests de filtro por tipo de coche
- `@combinado` - Tests de filtros combinados

## Generación de Datos de Test

Los datos se generan dinámicamente usando Faker en `utils/dataGenerator.ts`.

### Email
```
test.automation+[timestamp]@driverevel.com
```
- **Por qué timestamp**: Evita emails duplicados en cada ejecución
- **Por qué driverevel.com**: Requisito del proyecto
- Ejemplo: `test.automation+1746044800000@driverevel.com`

### Teléfono
```
+34 + 9 dígitos aleatorios
```
- **Prefijo +34**: Código de país español
- **9 dígitos**: Formato válido español (móvil o fijo)
- Ejemplo: `+346123456789`

### DNI/NIE
- **DNI**: 8 números + letra de control calculada
- **NIE**: Prefijo X/Y/Z + 7 números + letra
- La letra se calcula con el algoritmo oficial español
- Ejemplo DNI: `12345678A`
- Ejemplo NIE: `X1234567B`

### Fecha de nacimiento
- Generada para usuarios entre 20 y 80 años
- Formato: DDMMAAAA
- Ejemplo: `15051985`

### Nombre y Apellidos
- Generados con Faker (nombres españoles)
- Ejemplo: `Carlos García`

### Dirección
- Direcciones válidas predefinidas en `tests/data/testData.json`
- Ejemplo: `Calle Mayor 10, Madrid`

## 🚀 Estrategia de Automatización: Próximos Pasos

A continuación se detallan las prioridades para las siguientes fases de automatización, enfocadas en asegurar la integridad del flujo de negocio y la consistencia de los datos.

### 1. Flujos Críticos de Negocio (Prioridad Alta)

- **End-to-End de Reserva**: Automatizar el flujo completo desde la UI y API que integra el registro de usuario y la contratación, incluyendo validación financiera (mocks, dependiendo del entorno).
- **Validación Financiera del Usuario**: Implementar comprobaciones automáticas de los datos enviados a terceros para verificar la validación financiera.
- **Acceso Multicanal**: Validar el inicio de sesión para usuarios registrados tanto por teléfono como por correo electrónico.

### 2. Integridad y Persistencia de Datos

- **Sincronización con Base de Datos**: Verificar que, tras el registro, el usuario se crea correctamente en la base de datos.
- **Validación de Persistencia API**: Confirmar que es posible realizar un GET del usuario recién creado a través de la API.
- **Consistencia Multicanal (API vs UI)**: Validar que los flujos de usuario en diferentes canales (POS y Web) devuelvan respuestas consistentes, comparando las respuestas de la API con el comportamiento esperado de la UI.

### 3. Optimización de Búsqueda y Filtrado

- **Ampliación de Cobertura**: Completar los tests ya creados de filtrado, priorizando las opciones más críticas para el negocio.
- **Consistencia de Resultados**: Validar que el número y los detalles de los vehículos devueltos tras aplicar cada filtro en la interfaz coincidan exactamente con los datos retornados por la API.
- **Disponibilidad y Funcionalidad de Filtros**: Verificar que todos los filtros configurados estén disponibles para su selección y funcionen correctamente bajo diferentes condiciones de uso.

### 4. Robustez y Expansión (Prioridad Media)

- **Pruebas Negativas**: Automatizar la validación de campos para asegurar que el sistema no permite la introducción de datos inesperados o erróneos.
- **Automatización Mobile**: Realizar la exportación de los casos de prueba para su ejecución en dispositivos móviles vía Appium.