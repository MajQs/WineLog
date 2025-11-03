# Dokument wymagań produktu (PRD) - WineLog

## 1. Przegląd produktu

### 1.1 Wizja produktu
WineLog to webowa aplikacja przeznaczona dla początkujących i średnio zaawansowanych wytwórców wina i miodu pitnego. Aplikacja prowadzi użytkowników przez cały proces produkcji krok po kroku, zapewniając szczegółowe instrukcje, zarządzanie wieloma nastawami jednocześnie oraz możliwość dokumentowania postępów poprzez notatki.

### 1.2 Cele produktu
- Uproszczenie procesu produkcji wina i miodu pitnego dla początkujących
- Zapewnienie kompleksowych instrukcji etapowych bez potrzeby dodatkowych źródeł
- Umożliwienie prowadzenia wielu nastawów jednocześnie z pełną dokumentacją
- Utworzenie łatwego w użyciu narzędzia do śledzenia postępów i oceny wyników

### 1.3 Grupa docelowa
Początkujący i średnio zaawansowani wytwórcy wina i miodu pitnego, którzy:
- Chcą szybko zacząć produkcję bez dogłębnego studiowania tematu
- Potrzebują przewodnika przez wszystkie etapy produkcji
- Chcą dokumentować swoje postępy i uczyć się na doświadczeniach
- Planują prowadzić wiele nastawów jednocześnie

### 1.4 Zakres wersji MVP
MVP skupia się na podstawowych funkcjonalnościach umożliwiających użytkownikom rozpoczęcie i prowadzenie produkcji wina oraz miodu pitnego z pełną dokumentacją procesu. Aplikacja jest dostępna wyłącznie jako aplikacja webowa, responsywna na urządzeniach mobilnych, tabletach i desktopach.

## 2. Problem użytkownika

### 2.1 Główny problem
Produkcja wina dla osób początkujących może być problematyczna. Wiele osób chce szybko zacząć bez uprzedniego zagłębienia się w temat, co w rezultacie może prowadzić do słabej jakości wina lub miodu pitnego. Brak systematycznego podejścia, niewiedza o kolejnych krokach i brak dokumentacji procesu utrudniają naukę i poprawę w kolejnych nastawach.

### 2.2 Problemy szczegółowe
- Brak jasnego przewodnika przez wszystkie etapy produkcji
- Trudność w zapamiętaniu kolejnych kroków i terminów
- Brak systemu do dokumentowania obserwacji i działań
- Niemożność śledzenia wielu nastawów jednocześnie
- Brak możliwości oceny i analizy zakończonych produkcji
- Niepewność co do właściwego czasu trwania poszczególnych etapów
- Brak ostrzeżeń przed typowymi błędami na każdym etapie

### 2.3 Rozwiązanie proponowane przez WineLog
WineLog rozwiązuje te problemy poprzez:
- Przewodnik krok po kroku z szczegółowymi instrukcjami dla każdego etapu
- System szablonów z predefiniowanymi etapami, czasami trwania i materiałami
- Możliwość prowadzenia wielu nastawów jednocześnie z niezależną dokumentacją
- System notatek umożliwiający dokumentowanie działań i obserwacji
- Archiwum zakończonych nastawów z możliwością oceny
- Proaktywne podpowiedzi i ostrzeżenia dla typowych błędów

## 3. Wymagania funkcjonalne

### 3.1 System kont użytkowników

#### 3.1.1 Rejestracja
- Rejestracja poprzez e-mail i hasło
- Weryfikacja e-mail z modelem "soft verification" - użytkownik może korzystać z aplikacji przed weryfikacją
- Link weryfikacyjny ważny przez 7 dni
- Prześlij przypomnienia o weryfikacji e-mail (co 3 dni przez 7 dni)
- Walidacja formatu e-mail po stronie klienta i serwera
- Polityka hasła:
  - Minimum 8 znaków
  - Co najmniej jedna wielka litera
  - Co najmniej jedna mała litera
  - Co najmniej jedna cyfra
  - Co najmniej jeden znak specjalny (!@#$%^&*)

#### 3.1.2 Logowanie i sesja
- Logowanie poprzez e-mail i hasło
- Automatyczne wylogowanie po 30 dniach nieaktywności
- Komunikat o konieczności ponownego zalogowania przy wygaśnięciu sesji
- Token sesji z automatycznym odświeżaniem
- Możliwość wylogowania przez użytkownika

#### 3.1.3 Zarządzanie kontem
- Podgląd danych konta (e-mail, data rejestracji)
- Zmiana hasła (z weryfikacją starego hasła)
- Usunięcie konta wraz z wszystkimi danymi (z potwierdzeniem)
- Brak eksportu danych w MVP (planowane na później)

### 3.2 Zarządzanie nastawami

#### 3.2.1 Tworzenie nastawu
- Minimalne wymagane dane: nazwa (opcjonalna, domyślna generowana) + wybór szablonu
- Format domyślnej nazwy: "[Typ] #1", "[Typ] #2", itd. (np. "Wino czerwone #1")
- Możliwość szybkiego utworzenia nastawu w 2 kliknięciach
- Automatyczne ustawienie daty rozpoczęcia na dzień utworzenia
- Szablony dostępne w MVP:
  - Wino czerwone
  - Wino białe
  - Wino różowe
  - Wino owocowe
  - Miód pitny trójniak

#### 3.2.2 Szablony nastawów
Każdy szablon zawiera:
- Listę etapów produkcji z nazwami
- Sugerowane czasy trwania każdego etapu
- Krótkie opisy etapów z instrukcjami krok po kroku
- Listę typowych składników potrzebnych do produkcji
- Listę materiałów potrzebnych na każdym etapie
- Sugerowane warunki (temperatura, wilgotność) dla każdego etapu
- Proaktywne podpowiedzi i ostrzeżenia dla typowych błędów

#### 3.2.3 Przeglądanie i edycja nastawu
- Wyświetlenie listy wszystkich aktywnych nastawów użytkownika
- Widok szczegółów nastawu z:
  - Informacjami podstawowymi (nazwa, typ, data rozpoczęcia)
  - Listą etapów z oznaczeniem aktualnego etapu
  - Timeline notatek
  - Możliwością edycji nazwy nastawu
- Przełączanie między wieloma aktywnymi nastawami

### 3.3 Etapy produkcji

#### 3.3.1 Lista etapów (wspólna dla wina i miodu pitnego)
1. Przygotowanie nastawu
2. Ewentualne tłoczenie lub maceracja
3. Ewentualne oddzielanie
4. Fermentacja burzliwa
5. Fermentacja cicha
6. Klarowanie
7. Zlewanie z nad osadu
8. Dojrzewanie/maturacja
9. Butelkowanie

#### 3.3.2 Funkcjonalności etapów
- Przechodzenie między etapami w dowolnej kolejności z ostrzeżeniami przy pomijaniu
- Oznaczenie etapu jako "pominięty" z opcjonalną notatką wyjaśniającą
- Powrót do poprzedniego etapu z obowiązkową notatką wyjaśniającą powód
- Restart fermentacji w dowolnej chwili:
  - Oznaczenie ponownego rozpoczęcia z aktualną datą
  - Historia restartów w notatkach
  - Bez cofania etapu
- Zlewanie z nad osadu możliwe wielokrotnie w trakcie etapu klarowania i dojrzewania
- Wyświetlanie szczegółowych instrukcji dla każdego etapu:
  - Krok po kroku co robić
  - Lista potrzebnych materiałów
  - Sugerowany czas trwania
  - Warunki (temperatura, wilgotność)
  - Podpowiedzi i ostrzeżenia dla typowych błędów

#### 3.3.3 Szczegóły etapu "Przygotowanie nastawu"
- Opcjonalny wybór tłoczenia vs maceracji
- Wyjaśnienia dla początkujących dotyczące różnic i zastosowań
- Instrukcje krok po kroku w zależności od wyboru

### 3.4 Notatki

#### 3.4.1 Pola notatek
- Data (automatyczna, możliwość ręcznej zmiany)
- Działanie (tekstowe pole opisujące wykonane działanie)
- Obserwacje (tekstowe pole na uwagi i obserwacje)

#### 3.4.2 Operacje CRUD
- Przeglądanie: wyświetlenie wszystkich notatek nastawu w chronologicznej kolejności
- Tworzenie: dodanie nowej notatki do aktualnego lub wybranego etapu
- Edytowanie: modyfikacja istniejącej notatki z zachowaniem timestampu ostatniej edycji
- Usuwanie: trwałe usunięcie notatki z potwierdzeniem

#### 3.4.3 Ograniczenia MVP
- Brak wersjonowania notatek
- Brak możliwości cofnięcia zmian
- Timestamp ostatniej edycji przy edycji notatki

### 3.5 Archiwum i oceny

#### 3.5.1 Archiwizacja
- Możliwość zakończenia nastawu w dowolnym momencie
- Opcjonalny powód zakończenia w notatce
- Automatyczne przeniesienie zakończonego nastawu do archiwum
- Bezterminowe przechowywanie zakończonych nastawów
- Możliwość ręcznego usunięcia nastawu z archiwum (z potwierdzeniem)

#### 3.5.2 Przeglądanie archiwum
- Lista wszystkich zakończonych nastawów
- Wyświetlenie podstawowych informacji (nazwa, typ, data rozpoczęcia, data zakończenia)
- Dostęp do pełnej historii notatek zakończonego nastawu

#### 3.5.3 Ocena nastawu
- Prosta ocena ogólna w skali 1-5 gwiazdek
- Możliwość dodania oceny po zakończeniu nastawu
- Możliwość zmiany oceny w dowolnym momencie
- Wyświetlenie oceny w widoku archiwum

### 3.6 Dashboard

#### 3.6.1 Widok główny
- Lista aktywnych nastawów z wyświetleniem:
  - Nazwa nastawu
  - Typ (wino/miód pitny)
  - Data rozpoczęcia
  - Aktualny etap
  - Ostatnia notatka (preview)
- Sekcja Archiwum z listą zakończonych nastawów
- Przycisk "Nowy nastaw" z łatwym dostępem
- Statystyki (opcjonalne w MVP):
  - Liczba aktywnych nastawów
  - Liczba zakończonych nastawów

### 3.7 Obsługa błędów i walidacja

#### 3.7.1 Walidacja danych
- Walidacja po stronie serwera dla wszystkich operacji
- Walidacja po stronie klienta dla lepszego UX
- Spójne reguły walidacji:
  - E-mail: format RFC 5322
  - Hasło: zgodnie z polityką haseł (min. 8 znaków, wielka, mała, cyfra, znak specjalny)
  - Nazwa nastawu: maksymalnie 100 znaków
  - Notatki: maksymalnie 200 znaków na pole

#### 3.7.2 Komunikaty błędów
- Przyjazne komunikaty błędów dla użytkownika (w języku polskim)
- Szczegółowe logi błędów dla debugowania (bez wyświetlania użytkownikowi)
- Standardowe komunikaty:
  - "Wystąpił błąd. Spróbuj ponownie."
  - "Nieprawidłowy format e-mail."
  - "Hasło musi zawierać co najmniej 8 znaków, w tym wielką literę, małą literę, cyfrę i znak specjalny."
  - "Ta nazwa jest już używana. Wybierz inną."
  - "Nie można usunąć nastawu z aktywnymi notatkami." (jeśli dotyczy)

#### 3.7.3 Ostrzeżenia
- Ostrzeżenie przy pomijaniu etapu: "Czy na pewno chcesz pominąć ten etap? Może to wpłynąć na jakość końcowego produktu."
- Ostrzeżenie przy powrocie do poprzedniego etapu: "Powrót do poprzedniego etapu wymaga dodania notatki wyjaśniającej powód."
- Ostrzeżenie przy zakończeniu nastawu: "Czy na pewno chcesz zakończyć ten nastaw? Nastaw zostanie przeniesiony do archiwum."

### 3.8 Metryki i analityka

#### 3.8.1 Zbieranie metryk (zgodnie z RODO)
- Anonimowe metryki z możliwością wyłączenia przez użytkownika:
  - Liczba aktywnych nastawów na użytkownika
  - Średni czas ukończenia nastawu
  - Najczęściej wybierane szablony
  - Punkty drop-off (gdzie użytkownicy najczęściej kończą/pomijają etapy)
  - Czas spędzony w aplikacji (sesje)
- Ustawienia prywatności w profilu użytkownika
- Brak zbierania danych osobowych poza niezbędnymi do działania aplikacji

### 3.9 Wymagania techniczne

#### 3.9.1 Responsywność
- Pełna funkcjonalność na urządzeniach od 320px do 4K
- Mobile-first design z priorytetem dla urządzeń mobilnych i tabletów
- Adaptacyjny layout dostosowujący się do rozdzielczości ekranu

#### 3.9.2 Wydajność
- Ładowanie strony poniżej 3 sekund na 4G
- Reakcja interfejsu poniżej 200ms
- Lazy loading dla archiwum (ładowanie nastawów na żądanie)
- Loading states i skeleton screens dla lepszego UX

#### 3.9.3 Kompatybilność
- Obsługa nowoczesnych przeglądarek (Chrome, Firefox, Safari, Edge - ostatnie 2 wersje)
- Graceful degradation dla starszych przeglądarek

## 4. Granice produktu

### 4.1 Funkcjonalności poza zakresem MVP

#### 4.1.1 Aplikacje mobilne
- Aplikacje natywne dla iOS i Android nie wchodzą w zakres MVP
- Aplikacja webowa jest responsywna i dostępna na urządzeniach mobilnych przez przeglądarkę
- Planowane na kolejne iteracje

#### 4.1.2 Zaawansowane narzędzia
- Zaawansowane kalkulatory mierzenia alkoholu, cukru, pH
- Kalkulatory blendowania win
- Zaawansowane wykresy i analityka
- Planowane na późniejsze wersje dla zaawansowanych użytkowników

#### 4.1.3 Inne napoje
- Wytwarzanie piwa nie wchodzi w zakres MVP
- Wytwarzanie cydru nie wchodzi w zakres MVP
- Architektura przygotowana na dodanie w przyszłości

#### 4.1.4 Funkcjonalności społecznościowe
- Udostępnianie nastawów innym użytkownikom
- Recenzje i komentarze
- Społeczność i fora
- Planowane na późniejsze wersje

#### 4.1.5 Notyfikacje
- System notyfikacji e-mail o ważnych terminach nie wchodzi w zakres MVP
- Architektura przygotowana na implementację w przyszłości
- Planowane na kolejne iteracje

#### 4.1.6 Tryb offline
- Tryb offline/read-only nie wchodzi w zakres MVP
- Aplikacja wymaga połączenia z internetem
- Planowane na późniejsze wersje

#### 4.1.7 Eksport danych
- Eksport danych użytkownika w formacie JSON nie wchodzi w zakres MVP
- Planowane na kolejne iteracje zgodnie z wymaganiami RODO

#### 4.1.8 OAuth
- Logowanie przez zewnętrzne serwisy (Google, Facebook) nie wchodzi w zakres MVP
- Planowane na kolejne iteracje

#### 4.1.9 Zaawansowane funkcje notatek
- Wersjonowanie notatek
- Możliwość cofnięcia zmian
- Załączniki (zdjęcia, pliki)
- Planowane na późniejsze wersje

#### 4.1.10 Zaawansowane funkcje nastawów
- Dodawanie własnych etapów
- Własne szablony użytkownika
- Klonowanie nastawów
- Planowane na późniejsze wersje

#### 4.1.11 Pomiary w notatkach
- Pola numeryczne dla temperatury, gęstości, pH w notatkach nie wchodzą w zakres MVP
- Architektura przygotowana na dodanie w przyszłości
- Planowane na kolejne iteracje

#### 4.1.12 Zaawansowane oceny
- Szczegółowe oceny (smak, kolor, aromat, ogólna) nie wchodzą w zakres MVP
- Obecnie tylko prosta ocena ogólna 1-5 gwiazdek
- Planowane na późniejsze wersje

### 4.2 Ograniczenia skalowalności
- MVP projektowane na skalę do 1000 użytkowników
- Proste rozwiązania infrastrukturalne
- Plan skalowania na przyszłość wymaga refaktoryzacji

### 4.3 Ograniczenia funkcjonalne
- Brak możliwości dodawania własnych szablonów w MVP
- Brak możliwości dodawania własnych etapów w MVP
- Brak filtrowania i sortowania w MVP (planowane na późniejsze wersje)

## 5. Historyjki użytkowników

### 5.1 Uwierzytelnianie i autoryzacja

#### US-001: Rejestracja nowego użytkownika
**Tytuł:** Rejestracja poprzez e-mail i hasło

**Opis:** Jako nowy użytkownik chcę zarejestrować się w aplikacji używając e-maila i hasła, aby móc korzystać z WineLog i przechowywać swoje nastawy.

**Kryteria akceptacji:**
- Użytkownik może wprowadzić e-mail i hasło w formularzu rejestracji
- System waliduje format e-mail (RFC 5322)
- System waliduje hasło zgodnie z polityką (min. 8 znaków, wielka, mała, cyfra, znak specjalny)
- Po poprawnym wypełnieniu formularza konto zostaje utworzone
- Użytkownik otrzymuje e-mail weryfikacyjny z linkiem ważnym przez 7 dni
- Użytkownik może natychmiast rozpocząć korzystanie z aplikacji (soft verification)
- Komunikaty błędów wyświetlane są w języku polskim
- Po rejestracji użytkownik jest automatycznie zalogowany

#### US-002: Weryfikacja e-mail
**Tytuł:** Weryfikacja adresu e-mail

**Opis:** Jako zarejestrowany użytkownik chcę zweryfikować mój adres e-mail, aby upewnić się że otrzymam ważne powiadomienia.

**Kryteria akceptacji:**
- Użytkownik otrzymuje e-mail weryfikacyjny po rejestracji
- Link weryfikacyjny jest ważny przez 7 dni
- Kliknięcie w link weryfikuje konto
- Użytkownik otrzymuje przypomnienia o weryfikacji co 3 dni (przez 7 dni)
- Po weryfikacji status konta zmienia się na zweryfikowane
- Użytkownik może korzystać z aplikacji przed weryfikacją

#### US-003: Logowanie użytkownika
**Tytuł:** Logowanie do aplikacji

**Opis:** Jako zarejestrowany użytkownik chcę zalogować się do aplikacji używając e-maila i hasła, aby uzyskać dostęp do moich nastawów.

**Kryteria akceptacji:**
- Użytkownik może wprowadzić e-mail i hasło w formularzu logowania
- System waliduje dane logowania
- Po poprawnym logowaniu użytkownik jest przekierowywany do dashboardu
- Przy nieprawidłowych danych wyświetlany jest komunikat "Nieprawidłowy e-mail lub hasło."
- Token sesji jest tworzony i przechowywany
- Użytkownik pozostaje zalogowany przez 30 dni przy aktywności

#### US-004: Automatyczne wylogowanie
**Tytuł:** Wylogowanie po okresie nieaktywności

**Opis:** Jako zalogowany użytkownik chcę być automatycznie wylogowany po okresie nieaktywności, aby zapewnić bezpieczeństwo mojego konta.

**Kryteria akceptacji:**
- Po 30 dniach nieaktywności sesja wygasa
- Przy próbie wykonania akcji po wygaśnięciu sesji użytkownik jest wylogowywany
- Wyświetlany jest komunikat "Twoja sesja wygasła. Zaloguj się ponownie."
- Użytkownik jest przekierowywany do strony logowania
- Niezapisane dane są tracone (z ostrzeżeniem jeśli to możliwe)

#### US-005: Zmiana hasła
**Tytuł:** Zmiana hasła użytkownika

**Opis:** Jako zalogowany użytkownik chcę zmienić moje hasło, aby zwiększyć bezpieczeństwo mojego konta.

**Kryteria akceptacji:**
- Użytkownik może wprowadzić stare hasło i nowe hasło
- System waliduje stare hasło
- System waliduje nowe hasło zgodnie z polityką
- Po poprawnym wprowadzeniu hasło zostaje zmienione
- Użytkownik jest wylogowywany z innych urządzeń (opcjonalnie)
- Komunikat potwierdzenia wyświetlany jest po zmianie hasła

#### US-006: Usunięcie konta
**Tytuł:** Usunięcie konta użytkownika

**Opis:** Jako zalogowany użytkownik chcę usunąć moje konto wraz z wszystkimi danymi, aby spełnić moje prawo do bycia zapomnianym (RODO).

**Kryteria akceptacji:**
- Użytkownik może przejść do ustawień konta
- Opcja usunięcia konta jest dostępna
- System wymaga potwierdzenia usunięcia (np. wpisanie hasła)
- Po potwierdzeniu wszystkie dane użytkownika są trwale usunięte
- Wszystkie nastawy i notatki są usunięte
- Komunikat potwierdzenia wyświetlany jest po usunięciu
- Użytkownik jest automatycznie wylogowany

### 5.2 Zarządzanie nastawami

#### US-007: Utworzenie nowego nastawu
**Tytuł:** Tworzenie nastawu w 2 kliknięciach

**Opis:** Jako zalogowany użytkownik chcę szybko utworzyć nowy nastaw wybierając szablon, aby rozpocząć produkcję bez zbędnych formalności.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Nowy nastaw" na dashboardzie
- Wyświetlana jest lista dostępnych szablonów (wino czerwone, białe, różowe, owocowe, miód pitny trójniak)
- Użytkownik może wybrać szablon (1. kliknięcie)
- Użytkownik może opcjonalnie wprowadzić nazwę nastawu
- Jeśli nazwa nie jest wprowadzona, generowana jest domyślna w formacie "[Typ] #N" (np. "Wino czerwone #1")
- Kliknięcie "Utwórz" tworzy nastaw (2. kliknięcie)
- Nastaw jest natychmiast dostępny na dashboardzie
- Data rozpoczęcia jest ustawiana automatycznie na dzień utworzenia
- Użytkownik jest przekierowywany do widoku szczegółów nastawu

#### US-008: Przeglądanie listy aktywnych nastawów
**Tytuł:** Wyświetlenie wszystkich aktywnych nastawów

**Opis:** Jako zalogowany użytkownik chcę zobaczyć listę wszystkich moich aktywnych nastawów, aby móc łatwo przełączać się między nimi.

**Kryteria akceptacji:**
- Dashboard wyświetla listę wszystkich aktywnych nastawów użytkownika
- Dla każdego nastawu wyświetlane są: nazwa, typ, data rozpoczęcia, aktualny etap, preview ostatniej notatki
- Lista jest automatycznie wyświetlana w kolejności chronologicznej (najnowsze na górze)
- Kliknięcie na nastaw otwiera widok szczegółów
- Jeśli użytkownik nie ma aktywnych nastawów, wyświetlany jest komunikat zachecający do utworzenia pierwszego

#### US-009: Edycja nazwy nastawu
**Tytuł:** Zmiana nazwy nastawu

**Opis:** Jako zalogowany użytkownik chcę edytować nazwę mojego nastawu, aby lepiej go identyfikować.

**Kryteria akceptacji:**
- Użytkownik może edytować nazwę nastawu w widoku szczegółów
- Nazwa może mieć maksymalnie 100 znaków
- Zmiany są zapisywane natychmiast po potwierdzeniu
- Walidacja po stronie klienta i serwera
- Komunikat błędów wyświetlany jest przy przekroczeniu limitu znaków

#### US-010: Przełączanie między nastawami
**Tytuł:** Przełączanie między wieloma aktywnymi nastawami

**Opis:** Jako zalogowany użytkownik chcę łatwo przełączać się między moimi aktywnymi nastawami, aby zarządzać wieloma produkcjami jednocześnie.

**Kryteria akceptacji:**
- Użytkownik może kliknąć na nastaw na dashboardzie
- Widok szczegółów nastawu jest otwierany
- Użytkownik może wrócić do dashboardu i wybrać inny nastaw
- Każdy nastaw ma niezależny timeline i notatki
- Aktualny nastaw jest wyróżniony w nawigacji

### 5.3 Prowadzenie nastawu przez etapy

#### US-011: Wyświetlenie listy etapów
**Tytuł:** Przeglądanie etapów produkcji nastawu

**Opis:** Jako zalogowany użytkownik chcę zobaczyć listę wszystkich etapów produkcji dla mojego nastawu, aby wiedzieć gdzie jestem w procesie.

**Kryteria akceptacji:**
- Lista etapów jest wyświetlana w widoku szczegółów nastawu
- Aktualny etap jest wyraźnie oznaczony
- Zakończone etapy są oznaczone jako ukończone
- Pominięte etapy są oznaczone jako pominięte
- Etapy są wyświetlone w logicznej kolejności
- Każdy etap ma nazwę i krótki opis

#### US-012: Wyświetlenie szczegółowych instrukcji etapu
**Tytuł:** Przeglądanie instrukcji dla aktualnego etapu

**Opis:** Jako zalogowany użytkownik chcę zobaczyć szczegółowe instrukcje krok po kroku dla aktualnego etapu, aby wiedzieć dokładnie co mam robić.

**Kryteria akceptacji:**
- Po wybraniu etapu wyświetlane są szczegółowe instrukcje
- Instrukcje zawierają kroki krok po kroku co robić
- Wyświetlana jest lista potrzebnych materiałów dla etapu
- Wyświetlany jest sugerowany czas trwania etapu
- Wyświetlone są sugerowane warunki (temperatura, wilgotność)
- Wyświetlone są proaktywne podpowiedzi i ostrzeżenia dla typowych błędów
- Instrukcje są na tyle szczegółowe, aby początkujący mógł wykonać zadanie bez dodatkowych źródeł

#### US-013: Przejście do następnego etapu
**Tytuł:** Przechodzenie do następnego etapu produkcji

**Opis:** Jako zalogowany użytkownik chcę przejść do następnego etapu po ukończeniu aktualnego, aby kontynuować produkcję.

**Kryteria akceptacji:**
- Przycisk "Następny etap" jest dostępny w widoku etapu
- Kliknięcie przechodzi do następnego etapu w sekwencji
- Aktualny etap jest automatycznie oznaczany jako ukończony
- Nowy etap jest oznaczany jako aktualny
- Zmiana jest zapisywana natychmiast
- Użytkownik może opcjonalnie dodać notatkęd

#### US-014: Pominięcie etapu
**Tytuł:** Pomijanie etapu produkcji

**Opis:** Jako zalogowany użytkownik chcę pominąć etap, który nie jest potrzebny dla mojego nastawu, zachowując elastyczność procesu.

**Kryteria akceptacji:**
- Użytkownik może oznaczyć etap jako "pominięty"
- Przy próbie pominięcia wyświetlane jest ostrzeżenie: "Czy na pewno chcesz pominąć ten etap? Może to wpłynąć na jakość końcowego produktu."
- Użytkownik może dodać opcjonalną notatkę wyjaśniającą powód pominięcia
- Po potwierdzeniu etap jest oznaczany jako pominięty
- Następny etap staje się aktualnym
- Pominięty etap jest widoczny w timeline jako pominięty

#### US-015: Powrót do poprzedniego etapu
**Tytuł:** Powrót do wcześniejszego etapu

**Opis:** Jako zalogowany użytkownik chcę wrócić do poprzedniego etapu, jeśli potrzebuję coś poprawić lub dokończyć.

**Kryteria akceptacji:**
- Użytkownik może wrócić do poprzedniego etapu
- Przy próbie powrotu wyświetlane jest ostrzeżenie wymagające dodania notatki
- Notatka wyjaśniająca powód powrotu jest obowiązkowa
- Po dodaniu notatki i potwierdzeniu następuje powrót do poprzedniego etapu
- Poprzedni etap staje się aktualnym
- Historia powrotów jest widoczna w notatkach

#### US-016: Restart fermentacji
**Tytuł:** Ponowne rozpoczęcie fermentacji

**Opis:** Jako zalogowany użytkownik chcę zrestartować fermentację w dowolnej chwili, aby zaznaczyć ponowne rozpoczęcie procesu.

**Kryteria akceptacji:**
- Użytkownik może zrestartować fermentację z poziomu etapów fermentacji
- Restart oznacza ponowne rozpoczęcie z aktualną datą
- Automatycznie dodawana jest notatka o restarcie z datą
- Historia restartów jest widoczna w notatkach
- Restart nie cofa etapu (pozostaje na aktualnym etapie)
- Użytkownik może dodać własną notatkę do restaru

#### US-017: Wybór tłoczenia vs maceracji
**Tytuł:** Wybór metody przygotowania nastawu

**Opis:** Jako zalogowany użytkownik chcę wybrać między tłoczeniem a maceracją podczas przygotowania nastawu, aby dostosować proces do moich potrzeb.

**Kryteria akceptacji:**
- W etapie "Przygotowanie nastawu" użytkownik może wybrać tłoczenie lub macerację
- Wybór jest opcjonalny (można pominąć)
- Wyświetlone są wyjaśnienia różnic i zastosowań dla początkujących
- Instrukcje krok po kroku zmieniają się w zależności od wyboru
- Wybór jest zapisywany i widoczny w szczegółach nastawu

#### US-018: Przechodzenie między etapami w dowolnej kolejności
**Tytuł:** Elastyczne przechodzenie między etapami

**Opis:** Jako zalogowany użytkownik chcę móc przechodzić między etapami w dowolnej kolejności, zachowując elastyczność procesu produkcji.

**Kryteria akceptacji:**
- Użytkownik może otworzyć dowolny etap z listy
- Przy próbie pominięcia etapów wyświetlane jest ostrzeżenie
- Ostrzeżenie nie blokuje akcji, ale informuje o możliwych konsekwencjach
- Użytkownik może kontynuować mimo ostrzeżenia
- Historia zmian etapów jest widoczna w notatkach

### 5.4 Notatki

#### US-019: Dodanie notatki do nastawu
**Tytuł:** Tworzenie notatki z działaniem i obserwacjami

**Opis:** Jako zalogowany użytkownik chcę dodawać notatki do mojego nastawu, aby dokumentować postępy i obserwacje.

**Kryteria akceptacji:**
- Użytkownik może dodać notatkę z poziomu widoku szczegółów nastawu lub etapu
- Formularz notatki zawiera pola: data (automatyczna), działanie, obserwacje
- Data może być zmieniona ręcznie
- Każde pole może mieć maksymalnie 200 znaków
- Notatka jest zapisywana do aktualnego lub wybranego etapu
- Po zapisaniu notatka jest widoczna w timeline nastawu
- Walidacja po stronie klienta i serwera

#### US-020: Przeglądanie notatek nastawu
**Tytuł:** Wyświetlenie wszystkich notatek nastawu

**Opis:** Jako zalogowany użytkownik chcę przeglądać wszystkie notatki mojego nastawu, aby śledzić historię produkcji.

**Kryteria akceptacji:**
- Wszystkie notatki nastawu są wyświetlane w chronologicznej kolejności
- Timeline pokazuje datę, działanie i obserwacje dla każdej notatki
- Notatki są powiązane z etapami
- Ostatnia notatka jest widoczna w preview na dashboardzie

#### US-021: Edycja notatki
**Tytuł:** Modyfikacja istniejącej notatki

**Opis:** Jako zalogowany użytkownik chcę edytować moje notatki, aby poprawić błędy lub dodać informacje.

**Kryteria akceptacji:**
- Użytkownik może edytować istniejącą notatkę
- Wszystkie pola notatki mogą być zmienione
- Timestamp ostatniej edycji jest zapisywany i wyświetlany
- Zmiany są zapisywane natychmiast po potwierdzeniu
- Brak możliwości cofnięcia zmian (w MVP)
- Komunikat potwierdzenia po zapisaniu zmian

#### US-022: Usunięcie notatki
**Tytuł:** Trwałe usunięcie notatki

**Opis:** Jako zalogowany użytkownik chcę usunąć notatkę, jeśli została dodana przez pomyłkę lub jest niepotrzebna.

**Kryteria akceptacji:**
- Użytkownik może usunąć notatkę z poziomu widoku notatki
- Przed usunięciem wyświetlane jest potwierdzenie
- Po potwierdzeniu notatka jest trwale usunięta
- Usunięta notatka znika z timeline
- Brak możliwości przywrócenia usuniętej notatki (w MVP)

### 5.5 Archiwum i oceny

#### US-023: Zakończenie nastawu
**Tytuł:** Zakończenie produkcji nastawu

**Opis:** Jako zalogowany użytkownik chcę zakończyć mój nastaw w dowolnym momencie, aby przenieść go do archiwum.

**Kryteria akceptacji:**
- Użytkownik może zakończyć nastaw z poziomu widoku szczegółów
- Przy próbie zakończenia wyświetlane jest ostrzeżenie: "Czy na pewno chcesz zakończyć ten nastaw? Nastaw zostanie przeniesiony do archiwum."
- Użytkownik może opcjonalnie dodać powód zakończenia w notatce
- Po potwierdzeniu nastaw jest oznaczany jako zakończony
- Nastaw jest przenoszony do archiwum
- Data zakończenia jest zapisywana
- Nastaw znika z listy aktywnych nastawów

#### US-024: Przeglądanie archiwum
**Tytuł:** Wyświetlenie zakończonych nastawów

**Opis:** Jako zalogowany użytkownik chcę przeglądać moje zakończone nastawy w archiwum, aby analizować poprzednie produkcje.

**Kryteria akceptacji:**
- Sekcja Archiwum wyświetla listę wszystkich zakończonych nastawów
- Dla każdego nastawu wyświetlane są: nazwa, typ, data rozpoczęcia, data zakończenia, ocena (jeśli dodana)
- Kliknięcie na nastaw otwiera widok szczegółów z pełną historią
- Dostępne są wszystkie notatki zakończonego nastawu
- Zakończone nastawy są przechowywane bezterminowo

#### US-025: Ocena zakończonego nastawu
**Tytuł:** Dodanie oceny 1-5 gwiazdek do nastawu

**Opis:** Jako zalogowany użytkownik chcę ocenić mój zakończony nastaw w skali 1-5 gwiazdek, aby oznaczyć jakość produktu końcowego.

**Kryteria akceptacji:**
- Użytkownik może dodać ocenę po zakończeniu nastawu
- Ocena jest w skali 1-5 gwiazdek
- Ocena może być dodana lub zmieniona w dowolnym momencie po zakończeniu
- Ocena jest wyświetlana w widoku archiwum i szczegółów nastawu
- Ocena jest zapisywana natychmiast po wyborze
- Brak możliwości usunięcia oceny (można zmienić na inną)

#### US-026: Usunięcie nastawu z archiwum
**Tytuł:** Trwałe usunięcie zakończonego nastawu

**Opis:** Jako zalogowany użytkownik chcę usunąć zakończony nastaw z archiwum, jeśli nie jest mi już potrzebny.

**Kryteria akceptacji:**
- Użytkownik może usunąć nastaw z archiwum
- Przed usunięciem wyświetlane jest potwierdzenie z ostrzeżeniem
- Po potwierdzeniu nastaw i wszystkie jego notatki są trwale usunięte
- Usunięty nastaw znika z archiwum
- Brak możliwości przywrócenia usuniętego nastawu
- Komunikat potwierdzenia po usunięciu

### 5.6 Dashboard i nawigacja

#### US-027: Wyświetlenie dashboardu
**Tytuł:** Przeglądanie głównego ekranu z nastawami

**Opis:** Jako zalogowany użytkownik chcę widzieć mój dashboard z listą aktywnych nastawów i dostępem do archiwum, aby mieć szybki przegląd mojej pracy.

**Kryteria akceptacji:**
- Dashboard wyświetla listę aktywnych nastawów z podstawowymi informacjami
- Dashboard zawiera sekcję Archiwum z linkiem do zakończonych nastawów
- Przycisk "Nowy nastaw" jest łatwo dostępny i widoczny
- Dashboard jest responsywny i działa na wszystkich urządzeniach
- Ładowanie dashboardu jest szybkie (poniżej 3 sekund na 4G)
- Loading states są wyświetlane podczas ładowania

#### US-028: Nawigacja między sekcjami
**Tytuł:** Przechodzenie między różnymi sekcjami aplikacji

**Opis:** Jako zalogowany użytkownik chcę łatwo nawigować między dashboardem, nastawami i archiwum, aby szybko znaleźć potrzebne informacje.

**Kryteria akceptacji:**
- Nawigacja jest dostępna na wszystkich ekranach
- Użytkownik może przejść z dashboardu do nastawu i z powrotem
- Użytkownik może przejść do archiwum z dashboardu
- Nawigacja jest intuicyjna i spójna
- Breadcrumbs pokazują aktualną lokalizację (opcjonalnie)
- Nawigacja działa poprawnie na urządzeniach mobilnych

### 5.7 Obsługa błędów

#### US-029: Wyświetlanie błędów walidacji
**Tytuł:** Komunikaty błędów przy nieprawidłowych danych

**Opis:** Jako użytkownik chcę otrzymywać jasne komunikaty błędów, gdy wprowadzam nieprawidłowe dane, aby móc je poprawić.

**Kryteria akceptacji:**
- Komunikaty błędów są wyświetlane w języku polskim
- Błędy walidacji są wyświetlane natychmiast po próbie zapisania
- Komunikaty są konkretne i wskazują na problem
- Błędy są wyświetlane przy odpowiednich polach
- Ogólne błędy serwera wyświetlają komunikat: "Wystąpił błąd. Spróbuj ponownie."
- Szczegółowe logi błędów są zapisywane dla debugowania (bez wyświetlania użytkownikowi)

#### US-030: Obsługa błędów sieciowych
**Tytuł:** Reagowanie na problemy z połączeniem

**Opis:** Jako użytkownik chcę być informowany o problemach z połączeniem, aby wiedzieć kiedy aplikacja nie działa poprawnie.

**Kryteria akceptacji:**
- Przy braku połączenia wyświetlany jest komunikat: "Brak połączenia z internetem. Sprawdź swoje połączenie."
- Próby zapisania danych są wyświetlane jako pending
- Automatyczna retry przy przywróceniu połączenia (opcjonalnie)
- Komunikaty timeout są wyświetlane po przekroczeniu czasu oczekiwania
- Użytkownik może spróbować ponownie po przywróceniu połączenia

### 5.8 Responsywność i wydajność

#### US-031: Użycie aplikacji na urządzeniu mobilnym
**Tytuł:** Pełna funkcjonalność na telefonie

**Opis:** Jako użytkownik chcę używać aplikacji na moim telefonie, aby mieć dostęp do moich nastawów w dowolnym miejscu.

**Kryteria akceptacji:**
- Aplikacja jest w pełni funkcjonalna na urządzeniach mobilnych (od 320px)
- Layout dostosowuje się do rozdzielczości ekranu
- Wszystkie funkcjonalności są dostępne na mobile
- Tekst jest czytelny bez powiększania
- Przyciski i elementy interaktywne są łatwe do kliknięcia
- Nawigacja jest zoptymalizowana dla mobile

#### US-032: Szybkie ładowanie strony
**Tytuł:** Ładowanie aplikacji poniżej 3 sekund

**Opis:** Jako użytkownik chcę, aby aplikacja ładowała się szybko, aby nie tracić czasu na czekanie.

**Kryteria akceptacji:**
- Ładowanie strony głównej poniżej 3 sekund na 4G
- Reakcja interfejsu poniżej 200ms po akcji użytkownika
- Lazy loading dla archiwum (ładowanie na żądanie)
- Loading states i skeleton screens podczas ładowania
- Optymalizacja obrazów i zasobów
- Monitoring wydajności i Core Web Vitals

#### US-033: Lazy loading archiwum
**Tytuł:** Stopniowe ładowanie zakończonych nastawów

**Opis:** Jako użytkownik chcę, aby archiwum ładowało się stopniowo, aby nie czekać na wszystkie nastawy na raz.

**Kryteria akceptacji:**
- Archiwum ładuje nastawy partiami (np. po 10)
- Więcej nastawów ładuje się przy przewijaniu do końca listy
- Loading indicator pokazuje proces ładowania
- Skeleton screens są wyświetlane dla ładujących się elementów
- Użytkownik może korzystać z aplikacji podczas ładowania

## 6. Metryki sukcesu

### 6.1 Metryki produktowe

#### 6.1.1 Szybkość utworzenia nastawu
- **Metryka:** Czas od kliknięcia "Nowy nastaw" do utworzenia nastawu
- **Cel:** 2 kliknięcia, czas < 10 sekund dla 95% użytkowników
- **Pomiar:** Tracking czasu wykonania akcji w aplikacji
- **Kryterium sukcesu:** 90% użytkowników tworzy nastaw w mniej niż 10 sekund

#### 6.1.2 Prostość przedstawienia etapów
- **Metryka:** Zrozumiałość opisów etapów dla początkujących
- **Cel:** Użytkownik rozumie każdy etap bez dodatkowych wyjaśnień
- **Pomiar:** User testing z początkującymi użytkownikami, feedback surveys, NPS
- **Kryterium sukcesu:** 85% początkujących użytkowników rozumie instrukcje bez pomocy

#### 6.1.3 Wydajność aplikacji
- **Metryka:** Czas ładowania strony, czas reakcji interfejsu
- **Cel:** < 3 sekundy ładowanie na 4G dla 90% użytkowników, < 200ms reakcja interfejsu
- **Pomiar:** Performance monitoring, Core Web Vitals (LCP, FID, CLS)
- **Kryterium sukcesu:** 
  - 95% stron ładuje się poniżej 3 sekund na 4G
  - 95% akcji użytkownika reaguje poniżej 200ms

#### 6.1.4 Responsywność
- **Metryka:** Funkcjonalność na różnych urządzeniach i rozdzielczościach
- **Cel:** Pełna funkcjonalność na urządzeniach 320px-4K, priorytet mobile/tablet
- **Pomiar:** Testing na różnych urządzeniach, rozdzielczościach i przeglądarkach
- **Kryterium sukcesu:** 100% funkcjonalności działa na wszystkich obsługiwanych urządzeniach

#### 6.1.5 Satysfakcja użytkownika
- **Metryka:** Średnia ocena nastawów, czas spędzony w aplikacji, retention rate
- **Cel:** Wysoka retencja, pozytywne feedbacki, długi czas spędzony w aplikacji
- **Pomiar:** 
  - Anonimowe metryki: liczba aktywnych nastawów na użytkownika
  - Średni czas ukończenia nastawu
  - Najczęściej wybierane szablony
  - Punkty drop-off (gdzie użytkownicy najczęściej kończą/pomijają etapy)
  - Czas spędzony w aplikacji (sesje)
  - Retention rate (D1, D7, D30)
- **Kryterium sukcesu:**
  - Retention D7 > 40%
  - Retention D30 > 20%
  - Średnia ocena nastawów > 3.5/5
  - Średni czas sesji > 5 minut

#### 6.1.6 Skalowalność
- **Metryka:** Wydajność przy rosnącej liczbie użytkowników
- **Cel:** Obsługa do 1000 użytkowników z prostymi rozwiązaniami
- **Pomiar:** Load testing, monitoring wydajności, czas odpowiedzi API
- **Kryterium sukcesu:** Aplikacja obsługuje 1000 równoczesnych użytkowników bez znaczącego spadku wydajności

### 6.2 Metryki biznesowe

#### 6.2.1 Przyrost użytkowników
- **Metryka:** Liczba nowych rejestracji dziennie/tygodniowo/miesięcznie
- **Cel:** Stabilny wzrost liczby użytkowników
- **Pomiar:** Tracking rejestracji w czasie
- **Kryterium sukcesu:** 100 nowych użytkowników w pierwszym miesiącu MVP

#### 6.2.2 Aktywność użytkowników
- **Metryka:** Liczba aktywnych nastawów, liczba dodanych notatek, liczba zakończonych nastawów
- **Cel:** Wysoka aktywność użytkowników
- **Pomiar:** Anonimowe statystyki użycia aplikacji
- **Kryterium sukcesu:** 
  - Średnio 1+ aktywny nastaw na użytkownika
  - Średnio 5+ notatek na nastaw
  - 60% użytkowników ma co najmniej jeden zakończony nastaw

#### 6.2.3 Wykorzystanie szablonów
- **Metryka:** Rozkład wyboru szablonów
- **Cel:** Równowaga w wykorzystaniu różnych szablonów
- **Pomiar:** Anonimowe statystyki wyboru szablonów
- **Kryterium sukcesu:** Każdy szablon jest wybierany przez przynajmniej 10% użytkowników

### 6.3 Metryki techniczne

#### 6.3.1 Dostępność
- **Metryka:** Uptime aplikacji
- **Cel:** 99% uptime
- **Pomiar:** Monitoring dostępności serwera
- **Kryterium sukcesu:** 99% uptime w pierwszym miesiącu

#### 6.3.2 Błędy
- **Metryka:** Liczba błędów, error rate
- **Cel:** Minimalna liczba błędów krytycznych
- **Pomiar:** Error tracking, logi błędów
- **Kryterium sukcesu:** Error rate < 1% wszystkich żądań

#### 6.3.3 Bezpieczeństwo
- **Metryka:** Liczba incydentów bezpieczeństwa
- **Cel:** Zero incydentów bezpieczeństwa
- **Pomiar:** Monitoring bezpieczeństwa, audyty
- **Kryterium sukcesu:** Zero incydentów bezpieczeństwa w MVP

## 7. Szczegóły techniczne szablonów dla MVP

### 7.1 Wino czerwone

#### Etapy produkcji:
1. **Przygotowanie nastawu** (1-2 dni)
   - Instrukcje: Wybierz dojrzałe winogrona czerwone. Usuń zepsute owoce i łodygi. Opcjonalnie wybierz tłoczenie (szybsze, mniej tanin) lub macerację (bogatszy smak, więcej tanin, bogatszy kolor). Przy maceracji: zmiażdż winogrona, pozostaw na 3-7 dni w temperaturze 20-25°C z codziennym mieszaniem pod przykryciem. Przy tłoczeniu: od razu przetłocz i wyciśnij sok.
   - Materiały: Winogrona czerwone (ok. 15-20 kg na 10L wina), prasa lub tłuczek, fermentator
   - Warunki: Temperatura 18-25°C, czyste, sterylne naczynia
   - Ostrzeżenia: Nie używaj zepsutych owoców. Upewnij się, że wszystko jest czyste i wysterylizowane.

2. **Ewentualne tłoczenie lub maceracja** (3-7 dni przy maceracji, 1 dzień przy tłoczeniu)
   - Instrukcje: Jeśli wybrałeś macerację, codziennie mieszaj masę. Po 3-7 dniach przetłocz i wyciśnij sok. Jeśli wybrałeś tłoczenie, wykonaj je od razu.
   - Materiały: Prasa lub tłuczek, sitko, fermentator
   - Warunki: Temperatura 20-25°C
   - Ostrzeżenia: Nie maceruj zbyt długo - może powstać gorycz

3. **Fermentacja burzliwa** (5-10 dni)
   - Instrukcje: Dodaj drożdże winne oraz pożywka z witaminą B1 zgodnie z instrukcją. Fermentacja powinna być widoczna po dniu (bąbelki, pianowanie). Temperatura 18-22°C.
   - Materiały: Drożdże winne, pożywka z witaminą B1, cukier (jeśli potrzebny do korygowania soku)
   - Warunki: Temperatura 18-22°C, ciemne miejsce
   - Ostrzeżenia: Nie zamykaj hermetycznie - potrzebny dostęp tlenu na początku. Staraj się codziennie mieszać.

4. **Fermentacja cicha** (2-4 tygodnie)
   - Instrukcje: Po zakończeniu fermentacji burzliwej wino przechodzi w fazę cichą. Temperatura 15-18°C. Fermentacja trwa, ale jest mniej widoczna.
   - Materiały: Fermentator z zamknięciem
   - Warunki: Temperatura 15-18°C, ciemne, spokojne miejsce
   - Ostrzeżenia: Sprawdzaj regularnie, ale nie mieszaj zbyt często

5. **Klarowanie** (2-4 tygodnie)
   - Instrukcje: Wino powinno się klarować naturalnie. Można użyć klarownika (np. bentonit). Pozostaw wino w spokoju, osad opadnie na dno.
   - Materiały: Klarownik (opcjonalnie), cierpliwość
   - Warunki: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów
   - Ostrzeżenia: Nie mieszaj wina podczas klarowania. Jeśli po 4 tygodniach wino nie jest klarowne, rozważ użycie klarownika

6. **Zlewanie z nad osadu** (możliwe wielokrotnie)
   - Instrukcje: Przenieś wino do czystego naczynia, zostawiając osad na dnie. Użyj wężyka lub wlej ostrożnie.
   - Materiały: Wężyk lub lejek z sitkiem, czyste naczynie
   - Warunki: Ostrożność, aby nie zmącić wina
   - Ostrzeżenia: Nie mieszaj osadu z winem. Zlewaj powoli i ostrożnie

7. **Dojrzewanie/maturacja** (3-12 miesięcy)
   - Instrukcje: Przenieś wino do naczynia do dojrzewania (np. beczka dębowa lub szklany balon do wina). Temperatura 10-15°C. Zlewaj z nad osadu co 2-3 miesiące.
   - Materiały: Naczynie do dojrzewania, rurka fermentacyjna
   - Warunki: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów
   - Ostrzeżenia: Sprawdzaj regularnie czy nie ma oznak zepsucia. Zlewaj osad regularnie. Upewniaj się, że w rurce fermentacyjnej jest woda

8. **Butelkowanie** (1 dzień)
   - Instrukcje: Wysterylizuj butelki. Przenieś wino do butelek, zostawiając osad. Zamknij korkami. Przechowuj butelki poziomo w chłodnym, ciemnym miejscu.
   - Materiały: Butelki, korki, korkownica
   - Warunki: Sterylne warunki, chłodne miejsce
   - Ostrzeżenia: Nie napełniaj butelek pod korek - zostaw 1-2 cm przestrzeni. Upewnij się, że korki są właściwie zamknięte

**Typowe składniki:** Winogrona czerwone (15-20 kg na 10L), drożdże winne, pożywka z witaminą B1, cukier (jeśli potrzebny), klarownik (opcjonalnie), siarka (opcjonalnie, jako konserwant)

### 7.2 Wino białe

#### Etapy produkcji:
1. **Przygotowanie nastawu** (1 dzień)
   - Instrukcje: Wybierz dojrzałe winogrona białe. Usuń zepsute owoce i łodygi. Tłocz winogrona natychmiast (białe wino nie wymaga maceracji). Wyciśnij sok.
   - Materiały: Winogrona białe (ok. 12-15 kg na 10L wina), prasa lub tłuczek, fermentator
   - Warunki: Temperatura 15-20°C, czyste, sterylne naczynia
   - Ostrzeżenia: Dla białego wina ważne jest szybkie tłoczenie - nie pozostawiaj skórek z winogron w soku

2. **Fermentacja burzliwa** (7-14 dni)
   - Instrukcje: Dodaj drożdże winne do soku oraz pożywke z witaminą B1. Zainstaluj rurke fermentacyjną. Fermentacja powinna być widoczna. Temperatura 15-18°C (chłodniejsza niż dla czerwonego).
   - Materiały: Drożdże winne, pożywka z witaminą B1,  rurka fermentacyjna, cukier (jeśli potrzebny)
   - Warunki: Temperatura 15-18°C, ciemne miejsce
   - Ostrzeżenia: Białe wino fermentuje w niższej temperaturze niż czerwone. Utrzymuj stabilną temperaturę, Staraj się codziennie mieszać.

3. **Fermentacja cicha** (2-3 tygodnie)
   - Instrukcje: Po zakończeniu fermentacji burzliwej wino przechodzi w fazę cichą. Temperatura 12-15°C.
   - Materiały: Fermentator z zamknięciem, rurka fermentacyjna
   - Warunki: Temperatura 12-15°C, ciemne miejsce
   - Ostrzeżenia: Sprawdzaj regularnie, ale nie mieszaj

4. **Klarowanie** (2-3 tygodnie)
   - Instrukcje: Wino klaruje się naturalnie. Można użyć klarownika. Pozostaw w spokoju, osad opadnie.
   - Materiały: Klarownik (opcjonalnie)
   - Warunki: Temperatura 8-12°C, ciemne miejsce
   - Ostrzeżenia: Białe wino powinno być bardzo klarowne. Jeśli nie jest, użyj klarownika

5. **Zlewanie z nad osadu**
   - Instrukcje: Przenieś wino do czystego naczynia, zostawiając osad. Użyj syfonu.
   - Materiały: Syfon, czyste naczynie
   - Warunki: Ostrożność
   - Ostrzeżenia: Nie mieszaj osadu

6. **Dojrzewanie/maturacja** (3-6 miesięcy)
   - Instrukcje: Przenieś do naczynia do dojrzewania. Temperatura 8-12°C. Zlewaj z nad osadu co 2 miesiące.
   - Materiały: Naczynie do dojrzewania, korek
   - Warunki: Temperatura 8-12°C, ciemne miejsce
   - Ostrzeżenia: Białe wino dojrzewa krócej niż czerwone. Sprawdzaj regularnie

7. **Butelkowanie**
   - Instrukcje: Wysterylizuj butelki. Przenieś wino do butelek, zostawiając osad. Zamknij korkami.
   - Materiały: Butelki, korki, korkownica
   - Warunki: Sterylne warunki
   - Ostrzeżenia: Upewnij się, że wszystko jest czyste i sterylne

**Typowe składniki:** Winogrona białe (12-15 kg na 10L), drożdże winne, cukier (jeśli potrzebny), klarownik (opcjonalnie)

### 7.3 Wino różowe

#### Etapy produkcji:
1. **Przygotowanie nastawu** (1 dzień)
   - Instrukcje: Wybierz winogrona czerwone lub mieszankę czerwonego i białego. Usuń zepsute owoce. Wybierz krótką macerację (6-24 godziny) dla delikatnego koloru lub tłoczenie od razu. Po krótkiej maceracji przetłocz i wyciśnij sok różowy.
   - Materiały: Winogrona czerwone/białe (ok. 14-17 kg na 10L), prasa lub tłuczek, fermentator
   - Warunki: Temperatura 15-20°C
   - Ostrzeżenia: Krótka maceracja - nie pozostawiaj zbyt długo, bo wino będzie za ciemne

2. **Fermentacja burzliwa** (7-12 dni)
   - Instrukcje: Dodaj drożdże winne oraz pożywke z witaminą B1. Zainstaluj rurke fermencatujną. Temperatura 16-20°C.
   - Materiały: Drożdże winne, pożywka z witaminą B1, rurka fermentacyjna, cukier (jeśli potrzebny)
   - Warunki: Temperatura 16-20°C, ciemne miejsce
   - Ostrzeżenia: Kontroluj temperaturę - różowe wino jest wrażliwe na zbyt wysoką temperaturę, Staraj się codziennie mieszać.

3. **Fermentacja cicha** (2-3 tygodnie)
   - Instrukcje: Po zakończeniu fermentacji burzliwej, temperatura 14-16°C.
   - Materiały: Fermentator, rurka fermentacyjna
   - Warunki: Temperatura 14-16°C
   - Ostrzeżenia: Sprawdzaj regularnie

4. **Klarowanie** (2-3 tygodnie)
   - Instrukcje: Pozostaw wino do klarowania. Można użyć klarownika.
   - Materiały: Klarownik (opcjonalnie)
   - Warunki: Temperatura 10-12°C
   - Ostrzeżenia: Różowe wino powinno być bardzo klarowne i jasne

5. **Zlewanie z nad osadu**
   - Instrukcje: Przenieś wino do czystego naczynia.
   - Materiały: Syfon, czyste naczynie
   - Warunki: Ostrożność
   - Ostrzeżenia: Nie mieszaj osadu

6. **Dojrzewanie/maturacja** (2-4 miesiące)
   - Instrukcje: Przenieś do naczynia do dojrzewania. Temperatura 10-12°C.
   - Materiały: Naczynie do dojrzewania
   - Warunki: Temperatura 10-12°C
   - Ostrzeżenia: Różowe wino dojrzewa szybciej niż czerwone

7. **Butelkowanie**
   - Instrukcje: Wysterylizuj butelki. Przenieś wino i zamknij.
   - Materiały: Butelki, korki, korkownica
   - Warunki: Sterylne warunki
   - Ostrzeżenia: Upewnij się, że wszystko jest czyste

**Typowe składniki:** Winogrona czerwone/białe (14-17 kg na 10L), drożdże winne, cukier (jeśli potrzebny), klarownik (opcjonalnie)

### 7.4 Wino owocowe

#### Etapy produkcji:
1. **Przygotowanie nastawu** (1-2 dni)
   - Instrukcje: Wybierz dojrzałe owoce (jabłka, wiśnie, maliny, itp.). Umyj i usuń zepsute części. Zmiażdż lub zblenduj owoce. Opcjonalnie dodaj wodę (dla bardzo gęstych owoców). Dodaj cukier według potrzeb (sprawdź zawartość cukru w owocach).
   - Materiały: Owoce (ilość zależy od typu, ok. 10-15 kg na 10L), blender lub tłuczek, fermentator, woda (jeśli potrzebna), cukier
   - Warunki: Temperatura pokojowa, czyste naczynia
   - Ostrzeżenia: Upewnij się, że owoce są dojrzałe ale nie przejrzałe. Sprawdź zawartość cukru przed dodaniem dodatkowego cukru

2. **Ewentualne oddzielanie** (opcjonalnie, 1 dzień)
   - Instrukcje: Jeśli używasz owoców z pestkami/skórkami, możesz oddzielić sok od miąższu po 12-24 godzinach maceracji. Przetłocz przez sitko.
   - Materiały: Sitko, prasa (opcjonalnie)
   - Warunki: Temperatura pokojowa
   - Ostrzeżenia: Nie wszystkie wina owocowe wymagają oddzielania - zależy od typu owoców

3. **Fermentacja burzliwa** (7-14 dni)
   - Instrukcje: Dodaj drożdże owocowe (specjalne dla win owocowych) lub drożdże winne oraz pożywka z witaminą B1. Zainstaluj rurke fermentacyjną. Temperatura 18-22°C.
   - Materiały: Drożdże owocowe lub winne, pożywka z witaminą B1, rurka fermentacyjna, cukier (jeśli potrzebny)
   - Warunki: Temperatura 18-22°C
   - Ostrzeżenia: Niektóre owoce (np. jabłka) fermentują szybciej. Kontroluj proces codziennie, Staraj się codziennie mieszać.

4. **Fermentacja cicha** (2-4 tygodnie)
   - Instrukcje: Po zakończeniu fermentacji burzliwej, temperatura 15-18°C.
   - Materiały: Fermentator, rurka fermentacyjna
   - Warunki: Temperatura 15-18°C
   - Ostrzeżenia: Wina owocowe mogą fermentować dłużej niż winogronowe

5. **Klarowanie** (2-4 tygodnie)
   - Instrukcje: Pozostaw wino do klarowania. Wina owocowe mogą wymagać klarownika częściej.
   - Materiały: Klarownik (często potrzebny)
   - Warunki: Temperatura 10-15°C
   - Ostrzeżenia: Wina owocowe mogą być mniej klarowne - użyj klarownika jeśli potrzeba

6. **Zlewanie z nad osadu**
   - Instrukcje: Przenieś wino do czystego naczynia, zostawiając osad.
   - Materiały: Syfon, czyste naczynie
   - Warunki: Ostrożność
   - Ostrzeżenia: Wina owocowe mogą mieć więcej osadu - zlewaj ostrożnie

7. **Dojrzewanie/maturacja** (2-6 miesięcy)
   - Instrukcje: Przenieś do naczynia do dojrzewania. Temperatura 10-15°C. Zlewaj z nad osadu co 2-3 miesiące.
   - Materiały: Naczynie do dojrzewania
   - Warunki: Temperatura 10-15°C
   - Ostrzeżenia: Czas dojrzewania zależy od typu owoców - niektóre są gotowe szybciej

8. **Butelkowanie**
   - Instrukcje: Wysterylizuj butelki. Przenieś wino i zamknij.
   - Materiały: Butelki, korki, korkownica
   - Warunki: Sterylne warunki
   - Ostrzeżenia: Upewnij się, że wszystko jest czyste

**Typowe składniki:** Owoce (jabłka, wiśnie, maliny, śliwki, itp. - 10-15 kg na 10L), drożdże owocowe lub winne, cukier (często potrzebny), woda (opcjonalnie), klarownik (często potrzebny)

### 7.5 Miód pitny trójniak

#### Etapy produkcji:
1. **Przygotowanie nastawu** (1 dzień)
   - Instrukcje: Rozpuść miód w ciepłej wodzie (nie gotuj!). Proporcje: 1 część miodu na 2 części wody (trójniak). Temperatura wody max 40°C. Wymieszaj dokładnie. Opcjonalnie dodaj przyprawy (goździki, cynamon, itp.) - na początku lub później.
   - Materiały: Miód naturalny (ok. 3-4 kg na 10L), woda (6-8L na 10L), przyprawy (opcjonalnie), fermentator
   - Warunki: Temperatura wody max 40°C (nie gotować!), czyste naczynia
   - Ostrzeżenia: Nie gotuj miodu - traci właściwości. Użyj dobrej jakości miodu. Sprawdź czy woda jest odpowiedniej jakości (nie chlorowana lub przegotowana i ostudzona)

2. **Fermentacja burzliwa** (10-21 dni)
   - Instrukcje: Dodaj drożdże do miodu pitnego (specjalne drożdże do miodu pitnego lub drożdże winne) oraz pożywke z witaminą B1. Zainstaluj rurke fermentacyjną. Fermentacja jest widoczna (bąbelki, pianowanie). Temperatura 18-22°C. Codziennie mieszaj delikatnie na początku (pierwsze 3-5 dni).
   - Materiały: Drożdże do miodu pitnego lub winne, pożywka z witaminą B1, rurka fermentacyjna, dodatkowy miód lub cukier (jeśli potrzeba skorygować)
   - Warunki: Temperatura 18-22°C, ciemne miejsce
   - Ostrzeżenia: Miód pitny fermentuje wolniej niż wino. Bądź cierpliwy. Upewnij się, że zawór wodny ma wodę. Nie mieszaj zbyt agresywnie po pierwszych dniach, Staraj się codziennie mieszać.

3. **Fermentacja cicha** (4-8 tygodni)
   - Instrukcje: Po zakończeniu fermentacji burzliwej (mniej bąbelków) miód pitny przechodzi w fazę cichą. Temperatura 15-18°C. Fermentacja trwa, ale jest mniej widoczna.
   - Materiały: Fermentator z zamknięciem, rurka fermentacyjna
   - Warunki: Temperatura 15-18°C, ciemne, spokojne miejsce
   - Ostrzeżenia: Miód pitny potrzebuje więcej czasu na fermentację cichą niż wino. Sprawdzaj regularnie, ale nie mieszaj

4. **Klarowanie** (4-8 tygodni)
   - Instrukcje: Miód pitny klaruje się wolniej niż wino. Pozostaw w spokoju, osad opadnie na dno. Można użyć klarownika, ale często nie jest potrzebny - miód pitny klaruje się naturalnie.
   - Materiały: Klarownik (opcjonalnie, rzadko potrzebny), cierpliwość
   - Warunki: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów
   - Ostrzeżenia: Miód pitny potrzebuje dużo czasu na klarowanie - nie spiesz się. Jeśli po 8 tygodniach nie jest klarowne, rozważ użycie klarownika

5. **Zlewanie z nad osadu** (możliwe wielokrotnie)
   - Instrukcje: Przenieś miód pitny do czystego naczynia, zostawiając osad na dnie. Użyj syfonu lub wlej ostrożnie. Może być potrzeba zlewania kilkakrotnie.
   - Materiały: Syfon lub lejek z sitkiem, czyste naczynie
   - Warunki: Ostrożność, aby nie zmącić
   - Ostrzeżenia: Nie mieszaj osadu z miodem pitnym. Miód pitny może mieć więcej osadu niż wino - zlewaj regularnie

6. **Dojrzewanie/maturacja** (6-24 miesiące, najlepiej 12+)
   - Instrukcje: Przenieś miód pitny do naczynia do dojrzewania (szklany demijohn, najlepiej nie dębowy beczka - miód pitny nie potrzebuje dębu). Temperatura 10-15°C. Zlewaj z nad osadu co 3-4 miesiące. Miód pitny wymaga długiego dojrzewania - im dłużej, tym lepszy smak.
   - Materiały: Naczynie do dojrzewania (szklane, nie dębowe), korek lub rurka fermentacyjna
   - Warunki: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów
   - Ostrzeżenia: Miód pitny potrzebuje dużo czasu na dojrzewanie - minimum 6 miesięcy, najlepiej 12-24 miesiące. Sprawdzaj regularnie czy nie ma oznak zepsucia. Zlewaj osad regularnie. Nie spiesz się - dojrzewanie to kluczowy etap

7. **Butelkowanie** (1 dzień)
   - Instrukcje: Wysterylizuj butelki. Przenieś miód pitny do butelek, zostawiając osad. Zamknij korkami. Przechowuj butelki poziomo lub pionowo w chłodnym, ciemnym miejscu. Miód pitny może być jeszcze lepszy po butelkowaniu - dojrzewa dalej w butelkach.
   - Materiały: Butelki, korki, korkownica, syfon
   - Warunki: Sterylne warunki, chłodne miejsce
   - Ostrzeżenia: Nie napełniaj butelek pod korek - zostaw 1-2 cm przestrzeni. Upewnij się, że korki są właściwie zamknięte. Miód pitny może fermentować jeszcze w butelkach - sprawdzaj regularnie

**Typowe składniki:** Miód naturalny (3-4 kg na 10L), woda (6-8L na 10L), drożdże do miodu pitnego lub winne, przyprawy (goździki, cynamon, wanilia - opcjonalnie), klarownik (rzadko potrzebny)

---

*Dokument PRD został przygotowany na podstawie wymagań projektu WineLog MVP i zawiera wszystkie niezbędne informacje do rozpoczęcia rozwoju produktu.*

