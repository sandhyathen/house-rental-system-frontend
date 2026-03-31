const API = "https://house-rental-system-backend.onrender.com";
const list = document.getElementById("house-list");
const houseIdInput = document.getElementById("houseId");

// Global variable to store houses locally once fetched
let allHouses = [];

/**
 * 1. LOAD HOUSES (Read)
 * Fetches data from MongoDB and stores it in the global array
 */
async function loadHouses() {
    try {
        const res = await fetch(`${API}/houses`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        allHouses = await res.json();
        displayHouses(allHouses);
    } catch (err) {
        console.error("Error loading houses:", err);
        list.innerHTML = `<p style="color:red;">Error connecting to server. Please try again later.</p>`;
    }
}

/**
 * 2. DISPLAY HOUSES
 * Renders the HTML cards. Uses the global array index for editing.
 */
function displayHouses(houses) {
    list.innerHTML = "";

    if (houses.length === 0) {
        list.innerHTML = "<p>No houses available at the moment.</p>";
        return;
    }

    houses.forEach((h) => {
        // We use the ID to reference the specific object in our global array
        list.innerHTML += `
        <div class="card">
            <h3>${h.title}</h3>
            <p><strong>📍 Location:</strong> ${h.location}</p>
            <p><strong>💰 Price:</strong> ₹${h.price}</p>
            <p><strong>🏠 BHK:</strong> ${h.bhk}</p>
            <p><em>${h.description || "No description provided"}</em></p>
            <div style="margin-top: 15px;">
                <button class="edit-btn" onclick="prepareEdit('${h._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteHouse('${h._id}')">Delete</button>
            </div>
        </div>
        `;
    });
}

/**
 * 3. SAVE / UPDATE (Create & Update)
 * Determines whether to POST or PUT based on the hidden ID field
 */
async function saveHouse() {
    const id = houseIdInput.value;
    const saveBtn = document.querySelector(".container button");

    const houseData = {
        title: document.getElementById("title").value.trim(),
        location: document.getElementById("location").value.trim(),
        price: document.getElementById("price").value,
        bhk: document.getElementById("bhk").value.trim(),
        description: document.getElementById("description").value.trim(),
    };

    // Validation
    if (!houseData.title || !houseData.price || !houseData.bhk) {
        alert("Title, Price, and BHK are required fields.");
        return;
    }

    // UI Feedback
    saveBtn.innerText = "Processing...";
    saveBtn.disabled = true;

    const url = id ? `${API}/update-house/${id}` : `${API}/add-house`;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(houseData)
        });

        if (response.ok) {
            alert(id ? "✅ House updated successfully!" : "✅ House added successfully!");
            resetForm();
            loadHouses();
        } else {
            const errorData = await response.json();
            alert("Error: " + (errorData.message || "Failed to save"));
        }
    } catch (err) {
        console.error("Save error:", err);
        alert("Server is currently unavailable. Please try again in 30 seconds.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = id ? "Update House" : "Save House";
    }
}

/**
 * 4. PREPARE EDIT
 * Populates the form with existing data when Edit is clicked
 */
function prepareEdit(id) {
    // Find the house in our local data so we don't have to call the API again
    const house = allHouses.find(h => h._id === id);

    if (house) {
        houseIdInput.value = house._id;
        document.getElementById("title").value = house.title;
        document.getElementById("location").value = house.location;
        document.getElementById("price").value = house.price;
        document.getElementById("bhk").value = house.bhk;
        document.getElementById("description").value = house.description || "";

        // Change UI to Update mode
        const saveBtn = document.querySelector(".container button");
        saveBtn.innerText = "Update House";
        saveBtn.style.background = "#f39c12"; // Orange for edit

        // Scroll to the top so user can see the filled form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * 5. DELETE
 */
async function deleteHouse(id) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
        const response = await fetch(`${API}/delete-house/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("House deleted.");
            loadHouses();
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete house.");
    }
}

/**
 * 6. RESET FORM
 */
function resetForm() {
    houseIdInput.value = "";
    document.getElementById("title").value = "";
    document.getElementById("location").value = "";
    document.getElementById("price").value = "";
    document.getElementById("bhk").value = "";
    document.getElementById("description").value = "";

    const saveBtn = document.querySelector(".container button");
    saveBtn.innerText = "Save House";
    saveBtn.style.background = "green";
}

// Initial call to load data when page opens
loadHouses();