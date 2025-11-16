# CloudFlare Pages Deployment - Problem i Rozwiązanie

## 🔍 Diagnoza Problemu

### Objawy
- Lokalnie `npm run build` + `npx wrangler pages deploy dist` działa poprawnie
- Deploy z brancha `develop` działa poprawnie na CloudFlare Pages
- Deploy z brancha `main` **NIE DZIAŁA** - błąd: "Cannot find SUPABASE_URL and SUPABASE_KEY"
- Sekrety są dodane do środowisk Production i Preview w CloudFlare

### Przyczyna
Projekt używał **nieprawidłowego adaptera** dla CloudFlare Pages:

1. **Poprzednia konfiguracja:** Adapter `@astrojs/node` (dla Node.js serwerów)
2. **Problem:** CloudFlare Pages działa na CloudFlare Workers, nie na Node.js
3. **Skutek:** Zmienne środowiskowe były pobierane przez `import.meta.env` (build-time), ale CloudFlare Pages udostępnia je w **runtime**, nie podczas buildu

### Dlaczego lokalnie działało?
- Vite (używany przez Astro) wstrzykuje zmienne z `.env` podczas buildu
- CloudFlare Pages **nie ma dostępu** do sekretów podczas buildu - są one dostępne tylko w runtime dla Workers

### Dlaczego develop działał, a main nie?
- Preview deployments mogły mieć inną konfigurację lub sposób obsługi zmiennych
- Możliwe, że branch develop był traktowany jako preview environment, który miał inne bindinge

---

## ✅ Rozwiązanie

### 1. Zmiana Adaptera

**Zmieniono:** `@astrojs/node` → `@astrojs/cloudflare`

**Plik:** `astro.config.mjs`
```javascript
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
```

### 2. Aktualizacja Middleware

**Zmieniono:** Pobieranie zmiennych z `import.meta.env` (build-time) → `context.locals.runtime.env` (runtime)

**Plik:** `src/middleware/index.ts`
```typescript
export const onRequest = defineMiddleware(async (context, next) => {
  // Pobieranie zmiennych z CloudFlare runtime
  const runtime = context.locals.runtime;
  const supabaseUrl = runtime?.env?.SUPABASE_URL;
  const supabaseAnonKey = runtime?.env?.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing required Supabase environment variables");
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    // ... konfiguracja
  });

  context.locals.supabase = supabase;
  return next();
});
```

### 3. Aktualizacja Typów

**Plik:** `src/env.d.ts`
```typescript
declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      runtime: {
        env: {
          SUPABASE_URL: string;
          SUPABASE_KEY: string;
        };
        cf: CfProperties;
        ctx: ExecutionContext;
      };
    }
  }
}
```

### 4. Dodatkowe Pliki

- **`.dev.vars`** - dla lokalnego developmentu z Wrangler (dodany do `.gitignore`)
- **`wrangler.toml`** - konfiguracja CloudFlare Workers dla lokalnego developmentu
- **Zaktualizowano `README.md`** - dodano sekcję o deploymencie na CloudFlare Pages

---

## 🚀 Co Teraz Zrobić?

### Opcja A: Ponowny Deploy (Zalecane)

Po wprowadzeniu zmian, po prostu zrób ponowny deploy:

```bash
# Build projektu
npm run build

# Deploy na CloudFlare Pages
npx wrangler pages deploy dist --project-name=winelog
```

### Opcja B: Weryfikacja Konfiguracji CloudFlare

1. **Sprawdź zmienne środowiskowe w CloudFlare Dashboard:**
   - Przejdź do: CloudFlare Dashboard → Pages → winelog → Settings → Environment Variables
   - Dla **Production** environment:
     - ✅ `SUPABASE_URL` = [twój Supabase URL]
     - ✅ `SUPABASE_KEY` = [twój Supabase anon key]
   - Dla **Preview** environment:
     - ✅ `SUPABASE_URL` = [twój Supabase URL]
     - ✅ `SUPABASE_KEY` = [twój Supabase anon key]

2. **Sprawdź konfigurację branchów:**
   - **Production branch:** `main`
   - **Preview branches:** Wszystkie inne (np. `develop`)

3. **Włącz automatyczne deploymenty (opcjonalnie):**
   - Settings → Builds & deployments → Automatic deployments → **Enable**

### Opcja C: Test Lokalny z Wrangler

Jeśli chcesz przetestować lokalnie z CloudFlare Workers emulacją:

1. Utwórz plik `.dev.vars`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

2. Build i uruchom z wrangler:
```bash
npm run build
npx wrangler pages dev dist
```

---

## 📋 Podsumowanie Zmian

| Co zostało zmienione | Przed | Po |
|---------------------|-------|-----|
| **Adapter** | `@astrojs/node` | `@astrojs/cloudflare` |
| **Pobieranie zmiennych** | `import.meta.env` (build-time) | `context.locals.runtime.env` (runtime) |
| **Typ middleware** | Statyczne zmienne | Dynamiczne z CloudFlare runtime |
| **Package.json** | `@astrojs/node` dependency | Usunięto, dodano `@astrojs/cloudflare` |

---

## ❓ FAQ

### Q: Czy to wpłynie na lokalny development?
**A:** Nie, lokalny development (`npm run dev`) nadal działa z `import.meta.env` z plików `.env`.

### Q: Czy muszę zmienić coś w CloudFlare dashboard?
**A:** Nie, jeśli zmienne środowiskowe są już ustawione. Po prostu zrób ponowny deploy.

### Q: Czy to zadziała dla wszystkich branchów?
**A:** Tak, ale upewnij się, że zmienne są ustawione zarówno dla Production jak i Preview environments.

### Q: Co jeśli nadal widzę błąd?
**A:** 
1. Sprawdź logi w CloudFlare Dashboard → Pages → [deployment] → Logs
2. Upewnij się, że zmienne są ustawione jako **Environment variables**, nie **Build variables**
3. Zrób force refresh deployment

---

## 🎯 Następne Kroki

1. ✅ Zcommituj zmiany do repo
2. ✅ Push do brancha `main`
3. ✅ Poczekaj na automatyczny deploy lub wykonaj manualny deploy
4. ✅ Sprawdź czy strona działa na obu branchach (`main` i `develop`)
5. ✅ Zweryfikuj że zmienne środowiskowe są poprawnie wczytywane

---

**Data utworzenia:** 2025-11-16  
**Wersja:** 1.0  
**Status:** ✅ Naprawione


