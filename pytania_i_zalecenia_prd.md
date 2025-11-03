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

## Kolejne pytania i zalecenia

1. **Jak dokładnie powinien działać mechanizm restartu fermentacji - czy użytkownik może restartować dowolną liczbę razy, czy jest limit? Czy restart cofa nastaw do konkretnego etapu, czy tylko oznacza ponowne rozpoczęcie fermentacji?**

   Rekomendacja: Zaplanuj restart fermentacji jako opcję, która pozwala użytkownikowi oznaczyć, że fermentacja została wznowiona (np. po dodaniu cukru). Zachowaj historię wszystkich restartów w notatkach, aby użytkownik mógł śledzić postępy. Nie cofaj etapu, tylko pozwól na oznaczenie ponownego rozpoczęcia fermentacji z aktualną datą.

2. **Kiedy użytkownik powinien wybierać między tłoczeniem a maceracją - czy wybór następuje podczas tworzenia nastawu, czy można zmienić wybór w trakcie procesu?**

   Rekomendacja: Wybór tłoczenia vs maceracji powinien być częścią etapu "przygotowanie nastawu" i może być opcjonalny (użytkownik może pominąć ten krok). Aplikacja powinna zawierać krótkie wyjaśnienia, kiedy stosować które podejście, aby pomóc początkującym użytkownikom.

3. **Jak powinien wyglądać przepływ weryfikacji e-mail - czy użytkownik może używać aplikacji przed weryfikacją, czy musi czekać na potwierdzenie e-mail?**

   Rekomendacja: Rozważ model "soft verification" - użytkownik może rozpocząć korzystanie z aplikacji natychmiast po rejestracji, ale otrzymuje przypomnienia o weryfikacji i niektóre funkcje (np. reset hasła, powiadomienia) wymagają zweryfikowanego e-maila. Link weryfikacyjny powinien być ważny przez określony czas (np. 7 dni).

4. **Jakie konkretne typy win i miodów pitnych powinny być dostępne jako szablony w MVP i jakie informacje powinien zawierać każdy szablon?**

   Rekomendacja: W MVP wprowadź 3-5 podstawowych szablonów: wino czerwone, wino białe, wino różowe, miód pitny klasyczny, ewentualnie wino owocowe. Każdy szablon powinien zawierać: nazwę etapów, sugerowane czasy trwania etapów (jeśli dotyczy), krótkie opisy co robić na każdym etapie, oraz typowe składniki (jako sugestia/podpowiedź).

5. **Czy aplikacja powinna umożliwiać użytkownikowi dodanie własnego niestandardowego typu nastawu (nie wino, nie miód pitny), czy w MVP ograniczamy się tylko do tych dwóch kategorii?**

   Rekomendacja: W MVP ogranicz się do win i miodów pitnych, ale zaplanuj elastyczną strukturę danych, która pozwoli w przyszłości dodać inne kategorie. Użytkownik może wybrać między "wino" a "miód pitny" podczas tworzenia nastawu.

6. **Jakie dane powinny być widoczne na dashboardzie głównym użytkownika i jak powinna wyglądać lista aktywnych nastawów?**

   Rekomendacja: Dashboard powinien pokazywać: listę aktywnych nastawów z nazwą, typem (wino/miód), datą rozpoczęcia, aktualnym etapem, oraz szybkim podglądem ostatniej notatki. Zakończone nastawy powinny być widoczne w oddzielnej sekcji "Archiwum". Zapewnij łatwy dostęp do dodania nowego nastawu (duży przycisk "Nowy nastaw").

7. **Czy użytkownik powinien móc edytować etapy w istniejącym nastawie (np. pominąć jakiś etap, dodać dodatkowy), czy etapy są sztywne i użytkownik tylko przechodzi przez nie sekwencyjnie?**

   Rekomendacja: Użytkownik powinien móc przechodzić przez etapy sekwencyjnie, ale również mieć możliwość oznaczenia etapu jako "pominięty" lub powrotu do poprzedniego etapu (z notatką wyjaśniającą powód). Nie pozwól na dodawanie całkowicie nowych etapów w MVP - to można dodać później.

8. **Jakie informacje powinny być wymagane podczas tworzenia nowego nastawu, aby spełnić kryterium "kilka kliknięć"?**

   Rekomendacja: Minimalne wymagane dane to: nazwa nastawu (lub domyślna generowana), wybór szablonu (wino czerwone/białe/różowe/miód pitny). Wszystkie pozostałe informacje (daty, składniki, szczegóły) mogą być dodawane później w notatkach. Rozważ możliwość szybkiego utworzenia z tylko 2 kliknięciami: "Nowy nastaw" -> wybór szablonu -> "Utwórz".

9. **Jak powinna działać funkcja zakończenia nastawu i przeniesienia do archiwum - czy użytkownik może oznaczyć nastaw jako zakończony w dowolnym momencie, czy musi przejść przez wszystkie etapy?**

   Rekomendacja: Użytkownik powinien móc zakończyć nastaw w dowolnym momencie (z opcjonalnym powodem w notatce). Po zakończeniu nastaw przenosi się do archiwum, gdzie użytkownik może dodać ocenę 1-5 gwiazdek. Rozważ również opcję "wstrzymany" dla nastawów, które są tymczasowo przerwane.

10. **Jakie są wymagania dotyczące bezpieczeństwa danych użytkownika i zgodności z RODO, szczególnie w kontekście przechowywania danych osobowych i danych o produkcji?**

    Rekomendacja: Zaplanuj implementację zgodną z RODO: możliwość eksportu danych użytkownika, możliwość usunięcia konta wraz z wszystkimi danymi, szyfrowanie danych wrażliwych, jasna polityka prywatności. Użytkownik powinien mieć dostęp do swoich danych i móc je usunąć w ustawieniach konta.
