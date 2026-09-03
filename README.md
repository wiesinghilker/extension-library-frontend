# Extension Library Frontend

Shared Frontend-Library for mittwald Marketplace Extensions. Stellt React-Komponenten, Error-Handling, openapi-fetch-Middlewares und E2E-Test-Helpers bereit.

## Installation

```bash
pnpm add @wiesinghilker/extension-lib-frontend
```

### Peer Dependencies

```json
{
  "@mittwald/ext-bridge": "^1",
  "@mittwald/flow-remote-react-components": "^1",
  "@playwright/test": "^1",
  "openapi-fetch": "^0",
  "react": "^19",
  "react-dom": "^19",
  "react-router": "^7 || ^8"
}
```

## API-Referenz

### Komponenten

#### `DefaultErrorComponent`

Standard-Fehlerkomponente für React Router Error Boundaries. Zeigt die Fehlermeldung an und bietet einen Link zum Neuladen sowie einen vorausgefüllten Support-Mailto-Link.

```tsx
import { DefaultErrorComponent } from "@wiesinghilker/extension-lib-frontend";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <DefaultErrorComponent />,
  },
]);
```

#### `ErrorDeveloperDetails`

Zeigt technische Fehlerdetails (URL + Stack Trace) in einem aufklappbaren Accordion an. Gedacht als Ergänzung zur Fehlerseite, damit Support-Details kopiert werden können.

```tsx
import { ErrorDeveloperDetails } from "@wiesinghilker/extension-lib-frontend";

const MyErrorPage = () => (
  <>
    <Text>Ein Fehler ist aufgetreten.</Text>
    <ErrorDeveloperDetails />
  </>
);
```

#### `CustomLoadingSpinner`

Ladeindikator mit konfigurierbarem Text.

```tsx
import { CustomLoadingSpinner } from "@wiesinghilker/extension-lib-frontend";

<CustomLoadingSpinner text="Daten werden geladen" />
// Rendert: [Spinner] "Daten werden geladen ..."
```

#### `AuthenticationErrorComponent`

Zeigt eine Fehlermeldung bei fehlgeschlagener Authentifizierung.

#### `MissingParamErrorComponent`

Zeigt eine Fehlermeldung, wenn das mStudio nicht alle benötigten Parameter übergeben hat.

---

### Error-Handling

#### `defaultErrorComponentMap`

Mapping von Error-Klassennamen zu React-Komponenten. Kann genutzt werden, um in Error Boundaries basierend auf dem Fehlertyp unterschiedliche Komponenten zu rendern.

```typescript
import { defaultErrorComponentMap } from "@wiesinghilker/extension-lib-frontend";

// Enthält:
// "AuthenticationError" => <AuthenticationErrorComponent />
// "MissingParamError"   => <MissingParamErrorComponent />
```

#### `ErrorMap` (Type)

```typescript
type ErrorMap = Record<string, (error: Error) => ReactNode>;
```

#### `AuthenticationError`

Custom Error-Klasse für Authentifizierungsfehler.

```typescript
import { AuthenticationError } from "@wiesinghilker/extension-lib-frontend";

throw new AuthenticationError("Token abgelaufen");
```

#### `MissingParamError`

Custom Error-Klasse für fehlende Parameter.

```typescript
import { MissingParamError } from "@wiesinghilker/extension-lib-frontend";

throw new MissingParamError("projectId fehlt");
```

---

### Middlewares (openapi-fetch)

#### `sessionTokenMiddleware`

openapi-fetch-Middleware, die automatisch den Session-Token aus der ext-bridge in den `Session-Token`-Header jedes Requests schreibt.

```typescript
import createClient from "openapi-fetch";
import { sessionTokenMiddleware } from "@wiesinghilker/extension-lib-frontend";

const client = createClient<paths>({ baseUrl: "/api" });
client.use(sessionTokenMiddleware);

// Alle Requests enthalten jetzt automatisch den Session-Token
const { data } = await client.GET("/users");
```

#### `requestIdMiddleware`

openapi-fetch-Middleware, die jedem Request eine eindeutige `x-request-id` (UUID) hinzufügt. Ermöglicht Request-Korrelation mit dem Backend-Logger.

```typescript
import createClient from "openapi-fetch";
import { requestIdMiddleware } from "@wiesinghilker/extension-lib-frontend";

const client = createClient<paths>({ baseUrl: "/api" });
client.use(requestIdMiddleware);
```

Beide Middlewares zusammen:

```typescript
const client = createClient<paths>({ baseUrl: "/api" });
client.use(sessionTokenMiddleware);
client.use(requestIdMiddleware);
```

---

### Hooks

#### `useIsEmployee(apiBaseURL)`

React Hook, der prüft ob der aktuelle User ein mittwald-Mitarbeiter ist.

```typescript
import { useIsEmployee } from "@wiesinghilker/extension-lib-frontend";

const MyComponent = () => {
  const isEmployee = useIsEmployee("/api");

  if (isEmployee === undefined) {
    return <CustomLoadingSpinner text="Lade" />;
  }

  if (isEmployee) {
    return <Text>Interne Ansicht</Text>;
  }

  return <Text>Kunden-Ansicht</Text>;
};
```

**Parameter:** `apiBaseURL: string` - Basis-URL der Backend-API

**Return:** `boolean | undefined` - `undefined` waehrend des Ladens, `true`/`false` danach

---

### E2E-Test-Helpers

Import über den separaten Entrypoint `@wiesinghilker/extension-lib-frontend/e2e`:

```typescript
import {
  login,
  navigateToExtension,
  confirmDialog,
  // ...
} from "@wiesinghilker/extension-lib-frontend/e2e";
```

Alle Funktionen erwarten ein Playwright `Page`-Objekt als ersten Parameter.

#### Navigation

| Funktion | Beschreibung |
|---|---|
| `login(page)` | Login im mStudio (Credentials via `MSTUDIO_EMAIL` / `MSTUDIO_PASSWORD` Env-Vars) |
| `navigateToExtension(page, extensionName, headingName?, projectName?, targetName?, targetType?)` | Navigiert zu einer Extension (Login + Navigation) |
| `navigateToProject(page, projectName)` | Navigiert zu einem Projekt |
| `navigateToProjectExtension(page, projectName, extensionName, headingName)` | Navigiert zu einer Extension innerhalb eines Projekts |
| `navigateToApp(page, projectName, appName)` | Navigiert zu einer App |
| `navigateToEmailAddress(page, projectName, emailAddress)` | Navigiert zu einer E-Mail-Adresse |

#### UI-Interaktion

| Funktion | Beschreibung |
|---|---|
| `clickMultiple(locator, times)` | Klickt einen Locator `n`-mal |
| `confirmDialog(page, dialogName, confirmButtonText)` | Bestätigungs-Dialog bestätigen |
| `deleteListItem(page, rowLocator, menuItemName, dialogName)` | Listenelement über Kontextmenü löschen |
| `ensureSwitchState(page, switchLocator, labelText, shouldBeChecked)` | Switch in gewünschten Zustand bringen |
| `ensureRadioState(page, labelText, radioName)` | Radio-Button auswaehlen |
| `expectDownload(page, triggerLocator, expectedFilename, minSizeBytes?)` | Download auslösen und validieren |

#### Beispiel

```typescript
import { test, expect } from "@playwright/test";
import { navigateToExtension, confirmDialog } from "@wiesinghilker/extension-lib-frontend/e2e";

test("Extension öffnen und Dialog bestätigen", async ({ page }) => {
  await navigateToExtension(page, "Meine Extension", "Dashboard");
  await confirmDialog(page, "Einrichtung", "Weiter");
  await expect(page.getByText("Erfolgreich")).toBeVisible();
});
```

---

## Entwicklung

```bash
pnpm install    # Abhängigkeiten installieren
pnpm build      # Library bauen (CJS + ESM + Typings)
pnpm dev        # Watch-Mode
pnpm lint       # ESLint
pnpm format     # Prettier
```

## Architektur

```
src/
  Components/
    AuthenticationErrorComponent.tsx  # Authentifizierungs-Fehleranzeige
    CustomLoadingSpinner.tsx          # Ladeindikator mit Text
    DefaultErrorComponent.tsx         # Standard Error Boundary
    ErrorDeveloperDetails.tsx         # Technische Fehlerdetails
    MissingParamErrorComponent.tsx    # Fehlende-Parameter-Fehleranzeige
  Errors/
    AuthenticationError.tsx           # Custom Error-Klasse
    MissingParamError.tsx             # Custom Error-Klasse
  Hooks/
    useIsEmployee.ts                  # Employee-Check Hook
  e2e/
    helpers.ts                        # Playwright E2E-Hilfsfunktionen
    index.ts                          # E2E Public API
  defaultErrorComponentMap.tsx        # Error-zu-Komponente Mapping
  sessionTokenMiddleware.ts           # openapi-fetch Session-Token
  requestIdMiddleware.ts              # openapi-fetch Request-ID
  index.ts                            # Public API
```

### Entrypoints

| Import | Beschreibung |
|---|---|
| `@wiesinghilker/extension-lib-frontend` | Hauptpaket (Komponenten, Middlewares, Hooks) |
| `@wiesinghilker/extension-lib-frontend/e2e` | E2E-Test-Helpers (Playwright) |
