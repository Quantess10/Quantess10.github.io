# Strona polityk prywatności — GitHub Pages

Katalog `docs/` jest gotowy do publikacji jako GitHub Pages. Zawiera:

- stronę główną z listą aplikacji,
- politykę Kaucyjnego Imperium pod ścieżką
  `/privacy/kaucyjne_imperium/`,
- wspólny, responsywny arkusz stylów.

## Wymagane przed publikacją

W pliku `privacy/kaucyjne_imperium/index.html` wyszukaj i zastąp:

- `UZUPEŁNIJ_NAZWĘ_DEWELOPERA` — nazwą zgodną z nazwą dewelopera w Google Play,
- `UZUPEŁNIJ_EMAIL_KONTAKTOWY` — publicznym adresem do spraw prywatności.

Następnie usuń widoczny blok `publish-warning` z początku polityki.

Treść zakłada, że gra nie jest kierowana do dzieci poniżej 13 lat. Jeżeli w
Play Console zostaną wybrane dziecięce grupy wiekowe, sekcja „Prywatność dzieci”
i konfiguracja reklam wymagają osobnego przeglądu przed publikacją.

## Publikacja

1. Umieść repozytorium na GitHubie i wypchnij katalog `docs/`.
2. W repozytorium otwórz **Settings → Pages**.
3. W **Build and deployment** wybierz **Deploy from a branch**.
4. Wskaż właściwą gałąź oraz folder `/docs`.
5. Po publikacji polityka będzie dostępna pod adresem podobnym do:

   `https://LOGIN.github.io/NAZWA_REPO/privacy/kaucyjne_imperium/`

Ten sam pełny adres należy podać w Play Console oraz podczas budowania aplikacji
jako `PRIVACY_POLICY_URL`.

## Dodawanie kolejnej gry

1. Skopiuj folder `privacy/kaucyjne_imperium/` do np. `privacy/nowa_gra/`.
2. Zmień nazwę, identyfikator pakietu, funkcje, dostawców SDK i kategorie danych.
3. Dodaj kartę prowadzącą do nowej polityki w głównym `index.html`.
4. Zweryfikuj treść z rzeczywistą konfiguracją aplikacji i formularzem Data Safety.

To jest praktyczny szablon techniczny, a nie indywidualna porada prawna.
