// yall pls do not vibe code we tryna follow the rules


const slider = document.getElementById('slider');
var maxResult = 50;

const addressBar = document.getElementById('AddressDropdown');

const searchBar = document.getElementById("searchBar");
const homeContent = document.querySelector("#homeContent");
const searchResults = document.querySelector("#searchResults");

searchBar.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchThirdSpaces();
    }
});

slider.onInput = (event) => {
    maxResult = slider.value;
}

// this is filter menu stuff
const filterButton = document.querySelector("#filterButton");
const filterMenu = document.querySelector("#filterMenu");
filterButton.onclick = function() {
    if (filterMenu.style.display === "block") {
        filterMenu.style.display = "none";
    } 
    else {
        filterMenu.style.display = "block";
    }
};
const filterOptions = document.querySelectorAll(".filterOption");
filterOptions.forEach(function(option) {
    option.onclick = function() {
        const checkbox = option.querySelector(".checkbox");
        if (checkbox.innerHTML === "☐") {
            checkbox.innerHTML = "☑";
        } 
        else {
            checkbox.innerHTML = "☐";
        }

        filterResults();
    };
});

async function locationFilter() {
    const locationCoords = await fetch(encodeURIcomponent(addressBar.value)+"&api_key=6a7cc180091fc728489452mrq696e23");
    
}

function filterResults() {
    const resultCards = document.querySelectorAll(".resultCard");
    let checkedTypes = [];
    filterOptions.forEach(function(option) {
        const checkbox = option.querySelector(".checkbox");
        if (checkbox && checkbox.innerHTML === "☑") {
            checkedTypes.push(option.dataset.type);
        }
    });
    resultCards.forEach(function(card) {
        if (checkedTypes.length === 0) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
            checkedTypes.forEach(function(type) {
                if (card.innerText.includes("Type: " + type)) {
                    card.style.display = "block";
                }
            });
        }
    });
}
//end of filter menu stuff

async function consolidatesearch(apitype, queryinpt, typeName, typeField) {
    const response = await fetch(apitype + queryinpt);
    const types = await response.json();
    let returnArray = [];

    types.forEach(function(type) {
        const address = type.address ||
            [type.building, type.street].filter(Boolean).join(' ') ||
            type.location || type.adress1 || "No address available";

        returnArray.push(`<div class="resultCard"> 
            <h3>${type[typeField] || "Unnamed Location"}</h3>
            <p>Type: ${typeName}</p>
            <p>Location: ${address}</p>
        </div>`);
    });
    return returnArray.join('');
}

async function searchThirdSpaces() {
    const searchText = searchBar.value.trim();
    let query;

    if (searchText === "") {
        query = "?$limit=" + Math.floor(maxResult/5);
    } 
    else {
        query = encodeURIcomponent(searchText) + "&$limit=3";
    }

    homeContent.style.display = "none"; //hides the home page  
    searchResults.style.display = "block"; //shows search results page
    searchResults.innerHTML = "";  

    searchResults.innerHTML += await consolidatesearch(parkAPI, query, "Park", "signname");
    searchResults.innerHTML += await consolidatesearch(poolAPI, query, "Pool", "name");
    searchResults.innerHTML += await consolidatesearch(museumAPI, query, "Museum", "name");
    searchResults.innerHTML += await consolidatesearch(restaurantAPI, query, "Restaurant", "dba");
    searchResults.innerHTML += await consolidatesearch(qplAPI, query, "Library", "name");
}