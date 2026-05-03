# Playwright E2E Tests

**Proyecto de automatización de pruebas end-to-end para la aplicación web de Revel.**

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Descripción |
|-----------|------------|-------------|
| **Test Automation** | Playwright | Framework principal de testing E2E |
| **Reports** | Allure Report | Reportes avanzados con features/stories |
| **Data Generation** | Faker.js | Generación de datos de test dinámicos |
| **CI/CD** | GitHub Actions | Pipeline de integración continua |
| **IA** | OpenCode | Asistente de IA para desarrollo de código |

> Este proyecto ha sido desarrollado con asistencia de IA utilizando OpenCode.

## 📁 Estructura del Proyecto

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

## 📝 Archivos de Tests

### Versión con Steps (Recomendada)

| Archivo | Descripción | Tests |
|---------|-------------|-------|
| `flujoA_steps.spec.ts` | Tests de flujo principal | 3 |
| `flujoB_steps.spec.ts` | Tests de filtros | 15 |

**Características:**
- ✅ test.steps con estructura Given/When/Then
- ✅ Annotations con Description and Criteria
- ✅ Logs amigables en consola
- ✅ Captura de screenshot automática al final
- ✅ Tags para filtrado de tests

### Versión Allure (POC)

| Archivo | Tests |
|---------|-------|
| `allure-flujoA.spec.ts` | 3 |
| `allure-flujoB.spec.ts` | 15 |

Incluye annotations Allure: description, severity, feature, story.

## ⚡ Prerrequisitos

- Node.js 18+
- npm
- Java (necesario para Allure Report)

### Dependencias del Proyecto

```bash
npm install
```

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| `@playwright/test` | ^1.59.1 | 🧪 Test runner principal |
| `@faker-js/faker` | ^10.4.0 | 🎲 Generación de datos de test |
| `@types/node` | ^25.6.0 | 📦 Tipos TypeScript |
| `allure-playwright` | ^3.7.1 | 📊 Reporter Allure |
| `playwright` | (peer) | 🌐 Navegadores para automatización |

## ▶️ Ejecutar Tests

### Tests estándar (HTML)

```bash
# ▶️ Tests flujo A
npx playwright test tests/flujoA_steps.spec.ts

# ▶️ Tests flujo B
npx playwright test tests/flujoB_steps.spec.ts

# 🏃 Todos los tests
npx playwright test
```

### Por tag

```bash
npx playwright test --grep "@negative"
npx playwright test --grep "@transmission"
npx playwright test --grep "@brand"
npx playwright test --grep "@type"
```

### Con reporter específico

```bash
npx playwright test --reporter=list
npx playwright test --reporter=html
```

### 💻 GitHub CLI

Ejecuta los tests desde terminal usando GitHub CLI.

#### Por archivo de test:

```bash
# Ejecutar flujo A (3 tests)
gh workflow run playwright.yml -f testFile=tests/flujoA_steps.spec.ts -f reporter=html

# Ejecutar flujo B (15 tests)
gh workflow run playwright.yml -f testFile=tests/flujoB_steps.spec.ts -f reporter=html

# Ejecutar allure flujo A
gh workflow run playwright.yml -f testFile=tests/allure/allure-flujoA.spec.ts -f reporter=allure

# Ejecutar allure flujo B
gh workflow run playwright.yml -f testFile=tests/allure/allure-flujoB.spec.ts -f reporter=both
```

#### Por tag:

```bash
# Tests positivos
gh workflow run playwright.yml -f tag=@positive -f reporter=html

# Tests negativos
gh workflow run playwright.yml -f tag=@negative -f reporter=html

# Tests de marca
gh workflow run playwright.yml -f tag=@brand -f reporter=html

# Tests de transmisión
gh workflow run playwright.yml -f tag=@transmission -f reporter=html

# Tests de tipo de coche
gh workflow run playwright.yml -f tag=@type -f reporter=html

# Tests combinados
gh workflow run playwright.yml -f tag=@combinado -f reporter=both
```

#### Todos los tests:

```bash
# Con reporte HTML
gh workflow run playwright.yml -f testFile="(todos)" -f reporter=html

# Con reporte Allure
gh workflow run playwright.yml -f reporter=allure

# Con ambos reportes
gh workflow run playwright.yml -f reporter=both
```

#### Ver resultados:

```bash
# Ver estado de ejecución
gh run list --workflow=playwright.yml

# Ver logs en tiempo real
gh run watch <run-id>
```

### 🌐 GitHub Actions (Web)

Ejecuta los tests automáticamente desde GitHub sin necesidad de entorno local.

#### Desde la web:
1. Ve a **GitHub → Actions → Playwright E2E Tests**
2. Click en **Run workflow**
3. Selecciona el tipo de reporte:
   - `html` → Solo reporte HTML
   - `allure` → Solo reporte Allure
   - `both` → Ambos reportes
4. Click en **Run workflow**

#### Ver resultados:
- Ve a **Actions** → Ejecución completada
- Descarga los reportes desde **Artifacts**

#### Configuración actual:
| Parámetro | Valor |
|-----------|-------|
| Paralelismo | ⚡ 4 tests simultáneos |
| Browser | 🌐 Chromium |
| Timeout | ⏱️ 60 minutos |
| Retries | 🔁 2 (si falla) |

#### Cuándo se ejecuta:
- ⏰ **Manual**: Cuando tú quieras desde GitHub
- 📅 **Programado**: (descomentar en workflow para ejecutar diario)

## 📊 Reportes

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
| `description` | Descripción corta del test | "User completes full flow" |
| `severity` | Nivel de criticidad | `blocker`, `critical`, `normal`, `minor`, `trivial` |
| `feature` | Feature epic | "Flow A", "Flow B" |
| `story` | User story | "Contracting", "Search Filters" |

**Severity por tipo de test:**
| Tipo de Test | Severity |
|--------------|----------|
| Positive (happy path) | `critical` |
| Negative (validation) | `normal` |

### Comparación de Reportes

| Aspecto | HTML | Allure |
|---------|------|--------|
| Interfaz | 🌐 Explorador web | 🌐 Explorador web |
| Adjuntos | 📸 Screenshots, videos, trace | 📋 Screenshots, videos, logs |
| Estructura | 📋 Lista de tests | 🏗️ Features/Stories/epics |
| Tags | 🏷️ Soportado | 🏷️ Soportado |

## 🏷️ Tags disponibles

### Tags de Categoría
- `@negative` - ❌ Tests que verifican comportamiento de error
- `@positive` - ✅ Tests que verifican flujo correcto

### Tags de Filtros (flujoB)
- `@brand` - 🔍 Tests de filtro por marca
- `@transmission` - ⚙️ Tests de filtro por tipo de cambio
- `@type` - 🚗 Tests de filtro por tipo de coche
- `@combinado` - 🔗 Tests de filtros combinados

## 🎲 Generación de Datos de Test

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

### 5. ERP 🏢

- **Reglas de negocio** (contabilidad, facturación, stock...)
- **Flujos transaccionales** (pedido → factura → asiento contable)
- **Integraciones** (bancos, Hacienda, proveedores)
- **Consistencia de datos** (lo más crítico)
- **Arquitectura**: Backend ≈ 70% (lógica, cálculos, reglas) | Integración ≈ 20% (módulos + mocks externos) | UI ≈ 10% con Playwright (solo flujos críticos)

## 💰 Validación Financiera en Entornos de Test

---

### 🧪 (1) Entorno Desarrollo / Staging

En estos entornos, la idea es no depender de servicios externos reales.

#### Estrategia:
- Usar mocks para simular la respuesta del proveedor  
- Automatizar con Playwright tanto UI como validación de red  

#### Cómo se trabaja:
Se interceptan las llamadas al servicio de validación financiera y se simulan distintos escenarios.

Por ejemplo:
- Se envían datos de un usuario (nombre, DNI, ingresos…)  
- El sistema recibe una respuesta simulada:  
  - “aprobado” → continúa el flujo  
  - “rechazado” → se bloquea  
  - “en revisión” → queda pendiente  
  - “error” → se informa al usuario  

#### Qué se valida:
- Que los datos enviados son correctos  
- Que el sistema interpreta bien la respuesta  
- Que el flujo se comporta como se espera  

👉 Objetivo: poder probar todo de forma estable y sin depender de terceros.

---

### 🟡 (2) Entorno Producción (y Preproducción)

Aquí ya se trabaja con proveedores reales, así que el enfoque es más controlado.

#### Estrategia:
- En preproducción, usar entornos de prueba del proveedor  
- En producción, hacer solo validaciones básicas  

#### Cómo se trabaja:
- Se envían datos reales o controlados  
- El proveedor devuelve una respuesta real  

Ejemplo:
- “aprobado” → se puede contratar  
- “rechazado” → no se permite continuar  

#### Qué se valida:
- Que la integración funciona correctamente  
- Que el sistema responde bien  
- Que no hay errores inesperados  
- Que la respuesta llega en un tiempo razonable (sin esperas largas)

#### En producción:
- Solo pruebas básicas (happy path) con Playwright  
- Más apoyo en monitorización que en tests automáticos  

---

### 📌 Resumen

| Entorno        | Enfoque             | Objetivo                  |
|---------------|---------------------|---------------------------|
| Staging       | Mocks / simulación  | Validar lógica y flujos   |
| Preproducción | Entorno real (test) | Validar integración       |
| Producción    | Tests mínimos       | Asegurar estabilidad      |