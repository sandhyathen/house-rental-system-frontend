const API = "http://localhost:3000";

const list = document.getElementById("house-list");
const filter = document.getElementById("bhkFilter");

// Demo houses (fallback)
const demoHouses = [
    {
        title: "Modern Apartment",
        location: "Bangalore",
        price: 15000,
        bhk: "2BHK",
    },
    {
        title: "Family House",
        location: "Mysore",
        price: 10000,
        bhk: "3BHK",
    },
    {
        title: "Small Flat",
        location: "Chennai",
        price: 8000,
        bhk: "1BHK",
    }
];

// Normalize (fix space/case issues)
function normalize(val) {
    return val ? val.replace(/\s/g, "").toLowerCase() : "";
}

// Load houses
function loadHouses() {
    fetch(`${API}/houses`)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            displayHouses(demoHouses);
        } else {
            displayHouses(data);
        }
    })
    .catch(() => displayHouses(demoHouses));
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
            <p><b>Location:</b> ${h.location}</p>
            <p><b>Price:</b> ₹${h.price}</p>
            <p><b>${h.bhk}</b></p>
        </div>
        `;
    });
}

// Filter logic
filter.addEventListener("change", () => {
    fetch(`${API}/houses`)
    .then(res => res.json())
    .then(data => {
        let houses = data.length === 0 ? demoHouses : data;

        if (filter.value === "") {
            displayHouses(houses);
        } else {
            const selected = normalize(filter.value);

            const filtered = houses.filter(h => 
                normalize(h.bhk) === selected
            );

            displayHouses(filtered);
        }
    })
    .catch(() => {
        const selected = normalize(filter.value);

        const filtered = filter.value === ""
            ? demoHouses
            : demoHouses.filter(h => normalize(h.bhk) === selected);

        displayHouses(filtered);
    });
});

// Start
loadHouses();