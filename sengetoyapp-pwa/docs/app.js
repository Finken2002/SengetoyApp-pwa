let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

function saveRooms() {
  localStorage.setItem("rooms", JSON.stringify(rooms));
}

function renderRooms() {
  const tbody = document.querySelector("#roomsTable tbody");
  tbody.innerHTML = "";

  rooms.forEach((room, index) => {
    const tr = document.createElement("tr");

    // Romnummer
    tr.innerHTML += `<td>${room.number}</td>`;

    // Navn
    tr.innerHTML += `<td>${room.name || ""}</td>`;

    // Intervall
    tr.innerHTML += `<td>${room.interval ?? 14}</td>`;

    // Sist skiftet
    tr.innerHTML += `<td>${room.lastChanged || "-"}</td>`;

    // Neste
    let next = "-";
    if (room.lastChanged) {
      const nextDate = new Date(room.lastChanged);
      nextDate.setDate(nextDate.getDate() + parseInt(room.interval ?? 14));
      next = nextDate.toISOString().split("T")[0];
    }
    tr.innerHTML += `<td>${next}</td>`;

    // Notat (redigerbar)
    tr.innerHTML += `
      <td>
        <input 
          type="text" 
          value="${room.note || ""}" 
          onchange="updateNote(${index}, this.value)" 
          placeholder="Skriv notat..."
        />
      </td>`;

    // Handlinger
    tr.innerHTML += `
      <td>
        <button onclick="markChanged(${index}, 0)">Skiftet i dag</button>
        <button onclick="markChanged(${index}, -1)">Skiftet i går</button>
        <button onclick="markEarlier(${index})">Skiftet tidligere</button>
        <button onclick="deleteRoom(${index})">Slett</button>
      </td>`;

    tbody.appendChild(tr);
  });
}

// Legg til nytt rom fra inputfeltene
function addRoom() {
  const numberInput = document.getElementById("roomNumber");
  const nameInput   = document.getElementById("roomName");
  const noteInput   = document.getElementById("roomNote");
  const intervalInp = document.getElementById("intervalDays");

  const number  = numberInput.value.trim();
  const name    = nameInput.value.trim();
  const note    = noteInput.value.trim();
  const interval = parseInt(intervalInp.value, 10);
  const days    = Number.isFinite(interval) && interval > 0 ? interval : 14;

  if (!number) {
    alert("Romnummer må fylles ut.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  rooms.push({
    number,
    name,
    note,
    interval: days,
    lastChanged: today
  });
  saveRooms();
  renderRooms();

  // Tøm felter
  numberInput.value = "";
  nameInput.value   = "";
  noteInput.value   = "";
  intervalInp.value = "";
}


// Marker at det ble skiftet (offset = 0 for i dag, -1 for i går)
function markChanged(index, offset) {
  const today = new Date();
  today.setDate(today.getDate() + offset);
  rooms[index].lastChanged = today.toISOString().split("T")[0];
  saveRooms();
  renderRooms();
}

// Marker tidligere dato
function markEarlier(index) {
  const dateStr = prompt("Hvilken dato ble det skiftet? (yyyy-mm-dd)");
  if (!dateStr) return;

  const parsed = new Date(dateStr);
  if (!isNaN(parsed)) {
    rooms[index].lastChanged = parsed.toISOString().split("T")[0];
    saveRooms();
    renderRooms();
  } else {
    alert("Ugyldig datoformat. Bruk yyyy-mm-dd.");
  }
}

// Slett rom
function deleteRoom(index) {
  if (confirm("Er du sikker på at du vil slette dette rommet?")) {
    rooms.splice(index, 1);
    saveRooms();
    renderRooms();
  }
}

// Oppdater notat
function updateNote(index, value) {
  rooms[index].note = value;
  saveRooms();
}

// Start når siden lastes
window.onload = renderRooms;
