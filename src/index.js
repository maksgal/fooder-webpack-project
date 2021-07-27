const runner = () => {
  const header = document.getElementById("header");
  const searchButton = document.getElementById("search-button");
  const favsButton = document.getElementById("favs-button");
  const input = document.getElementById("search-input");
  const mainSection = document.getElementById("main");
  let recipeList;
  const regionSelector = document.getElementById("select-region");
  const GET_URL = `https://api.edamam.com/search?app_id=6e9588d5&app_key=235fe842418027a77beaedfea67209bb&to=30`;
  const listHeader = document.createElement("h1");
  const headerLogo = document.getElementById("header_logo");
  let searchURL;
  //Hiding the header on scroll
  const headerHider = () => {
    let prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
      const currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos || currentScrollPos < 100) {
        header.classList.remove("header-hidden");
      } else {
        header.classList.add("header-hidden");
      }
      prevScrollpos = currentScrollPos;
    };
  };
  // creating the elements for the lists
  const createTheListElement = () => {
    recipeList = document.createElement("ul");
    recipeList.setAttribute("id", "recipe_list");
    recipeList.classList.add("list");
    mainSection.appendChild(recipeList);
  };

  mainSection.innerHTML = "";
  createTheListElement();

  // creating the local storage array for favorite recipes

  const createLocalStorageArrayOfFavs = () => {
    const arrFromLS = JSON.parse(localStorage.getItem("favorites"));

    if (arrFromLS === null) {
      localStorage.setItem("favorites", JSON.stringify([]));
    }
  };
  const createSearchUrl = () => {
    listHeader.innerText = `Search results for: "${input.value}":`;
    searchURL = regionSelector.value
      ? `${GET_URL}&q=${input.value}&cuisineType=${regionSelector.value}`
      : `${GET_URL}&q=${input.value}`;
  };

  const fetchSearchData = async () => {
    createSearchUrl();
    const response = await fetch(searchURL);
    const result = await response.json();
    const recipeArray = result.hits;

    return recipeArray;
  };

  // adding the item to the local storage
  const addFavToLocalStorage = (meal) => {
    const arrFromLS = JSON.parse(localStorage.getItem("favorites"));
    if (
      !arrFromLS.some((mealInLS) => mealInLS.recipe.label === meal.recipe.label)
    ) {
      arrFromLS.push(meal);
      localStorage.setItem("favorites", JSON.stringify(arrFromLS));
    }
    showHideFavButton(arrFromLS);
  };
  // removing the item from the local storage
  const removeFavFromLocalStorage = (meal) => {
    const arrFromLS = JSON.parse(localStorage.getItem("favorites"));

    arrFromLS.splice(
      arrFromLS.findIndex(
        (mealFromLS) => mealFromLS.recipe.label === meal.recipe.label
      ),
      1
    );
    localStorage.setItem("favorites", JSON.stringify(arrFromLS));

    showHideFavButton(arrFromLS);

    //fillFavoritesList();
  };

  const createListItems = (arrItem, listType) => {
    const li = document.createElement("li");
    li.classList.add("li");
    //adding the recipe title
    const title = document.createElement("h3");
    title.innerText = arrItem.recipe.label;
    title.classList.add("li-title");
    li.appendChild(title);
    //adding the image and the recipe description into the content section of the li
    const content = document.createElement("div");
    content.classList.add("li-content");
    // adding the image
    const liImage = document.createElement("img");

    liImage.src = arrItem.recipe.image;

    liImage.alt = arrItem.recipe.label;
    liImage.classList.add("li-content-img");
    content.appendChild(liImage);
    //adding the ingredients by itterating through the ingrediends array
    const ingredients = document.createElement("p");
    ingredients.classList.add("li-content-ings", "hidden");
    ingredients.innerText = arrItem.recipe.ingredientLines.join("\n");
    //adding ingredients button to show/hide ingredients.
    const ingsButton = document.createElement("button");
    ingsButton.classList.add("button", "button-ings");
    ingsButton.innerText = "Ingredients";
    ingsButton.onclick = () => {
      ingredients.classList.toggle("hidden");
      li.classList.toggle("li-fullscreen");
    };
    content.appendChild(ingsButton);

    content.appendChild(ingredients);

    //adding link to the full recipe
    const recipeLink = document.createElement("a");
    recipeLink.classList.add("button", "button-ings");
    recipeLink.setAttribute("href", arrItem.recipe.url);
    recipeLink.setAttribute("target", "_blank");
    recipeLink.innerText = "Full Recipe";
    content.appendChild(recipeLink);

    li.appendChild(content);

    //Inserting adding and removing buttons
    const addFavButton = () => {
      const arrFromLS = JSON.parse(localStorage.getItem("favorites"));
      const addToFavsButton = document.createElement("button");
      addToFavsButton.classList.add("button", "button-favs");
      const addToFavsButtonIcon = document.createElement("img");
      addToFavsButtonIcon.classList.add("favs-button-icon");
      addToFavsButton.appendChild(addToFavsButtonIcon);
      addToFavsButtonIcon.src =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNSAxMGMtMi40ODMgMC00LjUgMi4wMTUtNC41IDQuNXMyLjAxNyA0LjUgNC41IDQuNSA0LjUtMi4wMTUgNC41LTQuNS0yLjAxNy00LjUtNC41LTQuNXptMi41IDVoLTJ2MmgtMXYtMmgtMnYtMWgydi0yaDF2MmgydjF6bS02LjUyNyA0LjU5M2MtMS4xMDggMS4wODYtMi4yNzUgMi4yMTktMy40NzMgMy40MDctNi40My02LjM4MS0xMi0xMS4xNDctMTItMTUuODA4IDAtNC4wMDUgMy4wOTgtNi4xOTIgNi4yODEtNi4xOTIgMi4xOTcgMCA0LjQzNCAxLjA0MiA1LjcxOSAzLjI0OCAxLjI3OS0yLjE5NSAzLjUyMS0zLjIzOCA1LjcyNi0zLjIzOCAzLjE3NyAwIDYuMjc0IDIuMTcxIDYuMjc0IDYuMTgyIDAgLjc0Ni0uMTU2IDEuNDk2LS40MjMgMi4yNTMtLjUyNy0uNDI3LTEuMTI0LS43NjgtMS43NjktMS4wMTQuMTIyLS40MjUuMTkyLS44MzkuMTkyLTEuMjM5IDAtMi44NzMtMi4yMTYtNC4xODItNC4yNzQtNC4xODItMy4yNTcgMC00Ljk3NiAzLjQ3NS01LjcyNiA1LjAyMS0uNzQ3LTEuNTQtMi40ODQtNS4wMy01LjcyLTUuMDMxLTIuMzE1LS4wMDEtNC4yOCAxLjUxNi00LjI4IDQuMTkyIDAgMy40NDIgNC43NDIgNy44NSAxMCAxM2wyLjEwOS0yLjA2NGMuMzc2LjU1Ny44MzkgMS4wNDggMS4zNjQgMS40NjV6Ii8+PC9zdmc+";
      //addToFavsButton.innerHTML = "Add to favs!";

      li.appendChild(addToFavsButton);

      const removeFromFavsButton = document.createElement("button");
      removeFromFavsButton.classList.add("button", "hidden", "button-favs");
      const removeFromFavsButtonIcon = document.createElement("img");
      removeFromFavsButtonIcon.classList.add("favs-button-icon");
      removeFromFavsButton.appendChild(removeFromFavsButtonIcon);
      removeFromFavsButtonIcon.src =
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkuNSAxMGMtMi40ODMgMC00LjUgMi4wMTUtNC41IDQuNXMyLjAxNyA0LjUgNC41IDQuNSA0LjUtMi4wMTUgNC41LTQuNS0yLjAxNy00LjUtNC41LTQuNXptMi41IDVoLTV2LTFoNXYxem0tNi41MjcgNC41OTNjLTEuMTA4IDEuMDg2LTIuMjc1IDIuMjE5LTMuNDczIDMuNDA3LTYuNDMtNi4zODEtMTItMTEuMTQ3LTEyLTE1LjgwOCAwLTYuNzY5IDguODUyLTguMzQ2IDEyLTIuOTQ0IDMuMTI1LTUuMzYyIDEyLTMuODQ4IDEyIDIuOTQ0IDAgLjc0Ni0uMTU2IDEuNDk2LS40MjMgMi4yNTMtMS4xMTYtLjkwMi0yLjUzNC0xLjQ0NS00LjA3Ny0xLjQ0NS0zLjU4NCAwLTYuNSAyLjkxNi02LjUgNi41IDAgMi4wNjMuOTcgMy45MDEgMi40NzMgNS4wOTN6Ii8+PC9zdmc+";
      li.appendChild(removeFromFavsButton);
      arrFromLS.some((item) => {
        if (item.recipe.uri === arrItem.recipe.uri) {
          addToFavsButton.classList.add("hidden");
          removeFromFavsButton.classList.remove("hidden");
        }
      });
      addToFavsButton.onclick = () => {
        addFavToLocalStorage(arrItem);
        addToFavsButton.classList.add("hidden");
        removeFromFavsButton.classList.remove("hidden");
      };
      removeFromFavsButton.onclick = () => {
        removeFavFromLocalStorage(arrItem);
        if (listType === "favsList") {
          li.style.display = "none";
          // If you delete the last element this changes the list header and adds the return button.
          if (JSON.parse(localStorage.getItem("favorites")).length === 0) {
            listHeader.innerText = "Nothing to show :/";
            const getBackButton = document.createElement("button");
            getBackButton.classList.add("button", "button-get-back");
            getBackButton.innerText = "Return";
            mainSection.appendChild(getBackButton);
            getBackButton.onclick = () => {
              runner();
            };
          }
        } else {
          removeFromFavsButton.classList.add("hidden");
          addToFavsButton.classList.remove("hidden");
        }
      };
    };

    addFavButton();

    //Inserting the li with the recipe description into the list.
    recipeList.appendChild(li);
  };
  const fillSearchResultsList = async () => {
    if (input.value) {
      recipeList.innerHTML = "";
      const searchResultsArr = await fetchSearchData();

      // Itterating through the fetched search results and creating the li's for the search_results list.

      if (searchResultsArr.length > 0) {
        searchResultsArr
          .sort(() => (Math.random() > 0.5 ? 1 : -1))
          .forEach((el) => {
            createListItems(el, "searchResultsList");
          });
      } else {
        listHeader.innerText = `No results for "${input.value}" :(`;
      }
    }
  };

  const fillFavoritesList = () => {
    listHeader.innerText = "Your saved dishes:";
    recipeList.innerHTML = "";
    const arrFromLS = JSON.parse(localStorage.getItem("favorites"));

    if (arrFromLS) {
      if (arrFromLS.length !== 0) {
        arrFromLS.forEach((el) => {
          createListItems(el, "favsList");
        });
      } else {
        console.log("empty!");
      }
    }
  };

  const showHideFavButton = (arrFromLS) => {
    if (!arrFromLS || arrFromLS.length === 0) {
      favsButton.classList.add("hidden");
    } else {
      favsButton.classList.remove("hidden");
    }
  };

  const showSuggestion = async () => {
    const now = new Date(),
      hour = now.getHours();
    const morning = hour >= 4 && hour <= 11,
      afternoon = hour >= 12 && hour <= 16,
      evening = hour >= 17 && hour <= 20,
      night = hour >= 21 || hour <= 3;

    const suggestionURL = `${GET_URL}&q=_&cuisineType=british&dishType=Main course&mealType=`;
    const suggestionTitle = document.createElement("h1");

    let response;
    let welcomeString;
    if (morning) {
      response = await fetch(suggestionURL + "Breakfast");
      welcomeString = "Good Morning! Some breakfast ideas!";
    } else if (afternoon) {
      response = await fetch(suggestionURL + "Lunch");
      welcomeString = "Lunchtime! Up for a snack?!";
    } else if (evening) {
      response = await fetch(suggestionURL + "Dinner");
      welcomeString = "Good Evening! Here some Dinner ideas for you!";
    } else if (night) {
      response = await fetch(suggestionURL + "Snack");
      welcomeString =
        "Still awake at this hour?! Here some snack suggestions for you!";
    }
    listHeader.classList.add("welcome-header");
    listHeader.innerText = welcomeString;
    mainSection.prepend(listHeader);
    const result = await response.json();
    const suggestionArr = result.hits;
    console.log(suggestionArr);

    // Itterating through the fetched search results and creating the li's for the search_results list.

    suggestionArr.forEach((el) => {
      createListItems(el, "searchResultsList");
    });
  };
  headerHider();
  createLocalStorageArrayOfFavs();
  showSuggestion();
  showHideFavButton(JSON.parse(localStorage.getItem("favorites")));
  headerLogo.onclick = runner;
  searchButton.onclick = () => fillSearchResultsList();
  favsButton.onclick = () => fillFavoritesList();
};

runner();
