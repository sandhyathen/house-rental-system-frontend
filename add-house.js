const API = "https://house-rental-system-backend.onrender.com";
const list = document.getElementById("house-list");
const houseForm = document.getElementById("house-form"); // Ensure your <form> has this ID

/**
 * Save or Update House
 * @param {Event} e - The form submission event
 */
async function saveHouse(e) {
    if (e) e.preventDefault(); // Prevents page reload

    const id = document.getElementById("houseId").value;
    
    // Gather data and ensure numbers are treated as numbers
    const house = {
        title: document.getElementById("title").value.trim(),
        location: document.getElementById("location").value.trim(),
        price: Number(document.getElementById("price").value),
        bhk: document.getElementById("bhk").value.trim(),
        description: document.getElementById("description").value.trim(),
    };

    // Simple validation: don't send empty data
    if (!house.title || !house.price) {
        alert("Please fill in at least the Title and Price.");
        return;
    }

    const url = id ? `${API}/update-house/${id}` : `${API}/add-house`;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(house)
        });

        if (!response.ok) throw new Error("Network response was not ok");

        alert(id ? "✅ House Updated!" : "✅ House Added!");
        resetForm();
        loadHouses();
    } catch (error) {
        console.error("Error saving house:", error);
        alert("❌ Failed to save. Check console for details.");
    }
}

/**
 * Load all houses from API
 */
async function loadHouses() {
    try {
        const res = await fetch(`${API}/houses`);
        const data = await res.json();
        displayHouses(data);
    } catch (err) {
        console.error("Error loading houses:", err);
    }
}

/**
 * Render houses to the DOM
 */
function displayHouses(houses) {
    if (!list) return;
    list.innerHTML = "";

    houses.forEach(h => {
        // Use data attributes to make editing cleaner and safer
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${h.title}</h3>
            <p><strong>Location:</strong> ${h.location}</p>
            <p><strong>Price:</strong> ₹${h.price}</p>
            <p><strong>BHK:</strong> ${h.bhk}</p>
            <div class="actions">
                <button onclick="editHouse('${h._id}', '${h.title}', '${h.location}', '${h.price}', '${h.bhk}', '${h.description}')">Edit</button>
                <button class="delete-btn" onclick="deleteHouse('${h._id}')">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

/**
 * Fill form for editing
 */
function editHouse(id, title, location, price, bhk, description) {
    document.getElementById("houseId").value = id;
    document.getElementById("title").value = title;
    document.getElementById("location").value = location;
    document.getElementById("price").value = price;
    document.getElementById("bhk").value = bhk;
    document.getElementById("description").value = description;
    
    // Scroll to form so user sees they are editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Delete a house
 */
async function deleteHouse(id) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
        const res = await fetch(`${API}/delete-house/${id}`, { method: "DELETE" });
        if (res.ok) {
            alert("Deleted!");
            loadHouses();
        }
    } catch (err) {
        console.error("Error deleting:", err);
    }
}

/**
 * Reset form state
 */
function resetForm() {
    document.getElementById("houseId").value = "";
    if (houseForm) {
        houseForm.reset();
    } else {
        // Fallback if form ID isn't set
        document.querySelectorAll("input, textarea").forEach(el => el.value = "");
    }
}

// Initialize
loadHouses();
