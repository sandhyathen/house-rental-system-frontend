const API = "https://house-rental-system-backend.onrender.com";

const list = document.getElementById("house-list");
const filter = document.getElementById("bhkFilter");

// Normalize (fix space issue)
function normalize(val) {
    return val ? val.replace(/\s/g, "").toLowerCase() : "";
}

// Load houses
function loadHouses() {
    fetch(`${API}/houses`)
    .then(res => res.json())
    .then(data => displayHouses(data));
}

// Display houses
function displayHouses(houses) {
    list.innerHTML = "";

    if (houses.length === 0) {
        list.innerHTML = "<h3>No houses found</h3>";
        return;
    }

    houses.forEach(h => {
        list.innerHTML += `
        <div class="card">
            <h3>${h.title}</h3>
            <p>${h.location}</p>
            <p>₹${h.price}</p>
            <p><b>${h.bhk}</b></p>
        </div>
        `;
    });
}

// Filter
filter.addEventListener("change", () => {
    fetch(`${API}/houses`)
    .then(res => res.json())
    .then(data => {
        if (filter.value === "") {
            displayHouses(data);
        } else {
            const selected = normalize(filter.value);

            const filtered = data.filter(h =>
                normalize(h.bhk) === selected
            );

            displayHouses(filtered);
        }
    });
});

// Start
loadHouses();