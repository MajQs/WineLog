# Poprawki Timeoutów w Testach E2E

## Problem
Testy E2E kończyły się niepowodzeniem przy **pierwszym uruchomieniu** z błędem:
```
TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
waiting for navigation until "load"
```

Drugie uruchomienie działało prawidłowo, co wskazywało na problemy z "cold start".

## Zdiagnozowane Przyczyny

1. **Podwójne oczekiwanie na nawigację**
   - `LoginPage.login()` czekał na `/dashboard`
   - `auth.fixture.ts` ponownie czekał na `/dashboard`
   - Duplikacja waita powodowała problemy

2. **Zbyt krótkie timeouty**
   - 20 sekund było za mało przy pierwszym uruchomieniu
   - "Cold start" serwera, bazy danych i autentykacji wymaga więcej czasu

3. **Agresywne `waitUntil: "load"`**
   - Domyślne ustawienie czekało na wszystkie zasoby (obrazy, CSS, JS)
   - Niepotrzebnie długie oczekiwanie

4. **Brak weryfikacji gotowości UI**
   - Nawigacja mogła się zakończyć, ale dane użytkownika jeszcze się ładowały
   - Brak waita na kluczowe elementy UI

## Wprowadzone Poprawki

### 1. LoginPage.ts
**Zmiany:**
- ✅ Zmiana `waitUntil` z `"load"` na `"domcontentloaded"`
- ✅ Zwiększenie timeoutu z 20s na 30s
- ✅ Dodanie waita na element `user-email` po zalogowaniu

**Efekt:** Logowanie czeka tylko na podstawowy DOM, nie na wszystkie zasoby, i weryfikuje że UI jest gotowy.

### 2. auth.fixture.ts
**Zmiany:**
- ✅ Usunięcie duplikującego się `waitForURL` (jest już w `login()`)
- ✅ Dodanie waita na przycisk "New Batch" (weryfikacja że dashboard załadował dane)
- ✅ Dodanie `waitForLoadState("networkidle")` aby upewnić się że dane się załadowały

**Efekt:** Fixture nie duplikuje waitów i czeka na konkretne elementy potwierdzające gotowość dashboardu.

### 3. playwright.config.ts
**Zmiany:**
- ✅ Dodanie `timeout: 60000` (60s na test)
- ✅ Dodanie `navigationTimeout: 45000` (45s na nawigację)
- ✅ Dodanie `actionTimeout: 15000` (15s na akcje jak click, fill)
- ✅ Zwiększenie `webServer.timeout` z 120s na 180s (3 minuty)

**Efekt:** Globalne timeouty dostosowane do realnych czasów cold start.

### 4. BasePage.ts
**Dodane helpery:**
- ✅ `waitForElement(locator, timeout)` - czekanie na konkretny element
- ✅ `waitForAuthReady()` - weryfikacja gotowości autentykacji

**Efekt:** Reużywalne metody do weryfikacji gotowości aplikacji.

### 5. Testy (create-batch-with-auth.spec.ts, auth-login.spec.ts)
**Zmiany:**
- ✅ Wszystkie `waitForURL` używają teraz `waitUntil: "domcontentloaded"`
- ✅ Timeouty zwiększone z 20s na 30s
- ✅ Dodane explicit timeouty dla asercji `.toBeVisible()`

**Efekt:** Testy są bardziej odporne na wolniejsze pierwsze uruchomienia.

## Podsumowanie Zmian

| Plik | Typ Zmiany | Wpływ |
|------|------------|-------|
| `LoginPage.ts` | Timeout + waitUntil + element wait | 🟢 Krytyczny |
| `auth.fixture.ts` | Usunięcie duplikacji + element waits | 🟢 Krytyczny |
| `playwright.config.ts` | Globalne timeouty | 🟢 Krytyczny |
| `BasePage.ts` | Nowe helpery | 🟡 Pomocniczy |
| `*.spec.ts` | Timeout adjustments | 🟢 Krytyczny |

## Oczekiwane Rezultaty

Po tych poprawkach:
- ✅ Pierwsze uruchomienie testów powinno działać poprawnie
- ✅ Testy nie będą kończyć się timeoutem przy cold start
- ✅ Lepsza diagnostyka - więcej czasu na załadowanie się aplikacji
- ✅ Więcej pewności że UI jest gotowy przed wykonaniem akcji

## Testowanie

Aby przetestować poprawki:

```bash
# Uruchom testy od nowa (cold start)
npm run test:e2e

# Lub specyficzny plik
npx playwright test e2e/tests/auth-login.spec.ts
npx playwright test e2e/tests/create-batch-with-auth.spec.ts
```

## Dodatkowe Uwagi

- **Timeouty są hojne** - lepiej poczekać dłużej niż mieć flaky tests
- **CI może wymagać jeszcze dłuższych timeoutów** - rozważ zwiększenie w CI
- **Helpery w BasePage** mogą być używane w przyszłych testach
- **Monitoring** - jeśli testy wciąż są wolne, rozważ:
  - Optymalizację serwera deweloperskiego
  - Lazy loading komponentów
  - Caching w Supabase

## Autorstwo
Data: 2025-11-14
Poprawki wprowadzone w odpowiedzi na problem z timeout podczas pierwszego logowania w testach E2E.

