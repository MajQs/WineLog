# Architektura UI dla WineLog

## 1. Przegląd struktury UI

WineLog to responsywna aplikacja webowa typu mobile-first, oferująca użytkownikom centralny Dashboard jako hub zarządzania nastawami. Interfejs wykorzystuje układ Drawer + Top-bar:  
• Drawer boczny (widoczny ≥ 768 px, chowany pod ikonę ☰ na mobile) zapewnia globalną nawigację.  
• Top-bar zawiera breadcrumb / back-link, status użytkownika i menu konta.  
Widoki dzielą się na:  
1. Widoki podstawowe (Dashboard, Szczegóły aktywnego nastawu, Archiwum, Szczegóły archiwalnego).  
2. Widoki modalne (Nowy nastaw, Formularze auth, Dialogi potwierdzeń, Błąd sieci).  
3. Strony systemowe (404, 500).  
Komponenty dzielone reużywają bibliotek Shadcn/ui + Tailwind 4, wspierając dostępność (kontrast, focus-ringi, ARIA) i bezpieczeństwo (brak danych wrażliwych w URL, HTTPS).

## 2. Lista widoków

### 2.1 Dashboard
- **Ścieżka:** `/`  
- **Cel:** Szybki przegląd aktywnych nastawów i dostępu do archiwum.  
- **Kluczowe informacje:** lista aktywnych nastawów (cards), licznik archiwum, przycisk "Nowy nastaw".  
- **Kluczowe komponenty:** `BatchListActive`, `BatchCard`, `CTAButtonNewBatch`, `SectionArchive`, `SkeletonDashboard`.  
- **UX/AA/Sec:** skeleton przy ładowaniu (`react-query`), przyciski z dużym touch-targetem, role `list`/`listitem`, linki opisowe ARIA, dane pobierane z GET `/dashboard` (autoryzacja JWT).

### 2.2 Widok nastawu (aktywny)
- **Ścieżka:** `/batches/:id`  
- **Cel:** Zarządzanie konkretnym nastawem poprzez etapy, notatki i edytowanie nazwy.  
- **Kluczowe informacje:** nazwa (inline editable), typ, daty, oś czasu etapów (aktualny, ukończone), timeline notatek, przycisk "Następny etap".  
- **Kluczowe komponenty:** `EditableHeading`, `StageTimeline`, `StageCardCurrent`, `ButtonNextStage`, `NoteForm`, `NoteTimeline`, `Toast`, `ConfirmationDialog`.  
- **UX/AA/Sec:** optimistic PATCH nazwy (`/batches/{id}`), POST advance (`/batches/{id}/stages/advance`) z animacją, walidacja Zod, focus management przy modalu, aria-current na etapie.

### 2.3 Modal „Nowy nastaw”
- **Ścieżka:** `/batches/new` (modal /route)  
- **Cel:** Utworzenie nastawu w 2 kliknięciach.  
- **Kluczowe informacje:** lista szablonów (GET `/templates`), opcjonalne pole nazwy.  
- **Kluczowe komponenty:** `TemplatePickerGrid`, `InputName`, `ButtonCreate`, `FormError`, `LoadingSpinner`.  
- **UX/AA/Sec:** focus-trap modal, ESC close, aria-labelledby, walidacja nazwy ≤ 100 znaków, POST `/batches`, skeleton w razie wolnej sieci.

### 2.4 Lista archiwum
- **Ścieżka:** `/archived`  
- **Cel:** Przegląd zakończonych nastawów.  
- **Kluczowe informacje:** cards z nazwą, typem, datami, rating read-only.  
- **Kluczowe komponenty:** `BatchListArchived`, `BatchCardArchived`, `FilterChips` (future), `SkeletonArchive`.  
- **UX/AA/Sec:** brak paginacji w MVP, role `list`, tab-navigable, GET `/batches?status=archived`.

### 2.5 Widok nastawu (archiwalny)
- **Ścieżka:** `/archived/:id`  
- **Cel:** Podgląd historii i dodanie/edycja oceny.  
- **Kluczowe informacje:** wszystkie notatki, etapy (readonly), kontrolka `StarRating` (editable).  
- **Kluczowe komponenty:** `StarRating`, `NoteTimeline`, `StageTimelineReadOnly`, `ButtonDeleteBatch`.  
- **UX/AA/Sec:** PUT `/batches/{id}/rating` walidowany 1-5, dialog potwierdzeń przed DELETE.

### 2.6 Formularze uwierzytelniania (modal/page)
- **Ścieżka:** `/auth`  
- **Cel:** Rejestracja, logowanie, reset hasła.  
- **Kluczowe informacje:** pola e-mail, hasło, komunikaty błędów.  
- **Kluczowe komponenty:** `AuthTabs`, `AuthForm`, `PasswordMeter`, `FormError`, `SocialLogin (post-MVP)`.  
- **UX/AA/Sec:** Supabase Auth SDK, rate-limit errors (429) toast, aria-live dla błędów, https only.

### 2.7 Strony systemowe
- **404:** `/404` – komunikat i przycisk powrotu.  
- **500:** `/500` – friendly error + opcja reload.  
- **Network error overlay:** komponent `OfflineBanner` wyświetlany globalnie przy braku sieci.

## 3. Mapa podróży użytkownika

1. **Logowanie / Rejestracja** → `/auth` modal.  
2. **Dashboard** (`GET /dashboard`) – user widzi listy.  
3. **Nowy nastaw**: klik CTA → modal `/batches/new` → wybór szablonu → opcjonalna nazwa → `POST /batches` → redirect `/batches/:id`.  
4. **Prowadzenie nastawu**:  
   a. Dodawanie notatek (`POST /batches/{id}/notes`).  
   b. Po ukończeniu etapu → "Następny etap" (`POST /stages/advance`) → UI animuje przeniesienie.  
5. **Zakończenie**: `POST /batches/{id}/complete` (przycisk w menu) → redirect `/archived/:id`.  
6. **Ocena**: użytkownik ustawia gwiazdki (`PUT /rating`).  
7. **Nawigacja**: Drawer/Back pozwala wrócić na Dashboard lub Archiwum w dowolnym momencie.

## 4. Układ i struktura nawigacji

```
<Drawer>
  ├─ Dashboard (/)
  ├─ Archiwum (/archived)
  ├─ Moje konto (modal)
</Drawer>
<TopBar>
  ├─ ☰ (toggle drawer)
  ├─ Breadcrumb / Back
  └─ Avatar ⌵ (logout)
```

• Drawer hidden on mobile, toggled via icon.  
• React Router z lazy routes + Suspense skeletons.  
• Prefetch danych na hover/focus (TanStack Query prefetch).  
• Breadcrumb pokazuje ścieżkę (`Dashboard / Nastaw XYZ`).  
• Deep-links działają (np. bezpośrednio `/batches/123`).

## 5. Kluczowe komponenty

| Komponent | Opis | Re-use |
|-----------|------|--------|
| `BatchCard` | Karta nastawu (nazwa, typ, etap, preview notatki) | Dashboard, Archiwum |
| `BatchListActive` | Lista aktywnych nastawów ze skeletonem | Dashboard |
| `StageTimeline` | Pionowa oś czasu etapów z ikonami statusu | Szczegóły nastawu |
| `NoteTimeline` | Lista notatek w odwrotnej chronologii | Szczegóły obu typów |
| `NoteForm` | RHF + Zod formularz notatki (200 znaków) | Szczegóły aktywnego |
| `StarRating` | 1-5 gwiazdek, `editable` prop | Archiwalny, BatchCard |
| `TemplatePickerGrid` | Kafelki szablonów z lazy image | Modal Nowy nastaw |
| `EditableHeading` | Inline edit nazwy z optimistic PATCH | Szczegóły aktywnego |
| `ButtonNextStage` | CTA do przejścia etapu, disabled offline | Szczegóły aktywnego |
| `Toast` | Globalne powiadomienia sukces/err/429 | Layout root |
| `Skeleton*` | Zestaw placeholderów dla wszystkich list | Global |
| `OfflineBanner` | Sticky info o braku sieci | Global |
| `ConfirmationDialog` | Dialog potwierdzeń (usuwanie, zakończenie) | Wiele miejsc |

---

Architektura UI mapuje wszystkie historyjki z PRD na konkretne widoki i komponenty, wykorzystując udostępnione endpointy API v1. Projekt uwzględnia dostępność (WCAG AA), responsywność (320 px–4K), bezpieczeństwo (Supabase JWT, HTTPS) i obsługę błędów (stany offline, 4xx/5xx, limit 429).
