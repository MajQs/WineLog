# API Endpoint Implementation Plan: Batch Notes Endpoints

## 1. Przegląd punktu końcowego
Punkt końcowy *Notes* umożliwia zarządzanie notatkami powiązanymi z nastawem (batch) i jego etapami (stage).

Udostępniamy trzy operacje REST:

| Metoda | Ścieżka                                     | Opis                                    |
|--------|---------------------------------------------|-----------------------------------------|
| POST   | `/api/v1/batches/{batch_id}/notes`          | Utworzenie nowej notatki dla bieżącego etapu batcha |
| GET    | `/api/v1/batches/{batch_id}/notes`          | Pobranie listy notatek dla batcha       |
| DELETE | `/api/v1/batches/{batch_id}/notes/{note_id}`| Usunięcie notatki (hard delete)         |

Endpointy są chronione – wymagają nagłówka `Authorization: Bearer <access_token>`.

---

## 2. Szczegóły żądania
### 2.1 Utworzenie notatki (POST)
* **URL**: `/api/v1/batches/{batch_id}/notes`
* **Body – JSON**:
  - `action` *(string, required, ≤ 200)* – opis działania
  - `observations` *(string, optional, ≤ 200)* – dodatkowe obserwacje
* **Headers**:
  - `Authorization: Bearer <access_token>`

### 2.2 Pobranie listy (GET)
* **URL**: `/api/v1/batches/{batch_id}/notes`
* **Query params** (opcjonalne):
  - `sort` – `asc` | `desc` (domyślnie `desc`)
  - `stage_id` – filtrowanie po etapie

### 2.3 Usunięcie notatki (DELETE)
* **URL**: `/api/v1/batches/{batch_id}/notes/{note_id}`
* **Headers**: jw.

---

## 3. Wykorzystywane typy
1. **Command models** (z `src/types.ts`):
   - `CreateNoteCommand`
   - `UpdateNoteCommand` (niewykorzystywany w MVP, ale istnieje)
2. **Query params**:
   - `NotesQueryParams`
3. **DTOs**:
   - `NoteDto`
   - `NoteListResponseDto`
   - `MessageResponseDto`
   - `ErrorResponseDto`

---

## 4. Szczegóły odpowiedzi
| Operacja | Kod | Typ | Zawartość |
|----------|-----|-----|-----------|
| POST | 201 | `NoteDto` | Utworzona notatka z kontekstem etapu |
| GET  | 200 | `NoteListResponseDto` | Lista notatek + total |
| DELETE | 200 | `MessageResponseDto` | Komunikat potwierdzający |
| *błędy* | 400/401/404/500 | `ErrorResponseDto` | Szczegóły błędu |

---

## 5. Przepływ danych
1. **Uwierzytelnienie** – middleware Astro pobiera użytkownika z Supabase sesji (`context.locals.supabase`).
2. **Walidacja** – Zod na podstawie `CreateNoteCommand` & `NotesQueryParams`.
3. **Serwis** – `note.service.ts` (nowy) z metodami:
   - `createNote(supabase, userId, batchId, dto)`
   - `listNotes(supabase, userId, batchId, params)`
   - `deleteNote(supabase, userId, batchId, noteId)`
4. **DB operacje** – Supabase RPC / query builder na widokach RLS-owych:
   - INSERT → `notes`
   - SELECT → `notes` (JOIN z `template_stages` i `batch_stages` dla kontekstu)
   - DELETE → `notes`
5. **Mapowanie** – serwis zwraca struktury odpowiadające DTO.
6. **Endpoint** – Astro route w `src/pages/api/v1/batches/[batch_id]/notes.ts` (dynamic nested collection):
   - Rozróżnienie POST/GET
   - Dla DELETE osobny plik `notes/[note_id].ts`.

---

## 6. Względy bezpieczeństwa
1. **RLS** – Tabele `batches`, `batch_stages`, `notes` posiadają polityki wymuszające własność.
2. **Re-autoryzacja** – Każde zapytanie używa `supabase` z lokali, dzięki czemu sesja jest propagowana na backend.
3. **Input Sanitization** – Zod + param length checks; Supabase oczyszcza SQL via RPC.
4. **Rate limiting** – (future) middleware; not critical MVP.
5. **RBAC** – Brak ról admin w MVP; tylko właściciel może modyfikować/usunąć swoje notatki.

---

## 7. Obsługa błędów
| Sytuacja | Kod | `code` | Wiadomość |
|----------|-----|--------|-----------|
| Brak/nieprawidłowy token | 401 | `UNAUTHORIZED` | „Brak dostępu.” |
| Batch nie istnieje lub nie należy do usera | 404 | `BATCH_NOT_FOUND` | „Batch nie znaleziony.” |
| Notatka nie istnieje lub nie należy do usera | 404 | `NOTE_NOT_FOUND` | „Notatka nie znaleziona.” |
| Walidacja – action > 200 | 400 | `ACTION_TOO_LONG` | jw. spec |
| Walidacja – observations > 200 | 400 | `OBSERVATIONS_TOO_LONG` | jw. spec |
| Inne błędy serwera | 500 | `INTERNAL_SERVER_ERROR` | „Wystąpił błąd serwera.” |

Błędy logujemy poprzez `console.error` + opcjonalny `src/lib/logger.ts` (w przyszłości).

---

## 8. Rozważania dotyczące wydajności
* **Indeksy** – tabele posiadają indeks `(batch_id, created_at DESC)` → szybkie sortowanie.
* **Paginacja** – przy dużej liczbie notatek w przyszłości `range()` + `limit` (nie w MVP).
* **Select columns** – wybieramy tylko potrzebne kolumny.

---

## 9. Etapy wdrożenia
1. **Utwórz Zod schematy** w `src/lib/validation/note.schema.ts`.
2. **Stwórz serwis** `src/lib/services/note.service.ts` z operacjami CRUD.
3. **Utwórz endpointy Astro**:
   - `src/pages/api/v1/batches/[batch_id]/notes/index.ts` (POST, GET)
   - `src/pages/api/v1/batches/[batch_id]/notes/[note_id].ts` (DELETE)
4. **Zaimplementuj walidację** i obsługę błędów zgodnie z tabelą z pkt 7.
5. **Aktualizuj `src/types.ts`** jeśli pojawią się nowe pola.
