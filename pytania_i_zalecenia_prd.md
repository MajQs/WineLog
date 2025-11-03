# Pytania i Zalecenia dla PRD - Aplikacja do Produkcji Wina

## Odpowiedzi na wstępne pytania

1. **Czy aplikacja ma obsługiwać jednocześnie wiele aktywnych nastawów przez jednego użytkownika?**
   - ✅ Zgodnie z rekomendacją - wiele nastawów jednocześnie

2. **Jakie konkretne etapy produkcji wina/miodu pitnego aplikacja powinna obejmować?**
   - ✅ Etapy odpowiednie dla wina i miodu pitnego: przygotowanie nastawu, ewentualne tłoczenie lub maceracja, oddzielanie, fermentacja burzliwa, fermentacja cicha, dojrzewanie/maturacja, klarowanie, zlewanie z nad osadu, butelkowanie. Powinna być możliwość restartu fermentacji w dowolnej chwili.

3. **Jak powinien wyglądać mechanizm przypomnień/notyfikacji?**
   - ✅ Na etap MVP notyfikacje nie są potrzebne, ale architektura powinna być przygotowana na taką możliwość (np. notyfikacje e-mail).

4. **Jaki poziom szczegółowości notatek jest oczekiwany?**
   - ✅ MVP: notatki tekstowe z polami: data, działanie, obserwacje. Architektura przygotowana na dodanie podstawowych pomiarów w przyszłości.

5. **Czy system kont wymaga pełnej rejestracji z weryfikacją e-mail?**
   - ✅ Dla MVP: uproszczona rejestracja (e-mail + hasło) wraz z koniecznością weryfikacji e-mail. Logowanie przez zewnętrzne serwisy (OAuth) można dodać w kolejnej iteracji.

6. **Jak długo powinny być przechowywane zakończone nastawy w archiwum?**
   - ✅ Zgodnie z rekomendacją - bezterminowe przechowywanie z możliwością ręcznego usunięcia

7. **Czy ocena 5-gwiazdkowa powinna być rozszerzona o dodatkowe kategorie?**
   - ✅ Zgodnie z rekomendacją - prosta ocena ogólna 1-5 gwiazdek z możliwością rozszerzenia w przyszłości

8. **Jakie są oczekiwania dotyczące wydajności aplikacji?**
   - ✅ Mała skala (do 1000 użytkowników) z prostymi rozwiązaniami, z planem skalowania w przyszłości

9. **Czy aplikacja powinna oferować gotowe szablony/przepisy?**
   - ✅ Zgodnie z rekomendacją - szablony z predefiniowanymi etapami

10. **Jakie są wymagania dotyczące dostępności danych?**
    - ✅ Dla MVP: aplikacja online z możliwością szybkiej synchronizacji danych

---

## Kolejne pytania i zalecenia - Odpowiedzi

1. **Jak dokładnie powinien działać mechanizm restartu fermentacji?**
   - ✅ Zgodnie z rekomendacją - restart oznacza ponowne rozpoczęcie fermentacji z aktualną datą, historia restartów w notatkach, bez cofania etapu

2. **Kiedy użytkownik powinien wybierać między tłoczeniem a maceracją?**
   - ✅ Zgodnie z rekomendacją - wybór w etapie "przygotowanie nastawu", opcjonalny, z wyjaśnieniami dla początkujących

3. **Jak powinien wyglądać przepływ weryfikacji e-mail?**
   - ✅ Zgodnie z rekomendacją - model "soft verification", możliwość korzystania przed weryfikacją, link ważny 7 dni

4. **Jakie konkretne typy win i miodów pitnych powinny być dostępne jako szablony?**
   - ✅ Zgodnie z rekomendacją - 3-5 szablonów (wino czerwone, białe, różowe, miód pitny klasyczny), każdy z nazwą etapów, czasami trwania, opisami i składnikami

5. **Czy aplikacja powinna umożliwiać niestandardowe typy nastawów?**
   - ✅ Zgodnie z rekomendacją - tylko wino i miód pitny w MVP, elastyczna struktura danych na przyszłość

6. **Jakie dane powinny być widoczne na dashboardzie?**
   - ✅ Zgodnie z rekomendacją - lista aktywnych nastawów (nazwa, typ, data, etap, ostatnia notatka), sekcja Archiwum, przycisk "Nowy nastaw"

7. **Czy użytkownik powinien móc edytować etapy?**
   - ✅ Zgodnie z rekomendacją - możliwość pominięcia etapu lub powrotu do poprzedniego z notatką, bez dodawania nowych etapów w MVP

8. **Jakie informacje powinny być wymagane podczas tworzenia nastawu?**
   - ✅ Zgodnie z rekomendacją - minimalnie: nazwa (lub domyślna) + wybór szablonu, reszta w notatkach, możliwość 2 kliknięć

9. **Jak powinna działać funkcja zakończenia nastawu?**
   - ✅ Użytkownik może zakończyć nastaw w dowolnym momencie (z opcjonalnym powodem w notatce). Po zakończeniu nastaw przenosi się do archiwum, gdzie użytkownik może dodać ocenę 1-5 gwiazdek.

10. **Jakie są wymagania dotyczące bezpieczeństwa i RODO?**
    - ✅ Zgodnie z rekomendacją - eksport danych, usunięcie konta, szyfrowanie, polityka prywatności

---

## Ostatnie pytania i zalecenia przed PRD

1. **Jakie błędy i sytuacje brzegowe aplikacja powinna obsługiwać - co się dzieje, gdy użytkownik próbuje przejść do następnego etapu przed zakończeniem poprzedniego, czy mogą być konflikty w danych?**

   Rekomendacja: Aplikacja powinna pozwalać na przechodzenie między etapami w dowolnej kolejności, ale ostrzegać użytkownika, jeśli pomija etapy (np. "Czy na pewno chcesz pominąć X?"). Wszystkie dane powinny być walidowane po stronie serwera, a błędne operacje powinny być zgłaszane w sposób przyjazny dla użytkownika. Rozważ logowanie błędów dla celów debugowania.

2. **Czy aplikacja powinna mieć funkcję eksportu danych użytkownika (np. PDF z historią nastawu, CSV z danymi) i w jakim formacie?**

   Rekomendacja: W MVP wprowadź podstawowy eksport danych użytkownika w formacie JSON (wymagane przez RODO), ale zaplanuj możliwość eksportu konkretnego nastawu do PDF lub CSV w przyszłości. Użytkownik powinien móc pobrać wszystkie swoje dane w ustawieniach konta.

3. **Jak aplikacja powinna obsługiwać przypadki utraty sesji użytkownika lub wygaśnięcia tokenu autoryzacji?**

   Rekomendacja: Aplikacja powinna automatycznie wylogowywać użytkownika po wygaśnięciu sesji (np. po 30 dniach nieaktywności lub po wygaśnięciu tokenu). Użytkownik powinien otrzymać komunikat o konieczności ponownego zalogowania, a wszystkie niezapisane zmiany powinny być zapisane w lokalnym cache (jeśli to możliwe) lub ostrzeżenie o utracie danych.

4. **Czy aplikacja powinna mieć system wersjonowania lub historii zmian dla notatek - czy użytkownik może cofnąć edycję notatki?**

   Rekomendacja: W MVP nie jest konieczne pełne wersjonowanie, ale zaplanuj architekturę, która pozwoli na dodanie historii zmian w przyszłości. W MVP użytkownik może edytować notatki, ale bez możliwości cofnięcia zmian. Rozważ dodanie timestampu ostatniej edycji przy każdej notatce.

5. **Jakie metryki i analitykę aplikacja powinna zbierać dla celów rozwoju produktu (przy zachowaniu prywatności użytkowników)?**

   Rekomendacja: Zbieraj anonimowe metryki: liczba aktywnych nastawów na użytkownika, średni czas ukończenia nastawu, najczęściej wybierane szablony, punkty drop-off w procesie, czas spędzony w aplikacji. Wszystko zgodnie z RODO i z możliwością wyłączenia przez użytkownika. Nie zbieraj danych osobowych w metrykach.

6. **Jak aplikacja powinna wyglądać na różnych rozdzielczościach ekranów - czy jest to responsywna aplikacja webowa czy planowany jest konkretny zakres rozdzielczości?**

   Rekomendacja: Aplikacja powinna być w pełni responsywna i działać poprawnie na urządzeniach mobilnych, tabletach i desktopach (od 320px do 4K). Priorytetem są urządzenia mobilne i tablety, ponieważ użytkownicy mogą chcieć dodawać notatki w trakcie pracy nad nastawem. Zastosuj podejście mobile-first.

7. **Czy aplikacja powinna mieć funkcję wyszukiwania/filtrowania nastawów i notatek, czy w MVP wystarczy podstawowa lista?**

   Rekomendacja: W MVP wprowadź podstawową funkcjonalność filtrowania nastawów po statusie (aktywne/zakończone) i typie (wino/miód pitny). Zaplanuj możliwość rozszerzenia o wyszukiwanie po nazwie, dacie, ocenie w przyszłości. Dla małej liczby nastawów (do 20-30) lista może być wystarczająca bez zaawansowanego wyszukiwania.

8. **Jakie są wymagania dotyczące wydajności ładowania strony i responsywności interfejsu - jakie są akceptowalne czasy ładowania?**

   Rekomendacja: Strona powinna ładować się w czasie poniżej 3 sekund na typowym połączeniu 4G. Interfejs powinien reagować na akcje użytkownika w czasie poniżej 200ms (percepcja natychmiastowej reakcji). Rozważ lazy loading dla archiwum zakończonych nastawów. Implementuj loading states i skeleton screens dla lepszego UX.

9. **Czy aplikacja powinna mieć tryb offline/read-only, nawet jeśli pełna synchronizacja nie jest dostępna w MVP?**

   Rekomendacja: W MVP nie jest to konieczne, ale zaplanuj cache'owanie danych w localStorage przeglądarki, aby możliwe było przeglądanie ostatnio załadowanych nastawów bez połączenia (read-only). Pełna funkcjonalność offline (edytowanie bez internetu) może być dodana później.

10. **Jakie są priorytety implementacji funkcjonalności - czy wszystkie funkcje MVP mają być gotowe jednocześnie, czy można wprowadzić je fazami?**

    Rekomendacja: Rozważ fazowe wprowadzanie: Faza 1 - podstawowa rejestracja/logowanie i tworzenie nastawów z szablonami, Faza 2 - zarządzanie etapami i notatkami, Faza 3 - archiwum i oceny. To pozwoli na wcześniejsze testowanie z użytkownikami i iterację. Określ, które funkcje są krytyczne dla pierwszego uruchomienia, a które mogą być dodane w ciągu pierwszych tygodni po launchu.
