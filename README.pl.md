
# 🎭 Improv Toolbox

*English version: [README.md](README.md)*

> **Skrzynka narzędziowa improwizatora** — aplikacja mobilna dla trenerów i graczy improwizacji teatralnej.

Zaprojektowana z myślą o polskich zespołach improwizacyjnych. Działa offline jako PWA — wystarczy dodać ją do ekranu głównego telefonu i masz pełen zestaw narzędzi zawsze pod ręką, bez internetu.

---

## ✨ Funkcje

### 🎡 Koło Archetypów
- Losuje archetypy postaci dla graczy jednym tapnięciem
- 12 archetypów z opisami (Bohater, Błazen, Złoczyńca i inne)
- Animowane koło — każdy archetyp przypisywany osobno, bez powtórzeń
- Możliwość ponownego losowania dla wybranego gracza
- Podgląd wszystkich przypisanych wyników

### 🎭 Generator Scen
- Losuje kompletny zestaw sceniczny: miejsce, relację, sytuację, nastrój i epokę
- Filtr gatunkowy (komedia, dramat, romans, thriller, absurd, historyczny)
- Możliwość przerzucania poszczególnych elementów
- 40+ lokalizacji, 30+ relacji, 30+ sytuacji

### 🏃 Gry Rozgrzewkowe
- Baza 60 gier rozgrzewkowych z opisami i wskazówkami
- Filtrowanie po poziomie trudności (początkujący / średni / zaawansowany) i liczbie graczy
- 6 kategorii: fizyczne, wokalne, skupienie, ensemble, narracja, postać

### 📖 Ciekawostki o Impro
- 60 faktów o historii, technikach i sławnych improwizatorach
- Filtrowanie po kategorii
- Losowa kolejność przy każdym uruchomieniu

---

## 🧰 Więcej narzędzi

### ⏱️ Timer
- Presety 1 / 2 / 3 / 5 / 10 minut oraz niestandardowy czas
- Okrągły pierścień postępu (SVG)
- Tryb pełnoekranowy
- Wibracja telefonu po zakończeniu odliczania

### 🎭 Budowniczy Postaci
- Losuje 6 cech postaci: zawód, pragnienie, dziwactwo, sposób mówienia, emocję i status
- Każdą cechę można przerzucić osobno
- ~108 unikalnych wartości do losowania

### 🃏 Karty Promptów
- 60 kart w 5 kategoriach: pierwsza kwestia, zawód, miejsce, czego nie mówić, tytuł
- Duży format — czytelny z odległości

### 🎲 Sugestie od Publiczności
- 87 sugestii w 6 kategoriach: miejsce, zawód, relacja, emocja, tytuł filmowy, słowo
- Tryb „losowego zestawu" — pokazuje 4 losowe sugestie naraz

### 📖 Biblioteka Form
- 18 form improwizacyjnych z opisami i zasadami
- Filtrowanie po poziomie trudności
- Harold, Armando, Micetro, Montaż, Maestro, BAT i wiele innych

### 📋 Planista Prób
- Buduj plan próby z gotowych bloków: rozgrzewki, sceny, ćwiczenia, przerwy
- Losuj kolejność rozgrzewek jednym przyciskiem
- Eksport planu jako tekst
- Zapis w przeglądarce (localStorage)

### 💭 Pytania Refleksyjne
- 20 pytań po-scenicznych dla trenerów
- 5 kategorii: Gra, CROW, Ensemble, Edycja, Postać

### 🔊 Soundscape
- 7 nastrojowych tapet dźwiękowych (deszcz, las, kawiarnia, ocean i inne)
- Suwak głośności, przewijanie, tryb ciągły

### 🔢 Losowanie Statusów
- Losuje unikalne liczby 1–10 dla każdego gracza (do 10 osób)
- Karty odwracane tapnięciem — każdy widzi tylko swój status
- Kolory wg poziomu: niebieski (1–3) / pomarańczowy (4–6) / czerwony (7–10)
- Przycisk „odkryj wszystkie" na potrzeby debriefingu

### 📖 Generator Story Spine
- Losuje zalążki dla 6 beatów Story Spine (Dawno dawno temu… Każdego dnia… Aż pewnego dnia…)
- Przerzucanie każdego beatu osobno lub generowanie całości od nowa
- ~15 zalążków na beat, 90 unikalnych fraz łącznie

### 🎪 Tablica Jamu *(Alpha)*
- Buduj kolejkę gier na jam show
- Szybkie dodawanie z biblioteki 18 form jednym tapnięciem
- Tryb Show — duży ekran z nazwą gry, zasadami i wskazówkami dla prowadzącego
- Widoczne zasady i metadane (co prosić od publiczności, liczba graczy, czas)

---

## 🌍 Język
Aplikacja natywna obsługuje **polski**, **angielski** i **czeski** — język można wybrać w nagłówku. Publiczne wersje WWW pozostają osobnymi stronami po polsku i angielsku.

---

## 📱 Instalacja (PWA)

1. Otwórz aplikację w przeglądarce mobilnej
2. Dotknij „Dodaj do ekranu głównego" (Safari / Chrome)
3. Aplikacja działa offline po pierwszym załadowaniu

---

## 🛠️ Tech Stack

| Warstwa | Technologia |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 7 |
| Style | Tailwind CSS v4 |
| Tłumaczenia | react-i18next |
| PWA | vite-plugin-pwa (Workbox) |
| Routing | react-router-dom |

---

## 🚀 Uruchomienie lokalne

```bash
nvm use 22
npm install
npm run dev    # serwer deweloperski
npm run build  # build produkcyjny
```

---

## 🧾 TL;DR

**Improv Toolbox** to darmowa aplikacja webowa (PWA) dla trenerów i graczy improwizacji teatralnej.
Działa na telefonie jak natywna apka — bez instalacji ze sklepu, bez logowania, bez reklam.
Wystarczy przeglądarka i jedno tapnięcie „Dodaj do ekranu głównego".

Zawiera **15 narzędzi** w dwóch językach (PL / EN), działa offline i jest zoptymalizowana pod telefony:

- 🎡 **Koło Archetypów** — losuje archetypy postaci dla każdego gracza osobno, z animowanym kołem i podglądem wyników.
- 🎭 **Generator Scen** — jednym tapnięciem losuje kompletny zestaw: miejsce, relację, sytuację, nastrój i epokę, z filtrem gatunkowym.
- 🏃 **Gry Rozgrzewkowe** — baza 60 gier z opisami, wskazówkami i filtrowaniem po poziomie i liczbie graczy.
- 📖 **Ciekawostki** — 60 faktów o historii i technikach improwizacji, przydatnych na warsztatach.
- ⏱️ **Timer** — odliczanie z presetami i trybem pełnoekranowym; wibruje gdy czas minie.
- 🎭 **Budowniczy Postaci** — losuje 6 cech postaci (zawód, pragnienie, dziwactwo, mowa, emocja, status) z możliwością przerzucenia każdej z osobna.
- 🃏 **Karty Promptów** — 60 kart w 5 kategoriach, wyświetlane w dużym formacie czytelnym z odległości.
- 🎲 **Sugestie od Publiczności** — 87 sugestii w 6 kategoriach plus tryb losowego zestawu (4 naraz).
- 📖 **Biblioteka Form** — 18 form improwizacyjnych z opisami i zasadami, filtrowanych po trudności.
- 📋 **Planista Prób** — buduj plan próby z gotowych bloków, losuj kolejność i eksportuj jako tekst.
- 💭 **Pytania Refleksyjne** — 20 pytań po-scenicznych dla trenerów w 5 kategoriach (Gra, CROW, Ensemble, Edycja, Postać).
- 🔊 **Soundscape** — 7 nastrojowych tapet dźwiękowych do odtwarzania podczas scen lub ćwiczeń.
- 🔢 **Losowanie Statusów** — przypisuje unikalne liczby 1–10 graczom, każdy odwraca swoją kartę osobno.
- 📖 **Generator Story Spine** — losuje zalążki fraz dla 6 beatów klasycznej Story Spine, z przerzucaniem per beat.
- 🎪 **Tablica Jamu** *(Alpha)* — buduj kolejkę gier na jam show i wyświetlaj zasady każdej formy na pełnym ekranie.

---

## 📄 Licencja / License

Kod źródłowy jest dostępny na licencji [MIT](LICENSE). / The source code is
available under the [MIT license](LICENSE).

Nazwa „Improv Toolbox", maskotka węża i ikony marki nie są objęte licencją MIT
i nie mogą być używane do oznaczania innych aplikacji. / The "Improv Toolbox"
name, snake mascot, and brand icons are not covered by the MIT license and may
not be used to brand other applications.
