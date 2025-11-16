# Jak poprawnie skonfigurować zmienne środowiskowe w Cloudflare Pages

## Problem
Po deploymencie przez GitHub Actions aplikacja zwraca błąd:
```
Error: Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_KEY environment variables.
```

Mimo że zmienne są dodane w GitHub Secrets i w Cloudflare.

---

## Przyczyna

W Cloudflare Pages istnieją **DWA różne miejsca** na zmienne środowiskowe:

### 1. **Variables and Secrets** (dla Build)
- **Lokalizacja**: Settings → Variables and Secrets
- **Kiedy używane**: Podczas `npm run build` w Cloudflare
- **Dostępne przez**: `import.meta.env.*` w kodzie
- **Cel**: Zmienne potrzebne podczas kompilacji

### 2. **Environment variables** (dla Runtime)
- **Lokalizacja**: Settings → Environment variables
- **Kiedy używane**: Gdy użytkownik odwiedza stronę (runtime)
- **Dostępne przez**: `context.runtime.env.*` w middleware
- **Cel**: Zmienne potrzebne gdy aplikacja działa

## ❌ Co jest źle

Ze screenshota widzę, że masz zmienne w **"Variables and Secrets"**, ale aplikacja Astro SSR potrzebuje ich w **"Environment variables"** dla runtime!

---

## ✅ Rozwiązanie krok po kroku

### Krok 1: Dodaj zmienne jako Environment Variables w Cloudflare

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Przejdź do **Workers & Pages**
3. Kliknij na swój projekt (np. **winelog**)
4. Kliknij zakładkę **Settings**
5. W menu po lewej wybierz **"Environment variables"** 
   - ⚠️ **NIE "Variables and Secrets"!**

6. W sekcji **Production (current)**:

#### Dodaj SUPABASE_URL:
- Kliknij **"Add variable"** (przycisk po prawej)
- **Variable name**: `SUPABASE_URL`
- **Value**: `https://your-project.supabase.co` (zastąp swoim)
- **Type**: `Text` (nie Secret)
- **Environment**: Upewnij się, że jest zaznaczone **"Production"**
- Kliknij **"Save"**

#### Dodaj SUPABASE_KEY:
- Kliknij **"Add variable"** ponownie
- **Variable name**: `SUPABASE_KEY`
- **Value**: `eyJ...` (twój anon/public key)
- **Type**: `Text` lub `Secret` (zalecam Secret dla kluczy)
- **Environment**: **"Production"**
- Kliknij **"Save"**

### Krok 2: Zweryfikuj konfigurację

Po dodaniu zmiennych, w sekcji **Environment variables** → **Production** powinieneś zobaczyć:

```
Production (current)
├─ SUPABASE_URL = https://xxx.supabase.co
└─ SUPABASE_KEY = ey*** (jeśli Secret, będzie ukryte)
```

### Krok 3: Wykonaj redeploy

**WAŻNE**: Zmienne środowiskowe są stosowane tylko do **nowych deploymentów**!

#### Opcja A: Przez GitHub Actions (ZALECANE)
1. Commituj zmiany w workflow (jeśli zrobiłeś)
```bash
git add .github/workflows/master.yml
git commit -m "Fix: Use CLOUDFLARE_PROJECT_NAME from secrets"
git push origin develop
```

2. Zmerguj do main (jeśli pracujesz na develop)
```bash
git checkout main
git merge develop
git push origin main
```

3. Uruchom workflow w GitHub
   - **Actions** → **Deploy to Cloudflare Pages** → **Run workflow**

#### Opcja B: Przez Cloudflare Dashboard
1. W projekcie, przejdź do zakładki **Deployments**
2. Znajdź ostatni deployment
3. Kliknij **"..." (trzy kropki)** → **"Retry deployment"**

---

## 🎯 Dlaczego to jest potrzebne?

### Przepływ zmiennych środowiskowych w Cloudflare Pages

```
GitHub Actions Deployment
         ↓
    1. BUILD PHASE
       - Używa: Variables and Secrets (z Cloudflare)
       - Używa: env: z GitHub Actions workflow
       - Dostęp: import.meta.env.*
       - Efekt: dist/ folder
         ↓
    2. DEPLOY PHASE
       - Przesyła: dist/ do Cloudflare
       - NIE przesyła: zmiennych środowiskowych!
         ↓
    3. RUNTIME PHASE (gdy user odwiedza stronę)
       - Używa: Environment variables (z Cloudflare)
       - Dostęp: context.runtime.env.*
       - Middleware używa tych zmiennych!
```

### Co zmieniłem w kodzie

W `src/middleware/index.ts`:
```typescript
// Kod próbuje najpierw pobrać z runtime.env (Cloudflare Pages)
const supabaseUrl = context.runtime?.env?.SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseKey = context.runtime?.env?.SUPABASE_KEY || import.meta.env.SUPABASE_KEY;

// Jeśli nie ma żadnej zmiennej, rzuca błąd
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase configuration missing...");
}
```

Dlatego **MUSISZ** mieć zmienne w **Environment variables** w Cloudflare!

---

## 📊 Podsumowanie konfiguracji

### GitHub Secrets (Repository secrets)
```
✅ CLOUDFLARE_API_TOKEN      - dla deploymentu
✅ CLOUDFLARE_ACCOUNT_ID     - dla deploymentu
✅ CLOUDFLARE_PROJECT_NAME   - nazwa projektu
✅ SUPABASE_URL             - dla build phase
✅ SUPABASE_KEY             - dla build phase
```

### Cloudflare: Environment variables (Production)
```
✅ SUPABASE_URL             - dla runtime!
✅ SUPABASE_KEY             - dla runtime!
```

### Cloudflare: Variables and Secrets (opcjonalnie)
```
⚠️  Można, ale NIE SĄ wymagane dla runtime
    Te są używane tylko gdy budujesz bezpośrednio w Cloudflare
```

---

## 🔍 Jak zweryfikować czy działa?

### Po redeployment:

1. **Otwórz stronę**: `https://your-project.pages.dev`
2. **Strona powinna się załadować** bez błędu 500 ✅
3. **Sprawdź logi w Cloudflare**:
   - Dashboard → Workers & Pages → winelog → **Functions** (lub **Logs**)
   - Nie powinno być błędu "Supabase configuration missing"

### Jeśli nadal jest błąd 500:

1. **Sprawdź logi w Cloudflare**:
   - Workers & Pages → winelog → Functions → View logs
   - Szukaj dokładnego błędu

2. **Sprawdź czy zmienne są w Production**:
   - Settings → Environment variables
   - Upewnij się że są w **"Production (current)"**, nie "Preview"

3. **Sprawdź czy wykonałeś redeploy**:
   - Zmienne nie są stosowane do starych deploymentów
   - Musisz wykonać nowy deployment!

---

## 📝 Screenshot verification checklist

### ✅ Poprawna konfiguracja w Cloudflare:

```
Settings → Environment variables → Production (current)

Variable name          Value                  Environment
─────────────────────────────────────────────────────────
SUPABASE_URL          https://xxx.supabase.co  Production
SUPABASE_KEY          ey***                    Production
```

### ❌ Niepoprawna konfiguracja (to co masz teraz):

```
Settings → Variables and Secrets

Type        Name              Value
────────────────────────────────────────
Plaintext   SUPABASE_KEY      ey***
Plaintext   SUPABASE_URL      https://xxx.supabase.co
```

**Problem**: Te zmienne są używane tylko podczas BUILD w Cloudflare, nie w RUNTIME!

---

## 🚨 Najczęstsze błędy

### 1. Zmienne w złej sekcji
- **Błąd**: Dodanie zmiennych w "Variables and Secrets"
- **Poprawka**: Dodaj w "Environment variables"

### 2. Nie wykonano redeployment
- **Błąd**: Dodanie zmiennych, ale nie wykonano nowego deploymentu
- **Poprawka**: Retry deployment lub push do GitHub

### 3. Zmienne w Preview zamiast Production
- **Błąd**: Zmienne są dla środowiska "Preview"
- **Poprawka**: Dodaj dla "Production"

### 4. Literówka w nazwie zmiennej
- **Błąd**: `SUPABASE_URI` zamiast `SUPABASE_URL`
- **Poprawka**: Użyj dokładnie `SUPABASE_URL` i `SUPABASE_KEY`

---

## 💡 Dodatkowe wskazówki

### Czy mogę usunąć zmienne z "Variables and Secrets"?

**TAK** - jeśli budujesz przez GitHub Actions, zmienne w build phase są pobierane z GitHub Secrets (workflow), nie z Cloudflare Variables and Secrets.

Możesz bezpiecznie usunąć zmienne z "Variables and Secrets" w Cloudflare, o ile masz je w:
1. GitHub Secrets (dla build przez GitHub Actions)
2. Cloudflare Environment variables (dla runtime)

### Czy potrzebuję NODE_VERSION?

**Opcjonalnie** - Cloudflare automatycznie wykryje wersję Node.js z `.nvmrc`, ale możesz dodać dla pewności:
- Variable name: `NODE_VERSION`
- Value: `22.14.0`
- Environment: Production

---

## 🎉 Po poprawnej konfiguracji

1. ✅ Aplikacja działa bez błędów 500
2. ✅ Możesz się zalogować
3. ✅ Dashboard się ładuje
4. ✅ Wszystkie funkcje działają poprawnie

Jeśli nadal masz problemy, sprawdź logi w Cloudflare Dashboard → Functions → Logs i podeślij mi dokładny komunikat błędu.

