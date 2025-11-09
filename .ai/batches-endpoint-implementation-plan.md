# API Endpoint Implementation Plan: Batches Resource

## 1. Przegląd punktu końcowego
Celem zbioru endpointów `batches` jest umożliwienie autoryzowanym użytkownikom:

1. Tworzenia nowego nastawu (Create Batch – `POST /api/v1/batches`).
2. Pobierania listy własnych nastawów z filtrami (List Batches – `GET /api/v1/batches`).
3. Pobierania szczegółów pojedynczego nastawu (Get Batch Details – `GET /api/v1/batches/{id}`).
4. Aktualizacji nazwy nastawu (Update Batch – `PATCH /api/v1/batches/{id}`).
5. Zakończenia nastawu (Complete Batch – `POST /api/v1/batches/{id}/complete`).
6. Usunięcia nastawu (Delete Batch – `DELETE /api/v1/batches/{id}`).

Wszystkie operacje są wykonywane w kontekście zalogowanego użytkownika i korzystają z polityk RLS w Supabase.

## 2. Szczegóły żądania

| Endpoint | Metoda | URL | Parametry | Body | Wymagane uprawnienia |
|----------|--------|-----|-----------|------|----------------------|
| Create   | POST   | `/api/v1/batches` | — | `template_id` (uuid, required) <br>`name` (string≤100, opcjonalnie) | Authenticated |
| List     | GET    | `/api/v1/batches` | `status?` (`active\|archived`) <br>`type?` (BatchType) <br>`sort?` (`created_at\|started_at\|name`) <br>`order?` (`asc\|desc`) | — | Authenticated |
| Details  | GET    | `/api/v1/batches/{id}` | `id` (uuid, path) | — | Owner |
| Update   | PATCH  | `/api/v1/batches/{id}` | `id` (uuid, path) | `name` (string≤100, required) | Owner |
| Complete | POST   | `/api/v1/batches/{id}/complete` | `id` (uuid, path) | `{}` | Owner, batch.status=active |
| Delete   | DELETE | `/api/v1/batches/{id}` | `id` (uuid, path) | — | Owner |

Headers (wszystkie): `Authorization: Bearer <access_token>`.

## 3. Wykorzystywane typy

DTO oraz Command Modele z `src/types.ts`:

- CreateBatchCommand
- UpdateBatchCommand
- BatchDto / BatchListItemDto / BatchListResponseDto / UpdateBatchResponseDto / CompleteBatchResponseDto
- BatchesQueryParams
- BatchStatus, BatchType, StageName enums
- ErrorResponseDto (wspólna struktura błędów)

Dodatkowo utworzymy:

```ts
// src/types.ts (lub osobny plik)
export interface DeleteBatchResponseDto { message: string; }
```

## 4. Szczegóły odpowiedzi

| Endpoint | Status | DTO |
|----------|--------|-----|
| Create   | 201    | BatchDto |
| List     | 200    | BatchListResponseDto |
| Details  | 200    | BatchDto |
| Update   | 200    | UpdateBatchResponseDto |
| Complete | 200    | CompleteBatchResponseDto |
| Delete   | 200    | DeleteBatchResponseDto |

Błędy zwracają `ErrorResponseDto` z odpowiednimi kodami.

## 5. Przepływ danych

1. **Router (Astro endpoint)** – pliki w `src/pages/api/v1/batches` zgodnie z metodą:
   - `index.ts` – obsługa `POST` (create) i `GET` (list).
   - `[id].ts` – obsługa `GET`, `PATCH`, `DELETE` dla konkretnego batcha.
   - `[id]/complete.ts` – obsługa `POST` complete.
2. **Middleware** – `src/middleware/index.ts` wstrzykuje `supabase` (z `context.locals`).
3. **Service layer** – nowy plik `src/lib/batch.service.ts` zawierający wszystkie operacje na tabelach `batches`, `batch_stages`, `notes`, itp.
4. **Validation** – Zod schematy w `src/lib/validators.ts`:
   - `createBatchSchema`, `updateBatchSchema`, `batchesQuerySchema`, etc.
5. **Handlers** – Endpoint parsuje `request`, waliduje via Zod, pobiera `user_id` z JWT, wywołuje odpowiednią funkcję w serwisie.
6. **Serwis** – Interakcje z Supabase:
   - Transakcja przy `create`: INSERT `batches`, INSERT pierwszego `batch_stage` z danymi z `template_stages`.
   - `list`: filtr + sort, agregacje na `current_stage`, `latest_note`, `rating` (using Supabase RPC lub złożone zapytania).
   - `details`: pojedynczy SELECT + JOINy.
   - `update`: UPDATE name + RETURNING.
   - `complete`: UPDATE status, completed_at + walidacja statusu.
   - `delete`: DELETE CASCADE.
7. **Response** – Mappowanie wyników SQL na DTO (camelCase).

## 6. Względy bezpieczeństwa

- Autentykacja przez Supabase JWT (middleware).
- Autoryzacja:
  - Sprawdzanie `batch.user_id === auth.uid()` lub poleganie na RLS.
  - Transakcje wykonywane w kontekście roli użytkownika, RLS blokuje obce rekordy.
- Walidacja danych (Zod): typy, długości, UUID.
- Zapobieganie SQL injection – Supabase klient parametryzuje.
- Ograniczenie wolumenu list (`limit` domyślnie 20, max 100) – ochrona przed DoS.

## 7. Obsługa błędów

| Scenariusz | Kod | `ErrorResponseDto.code` |
|------------|-----|-----------------------|
| Brak tokenu / nieważny | 401 | `UNAUTHORIZED` |
| Niepoprawny body / query | 400 | `VALIDATION_ERROR` + szczegóły pola |
| Zbyt długa nazwa | 400 | `NAME_TOO_LONG` |
| Szablon nie istnieje | 404 | `TEMPLATE_NOT_FOUND` |
| Batch nie istnieje / cudzy | 404 | `BATCH_NOT_FOUND` |
| Batch już completed | 409 | `BATCH_ALREADY_COMPLETED` |
| Błąd bazy / nieoczekiwany | 500 | `INTERNAL_SERVER_ERROR` |

Błędy logowane `console.error` + przesyłane do Sentry (jeśli skonfigurowane).

## 8. Rozważania dotyczące wydajności

- Użycie indeksów wymienionych w planie DB – szczególnie `(user_id, status)` i `(batch_id, template_stage_id)`.
- Paginacja wyników listy (`limit`, `offset`).
- Łączenia ograniczone do potrzebnych kolumn (SELECT ... specific columns).
- Możliwość stworzenia widoków materializowanych dla dashboardu w przyszłości.
- Batchowa operacja COMPLETE wykonywana w transakcji aby uniknąć wielokrotnych zapytań.

## 9. Etapy wdrożenia

1. **Przygotowanie typów** – dodać `DeleteBatchResponseDto` i ewentualne brakujące typy w `src/types.ts`.
2. **Zod schemas** – dopisać schematy w `src/lib/validators.ts`.
3. **Batch service** – utworzyć `src/lib/batch.service.ts` z funkcjami: `create`, `list`, `getById`, `updateName`, `complete`, `remove`.
4. **Endpoints** –
   - `src/pages/api/v1/batches/index.ts` (GET, POST).
   - `src/pages/api/v1/batches/[id].ts` (GET, PATCH, DELETE).
   - `src/pages/api/v1/batches/[id]/complete.ts` (POST).
5. **Middleware** – upewnić się, że `supabase` w `context.locals` oraz `getUser()` zwraca `auth.uid`.
