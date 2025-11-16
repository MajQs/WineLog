# Troubleshooting: GitHub Actions - "Project not found" Error

## Problem
Lokalnie komenda `npx wrangler pages deploy dist --project-name=winelog` działa, ale w GitHub Actions otrzymujesz błąd:
```
ERROR: A request to the Cloudflare API (/accounts/***/pages/projects/winelog) failed.
Project not found. The specified project name does not match any of your existing projects. [code: 8000007]
```

## Przyczyny

1. **Nazwa projektu jest inna** - Projekt w Cloudflare ma inną nazwę niż "winelog"
2. **Brak uprawnień API Token** - Token nie ma dostępu do projektu
3. **Niepoprawny Account ID** - Secret używa ID innego konta

---

## Rozwiązanie

### Krok 1: Znajdź dokładną nazwę projektu w Cloudflare

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Przejdź do **Workers & Pages**
3. Znajdź swój projekt (ten, który utworzyłeś z GitHub)
4. **Skopiuj dokładną nazwę projektu** z listy

**Przykłady możliwych nazw**:
- `winelog` ✅ (jeśli tak się nazywa)
- `WineLog` ❌ (case-sensitive!)
- `winelog-abc` ❌ (jeśli Cloudflare dodało sufiks)
- `122d31ad` ❌ (jeśli to tylko subdomena)

**WAŻNE**: Nazwa projektu to NIE subdomena (np. `122d31ad.winelog.pages.dev`), ale nazwa wyświetlana w liście projektów.

---

### Krok 2: Zaktualizuj nazwę projektu w workflow

Jeśli nazwa projektu w Cloudflare jest **inna** niż "winelog", zaktualizuj `.github/workflows/master.yml`:

**Przed**:
```yaml
command: pages deploy dist --project-name=winelog
```

**Po** (zastąp `ACTUAL_PROJECT_NAME` prawdziwą nazwą):
```yaml
command: pages deploy dist --project-name=ACTUAL_PROJECT_NAME
```

---

### Krok 3: Zweryfikuj uprawnienia API Token

#### Problem z uprawnieniami
GitHub Actions używa `CLOUDFLARE_API_TOKEN`, który może:
- Nie mieć uprawnień do Cloudflare Pages
- Być powiązany z innym kontem Cloudflare

#### Jak utworzyć poprawny token

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Kliknij na avatar (prawy górny róg) → **My Profile**
3. Przejdź do zakładki **API Tokens**
4. Kliknij **Create Token**

#### Opcja A: Użyj szablonu (ZALECANE)
1. Znajdź szablon **"Edit Cloudflare Workers"**
2. Kliknij **Use template**
3. W sekcji **Account Resources**:
   - Include → **Specific account** → wybierz swoje konto
4. W sekcji **Zone Resources**:
   - Include → **All zones from an account** → wybierz swoje konto
5. Kliknij **Continue to summary**
6. Kliknij **Create Token**
7. **Skopiuj token** (będzie pokazany tylko raz!)

#### Opcja B: Utwórz custom token
1. Kliknij **Create Custom Token**
2. Nadaj nazwę: `GitHub Actions - WineLog`
3. **Permissions** (dodaj następujące):
   - `Account` → `Cloudflare Pages` → `Edit`
   - `Account` → `Account Settings` → `Read`
4. **Account Resources**:
   - Include → **Specific account** → wybierz swoje konto
5. **IP Address Filtering**: (zostaw puste)
6. Kliknij **Continue to summary**
7. Kliknij **Create Token**
8. **Skopiuj token**

---

### Krok 4: Zaktualizuj GitHub Secrets

1. Przejdź do swojego repozytorium na GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Znajdź secret **`CLOUDFLARE_API_TOKEN`**
4. Kliknij **Update** (lub **Add** jeśli nie istnieje)
5. Wklej **nowy token** z Kroku 3
6. Kliknij **Update secret**

---

### Krok 5: Zweryfikuj Account ID

#### Jak znaleźć Account ID

1. Zaloguj się do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. W lewym menu kliknij **Workers & Pages**
3. Po prawej stronie zobaczysz: **Account ID: abc123def456...**
4. **Skopiuj ten ID**

**Alternatywnie**:
- Przejdź do dowolnej domeny w Cloudflare
- W prawym panelu znajdziesz **Account ID**

#### Zaktualizuj secret w GitHub

1. W repozytorium: **Settings** → **Secrets and variables** → **Actions**
2. Znajdź **`CLOUDFLARE_ACCOUNT_ID`**
3. Kliknij **Update**
4. Wklej **Account ID** z Cloudflare
5. Kliknij **Update secret**

---

### Krok 6: Przetestuj ponownie

Po zaktualizowaniu secrets:

1. Przejdź do **Actions** w GitHub
2. Wybierz workflow **Deploy to Cloudflare Pages**
3. Kliknij **Run workflow**
4. Wybierz branch `main` (lub `develop`)
5. Kliknij **Run workflow** (zielony przycisk)

---

## Weryfikacja poprawności

### Jak sprawdzić czy wszystko jest OK?

#### 1. Nazwa projektu
W Cloudflare Dashboard → Workers & Pages → nazwa projektu powinna **dokładnie pasować** do tej w workflow.

#### 2. API Token
Po utworzeniu tokena, powinieneś zobaczyć:
```
✓ Token created successfully
- Permissions: Account - Cloudflare Pages: Edit
```

#### 3. Account ID
Format: `abc123def456...` (32 znaki, alfanumeryczne)

---

## Alternatywne rozwiązanie: Automatyczne wykrywanie projektu

Jeśli nadal masz problemy, możesz pozwolić Wrangler automatycznie wykryć projekt:

### Opcja 1: Utwórz plik wrangler.toml

Utwórz plik `wrangler.toml` w głównym katalogu projektu:

```toml
name = "winelog"
compatibility_date = "2025-11-16"
pages_build_output_dir = "dist"
```

Następnie w workflow zmień:
```yaml
# Przed:
command: pages deploy dist --project-name=winelog

# Po:
command: pages deploy dist
```

### Opcja 2: Użyj workflow z Cloudflare Direct Upload

Alternatywnie, możesz użyć bezpośredniego uploadu bez specyfikowania nazwy projektu.

---

## Najczęstsze błędy

### ❌ "Project not found"
- **Przyczyna**: Nazwa projektu nie pasuje
- **Rozwiązanie**: Sprawdź dokładną nazwę w Cloudflare Dashboard

### ❌ "Authentication error"
- **Przyczyna**: Token nie ma uprawnień lub wygasł
- **Rozwiązanie**: Utwórz nowy token z uprawnieniami "Cloudflare Pages: Edit"

### ❌ "Account ID mismatch"
- **Przyczyna**: Niepoprawny Account ID
- **Rozwiązanie**: Skopiuj Account ID z Cloudflare Dashboard

---

## Debugging

### Jak zobaczyć szczegółowe logi w GitHub Actions?

1. W zakładce **Actions** → kliknij na failed workflow
2. Kliknij na job **Deploy to Cloudflare Pages**
3. Rozwiń krok **Deploy to Cloudflare Pages**
4. Szukaj linii z błędem (zazwyczaj na końcu)

### Przykładowy log z poprawnym deploymentem:

```
✨ Deployment complete! Take a peek over at https://abc123.winelog.pages.dev
```

### Przykładowy log z błędem:

```
ERROR: A request to the Cloudflare API (/accounts/***/pages/projects/winelog) failed.
Project not found. [code: 8000007]
```

---

## Podsumowanie kroków

1. ✅ Sprawdź nazwę projektu w Cloudflare Dashboard
2. ✅ Zaktualizuj `--project-name=` w workflow jeśli nazwa jest inna
3. ✅ Utwórz nowy API Token z uprawnieniami "Cloudflare Pages: Edit"
4. ✅ Zaktualizuj `CLOUDFLARE_API_TOKEN` w GitHub Secrets
5. ✅ Zweryfikuj `CLOUDFLARE_ACCOUNT_ID` w GitHub Secrets
6. ✅ Uruchom workflow ponownie

Jeśli wszystkie kroki są wykonane poprawnie, deployment powinien zadziałać! 🚀

