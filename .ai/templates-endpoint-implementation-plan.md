# API Endpoint Implementation Plan: Templates Endpoints

## 1. Przegląd punktu końcowego
Szablonowe punkty końcowe umożliwiają uwierzytelnionym użytkownikom pobieranie dostępnych szablonów nastawów (`templates`) oraz ich szczegółów wraz z etapami (`template_stages`). Dane są tylko do odczytu i zabezpieczone przez RLS w Supabase.

| Endpoint | Metoda | Opis |
|----------|--------|------|
| `/api/v1/templates` | GET | Pobiera listę wszystkich produkcyjnych szablonów z opcjonalnym filtrem `type`. |
| `/api/v1/templates/{template_id}` | GET | Pobiera szczegóły pojedynczego szablonu wraz z etapami. |

## 2. Szczegóły żądania
### 2.1 Lista szablonów
- **Metoda HTTP:** GET
- **URL:** `/api/v1/templates`
- **Nagłówki:** `Authorization: Bearer <access_token>` _(wymagany)_
- **Parametry zapytania:**
  - `type` _(opcjonalny)_: `red_wine | white_wine | rose_wine | fruit_wine | mead`
- **Body:** brak

### 2.2 Szczegóły szablonu
- **Metoda HTTP:** GET
- **URL:** `/api/v1/templates/{template_id}`
- **Nagłówki:** `Authorization: Bearer <access_token>` _(wymagany)_
- **Parametry ścieżki:**
  - `template_id` _(wymagany)_: UUID ważnego szablonu
- **Body:** brak

## 3. Wykorzystywane typy
- **DTO**
  - `TemplateListItemDto`
  - `TemplateDto`
  - `TemplateStageDto`
  - `TemplateListResponseDto`
  - `ErrorResponseDto`
- **Encje**
  - `TemplateEntity` (`templates`)
  - `TemplateStageEntity` (`template_stages`)
- **Enums**
  - `BatchType`
  - `StageName`

## 4. Szczegóły odpowiedzi
### 4.1 Sukces
| Endpoint | Status | Typ odpowiedzi |
|----------|--------|----------------|
| `/api/v1/templates` | 200 | `TemplateListResponseDto` |
| `/api/v1/templates/{id}` | 200 | `TemplateDto` |

### 4.2 Błędy
| Kod | Przyczyna | Body |
|-----|----------|------|
| 400 | Nieprawidłowe UUID / wartość `type` | `ErrorResponseDto` |
| 401 | Brak lub nieważny token | `ErrorResponseDto` |
| 404 | Szablon nie istnieje | `ErrorResponseDto` |
| 500 | Błąd serwera / Supabase | `ErrorResponseDto` |

## 5. Przepływ danych
1. **Middleware `src/middleware/index.ts`** weryfikuje nagłówek `Authorization` i dołącza `supabase` client powiązany z użytkownikiem.
2. **Handler** (np. `src/pages/api/v1/templates/index.ts`) odczytuje parametry zapytania i deleguje do **TemplateService**.
3. **TemplateService**
   1. Wywołuje Supabase:
      - Lista: `supabase.from('templates').select('*').eq('type', type?)`
      - Detal: `supabase.from('templates').select('*,template_stages(*)').eq('id', template_id).single()`
   2. Mapuje dane do DTO.
4. **Rezultat** zwracany jest jako JSON z odpowiednim kodem.

## 6. Względy bezpieczeństwa
- Wszystkie operacje wymagają tokena JWT Supabase (rola `authenticated`).
- RLS w tabelach `templates` i `template_stages` ogranicza dostęp tylko do SELECT.
- Walidacja:
  - `template_id` musi być prawidłowym UUID (biblioteka `zod` lub natywny regex).
  - `type` musi być jedną z wartości `BatchType`.
- Ochrona przed **SQL Injection** zapewniona przez zapytania Supabase RPC.

## 7. Obsługa błędów
- **Walidacja**: gdy `template_id` lub `type` nie przejdą walidacji → 400.
- **Brak autoryzacji**: brak/niepoprawny token → 401 (odrzucone w middleware lub Supabase).
- **Brak zasobu**: Supabase zwraca `data=null` → 404.
- **Supabase error**: `error` obecne w odpowiedzi → 500 i log do konsoli / Sentry.

## 8. Rozważania dotyczące wydajności
- **Projection**: wybieramy tylko potrzebne kolumny.
- **Indeks**: (`template_id`, `position`) już istnieje dla `template_stages`.
- **Caching**: Możliwe dodanie Cerebral/HTTP cache w CDN (publiczne, bo dane bezpieczne ale read-only).

## 9. Etapy wdrożenia
1. **Stworzenie TemplateService** `src/lib/template.service.ts`:
   - `getTemplates(filter?: BatchType)`
   - `getTemplateById(id: string)`
2. **Dodanie walidatorów** (`src/lib/validators.ts`) przy użyciu `zod`.
3. **Endpoint listy** `src/pages/api/v1/templates/index.ts`:
   - Parsowanie query, walidacja, wywołanie service, mapowanie do `TemplateListResponseDto`.
4. **Endpoint szczegółu** `src/pages/api/v1/templates/[id].ts`:
   - Walidacja UUID, wywołanie service, mapowanie do `TemplateDto`.
5. **Aktualizacja middleware** jeśli potrzebne (już przetwarza token).

