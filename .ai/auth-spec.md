# Specyfikacja architektury modułu autentykacji i zarządzania kontem użytkownika

## 1. Architektura interfejsu użytkownika (Frontend)

### 1.1 Strony (Astro `./src/pages`)

| Ścieżka | Layout | Opis | Dostęp |
|---------|--------|------|--------|
| `/` | `LandingLayout.astro` | Landing page dla użytkownika niezalogowanego. Przyciski **Zarejestruj się**, **Zaloguj się**. | Public |
| `/register` | `AuthLayout.astro` | Strona rejestracji – osadza komponent `RegisterForm.tsx`. | Public |
| `/login` | `AuthLayout.astro` | Strona logowania – osadza komponent `LoginForm.tsx`. | Public |
| `/forgot-password` | `AuthLayout.astro` | Formularz wysyłający link resetu hasła – `ForgotPasswordForm.tsx`. | Public |
| `/reset-password/[token]` | `AuthLayout.astro` | Ustawienie nowego hasła – `ResetPasswordForm.tsx`. | Public (z tokenem) |
| `/dashboard` | `AppLayout.astro` | Main dashboard - właściwa aplikacja. | Wymagane uwierzytelnienie |
| `/account` | `AppLayout.astro` | Ustawienia konta (podgląd danych, reset hasła, usunięcie konta) – osadza komponent `AccountSettings.tsx`. | Wymagane uwierzytelnienie |

Uwagi:
* **Routing chroniony** – w `src/middleware/index.ts` dodajemy ochronę tras `/dashboard`, `/account`, `/archived`, `/batches` oraz fallback przekierowujący niezalogowanego na `/`.
* **SSR awareness** – Layouty Astro renderowane po stronie serwera; komponenty formularzy React hydratują się tylko na przeglądarce (`client:load`).

### 1.2 Layouty

1. `AuthLayout.astro`
   * Minimalny układ z panelem formularza pośrodku.
   * Ładuje ogólne style Tailwind (`prose`, `bg-neutral-50`, itp.).
   * Nie wymaga sesji.
2. `AppLayout.astro`
   * Zawiera główną nawigację, dropdown użytkownika (email, **Wyloguj**).
   * Ładuje `AuthProvider.tsx` w trybie `client:only` aby przekazać kontekst sesji potomnym React-owym.

### 1.3 Komponenty React (`./src/components`)

| Plik | Rola | Kluczowe props / kontekst |
|------|------|--------------------------|
| `AuthProvider.tsx` | Owija aplikację w kontekst Supabase (`createClientComponentClient`) i udostępnia `user`, `session`, `signOut()` | – |
| `LoginForm.tsx` | Formularz e-mail + hasło. Wywołuje `supabase.auth.signInWithPassword`. | `redirectTo?` |
| `RegisterForm.tsx` | Rejestracja. Wywołuje `supabase.auth.signUp`. | – |
| `ForgotPasswordForm.tsx` | Wysyła e-mail resetu przez `supabase.auth.resetPasswordForEmail`. | – |
| `ResetPasswordForm.tsx` | Ustawia nowe hasło przez `supabase.auth.updateUser({ password })`. | `token` (z URL) |
| `ProtectedRoute.tsx` | HOC/osłona client-side dla podkomponentów wymagających zalogowania; fallback skeleton. | – |
| `AccountSettings.tsx` | Widok ustawień konta. Pokazuje e-mail, datę rejestracji, przycisk **Usuń konto**. | – |
| `DeleteAccountForm.tsx` | Formularz potwierdzający usunięcie konta (pole hasło). | – |

Walidacja formularzy za pomocą biblioteki **Zod** + `@hookform/resolvers/zod`:
* Reguły haseł (min 8 znaków, wielka, mała, cyfra, znak specjalny).
* RFC5322 dla e-mail.
* Błędy wyświetlane w języku PL poniżej pól; globalne alerty toastem (Shadcn `Toast`).

### 1.4 Scenariusze użytkownika

1. **Rejestracja**
   * Użytkownik wprowadza dane → walidacja klient → POST `/api/auth/register` (SSR) lub bezpośrednio Supabase klient.
   * Po sukcesie: automatyczne zalogowanie, przekierowanie do `/dashboard`.
2. **Logowanie**
   * Analogicznie, przekierowanie do `redirectTo` lub `/dashboard`.
3. **Reset hasła (link)**
   * `ForgotPasswordForm` wysyła link (Supabase handle). Po kliknięciu token trafia do `reset-password/[token]`.
4. **Soft verification e-mail**
   * Po rejestracji banner w `AppLayout` informuje o potrzebie weryfikacji (jeśli `user.email_confirmed_at` null).
5. **Wylogowanie**
   * Dropdown → `supabase.auth.signOut` → redirect `/`.
5. **Usunięcie konta**
   * `AccountSettings` → otwiera `DeleteAccountForm` → POST `/api/auth/delete-account`.
   * Po sukcesie: wylogowanie (`supabase.auth.signOut`) i redirect `/` z toastem „Konto zostało usunięte.”.

## 2. Logika backendowa (Astro `src/pages/api`)

### 2.1 Endpointy

| Metoda | Path | Opis |
|--------|------|------|
| `POST` | `/api/auth/register` | Wrapper dla `supabase.auth.signUp` + walidacja Zod. |
| `POST` | `/api/auth/login` | Wrapper dla `supabase.auth.signInWithPassword` (opcjonalnie – można robić client‐side). |
| `POST` | `/api/auth/reset-password` | Ustawienie nowego hasła – wymaga tokenu i hasła. |
| `POST` | `/api/auth/logout` | Serwerowe unieważnienie sesji + usunięcie cookie. |
| `POST` | `/api/auth/delete-account` | Weryfikuje hasło, usuwa użytkownika przez `supabase.auth.admin.deleteUser` oraz wszystkie dane domenowe. |

Decyzja: część operacji może być wykonywana w przeglądarce (Supabase JS), ale endpointy serwerowe pozwalają później łatwo przejść na własny backend bez refaktoryzacji frontu.

### 2.2 Schemat danych

Brak dodatkowych tabel (Supabase zarządza tabelą `auth.users`). Nie ingerujemy w tę tabelę – relacje domenowe (nastawy) będą łączyć się z `auth.users.id` (UUID) tak jak dotychczas.

### 2.3 Walidacja i obsługa wyjątków

* Wszystkie endpointy – schematy Zod.
* Błąd walidacji → HTTP 422 + `{ error: "Nieprawidłowe dane." }`.
* Błąd uwierzytelniania → HTTP 401/400 z komunikatem PL.
* Niezależne logowanie błędów serwerowych do `console.error` lub monitoringu.

### 2.4 Renderowanie server-side

* `AuthLayout.astro` i `AppLayout.astro` wykorzystują helpers `getSupabase` (po stronie server) aby prefetchować `user` i wstrzyknąć w `props`.
* Konfiguracja w `astro.config.mjs` (`output: "server"`) już umożliwia SSR – brak dodatkowych zmian.

## 3. System autentykacji (Supabase Auth)

### 3.1 Konfiguracja Supabase

* Typ projektu: e-mail + hasło.
* Parametry:
  * Link potwierdzający rejestrację ważny 7 dni.
  * Link resetu hasła ważny 1 h.
  * Soft verification – `auth.emailConfirm` ustawione na `optional` (domyślny behaviour Supabase spełnia wymagania).
* Polityka hasła: enforced po stronie frontendu + backend (**Supabase** nie wymusza; walidujemy przed wysłaniem).

### 3.2 Sesja i przechowywanie

* Przeglądarka: `supabase-js` zarządza `auth` cookie (`sb:token`) – trwałe `localStorage` + auto-refresh.
* Serwer: middleware odczytuje cookie i tworzy Supabase server client (`createRouteHandlerClient`).
* Czas życia sesji: 30 dni (ustawienie `JWT exp` w Supabase + `auto refresh token`).

### 3.3 Bezpieczeństwo

* Wszystkie formularze anti-CSRF: Supabase cookie jest `httpOnly`; dodatkowo nagłówek `Origin`/`SameSite=Lax` – spełnia standard.
* Rate limiting na endpointach `/api/auth/*` (middleware `@lib/rateLimit.ts`).
* Brak przekazywania hasła serwerowi po resecie (token + hasło, przekazywane przez HTTPS).

---

## Załącznik A – Struktura plików

```
src/
 ├─ layouts/
 │   ├─ AuthLayout.astro
 │   └─ AppLayout.astro
 ├─ pages/
 │   ├─ index.astro
 │   ├─ login.astro
 │   ├─ register.astro
 │   ├─ forgot-password.astro
 │   ├─ reset-password/[token].astro
 │   └─ api/
 │       └─ auth/
 │           ├─ register.ts
 │           ├─ login.ts
 │           ├─ reset-password.ts
 │           └─ logout.ts
 ├─ middleware/index.ts
 ├─ components/
 │   ├─ AuthProvider.tsx
 │   ├─ ProtectedRoute.tsx
 │   └─ forms/
 │       ├─ LoginForm.tsx
 │       ├─ RegisterForm.tsx
 │       ├─ ForgotPasswordForm.tsx
 │       └─ ResetPasswordForm.tsx
 └─ lib/
     ├─ supabaseClient.ts
     └─ rateLimit.ts
```

## Załącznik B – Stany błędów i komunikaty (PL)

| Kod | Kontekst | Komunikat |
|-----|----------|-----------|
| 400 | Logowanie | "Nieprawidłowy e-mail lub hasło." |
| 422 | Walidacja formularza | "Nieprawidłowe dane wejściowe." |
| 401 | Sesja wygasła | "Twoja sesja wygasła. Zaloguj się ponownie." |
| 404 | Link resetu | "Link wygasł lub został już użyty." |
| 500 | Błąd serwera | "Wystąpił błąd. Spróbuj ponownie." |

## Kluczowe wnioski

* **Separacja odpowiedzialności** – Astro obsługuje SSR, routing i middleware; React mikro-komponenty odpowiadają za walidację, interakcje i bezpośrednie wywołania Supabase.
* **Minimalna ingerencja w istniejący kod** – nowy moduł znajduje się w wyizolowanym katalogu `pages/api/auth` i `components/forms`.
* **Skalowalność** – użycie Supabase pozwala na późniejszą migrację do własnego serwera poprzez zachowanie spójnych interfejsów REST.
* **Zgodność z PRD** – spełnione wszystkie historyjki US-000, US-001, US-002, US-003, US-006; soft verification; wiadomości PL.
* **Bezpieczeństwo & UX** – token auto-refresh, guard na trasie, pełne komunikaty i walidacja po obu stronach.
* **Nowe**: endpoint `/api/auth/delete-account` spełnia US-005 (usunięcie konta).
