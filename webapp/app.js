const apiUrl = "http://localhost:5000/api";
var map;
var statusbar = document.getElementById("statusbar");

const wait = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

async function configMap() {
  map = L.map("map", {
    doubleClickZoom: false,
  })
    .setView([30.222296, -97.617134], 15)
    .on("dblclick", openCreateForm);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  const response = await fetch(apiUrl + "/getAll");
  const data = await response.json();
  data.forEach((obj) => {
    addMarker(obj);
  });
}

function addMarker(obj) {
  var thisIcon = createIcon(obj.objectType);
  const marker = new L.marker(obj.location, {
    draggable: true,
    title: obj.title,
    icon: thisIcon,
  });
  marker.dbID = obj._id;
  marker.title = obj.title;
  marker.objectType = obj.objectType;
  let popUp = document.createElement("div");

  let updbtn = document.createElement("button");
  updbtn.innerText = "Edit Marker";
  updbtn.onclick = openEditForm;
  updbtn.marker = marker;

  let delbtn = document.createElement("button");
  delbtn.innerText = "Delete Marker";
  delbtn.onclick = deleteObject;
  delbtn.marker = marker;

  popUp.appendChild(updbtn);
  popUp.appendChild(delbtn);
  marker.addTo(map).bindPopup(popUp);
  marker.on("dragend", updateLocation);
  marker.on("click", updateStatus);
}

async function createObject(e) {
  e.preventDefault();
  const response = await fetch(apiUrl + "/post", {
    method: "POST",
    body: JSON.stringify({
      title: document.getElementById("title").value,
      location: [
        document.getElementById("lat").value,
        document.getElementById("lng").value,
      ],
      objectType: document.getElementById("objectType").value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const obj = await response.json();
  statusbar.textContent =
    "New marker " +
    obj.title +
    " located at " +
    obj.location +
    " has been created!";
  addMarker(obj);
  closeCreateForm();
}

async function deleteObject(e) {
  e.preventDefault();
  const marker = e.currentTarget.marker;
  statusbar.textContent =
    "Marker " + marker.options.title + " has been deleted!";
  map.removeLayer(marker);
  const response = await fetch(apiUrl + "/delete/" + marker.dbID, {
    method: "DELETE",
  });
}

async function updateObject(e) {
  e.preventDefault();
  const marker = e.currentTarget.marker;
  marker.title = document.getElementById("markertitle").value;
  marker.objectType = document.getElementById("markerObjectType").value;
  marker.setIcon(createIcon(marker.objectType));
  const response = await fetch(apiUrl + "/update/" + marker.dbID, {
    method: "PATCH",
    body: JSON.stringify({
      title: marker.title,
      location: [marker._latlng.lat, marker._latlng.lng],
      objectType: marker.objectType,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const obj = await response.json();
  statusbar.textContent =
    "Marker " + obj.title + " at " + obj.location + " has been updated!";
  closeEditForm();
}

async function updateLocation() {
  const response = await fetch(apiUrl + "/update/" + this.dbID, {
    method: "PATCH",
    body: JSON.stringify({
      location: [this._latlng.lat, this._latlng.lng],
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const obj = await response.json();
  statusbar.textContent = "Marker " + obj.title + " moved to " + obj.location;
}

function openCreateForm(e) {
  document.getElementById("createFormPopup").style.display = "block";
  document.getElementById("lat").value = e.latlng.lat;
  document.getElementById("lng").value = e.latlng.lng;
  var createForm = document.getElementById("createForm");
  createForm.addEventListener("submit", createObject);
}

function closeCreateForm() {
  document.getElementById("createFormPopup").style.display = "none";
  document.getElementById("createForm").reset();
}

function openEditForm(e) {
  const marker = e.currentTarget.marker;
  document.getElementById("editFormPopup").style.display = "block";
  document.getElementById("markerlat").value = marker._latlng.lat;
  document.getElementById("markerlng").value = marker._latlng.lng;
  document.getElementById("markertitle").value = marker.title;
  document.getElementById("markerObjectType").value = marker.objectType;
  var editForm = document.getElementById("editForm");
  editForm.addEventListener("submit", updateObject);
  editForm.marker = marker;
}

function closeEditForm() {
  document.getElementById("editFormPopup").style.display = "none";
  document.getElementById("editForm").reset();
}

function createIcon(objectType) {
  var thisIcon = L.AwesomeMarkers.icon({
    icon: objectType,
    prefix: "fa",
    markerColor: "green",
    iconColor: "white",
  });
  return thisIcon;
}

function updateStatus(e) {
  const marker = e.target;
  statusbar.textContent =
    "Marker " +
    marker.title +
    " at " +
    marker._latlng.lat +
    " , " +
    marker._latlng.lng +
    " clicked!";
}

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
