const fav = document.querySelector(".fav");
const ran = document.querySelector(".ran");
const display = document.querySelector(".display");
const search = document.querySelector("#search");
const searchBy = document.querySelector("#searchBy");
const mealDetailsContent = document.querySelector(".meal-details");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const close = document.querySelector(".close");

let favourite = [];

// add click event listener to parent element to get recipe
display.addEventListener("click", (event) => {
  // check if target element has btn-view class
  if (event.target.classList.contains("btn-view")) {
    // handle button click
    const parentElement = event.target.parentNode;
    let mealItem = parentElement.getAttribute("data_id");
    console.log(mealItem);

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem}`)
      .then((response) => response.json())
      .then((data) => {
        mealRecipeModal(data.meals);
      });
    openModal();
  }
});

const openModal = () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
//close the modal on esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
close.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

//handle optgroup
searchBy.addEventListener("change", () => {
  if (searchBy.value !== "ingredient" && searchBy.value !== "name") {
    search.disabled = true;
    search.value = "";
    search.placeholder = "";
    searchUpdate(searchBy.value, "");
  } else {
    if (searchBy.value == "name") {
      search.placeholder = "search a recipe";
    } else {
      search.placeholder = "search by an ingredient";
    }
  }
});

//handle single inputs
search.addEventListener("input", () => {
  console.log(searchBy.value, search.value);
  searchUpdate(searchBy.value, search.value);
});

//render the ui
function updateUI(meals) {
  meals = meals.slice(0, 10);
  let html = "";
  meals.map((meal) => {
    html =
      `<li>
      <div data_id="${meal.idMeal}" class="food-card">
        <div class="food-img-container">
          <img class="food-img" src="${meal.strMealThumb}" alt="food-image" />
        </div>
        <div class="food-details">
          <p class="title">${meal.strMeal}</p>
          <span onclick="toggle(this)" id="btnLove" class="btn-like ${
            favourite.includes(meal.idMeal) ? "liked" : ""
          }">
            <i class="fa-solid fa-heart"></i>
          </span>
        </div>
        <button class="btn-view">Get Recipe</button>
      </div>
    </li>` + html;
  });
  display.innerHTML = html;
}
//handle add/remove from favourites
function toggle(likeBtn) {
  const index = likeBtn.parentNode.parentNode.getAttribute("data_id");
  if (favourite.includes(index)) {
    const indexToRemove = favourite.indexOf(index);
    favourite.splice(indexToRemove, 1);
  } else {
    favourite.push(index);
  }
  // Update the favourite array in local storage
  localStorage.setItem("favourite", JSON.stringify(favourite));
  //render favourites
  likeBtn.classList.toggle("liked");
}
//handle random recipe output
function random() {
  fetch("https:www.themealdb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals;
      updateUI(meal);
    })
    .catch((err) => console.log(err));
}

function searchUpdate(catagory, searchVal) {
  if (catagory == "name") {
    link = `https:www.themealdb.com/api/json/v1/1/search.php?s=${searchVal}`;
  } else if (catagory == "ingredient") {
    link = `https:www.themealdb.com/api/json/v1/1/filter.php?i=${searchVal}`;
  } else {
    const optgroup = searchBy.options[searchBy.selectedIndex].parentNode;
    if (optgroup.tagName === "OPTGROUP") {
      const optgroupLabel = optgroup.label;

      if (optgroupLabel == "Catagory") {
        link = `https:www.themealdb.com/api/json/v1/1/filter.php?c=${catagory}`;
      }
      if (optgroupLabel == "Area") {
        link = `https:www.themealdb.com/api/json/v1/1/filter.php?a=${catagory}`;
      }
    }
  }

  fetch(link)
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals;
      updateUI(meal);
    })
    .catch((err) => {
      console.log("Not found");
    });
}
//random/favourite button
ran.addEventListener("click", random);
fav.addEventListener("click", (e) => {
  e.preventDefault();
  // Get the updated favourite array from local storage
  var arr = [];
  const favouriteJson = localStorage.getItem("favourite");
  favourite = JSON.parse(favouriteJson) || [];

  Promise.all(
    favourite.map((fav) => {
      const link = `https:www.themealdb.com/api/json/v1/1/lookup.php?i=${fav}`;
      return fetch(link)
        .then((response) => response.json())
        .then((data) => {
          arr.push(data.meals[0]);
        })
        .catch((err) => console.log(err));
    })
  ).then(() => {
    updateUI(arr);
  });
});

// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
  }
}

// create a modal
function mealRecipeModal(meal) {
  meal = meal[0];

  let html = `
      <h2 class = "recipe-title">${meal.strMeal}</h2>
      <p class = "recipe-category">${meal.strCategory}</p>
      <div class = "recipe-meal-img">
          <img class="meal-img" src = "${meal.strMealThumb}" alt = "">
      </div>
      <div class = "recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
      </div>
      
      <div class = "recipe-link">
          <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
      </div>
  `;
  console.log(html);
  mealDetailsContent.innerHTML = html;
  // mealDetailsContent.parentElement.classList.add("showRecipe");
}
