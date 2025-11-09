-- Seed data for WineLog templates
-- Based on PRD section 7: Technical Details of Templates for MVP

-- ============================================================================
-- TEMPLATES
-- ============================================================================

INSERT INTO public.templates (id, name, type, version) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Wino czerwone', 'red_wine', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Wino białe', 'white_wine', 1),
  ('550e8400-e29b-41d4-a716-446655440003', 'Wino różowe', 'rose_wine', 1),
  ('550e8400-e29b-41d4-a716-446655440004', 'Wino owocowe', 'fruit_wine', 1),
  ('550e8400-e29b-41d4-a716-446655440005', 'Miód pitny trójniak', 'mead', 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- WINO CZERWONE - TEMPLATE STAGES
-- ============================================================================

INSERT INTO public.template_stages (template_id, position, name, description, instructions, materials, days_min, days_max) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    1,
    'preparation',
    'Przygotowanie nastawu',
    'Wybierz dojrzałe winogrona czerwone. Usuń zepsute owoce i łodygi. Opcjonalnie wybierz tłoczenie (szybsze, mniej tanin) lub macerację (bogatszy smak, więcej tanin, bogatszy kolor). Przy maceracji: zmiażdż winogrona, pozostaw na 3-7 dni w temperaturze 20-25°C z codziennym mieszaniem pod przykryciem. Przy tłoczeniu: od razu przetłocz i wyciśnij sok. WARUNKI: Temperatura 18-25°C, czyste, sterylne naczynia. OSTRZEŻENIA: Nie używaj zepsutych owoców. Upewnij się, że wszystko jest czyste i wysterylizowane.',
    ARRAY['Winogrona czerwone (ok. 15-20 kg na 10L wina)', 'Prasa lub tłuczek', 'Fermentator'],
    1,
    2
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    2,
    'press_or_maceration',
    'Ewentualne tłoczenie lub maceracja',
    'Jeśli wybrałeś macerację, codziennie mieszaj masę i zanurzaj kożuch (skórki) 2-3 razy dziennie. Kontroluj temperaturę (20-25°C) - jeśli rośnie, schładzaj. Po 3-7 dniach (lub gdy osiągniesz pożądany kolor) przetłocz i wyciśnij sok. Jeśli wybrałeś tłoczenie, wykonaj je od razu po zmiażdżeniu. WARUNKI: Temperatura 20-25°C, przykrycie (ale nie szczelne - potrzebny dostęp tlenu). OSTRZEŻENIA: Nie maceruj zbyt długo - powyżej 7 dni może powstać gorycz i nieprzyjemny smak. Kontroluj temperaturę - powyżej 28°C może zepsuć smak. Jeśli pojawi się pleśń, usuń ją natychmiast i skróć macerację.',
    ARRAY['Prasa lub tłuczek', 'Sitko', 'Fermentator', 'Termometr'],
    1,
    7
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    3,
    'primary_fermentation',
    'Fermentacja burzliwa',
    'Dodaj drożdże winne oraz pożywka z witaminą B1 zgodnie z instrukcją na opakowaniu. Opcjonalnie dodaj siarkę (konserwant) w dawce 30-50 mg/l (dla wina czerwonego często nie jest konieczna). Fermentacja powinna być widoczna po 12-24 godzinach (bąbelki, pianowanie, kożuch na powierzchni). Temperatura 18-22°C. Codziennie mieszaj i zanurzaj kożuch (skórki na powierzchni) - to uwalnia barwniki i aromaty. WARUNKI: Temperatura 18-22°C, ciemne miejsce, dostęp tlenu na początku (nie zamykaj hermetycznie). OSTRZEŻENIA: Nie zamykaj hermetycznie na początku - drożdże potrzebują tlenu. Codziennie mieszaj i zanurzaj kożuch. Kontroluj temperaturę - zbyt wysoka (>25°C) może zepsuć smak. Jeśli fermentacja nie zacznie się w ciągu 48 godzin, sprawdź temperaturę i ewentualnie dodaj więcej drożdży.',
    ARRAY['Drożdże winne', 'Pożywka z witaminą B1', 'Siarka/siarczyn sodu (opcjonalnie, 30-50 mg/l)', 'Cukier (jeśli potrzebny do korygowania soku)', 'Rurka fermentacyjna'],
    5,
    10
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    4,
    'secondary_fermentation',
    'Fermentacja cicha',
    'Po zakończeniu fermentacji burzliwej (kożuch opadł, mniej bąbelków) wykonaj pierwsze zlewanie z nad osadu. Przenieś wino do czystego naczynia, zostawiając osad na dnie. Następnie wino przechodzi w fazę cichą - zamknij szczelnie z rurką fermentacyjną. Temperatura 15-18°C. Fermentacja trwa, ale jest mniej widoczna. WARUNKI: Temperatura 15-18°C, ciemne, spokojne miejsce, szczelne zamknięcie. OSTRZEŻENIA: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę. Sprawdzaj regularnie, ale nie mieszaj. Jeśli fermentacja całkowicie ustała, można dodać siarkę (30-50 mg/l) dla stabilności.',
    ARRAY['Fermentator z zamknięciem', 'Rurka fermentacyjna', 'Syfon', 'Czyste naczynie'],
    14,
    28
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    5,
    'clarification',
    'Klarowanie',
    'Wino powinno się klarować naturalnie. Jeśli potrzebne jest szybsze klarowanie, użyj klarownika (np. bentonit - 2-4 g/l, rozpuść w wodzie i dodaj). Pozostaw wino w spokoju, osad opadnie na dno. Po 2-3 tygodniach sprawdź klarowność - wino powinno być przejrzyste. WARUNKI: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów, szczelne zamknięcie z rurką fermentacyjną. OSTRZEŻENIA: Nie mieszaj wina podczas klarowania. Jeśli po 4 tygodniach wino nie jest klarowne, rozważ użycie klarownika. Sprawdzaj czy rurka fermentacyjna ma wodę.',
    ARRAY['Klarownik (np. bentonit, żelatyna, białko jajka - opcjonalnie)', 'Cierpliwość'],
    14,
    28
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    6,
    'racking',
    'Zlewanie z nad osadu',
    'Przenieś wino do czystego naczynia, zostawiając osad na dnie. Użyj wężyka lub wlej ostrożnie. WARUNKI: Ostrożność, aby nie zmącić wina. OSTRZEŻENIA: Nie mieszaj osadu z winem. Zlewaj powoli i ostrożnie.',
    ARRAY['Wężyk lub lejek z sitkiem', 'Czyste naczynie'],
    0,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    7,
    'maturation',
    'Dojrzewanie/maturacja',
    'Przenieś wino do naczynia do dojrzewania (np. beczka dębowa lub szklany balon do wina). Temperatura 10-15°C. Zlewaj z nad osadu co 2-3 miesiące. WARUNKI: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów. OSTRZEŻENIA: Sprawdzaj regularnie czy nie ma oznak zepsucia. Zlewaj osad regularnie. Upewniaj się, że w rurce fermentacyjnej jest woda.',
    ARRAY['Naczynie do dojrzewania', 'Rurka fermentacyjna'],
    90,
    365
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    8,
    'bottling',
    'Butelkowanie',
    'Wysterylizuj butelki. Przenieś wino do butelek, zostawiając osad. Zamknij korkami. Przechowuj butelki poziomo w chłodnym, ciemnym miejscu. WARUNKI: Sterylne warunki, chłodne miejsce. OSTRZEŻENIA: Nie napełniaj butelek pod korek - zostaw 1-2 cm przestrzeni. Upewnij się, że korki są właściwie zamknięte.',
    ARRAY['Butelki', 'Korki', 'Korkownica'],
    1,
    1
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- WINO BIAŁE - TEMPLATE STAGES
-- ============================================================================

INSERT INTO public.template_stages (template_id, position, name, description, instructions, materials, days_min, days_max) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440002',
    1,
    'preparation',
    'Przygotowanie nastawu',
    'Wybierz dojrzałe winogrona białe. Usuń zepsute owoce i łodygi. Tłocz winogrona natychmiast (białe wino nie wymaga maceracji). Wyciśnij sok. WARUNKI: Temperatura 15-20°C, czyste, sterylne naczynia. OSTRZEŻENIA: Dla białego wina ważne jest szybkie tłoczenie - nie pozostawiaj skórek z winogron w soku.',
    ARRAY['Winogrona białe (ok. 12-15 kg na 10L wina)', 'Prasa lub tłuczek', 'Fermentator'],
    1,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    2,
    'primary_fermentation',
    'Fermentacja burzliwa',
    'Dodaj drożdże winne do soku oraz pożywka z witaminą B1 zgodnie z instrukcją. Opcjonalnie dodaj siarkę (50-80 mg/l - dla białych win często potrzebna dla stabilności). Zainstaluj rurka fermentacyjną. Fermentacja powinna być widoczna po 12-24 godzinach (delikatne bąbelki, mniej piany niż w czerwonym). Temperatura 15-18°C (chłodniejsza niż dla czerwonego - ważne dla aromatu). Delikatnie mieszaj codziennie. WARUNKI: Temperatura 15-18°C, ciemne miejsce, stabilna temperatura (ważne!). OSTRZEŻENIA: Białe wino fermentuje w niższej temperaturze niż czerwone - to jest kluczowe dla aromatu. Utrzymuj stabilną temperaturę - wahania mogą zepsuć smak. Mieszaj delikatnie - mniej agresywnie niż czerwone (mniej kożucha). Jeśli fermentacja nie zacznie się w 48 godzin, sprawdź temperaturę.',
    ARRAY['Drożdże winne', 'Pożywka z witaminą B1', 'Rurka fermentacyjna', 'Siarka/siarczyn sodu (opcjonalnie, 50-80 mg/l)', 'Cukier (jeśli potrzebny)'],
    7,
    14
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    3,
    'secondary_fermentation',
    'Fermentacja cicha',
    'Po zakończeniu fermentacji burzliwej (mniej bąbelków, osad opadł) wykonaj pierwsze zlewanie z nad osadu. Przenieś wino do czystego naczynia, zostawiając osad. Następnie wino przechodzi w fazę cichą - zamknij szczelnie z rurką fermentacyjną. Temperatura 15-18°C (nie 12-15°C - to zbyt niska dla kompletnej fermentacji). WARUNKI: Temperatura 15-18°C, ciemne miejsce, szczelne zamknięcie. OSTRZEŻENIA: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę. Sprawdzaj regularnie, ale nie mieszaj. Temperatura 15-18°C jest lepsza niż 12-15°C dla kompletnej fermentacji.',
    ARRAY['Fermentator z zamknięciem', 'Rurka fermentacyjna', 'Syfon', 'Czyste naczynie'],
    14,
    21
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    4,
    'clarification',
    'Klarowanie',
    'Wino klaruje się naturalnie. Można użyć klarownika. Pozostaw w spokoju, osad opadnie. WARUNKI: Temperatura 8-12°C, ciemne miejsce. OSTRZEŻENIA: Białe wino powinno być bardzo klarowne. Jeśli nie jest, użyj klarownika.',
    ARRAY['Klarownik (opcjonalnie)'],
    14,
    21
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    5,
    'racking',
    'Zlewanie z nad osadu',
    'Przenieś wino do czystego naczynia, zostawiając osad. Użyj syfonu. WARUNKI: Ostrożność. OSTRZEŻENIA: Nie mieszaj osadu.',
    ARRAY['Syfon', 'Czyste naczynie'],
    0,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    6,
    'maturation',
    'Dojrzewanie/maturacja',
    'Przenieś do naczynia do dojrzewania. Temperatura 8-12°C. Zlewaj z nad osadu co 2 miesiące. WARUNKI: Temperatura 8-12°C, ciemne miejsce. OSTRZEŻENIA: Białe wino dojrzewa krócej niż czerwone. Sprawdzaj regularnie.',
    ARRAY['Naczynie do dojrzewania', 'Korek'],
    90,
    180
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    7,
    'bottling',
    'Butelkowanie',
    'Wysterylizuj butelki. Przenieś wino do butelek, zostawiając osad. Zamknij korkami. WARUNKI: Sterylne warunki. OSTRZEŻENIA: Upewnij się, że wszystko jest czyste i sterylne.',
    ARRAY['Butelki', 'Korki', 'Korkownica'],
    1,
    1
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- WINO RÓŻOWE - TEMPLATE STAGES
-- ============================================================================

INSERT INTO public.template_stages (template_id, position, name, description, instructions, materials, days_min, days_max) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440003',
    1,
    'preparation',
    'Przygotowanie nastawu',
    'Wybierz winogrona czerwone lub mieszankę czerwonego i białego. Usuń zepsute owoce. Wybierz krótką macerację (6-24 godziny) dla delikatnego koloru lub tłoczenie od razu. Po krótkiej maceracji przetłocz i wyciśnij sok różowy. WARUNKI: Temperatura 15-20°C. OSTRZEŻENIA: Krótka maceracja - nie pozostawiaj zbyt długo, bo wino będzie za ciemne.',
    ARRAY['Winogrona czerwone/białe (ok. 14-17 kg na 10L)', 'Prasa lub tłuczek', 'Fermentator'],
    1,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    2,
    'primary_fermentation',
    'Fermentacja burzliwa',
    'Dodaj drożdże winne oraz pożywka z witaminą B1 zgodnie z instrukcją. Opcjonalnie dodaj siarkę (40-60 mg/l). Zainstaluj rurkę fermentacyjną. Temperatura 16-20°C. Fermentacja powinna być widoczna po 12-24 godzinach. Delikatnie mieszaj codziennie (mniej agresywnie niż czerwone, bo mniej kożucha). WARUNKI: Temperatura 16-20°C, ciemne miejsce, stabilna temperatura. OSTRZEŻENIA: Kontroluj temperaturę - różowe wino jest wrażliwe na zbyt wysoką temperaturę (>22°C może zepsuć aromat). Mieszaj delikatnie codziennie. Jeśli fermentacja nie zacznie się w 48 godzin, sprawdź temperaturę.',
    ARRAY['Drożdże winne', 'Pożywka z witaminą B1', 'Rurka fermentacyjna', 'Siarka/siarczyn sodu (opcjonalnie, 40-60 mg/l)', 'Cukier (jeśli potrzebny)'],
    7,
    12
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    3,
    'secondary_fermentation',
    'Fermentacja cicha',
    'Po zakończeniu fermentacji burzliwej (mniej bąbelków, osad opadł) wykonaj pierwsze zlewanie z nad osadu. Przenieś wino do czystego naczynia, zostawiając osad. Następnie wino przechodzi w fazę cichą - zamknij szczelnie z rurką fermentacyjną. Temperatura 15-18°C (nie 14-16°C - zbyt niska dla kompletnej fermentacji). WARUNKI: Temperatura 15-18°C, ciemne miejsce, szczelne zamknięcie. OSTRZEŻENIA: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę. Sprawdzaj regularnie, ale nie mieszaj. Temperatura 15-18°C jest lepsza dla kompletnej fermentacji.',
    ARRAY['Fermentator z zamknięciem', 'Rurka fermentacyjna', 'Syfon', 'Czyste naczynie'],
    14,
    21
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    4,
    'clarification',
    'Klarowanie',
    'Pozostaw wino do klarowania. Można użyć klarownika. WARUNKI: Temperatura 10-12°C. OSTRZEŻENIA: Różowe wino powinno być bardzo klarowne i jasne.',
    ARRAY['Klarownik (opcjonalnie)'],
    14,
    21
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    5,
    'racking',
    'Zlewanie z nad osadu',
    'Przenieś wino do czystego naczynia. WARUNKI: Ostrożność. OSTRZEŻENIA: Nie mieszaj osadu.',
    ARRAY['Syfon', 'Czyste naczynie'],
    0,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    6,
    'maturation',
    'Dojrzewanie/maturacja',
    'Przenieś do naczynia do dojrzewania. Temperatura 10-12°C. WARUNKI: Temperatura 10-12°C. OSTRZEŻENIA: Różowe wino dojrzewa szybciej niż czerwone.',
    ARRAY['Naczynie do dojrzewania'],
    60,
    120
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    7,
    'bottling',
    'Butelkowanie',
    'Wysterylizuj butelki. Przenieś wino i zamknij. WARUNKI: Sterylne warunki. OSTRZEŻENIA: Upewnij się, że wszystko jest czyste.',
    ARRAY['Butelki', 'Korki', 'Korkownica'],
    1,
    1
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- WINO OWOCOWE - TEMPLATE STAGES
-- ============================================================================

INSERT INTO public.template_stages (template_id, position, name, description, instructions, materials, days_min, days_max) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440004',
    1,
    'preparation',
    'Przygotowanie nastawu',
    'Wybierz dojrzałe owoce (jabłka, wiśnie, maliny, itp.). Umyj i usuń zepsute części. Zmiażdż lub zblenduj owoce. Opcjonalnie dodaj wodę (dla bardzo gęstych owoców). Dodaj cukier według potrzeb (sprawdź zawartość cukru w owocach). WARUNKI: Temperatura pokojowa, czyste naczynia. OSTRZEŻENIA: Upewnij się, że owoce są dojrzałe ale nie przejrzałe. Sprawdź zawartość cukru przed dodaniem dodatkowego cukru.',
    ARRAY['Owoce (ilość zależy od typu, ok. 10-15 kg na 10L)', 'Blender lub tłuczek', 'Fermentator', 'Woda (jeśli potrzebna)', 'Cukier'],
    1,
    2
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    2,
    'separation',
    'Ewentualne oddzielanie',
    'Jeśli używasz owoców z pestkami/skórkami, możesz oddzielić sok od miąższu po 12-24 godzinach maceracji. Przetłocz przez sitko. WARUNKI: Temperatura pokojowa. OSTRZEŻENIA: Nie wszystkie wina owocowe wymagają oddzielania - zależy od typu owoców.',
    ARRAY['Sitko', 'Prasa (opcjonalnie)'],
    0,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    3,
    'primary_fermentation',
    'Fermentacja burzliwa',
    'Dodaj drożdże owocowe (specjalne dla win owocowych) lub drożdże winne oraz pożywka z witaminą B1 zgodnie z instrukcją. Opcjonalnie dodaj siarkę (40-60 mg/l - dla win owocowych często potrzebna dla stabilności). Zainstaluj rurkę fermentacyjną. Temperatura 18-22°C. Fermentacja powinna być widoczna po 12-24 godzinach (bąbelki, pianowanie). Codziennie mieszaj i zanurzaj kożuch (jeśli jest). WARUNKI: Temperatura 18-22°C, ciemne miejsce, dostęp tlenu na początku. OSTRZEŻENIA: Niektóre owoce (np. jabłka) fermentują szybciej. Kontroluj proces codziennie, mieszaj i zanurzaj kożuch. Wina owocowe mogą fermentować intensywniej - upewnij się, że rurka fermentacyjna ma dużo miejsca na pianę. Jeśli fermentacja nie zacznie się w 48 godzin, sprawdź temperaturę i zawartość cukru.',
    ARRAY['Drożdże owocowe lub winne', 'Pożywka z witaminą B1', 'Rurka fermentacyjna', 'Siarka/siarczyn sodu (opcjonalnie, 40-60 mg/l)', 'Cukier (jeśli potrzebny)'],
    7,
    14
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    4,
    'secondary_fermentation',
    'Fermentacja cicha',
    'Po zakończeniu fermentacji burzliwej (kożuch opadł, mniej bąbelków) wykonaj pierwsze zlewanie z nad osadu. Przenieś wino do czystego naczynia, zostawiając osad na dnie. Następnie wino przechodzi w fazę cichą - zamknij szczelnie z rurką fermentacyjną. Temperatura 15-18°C. Wina owocowe mogą fermentować dłużej niż winogronowe. WARUNKI: Temperatura 15-18°C, ciemne miejsce, szczelne zamknięcie. OSTRZEŻENIA: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę. Wina owocowe mogą fermentować dłużej niż winogronowe - bądź cierpliwy. Sprawdzaj regularnie, ale nie mieszaj.',
    ARRAY['Fermentator z zamknięciem', 'Rurka fermentacyjna', 'Syfon', 'Czyste naczynie'],
    14,
    28
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    5,
    'clarification',
    'Klarowanie',
    'Pozostaw wino do klarowania. Wina owocowe mogą wymagać klarownika częściej. WARUNKI: Temperatura 10-15°C. OSTRZEŻENIA: Wina owocowe mogą być mniej klarowne - użyj klarownika jeśli potrzeba.',
    ARRAY['Klarownik (często potrzebny)'],
    14,
    28
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    6,
    'racking',
    'Zlewanie z nad osadu',
    'Przenieś wino do czystego naczynia, zostawiając osad. WARUNKI: Ostrożność. OSTRZEŻENIA: Wina owocowe mogą mieć więcej osadu - zlewaj ostrożnie.',
    ARRAY['Syfon', 'Czyste naczynie'],
    0,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    7,
    'maturation',
    'Dojrzewanie/maturacja',
    'Przenieś do naczynia do dojrzewania. Temperatura 10-15°C. Zlewaj z nad osadu co 2-3 miesiące. WARUNKI: Temperatura 10-15°C. OSTRZEŻENIA: Czas dojrzewania zależy od typu owoców - niektóre są gotowe szybciej.',
    ARRAY['Naczynie do dojrzewania'],
    60,
    180
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    8,
    'bottling',
    'Butelkowanie',
    'Wysterylizuj butelki. Przenieś wino i zamknij. WARUNKI: Sterylne warunki. OSTRZEŻENIA: Upewnij się, że wszystko jest czyste.',
    ARRAY['Butelki', 'Korki', 'Korkownica'],
    1,
    1
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIÓD PITNY TRÓJNIAK - TEMPLATE STAGES
-- ============================================================================

INSERT INTO public.template_stages (template_id, position, name, description, instructions, materials, days_min, days_max) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440005',
    1,
    'preparation',
    'Przygotowanie nastawu',
    'Rozpuść miód w ciepłej wodzie (nie gotuj!). Proporcje: 1 część miodu na 2 części wody (trójniak). Temperatura wody max 40°C. Wymieszaj dokładnie. Opcjonalnie dodaj przyprawy (goździki, cynamon, itp.) - na początku lub później. WARUNKI: Temperatura wody max 40°C (nie gotować!), czyste naczynia. OSTRZEŻENIA: Nie gotuj miodu - traci właściwości. Użyj dobrej jakości miodu. Sprawdź czy woda jest odpowiedniej jakości (nie chlorowana lub przegotowana i ostudzona).',
    ARRAY['Miód naturalny (ok. 3-4 kg na 10L)', 'Woda (6-8L na 10L)', 'Przyprawy (opcjonalnie)', 'Fermentator'],
    1,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    2,
    'primary_fermentation',
    'Fermentacja burzliwa',
    'Dodaj drożdże do miodu pitnego (specjalne drożdże do miodu pitnego lub drożdże winne) oraz pożywka z witaminą B1 zgodnie z instrukcją. Miód pitny ma mało składników odżywczych, więc pożywka jest bardzo ważna. Zainstaluj rurkę fermentacyjną (upewnij się, że ma wodę!). Fermentacja jest widoczna po 2-3 dniach (bąbelki, pianowanie - miodu pitny ma więcej piany niż wino). Temperatura 18-22°C. Codziennie mieszaj delikatnie na początku (pierwsze 3-5 dni) - to napowietrza i pomaga drożdżom. Po 5 dniach przestań mieszać. WARUNKI: Temperatura 18-22°C, ciemne miejsce, dostęp tlenu na początku (nie zamykaj hermetycznie przez pierwsze 3-5 dni). OSTRZEŻENIA: Miód pitny fermentuje wolniej niż wino - bądź cierpliwy, to normalne. Upewnij się, że rurka fermentacyjna ma wodę (sprawdzaj codziennie!). Nie mieszaj zbyt agresywnie po pierwszych 5 dniach - pozwól drożdżom pracować. Jeśli fermentacja nie zacznie się w ciągu 5 dni, dodaj więcej pożywki i/lub więcej drożdży.',
    ARRAY['Drożdże do miodu pitnego lub winne (odporne na wysoką zawartość alkoholu)', 'Pożywka z witaminą B1 (ważna!)', 'Rurka fermentacyjna', 'Dodatkowy miód lub cukier (jeśli potrzeba skorygować ekstrakt)'],
    10,
    21
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    3,
    'secondary_fermentation',
    'Fermentacja cicha',
    'Po zakończeniu fermentacji burzliwej (mniej bąbelków, mniej piany, osad opadł - może to trwać dłużej niż w winie) wykonaj pierwsze zlewanie z nad osadu. Przenieś miód pitny do czystego naczynia, zostawiając osad na dnie. Następnie zamknij szczelnie z rurką fermentacyjną - przechodzi w fazę cichą. Temperatura 15-18°C. Fermentacja trwa, ale jest mniej widoczna (może być 1 bąbelek co kilka sekund). WARUNKI: Temperatura 15-18°C, ciemne, spokojne miejsce, szczelne zamknięcie. OSTRZEŻENIA: Po zlewaniu sprawdź czy rurka fermentacyjna ma wodę (ważne!). Miód pitny potrzebuje więcej czasu na fermentację cichą niż wino - to normalne. Sprawdzaj regularnie (co tydzień), ale nie mieszaj. Jeśli fermentacja całkowicie ustała po 8 tygodniach, można zakończyć - ale miód pitny może fermentować nawet do 12 tygodni.',
    ARRAY['Fermentator z zamknięciem', 'Rurka fermentacyjna', 'Syfon', 'Czyste naczynie'],
    28,
    56
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    4,
    'clarification',
    'Klarowanie',
    'Miód pitny klaruje się wolniej niż wino. Pozostaw w spokoju, osad opadnie na dno. Można użyć klarownika, ale często nie jest potrzebny - miód pitny klaruje się naturalnie. WARUNKI: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów. OSTRZEŻENIA: Miód pitny potrzebuje dużo czasu na klarowanie - nie spiesz się. Jeśli po 8 tygodniach nie jest klarowne, rozważ użycie klarownika.',
    ARRAY['Klarownik (opcjonalnie, rzadko potrzebny)', 'Cierpliwość'],
    28,
    56
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    5,
    'racking',
    'Zlewanie z nad osadu',
    'Przenieś miód pitny do czystego naczynia, zostawiając osad na dnie. Użyj syfonu lub wlej ostrożnie. Może być potrzeba zlewania kilkakrotnie. WARUNKI: Ostrożność, aby nie zmącić. OSTRZEŻENIA: Nie mieszaj osadu z miodem pitnym. Miód pitny może mieć więcej osadu niż wino - zlewaj regularnie.',
    ARRAY['Syfon lub lejek z sitkiem', 'Czyste naczynie'],
    0,
    1
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    6,
    'maturation',
    'Dojrzewanie/maturacja',
    'Przenieś miód pitny do naczynia do dojrzewania (szklany demijohn, najlepiej nie dębowy beczka - miód pitny nie potrzebuje dębu). Temperatura 10-15°C. Zlewaj z nad osadu co 3-4 miesiące. Miód pitny wymaga długiego dojrzewania - im dłużej, tym lepszy smak. WARUNKI: Temperatura 10-15°C, ciemne miejsce, bez wstrząsów. OSTRZEŻENIA: Miód pitny potrzebuje dużo czasu na dojrzewanie - minimum 6 miesięcy, najlepiej 12-24 miesiące. Sprawdzaj regularnie czy nie ma oznak zepsucia. Zlewaj osad regularnie. Nie spiesz się - dojrzewanie to kluczowy etap.',
    ARRAY['Naczynie do dojrzewania (szklane, nie dębowe)', 'Korek lub rurka fermentacyjna'],
    180,
    730
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    7,
    'bottling',
    'Butelkowanie',
    'Wysterylizuj butelki. Przenieś miód pitny do butelek, zostawiając osad. Zamknij korkami. Przechowuj butelki poziomo lub pionowo w chłodnym, ciemnym miejscu. Miód pitny może być jeszcze lepszy po butelkowaniu - dojrzewa dalej w butelkach. WARUNKI: Sterylne warunki, chłodne miejsce. OSTRZEŻENIA: Nie napełniaj butelek pod korek - zostaw 1-2 cm przestrzeni. Upewnij się, że korki są właściwie zamknięte. Miód pitny może fermentować jeszcze w butelkach - sprawdzaj regularnie.',
    ARRAY['Butelki', 'Korki', 'Korkownica', 'Syfon'],
    1,
    1
  )
ON CONFLICT DO NOTHING;
