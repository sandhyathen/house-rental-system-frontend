const API = "https://house-rental-system-backend.onrender.com";

const list = document.getElementById("house-list");

// Load houses
function loadHouses() {
    fetch(`${API}/houses`)
    .then(res => res.json())
    .then(data => displayHouses(data))
    .catch(err => console.log(err));
}

// Display houses
function displayHouses(houses) {
    list.innerHTML = "";

    if (houses.length === 0) {
        list.innerHTML = "<h3>No houses available</h3>";
        return;
    }

    houses.forEach(h => {
        list.innerHTML += `
        <div class="card">
            <h3>${h.title}</h3>
            <p>${h.location}</p>
            <p>₹${h.price}</p>
            <p><b>${h.bhk || "N/A"}</b></p>
        </div>
        `;
    });
}

// Start
loadHouses();