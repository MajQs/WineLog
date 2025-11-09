# Plan implementacji widoku Archived Batch

## 1. Przegląd
Widok pozwala użytkownikowi przejrzeć pełną historię zakończonego nastawu (archiwum) wraz z listą notatek, przebiegiem etapów w trybie readonly oraz możliwością dodania bądź edycji oceny 1-5 gwiazdek. Użytkownik może także trwale usunąć nastaw.

## 2. Routing widoku
- Ścieżka: `/archived/:id`
- Plik strony: `src/pages/archived/[id].astro`
- Loadery (SSR): pobranie danych nastawu + lazy import komponentu React `ArchivedBatchView`.

## 3. Struktura komponentów
```
ArchivedBatchView (layout flex-col)
├── HeaderBar
│   └── ButtonDeleteBatch
├── MetaInfoBar (nazwa, typ, daty)
├── StarRating (editable)
├── StageTimelineReadOnly
├── NoteTimeline (reverse-chronological)
└── ErrorState / SkeletonBatchView (conditional)
```

## 4. Szczegóły komponentów
### ArchivedBatchView
- Opis: Komponent kontener pobiera dane, agreguje stan i renderuje pod-komponenty.
- Elementy: `<QueryProvider>`, `<SkeletonBatchView>`, `<ErrorState>`.
- Interakcje: inicjalny fetch, ponowne pobranie po edycji ratingu lub usunięciu.
- Walidacja: id musi być UUID.
- Typy: `ArchivedBatchViewModel`.
- Propsy: `{ batchId: string }`.

### HeaderBar
- Opis: Pasek nagłówka z przyciskiem powrotu i `ButtonDeleteBatch`.
- Elementy: `<h1>`, `<ButtonDeleteBatch>`.
- Interakcje: kliknięcie delete ⇒ dialog potwierdzenia.
- Walidacja: none.
- Typy: void.
- Propsy: `{ name: string }`.

### ButtonDeleteBatch
- Opis: Akcja DELETE nastawu.
- Elementy: `<button>` + ikonka.
- Interakcje: onClick → dialog → DELETE `/batches/{id}`.
- Walidacja: potwierdzenie.
- Typy: `DeleteBatchResponseDto`.
- Propsy: `{ batchId: string; onDeleted: () => void }`.

### MetaInfoBar
- Opis: Statyczny passthrough informacji (typ, daty, liczba notatek).
- Elementy: `<dl>` grid.
- Interakcje: none.
- Walidacja: none.
- Typy: pick z `BatchDto`.
- Propsy: `{ batch: BatchDto }`.

### StarRating
- Opis: Kontrolka wyboru 1-5 gwiazdek.
- Elementy: 5 ikon `<Star />` z `@shadcn/ui`.
- Interakcje: klik gwiazdki → optimistic PUT `/rating`.
- Walidacja: wartość 1-5.
- Typy: `RatingDto`.
- Propsy: `{ initialRating?: number; batchId: string; onChange?: (r:number)=>void }`.

### StageTimelineReadOnly
- Opis: Lista wszystkich etapów z ikonami statusu.
- Elementy: `StageCard` map.
- Interakcje: none.
- Walidacja: none.
- Typy: `BatchStageDto[]`.
- Propsy: `{ stages: BatchStageDto[] }`.

### NoteTimeline
- Opis: Oś czasu notatek w kolejności odwrotnej.
- Elementy: `NoteCard` dla każdej notatki.
- Interakcje: scroll, brak edycji.
- Walidacja: none.
- Typy: `NoteDto[]`.
- Propsy: `{ notes: NoteDto[] }`.

## 5. Typy
### ArchivedBatchViewModel
```ts
interface ArchivedBatchViewModel {
  batch: BatchDto;
  notes: NoteDto[]; // z BatchDto
  stages: BatchStageDto[]; // z BatchDto
  rating?: number | null;
}
```
Dodatkowe pomocnicze typy importowane bez zmian: `BatchDto`, `NoteDto`, `BatchStageDto`, `RatingDto`, `DeleteBatchResponseDto`.

## 6. Zarządzanie stanem
- React Query (via `QueryProvider`) do cachowania żądań.
- Klucze:
  - `['batch', id]` – GET batch details.
  - `['rating', id]` – GET rating (lub z pola `batch.rating`).
- Mutacje:
  - `useMutation(putRating)` z optimistic update.
  - `useMutation(deleteBatch)` z redirectem do `/archive` po sukcesie.

## 7. Integracja API
| Akcja | Endpoint | Metoda | Request | Response |
|-------|----------|--------|---------|----------|
| Pobranie danych | `/api/v1/batches/{id}` | GET | – | `BatchDto` |
| Dodanie/edycja oceny | `/api/v1/batches/{id}/rating` | PUT | `UpsertRatingCommand` | `RatingDto` |
| Usunięcie nastawu | `/api/v1/batches/{id}` | DELETE | – | `DeleteBatchResponseDto` |

## 8. Interakcje użytkownika
1. Wejście na `/archived/:id` → skeleton → dane.
2. Klik gwiazdki → aktualizacja oceny, toast "Ocena zapisana".
3. Klik "Usuń" → dialog → potwierdzenie → request DELETE → redirect `/archive` + toast.

## 9. Warunki i walidacja
- `rating` ∈ [1,5] – walidowane w komponencie `StarRating` oraz server-side.
- `id` musi być UUID – sprawdzane w loaderze, w razie błędu 404.

## 10. Obsługa błędów
- Fetch error → `ErrorState` z przyjaznym komunikatem.
- PUT/DELETE error → toast error + rollback optimistic update.
- Brak (404) nastawu → redirect to `/404`.

## 11. Kroki implementacji
1. Utworzenie pliku strony `src/pages/archived/[id].astro` z loaderem danych i mountem React.
2. Stworzenie komponentu `ArchivedBatchView.tsx` w `src/components/`.
3. Zaimplementowanie hooka `useArchivedBatch(id)` (oparty o `useQuery`).
4. Implementacja komponentów podrzędnych (`MetaInfoBar`, `StageTimelineReadOnly`, `NoteTimeline`, `StarRating`, `ButtonDeleteBatch`).
5. Dodanie mutacji `putRating`, `deleteBatch` w `src/lib/api/batch.ts`.
6. Dodanie hooka `useRatingMutation` dla oceny.
7. Linter + format + Storybook stories.

