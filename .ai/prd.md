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
- Prosta weryfikacja e-mail (link weryfikacyjny ważny przez 7 dni)
- Weryfikacja nie jest wymagana do rozpoczęcia korzystania z aplikacji (soft verification)
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
- Widoczny na wszystkich widokach dropdown w prawym górnym rogu z adresem e-mail i przyciskiem „Wyloguj”
- Po pomyślnym logowaniu lub rejestracji użytkownik jest przekierowywany do dashboardu
- Możliwość wylogowania przez użytkownika

#### 3.1.3 Zarządzanie kontem
- Podgląd danych konta (e-mail, data rejestracji)
- Reset hasła poprzez link wysyłany na adres e-mail (jedyna dostępna ścieżka zmiany hasła w MVP)
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
- Sekwencyjne przechodzenie przez etapy (tylko do przodu, bez możliwości pomijania lub cofania)
- Przejście do następnego etapu oznacza automatyczne ukończenie poprzedniego
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
- Data (automatyczna, bez możliwości ręcznej zmiany w MVP)
- Działanie (tekstowe pole opisujące wykonane działanie)
- Obserwacje (tekstowe pole na uwagi i obserwacje)

#### 3.4.2 Operacje CRUD
- Przeglądanie: wyświetlenie wszystkich notatek nastawu w chronologicznej kolejności
- Tworzenie: dodanie nowej notatki do aktualnego etapu
- Usuwanie: trwałe usunięcie notatki bez potwierdzenia (dla szybkości w MVP)

#### 3.4.3 Ograniczenia MVP
- Brak wersjonowania notatek
- Brak edytowania notatek (użytkownik może usunąć i dodać nową)
- Brak ręcznej zmiany daty notatki
- Brak potwierdzenia przy usuwaniu notatki

### 3.5 Archiwum i oceny

#### 3.5.1 Archiwizacja
- Możliwość zakończenia nastawu w dowolnym momencie (jeden klik)
- Automatyczne przeniesienie zakończonego nastawu do archiwum
- Bezterminowe przechowywanie zakończonych nastawów
- Możliwość ręcznego usunięcia nastawu z archiwum (uproszczone potwierdzenie w MVP)

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
- Prosta lista wszystkich zakończonych nastawów (brak lazy loading w MVP)
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
- Brak możliwości dodawania własnych szablonów (tylko szablony systemowe)
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
- Sekwencyjne przechodzenie przez etapy (tylko do przodu, bez pomijania i cofania)
- Brak restartu fermentacji w MVP
- Brak ocen nastawów w MVP (planowane na późniejsze wersje)
- Brak zmiany hasła w ustawieniach (tylko reset przez e-mail)
- Brak lazy loading w archiwum (prosta lista wszystkich nastawów)
- Brak przypomnień o weryfikacji e-mail w MVP
- Brak ręcznej zmiany daty w notatkach
- Brak timestampu ostatniej edycji notatek
- Brak statystyk na dashboardzie

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
- Po weryfikacji status konta zmienia się na zweryfikowane
- Użytkownik może korzystać z aplikacji przed weryfikacją (soft verification)
- Brak przypomnień o weryfikacji w MVP

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

#### US-005: Usunięcie konta
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
- Kliknięcie przechodzi do następnego etapu w sekwencji (tylko do przodu)
- Aktualny etap jest automatycznie oznaczany jako ukończony
- Nowy etap jest oznaczany jako aktualny
- Zmiana jest zapisywana natychmiast
- Użytkownik może opcjonalnie dodać notatkę
- Brak możliwości pomijania lub cofania etapów w MVP

#### US-014: Wybór tłoczenia vs maceracji
**Tytuł:** Wybór metody przygotowania nastawu

**Opis:** Jako zalogowany użytkownik chcę wybrać między tłoczeniem a maceracją podczas przygotowania nastawu, aby dostosować proces do moich potrzeb.

**Kryteria akceptacji:**
- W etapie "Przygotowanie nastawu" użytkownik może wybrać tłoczenie lub macerację
- Wybór jest opcjonalny (można pominąć)
- Wyświetlone są wyjaśnienia różnic i zastosowań dla początkujących
- Instrukcje krok po kroku zmieniają się w zależności od wyboru
- Wybór jest zapisywany i widoczny w szczegółach nastawu

### 5.4 Notatki

#### US-015: Dodanie notatki do nastawu
**Tytuł:** Tworzenie notatki z działaniem i obserwacjami

**Opis:** Jako zalogowany użytkownik chcę dodawać notatki do mojego nastawu, aby dokumentować postępy i obserwacje.

**Kryteria akceptacji:**
- Użytkownik może dodać notatkę z poziomu widoku szczegółów nastawu lub etapu
- Formularz notatki zawiera pola: data (automatyczna, bez możliwości zmiany), działanie, obserwacje
- Data jest ustawiana automatycznie i nie może być zmieniona w MVP
- Każde pole może mieć maksymalnie 200 znaków
- Notatka jest zapisywana do aktualnego etapu
- Po zapisaniu notatka jest widoczna w timeline nastawu
- Walidacja po stronie klienta i serwera

#### US-016: Przeglądanie notatek nastawu
**Tytuł:** Wyświetlenie wszystkich notatek nastawu

**Opis:** Jako zalogowany użytkownik chcę przeglądać wszystkie notatki mojego nastawu, aby śledzić historię produkcji.

**Kryteria akceptacji:**
- Wszystkie notatki nastawu są wyświetlane w chronologicznej kolejności
- Timeline pokazuje datę, działanie i obserwacje dla każdej notatki
- Notatki są powiązane z etapami
- Ostatnia notatka jest widoczna w preview na dashboardzie

#### US-017: Usunięcie notatki
**Tytuł:** Trwałe usunięcie notatki

**Opis:** Jako zalogowany użytkownik chcę usunąć notatkę, jeśli została dodana przez pomyłkę lub jest niepotrzebna.

**Kryteria akceptacji:**
- Użytkownik może usunąć notatkę z poziomu widoku notatki
- Brak potwierdzenia przed usunięciem w MVP (dla szybkości)
- Notatka jest trwale usunięta natychmiast po kliknięciu
- Usunięta notatka znika z timeline
- Brak możliwości przywrócenia usuniętej notatki (w MVP)
- Jeśli użytkownik chce poprawić notatkę, może ją usunąć i dodać nową

### 5.5 Archiwum i oceny

#### US-018: Zakończenie nastawu
**Tytuł:** Zakończenie produkcji nastawu

**Opis:** Jako zalogowany użytkownik chcę zakończyć mój nastaw w dowolnym momencie, aby przenieść go do archiwum.

**Kryteria akceptacji:**
- Użytkownik może zakończyć nastaw z poziomu widoku szczegółów
- Przy próbie zakończenia wyświetlane jest ostrzeżenie: "Czy na pewno chcesz zakończyć ten nastaw? Nastaw zostanie przeniesiony do archiwum."
- Brak opcjonalnego powodu zakończenia w MVP
- Po potwierdzeniu nastaw jest oznaczany jako zakończony
- Nastaw jest przenoszony do archiwum
- Data zakończenia jest zapisywana
- Nastaw znika z listy aktywnych nastawów

#### US-019: Przeglądanie archiwum
**Tytuł:** Wyświetlenie zakończonych nastawów

**Opis:** Jako zalogowany użytkownik chcę przeglądać moje zakończone nastawy w archiwum, aby analizować poprzednie produkcje.

**Kryteria akceptacji:**
- Sekcja Archiwum wyświetla listę wszystkich zakończonych nastawów (prosta lista, brak lazy loading w MVP)
- Dla każdego nastawu wyświetlane są: nazwa, typ, data rozpoczęcia, data zakończenia, ocena (jeśli dodana)
- Kliknięcie na nastaw otwiera widok szczegółów z pełną historią
- Dostępne są wszystkie notatki zakończonego nastawu
- Zakończone nastawy są przechowywane bezterminowo

#### US-020: Ocena zakończonego nastawu
**Tytuł:** Dodanie oceny 1-5 gwiazdek do nastawu

**Opis:** Jako zalogowany użytkownik chcę ocenić mój zakończony nastaw w skali 1-5 gwiazdek, aby oznaczyć jakość produktu końcowego.

**Kryteria akceptacji:**
- Użytkownik może dodać ocenę po zakończeniu nastawu
- Ocena jest w skali 1-5 gwiazdek
- Ocena może być dodana lub zmieniona w dowolnym momencie po zakończeniu
- Ocena jest wyświetlana w widoku archiwum i szczegółów nastawu
- Ocena jest zapisywana natychmiast po wyborze
- Brak możliwości usunięcia oceny (można zmienić na inną)

#### US-021: Usunięcie nastawu z archiwum
**Tytuł:** Trwałe usunięcie zakończonego nastawu

**Opis:** Jako zalogowany użytkownik chcę usunąć zakończony nastaw z archiwum, jeśli nie jest mi już potrzebny.

**Kryteria akceptacji:**
- Użytkownik może usunąć nastaw z archiwum
- Uproszczone potwierdzenie przed usunięciem w MVP
- Po potwierdzeniu nastaw i wszystkie jego notatki są trwale usunięte
- Usunięty nastaw znika z archiwum
- Brak możliwości przywrócenia usuniętego nastawu
- Komunikat potwierdzenia po usunięciu

### 5.6 Dashboard i nawigacja

#### US-022: Wyświetlenie dashboardu
**Tytuł:** Przeglądanie głównego ekranu z nastawami

**Opis:** Jako zalogowany użytkownik chcę widzieć mój dashboard z listą aktywnych nastawów i dostępem do archiwum, aby mieć szybki przegląd mojej pracy.

**Kryteria akceptacji:**
- Dashboard wyświetla listę aktywnych nastawów z podstawowymi informacjami
- Dashboard zawiera sekcję Archiwum z linkiem do zakończonych nastawów
- Przycisk "Nowy nastaw" jest łatwo dostępny i widoczny
- Dashboard jest responsywny i działa na wszystkich urządzeniach
- Ładowanie dashboardu jest szybkie (poniżej 3 sekund na 4G)
- Loading states są wyświetlane podczas ładowania
- Brak statystyk na dashboardzie w MVP

#### US-023: Nawigacja między sekcjami
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

#### US-024: Wyświetlanie błędów walidacji
**Tytuł:** Komunikaty błędów przy nieprawidłowych danych

**Opis:** Jako użytkownik chcę otrzymywać jasne komunikaty błędów, gdy wprowadzam nieprawidłowe dane, aby móc je poprawić.

**Kryteria akceptacji:**
- Komunikaty błędów są wyświetlane w języku polskim
- Błędy walidacji są wyświetlane natychmiast po próbie zapisania
- Komunikaty są konkretne i wskazują na problem
- Błędy są wyświetlane przy odpowiednich polach
- Ogólne błędy serwera wyświetlają komunikat: "Wystąpił błąd. Spróbuj ponownie."
- Szczegółowe logi błędów są zapisywane dla debugowania (bez wyświetlania użytkownikowi)

#### US-025: Obsługa błędów sieciowych
**Tytuł:** Reagowanie na problemy z połączeniem

**Opis:** Jako użytkownik chcę być informowany o problemach z połączeniem, aby wiedzieć kiedy aplikacja nie działa poprawnie.

**Kryteria akceptacji:**
- Przy braku połączenia wyświetlany jest komunikat: "Brak połączenia z internetem. Sprawdź swoje połączenie."
- Próby zapisania danych są wyświetlane jako pending
- Automatyczna retry przy przywróceniu połączenia (opcjonalnie)
- Komunikaty timeout są wyświetlane po przekroczeniu czasu oczekiwania
- Użytkownik może spróbować ponownie po przywróceniu połączenia

### 5.8 Responsywność i wydajność

#### US-026: Użycie aplikacji na urządzeniu mobilnym
**Tytuł:** Pełna funkcjonalność na telefonie

**Opis:** Jako użytkownik chcę używać aplikacji na moim telefonie, aby mieć dostęp do moich nastawów w dowolnym miejscu.

**Kryteria akceptacji:**
- Aplikacja jest w pełni funkcjonalna na urządzeniach mobilnych (od 320px)
- Layout dostosowuje się do rozdzielczości ekranu
- Wszystkie funkcjonalności są dostępne na mobile
- Tekst jest czytelny bez powiększania
- Przyciski i elementy interaktywne są łatwe do kliknięcia
- Nawigacja jest zoptymalizowana dla mobile

#### US-027: Szybkie ładowanie strony
**Tytuł:** Ładowanie aplikacji poniżej 3 sekund

**Opis:** Jako użytkownik chcę, aby aplikacja ładowała się szybko, aby nie tracić czasu na czekanie.

**Kryteria akceptacji:**
- Ładowanie strony głównej poniżej 3 sekund na 4G
- Reakcja interfejsu poniżej 200ms po akcji użytkownika
- Prosta lista wszystkich zakończonych nastawów (brak lazy loading w MVP)
- Loading states i skeleton screens podczas ładowania
- Optymalizacja obrazów i zasobów
- Monitoring wydajności i Core Web Vitals

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
   - Instrukcje: Jeśli wybrałeś macerację, codziennie mieszaj masę i zanurzaj kożuch (skórki) 2-3 razy dziennie. Kontroluj temperaturę (20-25°C) - jeśli rośnie, schładzaj. Po 3-7 dniach (lub gdy osiągniesz pożądany kolor) przetłocz i wyciśnij sok. Jeśli wybrałeś tłoczenie, wykonaj je od razu po zmiażdżeniu.
   - Materiały: Prasa lub tłuczek, sitko, fermentator, termometr
   - Warunki: Temperatura 20-25°C, przykrycie (ale nie szczelne - potrzebny dostęp tlenu)
   - Ostrzeżenia: Nie maceruj zbyt długo - powyżej 7 dni może powstać gorycz i nieprzyjemny smak. Kontroluj temperaturę - powyżej 28°C może zepsuć smak. Jeśli pojawi się pleśń, usuń ją natychmiast i skróć macerację.

3. **Fermentacja burzliwa** (5-10 dni)
   - Instrukcje: Dodaj drożdże winne oraz pożywka z witaminą B1 zgodnie z instrukcją na opakowaniu. Opcjonalnie dodaj siarkę (konserwant) w dawce 30-50 mg/l (dla wina czerwonego często nie jest konieczna). Fermentacja powinna być widoczna po 12-24 godzinach (bąbelki, pianowanie, kożuch na powierzchni). Temperatura 18-22°C. Codziennie mieszaj i zanurzaj kożuch (skórki na powierzchni) - to uwalnia barwniki i aromaty.
   - Materiały: Drożdże winne, pożywka z witaminą B1, siarka/siarczyn sodu (opcjonalnie, 30-50 mg/l), cukier (jeśli potrzebny do korygowania soku), rurka fermentacyjna
   - Warunki: Temperatura 18-22°C, ciemne miejsce, dostęp tlenu na początku (nie zamykaj hermetycznie)
   - Ostrzeżenia: Nie zamykaj hermetycznie na początku - drożdże potrzebują tlenu. Codziennie mieszaj i zanurzaj kożuch. Kontroluj temperaturę - zbyt wysoka (>25°C) może zepsuć smak. Jeśli fermentacja nie zacznie się w ciągu 48 godzin, sprawdź temperaturę i ewentualnie dodaj więcej drożdży.

4. **Fermentacja cicha** (2-4 tygodnie)
   - Instrukcje: Po zakończeniu fermentacji burzliwej (kożuch opadł, mniej bąbelków) wykonaj pierwsze zlewanie z nad osadu. Przenieś wino do czystego naczynia, zostawiając osad na dnie. Następnie wino przechodzi w fazę cichą - zamknij szczelnie z rurką fermentacyjną. Temperatura 15-18°C. Fermentacja trwa, ale jest mniej widoczna.
   - Materiały: Fermentator z zamknięciem, rurka fermentacyjna, syfon, czyste naczynie
   - Warunki: Temperatura 15-18°C, ciemne, spokojne miejsce, szczelne zamknięcie
   - Ostrzeżenia: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę. Sprawdzaj regularnie, ale nie mieszaj. Jeśli fermentacja całkowicie ustała, można dodać siarkę (30-50 mg/l) dla stabilności.

5. **Klarowanie** (2-4 tygodnie)
   - Instrukcje: Wino powinno się klarować naturalnie. Jeśli potrzebne jest szybsze klarowanie, użyj klarownika (np. bentonit - 2-4 g/l, rozpuść w wodzie i dodaj). Pozostaw wino w spokoju, osad opadnie na dno. Po 2-3 tygodniach sprawdź klarowność - wino powinno być przejrzyste.
   - Materiały: Klarownik (np. bentonit, żelatyna, białko jajka - opcjonalnie), cierpliwość
   - Warunki: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów, szczelne zamknięcie z rurką fermentacyjną
   - Ostrzeżenia: Nie mieszaj wina podczas klarowania. Jeśli po 4 tygodniach wino nie jest klarowne, rozważ użycie klarownika. Sprawdzaj czy rurka fermentacyjna ma wodę.

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

**Typowe składniki:** Winogrona czerwone (15-20 kg na 10L), drożdże winne, pożywka z witaminą B1, cukier (jeśli potrzebny do korekty ekstraktu), klarownik (opcjonalnie - bentonit, żelatyna), siarka/siarczyn sodu (opcjonalnie, 30-50 mg/l jako konserwant), rurka fermentacyjna

### 7.2 Wino białe

#### Etapy produkcji:
1. **Przygotowanie nastawu** (1 dzień)
   - Instrukcje: Wybierz dojrzałe winogrona białe. Usuń zepsute owoce i łodygi. Tłocz winogrona natychmiast (białe wino nie wymaga maceracji). Wyciśnij sok.
   - Materiały: Winogrona białe (ok. 12-15 kg na 10L wina), prasa lub tłuczek, fermentator
   - Warunki: Temperatura 15-20°C, czyste, sterylne naczynia
   - Ostrzeżenia: Dla białego wina ważne jest szybkie tłoczenie - nie pozostawiaj skórek z winogron w soku

2. **Fermentacja burzliwa** (7-14 dni)
   - Instrukcje: Dodaj drożdże winne do soku oraz pożywka z witaminą B1 zgodnie z instrukcją. Opcjonalnie dodaj siarkę (50-80 mg/l - dla białych win często potrzebna dla stabilności). Zainstaluj rurka fermentacyjną. Fermentacja powinna być widoczna po 12-24 godzinach (delikatne bąbelki, mniej piany niż w czerwonym). Temperatura 15-18°C (chłodniejsza niż dla czerwonego - ważne dla aromatu). Delikatnie mieszaj codziennie.
   - Materiały: Drożdże winne, pożywka z witaminą B1, rurka fermentacyjna, siarka/siarczyn sodu (opcjonalnie, 50-80 mg/l), cukier (jeśli potrzebny)
   - Warunki: Temperatura 15-18°C, ciemne miejsce, stabilna temperatura (ważne!)
   - Ostrzeżenia: Białe wino fermentuje w niższej temperaturze niż czerwone - to jest kluczowe dla aromatu. Utrzymuj stabilną temperaturę - wahania mogą zepsuć smak. Mieszaj delikatnie - mniej agresywnie niż czerwone (mniej kożucha). Jeśli fermentacja nie zacznie się w 48 godzin, sprawdź temperaturę.

3. **Fermentacja cicha** (2-3 tygodnie)
   - Instrukcje: Po zakończeniu fermentacji burzliwej (mniej bąbelków, osad opadł) wykonaj pierwsze zlewanie z nad osadu. Przenieś wino do czystego naczynia, zostawiając osad. Następnie wino przechodzi w fazę cichą - zamknij szczelnie z rurką fermentacyjną. Temperatura 15-18°C (nie 12-15°C - to zbyt niska dla kompletnej fermentacji).
   - Materiały: Fermentator z zamknięciem, rurka fermentacyjna, syfon, czyste naczynie
   - Warunki: Temperatura 15-18°C, ciemne miejsce, szczelne zamknięcie
   - Ostrzeżenia: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę. Sprawdzaj regularnie, ale nie mieszaj. Temperatura 15-18°C jest lepsza niż 12-15°C dla kompletnej fermentacji.

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

**Typowe składniki:** Winogrona białe (12-15 kg na 10L), drożdże winne, pożywka z witaminą B1, cukier (jeśli potrzebny), klarownik (opcjonalnie - bentonit, żelatyna), siarka/siarczyn sodu (opcjonalnie, 50-80 mg/l), rurka fermentacyjna

### 7.3 Wino różowe

#### Etapy produkcji:
1. **Przygotowanie nastawu** (1 dzień)
   - Instrukcje: Wybierz winogrona czerwone lub mieszankę czerwonego i białego. Usuń zepsute owoce. Wybierz krótką macerację (6-24 godziny) dla delikatnego koloru lub tłoczenie od razu. Po krótkiej maceracji przetłocz i wyciśnij sok różowy.
   - Materiały: Winogrona czerwone/białe (ok. 14-17 kg na 10L), prasa lub tłuczek, fermentator
   - Warunki: Temperatura 15-20°C
   - Ostrzeżenia: Krótka maceracja - nie pozostawiaj zbyt długo, bo wino będzie za ciemne

2. **Fermentacja burzliwa** (7-12 dni)
   - Instrukcje: Dodaj drożdże winne oraz pożywka z witaminą B1 zgodnie z instrukcją. Opcjonalnie dodaj siarkę (40-60 mg/l). Zainstaluj rurkę fermentacyjną. Temperatura 16-20°C. Fermentacja powinna być widoczna po 12-24 godzinach. Delikatnie mieszaj codziennie (mniej agresywnie niż czerwone, bo mniej kożucha).
   - Materiały: Drożdże winne, pożywka z witaminą B1, rurka fermentacyjna, siarka/siarczyn sodu (opcjonalnie, 40-60 mg/l), cukier (jeśli potrzebny)
   - Warunki: Temperatura 16-20°C, ciemne miejsce, stabilna temperatura
   - Ostrzeżenia: Kontroluj temperaturę - różowe wino jest wrażliwe na zbyt wysoką temperaturę (>22°C może zepsuć aromat). Mieszaj delikatnie codziennie. Jeśli fermentacja nie zacznie się w 48 godzin, sprawdź temperaturę.

3. **Fermentacja cicha** (2-3 tygodnie)
   - Instrukcje: Po zakończeniu fermentacji burzliwej (mniej bąbelków, osad opadł) wykonaj pierwsze zlewanie z nad osadu. Przenieś wino do czystego naczynia, zostawiając osad. Następnie wino przechodzi w fazę cichą - zamknij szczelnie z rurką fermentacyjną. Temperatura 15-18°C (nie 14-16°C - zbyt niska dla kompletnej fermentacji).
   - Materiały: Fermentator z zamknięciem, rurka fermentacyjna, syfon, czyste naczynie
   - Warunki: Temperatura 15-18°C, ciemne miejsce, szczelne zamknięcie
   - Ostrzeżenia: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę. Sprawdzaj regularnie, ale nie mieszaj. Temperatura 15-18°C jest lepsza dla kompletnej fermentacji.

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

**Typowe składniki:** Winogrona czerwone/białe (14-17 kg na 10L), drożdże winne, pożywka z witaminą B1, cukier (jeśli potrzebny), klarownik (opcjonalnie - bentonit, żelatyna), siarka/siarczyn sodu (opcjonalnie, 40-60 mg/l), rurka fermentacyjna

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
   - Instrukcje: Dodaj drożdże owocowe (specjalne dla win owocowych) lub drożdże winne oraz pożywka z witaminą B1 zgodnie z instrukcją. Opcjonalnie dodaj siarkę (40-60 mg/l - dla win owocowych często potrzebna dla stabilności). Zainstaluj rurkę fermentacyjną. Temperatura 18-22°C. Fermentacja powinna być widoczna po 12-24 godzinach (bąbelki, pianowanie). Codziennie mieszaj i zanurzaj kożuch (jeśli jest).
   - Materiały: Drożdże owocowe lub winne, pożywka z witaminą B1, rurka fermentacyjna, siarka/siarczyn sodu (opcjonalnie, 40-60 mg/l), cukier (jeśli potrzebny)
   - Warunki: Temperatura 18-22°C, ciemne miejsce, dostęp tlenu na początku
   - Ostrzeżenia: Niektóre owoce (np. jabłka) fermentują szybciej. Kontroluj proces codziennie, mieszaj i zanurzaj kożuch. Wina owocowe mogą fermentować intensywniej - upewnij się, że rurka fermentacyjna ma dużo miejsca na pianę. Jeśli fermentacja nie zacznie się w 48 godzin, sprawdź temperaturę i zawartość cukru.

4. **Fermentacja cicha** (2-4 tygodnie)
   - Instrukcje: Po zakończeniu fermentacji burzliwej (kożuch opadł, mniej bąbelków) wykonaj pierwsze zlewanie z nad osadu. Przenieś wino do czystego naczynia, zostawiając osad na dnie. Następnie wino przechodzi w fazę cichą - zamknij szczelnie z rurką fermentacyjną. Temperatura 15-18°C. Wina owocowe mogą fermentować dłużej niż winogronowe.
   - Materiały: Fermentator z zamknięciem, rurka fermentacyjna, syfon, czyste naczynie
   - Warunki: Temperatura 15-18°C, ciemne miejsce, szczelne zamknięcie
   - Ostrzeżenia: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę. Wina owocowe mogą fermentować dłużej niż winogronowe - bądź cierpliwy. Sprawdzaj regularnie, ale nie mieszaj.

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

**Typowe składniki:** Owoce (jabłka, wiśnie, maliny, śliwki, itp. - 10-15 kg na 10L), drożdże owocowe lub winne, pożywka z witaminą B1, cukier (często potrzebny - 150-200 g/l dla 12-14% alkoholu), woda (opcjonalnie, dla rozrzedzenia), klarownik (często potrzebny - bentonit, żelatyna), siarka/siarczyn sodu (opcjonalnie, 40-60 mg/l), rurka fermentacyjna

### 7.5 Miód pitny trójniak

#### Etapy produkcji:
1. **Przygotowanie nastawu** (1 dzień)
   - Instrukcje: Rozpuść miód w ciepłej wodzie (nie gotuj!). Proporcje: 1 część miodu na 2 części wody (trójniak). Temperatura wody max 40°C. Wymieszaj dokładnie. Opcjonalnie dodaj przyprawy (goździki, cynamon, itp.) - na początku lub później.
   - Materiały: Miód naturalny (ok. 3-4 kg na 10L), woda (6-8L na 10L), przyprawy (opcjonalnie), fermentator
   - Warunki: Temperatura wody max 40°C (nie gotować!), czyste naczynia
   - Ostrzeżenia: Nie gotuj miodu - traci właściwości. Użyj dobrej jakości miodu. Sprawdź czy woda jest odpowiedniej jakości (nie chlorowana lub przegotowana i ostudzona)

2. **Fermentacja burzliwa** (10-21 dni)
   - Instrukcje: Dodaj drożdże do miodu pitnego (specjalne drożdże do miodu pitnego lub drożdże winne) oraz pożywka z witaminą B1 zgodnie z instrukcją. Miód pitny ma mało składników odżywczych, więc pożywka jest bardzo ważna. Zainstaluj rurkę fermentacyjną (upewnij się, że ma wodę!). Fermentacja jest widoczna po 2-3 dniach (bąbelki, pianowanie - miodu pitny ma więcej piany niż wino). Temperatura 18-22°C. Codziennie mieszaj delikatnie na początku (pierwsze 3-5 dni) - to napowietrza i pomaga drożdżom. Po 5 dniach przestań mieszać.
   - Materiały: Drożdże do miodu pitnego lub winne (odporne na wysoką zawartość alkoholu), pożywka z witaminą B1 (ważna!), rurka fermentacyjna, dodatkowy miód lub cukier (jeśli potrzeba skorygować ekstrakt)
   - Warunki: Temperatura 18-22°C, ciemne miejsce, dostęp tlenu na początku (nie zamykaj hermetycznie przez pierwsze 3-5 dni)
   - Ostrzeżenia: Miód pitny fermentuje wolniej niż wino - bądź cierpliwy, to normalne. Upewnij się, że rurka fermentacyjna ma wodę (sprawdzaj codziennie!). Nie mieszaj zbyt agresywnie po pierwszych 5 dniach - pozwól drożdżom pracować. Jeśli fermentacja nie zacznie się w ciągu 5 dni, dodaj więcej pożywki i/lub więcej drożdży.

3. **Fermentacja cicha** (4-8 tygodni)
   - Instrukcje: Po zakończeniu fermentacji burzliwej (mniej bąbelków, mniej piany, osad opadł - może to trwać dłużej niż w winie) wykonaj pierwsze zlewanie z nad osadu. Przenieś miód pitny do czystego naczynia, zostawiając osad na dnie. Następnie zamknij szczelnie z rurką fermentacyjną - przechodzi w fazę cichą. Temperatura 15-18°C. Fermentacja trwa, ale jest mniej widoczna (może być 1 bąbelek co kilka sekund).
   - Materiały: Fermentator z zamknięciem, rurka fermentacyjna, syfon, czyste naczynie
   - Warunki: Temperatura 15-18°C, ciemne, spokojne miejsce, szczelne zamknięcie
   - Ostrzeżenia: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę (ważne!). Miód pitny potrzebuje więcej czasu na fermentację cichą niż wino - to normalne. Sprawdzaj regularnie (co tydzień), ale nie mieszaj. Jeśli fermentacja całkowicie ustała po 8 tygodniach, można zakończyć - ale miód pitny może fermentować nawet do 12 tygodni.

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

