const API = "https://house-rental-system-backend.onrender.com";

const defaultHouses = [
    {
        id: 1,
        title: "Modern Apartment",
        location: "Bangalore",
        price: 15000,
        description: "2BHK modern apartment"
    },
    {
        id: 2,
        title: "Family House",
        location: "Mysore",
        price: 10000,
        description: "Perfect for families"
    },
    {
        id: 3,
        title: "Small Flat",
        location: "Chennai",
        price: 8000,
        description: "1BHK small apartment",
    }
];

// Load houses
function loadHouses() {
    fetch(`${API}/houses`)
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            displayHouses(defaultHouses);
        } else {
            displayHouses(data);
        }
    })
    .catch(() => displayHouses(defaultHouses));
}

// Display
function displayHouses(houses) {
    const list = document.getElementById("house-list");
    list.innerHTML = "";

    houses.forEach(h => {
        list.innerHTML += `
        <div class="card">
            <h3>${h.title}</h3>
            <p>${h.location}</p>
            <p>₹${h.price}</p>
            <p>${h.description}</p>

            ${h.id ? `
            <button class="edit-btn" onclick="editHouse(${h.id}, '${h.title}', '${h.location}', ${h.price}, '${h.description}', '${h.image}')">Edit</button>
            <button class="delete-btn" onclick="deleteHouse(${h.id})">Delete</button>
            ` : ""}
        </div>
        `;
    });
}

// Save
function saveHouse() {
    if (!title.value || !location.value || !price.value) {
        alert("Fill all fields!");
        return;
    }

    const id = houseId.value;

    const data = {
        title: title.value,
        location: location.value,
        price: price.value,
        image: image.value,
        description: description.value
    };

    if (id === "") {
        fetch(`${API}/add-house`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        }).then(() => {
            clearForm();
            loadHouses();
        });
    } else {
        fetch(`${API}/update-house/${id}`, {
            method: "PUT",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(data)
        }).then(() => {
            clearForm();
            loadHouses();
        });
    }
}

// Edit
function editHouse(id, t, l, p, d, img) {
    houseId.value = id;
    title.value = t;
    location.value = l;
    price.value = p;
    description.value = d;
    image.value = img;
}

// Delete
function deleteHouse(id) {
    fetch(`${API}/delete-house/${id}`, {
        method: "DELETE"
    }).then(loadHouses);
}

// Clear
function clearForm() {
    houseId.value = "";
    title.value = "";
    location.value = "";
    price.value = "";
    description.value = "";
    image.value = "";
}

// Search
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", () => {
        fetch(`${API}/houses`)
        .then(res => res.json())
        .then(data => {
            const filtered = data.filter(h =>
                h.location.toLowerCase().includes(searchInput.value.toLowerCase())
            );
            displayHouses(filtered);
        });
    });
}

// Start
loadHouses();