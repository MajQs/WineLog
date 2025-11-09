# Plan implementacji widoku Lista Archiwum

## 1. Przegląd
Widok Lista Archiwum umożliwia użytkownikowi przegląd wszystkich zakończonych nastawów (batches) w aplikacji WineLog. Prezentuje on karty z podstawowymi informacjami o każdym nastawie oraz umożliwia przejście do widoku szczegółów archiwalnego nastawu. Widok jest tylko do odczytu – w MVP brak paginacji i filtrów.

## 2. Routing widoku
- **Ścieżka:** `/archived`
- **Metoda routingu:** React Router z lazy-loaded komponentem `ArchivedRoute` (code-splitting przez Vite).
- **Guard:** Wymaga uwierzytelnienia; przekierowanie do `/auth` gdy brak sesji.

## 3. Struktura komponentów
```
<ArchivedPage>
 ├─ <PageHeading "Archiwum"/>
 ├─ <BatchListArchived>
 │    ├─ (state=loading) <SkeletonArchive />
 │    ├─ (state=error)   <ErrorSection />
 │    └─ (state=success)
 │          ├─ <BatchCardArchived /> × N
 │          └─ (empty) <EmptyState />
 └─ <OfflineBanner /> (global)
```

## 4. Szczegóły komponentów
### 4.1 ArchivedPage
- **Opis:** Komponent stronicujący – pobiera dane, zarządza stanem i renderuje `BatchListArchived`.
- **Elementy:** nagłówek `h1`, children.
- **Interakcje:** brak.
- **Walidacja:** n/a.
- **Typy:** używa `useArchivedBatchesQuery` (TanStack Query) zwracającego `BatchListResponseDto`.
- **Propsy:** none (route component).

### 4.2 BatchListArchived
- **Opis:** Kontener listy zakończonych nastawów.
- **Elementy:** `ul`-list with role="list".
- **Interakcje:** none (delegowane do kart).
- **Walidacja:** n/a.
- **Typy:** `ArchivedBatchCardVM[]` jako prop `items`.
- **Propsy:** `{ items: ArchivedBatchCardVM[] }`.

### 4.3 BatchCardArchived
- **Opis:** Karta pojedynczego archiwalnego nastawu.
- **Elementy:** `li`, wewnątrz flex container, nazwa, typ badge, daty start/koniec, komponent `StarRating` readonly.
- **Interakcje:** kliknięcie całej karty → nawigacja `navigate('/archived/'+id)`.
- **Walidacja:** n/a (read-only).
- **Typy:** `ArchivedBatchCardVM`.
- **Propsy:** `{ batch: ArchivedBatchCardVM }`.

### 4.4 SkeletonArchive
- **Opis:** Placeholder podczas ładowania.
- **Elementy:** `div` z `animate-pulse`, kilka prostokątów.
- **Interakcje:** none.
- **Propsy:** none.

### 4.5 ErrorSection
- **Opis:** Wyświetla błąd pobierania wraz z przyciskiem „Spróbuj ponownie”.
- **Interakcje:** klik „retry” → refetch query.
- **Propsy:** none.

### 4.6 EmptyState
- **Opis:** Informuje użytkownika, że nie ma zakończonych nastawów + link CTA powrotu na Dashboard.
- **Propsy:** none.

## 5. Typy
```typescript
// ViewModel list item
export interface ArchivedBatchCardVM {
  id: string;
  name: string;
  type: BatchType;          // z types.ts
  startedAt: string;        // ISO
  completedAt: string;      // ISO
  rating: number | null;    // 1–5 lub null
}
```
- Mapowanie z `BatchListItemDto` (`types.ts` 249-262).
- `useArchivedBatchesQuery` zwraca `BatchListItemDto[]` + total; hook konwertuje na `ArchivedBatchCardVM[]`.

## 6. Zarządzanie stanem
- **Dane zdalne:** TanStack Query `useQuery(['batches', 'archived'])`.
- **Dane lokalne:** brak edytowalnego stanu.
- **Global:** Offline status przez `useNetworkStatus` (istniejący hook).

## 7. Integracja API
- **Endpoint:** `GET /api/v1/batches?status=archived`.
- **Typ odpowiedzi:** `BatchListResponseDto`.
- **Nagłówki:** JWT w `Authorization` (handled by fetchWithAuth).
- **Obsługa:**
  ```ts
  const { data, isLoading, error, refetch } = useQuery(...)
  ```
- **Brak parametrów query w MVP** (sort/filters TBC).

## 8. Interakcje użytkownika
1. **Ładowanie strony** – skeleton.
2. **Brak danych** – `EmptyState`.
3. **Kliknięcie karty** – przejście do `/archived/:id`.
4. **Błąd sieci** – `ErrorSection` + `OfflineBanner`.

## 9. Warunki i walidacja
- Walidacja danych odbywa się po stronie backendu; frontend tylko wyświetla odpowiedź.
- Komponent `StarRating` ma prop `editable={false}` – walidator wymusza zakres 1-5 przy mapowaniu.

## 10. Obsługa błędów
- **HTTP 401** → global interceptor przekierowuje do `/auth`.
- **HTTP 4xx/5xx** → `Toast.error` z komunikatem „Wystąpił błąd. Spróbuj ponownie.” + `ErrorSection`.
- **Brak Internetu** → `OfflineBanner` sticky.

## 11. Kroki implementacji
1. **Routing:** dodać lazy-route `/archived` w `src/pages/archived.astro` → klient React.
2. **Hook:** utworzyć `useArchivedBatchesQuery` w `src/lib/hooks/useArchivedBatchesQuery.ts`.
3. **Typy:** dodać `ArchivedBatchCardVM` do `src/types/viewModels.ts`.
4. **Komponenty:**
   1. `ArchivedPage.tsx`
   2. `BatchListArchived.tsx`
   3. `BatchCardArchived.tsx`
   4. `SkeletonArchive.tsx`
   5. `ErrorSection.tsx`, `EmptyState.tsx`
5. **Styling:** Tailwind + Shadcn/Card; focus-ring, role list/listitem.
6. **Integracja:** użyć `fetchWithAuth` w hooku.
