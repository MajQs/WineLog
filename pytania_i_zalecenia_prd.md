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

## Ostatnie pytania i zalecenia przed PRD - Odpowiedzi

1. **Jakie błędy i sytuacje brzegowe aplikacja powinna obsługiwać?**
   - ✅ Zgodnie z rekomendacją - przechodzenie między etapami w dowolnej kolejności z ostrzeżeniami, walidacja po stronie serwera, przyjazne komunikaty błędów

2. **Czy aplikacja powinna mieć funkcję eksportu danych?**
   - ✅ Zaplanuj tylko to co jest wymagane przez RODO - eksport danych w formacie JSON

3. **Jak aplikacja powinna obsługiwać przypadki utraty sesji?**
   - ✅ Aplikacja powinna automatycznie wylogowywać użytkownika po wygaśnięciu sesji (np. po 30 dniach nieaktywności lub po wygaśnięciu tokenu). Użytkownik powinien otrzymać komunikat o konieczności ponownego zalogowania.

4. **Czy aplikacja powinna mieć system wersjonowania notatek?**
   - ✅ W MVP nie jest konieczne pełne wersjonowanie

5. **Jakie metryki i analitykę aplikacja powinna zbierać?**
   - ✅ Zgodnie z rekomendacją - anonimowe metryki zgodnie z RODO, możliwość wyłączenia przez użytkownika

6. **Jak aplikacja powinna wyglądać na różnych rozdzielczościach ekranów?**
   - ✅ Zgodnie z rekomendacją - w pełni responsywna (320px-4K), mobile-first, priorytet dla urządzeń mobilnych i tabletów

7. **Czy aplikacja powinna mieć funkcję wyszukiwania/filtrowania?**
   - ✅ W MVP wprowadź podstawową funkcjonalność filtrowania nastawów po statusie (aktywne/zakończone) i typie (wino/miód pitny) oraz sortowaniu po dacie.

8. **Jakie są wymagania dotyczące wydajności?**
   - ✅ Zgodnie z rekomendacją - ładowanie poniżej 3 sekund na 4G, reakcja interfejsu poniżej 200ms, lazy loading dla archiwum, loading states

9. **Czy aplikacja powinna mieć tryb offline/read-only?**
   - ✅ W MVP nie jest to konieczne

10. **Jakie są priorytety implementacji funkcjonalności?**
    - ✅ Wszystko ma być gotowe na MVP - wszystkie funkcje jednocześnie
