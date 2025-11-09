# API Endpoint Implementation Plan: Batch Stages – Advance & Current Stage

## 1. Przegląd punktu końcowego
Ten punkt końcowy udostępnia operacje zarządzania etapami (stages) nastawu (batch):
1. **Advance to Next Stage** – przesuwa nastaw do kolejnego etapu, zamykając bieżący i opcjonalnie zapisując notatkę.
2. **Get Current Stage Details** – zwraca szczegółowe informacje o bieżącym etapie wraz z notatkami.

Oba endpointy są chronione – wymagają aktywnej sesji (JWT) i obsługują wyłącznie zasoby należące do zalogowanego użytkownika.

## 2. Szczegóły żądania
### 2.1 Advance to Next Stage
- **HTTP**: `POST`
- **URL**: `/api/v1/batches/{batch_id}/stages/advance`
- **Headers**:
  - `Authorization: Bearer <access_token>` (wymagany)
- **Path Params**:
  - `batch_id` (UUID, wymagany)
- **Request Body** (`application/json`):
```json
{
  "note": {
    "action": "Zakończono macerację",
    "observations": "Kolor głęboki, aromat intensywny"
  }
}
```
  - `note` (opcjonalne)
    - `action` – string ≤200, wymagany
    - `observations` – string ≤200, opcjonalne

### 2.2 Get Current Stage Details
- **HTTP**: `GET`
- **URL**: `/api/v1/batches/{batch_id}/stages/current`
- **Headers**:
  - `Authorization: Bearer <access_token>`
- **Path Params**:
  - `batch_id` (UUID, wymagany)
- **Body**: brak

## 3. Wykorzystywane typy (z `src/types.ts`)
- **Command Models**:
  - `AdvanceStageCommand`
- **Response DTOs**:
  - `AdvanceStageResponseDto`
  - `CurrentStageDetailsDto`
  - `StageSummaryDto`
  - `BatchStageDto`
  - `NoteDto`
- **Inne**:
  - Enumy `StageName`, `BatchStatus`

## 4. Szczegóły odpowiedzi
### 4.1 Advance (200 OK)
```json
{
  "previous_stage": { /* StageSummaryDto */ },
  "current_stage": { /* BatchStageDto */ },
  "note": { /* NoteDto */ }
}
```

### 4.2 Current Stage (200 OK)
`CurrentStageDetailsDto` – pełny `BatchStageDto` rozszerzony o `notes: NoteDto[]`.

### Kody statusu
| Kod | Scenariusz |
|-----|------------|
|200|Sukces (GET/POST)|
|400|Nieprawidłowe dane wejściowe / FINAL_STAGE|
|401|Brak autoryzacji|
|404|Batch nie istnieje lub nie należy do użytkownika|
|500|Błąd serwera / DB|

## 5. Przepływ danych
1. Middleware uwierzytelnia JWT i udostępnia `supabase` z `locals` oraz `user.id`.
2. Router parsuje `batch_id` i (dla POST) body → walidacja Zod.
3. Handler wywołuje **BatchStageService**:
   - *advanceToNextStage* lub *getCurrentStageDetails*.
4. Service wykonuje operacje na DB (`batches`, `batch_stages`, `notes`) w jednej transakcji (RPC) lub sekwencji zapytań:
   - sprawdza własność (RLS) i status.
   - aktualizuje/insertuje rekordy.
5. Service buduje DTO i zwraca do handlera.
6. Handler mapuje wynik na `JSONResponse` i ustawia status.

## 6. Względy bezpieczeństwa
- **Autoryzacja**: wymuszona przez JWT + RLS (`batches.user_id = auth.uid()`).
- **Walidacja**: UUID dla `batch_id`; body poprzez Zod (długość ≤200, brak XSS).
- **Transakcja**: operacje aktualizacji wykonywane w funkcji PostgREST RPC lub w try/catch; w razie błędu rollback.
- **Brak eskalacji**: Service nigdy nie zwraca surowych błędów DB.
- **Rate-limiting / CSRF**: pozostaje w gestii globalnego middleware/API-Gateway.

## 7. Obsługa błędów
| Kod | `ErrorResponseDto.code` | Warunek |
|-----|------------------------|---------|
|400|`INVALID_INPUT`|Błędne UUID lub niezgodne body|
|400|`FINAL_STAGE`|Aktualny etap jest ostatni i już ukończony|
|401|`UNAUTHORIZED`|Brak/niepoprawny token|
|404|`NOT_FOUND`|Batch nie istnieje lub brak dostępu|
|500|`SERVER_ERROR`|Nieoczekiwany błąd DB / inny wyjątek|

## 8. Rozważania dotyczące wydajności
- **Minimalizacja round-tripów**: łączone zapytania SQL z joinem `template_stages`.
- **Bulk update**: zakończenie bieżącego i rozpoczęcie następnego etapu w 1 zapytaniu SQL (CTE) lub funkcji RPC.
- **Indexes**: już istnieją (`batch_stages(batch_id, template_stage_id)`).

## 9. Etapy wdrożenia
1. **Zod Schemas** – dodaj do `src/lib/validators.ts`:
   - `advanceStageSchema` (body)
   - `batchIdParamSchema` (UUID)
2. **BatchStageService** (`src/lib/batchStage.service.ts`)
   - `advanceToNextStage(supabase, userId, batchId, command): Promise<AdvanceStageResponseDto>`
   - `getCurrentStageDetails(supabase, userId, batchId): Promise<CurrentStageDetailsDto>`
   - Util `buildBatchStageDto` & `calculateDaysElapsed` (reuse z `batch.service.ts`).
3. **API Routes**
   - `src/pages/api/v1/batches/[id]/stages/advance.ts`
     ```ts
     export const prerender = false;
     import { advanceStageSchema } from "../../../lib/validators";
     export async function POST({ params, request, locals }) { /* ... */ }
     ```
   - `src/pages/api/v1/batches/[id]/stages/current.ts`
     ```ts
     export const prerender = false;
     export async function GET({ params, locals }) { /* ... */ }
     ```
4. **Error Mapping Helper** – w `src/lib/utils.ts` uzupełnij `mapServiceErrorToHttp`.

Po wdrożeniu endpointy umożliwią użytkownikom płynne zarządzanie progresją etapów nastawu z zachowaniem spójności danych i reguł biznesowych.
