const API = "http://localhost:3000";

// Load houses
function loadHouses() {
    fetch(`${API}/houses`)
    .then(res => res.json())
    .then(data => showHouses(data));
}

// Show houses
function showHouses(houses) {
    const list = document.getElementById("house-list");
    list.innerHTML = "";

    houses.forEach(house => {
        list.innerHTML += `
        <div class="card">
            <h3>${house.title}</h3>
            <p><b>Location:</b> ${house.location}</p>
            <p><b>Price:</b> ₹${house.price}</p>
            <p>${house.description}</p>

            <button class="edit-btn" onclick="editHouse(${house.id}, '${house.title}', '${house.location}', ${house.price}, '${house.description}')">
                Edit
            </button>

            <button class="delete-btn" onclick="deleteHouse(${house.id})">
                Delete
            </button>
        </div>
        `;
    });
}

// Save (Create or Update)
function saveHouse() {
    const bhk = document.getElementById("bhk").value;

    const data = {
        title: title.value,
        location: location.value,
        price: price.value,
        description: description.value
    };

    if (id === "") {
        // CREATE
        fetch(`${API}/add-house`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            clearForm();
            loadHouses();
        });
    } else {
        // UPDATE
        fetch(`${API}/update-house/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            clearForm();
            loadHouses();
            document.getElementById("form-title").innerText = "Add New House";
        });
    }
}

// Edit
function editHouse(id, titleVal, locationVal, priceVal, descVal) {
    document.getElementById("houseId").value = id;
    title.value = titleVal;
    location.value = locationVal;
    price.value = priceVal;
    description.value = descVal;

    document.getElementById("form-title").innerText = "Update House";
}

// Delete
function deleteHouse(id) {
    fetch(`${API}/delete-house/${id}`, {
        method: "DELETE"
    }).then(() => loadHouses());
}

// Clear form
function clearForm() {
    document.getElementById("houseId").value = "";
    title.value = "";
    location.value = "";
    price.value = "";
    description.value = "";
}

// Start
loadHouses();