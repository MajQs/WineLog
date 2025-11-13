# Testing Conventions

## Struktura testów

### Lokalizacja testów (Colocation Pattern)

Umieszczamy testy **obok testowanego kodu** (colocation):

```
src/
├── lib/
│   └── hooks/
│       ├── useDashboardData.ts
│       └── useDashboardData.test.tsx  ← test obok kodu
├── components/
│   ├── DashboardView.tsx
│   └── DashboardView.test.tsx  ← test obok kodu
└── test/
    ├── setup.ts       ← konfiguracja globalna
    ├── test-utils.tsx ← helper functions
    └── README.md      ← ten plik
```

**Zalety:**
- ✅ Łatwe znalezienie testów dla danego pliku
- ✅ Zachęca do testowania podczas pisania kodu
- ✅ Łatwiejsze refaktoryzacje
- ✅ Standard w ekosystemie Vitest + React

### Nazewnictwo plików

- Testy jednostkowe: `*.test.ts` lub `*.test.tsx`
- Testy integracyjne: `*.integration.test.ts`
- Testy E2E: używamy Playwright w katalogu `tests/` (poza `src/`)

### Rozszerzenia plików

- `.test.tsx` - gdy test renderuje komponenty React lub używa JSX
- `.test.ts` - gdy test sprawdza logikę bez renderowania (pure functions, services)

## Składnia testów

### Używamy `test` zamiast `it`

```typescript
// ✅ Dobrze - używamy test
describe("useDashboardData", () => {
  test("should return transformed batches", () => {
    // ...
  });
});

// ❌ Źle - nie używamy it
describe("useDashboardData", () => {
  it("should return transformed batches", () => {
    // ...
  });
});
```

**Uzasadnienie:** 
- Bardziej bezpośredni i jasny
- Spójność z innymi testami w projekcie
- `test` i `it` to aliasy - działają identycznie

## Struktura testu

### Wzorzec AAA (Arrange-Act-Assert)

```typescript
test("should format date correctly", () => {
  // Arrange - przygotowanie danych
  const date = "2024-01-15T10:00:00Z";
  
  // Act - wykonanie akcji
  const result = formatDate(date);
  
  // Assert - sprawdzenie wyniku
  expect(result).toBe("15.01.2024");
});
```

### Grupowanie testów z `describe`

```typescript
describe("ComponentName", () => {
  describe("Success cases", () => {
    test("should handle valid data", () => {});
    test("should handle empty data", () => {});
  });

  describe("Error handling", () => {
    test("should handle network error", () => {});
    test("should handle validation error", () => {});
  });

  describe("Edge cases", () => {
    test("should handle very long strings", () => {});
    test("should handle zero values", () => {});
  });
});
```

## Dobre praktyki

### 1. Nazwy testów

```typescript
// ✅ Dobrze - opisowe, kompletne zdanie
test("should return empty array when no active batches", () => {});

// ❌ Źle - zbyt ogólne
test("empty array", () => {});
```

### 2. Mock'owanie

```typescript
// Używamy vi.mock() na górze pliku
vi.mock("../api/dashboard", () => ({
  fetchDashboard: vi.fn(),
}));

// Type-safe mocks
const mockFetchDashboard = vi.mocked(fetchDashboard);

// W testach
mockFetchDashboard.mockResolvedValue(mockData);
```

### 3. Async/await w testach

```typescript
test("should fetch data asynchronously", async () => {
  // Arrange
  mockFetch.mockResolvedValue(data);

  // Act
  const { result } = renderHook(() => useMyHook());

  // Assert - używamy waitFor dla asynchronicznych zmian
  await waitFor(() => expect(result.current.isLoading).toBe(false));
});
```

### 4. Czyszczenie po testach

```typescript
describe("MyComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Czyści historię wywołań
  });

  afterEach(() => {
    vi.resetAllMocks(); // Reset implementacji
  });
});
```

## Testowanie komponentów React

### Renderowanie z providerami

```typescript
import { renderWithProviders } from "@/test/test-utils";

test("should render component", () => {
  const { getByText } = renderWithProviders(<MyComponent />);
  expect(getByText("Hello")).toBeInTheDocument();
});
```

### Testowanie hooków

```typescript
import { renderHook, waitFor } from "@testing-library/react";

test("should return data from hook", async () => {
  const { result } = renderHook(() => useMyHook(), {
    wrapper: createWrapper(), // QueryProvider itp.
  });

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.data).toBeDefined();
});
```

## Pokrycie kodu (Coverage)

### Uruchamianie testów z pokryciem

```bash
npm run test:coverage
```

### Progi pokrycia

Skonfigurowane w `vitest.config.ts`:
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

### Co testować priorytetowo

1. **Logika biznesowa** - transformacje danych, walidacje
2. **Warunki brzegowe** - puste dane, null, undefined, 0
3. **Obsługa błędów** - network errors, validation errors
4. **Kluczowe przepływy** - success paths, error paths
5. **Komponenty interaktywne** - przyciski, formularze, nawigacja

### Co pomijać w testach jednostkowych

- Komponenty czysto prezentacyjne (snapshot testy lub E2E)
- Proste style/CSS
- Pliki konfiguracyjne
- Mock data
- Typy TypeScript (type-checking robi kompilator)

## Uruchamianie testów

```bash
# Wszystkie testy
npm test

# Watch mode (automatycznie przy zmianach)
npm test -- --watch

# Pojedynczy plik
npm test -- src/lib/hooks/useDashboardData.test.tsx

# Z interfejsem graficznym
npm run test:ui

# Z pokryciem kodu
npm run test:coverage
```

## Debugowanie testów

### 1. Fokus na pojedynczym teście

```typescript
// Uruchomi tylko ten test
test.only("should do something", () => {});

// Pominie ten test
test.skip("should do something", () => {});
```

### 2. Zwiększenie timeout dla wolnych testów

```typescript
test("slow operation", async () => {
  // ...
}, { timeout: 10000 }); // 10 sekund
```

### 3. Debug output

```typescript
import { screen, debug } from "@testing-library/react";

test("debug test", () => {
  renderWithProviders(<MyComponent />);
  
  // Wyświetli aktualny stan DOM
  screen.debug();
  
  // lub
  debug();
});
```

## Przykłady

### Test funkcji pomocniczej

```typescript
// src/lib/utils.ts
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

// src/lib/utils.test.ts
describe("truncateText", () => {
  test("should return original text when shorter than limit", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
  });

  test("should truncate and add ellipsis when longer than limit", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello…");
  });

  test("should handle empty string", () => {
    expect(truncateText("", 5)).toBe("");
  });
});
```

### Test hooka React Query

```typescript
describe("useDashboardData", () => {
  test("should fetch and transform data", async () => {
    // Arrange
    const mockData = { active_batches: [], archived_batches_count: 0 };
    mockFetchDashboard.mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(() => useDashboardData(), {
      wrapper: createWrapper(),
    });

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.batches).toEqual([]);
    expect(result.current.archivedCount).toBe(0);
  });
});
```

### Test komponentu

```typescript
describe("BatchCard", () => {
  test("should render batch name", () => {
    const batch = { id: "1", name: "Test Batch", /* ... */ };
    
    const { getByText } = renderWithProviders(<BatchCard batch={batch} />);
    
    expect(getByText("Test Batch")).toBeInTheDocument();
  });

  test("should navigate on click", async () => {
    const batch = { id: "123", name: "Test", /* ... */ };
    const user = userEvent.setup();
    
    const { getByRole } = renderWithProviders(<BatchCard batch={batch} />);
    const card = getByRole("button");
    
    await user.click(card);
    
    // Verify navigation (with mocked window.location)
    expect(window.location.href).toContain("/batches/123");
  });
});
```

## Zasoby

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TanStack Query Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)

