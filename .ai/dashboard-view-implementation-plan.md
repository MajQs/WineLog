# Plan implementacji widoku Dashboard

## 1. Przegląd
Dashboard to główny ekran aplikacji WineLog. Zapewnia użytkownikowi szybki wgląd w aktywne nastawy, liczbę zarchiwizowanych nastawów oraz możliwość utworzenia nowego nastawu. Widok musi być responsywny, zgodny z polityką accessibility (ARIA) oraz szybki – poniżej 3 s ładowania na 4G.

## 2. Routing widoku
- Ścieżka: `/`
- Plik strony: `src/pages/index.astro`
- Ochrona: wymaga aktywnej sesji (middleware `auth.guard`) – w razie braku przekierowanie do `/login`.

## 3. Struktura komponentów
```
IndexPage (Astro)
 ├── Layout (Astro)
 └── DashboardView (React)
      ├── HeaderBar               (opcjonalnie, nawigacja główna)
      ├── CTAButtonNewBatch       (shadcn/ui Button)
      ├── BatchListActive         (React)
      │     ├── BatchCard         (React ‑ jeden per nastaw)
      │     └── EmptyState        (React) – brak aktywnych
      ├── SectionArchive          (React)
      ├── SkeletonDashboard       (React) – w trakcie ładowania
      └── ErrorState              (React) – błąd sieciowy/serwera
```

## 4. Szczegóły komponentów
### CTAButtonNewBatch
- **Opis:** Wyświetla przycisk „Nowy nastaw”.
- **Elementy:** `<Button as={Link} href="/batches/new" variant="default" size="lg" />`
- **Zdarzenia:** `onClick` – nawigacja do formularza tworzenia nastawu.
- **Walidacja:** brak (statyczny link).
- **Typy:** brak niestandardowych.
- **Propsy:** opcjonalny `className`.

### BatchListActive
- **Opis:** Sekcja listy aktywnych nastawów.
- **Elementy:** kontener `ul[role=list]`; wewnątrz mapowanie `BatchCard`.
- **Zdarzenia:** brak własnych – propaguje kliknięcia z `BatchCard`.
- **Walidacja:** wyświetla `EmptyState`, gdy `batches.length === 0`.
- **Typy:** `DashboardBatchDto[]`.
- **Propsy:** `batches: DashboardBatchDto[]`.

### BatchCard
- **Opis:** Karta pojedynczego nastawu z podstawowymi danymi.
- **Elementy:** `<li>` zawierający: nazwę, typ, datę rozpoczęcia, current_stage.badge, latest_note.preview.
- **Zdarzenia:** kliknięcie całej karty (`onClick`) → przejście do `/batches/{id}`.
- **Walidacja:**
  - Tekst nazwy: max 100 znaków (obcięcie z `…`).
  - Data: format `DD.MM.YYYY` – użyć `date-fns`.
- **Typy:** `DashboardBatchDto`.
- **Propsy:** `batch: DashboardBatchDto`.

### SectionArchive
- **Opis:** Link/sektor z liczbą zarchiwizowanych nastawów.
- **Elementy:** prosty panel z licznikiem i linkiem `href="/archive"`.
- **Zdarzenia:** kliknięcie → nawigacja.
- **Walidacja:** brak.
- **Typy:** `archivedCount: number`.
- **Propsy:** `count: number`.

### SkeletonDashboard
- **Opis:** Placeholder ładowania – shimmer kart i przycisku.
- **Elementy:** komponenty skeleton z `shadcn/ui` + Tailwind animacje.
- **Zdarzenia:** brak.
- **Walidacja:** n/a.
- **Typy / Propsy:** brak.

### ErrorState
- **Opis:** Wyświetla komunikat błędu i przycisk ponownego załadowania.
- **Elementy:** ikona ⚠️, tekst „Wystąpił błąd. Spróbuj ponownie.”, `<Button onClick={refetch} />`.
- **Zdarzenia:** `onClick` → `queryClient.invalidateQueries('dashboard')`.
- **Walidacja:** brak.
- **Typy / Propsy:** `onRetry: () => void`.

## 5. Typy
```ts
// Istniejące (z src/types.ts)
export interface DashboardDto {
  active_batches: DashboardBatchDto[];
  archived_batches_count: number;
}

// ViewModel – płaskie dane do BatchCard (opcjonalne)
export interface BatchCardVM {
  id: string;
  name: string;
  type: BatchType;
  startedAtHuman: string; // sformatowana data
  currentStageName: string;
  currentStagePosition: number;
  latestNoteAction?: string;
  latestNoteDateHuman?: string;
}
```
Transformacja `DashboardBatchDto → BatchCardVM` wykonana w hooku `useDashboardData`.

## 6. Zarządzanie stanem
- **Biblioteka:** TanStack React Query 5.
- **Hook:** `useDashboardData()`
  - `queryKey: ['dashboard']`
  - `queryFn: () => fetchDashboard()` – wywołuje `GET /api/v1/dashboard`.
  - Zwraca `{ data, isLoading, isError, refetch }`.
  - Memoizuje transformację do `BatchCardVM[]`.
- **Lokalny stan UI:** brak rozbudowanego – wyłącznie `isSidebarOpen` (mobile), zarządzany w komponencie nadrzędnym.

## 7. Integracja API
- **Metoda:** `GET /api/v1/dashboard`.
- **Nagłówki:** `Authorization: Bearer {access_token}` dodawany globalnym interceptorem `fetchWithAuth`.
- **Response 200:** `DashboardDto` (patrz typy).
- **Obsługa kodów:**
  - `401` → `logout()` i przekierowanie do `/login`.
  - `5xx / network` → stan `isError`.

## 8. Interakcje użytkownika
| Akcja | Rezultat |
|-------|----------|
| Klik „Nowy nastaw” | Przejście do kreatora `/batches/new` |
| Klik `BatchCard` | Przejście do `/batches/{id}` |
| Klik „Archiwum” | Przejście do `/archive` |
| Brak internetu | Toast „Brak połączenia z internetem…” |
| Błąd serwera | Widok `ErrorState` + możliwość retry |

## 9. Warunki i walidacja
- Jeśli `active_batches.length === 0` → render `EmptyState` z komunikatem i CTA „Nowy nastaw”.
- Nazwa > 100 znaków → obcięcie + `…` (UI), backend już waliduje.
- `latest_note` może być `null` → ukryj preview.
- Data rozpoczęcia i notatki formatowane za pomocą `date-fns` (`format(new Date(date), 'dd.MM.yyyy')`).

## 10. Obsługa błędów
1. **Błąd sieci / 5xx** – wyświetl `ErrorState`.
2. **401 Unauthorized** – wywołaj `logout()` w `fetchWithAuth` i przekieruj.
3. **Timeout (fetch abort >10 s)** – toast z komunikatem timeout + przycisk retry.
4. **Offline** – globalny listener `navigator.onLine`; przy offline banner „Brak połączenia…”.

## 11. Kroki implementacji
1. **Routing & page setup** – utworzyć/zmodyfikować `src/pages/index.astro`, dodać ochronę sesji.
2. **API fetcher** – dodać `lib/api/dashboard.ts` z funkcją `fetchDashboard` + globalny `fetchWithAuth`.
3. **Hook `useDashboardData`** – utworzyć w `src/lib/hooks/useDashboardData.ts`.
4. **Komponenty UI** – zaimplementować `CTAButtonNewBatch`, `SkeletonDashboard`, `ErrorState`, `EmptyState` w `src/components`.
5. **BatchCard & BatchListActive** – utworzyć w `src/components/batch`.
6. **SectionArchive** – utworzyć w `src/components/dashboard`.
7. **DashboardView** – spiąć wszystkie pod-komponenty, wykorzystać hook + skeleton + error.
8. **Styling** – użyć Tailwind i komponentów shadcn/ui; dopracować responsywność (grid → single column <640 px).
9. **Accessibility** – dodać role `list`/`listitem`, aria-labels na linkach.

