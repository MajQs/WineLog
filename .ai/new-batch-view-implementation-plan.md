# Plan implementacji widoku „Nowy nastaw”

## 1. Przegląd
Modal „Nowy nastaw” umożliwia użytkownikowi utworzenie nowego nastawu w dwóch kliknięciach. Pozwala wybrać szablon produkcji z listy oraz, opcjonalnie, wprowadzić własną nazwę nastawu. Widok wyświetlany jest jako modal na trasie `/batches/new` i komunikuje się z backendem poprzez endpointy:
* GET `/api/v1/templates` – pobranie dostępnych szablonów
* POST `/api/v1/batches` – utworzenie nastawu

## 2. Routing widoku
* Ścieżka: `/batches/new`
* Typ: modal route w Astro (np. `<RouteModal />` w layoucie lub użycie state routera)
* Dostępność: tylko dla zalogowanych użytkowników (middleware auth-guard)

## 3. Struktura komponentów
```
NowBatchModal
 ├─ TemplatePickerGrid
 │   └─ TemplateCard (×N)
 ├─ InputName
 ├─ FormError
 └─ FooterActions
     ├─ ButtonCreate
     └─ ButtonCancel
```

## 4. Szczegóły komponentów
### NowBatchModal
- Opis: kontener modalu; zarządza stanem formularza, walidacją i wywołaniami API.
- Główne elementy: `Dialog`, `form`, `TemplatePickerGrid`, `InputName`, `FormError`, `FooterActions`.
- Obsługiwane interakcje: wybór szablonu, wprowadzenie nazwy, klik „Utwórz”, klik „Anuluj”, ESC, klik poza modalem.
- Walidacja: wymaga wyboru `template_id`; `name` ≤ 100 znaków.
- Typy: `CreateBatchViewModel`, `CreateBatchCommand`, `TemplateListItemDto`.
- Propsy: `isOpen:boolean`, `onClose:()⇒void`.

### TemplatePickerGrid
- Opis: wyświetla siatkę kart szablonów; pozwala wybrać jeden.
- Główne elementy: układ CSS grid, komponenty `TemplateCard`.
- Interakcje: klik na kartę, klawiatura (Enter/Space), focus ring.
- Walidacja: co najmniej jedna karta musi zostać wybrana.
- Typy: `TemplateListItemDto` (props).
- Propsy: `templates:TemplateListItemDto[]`, `selectedId?:string`, `onSelect:(id:string)⇒void`.

### TemplateCard
- Opis: pojedyncza karta szablonu.
- Elementy: nazwa, typ (badge), wersja.
- Interakcje: klik, hover, aria-pressed.
- Walidacja: none.
- Typy: `TemplateListItemDto`.
- Propsy: `template:TemplateListItemDto`, `selected:boolean`, `onClick:()⇒void`.

### InputName
- Opis: pole tekstowe na opcjonalną nazwę nastawu.
- Elementy: `Label`, `Input`, `Hint`.
- Interakcje: wpisywanie, blur.
- Walidacja: maxLength 100; komunikat błędu.
- Typy: `string`.
- Propsy: `value:string`, `onChange:(v:string)⇒void`, `error?:string`.

### FormError
- Opis: globalny komunikat błędu (np. błąd sieci, walidacji backendu).
- Propsy: `message?:string`.

### FooterActions
- Opis: przyciski akcji.
- Elementy: `ButtonCreate` (primary, full-width, spinner), `ButtonCancel` (secondary).
- Interakcje: click.
- Walidacja: `ButtonCreate` disabled gdy `isSubmitting` lub brak `template_id`.
- Typy: brak.
- Propsy: `disabled:boolean`, `isSubmitting:boolean`, `onSubmit:()⇒void`, `onCancel:()⇒void`.

## 5. Typy
### TemplateListItemDto (backend)
Patrz `src/types.ts` linie 144-149.

### CreateBatchCommand (backend)
```
{
  template_id: string;
  name?: string;
}
```

### CreateBatchViewModel (frontend)
```
{
  templateId: string | null;   // wybrany szablon
  name: string;                // nazwa input
  error?: string;              // globalny błąd
  fieldErrors?: {
    name?: string;
  };
  isSubmitting: boolean;
}
```

## 6. Zarządzanie stanem
- Lokalny stan w komponencie `NowBatchModal` z użyciem hooka `useState` / `useReducer`.
- Dedykowany hook `useCreateBatch()` opakowujący logikę mutacji i react-query (optimistic UI, cache invalidation `batches` i `dashboard`).
- `react-query` (queryClient) do pobierania szablonów (`useQuery('templates', ...)`).

## 7. Integracja API
1. Pobranie szablonów:
```ts
GET /api/v1/templates?type=...
→ TemplateListResponseDto
```
   - Mapujemy na `TemplateListItemDto[]` do `TemplatePickerGrid`.
2. Utworzenie nastawu:
```ts
POST /api/v1/batches
(body: CreateBatchCommand)
→ BatchDto (skrót: BatchListItemDto do cache listy)
```
   - Po sukcesie: zamknięcie modalu, redirect do `/batches/{id}` lub refresh dashboardu.

## 8. Interakcje użytkownika
1. Użytkownik otwiera modal – ładowanie szablonów (spinner).
2. Wybiera szablon – karta podświetlona.
3. (Opcjonalnie) wpisuje nazwę – walidacja on-input.
4. Klik „Utwórz” – spinner, przycisk disabled.
5. Po sukcesie – modal zamyka się, toast „Nastaw utworzony”, redirect.
6. Po błędzie – `FormError` wyświetla komunikat w języku PL.
7. ESC lub „Anuluj” – zamknięcie modalu bez zmian.

## 9. Warunki i walidacja
| Pole | Warunek | Komponent | UI Reakcja |
|------|---------|-----------|------------|
| template_id | wymagane | NowBatchModal | border-error TemplatePickerGrid, disable „Utwórz” |
| name | max 100 znaków | InputName | komunikat pod polem |
| backend 400 | różne kody | FormError | komunikat z API |

## 10. Obsługa błędów
- 400 `NAME_TOO_LONG` → highlight pola `InputName`.
- 409 `RESOURCE_NOT_FOUND` (brak szablonu) → toast & reload templates.
- 401/403 → redirect do logowania.
- Network error → retry button, komunikat „Brak połączenia”.

## 11. Kroki implementacji
1. Utwórz trasę modalową `/batches/new` w Astro (`src/pages/batches/new.astro`).
2. Zaimportuj i osadź komponent `NowBatchModal`.
3. Zaimplementuj hook `useTemplates()` (react-query) oraz `useCreateBatch()`.
4. Zbuduj `TemplateCard`, `TemplatePickerGrid` z selekcją.
5. Dodaj `InputName` z limitowaniem znaków.
6. Opracuj globalną walidację w `NowBatchModal` (z `zod` lub własne).
7. Podłącz `ButtonCreate` do `useCreateBatch()`; obsłuż loading i błędy.
8. Po sukcesie odśwież cache `batches/dashboard`, zamknij modal, redirect.
10. Zastosuj style Tailwind + shadcn/ui (`Dialog`, `Button`, `Input`, `Card`).
11. Przejrzyj dostępność – focus trap, aria-labels, role `dialog`.
