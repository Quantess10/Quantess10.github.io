/*
  Najważniejsze miejsce do personalizacji.

  1. Hasło zmieniasz w stałej APP_PASSWORD.
  2. Domyślne nazwy kategorii i listy słów zmieniasz w tablicy defaultCategories.
  3. Użytkownik może później edytować te wartości w przeglądarce; zapisujemy je w localStorage.

  Uwaga: hasło zapisane w JavaScripcie chroni tylko przed przypadkowym wejściem.
  Nie jest to zabezpieczenie do poufnych danych, bo kod strony da się podejrzeć w przeglądarce.
*/

const APP_PASSWORD = "ruchanie";
const STORAGE_KEY = "private-dice-categories";

const defaultCategories = [
  {
    name: "Czynność",
    words: ["Seks", "Liż", "Ssij", "Dotykaj", "Masuj"],
  },
  {
    name: "Część ciała",
    words: ["Usta", "Kark", "Piersi", "Plecy", "Pośladki", "Pindol/Pindolinda", "Nogi"],
  },
  {
    name: "Pozycja",
    words: ["Misjonarz", "Piesek", "Kowbojka", "Odwrócona kowbojka", "Łyżeczka"],
  },
  {
    name: "Kategoria 4",
    words: ["Małe", "Średnie", "Duże"],
  },
];

const loginScreen = document.querySelector("#login-screen");
const appScreen = document.querySelector("#app-screen");
const loginForm = document.querySelector("#login-form");
const passwordInput = document.querySelector("#password-input");
const passwordError = document.querySelector("#password-error");
const logoutButton = document.querySelector("#logout-button");
const categoriesContainer = document.querySelector("#categories");
const rollButton = document.querySelector("#roll-button");
const resultList = document.querySelector("#result-list");
const diceFace = document.querySelector("#dice-face");

let categories = loadCategories();

/*
  Pobieramy kategorie z pamięci przeglądarki.
  Jeśli nie ma jeszcze zapisu, używamy domyślnych danych z defaultCategories.
*/
function loadCategories() {
  const savedCategories = localStorage.getItem(STORAGE_KEY);

  if (!savedCategories) {
    return cloneCategories(defaultCategories);
  }

  try {
    const parsedCategories = JSON.parse(savedCategories);

    if (Array.isArray(parsedCategories) && parsedCategories.length === 4) {
      return parsedCategories;
    }
  } catch (error) {
    console.warn("Nie udało się odczytać zapisanych kategorii.", error);
  }

  return cloneCategories(defaultCategories);
}

/*
  Tworzymy kopię tablicy kategorii, żeby nie modyfikować defaultCategories bezpośrednio.
*/
function cloneCategories(sourceCategories) {
  return sourceCategories.map((category) => ({
    name: category.name,
    words: [...category.words],
  }));
}

/*
  Zapisujemy aktualne nazwy kategorii i listy słów w localStorage.
  Dzięki temu po odświeżeniu strony ustawienia zostają w tej samej przeglądarce.
*/
function saveCategories() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

/*
  Ekran logowania jest bardzo prosty:
  sprawdzamy wpisany tekst z hasłem APP_PASSWORD i pokazujemy aplikację.
*/
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value === APP_PASSWORD) {
    passwordInput.value = "";
    passwordError.textContent = "";
    loginScreen.hidden = true;
    appScreen.hidden = false;
    renderCategories();
    return;
  }

  passwordError.textContent = "Nieprawidłowe hasło.";
  passwordInput.select();
});

/*
  Przycisk "Zablokuj" ukrywa aplikację i wraca do ekranu hasła.
*/
logoutButton.addEventListener("click", () => {
  appScreen.hidden = true;
  loginScreen.hidden = false;
  passwordInput.focus();
});

/*
  Budujemy formularze dla 4 kategorii.
  Każda kategoria ma osobne pole nazwy i listę słów wpisywanych po jednym wierszu.
*/
function renderCategories() {
  categoriesContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const card = document.createElement("article");
    card.className = "category-card";

    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", `category-name-${index}`);
    nameLabel.textContent = `Nazwa kategorii ${index + 1}`;

    const nameInput = document.createElement("input");
    nameInput.id = `category-name-${index}`;
    nameInput.value = category.name;

    const wordsLabel = document.createElement("label");
    wordsLabel.setAttribute("for", `category-words-${index}`);
    wordsLabel.textContent = "Słowa do losowania";

    const wordsTextarea = document.createElement("textarea");
    wordsTextarea.id = `category-words-${index}`;
    wordsTextarea.value = category.words.join("\n");
    wordsTextarea.placeholder = "Jedno słowo lub hasło w każdym wierszu";

    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Każdy wiersz działa jak jedna ścianka własnej kości.";

    /*
      Po zmianie nazwy aktualizujemy odpowiednią kategorię i zapisujemy dane.
    */
    nameInput.addEventListener("input", () => {
      categories[index].name = nameInput.value.trim() || `Kategoria ${index + 1}`;
      saveCategories();
    });

    /*
      Po zmianie listy dzielimy tekst po wierszach.
      Puste wiersze usuwamy, żeby nie dało się wylosować pustego wyniku.
    */
    wordsTextarea.addEventListener("input", () => {
      categories[index].words = wordsTextarea.value
        .split("\n")
        .map((word) => word.trim())
        .filter(Boolean);

      saveCategories();
    });

    card.append(nameLabel, nameInput, wordsLabel, wordsTextarea, hint);
    categoriesContainer.append(card);
  });
}

/*
  Jedyny przycisk losujący:
  - rzuca klasyczną kością 1-6 tylko dla efektu wizualnego,
  - losuje po jednym słowie z każdej niepustej kategorii,
  - pokazuje wynik w sekcji "Wynik losowania".
*/
rollButton.addEventListener("click", () => {
  const diceNumber = randomNumber(1, 6);
  const results = categories
    .filter((category) => category.words.length > 0)
    .map((category) => ({
      categoryName: category.name,
      word: pickRandom(category.words),
    }));

  showDiceNumber(diceNumber);
  renderResults(results);
});

/*
  Losuje liczbę całkowitą z podanego zakresu.
*/
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
  Losuje jeden element z tablicy.
*/
function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/*
  Ustawia wygląd kości na wynik 1-6.
*/
function showDiceNumber(number) {
  diceFace.className = `dice-face dice-${number} is-rolling`;

  window.setTimeout(() => {
    diceFace.classList.remove("is-rolling");
  }, 180);
}

/*
  Wyświetla wyniki losowania.
  Jeśli wszystkie listy są puste, pokazujemy prostą informację.
*/
function renderResults(results) {
  resultList.innerHTML = "";

  if (results.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-result";
    emptyMessage.textContent = "Brak słów do losowania. Uzupełnij przynajmniej jedną listę.";
    resultList.append(emptyMessage);
    return;
  }

  results.forEach((result) => {
    const item = document.createElement("article");
    item.className = "result-item";

    const categoryName = document.createElement("strong");
    categoryName.textContent = result.categoryName;

    const word = document.createElement("span");
    word.textContent = result.word;

    item.append(categoryName, word);
    resultList.append(item);
  });
}

/*
  Początkowo pokazujemy pustą kość z wynikiem 1, żeby interfejs nie wyglądał martwo.
*/
showDiceNumber(1);
