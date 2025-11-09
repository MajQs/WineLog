# API Endpoint Implementation Plan: GET /api/v1/dashboard

## 1. Przegląd punktu końcowego
Zwraca zagregowane dane dla ekranu głównego (dashboard) zalogowanego użytkownika:

* listę aktywnych nastawów (batches) z uproszczonymi danymi o aktualnym etapie i ostatniej notatce,
* liczbę zarchiwizowanych nastawów.

Dane służą do szybkiego podglądu postępów produkcji oraz statystyk użytkownika.

## 2. Szczegóły żądania
* **Metoda HTTP:** `GET`
* **URL:** `/api/v1/dashboard`
* **Headers:**
  * `Authorization: Bearer <access_token>` ― wymagane
* **Query params:** brak (endpoint nie przyjmuje parametrów)
* **Request Body:** brak

## 3. Wykorzystywane typy
1. **Response DTO** – `DashboardDto`
2. **Zagnieżdżone:**
   * `DashboardBatchDto`
   * `CurrentStageInfoDto`
   * `LatestNoteDto`
3. **Error DTO** – `ErrorResponseDto`

_Type definitions znajdują się w `src/types.ts`. Jeśli w przyszłości pojawi się potrzeba modyfikacji struktur, aktualizujemy wyłącznie plik `types.ts`._

## 4. Szczegóły odpowiedzi
| Kod | Opis                           | Body |
|------|--------------------------------|------|
| 200  | Sukces                         | `DashboardDto` |
| 401  | Brak/nieprawidłowy token       | `ErrorResponseDto` |
| 500  | Nieoczekiwany błąd serwera     | `ErrorResponseDto` |

Przykład odpowiedzi 200 OK:
```json
{
  "active_batches": [
    {
      "id": "uuid",
      "name": "Wino czerwone #1",
      "type": "red_wine",
      "started_at": "2025-01-15",
      "current_stage": {
        "position": 4,
        "name": "secondary_fermentation",
        "description": "Fermentacja cicha",
        "days_elapsed": 12
      },
      "latest_note": {
        "id": "uuid",
        "action": "Zlewanie z nad osadu",
        "created_at": "2025-01-20T10:30:00Z"
      }
    }
  ],
  "archived_batches_count": 3
}
```

## 5. Przepływ danych
1. Middleware `src/middleware/index.ts` uwierzytelnia żądanie i w `context.locals` udostępnia instancję `SupabaseClient` z identyfikacją użytkownika.
2. Handler endpointu importuje **`getDashboardData`** z nowego modułu `src/lib/dashboard.service.ts`.
3. Service wykonuje dwa zapytania:
   * Aktywne nastawy – selekcja z `batches` (`status = 'active'`) + JOIN z aktualnym etapem (widok lub zapytanie do `batch_stages` + `template_stages`) oraz ostatnią notatką (`notes`).
   * Liczba zarchiwizowanych nastawów – zliczenie `batches` gdzie `status = 'archived'`.
4. Service transformuje wynik do `DashboardDto` (m.in. oblicza `days_elapsed` przy użyciu `date_diff` pomiędzy `started_at` i `now()`).
5. Handler zwraca `return new Response(JSON.stringify(data), { status: 200 })` z nagłówkiem `Content-Type: application/json`.

## 6. Względy bezpieczeństwa
* **Authentication** – wymagany ważny JWT Supabase; brak tokenu → 401.
* **Authorization** – wykorzystujemy RLS w Supabase (`batches`, `notes`) więc użytkownik zobaczy wyłącznie własne dane.
* **Brak danych wrażliwych** – zwracamy tylko ID, nazwy i statystyki.
* **Rate-limiting** – opcjonalnie dodać warstwę limitowania (np. middleware).

## 7. Obsługa błędów
| Scenariusz | Kod | Detale |
|------------|-----|--------|
| Brak/nieważny token | 401 | `error: "unauthorized"` |
| Błąd bazy lub inny wyjątek | 500 | `error: "internal_server_error"` |

W service: opakowujemy zapytania `try/catch`, logujemy `console.error` (lub `logger`) z szczegółami, ale do klienta zwracamy generyczny komunikat.

## 8. Rozważania dotyczące wydajności
* **O(1) zapytania** – łączymy dane agregatami i JOIN-ami zamiast osobnych zapytań w pętli.
* **Indeksy** – istniejące indeksy (`batches(user_id,status)`, `notes(batch_id)`) wspierają filtrowanie.
* **SELECT … LIMIT** – lista aktywnych nastawów ograniczona np. `LIMIT 10` (do decyzji UX) aby uniknąć nadmiaru danych.
* **Cache** – potencjalne dodanie krótkiej warstwy cache (np. dla listy aktywnych batches i liczby zarchiwizowanych nastawów) przy zwiększonym ruchu.

## 9. Etapy wdrożenia
1. **Utwórz service** `src/lib/dashboard.service.ts`
   ```ts
   export async function getDashboardData(supabase: SupabaseClient): Promise<DashboardDto> {}
   ```
2. **Zaimplementuj zapytania** w service (zapytania opisane w pkt 5). Dodaj pomocnicze mapowanie wyników na DTO.
3. **Dodaj walidator** (Zod) dla query params (obecnie pusty, ale przygotuj szkielet).
4. **Utwórz endpoint** `src/pages/api/v1/dashboard/index.ts`:
   * Ustaw `export const prerender = false;`
   * `import { getDashboardData }` i `z` walidator.
   * Sprawdź auth (`const { data: { user } } = await locals.supabase.auth.getUser();`).
   * Zwróć 401 jeśli brak użytkownika.
   * Wywołaj service i zwróć 200 z danymi lub 500 on error.
5. **Uruchom ESLint/Prettier** w CI.

