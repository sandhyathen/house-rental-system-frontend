const API = "https://house-rental-system-backend.onrender.com";
const list = document.getElementById("house-list");

// 1. LOAD HOUSES
async function loadHouses() {
    try {
        const res = await fetch(`${API}/houses`);
        const data = await res.json();
        displayHouses(data);
    } catch (err) {
        console.error("Failed to load houses:", err);
    }
}

// 2. SAVE OR UPDATE
async function saveHouse() {
    const id = document.getElementById("houseId").value;
    const saveBtn = document.getElementById("saveBtn");

    const house = {
        title: document.getElementById("title").value,
        location: document.getElementById("location").value,
        price: document.getElementById("price").value,
        bhk: document.getElementById("bhk").value,
        description: document.getElementById("description").value,
    };

    // Simple Validation
    if (!house.title || !house.price || !house.bhk) {
        alert("Please fill in Title, Price, and BHK");
        return;
    }

    saveBtn.innerText = "Processing...";
    saveBtn.disabled = true;

    const url = id ? `${API}/update-house/${id}` : `${API}/add-house`;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(house)
        });

        if (response.ok) {
            alert(id ? "House Updated Successfully!" : "House Added Successfully!");
            resetForm();
            loadHouses();
        } else {
            alert("Server error. Check backend logs.");
        }
    } catch (err) {
        console.error("Save error:", err);
        alert("Could not connect to server.");
    } finally {
        saveBtn.innerText = "Save House";
        saveBtn.disabled = false;
    }
}

// 3. DISPLAY HOUSES
function displayHouses(houses) {
    list.innerHTML = "";
    if (houses.length === 0) {
        list.innerHTML = "<p>No houses found.</p>";
        return;
    }

    houses.forEach(h => {
        list.innerHTML += `
        <div class="card">
            <h3>${h.title}</h3>
            <p>📍 ${h.location}</p>
            <p>💰 ₹${h.price}</p>
            <p>🏠 ${h.bhk}</p>
            <p>${h.description || ""}</p>
            <div style="margin-top:10px;">
                <button onclick="editHouse('${h._id}', '${h.title}', '${h.location}', '${h.price}', '${h.bhk}', '${h.description}')" style="background: orange;">Edit</button>
                <button onclick="deleteHouse('${h._id}')" style="background: red;">Delete</button>
            </div>
        </div>
        `;
    });
}

// 4. EDIT MODE
function editHouse(id, title, location, price, bhk, description) {
    document.getElementById("houseId").value = id;
    document.getElementById("title").value = title;
    document.getElementById("location").value = location;
    document.getElementById("price").value = price;
    document.getElementById("bhk").value = bhk;
    document.getElementById("description").value = description;

    document.getElementById("saveBtn").innerText = "Update House";
    document.getElementById("cancelBtn").style.display = "inline-block";
    window.scrollTo(0, 0);
}

// 5. DELETE
async function deleteHouse(id) {
    if (!confirm("Are you sure you want to delete this house?")) return;

    try {
        await fetch(`${API}/delete-house/${id}`, { method: "DELETE" });
        loadHouses();
    } catch (err) {
        console.error("Delete error:", err);
    }
}

// 6. RESET
function resetForm() {
    document.getElementById("houseId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("location").value = "";
    document.getElementById("price").value = "";
    document.getElementById("bhk").value = "";
    document.getElementById("description").value = "";
    
    document.getElementById("saveBtn").innerText = "Save House";
    document.getElementById("cancelBtn").style.display = "none";
}

// Start app
loadHouses();