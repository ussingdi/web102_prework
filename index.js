/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// Add search functionality
function searchGames(searchTerm) {
  deleteChildElements(gamesContainer);
  const filteredGames = GAMES_JSON.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  addGamesToPage(filteredGames);
}

// Enhance the game card creation with hover effects and more details
function addGamesToPage(games) {
  for (let game of games) {
    const gameCard = document.createElement("div");
    gameCard.classList.add("game-card");
    
    // Calculate funding percentage
    const fundingPercentage = Math.round((game.pledged / game.goal) * 100);
    
    gameCard.innerHTML = `
      <img src="${game.img}" class="game-img" />
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <div class="game-details">
        <p>Backers: ${game.backers.toLocaleString()}</p>
        <p>Pledged: $${game.pledged.toLocaleString()}</p>
        <p>Goal: $${game.goal.toLocaleString()}</p>
        <div class="progress-bar">
          <div class="progress" style="width: ${Math.min(fundingPercentage, 100)}%"></div>
        </div>
        <p>${fundingPercentage}% Funded</p>
      </div>
    `;

    // Add hover effect
    gameCard.addEventListener('mouseenter', () => {
      gameCard.style.transform = 'scale(1.02)';
      gameCard.style.transition = 'transform 0.2s ease';
    });
    
    gameCard.addEventListener('mouseleave', () => {
      gameCard.style.transform = 'scale(1)';
    });

    gamesContainer.appendChild(gameCard);
  }
}

// create a function that adds all data from the games array to the page
// function addGamesToPage(games) {
//   // loop over each item in the data
//   for (let game of games) {
//     // create a new div element, which will become the game card
//     const gameCard = document.createElement("div");

//     // add the class game-card to the list
//     gameCard.classList.add("game-card");

//     // set the inner HTML using a template literal to display some info
//     // about each game
//     // TIP: if your images are not displaying, make sure there is space
//     // between the end of the src attribute and the end of the tag ("/>")
//     gameCard.innerHTML = `
//             <img src="${game.img}" class="game-img" />
//             <h3>${game.name}</h3>
//             <p>${game.description}</p>
//         `;

//     // append the game to the games-container
//     gamesContainer.appendChild(gameCard);
//   }
// }

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

// Create and add search input
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search games...';
searchInput.classList.add('search-input');
document.querySelector('#button-container').prepend(searchInput);

searchInput.addEventListener('input', (e) => {
  searchGames(e.target.value);
});

// Add sorting functionality
function sortGames(criteria) {
  deleteChildElements(gamesContainer);
  const sortedGames = [...GAMES_JSON].sort((a, b) => {
    switch(criteria) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'pledged':
        return b.pledged - a.pledged;
      case 'backers':
        return b.backers - a.backers;
      default:
        return 0;
    }
  });
  addGamesToPage(sortedGames);
}

// Create and add sort buttons
const sortContainer = document.createElement('div');
sortContainer.classList.add('sort-container');
sortContainer.innerHTML = `
  <label>Sort by: </label>
  <button onclick="sortGames('name')">Name</button>
  <button onclick="sortGames('pledged')">Most Funded</button>
  <button onclick="sortGames('backers')">Most Backers</button>
`;
document.querySelector('#button-container').appendChild(sortContainer);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const contributions = GAMES_JSON.reduce(
  (total, game) => total + game.backers,
  0
);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${contributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// set inner HTML using template literal
raisedCard.innerHTML = `$${GAMES_JSON.reduce(
  (total, game) => total + game.pledged,
  0
).toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const games = GAMES_JSON.length;
gamesCard.innerHTML = `${games}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have not yet met their goal
  const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);

  // use the function we previously created to add the unfunded games to the DOM
  addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
  deleteChildElements(gamesContainer);

  // use filter() to get a list of games that have met or exceeded their goal
  const fundedGames = GAMES_JSON.filter((game) => game.pledged >= game.goal);

  // use the function we previously created to add unfunded games to the DOM
  addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
  deleteChildElements(gamesContainer);

  // add all games from the JSON data to the DOM
  addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numUnfunded = GAMES_JSON.filter(
  (game) => game.pledged < game.goal
).length;

// create a string that explains the number of unfunded games using the ternary operator
const unfundedString = numUnfunded === 1 ? "game are" : "games are";

// create a new DOM element containing the template string and append it to the description container
const descriptionParagraph = document.createElement("p");
descriptionParagraph.innerHTML = `The purpose of our company is to fund independent games. We've been in operation for 12 years. Currently, ${numUnfunded} ${unfundedString} still unfunded.`;
descriptionContainer.appendChild(descriptionParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
  return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameName = document.createElement("p");
firstGameName.innerHTML = firstGame.name;
firstGameContainer.appendChild(firstGameName);

// do the same for the runner up item

const secondGameName = document.createElement("p");
secondGameName.innerHTML = secondGame.name;
secondGameContainer.appendChild(secondGameName);

//do anything optioanl in this app
