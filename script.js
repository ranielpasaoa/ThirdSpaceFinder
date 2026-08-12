// yall pls do not vibe code we tryna follow the rules




const searchBar = document.getElementById("searchBar");
const homeContent = document.querySelector("#homeContent");
const searchResults = document.querySelector("#searchResults");

searchBar.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchThirdSpaces();
    }
});

const maxResult = 50;

async function searchThirdSpaces() {
    const searchText = searchBar.value.trim();
    let query;

    if (searchText === "") {
        query = "?$limit=50";
    } else {
        query = "?$q=" + searchText;
    }

    homeContent.style.display = "none"; //hides the home page  
    searchResults.style.display = "block"; //shows search results page
    searchResults.innerHTML = "";

    //Parks
    const parkResponse = await fetch(parkAPI + query);
    const parks = await parkResponse.json();
    parks.forEach(function(park) {
        const address = park.address || [park.building, park.street].filter(Boolean).join(' ') || "No address available";
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${park.signname || "Unnamed Park"}</h3>
            <p>Type: Park</p>
            <p>Address: ${address}</p>
        </div>`;
    });


    //Pools
    const poolResponse = await fetch(poolAPI + query);
    const pools = await poolResponse.json();
    pools.forEach(function(pool) {
        const address = pool.address || [pool.building, pool.street].filter(Boolean).join(' ') || "No address available";
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${pool.name || "Unnamed Pool"}</h3>
            <p>Type: Pool</p>
            <p>Address: ${address}</p>
        </div>`;
    });

    //Museums
    const museumResponse = await fetch(museumAPI + query);
    const museums = await museumResponse.json();
    museums.forEach(function(museum) {
        const address = museum.address || [museum.building, museum.street].filter(Boolean).join(' ') || "No address available";
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${museum.name || "Unnamed Museum"}</h3>
            <p>Type: Museum</p>
            <p>Address: ${address}</p>
        </div>`;
    });

    //Restaurants
    const restaurantResponse = await fetch(restaurantAPI + query);
    const restaurants = await restaurantResponse.json();
    restaurants.forEach(function(restaurant) {
        const address = restaurant.address || [restaurant.building, restaurant.street].filter(Boolean).join(' ') || "No address available";
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${restaurant.dba || "Unnamed Restaurant"}</h3>
            <p>Type: Restaurant</p>
            <p>Address: ${address}</p>
        </div>`;
    });

    //Libraries
    const libraryResponse = await fetch(qplAPI + query);
    const libraries = await libraryResponse.json();
    libraries.forEach(function(library) {
        const address = library.address || [library.building, library.street].filter(Boolean).join(' ') || "No address available";
        searchResults.innerHTML += `<div class="resultCard"> 
            <h3>${library.name || "Unnamed Library"}</h3>
            <p>Type: Library</p>
            <p>Address: ${address}</p>
        </div>`;
    });
}