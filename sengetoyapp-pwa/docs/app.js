let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");

function save() {
  localStorage.setItem("rooms", JSON.stringify(rooms));
  renderTable();
}

function addRoom() {
  const name = document.getElementById("roomName").value;
  const interval = parseInt(document.getElementById("intervalDays").value);
  const note = document.getElementById("note").value;

  if (!name || !interval) return alert("Fyll inn romnavn og intervall!");

  rooms.push({
    room: name,
    days: interval,
    lastChanged: today(),
    note: note
  });
  save();
}

function renderTable() {
  const tbody = document.getElementById("roomTable");
  tbody.innerHTML = "";
  rooms.forEach((r, i) => {
    const next = addDays(r.lastChanged, r.days);
    tbody.innerHTML += `
      <tr>
        <td>${r.room}</td>
        <td>${r.days}</td>
        <td>${r.lastChanged}</td>
        <td>${next}</td>
        <td>${r.note || ""}</td>
        <td>
          <button onclick="markChanged(${i},0)">Skiftet i dag</button>
          <button onclick="markChanged(${i},1)">Skiftet i går</button>
          <button onclick="markEarlier(${i})">Skiftet tidligere…</button>
          <button onclick="deleteRoom(${i})">Slett</button>
        </td>
      </tr>
    `;
  });
}

function markChanged(i, offset) {
  let d = new Date();
  d.setDate(d.getDate() - offset);
  rooms[i].lastChanged = formatDate(d);
  save();
}

function markEarlier(i) {
  const date = prompt("Velg dato (YYYY-MM-DD):");
  if (!date) return;
  rooms[i].lastChanged = date;
  save();
}

function deleteRoom(i) {
  if (confirm("Vil du slette rommet?")) {
    rooms.splice(i,1);
    save();
  }
}

function today() {
  return formatDate(new Date());
}
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}
function formatDate(d) {
  return d.toISOString().split("T")[0];
}

renderTable();
