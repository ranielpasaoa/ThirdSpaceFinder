// ===============
// Variable Declaration
// ===============

const slider = document.getElementById("slider");
let maxResult = 50;

const addressBar = document.getElementById("UserAddress");
const rightSide = document.querySelector(".rightside");

const searchBar = document.getElementById("searchBar");
const homeContent = document.querySelector("#homeContent");
const searchResults = document.querySelector("#searchResults");

// ===============
// Event Listeners
// ===============

searchBar.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchThirdSpaces();
    }
});

slider.addEventListener("input", function() {
    maxResult = Number(slider.value);
});

addressBar.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        locationFilter();
    }
});

// ===============
// Filter function
// ===============

const filterButton = document.querySelector("#filterButton");
const filterMenu = document.querySelector("#filterMenu");

filterButton.onclick = function() {
    if (filterMenu.style.display === "block") {
        filterMenu.style.display = "none";
    } else {
        filterMenu.style.display = "block";
    }
};

const filterOptions = document.querySelectorAll(".filterOption");

filterOptions.forEach(function(option) {
    option.onclick = function() {
        const checkbox = option.querySelector(".checkbox");

        if (checkbox.innerHTML === "☐") {
            checkbox.innerHTML = "☑";
        } else {
            checkbox.innerHTML = "☐";
        }

        filterResults();
    };
});

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

// ===============
// API search function
// ===============

async function consolidatesearch(apitype, queryinpt, typeName, typeField) {
    const response = await fetch(apitype + queryinpt);
    const types = await response.json();
    let returnArray = [];

    types.forEach(function(type) {
        const address =
            type.address ||
            [type.building, type.street].filter(Boolean).join(" ") ||
            type.location ||
            type.address1 ||
            type.adress1 ||
            "No address available";

        returnArray.push(`
            <div class="resultCard">
                <h3>${type[typeField] || "Unnamed Location"}</h3>
                <p>Type: ${typeName}</p>
                <p>Location: ${address}</p>
            </div>
        `);
    });

    return returnArray.join("");
}

// ===============
// Search function
// ===============

async function searchThirdSpaces() {
    const searchText = searchBar.value.trim();
    let query;

    if (searchText === "") {
        query = "?$limit=" + Math.floor(maxResult / 5);
    } else {
        query = '?$q=' + encodeURIComponent(searchText) + "&$limit=" + Math.floor(maxResult / 5);
    }

    homeContent.style.display = "none";
    searchResults.style.display = "block";
    searchResults.innerHTML = "";

    searchResults.innerHTML += await consolidatesearch(parkAPI,query,"Park","signname");
    searchResults.innerHTML += await consolidatesearch(poolAPI,query,"Pool","name");
    searchResults.innerHTML += await consolidatesearch(museumAPI,query,"Museum","name");
    searchResults.innerHTML += await consolidatesearch(restaurantAPI,query,"Restaurant","dba");
    searchResults.innerHTML += await consolidatesearch(qplAPI,query,"Library","name");
}

// ================
// Nearby Locations
// ================

async function locationFilter() {
    const address = addressBar.value.trim();

    rightSide.innerHTML = `
        <p>Finding places near you...</p>
    `;
        const locationResponse = await fetch(
            "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
            encodeURIComponent(address)
        );

        const locationData = await locationResponse.json();

        if (locationsToShow.length === 0) {
            rightSide.innerHTML = `
                <p>No nearby locations found.</p>
            `;
        }

        const userLatitude = parseFloat(locationData[0].lat);
        const userLongitude = parseFloat(locationData[0].lon);

        const nearbyLocations = [];

        await getNearbyLocations(parkAPI,"Park","signname",userLatitude,userLongitude,nearbyLocations);
        await getNearbyLocations(poolAPI,"Pool","name",userLatitude,userLongitude,nearbyLocations);
        await getNearbyLocations(museumAPI,"Museum","name",userLatitude,userLongitude,nearbyLocations);
        await getNearbyLocations(restaurantAPI,"Restaurant","dba",userLatitude,userLongitude,nearbyLocations);
        await getNearbyLocations(qplAPI, "Library", "name", userLatitude, userLongitude, nearbyLocations);

        nearbyLocations.sort(function(a, b) {
            return a.distance - b.distance;
        });

        const locationsToShow = nearbyLocations.slice(0, maxResult);

        rightSide.innerHTML = "";

        locationsToShow.forEach(function(location) {
            rightSide.innerHTML += `
                <div class="rcard">
                    <h3>${location.name}</h3>
                    <p>Type: ${location.type}</p>
                    <p>Distance: ${location.distance.toFixed(2)} miles</p>
                    <p>Location: ${location.address}</p>
                </div>
            `;
        });

        if (locationsToShow.length === 0) {
            rightSide.innerHTML = `
                <p>No nearby locations found.</p>
            `;
        }
}


async function getNearbyLocations(api,typeName,nameField,userLatitude,userLongitude,nearbyLocations) {
        const response = await fetch(api + "?$limit=2");
        const locations = await response.json();

        locations.forEach(function(location) {
            const latitude = parseFloat(
                location.latitude ||
                location.lat ||
                location.y
            );

            const longitude = parseFloat(
                location.longitude || location.lon || location.lng || location.x);
            
            if (isNaN(latitude) || isNaN(longitude)) {
                return;
            }
            
            const distance = calculateDistance(userLatitude,userLongitude,latitude,longitude);

            const address =
                location.address ||
                [location.building, location.street]
                    .filter(Boolean)
                    .join(" ") ||
                location.location ||
                location.address1 ||
                location.adress1 ||
                "No address available";

            nearbyLocations.push({
                name: location[nameField] || "Unnamed Location",
                type: typeName,
                address: address,
                distance: distance
            });
        });
}

function calculateDistance(lat1,lon1,lat2,lon2) {
    const earthRadius = 3958.8;

    const latDifference = (lat2 - lat1) * Math.PI / 180;

    const lonDifference = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(latDifference / 2) *
        Math.sin(latDifference / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(lonDifference / 2) *
        Math.sin(lonDifference / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}
