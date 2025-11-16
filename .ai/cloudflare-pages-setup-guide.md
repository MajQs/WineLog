# Jak poprawnie utworzyć projekt WineLog w Cloudflare Pages

## Problem
Cloudflare próbuje użyć `wrangler deploy` (dla Workers) zamiast `wrangler pages deploy` (dla Pages).

## Rozwiązanie: Utwórz projekt jako Pages

### Krok 1: Usuń obecny projekt (jeśli został utworzony jako Worker)
1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Przejdź do **Workers & Pages**
3. Znajdź projekt **winelog** i kliknij na niego
4. Przejdź do **Settings** → **Delete Project**

### Krok 2: Utwórz nowy projekt jako Pages

1. W Cloudflare Dashboard, przejdź do **Workers & Pages**
2. Kliknij **Create application**
3. Wybierz kartę **Pages**
4. Kliknij **Connect to Git**

### Krok 3: Połącz z GitHub

1. Autoryzuj Cloudflare do dostępu do GitHub (jeśli jeszcze nie zrobiłeś)
2. Wybierz repozytorium **WineLog**
3. Kliknij **Begin setup**

### Krok 4: Konfiguracja Build & Deployment

Wypełnij następujące pola:

**Project name**: `winelog` (lub wybierz swoją nazwę)

**Production branch**: `main`

**Framework preset**: `Astro` (Cloudflare automatycznie wykryje i ustawi odpowiednie wartości)

**Build command**:
```bash
npm run build
```

**Build output directory**:
```
dist
```

**Root directory (advanced)**: _(zostaw puste)_

### Krok 5: Dodaj zmienne środowiskowe

W sekcji **Environment variables** dodaj:

| Variable name | Value | Environment |
|--------------|-------|-------------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | Production |
| `SUPABASE_KEY` | `your-anon-key` | Production |
| `NODE_VERSION` | `22.14.0` | Production |

**WAŻNE**: Te zmienne będą używane zarówno w build time, jak i runtime.

### Krok 6: Deploy

1. Kliknij **Save and Deploy**
2. Cloudflare automatycznie zbuduje i wdroży aplikację
3. Po zakończeniu otrzymasz URL do aplikacji

---

## Weryfikacja poprawnego projektu

Aby upewnić się, że projekt jest typu Pages:

1. W Cloudflare Dashboard przejdź do **Workers & Pages**
2. Twój projekt **winelog** powinien mieć:
   - Ikonę z napisem **"Pages"** (nie "Worker")
   - Sekcję **Deployments** z listą deploymentów
   - Możliwość podglądu poprzez URL typu: `https://winelog.pages.dev`

---

## Różnice między Workers a Pages

| Feature | Workers | Pages |
|---------|---------|-------|
| Typ | Backend workers/API | Full-stack aplikacje (SSR, SSG) |
| Entry point | `src/index.ts` | `dist/` (zbudowane pliki) |
| Command | `wrangler deploy` | `wrangler pages deploy dist` |
| Astro SSR | ❌ Nie wspiera | ✅ Pełne wsparcie |
| Build command | Nie ma | `npm run build` |

---

## Po utworzeniu projektu jako Pages

### Automatyczny deployment z GitHub
Po poprawnym skonfigurowaniu projektu w Cloudflare:
- Każdy push do brancha `main` będzie automatycznie triggerował deployment
- Pull requesty będą miały preview deployments

### Ręczny deployment przez GitHub Actions
Możesz również używać workflow `.github/workflows/master.yml`:
1. Przejdź do **Actions** w GitHub
2. Wybierz **Deploy to Cloudflare Pages**
3. Kliknij **Run workflow**

---

## Troubleshooting

### "Build failed" podczas pierwszego deploymentu

**Sprawdź**:
- Czy `NODE_VERSION` jest ustawiona na `22.14.0`
- Czy `SUPABASE_URL` i `SUPABASE_KEY` są poprawnie skonfigurowane
- Czy build command to `npm run build` (nie `npm ci && npm run build`)

### "Runtime error" po deploymencie

**Sprawdź**:
- Czy zmienne środowiskowe są ustawione dla środowiska **Production**
- Czy adapter w `astro.config.mjs` to `@astrojs/cloudflare`
- Logi w Cloudflare Dashboard → Pages → winelog → Functions → Logs

---

## Alternatywne rozwiązanie: Direct Upload (bez GitHub)

Jeśli chcesz deployować lokalnie bez łączenia z GitHub:

```bash
# 1. Zainstaluj Wrangler globalnie
npm install -g wrangler

# 2. Zaloguj się do Cloudflare
npx wrangler login

# 3. Zbuduj projekt
npm run build

# 4. Deploy do Pages
npx wrangler pages deploy dist --project-name=winelog
```

To jest dokładnie to, co robi GitHub Actions workflow.


