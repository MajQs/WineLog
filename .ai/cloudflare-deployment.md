# Cloudflare Pages Deployment Setup

## Zmiany wprowadzone do projektu

### 1. Konfiguracja projektu dla Cloudflare Pages

#### astro.config.mjs
- Zmieniono adapter z `@astrojs/node` na `@astrojs/cloudflare`
- Ustawiono tryb `directory` dla Cloudflare Pages
- Zachowano konfigurację server-side rendering (SSR)

#### package.json
- Dodano zależność: `@astrojs/cloudflare@^12.6.10`
- Pozostawiono `@astrojs/node` dla lokalnego developmentu

### 2. GitHub Actions Workflow - master.yml

Utworzono nowy workflow `.github/workflows/master.yml` do deploymentu na Cloudflare Pages:

**Trigger**: Manual (`workflow_dispatch`) - workflow uruchamiany ręcznie przez użytkownika

**Jobs**:
1. **lint** - Sprawdzenie kodu ESLintem
2. **unit-test** - Testy jednostkowe z coverage
3. **build** - Budowanie aplikacji z Astro
4. **deploy** - Deployment na Cloudflare Pages używając Wrangler CLI
5. **status-comment** - Logowanie statusu po udanym deploymencie

**Kluczowe zmiany**:
- Usunięto testy E2E (zgodnie z wymaganiami)
- Użyto Wrangler CLI zamiast zarchiwizowanej akcji `cloudflare/pages-action`
- Wszystkie GitHub Actions zaktualizowane do najnowszych wersji

### 3. Aktualizacja wersji GitHub Actions

Wszystkie actions zaktualizowane zgodnie z github-action rules:

| Action | Aktualna wersja | Status |
|--------|-----------------|---------|
| actions/checkout | v5 | ✅ Aktywne |
| actions/setup-node | v6 | ✅ Aktywne |
| actions/upload-artifact | v5 | ✅ Aktywne |
| actions/download-artifact | v5 | ✅ Aktywne |
| cloudflare/wrangler-action | v3 | ✅ Aktywne (oficjalnie wspierane) |

### 4. README.md

Zaktualizowano dokumentację:
- Dodano sekcję o wymaganych sekretach GitHub dla deploymentu
- Dodano informacje o Cloudflare Pages jako platformie hostingowej
- Link do workflow master.yml

## Wymagane GitHub Secrets

Aby uruchomić deployment, skonfiguruj następujące sekrety w GitHub:

```
CLOUDFLARE_API_TOKEN        - API token z uprawnieniami do Cloudflare Pages
CLOUDFLARE_ACCOUNT_ID       - ID konta Cloudflare
SUPABASE_URL               - URL projektu Supabase (tylko dla buildu)
SUPABASE_KEY               - Supabase anonymous key (tylko dla buildu)
```

## Wymagane zmienne środowiskowe w Cloudflare Pages

**WAŻNE**: Zmienne środowiskowe używane w runtime (np. SUPABASE_URL, SUPABASE_KEY) muszą być również skonfigurowane w Cloudflare Pages:

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Przejdź do: Workers & Pages → Twój projekt → Settings → Environment variables
3. Dodaj następujące zmienne dla środowiska **Production**:
   - `SUPABASE_URL` - URL projektu Supabase
   - `SUPABASE_KEY` - Supabase anonymous key

**Uwaga**: Zmienne w GitHub Secrets są używane tylko podczas buildu. Zmienne w Cloudflare Pages są używane w runtime aplikacji.

## Jak uzyskać Cloudflare API Token

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Przejdź do: My Profile → API Tokens
3. Kliknij "Create Token"
4. Użyj szablonu "Edit Cloudflare Workers" lub utwórz custom token z uprawnieniami:
   - Account → Cloudflare Pages → Edit
5. Skopiuj wygenerowany token i dodaj jako secret `CLOUDFLARE_API_TOKEN`

## Jak uzyskać Cloudflare Account ID

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Wybierz dowolną domenę lub przejdź do Workers & Pages
3. Account ID znajduje się w prawym panelu lub w URL

## Deployment Process

### Ręczne uruchomienie deploymentu

1. Przejdź do zakładki **Actions** w repozytorium GitHub
2. Wybierz workflow **"Deploy to Cloudflare Pages"**
3. Kliknij **"Run workflow"**
4. Wybierz branch (domyślnie: main)
5. Kliknij **"Run workflow"** (zielony przycisk)

### Pipeline stages

```
lint → unit-test → build → deploy → status-comment
```

Każdy stage musi zakończyć się sukcesem, aby przejść do kolejnego.

## Lokalne testowanie

### Z adapterem Cloudflare
```bash
npm run build
npx wrangler pages dev dist
```

### Z adapterem Node (dla developmentu)
Zmień tymczasowo `astro.config.mjs`:
```javascript
import node from "@astrojs/node";

export default defineConfig({
  // ...
  adapter: node({ mode: "standalone" }),
});
```

Następnie:
```bash
npm run dev
```

## Kompatybilność

### Wymagania GitHub Runner
- Minimalny runner: v2.327.1 (dla actions v5+)
- Node.js: 22.14.0 (zgodnie z .nvmrc)

### Cloudflare Pages
- Wspiera Astro 5 SSR
- Kompatybilne z Supabase client-side i server-side
- Edge runtime dla lepszej wydajności

## Rozwiązywanie problemów

### ERROR: Missing entry-point to Worker script or to assets directory

**Problem**: Cloudflare próbuje użyć `wrangler deploy` (dla Workers) zamiast `wrangler pages deploy` (dla Pages).

**Rozwiązanie**: 
- Projekt został utworzony jako **Worker** zamiast **Pages**
- Usuń projekt w Cloudflare Dashboard
- Utwórz nowy projekt wybierając **Pages** (nie Workers)
- Zobacz szczegółowy przewodnik: [cloudflare-pages-setup-guide.md](cloudflare-pages-setup-guide.md)

### ERROR 500: Internal Server Error (NS_ERROR_NET_ERROR_RESPONSE)

**Problem**: Aplikacja została zdeployowana, ale zwraca błąd 500 przy próbie otwarcia strony.

**Przyczyna**: Brakujące zmienne środowiskowe w Cloudflare Pages (SUPABASE_URL, SUPABASE_KEY).

**Rozwiązanie**:
1. W Cloudflare Dashboard → Workers & Pages → winelog → Settings → Environment variables
2. Dodaj zmienne dla środowiska **Production**:
   - `SUPABASE_URL` - URL projektu Supabase
   - `SUPABASE_KEY` - Supabase anon/public key
3. Wykonaj **redeploy** (zmienne nie są stosowane retroaktywnie)
4. Zobacz szczegółowy przewodnik: [cloudflare-env-variables-fix.md](cloudflare-env-variables-fix.md)

### Build fails
- Sprawdź czy wszystkie zmienne środowiskowe są ustawione
- Sprawdź logi w GitHub Actions
- Upewnij się, że `NODE_VERSION=22.14.0` jest ustawiona w Cloudflare Pages

### Deployment fails
- Upewnij się, że CLOUDFLARE_API_TOKEN ma odpowiednie uprawnienia
- Sprawdź czy nazwa projektu w komendzie deploy odpowiada nazwie w Cloudflare
- Sprawdź czy projekt Cloudflare Pages został utworzony jako **Pages** (nie Worker)

### Runtime errors po deploymencie
- Sprawdź czy wszystkie zmienne środowiskowe są ustawione w Cloudflare Pages
- Sprawdź logi w Cloudflare Dashboard → Pages → projekt → Functions → Logs
- Upewnij się, że adapter w `astro.config.mjs` to `@astrojs/cloudflare`

## Dalsze kroki

1. ✅ Utwórz projekt Cloudflare Pages (jeśli jeszcze nie istnieje)
2. ✅ Skonfiguruj GitHub Secrets
3. ✅ Uruchom pierwszy deployment ręcznie
4. ⏳ (Opcjonalnie) Skonfiguruj preview deployments dla PR
5. ⏳ (Opcjonalnie) Dodaj custom domain w Cloudflare

## Uwagi techniczne

### Dlaczego Wrangler CLI zamiast cloudflare/pages-action?

Akcja `cloudflare/pages-action` została zarchiwizowana przez Cloudflare. Oficjalnie zalecane podejście to użycie Wrangler CLI:

```bash
npx wrangler pages deploy <directory> --project-name=<name>
```

Jest to bardziej elastyczne, zawsze aktualne i oficjalnie wspierane przez Cloudflare.

### Dlaczego zachowano @astrojs/node?

Adapter Node.js jest nadal przydatny dla:
- Lokalnego developmentu
- Testów E2E (które działają z localhost:3000)
- Ewentualnego deploymentu na inne platformy (np. DigitalOcean)

Oba adaptery mogą współistnieć w projekcie, a wybór następuje w `astro.config.mjs`.

