1. Wprowadzenie i cele testowania
1.1. Wprowadzenie

Niniejszy dokument przedstawia kompleksowy plan testów dla aplikacji internetowej WineLog, przeznaczonej do zarządzania procesem domowej produkcji wina i miodu pitnego. Aplikacja, oparta o nowoczesny stos technologiczny (Astro, React, Supabase), ma na celu uproszczenie i udokumentowanie procesu produkcyjnego dla początkujących i średniozaawansowanych entuzjastów.

Plan ten obejmuje strategię, zakres, zasoby oraz harmonogram działań testowych niezbędnych do zapewnienia jakości, stabilności i zgodności z wymaganiami dla wersji MVP (Minimum Viable Product).
1.2. Cele testowania

Głównym celem procesu testowania jest weryfikacja, czy aplikacja WineLog spełnia zdefiniowane wymagania funkcjonalne i niefunkcjonalne oraz zapewnienie wysokiej jakości produktu końcowego.

Szczegółowe cele:

    Zapewnienie poprawności funkcjonalnej: Weryfikacja, czy wszystkie kluczowe funkcje MVP, takie jak zarządzanie kontem użytkownika, tworzenie partii z szablonów, postęp etapów, system notatek i archiwizacja, działają zgodnie ze specyfikacją.

    Wykrycie i eliminacja defektów: Identyfikacja, raportowanie i śledzenie błędów w celu ich naprawy przed wdrożeniem produkcyjnym.

    Weryfikacja integracji: Sprawdzenie poprawnej komunikacji między frontendem (Astro/React) a backendem (Supabase), w tym autentykacji, operacji na bazie danych i obsługi API.

    Ocena użyteczności i UX: Zapewnienie, że interfejs użytkownika jest intuicyjny, responsywny (zgodnie z podejściem mobile-first) i przyjazny dla docelowej grupy odbiorców.

    Potwierdzenie stabilności i wydajności: Upewnienie się, że aplikacja działa stabilnie pod typowym obciążeniem i zapewnia akceptowalny czas odpowiedzi.

2. Zakres testów
2.1. Funkcjonalności objęte testami (In-Scope)

Testy obejmą wszystkie funkcje zdefiniowane w zakresie MVP projektu:

    Zarządzanie kontem użytkownika:

        Rejestracja nowego użytkownika (e-mail/hasło).

        Logowanie i wylogowywanie.

        Miękka weryfikacja adresu e-mail.

        Zarządzanie sesją użytkownika (ważność 30 dni).

        Usuwanie konta.

    Dashboard:

        Wyświetlanie listy aktywnych partii.

        Dostęp do archiwum.

    Zarządzanie partiami (Batches):

        Tworzenie nowej partii na podstawie predefiniowanych szablonów (wino czerwone, białe, różowe, owocowe, miód pitny).

        Automatyczne generowanie etapów produkcji na podstawie szablonu.

        Postęp między kolejnymi etapami (Przygotowanie → Fermentacja → Klarowanie → Dojrzewanie → Butelkowanie).

    System notatek:

        Tworzenie, odczyt, aktualizacja i usuwanie (CRUD) notatek powiązanych z partią i etapem.

    Archiwum i oceny:

        Przenoszenie ukończonych partii do archiwum.

        Przeglądanie zarchiwizowanych partii.

        Ocenianie ukończonych partii w skali 1-5 gwiazdek.

2.2. Funkcjonalności wyłączone z testów (Out-of-Scope)

Następujące elementy, zgodnie z definicją MVP, są wyłączone z formalnego zakresu testów:

    Natywne aplikacje mobilne.

    Zaawansowane kalkulatory winiarskie.

    Funkcje społecznościowe.

    Powiadomienia (e-mail, push).

    Tworzenie własnych, niestandardowych szablonów.

    Tryb offline.

    Eksport danych.

3. Typy testów do przeprowadzenia

W celu zapewnienia kompleksowej jakości, zastosowane zostaną następujące rodzaje testów:

    Testy statyczne:

        Linting (ESLint) i formatowanie (Prettier): Automatyczna weryfikacja spójności i jakości kodu, uruchamiana przed każdym commitem za pomocą lint-staged i husky.

        Kontrola typów (TypeScript): Wykorzystanie statycznego typowania do wczesnego wykrywania błędów w kodzie.

    Testy jednostkowe (Unit Tests):

        Cel: Weryfikacja poprawności działania izolowanych fragmentów kodu (funkcje, hooki React, serwisy).

        Zakres: Funkcje pomocnicze (/lib/utils.ts), walidatory Zod (/lib/validators.ts), logika serwisów (/lib/*.service.ts) z zamockowanymi zależnościami (np. klientem Supabase).

    Testy komponentów (Component Tests):

        Cel: Sprawdzenie renderowania, interakcji i zarządzania stanem pojedynczych komponentów React.

        Zakres: Interaktywne komponenty UI, takie jak formularze (LoginForm, NoteForm), przyciski z logiką (ButtonNextStage), karty (BatchCard), z zamockowanymi wywołaniami API.

    Testy integracyjne (Integration Tests):

        Cel: Weryfikacja poprawnej współpracy między różnymi częściami systemu.

        Zakres: Testowanie przepływu danych między komponentami React, warstwą API aplikacji (/src/pages/api/**), a zamockowaną usługą Supabase w celu sprawdzenia, czy żądania i odpowiedzi są poprawnie obsługiwane.

    Testy End-to-End (E2E):

        Cel: Symulacja pełnych scenariuszy użytkownika w rzeczywistym środowisku przeglądarki, weryfikująca cały stos technologiczny.

        Zakres: Pełne ścieżki użytkownika, np. "Rejestracja -> Logowanie -> Stworzenie partii -> Dodanie notatki -> Przejście do kolejnego etapu -> Zakończenie partii -> Ocena".

    Testy manualne i eksploracyjne:

        Cel: Weryfikacja użyteczności (UX), dostępności (a11y), zgodności wizualnej z projektem oraz wykrywanie nieoczywistych błędów trudnych do zautomatyzowania.

        Zakres: Testowanie na różnych urządzeniach (desktop, tablet, mobile) i przeglądarkach; testowanie "na krawędzi" funkcjonalności.

    Podstawowe testy wydajności:

        Cel: Ocena szybkości ładowania i responsywności aplikacji.

        Zakres: Analiza metryk Core Web Vitals za pomocą narzędzia Google Lighthouse dla kluczowych stron (Dashboard, Widok partii).

4. Scenariusze testowe dla kluczowych funkcjonalności

Poniżej przedstawiono wysokopoziomowe scenariusze testowe. Szczegółowe przypadki testowe zostaną opracowane w osobnym dokumencie lub systemie do zarządzania testami.
ID	Funkcjonalność	Scenariusz	Oczekiwany rezultat	Priorytet
AUTH	Autentykacja			Krytyczny
AUTH-01	Rejestracja	Użytkownik poprawnie wypełnia formularz rejestracyjny.	Konto zostaje utworzone, użytkownik jest zalogowany i przekierowany na Dashboard.	Wysoki
AUTH-02	Rejestracja	Użytkownik podaje niepoprawne dane (np. hasła niezgodne, email w złym formacie).	Wyświetlane są odpowiednie komunikaty o błędach walidacji.	Wysoki
AUTH-03	Logowanie	Użytkownik podaje prawidłowe dane logowania.	Użytkownik jest zalogowany i przekierowany na Dashboard.	Wysoki
AUTH-04	Logowanie	Użytkownik podaje nieprawidłowe dane logowania.	Wyświetlany jest komunikat o błędzie.	Wysoki
AUTH-05	Wylogowanie	Zalogowany użytkownik klika przycisk "Wyloguj".	Użytkownik zostaje wylogowany i przekierowany na stronę główną/logowania.	Średni
AUTH-06	Sesja	Użytkownik zamyka i ponownie otwiera przeglądarkę przed wygaśnięciem sesji.	Użytkownik pozostaje zalogowany.	Średni
BATCH	Zarządzanie partiami			Krytyczny
BATCH-01	Tworzenie partii	Użytkownik wybiera szablon i tworzy nową partię.	Partia jest tworzona, a użytkownik zostaje przekierowany do jej widoku szczegółowego. Etapy są poprawnie wygenerowane.	Wysoki
BATCH-02	Postęp etapów	Użytkownik w widoku partii przechodzi do następnego etapu.	Bieżący etap zostaje oznaczony jako ukończony, a kolejny staje się aktywny. Oś czasu jest zaktualizowana.	Wysoki
BATCH-03	Dodawanie notatki	Użytkownik dodaje notatkę do bieżącego etapu.	Notatka pojawia się na liście notatek w widoku partii.	Wysoki
BATCH-04	Edycja nazwy partii	Użytkownik edytuje nazwę aktywnej partii.	Nazwa zostaje pomyślnie zaktualizowana.	Średni
BATCH-05	Zakończenie partii	Użytkownik kończy ostatni etap produkcji.	Partia otrzymuje status "ukończona" i zostaje przeniesiona do archiwum.	Wysoki
ARCH	Archiwum i oceny			Ważny
ARCH-01	Przeglądanie archiwum	Użytkownik przechodzi do widoku archiwum.	Wyświetlana jest lista wszystkich ukończonych partii.	Średni
ARCH-02	Ocena partii	Użytkownik w widoku zarchiwizowanej partii dodaje ocenę (1-5 gwiazdek).	Ocena zostaje zapisana i jest widoczna.	Średni
5. Środowisko testowe

    Środowisko deweloperskie (lokalne):

        System operacyjny: Windows, macOS, Linux.

        Wersja Node.js: >= 22.14.

        Przeglądarki: Chrome, Firefox (najnowsze wersje).

        Backend: Lokalna instancja Supabase uruchamiana przez Supabase CLI.

    Środowisko testowe (Staging):

        Infrastruktura: Osobny projekt na DigitalOcean.

        Baza danych: Dedykowany, odizolowany projekt Supabase z danymi testowymi, który jest czyszczony przed każdą serią testów E2E.

        Dostęp: Ograniczony dla zespołu deweloperskiego i QA.

    Środowisko CI/CD (GitHub Actions):

        Środowisko do uruchamiania testów automatycznych (jednostkowych, komponentów, integracyjnych) przy każdym pushu do repozytorium oraz przed mergem do gałęzi głównej.

6. Narzędzia do testowania
Typ testu	Proponowane narzędzie	Uzasadnienie
Testy jednostkowe, komponentów i integracyjne	Vitest + React Testing Library	Vitest jest natywnym runnerem testów dla Vite, na którym opiera się Astro, co zapewnia szybkość i łatwą konfigurację. React Testing Library to standard w testowaniu komponentów React, promujący dobre praktyki.
Mockowanie API	Mock Service Worker (MSW)	Pozwala na przechwytywanie i mockowanie żądań sieciowych na poziomie sieci, co umożliwia realistyczne testowanie integracji API bez zależności od prawdziwego backendu.
Testy E2E	Playwright	Nowoczesne i potężne narzędzie do testów E2E, oferujące szybkie i stabilne testy na różnych przeglądarkach, a także doskonałe narzędzia do debugowania.
Raportowanie błędów	GitHub Issues	Zintegrowane z repozytorium kodu, umożliwia łatwe powiązanie błędów z commitami i pull requestami. Zostanie stworzony szablon zgłaszania błędów.
Wydajność	Google Lighthouse	Wbudowane w narzędzia deweloperskie Chrome, stanowi branżowy standard do audytu wydajności, SEO i dostępności.
CI/CD	GitHub Actions	Narzędzie już skonfigurowane w projekcie, idealne do automatyzacji uruchamiania testów w pipeline.
7. Harmonogram testów

Proces testowania będzie prowadzony w sposób ciągły, równolegle z procesem deweloperskim.

    Testy jednostkowe i komponentów: Pisane przez deweloperów w trakcie implementacji nowych funkcji. Muszą być ukończone i przechodzić pomyślnie przed zgłoszeniem zadania do przeglądu (Code Review).

    Testy integracyjne: Pisane przez deweloperów/QA po zintegrowaniu kilku komponentów/serwisów. Uruchamiane automatycznie w pipeline CI.

    Testy E2E: Rozwijane przez inżyniera QA w trakcie sprintu. Pełna regresja E2E będzie uruchamiana przed każdym wdrożeniem na produkcję.

    Testy manualne i eksploracyjne: Przeprowadzane przez inżyniera QA po zakończeniu implementacji większych funkcjonalności oraz przed wydaniem wersji.

    Testy regresji: Pełen cykl testów automatycznych i manualnych (krytyczne ścieżki) przeprowadzany przed każdym wdrożeniem na środowisko produkcyjne.

8. Kryteria akceptacji testów
8.1. Kryteria wejścia (Entry Criteria)

    Plan testów został zatwierdzony.

    Środowisko testowe jest przygotowane i dostępne.

    Funkcjonalność przeznaczona do testów została wdrożona na środowisku testowym.

    Podstawowe testy jednostkowe i komponentów dla danej funkcjonalności zostały napisane i przechodzą pomyślnie.

8.2. Kryteria wyjścia (Exit Criteria)

    100% zdefiniowanych scenariuszy testowych o priorytecie Krytycznym i Wysokim zakończyło się powodzeniem.

    Pokrycie kodu (Code Coverage) testami jednostkowymi i komponentów dla nowo dodanego kodu wynosi minimum 80%.

    Wszystkie zidentyfikowane błędy krytyczne (Blocker, Critical) zostały naprawione i zweryfikowane.

    Brak znanych błędów o wysokim priorytecie (Major), które nie zostałyby zaakceptowane przez Product Ownera jako znane problemy.

    Raport z testów został wygenerowany i przedstawiony interesariuszom.

9. Role i odpowiedzialności w procesie testowania

    Deweloperzy:

        Odpowiedzialni za pisanie testów jednostkowych i komponentów dla tworzonego przez siebie kodu.

        Naprawianie błędów zgłoszonych przez zespół QA.

        Utrzymanie progu pokrycia kodu testami.

    Inżynier QA (Test Lead):

        Tworzenie i utrzymanie planu testów.

        Projektowanie i implementacja testów E2E oraz scenariuszy integracyjnych.

        Przeprowadzanie testów manualnych, eksploracyjnych i regresji.

        Zarządzanie procesem zgłaszania i cyklem życia błędów.

        Raportowanie wyników testów i komunikacja z zespołem.

    Product Owner / Project Manager:

        Definiowanie priorytetów dla testowanych funkcjonalności.

        Akceptacja ostatecznej wersji produktu na podstawie wyników testów.

        Podejmowanie decyzji o wdrożeniu w przypadku istnienia znanych błędów o niższym priorytecie.

10. Procedury raportowania błędów

Wszystkie wykryte błędy będą raportowane w GitHub Issues przy użyciu zdefiniowanego szablonu.
10.1. Szablon zgłoszenia błędu

    Tytuł: Krótki, zwięzły opis problemu.

    Środowisko: (np. Lokalne, Staging, Produkcja; Przeglądarka, System Operacyjny).

    Kroki do odtworzenia: Szczegółowa, numerowana lista kroków potrzebnych do wywołania błędu.

    Obserwowany rezultat: Co faktycznie się stało.

    Oczekiwany rezultat: Co powinno się stać.

    Priorytet: (Krytyczny, Wysoki, Średni, Niski).

    Załączniki: (np. zrzuty ekranu, nagrania wideo, logi z konsoli).