# Pytania i Zalecenia dla PRD - Aplikacja do Produkcji Wina

## Lista pytań i zaleceń

1. **Czy aplikacja ma obsługiwać jednocześnie wiele aktywnych nastawów przez jednego użytkownika?**

   Rekomendacja: Zaplanuj architekturę, która umożliwi użytkownikowi prowadzenie kilku nastawów jednocześnie (np. wino białe, wino czerwone, miód pitny) z możliwością łatwego przełączania się między nimi. Każdy nastaw powinien mieć własny niezależny timeline i notatki.

2. **Jakie konkretne etapy produkcji wina/miodu pitnego aplikacja powinna obejmować i czy etapy różnią się między winem a miodem pitnym?**

   Rekomendacja: Zdefiniuj szczegółową listę etapów (np. przygotowanie, fermentacja, zlewanie, klarowanie, dojrzewanie, butelkowanie) z jasnymi opisami dla początkujących. Określ, czy wino i miód pitny mają wspólne czy oddzielne przepływy etapów, i czy niektóre etapy są opcjonalne.

3. **Jak powinien wyglądać mechanizm przypomnień/notyfikacji dla użytkownika o konieczności wykonania kolejnych kroków w procesie produkcji?**

   Rekomendacja: Rozważ implementację systemu przypomnień (powiadomienia e-mail lub w aplikacji) z możliwością ustawienia dat następnych działań. To krytyczne dla użytkowników początkujących, którzy mogą zapomnieć o kolejnych krokach.

4. **Jaki poziom szczegółowości notatek jest oczekiwany - czy użytkownik może dodawać zdjęcia, pomiary (temperatura, gęstość), czy tylko tekstowe notatki?**

   Rekomendacja: W MVP skup się na notatkach tekstowych, ale zaplanuj architekturę, która pozwoli w przyszłości dodać obrazy i podstawowe pomiary. Określ minimalny wymagany zestaw pól notatek (data, działanie, obserwacje).

5. **Czy system kont wymaga pełnej rejestracji z weryfikacją e-mail, czy może być uproszczony (np. tylko login/hasło lub logowanie przez Google)?**

   Rekomendacja: Dla MVP rozważ uproszczoną rejestrację (e-mail + hasło) bez konieczności weryfikacji e-mail, aby zmniejszyć barierę wejścia. Logowanie przez zewnętrzne serwisy (OAuth) można dodać w kolejnej iteracji.

6. **Jak długo powinny być przechowywane zakończone nastawy w archiwum i czy użytkownik powinien mieć możliwość ich trwałego usunięcia?**

   Rekomendacja: Zaplanuj bezterminowe przechowywanie zakończonych nastawów w archiwum z możliwością ręcznego usunięcia przez użytkownika. Rozważ również automatyczne usuwanie po długim czasie nieaktywności (np. 2-3 lata) jako opcję konfiguracyjną.

7. **Czy ocena 5-gwiazdkowa powinna być rozszerzona o dodatkowe kategorie (smak, aromat, klarowność) czy wystarczy jedna ogólna ocena?**

   Rekomendacja: W MVP wprowadź prostą ocenę ogólną 1-5 gwiazdek, ale zaprojektuj interfejs, który pozwoli w przyszłości rozszerzyć to o szczegółowe kategorie. To utrzyma prostotę dla początkujących, zachowując możliwość rozwoju.

8. **Jakie są oczekiwania dotyczące wydajności aplikacji - ile użytkowników jednocześnie ma obsługiwać system w pierwszej fazie?**

   Rekomendacja: Określ szacunkową liczbę użytkowników w pierwszych 6 miesiącach, aby zaprojektować odpowiednią infrastrukturę. Dla małej skali (do 1000 użytkowników) możesz zacząć od prostych rozwiązań, z planem skalowania w przyszłości.

9. **Czy aplikacja powinna oferować gotowe szablony/przepisy dla różnych typów win i miodów pitnych, czy użytkownik ma tworzyć wszystko od zera?**

   Rekomendacja: Rozważ wprowadzenie kilku podstawowych szablonów (np. wino czerwone, wino białe, miód pitny klasyczny) z predefiniowanymi etapami i sugerowanymi działaniami. To znacznie ułatwi pierwszy start początkującym użytkownikom i wpłynie pozytywnie na "kilka kliknięć" do dodania nastawu.

10. **Jakie są wymagania dotyczące dostępności danych - czy aplikacja musi działać offline, czy wystarczy dostępność online z możliwością synchronizacji?**

    Rekomendacja: Dla MVP skup się na aplikacji online z możliwością szybkiej synchronizacji danych. Funkcjonalność offline można rozważyć w późniejszej fazie, ale już teraz zaplanuj strukturę danych, która to umożliwi (np. lokalne cache, kolejka synchronizacji).
