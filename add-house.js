const API = "https://house-rental-system-backend.onrender.com";

const list = document.getElementById("house-list");

// Save / Update
function saveHouse() {
    const id = document.getElementById("houseId").value;

    const house = {
        title: document.getElementById("title").value,
        location: document.getElementById("location").value,
        price: document.getElementById("price").value,
        bhk: document.getElementById("bhk").value,
        description: document.getElementById("description").value,
    };

    if (id) {
        // UPDATE
        fetch(`${API}/update-house/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(house)
        })
        .then(() => {
            alert("Updated!");
            resetForm();
            loadHouses();
        });
    } else {
        // CREATE
        fetch(`${API}/add-house`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(house)
        })
        .then(() => {
            alert("Added!");
            resetForm();
            loadHouses();
        });
    }
}

// Load houses
function loadHouses() {
    fetch(`${API}/houses`)
    .then(res => res.json())
    .then(data => displayHouses(data));
}

// Display with edit/delete
function displayHouses(houses) {
    list.innerHTML = "";

    houses.forEach(h => {
        list.innerHTML += `
        <div class="card">
            <h3>${h.title}</h3>
            <p>${h.location}</p>
            <p>₹${h.price}</p>
            <p>${h.bhk}</p>

            <button onclick="editHouse('${h._id}', '${h.title}', '${h.location}', '${h.price}', '${h.bhk}', '${h.description}')">Edit</button>
            <button onclick="deleteHouse('${h._id}')">Delete</button>
        </div>
        `;
    });
}

// Edit
function editHouse(id, title, location, price, bhk, description) {
    document.getElementById("houseId").value = id;
    document.getElementById("title").value = title;
    document.getElementById("location").value = location;
    document.getElementById("price").value = price;
    document.getElementById("bhk").value = bhk;
    document.getElementById("description").value = description;
}

// Delete
function deleteHouse(id) {
    fetch(`${API}/delete-house/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        alert("Deleted!");
        loadHouses();
    });
}

// Reset form
function resetForm() {
    document.getElementById("houseId").value = "";
    document.querySelector("form")?.reset();
}

// Start
loadHouses();