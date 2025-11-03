# Dokument wymagań produktu (PRD) - Aplikacja do produkcji wina i miodu pitnego

## 1. Przegląd produktu

### 1.1 Cel dokumentu
Niniejszy dokument definiuje wymagania produktu dla aplikacji webowej wspierającej osoby początkujące i średnio zaawansowane w procesie produkcji wina oraz miodu pitnego. Dokument służy jako źródło prawdy dla zespołu produkcyjnego, deweloperskiego i testowego.

### 1.2 Zakres produktu
Aplikacja webowa umożliwiająca użytkownikom prowadzenie cyfrowego dziennika produkcji wina i miodu pitnego. Produkt zapewnia szczegółowe instrukcje krok-po-kroku dla każdego etapu produkcji, system notatek, archiwizację zakończonych nastawów oraz możliwość oceny końcowego produktu.

### 1.3 Grupa docelowa
- Osoby początkujące rozpoczynające przygodę z produkcją wina/miodu pitnego
- Hobbyści średnio zaawansowani potrzebujący organizacji wielu nastawów jednocześnie
- Użytkownicy poszukujący szczegółowych, zrozumiałych instrukcji bez konieczności korzystania z dodatkowych źródeł

### 1.4 Platforma docelowa
- Aplikacja webowa responsywna (desktop, tablet, mobile)
- Obsługa rozdzielczości od 320px do 4K
- Priorytet mobile-first z optymalizacją dla urządzeń mobilnych i tabletów
- Wymagania przeglądarki: nowoczesne przeglądarki (Chrome, Firefox, Safari, Edge z ostatnich 2 lat)

## 2. Problem użytkownika

### 2.1 Główny problem
Produkcja wina dla osób początkujących może być problematyczna. Wiele osób chce szybko zacząć bez uprzedniego zagłębienia się w temat, co w rezultacie może prowadzić do słabej jakości wina. Brakuje centralnego miejsca do prowadzenia notatek z produkcji, śledzenia postępów oraz archiwizowania doświadczeń.

### 2.2 Wtórne problemy
- Trudność w znalezieniu zrozumiałych, kompleksowych instrukcji dostosowanych do poziomu początkującego
- Brak organizacji przy prowadzeniu wielu nastawów jednocześnie
- Problem z zapamiętaniem wszystkich etapów produkcji i ich kolejności
- Brak systemu do dokumentowania obserwacji i działań podczas produkcji
- Trudność w ocenie jakości końcowego produktu i wyciąganiu wniosków na przyszłość
- Brak przypomnienia o typowych błędach i problemach na każdym etapie

### 2.3 Wartość produktu
Aplikacja rozwiązuje te problemy poprzez:
- Dostarczenie szczegółowych instrukcji etapowych wystarczających do samodzielnej produkcji
- Centralizację wszystkich notatek i informacji o nastawach w jednym miejscu
- Przewodzenie użytkownika przez cały proces produkcji krok-po-kroku
- System proaktywnych podpowiedzi i ostrzeżeń przed typowymi błędami
- Możliwość oceny i archiwizacji doświadczeń dla celów edukacyjnych

## 3. Wymagania funkcjonalne

### 3.1 System kont użytkowników

#### 3.1.1 Rejestracja
- Rejestracja wymaga: adres e-mail (unikalny), hasło (min. 8 znaków, wymagana 1 wielka litera, 1 mała litera, 1 cyfra)
- Walidacja formatu e-mail po stronie klienta i serwera
- Weryfikacja e-mail z model "soft verification" - użytkownik może korzystać z aplikacji przed weryfikacją
- Link weryfikacyjny ważny przez 7 dni
- System przypomnień o weryfikacji podczas korzystania z aplikacji
- Brak OAuth w MVP (planowane na przyszłość)

#### 3.1.2 Logowanie i wylogowywanie
- Logowanie za pomocą e-mail i hasła
- Sesja użytkownika z automatycznym wylogowaniem po 30 dniach nieaktywności lub wygaśnięciu tokenu
- Komunikat o konieczności ponownego zalogowania przy próbie dostępu po wygaśnięciu sesji
- Możliwość ręcznego wylogowania przez użytkownika

#### 3.1.3 Zarządzanie kontem
- Profil użytkownika z możliwością edycji podstawowych danych (e-mail, hasło)
- Usunięcie konta z całkowitym usunięciem wszystkich danych użytkownika (RODO)
- Szyfrowanie danych wrażliwych w bazie danych
- Brak eksportu danych w formacie JSON w MVP (planowane na przyszłość)

### 3.2 Zarządzanie nastawami

#### 3.2.1 Tworzenie nastawu
- Minimalne wymagane dane: wybór szablonu
- Opcjonalna nazwa nastawu - jeśli nie podana, generowana automatycznie w formacie: "[Typ] #N" (np. "Wino czerwone #1", "Miód pitny trójniak #2")
- Tworzenie nastawu w maksymalnie 2 kliknięciach
- Automatyczne przypisanie daty rozpoczęcia w momencie utworzenia
- Użytkownik może mieć wiele aktywnych nastawów jednocześnie

#### 3.2.2 Szablony nastawów
Dostępne szablony w MVP:
- Wino czerwone
- Wino białe
- Wino różowe
- Wino owocowe
- Miód pitny trójniak

Każdy szablon zawiera:
- Nazwy etapów produkcji
- Sugerowane czasy trwania etapów
- Krótkie opisy co robić na każdym etapie (wystarczające dla początkującego)
- Listę typowych składników
- Wskazówki dotyczące warunków (temperatura, wilgotność) dla każdego etapu

#### 3.2.3 Edycja i usuwanie nastawu
- Edycja nazwy nastawu w dowolnym momencie (tylko dla aktywnych nastawów)
- Usuwanie aktywnych nastawów z potwierdzeniem
- Usuwanie nastawów z archiwum z potwierdzeniem

### 3.3 Etapy produkcji

#### 3.3.1 Lista etapów (wspólna dla wszystkich szablonów)
1. Przygotowanie nastawu
2. Tłoczenie lub maceracja (opcjonalny)
3. Oddzielanie (opcjonalny)
4. Fermentacja burzliwa
5. Fermentacja cicha
6. Klarowanie
7. Zlewanie z nad osadu
8. Dojrzewanie/maturacja
9. Butelkowanie

#### 3.3.2 Funkcjonalności etapów
- Widok szczegółowy etapu zawierający:
  - Szczegółowe instrukcje krok-po-kroku
  - Listę potrzebnych materiałów
  - Sugerowany czas trwania
  - Warunki środowiskowe (temperatura, wilgotność)
  - Proaktywne podpowiedzi i ostrzeżenia dla typowych błędów
- Przechodzenie do następnego etapu z możliwością oznaczenia jako "pominięty"
- Powrót do poprzedniego etapu z wymaganą notatką wyjaśniającą powód
- Ostrzeżenia przy pomijaniu etapów lub cofaniu się
- Możliwość przechodzenia między etapami w dowolnej kolejności (z ostrzeżeniami)
- Restart fermentacji w dowolnej chwili (dodaje notatkę o restarcie z aktualną datą, bez cofania etapu)
- Oznaczenie aktualnego etapu w liście wszystkich etapów
- Historia zmian etapów widoczna w notatkach

#### 3.3.3 Szczegóły etapów dla szablonów

**Wino czerwone:**
- Przygotowanie nastawu: Wybór tłoczenia vs maceracji (z wyjaśnieniami różnic dla początkujących)
- Fermentacja burzliwa: 5-7 dni w temperaturze 20-25°C
- Fermentacja cicha: 10-14 dni w temperaturze 18-22°C
- Klarowanie: 2-4 tygodnie
- Dojrzewanie/maturacja: 3-6 miesięcy
- Butelkowanie: po zakończeniu dojrzewania

**Wino białe:**
- Przygotowanie nastawu: Bez maceracji skórek
- Fermentacja burzliwa: 5-7 dni w temperaturze 15-18°C
- Fermentacja cicha: 7-10 dni w temperaturze 15-18°C
- Klarowanie: 2-3 tygodnie
- Dojrzewanie/maturacja: 2-4 miesiące
- Butelkowanie: po zakończeniu dojrzewania

**Wino różowe:**
- Przygotowanie nastawu: Krótka maceracja skórek (12-24h)
- Fermentacja burzliwa: 4-6 dni w temperaturze 18-22°C
- Fermentacja cicha: 7-10 dni w temperaturze 18-22°C
- Klarowanie: 2-3 tygodnie
- Dojrzewanie/maturacja: 2-3 miesiące
- Butelkowanie: po zakończeniu dojrzewania

**Wino owocowe:**
- Przygotowanie nastawu: Przygotowanie owoców, wybór tłoczenia vs maceracji
- Fermentacja burzliwa: 5-7 dni w temperaturze 20-25°C
- Fermentacja cicha: 10-14 dni w temperaturze 18-22°C
- Klarowanie: 2-4 tygodnie
- Dojrzewanie/maturacja: 2-4 miesiące
- Butelkowanie: po zakończeniu dojrzewania

**Miód pitny trójniak:**
- Przygotowanie nastawu: Przygotowanie roztworu miodu z wodą (stosunek 1:3)
- Fermentacja burzliwa: 7-10 dni w temperaturze 20-25°C
- Fermentacja cicha: 14-21 dni w temperaturze 18-22°C
- Klarowanie: 4-6 tygodni
- Dojrzewanie/maturacja: 6-12 miesięcy
- Butelkowanie: po zakończeniu dojrzewania

#### 3.3.4 Składniki typowe dla szablonów

**Wino czerwone:**
- Winogrona czerwone (10-15 kg na 10 l wina)
- Drożdże winiarskie
- Pożywka dla drożdży
- Siarczyny (opcjonalnie)
- Cukier (jeśli potrzebny do korygowania cukru)

**Wino białe:**
- Winogrona białe (10-15 kg na 10 l wina)
- Drożdże winiarskie
- Pożywka dla drożdży
- Siarczyny (opcjonalnie)
- Cukier (jeśli potrzebny)

**Wino różowe:**
- Winogrona różowe lub mieszanka czerwonych i białych (10-15 kg na 10 l)
- Drożdże winiarskie
- Pożywka dla drożdży
- Siarczyny (opcjonalnie)

**Wino owocowe:**
- Owoce (10-20 kg na 10 l wina, zależnie od owocu)
- Drożdże winiarskie lub owocowe
- Pożywka dla drożdży
- Cukier (zależnie od owocu)
- Woda (jeśli potrzebna)

**Miód pitny trójniak:**
- Miód (1 część na 3 części wody)
- Drożdże do miodu pitnego
- Pożywka dla drożdży
- Owoce/przyprawy (opcjonalnie)

### 3.4 System notatek

#### 3.4.1 Pola notatki
- Data (automatyczna lub ręczna)
- Działanie (co zostało wykonane)
- Obserwacje (co użytkownik zaobserwował)
- Timestamp ostatniej edycji

#### 3.4.2 Operacje na notatkach
- Tworzenie notatki dla danego etapu
- Przeglądanie wszystkich notatek nastawu (chronologicznie lub po etapach)
- Edycja notatki (tylko przez właściciela)
- Usuwanie notatki (tylko przez właściciela)
- Brak wersjonowania notatek w MVP (możliwość edycji bez cofania zmian)

#### 3.4.3 Powiązanie notatek
- Każda notatka jest przypisana do konkretnego nastawu
- Notatka może być przypisana do konkretnego etapu
- Historia restartów fermentacji widoczna w notatkach
- Notatki wyświetlane razem z informacją o etapie

### 3.5 Archiwum i oceny

#### 3.5.1 Archiwizacja
- Zakończenie nastawu w dowolnym momencie (przez użytkownika)
- Opcjonalny powód zakończenia w notatce
- Automatyczne przeniesienie do archiwum po zakończeniu
- Bezterminowe przechowywanie zakończonych nastawów
- Możliwość ręcznego usunięcia nastawu z archiwum

#### 3.5.2 Oceny
- Ocena zakończonego nastawu w skali 1-5 gwiazdek
- Ocena jest opcjonalna, można ją dodać lub zmienić w dowolnym momencie po zakończeniu
- Prosta ocena ogólna (bez szczegółowych kategorii w MVP)
- Ocena wyświetlana w archiwum obok nastawu

### 3.6 Dashboard i nawigacja

#### 3.6.1 Główny dashboard
- Lista aktywnych nastawów z informacjami:
  - Nazwa nastawu
  - Typ (wino/miód pitny) i szablon
  - Data rozpoczęcia
  - Aktualny etap
  - Data ostatniej notatki
  - Podgląd ostatniej notatki (pierwsze 50 znaków)
- Sekcja Archiwum z zakończonymi nastawami:
  - Nazwa nastawu
  - Typ i szablon
  - Data rozpoczęcia i zakończenia
  - Ocena (1-5 gwiazdek)
- Przycisk "Nowy nastaw" z łatwym dostępem
- Filtrowanie nastawów:
  - Po statusie (aktywne/zakończone)
  - Po typie (wino/miód pitny)
- Sortowanie nastawów:
  - Po dacie rozpoczęcia (rosnąco/malejąco)
  - Po dacie ostatniej aktywności

#### 3.6.2 Widok szczegółowy nastawu
- Nagłówek z nazwą, typem, datą rozpoczęcia
- Lista wszystkich etapów z wizualnym oznaczeniem:
  - Zakończone etapy
  - Aktualny etap
  - Pominięte etapy
  - Przyszłe etapy
- Szczegóły aktualnego etapu z instrukcjami
- Sekcja notatek dla nastawu
- Możliwość zakończenia nastawu
- Przycisk powrotu do dashboardu

### 3.7 Obsługa błędów i walidacja

#### 3.7.1 Walidacja danych
- Walidacja po stronie serwera dla wszystkich operacji
- Walidacja po stronie klienta dla lepszego UX
- Reguły walidacji:
  - E-mail: format zgodny z RFC 5322
  - Hasło: min. 8 znaków, 1 wielka litera, 1 mała litera, 1 cyfra
  - Nazwa nastawu: max 100 znaków, nie może być pusta (jeśli podana)
  - Notatki: max 5000 znaków

#### 3.7.2 Komunikaty błędów
- Przyjazne komunikaty błędów dla użytkownika (np. "Podany adres e-mail jest już zarejestrowany", "Hasło musi zawierać co najmniej 8 znaków")
- Ostrzeżenia przed działaniami (np. "Czy na pewno chcesz pominąć ten etap?", "Cofnięcie do poprzedniego etapu spowoduje utratę postępu")
- Logowanie błędów po stronie serwera dla celów debugowania
- Komunikaty o wygaśnięciu sesji z przekierowaniem do logowania

### 3.8 Wydajność i responsywność

#### 3.8.1 Wymagania wydajnościowe
- Ładowanie strony poniżej 3 sekund na połączeniu 4G
- Reakcja interfejsu na akcje użytkownika poniżej 200ms
- Lazy loading dla archiwum (ładowanie po 20 nastawów)
- Loading states i skeleton screens podczas ładowania danych

#### 3.8.2 Responsywność
- Pełna funkcjonalność na urządzeniach od 320px do 4K
- Design mobile-first z priorytetem dla urządzeń mobilnych i tabletów
- Adaptacyjny layout z przełączeniem na widok desktopowy dla większych ekranów
- Touch-friendly interfejs na urządzeniach mobilnych

### 3.9 Metryki i analityka

#### 3.9.1 Anonimowe metryki (zgodne z RODO)
- Liczba aktywnych nastawów na użytkownika
- Średni czas ukończenia nastawu
- Najczęściej wybierane szablony
- Punkty drop-off (gdzie użytkownicy przestają używać aplikacji)
- Czas spędzony w aplikacji
- Możliwość wyłączenia metryk przez użytkownika w ustawieniach

#### 3.9.2 Skalowalność
- Aplikacja zaprojektowana dla małej skali (do 1000 użytkowników)
- Proste rozwiązania infrastrukturalne z planem skalowania w przyszłości

## 4. Granice produktu

### 4.1 Co jest w zakresie MVP
- Aplikacja webowa responsywna
- System kont z rejestracją e-mail + hasło i soft verification
- Zarządzanie nastawami wina (czerwone, białe, różowe, owocowe) i miodu pitnego (trójniak)
- Szczegółowe instrukcje etapowe dla początkujących
- System notatek z podstawowymi polami
- Archiwum zakończonych nastawów
- Ocena nastawów w skali 1-5 gwiazdek
- Dashboard z filtrowaniem i sortowaniem
- Proaktywne podpowiedzi i ostrzeżenia
- Obsługa wielu aktywnych nastawów jednocześnie

### 4.2 Co NIE jest w zakresie MVP

#### 4.2.1 Platformy i funkcjonalności
- Aplikacje mobilne natywne (iOS/Android) - tylko aplikacja webowa
- Tryb offline/read-only - aplikacja wymaga połączenia z internetem
- Zaawansowane kalkulatory (pomiar alkoholu, cukru, gęstości) - aplikacja dla początkujących
- Wytwarzanie piwa i cydru - tylko wino i miód pitny w MVP
- OAuth/logowanie przez zewnętrzne serwisy (Google, Facebook) - tylko e-mail + hasło
- Notyfikacje e-mail/push - architektura przygotowana, ale bez implementacji w MVP

#### 4.2.2 Funkcjonalności zaawansowane
- Wersjonowanie notatek i możliwość cofnięcia zmian
- Eksport danych użytkownika w formacie JSON
- Zaawansowane wyszukiwanie i filtry (tylko podstawowe filtrowanie po statusie i typie)
- Dodawanie własnych etapów przez użytkownika
- Zaawansowana ocena z kategoriami (tylko prosta ocena 1-5 gwiazdek)
- Pomiary w notatkach (temperatura, gęstość) - architektura przygotowana na przyszłość
- Współdzielenie nastawów z innymi użytkownikami
- Komentarze i społeczność

#### 4.2.3 Design i personalizacja
- Zaawansowane opcje personalizacji interfejsu (ciemny motyw, kolory) - tylko podstawowy design
- Zaawansowane raporty i wykresy - tylko podstawowe wyświetlanie danych
- Integracje z zewnętrznymi serwisami

### 4.3 Architektura przygotowana na przyszłość
Mimo że funkcjonalności nie są implementowane w MVP, architektura powinna być przygotowana na:
- Dodanie notyfikacji e-mail
- Dodanie pomiarów do notatek (temperatura, gęstość, cukier)
- Rozszerzenie o inne kategorie (piwo, cydr)
- Tryb offline/read-only
- Wersjonowanie notatek
- OAuth/logowanie przez zewnętrzne serwisy
- Eksport danych

## 5. Historyjki użytkowników

### US-001: Rejestracja nowego użytkownika
**Tytuł:** Jako nowy użytkownik chcę się zarejestrować, aby móc korzystać z aplikacji

**Opis:** Użytkownik odwiedza aplikację po raz pierwszy i chce utworzyć konto, aby móc prowadzić swoje nastawy wina lub miodu pitnego.

**Kryteria akceptacji:**
- Użytkownik może wprowadzić adres e-mail i hasło na stronie rejestracji
- System waliduje format e-mail i wymagania hasła (min. 8 znaków, 1 wielka litera, 1 mała litera, 1 cyfra) przed wysłaniem formularza
- Po rejestracji użytkownik otrzymuje e-mail weryfikacyjny z linkiem ważnym przez 7 dni
- Użytkownik może rozpocząć korzystanie z aplikacji natychmiast po rejestracji (soft verification)
- System wyświetla przypomnienia o weryfikacji podczas korzystania z aplikacji
- Komunikaty błędów są przyjazne i zrozumiałe (np. "Podany adres e-mail jest już zarejestrowany")

### US-002: Logowanie użytkownika
**Tytuł:** Jako zarejestrowany użytkownik chcę się zalogować, aby uzyskać dostęp do moich nastawów

**Opis:** Użytkownik, który ma już konto, chce się zalogować, aby uzyskać dostęp do swojej aplikacji i nastawów.

**Kryteria akceptacji:**
- Użytkownik może wprowadzić adres e-mail i hasło na stronie logowania
- Po poprawnym logowaniu użytkownik jest przekierowywany do dashboardu
- Po niepoprawnym logowaniu system wyświetla przyjazny komunikat błędu
- Sesja użytkownika pozostaje aktywna przez 30 dni nieaktywności
- System wyświetla komunikat o konieczności ponownego zalogowania przy próbie dostępu po wygaśnięciu sesji

### US-003: Weryfikacja adresu e-mail
**Tytuł:** Jako użytkownik chcę zweryfikować mój adres e-mail, aby upewnić się, że moje konto jest bezpieczne

**Opis:** Użytkownik otrzymał e-mail weryfikacyjny i chce zweryfikować swoje konto.

**Kryteria akceptacji:**
- Użytkownik może kliknąć link weryfikacyjny w e-mailu
- Link jest ważny przez 7 dni od momentu rejestracji
- Po kliknięciu linku konto jest zweryfikowane
- System potwierdza weryfikację użytkownikowi
- Jeśli link wygasł, użytkownik może poprosić o nowy link weryfikacyjny

### US-004: Utworzenie nowego nastawu
**Tytuł:** Jako użytkownik chcę szybko utworzyć nowy nastaw, aby rozpocząć produkcję wina lub miodu pitnego

**Opis:** Użytkownik chce rozpocząć nowy nastaw wina lub miodu pitnego i potrzebuje szybkiego sposobu na jego utworzenie.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Nowy nastaw" na dashboardzie
- System wyświetla listę dostępnych szablonów (wino czerwone, białe, różowe, owocowe, miód pitny trójniak)
- Użytkownik może wybrać szablon w jednym kliknięciu
- Użytkownik może opcjonalnie wprowadzić nazwę nastawu
- Jeśli nazwa nie zostanie podana, system generuje domyślną w formacie "[Typ] #N" (np. "Wino czerwone #1")
- Nastaw jest utworzony w maksymalnie 2 kliknięciach
- Po utworzeniu użytkownik jest przekierowywany do widoku szczegółowego nastawu
- Data rozpoczęcia jest automatycznie ustawiana na datę utworzenia

### US-005: Przeglądanie listy aktywnych nastawów
**Tytuł:** Jako użytkownik chcę zobaczyć wszystkie moje aktywne nastawy na dashboardzie, aby łatwo przełączać się między nimi

**Opis:** Użytkownik prowadzi wiele nastawów jednocześnie i potrzebuje przejrzystego widoku wszystkich aktywnych nastawów.

**Kryteria akceptacji:**
- Dashboard wyświetla listę wszystkich aktywnych nastawów użytkownika
- Dla każdego nastawu wyświetlane są: nazwa, typ (wino/miód pitny), szablon, data rozpoczęcia, aktualny etap, data ostatniej notatki, podgląd ostatniej notatki (pierwsze 50 znaków)
- Użytkownik może kliknąć na nastaw, aby przejść do widoku szczegółowego
- Jeśli użytkownik nie ma aktywnych nastawów, wyświetlany jest przyjazny komunikat zachęcający do utworzenia pierwszego nastawu
- Lista jest responsywna i działa poprawnie na urządzeniach mobilnych

### US-006: Przeglądanie szczegółów etapu produkcji
**Tytuł:** Jako użytkownik chcę zobaczyć szczegółowe instrukcje dla aktualnego etapu, aby wiedzieć, co dokładnie mam zrobić

**Opis:** Użytkownik otworzył nastaw i chce zobaczyć szczegóły aktualnego etapu produkcji z instrukcjami krok-po-kroku.

**Kryteria akceptacji:**
- Widok szczegółowy nastawu wyświetla listę wszystkich etapów z oznaczeniem aktualnego
- Kliknięcie na etap wyświetla szczegółowe instrukcje zawierające:
  - Krok-po-kroku co robić na tym etapie
  - Listę potrzebnych materiałów
  - Sugerowany czas trwania
  - Warunki środowiskowe (temperatura, wilgotność)
  - Proaktywne podpowiedzi i ostrzeżenia dla typowych błędów
- Instrukcje są wystarczająco szczegółowe, aby początkujący użytkownik mógł wykonać zadanie bez dodatkowych źródeł
- Instrukcje są wyświetlane w prostym, zrozumiałym języku

### US-007: Przechodzenie do następnego etapu
**Tytuł:** Jako użytkownik chcę oznaczyć etap jako zakończony i przejść do następnego, aby śledzić postęp w produkcji

**Opis:** Użytkownik zakończył pracę na aktualnym etapie i chce przejść do kolejnego etapu produkcji.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Przejdź do następnego etapu" na aktualnym etapie
- System aktualizuje aktualny etap nastawu
- Użytkownik jest automatycznie przekierowywany do widoku nowego etapu
- Historia zmiany etapu jest zapisywana w systemie
- Użytkownik może wrócić do poprzedniego etapu, jeśli zajdzie taka potrzeba

### US-008: Pomijanie etapu
**Tytuł:** Jako użytkownik chcę pominąć etap, który nie jest potrzebny w moim procesie produkcji

**Opis:** Niektóre etapy mogą nie być potrzebne dla konkretnego nastawu, więc użytkownik chce je pominąć.

**Kryteria akceptacji:**
- Użytkownik może oznaczyć etap jako "pominięty"
- System wyświetla ostrzeżenie przed pominięciem etapu (np. "Czy na pewno chcesz pominąć ten etap?")
- Po potwierdzeniu etap jest oznaczony jako pominięty
- Pominięte etapy są wizualnie oznaczone w liście etapów
- Użytkownik może wrócić do pominiętego etapu później, jeśli zajdzie taka potrzeba

### US-009: Powrót do poprzedniego etapu
**Tytuł:** Jako użytkownik chcę wrócić do poprzedniego etapu z notatką wyjaśniającą powód, aby poprawić błąd lub dokończyć pracę

**Opis:** Użytkownik zorientował się, że coś poszło nie tak na poprzednim etapie lub chce dokończyć pracę i potrzebuje wrócić do wcześniejszego etapu.

**Kryteria akceptacji:**
- Użytkownik może wrócić do poprzedniego etapu z listy etapów
- System wymaga dodania notatki wyjaśniającej powód powrotu
- System wyświetla ostrzeżenie przed cofnięciem się (np. "Cofnięcie do poprzedniego etapu spowoduje utratę postępu")
- Po potwierdzeniu i dodaniu notatki, etap jest zmieniany na poprzedni
- Notatka z powodem jest zapisywana w historii nastawu

### US-010: Dodanie notatki do nastawu
**Tytuł:** Jako użytkownik chcę dodać notatkę do aktualnego etapu, aby zapisać moje działania i obserwacje

**Opis:** Użytkownik wykonał jakieś działanie na etapie i chce to udokumentować w notatce.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Dodaj notatkę" na etapie nastawu
- Formularz notatki zawiera pola: data (domyślnie dzisiejsza), działanie, obserwacje
- Użytkownik może edytować datę ręcznie
- Maksymalna długość notatki to 5000 znaków z licznikiem znaków
- Po zapisaniu notatka jest widoczna w sekcji notatek dla nastawu
- Notatka jest przypisana do konkretnego etapu
- Timestamp ostatniej edycji jest zapisywany

### US-011: Przeglądanie notatek nastawu
**Tytuł:** Jako użytkownik chcę zobaczyć wszystkie moje notatki dla nastawu, aby prześledzić historię produkcji

**Opis:** Użytkownik chce zobaczyć wszystkie notatki, które dodał do konkretnego nastawu, aby przypomnieć sobie historię działań i obserwacji.

**Kryteria akceptacji:**
- Sekcja notatek wyświetla wszystkie notatki dla nastawu
- Notatki są sortowane chronologicznie (najstarsze pierwsze lub najnowsze pierwsze)
- Każda notatka wyświetla: datę, działanie, obserwacje, etap, do którego jest przypisana
- Użytkownik może filtrować notatki po etapach
- Notatki są wyświetlane w czytelny sposób z odpowiednim formatowaniem dat

### US-012: Edycja notatki
**Tytuł:** Jako użytkownik chcę edytować moją notatkę, aby poprawić błąd lub dodać dodatkowe informacje

**Opis:** Użytkownik dodał notatkę i chce ją później edytować, aby poprawić błąd lub uzupełnić informacje.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Edytuj" przy swojej notatce
- Formularz edycji jest wstępnie wypełniony istniejącymi danymi
- Użytkownik może zmienić wszystkie pola notatki (data, działanie, obserwacje)
- Po zapisaniu zmiany są natychmiast widoczne
- Timestamp ostatniej edycji jest aktualizowany
- Tylko właściciel notatki może ją edytować

### US-013: Usunięcie notatki
**Tytuł:** Jako użytkownik chcę usunąć moją notatkę, jeśli została dodana przez pomyłkę lub nie jest już potrzebna

**Opis:** Użytkownik dodał notatkę przez pomyłkę lub chce ją usunąć z innego powodu.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Usuń" przy swojej notatce
- System wyświetla potwierdzenie przed usunięciem (np. "Czy na pewno chcesz usunąć tę notatkę?")
- Po potwierdzeniu notatka jest trwale usuwana
- Tylko właściciel notatki może ją usunąć
- Po usunięciu notatka znika z listy

### US-014: Restart fermentacji
**Tytuł:** Jako użytkownik chcę zrestartować fermentację, jeśli zatrzymała się przedwcześnie, aby dokończyć proces

**Opis:** Fermentacja użytkownika zatrzymała się przedwcześnie i chce ją zrestartować bez cofania etapu.

**Kryteria akceptacji:**
- Użytkownik może kliknąć opcję "Restart fermentacji" na etapie fermentacji (burzliwej lub cichej)
- System dodaje automatyczną notatkę o restarcie z aktualną datą
- Etap nie jest cofany, pozostaje na obecnym etapie
- Historia restartów jest widoczna w notatkach nastawu
- Użytkownik może zrestartować fermentację wielokrotnie, jeśli zajdzie taka potrzeba

### US-015: Zakończenie nastawu
**Tytuł:** Jako użytkownik chcę zakończyć nastaw w dowolnym momencie, aby przenieść go do archiwum

**Opis:** Użytkownik zakończył produkcję lub chce zakończyć nastaw z innego powodu i przenieść go do archiwum.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Zakończ nastaw" w widoku szczegółowym nastawu
- System wyświetla potwierdzenie przed zakończeniem (np. "Czy na pewno chcesz zakończyć ten nastaw?")
- Użytkownik może opcjonalnie dodać powód zakończenia w notatce
- Po potwierdzeniu nastaw jest oznaczony jako zakończony i przeniesiony do archiwum
- Data zakończenia jest automatycznie zapisywana
- Zakończony nastaw znika z listy aktywnych nastawów na dashboardzie

### US-016: Ocena zakończonego nastawu
**Tytuł:** Jako użytkownik chcę ocenić mój zakończony nastaw w skali 1-5 gwiazdek, aby zapamiętać jakość produktu

**Opis:** Użytkownik zakończył nastaw i spróbował gotowego produktu, więc chce go ocenić.

**Kryteria akceptacji:**
- Użytkownik może dodać ocenę 1-5 gwiazdek dla zakończonego nastawu w archiwum
- Ocena jest opcjonalna - użytkownik nie musi ocenić nastawu
- Użytkownik może zmienić ocenę w dowolnym momencie po zakończeniu
- Ocena jest wyświetlana w archiwum obok nastawu
- System zapisuje datę dodania/zmiany oceny

### US-017: Przeglądanie archiwum
**Tytuł:** Jako użytkownik chcę przeglądać moje zakończone nastawy w archiwum, aby przypomnieć sobie wcześniejsze doświadczenia

**Opis:** Użytkownik chce zobaczyć wszystkie swoje zakończone nastawy wraz z ocenami i notatkami.

**Kryteria akceptacji:**
- Sekcja Archiwum na dashboardzie wyświetla wszystkie zakończone nastawy
- Dla każdego nastawu wyświetlane są: nazwa, typ, szablon, data rozpoczęcia, data zakończenia, ocena (jeśli dodana)
- Użytkownik może kliknąć na nastaw w archiwum, aby zobaczyć szczegóły i notatki
- Archiwum jest bezterminowo przechowywane
- Użytkownik może filtrować archiwum po typie (wino/miód pitny)
- Użytkownik może sortować archiwum po dacie zakończenia

### US-018: Usunięcie nastawu z archiwum
**Tytuł:** Jako użytkownik chcę usunąć nastaw z archiwum, jeśli nie chcę go już przechowywać

**Opis:** Użytkownik chce usunąć zakończony nastaw z archiwum, aby oczyścić swoje konto.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Usuń" przy nastawie w archiwum
- System wyświetla potwierdzenie przed usunięciem z ostrzeżeniem (np. "Czy na pewno chcesz usunąć ten nastaw? Ta operacja jest nieodwracalna.")
- Po potwierdzeniu nastaw jest trwale usuwany wraz z wszystkimi notatkami
- Usunięty nastaw znika z archiwum

### US-019: Filtrowanie nastawów
**Tytuł:** Jako użytkownik chcę filtrować moje nastawy po statusie i typie, aby szybko znaleźć konkretny nastaw

**Opis:** Użytkownik ma wiele nastawów i chce je filtrować, aby łatwiej znaleźć to, czego szuka.

**Kryteria akceptacji:**
- Użytkownik może filtrować nastawy po statusie (aktywne/zakończone)
- Użytkownik może filtrować nastawy po typie (wino/miód pitny)
- Filtry mogą być stosowane jednocześnie
- Lista nastawów jest automatycznie odświeżana po zastosowaniu filtrów
- Użytkownik może wyczyścić filtry, aby zobaczyć wszystkie nastawy

### US-020: Sortowanie nastawów
**Tytuł:** Jako użytkownik chcę sortować moje nastawy po dacie, aby zobaczyć najnowsze lub najstarsze

**Opis:** Użytkownik chce uporządkować swoje nastawy według daty rozpoczęcia lub ostatniej aktywności.

**Kryteria akceptacji:**
- Użytkownik może sortować nastawy po dacie rozpoczęcia (rosnąco/malejąco)
- Użytkownik może sortować nastawy po dacie ostatniej aktywności (rosnąco/malejąco)
- Domyślne sortowanie to data ostatniej aktywności (malejąco - najnowsze pierwsze)
- Lista nastawów jest automatycznie odświeżana po zmianie sortowania
- Sortowanie działa dla zarówno aktywnych nastawów, jak i archiwum

### US-021: Edycja nazwy nastawu
**Tytuł:** Jako użytkownik chcę zmienić nazwę mojego nastawu, aby lepiej go rozpoznać

**Opis:** Użytkownik chce zmienić nazwę nastawu na bardziej opisową lub poprawić błąd w nazwie.

**Kryteria akceptacji:**
- Użytkownik może edytować nazwę nastawu w widoku szczegółowym (tylko dla aktywnych nastawów)
- System waliduje długość nazwy (max 100 znaków, nie może być pusta)
- Po zapisaniu zmieniona nazwa jest natychmiast widoczna na dashboardzie i w widoku szczegółowym
- Tylko właściciel nastawu może edytować jego nazwę

### US-022: Usunięcie aktywnego nastawu
**Tytuł:** Jako użytkownik chcę usunąć aktywny nastaw, jeśli utworzyłem go przez pomyłkę lub nie chcę go kontynuować

**Opis:** Użytkownik utworzył nastaw przez pomyłkę lub zdecydował, że nie chce go kontynuować i chce go usunąć.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Usuń nastaw" w widoku szczegółowym aktywnego nastawu
- System wyświetla potwierdzenie przed usunięciem z ostrzeżeniem (np. "Czy na pewno chcesz usunąć ten nastaw? Ta operacja jest nieodwracalna i usunie wszystkie notatki.")
- Po potwierdzeniu aktywny nastaw jest trwale usuwany wraz z wszystkimi notatkami
- Usunięty nastaw znika z listy aktywnych nastawów na dashboardzie
- Tylko właściciel nastawu może go usunąć

### US-023: Przełączanie się między nastawami
**Tytuł:** Jako użytkownik chcę łatwo przełączać się między moimi aktywnymi nastawami, aby śledzić postęp we wszystkich

**Opis:** Użytkownik prowadzi kilka nastawów jednocześnie i potrzebuje szybkiego sposobu na przełączanie się między nimi.

**Kryteria akceptacji:**
- Użytkownik może kliknąć na dowolny nastaw na dashboardzie, aby przejść do jego widoku szczegółowego
- Każdy nastaw ma niezależny timeline i notatki
- Użytkownik może łatwo wrócić do dashboardu z widoku szczegółowego nastawu
- Stan każdego nastawu (aktualny etap, ostatnia notatka) jest zachowany niezależnie

### US-024: Wyświetlanie proaktywnych podpowiedzi
**Tytuł:** Jako początkujący użytkownik chcę otrzymywać podpowiedzi i ostrzeżenia na każdym etapie, aby uniknąć typowych błędów

**Opis:** Użytkownik jest początkujący i potrzebuje wskazówek, aby uniknąć typowych błędów podczas produkcji.

**Kryteria akceptacji:**
- Każdy etap wyświetla sekcję z proaktywnymi podpowiedziami i ostrzeżeniami
- Podpowiedzi są wyświetlane w widoczny sposób (np. w osobnej sekcji lub jako alerty)
- Podpowiedzi zawierają informacje o typowych błędach dla danego etapu
- Ostrzeżenia są wyświetlane przed potencjalnie problematycznymi działaniami (np. przed pominięciem etapu)
- Podpowiedzi są napisane prostym, zrozumiałym językiem dla początkujących

### US-025: Obsługa wyboru tłoczenia vs maceracji
**Tytuł:** Jako użytkownik chcę wybrać między tłoczeniem a maceracją na etapie przygotowania nastawu, aby dopasować proces do mojego rodzaju wina

**Opis:** Użytkownik tworzy nastaw wina i na etapie przygotowania musi wybrać między tłoczeniem a maceracją.

**Kryteria akceptacji:**
- Na etapie przygotowania nastawu (dla win czerwonych, różowych, owocowych) użytkownik widzi opcję wyboru tłoczenia vs maceracji
- System wyświetla krótkie wyjaśnienie różnic między tłoczeniem a maceracją dla początkujących
- Wybór jest opcjonalny - użytkownik może kontynuować bez wyboru
- Wybór jest zapisywany i wyświetlany w notatkach nastawu
- Instrukcje etapu są dostosowywane do wyboru użytkownika (jeśli został dokonany)

### US-026: Wylogowanie użytkownika
**Tytuł:** Jako użytkownik chcę się wylogować, aby zabezpieczyć moje konto na współdzielonym urządzeniu

**Opis:** Użytkownik korzysta z aplikacji na współdzielonym urządzeniu i chce się wylogować po zakończeniu pracy.

**Kryteria akceptacji:**
- Użytkownik może kliknąć przycisk "Wyloguj" w menu użytkownika
- Po wylogowaniu użytkownik jest przekierowywany do strony logowania
- Sesja użytkownika jest zakończona i wymagane jest ponowne logowanie
- Po wylogowaniu nie można uzyskać dostępu do danych użytkownika bez ponownego zalogowania

### US-027: Automatyczne wylogowanie po wygaśnięciu sesji
**Tytuł:** Jako użytkownik chcę być automatycznie wylogowany po okresie nieaktywności, aby zabezpieczyć moje konto

**Opis:** System powinien automatycznie wylogować użytkownika po wygaśnięciu sesji z powodu nieaktywności lub wygaśnięcia tokenu.

**Kryteria akceptacji:**
- Użytkownik jest automatycznie wylogowany po 30 dniach nieaktywności
- Użytkownik jest automatycznie wylogowany po wygaśnięciu tokenu sesji
- System wyświetla komunikat o konieczności ponownego zalogowania przy próbie dostępu po wygaśnięciu sesji
- Po automatycznym wylogowaniu użytkownik jest przekierowywany do strony logowania
- Niezapisane dane są ostrzeżone (jeśli dotyczy)

### US-028: Zmiana hasła
**Tytuł:** Jako użytkownik chcę zmienić moje hasło, aby zwiększyć bezpieczeństwo mojego konta

**Opis:** Użytkownik chce zmienić hasło do swojego konta z powodów bezpieczeństwa.

**Kryteria akceptacji:**
- Użytkownik może zmienić hasło w ustawieniach konta
- System wymaga podania obecnego hasła przed zmianą
- Nowe hasło musi spełniać wymagania (min. 8 znaków, 1 wielka litera, 1 mała litera, 1 cyfra)
- System potwierdza zmianę hasła
- Po zmianie hasła użytkownik musi zalogować się ponownie nowym hasłem

### US-029: Zmiana adresu e-mail
**Tytuł:** Jako użytkownik chcę zmienić mój adres e-mail, aby zaktualizować moje dane kontaktowe

**Opis:** Użytkownik chce zmienić adres e-mail przypisany do konta.

**Kryteria akceptacji:**
- Użytkownik może zmienić adres e-mail w ustawieniach konta
- System waliduje format nowego adresu e-mail
- System sprawdza, czy nowy adres e-mail nie jest już używany
- Po zmianie e-mail użytkownik otrzymuje e-mail weryfikacyjny na nowy adres
- Użytkownik musi zweryfikować nowy adres e-mail (soft verification - może korzystać przed weryfikacją)

### US-030: Usunięcie konta
**Tytuł:** Jako użytkownik chcę usunąć moje konto wraz z wszystkimi danymi, aby wycofać zgodę na przetwarzanie danych (RODO)

**Opis:** Użytkownik chce całkowicie usunąć swoje konto i wszystkie dane zgodnie z RODO.

**Kryteria akceptacji:**
- Użytkownik może usunąć konto w ustawieniach konta
- System wyświetla ostrzeżenie przed usunięciem (np. "Czy na pewno chcesz usunąć konto? Ta operacja jest nieodwracalna i usunie wszystkie Twoje nastawy i notatki.")
- System wymaga potwierdzenia hasła przed usunięciem konta
- Po usunięciu wszystkie dane użytkownika są trwale usuwane (nastawy, notatki, profil)
- Użytkownik otrzymuje potwierdzenie usunięcia konta
- Po usunięciu użytkownik nie może zalogować się używając tego konta

### US-031: Obsługa błędów walidacji
**Tytuł:** Jako użytkownik chcę otrzymywać przyjazne komunikaty błędów, gdy wprowadzam nieprawidłowe dane

**Opis:** Użytkownik wprowadza dane w formularzu i chce wiedzieć, co jest nieprawidłowe, jeśli wystąpi błąd.

**Kryteria akceptacji:**
- System wyświetla przyjazne komunikaty błędów dla każdego pola formularza
- Komunikaty błędów są wyświetlane natychmiast po próbie wysłania formularza z błędami
- Komunikaty błędów są zrozumiałe i wskazują, co należy poprawić (np. "Hasło musi zawierać co najmniej 8 znaków", "Podany adres e-mail jest już zarejestrowany")
- Komunikaty błędów są wyświetlane w czytelny sposób (np. pod polem formularza)
- Walidacja działa zarówno po stronie klienta, jak i serwera

### US-032: Responsywność na urządzeniach mobilnych
**Tytuł:** Jako użytkownik mobilny chcę korzystać z aplikacji na moim telefonie lub tablecie, aby śledzić nastawy w dowolnym miejscu

**Opis:** Użytkownik chce korzystać z aplikacji na urządzeniu mobilnym lub tablecie zamiast komputera.

**Kryteria akceptacji:**
- Aplikacja jest w pełni funkcjonalna na urządzeniach mobilnych (min. 320px szerokości)
- Layout jest dostosowany do mniejszych ekranów (mobile-first)
- Wszystkie przyciski i pola formularza są touch-friendly (min. 44x44px)
- Tekst jest czytelny bez konieczności powiększania
- Nawigacja jest zoptymalizowana dla urządzeń mobilnych
- Dashboard, lista nastawów i formularze działają poprawnie na mobile

### US-033: Responsywność na tabletach
**Tytuł:** Jako użytkownik tabletu chcę korzystać z aplikacji na moim tablecie, aby mieć wygodny widok moich nastawów

**Opis:** Użytkownik chce korzystać z aplikacji na tablecie, który oferuje większy ekran niż telefon, ale mniejszy niż komputer.

**Kryteria akceptacji:**
- Aplikacja jest w pełni funkcjonalna na tabletach
- Layout jest zoptymalizowany dla średnich ekranów (tablety)
- Interfejs wykorzystuje dostępną przestrzeń ekranu efektywnie
- Wszystkie funkcjonalności są dostępne i łatwe w użyciu na tablecie

### US-034: Responsywność na desktopie
**Tytuł:** Jako użytkownik desktopowy chcę korzystać z aplikacji na moim komputerze, aby mieć pełny widok wszystkich funkcjonalności

**Opis:** Użytkownik korzysta z aplikacji na komputerze stacjonarnym lub laptopie z większym ekranem.

**Kryteria akceptacji:**
- Aplikacja jest w pełni funkcjonalna na ekranach desktopowych (do 4K)
- Layout jest zoptymalizowany dla większych ekranów
- Interfejs wykorzystuje dostępną przestrzeń ekranu efektywnie
- Wszystkie funkcjonalności są dostępne i łatwe w użyciu na desktopie

### US-035: Wydajność ładowania strony
**Tytuł:** Jako użytkownik chcę, aby strona ładowała się szybko, aby nie tracić czasu na oczekiwanie

**Opis:** Użytkownik chce, aby aplikacja ładowała się szybko, szczególnie na wolniejszych połączeniach.

**Kryteria akceptacji:**
- Strona główna ładuje się poniżej 3 sekund na połączeniu 4G
- Dashboard ładuje się poniżej 3 sekund na połączeniu 4G
- Widok szczegółowy nastawu ładuje się poniżej 3 sekund na połączeniu 4G
- Stosowane są techniki optymalizacji (lazy loading, caching, minifikacja)
- Metryki wydajności są monitorowane

### US-036: Reakcja interfejsu na akcje użytkownika
**Tytuł:** Jako użytkownik chcę, aby interfejs reagował natychmiast na moje akcje, aby aplikacja była responsywna

**Opis:** Użytkownik chce, aby aplikacja natychmiast reagowała na jego kliknięcia i działania.

**Kryteria akceptacji:**
- Reakcja interfejsu na akcje użytkownika jest poniżej 200ms
- Przyciski i linki reagują natychmiast po kliknięciu (z wizualnym feedbackiem)
- Formularze wyświetlają walidację natychmiast po wprowadzeniu danych
- Loading states są wyświetlane podczas operacji asynchronicznych
- Skeleton screens są używane podczas ładowania danych

### US-037: Lazy loading dla archiwum
**Tytuł:** Jako użytkownik chcę, aby archiwum ładowało się stopniowo, aby nie czekać na wszystkie nastawy jednocześnie

**Opis:** Użytkownik ma wiele zakończonych nastawów i chce, aby archiwum ładowało się szybko, nawet z dużą liczbą elementów.

**Kryteria akceptacji:**
- Archiwum ładuje się początkowo z ograniczoną liczbą nastawów (np. 20 pierwszych)
- Dodatkowe nastawy są ładowane automatycznie podczas przewijania w dół (infinite scroll) lub po kliknięciu "Załaduj więcej"
- Loading indicator jest wyświetlany podczas ładowania kolejnych nastawów
- Wydajność pozostaje dobra nawet przy dużej liczbie nastawów w archiwum

### US-038: Obsługa przechodzenia między etapami w dowolnej kolejności
**Tytuł:** Jako doświadczony użytkownik chcę przechodzić między etapami w dowolnej kolejności, aby dostosować proces do moich potrzeb

**Opis:** Doświadczony użytkownik może chcieć przejść do późniejszego etapu bez ukończenia wszystkich poprzednich lub wrócić do wcześniejszego.

**Kryteria akceptacji:**
- Użytkownik może kliknąć na dowolny etap w liście etapów, aby przejść do niego
- System wyświetla ostrzeżenie, jeśli użytkownik próbuje pominąć etapy (np. "Przejście do tego etapu spowoduje pominięcie poprzednich etapów. Czy na pewno chcesz kontynuować?")
- Po potwierdzeniu użytkownik może przejść do wybranego etapu
- Walidacja po stronie serwera zapobiega nieprawidłowym stanom
- Historia zmian etapów jest zapisywana w notatkach

## 6. Metryki sukcesu

### 6.1 Kryterium 1: Szybkość utworzenia nastawu
**Metryka:** Czas od kliknięcia "Nowy nastaw" do utworzenia nastawu  
**Cel:** Maksymalnie 2 kliknięcia, czas < 10 sekund  
**Sposób pomiaru:** Tracking czasu wykonania akcji przez użytkowników  
**Próg sukcesu:** 90% użytkowników tworzy nastaw w < 10 sekund i maksymalnie 2 kliknięciach

### 6.2 Kryterium 2: Prostość przedstawienia etapów
**Metryka:** Zrozumiałość opisów etapów dla początkujących użytkowników  
**Cel:** Użytkownik rozumie każdy etap bez dodatkowych wyjaśnień  
**Sposób pomiaru:** User testing z początkującymi użytkownikami, feedback surveys, pytania o zrozumiałość  
**Próg sukcesu:** 80% początkujących użytkowników rozumie instrukcje bez potrzeby konsultacji z dodatkowymi źródłami

### 6.3 Kryterium 3: Wydajność aplikacji
**Metryka:** Czas ładowania strony, czas reakcji interfejsu  
**Cel:** < 3 sekundy ładowanie na 4G, < 200ms reakcja interfejsu  
**Sposób pomiaru:** Performance monitoring, Core Web Vitals (LCP, FID, CLS), narzędzia analityczne  
**Próg sukcesu:** 95% sesji użytkowników spełnia wymagania wydajnościowe

### 6.4 Kryterium 4: Responsywność
**Metryka:** Funkcjonalność na różnych urządzeniach i rozdzielczościach  
**Cel:** Pełna funkcjonalność na urządzeniach 320px-4K, priorytet mobile/tablet  
**Sposób pomiaru:** Testing na różnych urządzeniach i rozdzielczościach, użyteczność na mobile vs desktop  
**Próg sukcesu:** 100% funkcjonalności dostępne na wszystkich docelowych urządzeniach, 0 krytycznych błędów na mobile/tablet

### 6.5 Kryterium 5: Satysfakcja użytkownika
**Metryka:** Średnia ocena nastawów, czas spędzony w aplikacji, retention rate  
**Cel:** Wysoka retencja, pozytywne feedbacki, aktywni użytkownicy  
**Sposób pomiaru:** 
- Anonimowe metryki zgodne z RODO (z możliwością wyłączenia przez użytkownika):
  - Liczba aktywnych nastawów na użytkownika (cel: > 1.5 na użytkownika)
  - Średni czas ukończenia nastawu (cel: zgodny z szacowanymi czasami dla szablonów)
  - Najczęściej wybierane szablony
  - Punkty drop-off (gdzie użytkownicy przestają używać aplikacji)
  - Czas spędzony w aplikacji na sesję
  - Retention rate (cel: > 40% użytkowników wraca po 7 dniach)
- Feedback surveys
- Średnia ocena nastawów (cel: > 3.5/5 gwiazdek)

**Próg sukcesu:** Retention rate > 40% po 7 dniach, średnia ocena nastawów > 3.5/5, pozytywne feedbacki w > 70% odpowiedzi

### 6.6 Kryterium 6: Skalowalność
**Metryka:** Wydajność przy rosnącej liczbie użytkowników  
**Cel:** Obsługa do 1000 użytkowników z prostymi rozwiązaniami infrastrukturalnymi  
**Sposób pomiaru:** Load testing, monitoring wydajności, czas odpowiedzi serwera  
**Próg sukcesu:** Aplikacja obsługuje 1000 jednoczesnych użytkowników bez degradacji wydajności (< 3s ładowanie, < 200ms reakcja)

### 6.7 Kryterium 7: Jakość kodu i stabilność
**Metryka:** Liczba błędów, crash rate, uptime  
**Cel:** Minimalna liczba błędów, wysoka stabilność  
**Sposób pomiaru:** Error tracking, crash reports, monitoring uptime  
**Próg sukcesu:** Uptime > 99.5%, < 1% sesji z błędami krytycznymi

### 6.8 Kryterium 8: Bezpieczeństwo danych
**Metryka:** Bezpieczeństwo danych użytkowników, zgodność z RODO  
**Cel:** Bezpieczne przechowywanie danych, zgodność z RODO  
**Sposób pomiaru:** Security audits, przegląd zgodności z RODO  
**Próg sukcesu:** 0 naruszeń bezpieczeństwa, pełna zgodność z wymaganiami RODO

### 6.9 Kryterium 9: Przyjęcie funkcjonalności przez użytkowników
**Metryka:** Wykorzystanie kluczowych funkcjonalności  
**Cel:** Użytkownicy aktywnie korzystają z wszystkich kluczowych funkcjonalności  
**Sposób pomiaru:** 
- Procent użytkowników tworzących nastawy (cel: > 80% zarejestrowanych)
- Procent użytkowników dodających notatki (cel: > 60% użytkowników z aktywnymi nastawami)
- Procent użytkowników kończących nastawy i dodających oceny (cel: > 30% aktywnych nastawów)
- Procent użytkowników korzystających z archiwum (cel: > 50% użytkowników z zakończonymi nastawami)

**Próg sukcesu:** Wszystkie kluczowe funkcjonalności są wykorzystywane przez znaczną część użytkowników zgodnie z celami powyżej

### 6.10 Kryterium 10: Elastyczność i przygotowanie na przyszłość
**Metryka:** Łatwość dodania nowych funkcjonalności  
**Cel:** Architektura umożliwia dodanie zaplanowanych funkcjonalności (notyfikacje, pomiary, inne kategorie)  
**Sposób pomiaru:** Code review, assessment architektury  
**Próg sukcesu:** Architektura jest przygotowana na dodanie zaplanowanych funkcjonalności bez konieczności większych refactoringów
