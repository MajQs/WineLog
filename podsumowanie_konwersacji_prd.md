# Podsumowanie Konwersacji - Planowanie PRD dla MVP

<conversation_summary>

<decisions>
1. Aplikacja ma obsługiwać jednocześnie wiele aktywnych nastawów przez jednego użytkownika z możliwością łatwego przełączania się między nimi

2. Etapy produkcji obejmują: przygotowanie nastawu, ewentualne tłoczenie lub maceracja, oddzielanie, fermentacja burzliwa, fermentacja cicha, dojrzewanie/maturacja, klarowanie, zlewanie z nad osadu, butelkowanie. Etapy są odpowiednie zarówno dla wina jak i miodu pitnego

3. Możliwość restartu fermentacji w dowolnej chwili - restart oznacza ponowne rozpoczęcie fermentacji z aktualną datą, historia restartów w notatkach, bez cofania etapu

4. Na etap MVP notyfikacje nie są potrzebne, ale architektura powinna być przygotowana na taką możliwość (np. notyfikacje e-mail)

5. MVP: notatki tekstowe z polami: data, działanie, obserwacje. Architektura przygotowana na dodanie podstawowych pomiarów w przyszłości

6. Dla MVP: uproszczona rejestracja (e-mail + hasło) wraz z koniecznością weryfikacji e-mail. Logowanie przez zewnętrzne serwisy (OAuth) można dodać w kolejnej iteracji

7. Model "soft verification" - użytkownik może rozpocząć korzystanie z aplikacji natychmiast po rejestracji, ale otrzymuje przypomnienia o weryfikacji. Link weryfikacyjny ważny przez 7 dni

8. Bezterminowe przechowywanie zakończonych nastawów w archiwum z możliwością ręcznego usunięcia przez użytkownika

9. Prosta ocena ogólna 1-5 gwiazdek z możliwością rozszerzenia w przyszłości

10. Mała skala (do 1000 użytkowników) z prostymi rozwiązaniami, z planem skalowania w przyszłości

11. W MVP wprowadź 3-5 podstawowych szablonów: wino czerwone, wino białe, wino różowe, miód pitny klasyczny, ewentualnie wino owocowe. Każdy szablon z nazwą etapów, sugerowanymi czasami trwania, opisami i składnikami

12. W MVP ograniczenie do win i miodów pitnych, elastyczna struktura danych na przyszłość

13. Dashboard: lista aktywnych nastawów (nazwa, typ, data, etap, ostatnia notatka), sekcja Archiwum, przycisk "Nowy nastaw"

14. Użytkownik może przechodzić przez etapy sekwencyjnie, oznaczać etap jako "pominięty" lub wracać do poprzedniego z notatką, bez dodawania nowych etapów w MVP

15. Minimalne wymagane dane do utworzenia nastawu: nazwa (lub domyślna generowana) + wybór szablonu, możliwość szybkiego utworzenia z 2 kliknięciami

16. Wybór tłoczenia vs maceracji jest częścią etapu "przygotowanie nastawu", opcjonalny, z wyjaśnieniami dla początkujących

17. Użytkownik może zakończyć nastaw w dowolnym momencie (z opcjonalnym powodem w notatce). Po zakończeniu nastaw przenosi się do archiwum, gdzie użytkownik może dodać ocenę 1-5 gwiazdek

18. Aplikacja pozwala na przechodzenie między etapami w dowolnej kolejności z ostrzeżeniami przy pomijaniu etapów, walidacja po stronie serwera, przyjazne komunikaty błędów

19. Eksport danych w formacie JSON (wymagane przez RODO) - tylko to co wymagane przez RODO

20. Automatyczne wylogowanie użytkownika po wygaśnięciu sesji (30 dni nieaktywności lub wygaśnięcie tokenu) z komunikatem o konieczności ponownego zalogowania

21. W MVP nie jest konieczne pełne wersjonowanie notatek

22. Zbieranie anonimowych metryk zgodnie z RODO z możliwością wyłączenia przez użytkownika: liczba aktywnych nastawów na użytkownika, średni czas ukończenia nastawu, najczęściej wybierane szablony, punkty drop-off, czas spędzony w aplikacji

23. Aplikacja w pełni responsywna (320px-4K), mobile-first, priorytet dla urządzeń mobilnych i tabletów

24. W MVP: podstawowa funkcjonalność filtrowania nastawów po statusie (aktywne/zakończone) i typie (wino/miód pitny) oraz sortowanie po dacie

25. Wymagania wydajnościowe: ładowanie poniżej 3 sekund na 4G, reakcja interfejsu poniżej 200ms, lazy loading dla archiwum, loading states i skeleton screens

26. W MVP nie jest konieczny tryb offline/read-only

27. Wszystkie funkcje MVP mają być gotowe jednocześnie - nie fazowo
</decisions>

<matched_recommendations>
1. Architektura umożliwiająca prowadzenie kilku nastawów jednocześnie z niezależnym timeline i notatkami dla każdego

2. Definicja szczegółowej listy etapów produkcji z jasnymi opisami dla początkujących, wspólne etapy dla wina i miodu pitnego

3. Restart fermentacji jako opcja z zachowaniem historii w notatkach, bez cofania etapu

4. Architektura przygotowana na system notyfikacji (e-mail) pomimo braku implementacji w MVP

5. Minimalny zestaw pól notatek (data, działanie, obserwacje) z możliwością rozszerzenia o pomiary

6. Uproszczona rejestracja z weryfikacją e-mail, model soft verification umożliwiający korzystanie przed weryfikacją

7. Bezterminowe przechowywanie archiwum z możliwością ręcznego usunięcia

8. Prosta ocena 1-5 gwiazdek z możliwością rozszerzenia w przyszłości

9. Szablony z predefiniowanymi etapami, czasami trwania, opisami i składnikami dla 3-5 podstawowych typów

10. Elastyczna struktura danych pozwalająca na dodanie innych kategorii w przyszłości

11. Dashboard z listą aktywnych nastawów, sekcją archiwum i łatwym dostępem do tworzenia nowego nastawu

12. Elastyczność etapów: pomijanie, powrót do poprzedniego z notatką, bez możliwości dodawania nowych w MVP

13. Minimalne wymagane dane do utworzenia nastawu (nazwa + szablon) umożliwiające 2-kliknięciowe utworzenie

14. Wybór tłoczenia/maceracji jako część etapu przygotowania, opcjonalny, z wyjaśnieniami

15. Możliwość zakończenia nastawu w dowolnym momencie z przeniesieniem do archiwum i opcją oceny

16. Obsługa błędów: przechodzenie między etapami w dowolnej kolejności z ostrzeżeniami, walidacja serwerowa, przyjazne komunikaty

17. Eksport danych zgodny z RODO w formacie JSON

18. Zarządzanie sesją z automatycznym wylogowaniem i komunikatem

19. Architektura przygotowana na wersjonowanie, ale bez implementacji w MVP

20. Anonimowe metryki zgodne z RODO z możliwością wyłączenia

21. Responsywny design mobile-first z priorytetem dla urządzeń mobilnych i tabletów

22. Podstawowe filtrowanie i sortowanie nastawów w MVP

23. Wymagania wydajnościowe z lazy loading i loading states

24. Wszystkie funkcje MVP gotowe jednocześnie
</matched_recommendations>

<prd_planning_summary>

## Główne wymagania funkcjonalne produktu

### System kont użytkowników
- Rejestracja: e-mail + hasło z weryfikacją e-mail (soft verification model)
- Logowanie/wylogowywanie z automatycznym wylogowaniem po 30 dniach nieaktywności
- Zarządzanie kontem zgodne z RODO: eksport danych (JSON), usunięcie konta, szyfrowanie danych
- Brak OAuth w MVP (planowane na później)

### Zarządzanie nastawami
- Tworzenie nowego nastawu: minimalnie nazwa (lub domyślna) + wybór szablonu (2 kliknięcia)
- Szablony dostępne w MVP: wino czerwone, wino białe, wino różowe, miód pitny klasyczny, ewentualnie wino owocowe
- Każdy szablon zawiera: nazwę etapów, sugerowane czasy trwania, krótkie opisy, typowe składniki
- Obsługa wielu aktywnych nastawów jednocześnie z łatwym przełączaniem
- Ograniczenie do win i miodów pitnych w MVP

### Etapy produkcji
Sekwencja etapów (wspólna dla wina i miodu pitnego):
1. Przygotowanie nastawu (z opcjonalnym wyborem tłoczenia vs maceracji i wyjaśnieniami)
2. Ewentualne tłoczenie lub maceracja
3. Oddzielanie
4. Fermentacja burzliwa
5. Fermentacja cicha
6. Dojrzewanie/maturacja
7. Klarowanie
8. Zlewanie z nad osadu
9. Butelkowanie

Funkcjonalności etapów:
- Przechodzenie między etapami w dowolnej kolejności z ostrzeżeniami przy pomijaniu
- Możliwość oznaczenia etapu jako "pominięty" lub powrotu do poprzedniego z notatką
- Restart fermentacji w dowolnej chwili (oznaczenie ponownego rozpoczęcia z aktualną datą, historia w notatkach)
- Brak możliwości dodawania nowych etapów w MVP

### Notatki
- Pola notatek: data, działanie, obserwacje
- CRUD operacje: przeglądanie, tworzenie, edytowanie, usuwanie
- Brak wersjonowania w MVP (architektura przygotowana na przyszłość)
- Brak możliwości cofnięcia zmian
- Timestamp ostatniej edycji

### Archiwum i oceny
- Archiwizacja zakończonych nastawów z możliwością przeglądania
- Możliwość zakończenia nastawu w dowolnym momencie z opcjonalnym powodem w notatce
- Ocena zakończonego nastawu: 1-5 gwiazdek (prosta ocena ogólna)
- Bezterminowe przechowywanie z możliwością ręcznego usunięcia

### Dashboard i nawigacja
- Lista aktywnych nastawów z wyświetleniem: nazwa, typ (wino/miód), data rozpoczęcia, aktualny etap, ostatnia notatka
- Sekcja Archiwum dla zakończonych nastawów
- Przycisk "Nowy nastaw" z łatwym dostępem
- Filtrowanie: po statusie (aktywne/zakończone) i typie (wino/miód pitny)
- Sortowanie po dacie

### Obsługa błędów i walidacja
- Walidacja danych po stronie serwera
- Przyjazne komunikaty błędów dla użytkownika
- Logowanie błędów dla debugowania
- Ostrzeżenia przy pomijaniu etapów

## Kluczowe historie użytkownika i ścieżki korzystania

### Historia 1: Rejestracja i pierwszy nastaw
1. Użytkownik odwiedza aplikację
2. Rejestruje się (e-mail + hasło)
3. Otrzymuje e-mail weryfikacyjny (może korzystać przed weryfikacją)
4. Kliknie "Nowy nastaw"
5. Wybiera szablon (np. "Wino czerwone")
6. Nastaw zostaje utworzony w kilka kliknięć
7. Przechodzi do widoku szczegółów nastawu z listą etapów

### Historia 2: Prowadzenie nastawu
1. Użytkownik otwiera aktywny nastaw
2. Widzi listę etapów z aktualną pozycją
3. Dodaje notatkę do bieżącego etapu (data, działanie, obserwacje)
4. Przechodzi do następnego etapu (z ewentualnym ostrzeżeniem jeśli pomija etap)
5. W razie potrzeby restartuje fermentację (dodaje notatkę o restarcie)
6. Może wrócić do poprzedniego etapu z notatką wyjaśniającą powód
7. Może pominąć etap

### Historia 3: Zakończenie nastawu i ocena
1. Użytkownik po zakończeniu produkcji (w dowolnym momencie)
2. Oznacza nastaw jako zakończony (opcjonalnie dodaje powód w notatce)
3. Nastaw przenosi się do Archiwum
4. Użytkownik dodaje ocenę 1-5 gwiazdek
5. Może przeglądać zakończone nastawy w sekcji Archiwum

### Historia 4: Zarządzanie wieloma nastawami
1. Użytkownik ma kilka aktywnych nastawów jednocześnie
2. Widzi je wszystkie na dashboardzie
3. Przełącza się między nimi klikając na konkretny nastaw
4. Każdy nastaw ma niezależny timeline i notatki
5. Filtruje nastawy po typie (wino/miód) lub statusie (aktywne/zakończone)
6. Sortuje po dacie

### Historia 5: Eksport danych i zarządzanie kontem
1. Użytkownik przechodzi do ustawień konta
2. Eksportuje swoje dane w formacie JSON (RODO)
3. Może usunąć swoje konto wraz z wszystkimi danymi

## Ważne kryteria sukcesu i sposoby ich mierzenia

### Kryterium 1: Szybkość utworzenia nastawu
- **Metryka**: Czas od kliknięcia "Nowy nastaw" do utworzenia nastawu
- **Cel**: 2 kliknięcia, czas < 10 sekund
- **Pomiar**: Tracking czasu wykonania akcji

### Kryterium 2: Prostość przedstawienia etapów
- **Metryka**: Zrozumiałość opisów etapów dla początkujących
- **Cel**: Użytkownik rozumie każdy etap bez dodatkowych wyjaśnień
- **Pomiar**: User testing z początkującymi użytkownikami, feedback surveys

### Kryterium 3: Wydajność aplikacji
- **Metryka**: Czas ładowania strony, czas reakcji interfejsu
- **Cel**: < 3 sekundy ładowanie na 4G, < 200ms reakcja interfejsu
- **Pomiar**: Performance monitoring, Core Web Vitals

### Kryterium 4: Responsywność
- **Metryka**: Funkcjonalność na różnych urządzeniach
- **Cel**: Pełna funkcjonalność na urządzeniach 320px-4K, priorytet mobile/tablet
- **Pomiar**: Testing na różnych urządzeniach i rozdzielczościach

### Kryterium 5: Satysfakcja użytkownika
- **Metryka**: Średnia ocena nastawów, czas spędzony w aplikacji, retention rate
- **Cel**: Wysoka retencja, pozytywne feedbacki
- **Pomiar**: Anonimowe metryki: liczba aktywnych nastawów na użytkownika, średni czas ukończenia nastawu, najczęściej wybierane szablony, punkty drop-off

### Kryterium 6: Skalowalność
- **Metryka**: Wydajność przy rosnącej liczbie użytkowników
- **Cel**: Obsługa do 1000 użytkowników z prostymi rozwiązaniami
- **Pomiar**: Load testing, monitoring wydajności

## Ograniczenia projektowe i ich wpływ

### Techniczne
- **Aplikacja tylko webowa** - brak aplikacji mobilnych w MVP (planowane na później)
- **Online tylko** - brak trybu offline w MVP (planowane na później)
- **Skala do 1000 użytkowników** - wymaga prostych rozwiązań infrastrukturalnych

### Funkcjonalne
- **Brak zaawansowanych kalkulatorów** - aplikacja dla początkujących/średnio zaawansowanych
- **Tylko wino i miód pitny** - brak piwa i cydru w MVP
- **Brak notyfikacji** - architektura przygotowana, ale bez implementacji w MVP
- **Brak wersjonowania notatek** - możliwość edycji bez cofania zmian
- **Tylko eksport JSON** - zgodnie z wymaganiami RODO, bez eksportu PDF/CSV w MVP
- **Podstawowe filtrowanie** - tylko status i typ, sortowanie po dacie, brak zaawansowanego wyszukiwania

### Architektoniczne przygotowanie na przyszłość
- Struktura danych elastyczna na dodanie innych kategorii (piwo, cydr)
- Architektura przygotowana na notyfikacje e-mail
- Architektura przygotowana na wersjonowanie notatek
- Architektura przygotowana na pomiary w notatkach (temperatura, gęstość)
- Architektura przygotowana na tryb offline

</prd_planning_summary>

<unresolved_issues>
1. **Konkretne nazwy szablonów do implementacji** - Zadecydowano o 3-5 szablonach, ale nie określono dokładnie, które konkretnie mają być w MVP (wino czerwone, białe, różowe, miód pitny klasyczny są potwierdzone, ale "ewentualnie wino owocowe" wymaga decyzji)

2. **Szczegółowe opisy etapów w szablonach** - Wymagane są krótkie opisy co robić na każdym etapie dla początkujących, ale konkretna treść opisów nie została określona i wymaga opracowania przez ekspertów od produkcji wina

3. **Sugerowane czasy trwania etapów** - Szablony powinny zawierać sugerowane czasy trwania, ale konkretne wartości nie zostały określone i wymagają konsultacji z ekspertami

4. **Typowe składniki dla szablonów** - Szablony powinny zawierać sugestie składników, ale konkretne listy składników nie zostały określone

5. **Domyślne nazwy nastawów** - Jeśli użytkownik nie poda nazwy, system generuje domyślną, ale format/konwencja nazewnictwa nie została określona (np. "Wino czerwone #1", "Nastaw z 2024-01-15")

6. **Szczegóły walidacji formularzy** - Zdecydowano o walidacji po stronie serwera, ale konkretne reguły walidacji (np. format e-mail, długość hasła, wymagania) nie zostały szczegółowo określone

7. **Polityka haseł** - Wymagania dotyczące złożoności hasła, długości, wymaganych znaków nie zostały określone

8. **Szczegóły techniczne eksportu JSON** - Format eksportu JSON jest określony jako wymagany przez RODO, ale struktura danych w eksportowanym pliku nie została zdefiniowana

9. **Konkretne komunikaty błędów i ostrzeżeń** - Zdecydowano o przyjaznych komunikatach błędów i ostrzeżeniach przy pomijaniu etapów, ale konkretna treść komunikatów nie została określona

10. **Design system i UI/UX guidelines** - Określono responsywność i mobile-first, ale szczegółowe wytyczne dotyczące designu, kolorów, typografii, komponentów UI nie zostały określone
</unresolved_issues>

</conversation_summary>
