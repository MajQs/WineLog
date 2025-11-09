# Plan implementacji widoku Nastaw (Batch View)

## 1. Przegląd
Widok Nastaw (`/batches/:id`) umożliwia użytkownikowi zarządzanie pojedynczym nastawem: podgląd postępów w etapach produkcji, dodawanie notatek, zmianę nazwy oraz przechodzenie do kolejnego etapu. Widok łączy dane z kilku endpointów API i prezentuje je w intuicyjnej, responsywnej formie.

## 2. Routing widoku
| Ścieżka | Komponent strony | Autoryzacja |
|---------|-----------------|-------------|
| `/batches/:id` | `BatchPage` (Astro + React) | Wymagane JWT (middleware)

## 3. Struktura komponentów
```
BatchPage (layout)
 ├─ EditableHeading
 ├─ MetaInfoBar
 ├─ StageTimeline
 │   ├─ StageItem (× n)
 │   └─ StageCardCurrent
 ├─ ButtonNextStage
 ├─ NoteForm
 ├─ NoteTimeline
 │   └─ NoteCard (× n)
 ├─ Toast (portal)
 └─ ConfirmationDialog (portal)
```

## 4. Szczegóły komponentów
### EditableHeading
- **Opis:** Edytowalny nagłówek z nazwą nastawu. Pozwala na inline edit i natychmiastowy zapis.
- **Główne elementy:** `h1`, `input`, ikonka ołówka, przycisk zatwierdzenia.
- **Interakcje:** klik → przełączenie w tryb edycji; Enter/blur → `onSubmit(name)`; Esc → anuluj.
- **Walidacja:** max 100 znaków, nienulowe.
- **Typy:** `UpdateBatchCommand`, `UpdateBatchResponseDto`.
- **Propsy:** `name: string`, `batchId: string`, `onUpdated(name)`.

### MetaInfoBar
- **Opis:** Pasek z podstawowymi metadanymi: typ, data rozpoczęcia, status.
- **Elementy:** ikony + `span`.
- **Interakcje:** brak.
- **Walidacja:** –
- **Typy:** `BatchDto` (subset).
- **Propsy:** `batch: BatchDto`.

### StageTimeline
- **Opis:** Pionowa oś czasu wszystkich etapów.
- **Elementy:** lista `StageItem`; `aria-current` dla aktualnego.
- **Interakcje:** hover → tooltip; klik ukończonego etapu (rozwinie opis) – opcjonalnie.
- **Walidacja:** kolejność wg `position`.
- **Typy:** `BatchStageDto[]`.
- **Propsy:** `stages`, `currentStageId`.

### StageCardCurrent
- **Opis:** Karta z szczegółami bieżącego etapu: opis, instrukcje, materiały, progress.
- **Elementy:** `Card` (shadcn/ui), listy materiałów, akordeon instrukcji.
- **Interakcje:** rozwiń/zwiń sekcje.
- **Walidacja:** –
- **Typy:** `CurrentStageDetailsDto`.
- **Propsy:** `stage: CurrentStageDetailsDto`.

### ButtonNextStage
- **Opis:** Główny przycisk CTA do przejścia do następnego etapu.
- **Elementy:** `Button` + ikonka strzałki.
- **Interakcje:** click → `POST /batches/{id}/stages/advance`; on success odśwież dane; loading state.
- **Walidacja:** dostępny tylko gdy batch `active` i nie w final stage.
- **Typy:** `AdvanceStageCommand`, `AdvanceStageResponseDto`.
- **Propsy:** `batchId`, `disabled`.

### NoteForm
- **Opis:** Formularz tworzenia nowej notatki powiązanej z aktualnym etapem.
- **Elementy:** `Textarea` ×2 (`action`, `observations`), przycisk „Dodaj”.
- **Interakcje:** submit → `POST /batches/{id}/notes`; optimistic update.
- **Walidacja:** `action` required ≤ 200 zn., `observations` optional ≤ 200 zn.
- **Typy:** `CreateNoteCommand`, `NoteDto`.
- **Propsy:** `batchId`.

### NoteTimeline
- **Opis:** Lista wszystkich notatek w kolejności chronologicznej.
- **Elementy:** `NoteCard`.
- **Interakcje:** usunięcie notatki (trash icon) → `DELETE`.
- **Walidacja:** –
- **Typy:** `NoteListResponseDto`.
- **Propsy:** `notes: NoteDto[]`, `onDelete(noteId)`.

### NoteCard
- **Opis:** Pojedyncza notatka z działaniem, obserwacjami, datą, etapem.
- **Interakcje:** przycisk usuń.
- **Walidacja:** –
- **Typy:** `NoteDto`.
- **Propsy:** `note`, `onDelete`.

### Toast
- **Opis:** Globalne powiadomienia (sukces/błąd).

### ConfirmationDialog
- **Opis:** Potwierdzenie przejścia do następnego etapu.

## 5. Typy
```
// DTO z backendu
BatchDto, CurrentStageDetailsDto, NoteDto,
AdvanceStageResponseDto, UpdateBatchResponseDto

// ViewModels
interface BatchVM {
  id: string;
  name: string;
  type: BatchType;
  status: BatchStatus;
  startedAt: string;
  currentStage: CurrentStageDetailsDto;
  stages: BatchStageDto[];
  notes: NoteDto[];
}
```

## 6. Zarządzanie stanem
- **Hook useBatch(id)** – pobiera i trzyma pełne dane nastawu (SWRT query):
  - `batch`, `isLoading`, `error`, `refetch`.
- **Hook useNotes(batchId)** – paginacja w przyszłości.
- **React Query** (`QueryProvider` już istnieje) do cachowania.
- Lokalne stany formularzy (`useState`).

## 7. Integracja API
| Akcja | Endpoint | Metoda | Typy |
|-------|----------|--------|------|
| Pobierz batch | `/api/v1/batches/{id}` | GET | `BatchDto` → `BatchVM` |
| Pobierz current stage | `/api/v1/batches/{id}/stages/current` | GET | `CurrentStageDetailsDto` |
| Update name | `/api/v1/batches/{id}` | PATCH | `UpdateBatchCommand` / `UpdateBatchResponseDto` |
| Advance stage | `/api/v1/batches/{id}/stages/advance` | POST | `AdvanceStageCommand` / `AdvanceStageResponseDto` |
| Create note | `/api/v1/batches/{id}/notes` | POST | `CreateNoteCommand` / `NoteDto` |
| Delete note | `/api/v1/batches/{id}/notes/{noteId}` | DELETE | `MessageResponseDto` |

## 8. Interakcje użytkownika
1. Edycja nazwy → zapis PATCH → toast success/error.
2. Klik „Następny etap” → dialog → POST advance → odśwież dane.
3. Dodanie notatki → optimistic insert → toast.
4. Usunięcie notatki → DELETE → remove z listy.
5. Hover etapu → tooltip z description.

## 9. Warunki i walidacja
- Nazwa: max 100 zn. (Zod schema).
- Note.action ≤ 200, observations ≤ 200.
- ButtonNextStage disabled, gdy `status !== active` lub `isFinalStage`.
- Validation błędy wyświetlane inline.

## 10. Obsługa błędów
| Kod | Komponent | Reakcja |
|-----|-----------|---------|
| 400 VALIDATION_ERROR | Formularze | Wyświetl messages przy polach |
| 401 / 403 | Fetch hooks | Redirect do login + toast |
| 404 RESOURCE_NOT_FOUND | BatchPage | `ErrorState` + link do dashboardu |
| 409 FINAL_STAGE | ButtonNextStage | Disable + tooltip |

## 11. Kroki implementacji
1. Utwórz stronę `src/pages/batches/[id].astro` z layoutem.
2. Zaimportuj `QueryProvider` i utwórz `BatchPage`.
3. Zaimplementuj hook `useBatch` (GET batch + stages + notes równolegle).
4. Dodaj `EditableHeading` z walidacją Zod i optimistic PATCH.
5. Zbuduj `MetaInfoBar`.
6. Zaimplementuj `StageTimeline` oraz `StageCardCurrent` (dane z current stage endpointu).
7. Dodaj `ButtonNextStage` z dialogiem potwierdzenia i refreshem stanu.
8. Stwórz `NoteForm` z Zod + optimistic update.
9. Stwórz `NoteTimeline` + `NoteCard` z opcją DELETE.
10. Dodaj globalną obsługę błędów HTTP w fetch wrapperze.
11. Dodaj skeletony ładowania (`SkeletonDashboard` already pattern).
12. Zapewnij pełną responsywność z Tailwind.
