# Jak naprawić błąd 500 - Brakujące zmienne środowiskowe w Cloudflare Pages

## Problem
Po deployment na Cloudflare Pages otrzymujesz błąd **500 Internal Server Error** z kodem `NS_ERROR_NET_ERROR_RESPONSE`.

## Przyczyna
Zmienne środowiskowe (SUPABASE_URL, SUPABASE_KEY) nie są skonfigurowane w Cloudflare Pages dla środowiska **Production**.

## Rozwiązanie

### Krok 1: Przejdź do ustawień projektu w Cloudflare

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Przejdź do **Workers & Pages**
3. Kliknij na swój projekt **winelog**
4. Kliknij zakładkę **Settings**
5. W menu po lewej wybierz **Environment variables**

### Krok 2: Dodaj zmienne dla środowiska Production

W sekcji **Production (Current)** dodaj następujące zmienne:

#### Zmienna 1: SUPABASE_URL
- **Variable name**: `SUPABASE_URL`
- **Value**: `https://your-project-id.supabase.co` (zastąp swoim URL)
- **Environment**: `Production`
- Kliknij **Add variable**

#### Zmienna 2: SUPABASE_KEY
- **Variable name**: `SUPABASE_KEY`
- **Value**: `your-anon-public-key` (zastąp swoim kluczem)
- **Environment**: `Production`
- Kliknij **Add variable**

#### Zmienna 3: NODE_VERSION (opcjonalnie)
- **Variable name**: `NODE_VERSION`
- **Value**: `22.14.0`
- **Environment**: `Production`
- Kliknij **Add variable**

### Krok 3: Zapisz zmiany

Po dodaniu wszystkich zmiennych, kliknij **Save** (jeśli jest taki przycisk).

### Krok 4: Redeploy aplikacji

**WAŻNE**: Zmienne środowiskowe są stosowane tylko do **nowych deploymentów**. Musisz wykonać redeploy:

**Opcja A: Przez Cloudflare Dashboard**
1. W projekcie **winelog**, przejdź do zakładki **Deployments**
2. Znajdź ostatni deployment
3. Kliknij trzy kropki (...) obok deploymentu
4. Wybierz **Retry deployment** lub **Rollback to this deployment**

**Opcja B: Przez Git push**
1. Wykonaj dowolną zmianę w repozytorium (np. zmień README)
2. Push do brancha `main`
3. Cloudflare automatycznie wykona nowy deployment

**Opcja C: Przez lokalny CLI**
```bash
npm run build
npx wrangler pages deploy dist --project-name=winelog
```

### Krok 5: Zweryfikuj poprawność

Po redeployment:
1. Otwórz swoją stronę: `https://122d31ad.winelog.pages.dev/`
2. Sprawdź konsolę przeglądarki (F12) - nie powinno być błędów 500
3. Spróbuj otworzyć stronę logowania: `/login`

---

## Gdzie znajdę moje klucze Supabase?

### SUPABASE_URL
1. Zaloguj się do [Supabase Dashboard](https://supabase.com/dashboard)
2. Wybierz swój projekt
3. Przejdź do **Settings** → **API**
4. Skopiuj wartość z pola **Project URL**
   - Format: `https://abcdefghijklmnop.supabase.co`

### SUPABASE_KEY (anon/public key)
1. W tym samym miejscu (**Settings** → **API**)
2. Skopiuj wartość z pola **Project API keys** → **anon** → **public**
   - To jest długi token zaczynający się od `eyJ...`

---

## Weryfikacja zmiennych środowiskowych

Aby sprawdzić czy zmienne są poprawnie skonfigurowane:

### W Cloudflare Dashboard
1. **Workers & Pages** → **winelog** → **Settings** → **Environment variables**
2. Powinieneś zobaczyć:
   - ✅ `SUPABASE_URL` - Production
   - ✅ `SUPABASE_KEY` - Production
   - ✅ `NODE_VERSION` - Production (opcjonalnie)

### W logach Cloudflare
1. **Workers & Pages** → **winelog** → **Functions** (lub **Logs**)
2. Jeśli zmienne są brakujące, zobaczysz błąd:
   ```
   Error: Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_KEY environment variables.
   ```

---

## Czemu to było potrzebne?

### Różnica między build time a runtime

W Cloudflare Pages z Astro:
- **Build time**: Zmienne są dostępne przez `import.meta.env.*`
  - Używane podczas `npm run build`
  - Dostępne w GitHub Secrets
  
- **Runtime**: Zmienne są dostępne przez `context.runtime.env.*`
  - Używane gdy użytkownik odwiedza stronę
  - Muszą być skonfigurowane w Cloudflare Pages

### Co zmieniłem w kodzie?

Zaktualizowałem `src/middleware/index.ts` aby:
1. Pobierał zmienne z `context.runtime.env` (dla Cloudflare)
2. Miał fallback do `import.meta.env` (dla lokalnego developmentu)
3. Walidował czy zmienne istnieją i rzucał czytelny błąd jeśli nie

```typescript
// Przed:
const supabaseUrl = import.meta.env.SUPABASE_URL; // ❌ undefined w runtime na Cloudflare

// Po:
const supabaseUrl = context.runtime?.env?.SUPABASE_URL || import.meta.env.SUPABASE_URL; // ✅
```

---

## Troubleshooting

### Nadal widzę błąd 500 po dodaniu zmiennych

1. **Upewnij się, że wykonałeś redeploy** - zmienne nie są stosowane retroaktywnie
2. **Sprawdź czy zmienne są dla środowiska "Production"** - nie "Preview"
3. **Sprawdź logi w Cloudflare Dashboard** → Functions/Logs
4. **Zweryfikuj poprawność kluczy Supabase** - skopiuj je ponownie

### Błąd: "Supabase configuration missing"

To znaczy, że zmienne nadal nie są dostępne. Sprawdź:
- Czy zmienne są zapisane w Cloudflare Pages
- Czy wykonałeś redeploy po dodaniu zmiennych
- Czy nazwa zmiennych jest dokładnie: `SUPABASE_URL` i `SUPABASE_KEY` (case-sensitive)

### Aplikacja działa lokalnie, ale nie na Cloudflare

To typowy problem z zmiennymi środowiskowymi. Lokalnie używasz `.env`, ale na Cloudflare musisz skonfigurować je w Dashboard.

---

## Następne kroki

Po poprawnym skonfigurowaniu zmiennych:
1. ✅ Strona powinna się załadować bez błędów 500
2. ✅ Możesz przetestować rejestrację użytkownika
3. ✅ Możesz przetestować logowanie
4. ✅ Dashboard powinien działać poprawnie

Jeśli nadal masz problemy, sprawdź logi w:
- Cloudflare Dashboard → Workers & Pages → winelog → Functions → Logs
- Konsola przeglądarki (F12) → Network/Console tabs


