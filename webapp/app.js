//config map
let config = {
  minZoom: 10,
  maxZoom: 5000,
};
const zoom = 15;
const lat = 30.222296;
const lng = -97.617134;

const map = L.map("map", config).setView([lat, lng], zoom);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const apiUrl = "http://localhost:5000/api";
getMarkers();
map.on("click", addObject);

async function getMarkers() {
  const response = await fetch(apiUrl + "/getAll");
  const data = await response.json();
  data.forEach((obj) => {
    const marker = new L.marker(obj.location, { draggable: true });
    let btn = document.createElement("button");
    btn.innerText = "Delete Marker";
    btn.onclick = function () {
      map.removeLayer(marker);
      removeObject(obj._id.toString());
    };
    marker.addTo(map).bindPopup(btn);
    marker.on("dragend", moveObject);
  });
}

function addProperty(id) {
  var field = document.createElement("input");
  field.setAttribute("type", "text");
  field.setAttribute("class", "added-prop-key");
  field.setAttribute("placeholder", "Key");
  var textbox = document.createElement("input");
  textbox.setAttribute("type", "text");
  textbox.setAttribute("class", "added-prop-value");
  textbox.setAttribute("placeholder", "Value");
  document.getElementById(id).append(field, textbox);
}
function addObject(event) {
  var marker = new L.marker(event.latlng, { draggable: true });
  marker.addTo(map);
  //Pop up form - get attributes
  const response = fetch("http://localhost:5000/api/post", {
    method: "POST",
    body: JSON.stringify({
      title: "hi",
      location: [event.latlng.lat, event.latlng.lng],
      objectType: "star",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    }, 
  });
  const obj = response.json();
  let btn = document.createElement("button");
    btn.innerText = "Delete Marker";
    btn.onclick = function () {
      map.removeLayer(marker);
      removeObject(obj._id.toString());
    };
    marker.addTo(map).bindPopup(btn);
    marker.on("dragend", moveObject);
  statusbar.textContent =
    "New object created at: " + event.latlng.lat + "" + event.latlng.lng;
}

function validateForm(id) {
  let x = document.forms[id]["title"].value;
  if (x == "") {
    alert("Title must be filled out");
    return false;
  }
}

// function onOpenPopup() {
//   const object = this;
//   const removebutton = document.querySelector(".remove");
//   const editbutton = document.querySelector(".edit");
//   removebutton.addEventListener("click", function () {
//     statusbar.textContent =
//       "Object removed from:" + this.latlng.lat + " " + this.latlng.lng;
//     map.removeLayer(object);
//     const response = fetch(apiUrl+"/delete/:id"+id);
//     const deleted = response.json();
//   });
//   editbutton.addEventListener("click", function () {
//     const popupPanel =
//       "<form id=" +
//       this.id +
//       ' onSubmit="return validateForm(' +
//       this.id +
//       ')"><label for="Title">Title:</label><input type="text" id="title" name="title" value=' +
//       this.title +
//       "><br><span>Location:" +
//       this.location +
//       '</span><button type="button" class="Submit">Save Marker</button></form><button type="button" class="add-prop" onClick="addProperty(' +
//       this.id +
//       ')">Add Property</button><button type="button" class="edit">Edit Marker</button> <button type="button" class="remove">Delete Marker</button>';
//     this.bindPopup(popupPanel).openPopup();
//   });
// }

async function removeObject(id) {
  
  const response = await fetch("http://localhost:5000/api/delete/"+ id);
  const data = await response.json();
}

function moveObject(id) {

}



function changeTab(evt, action) {
  var i, tabpanes, tablinks;
  tabpanes = document.getElementsByClassName("tab-pane");
  for (i = 0; i < tabpanes.length; i++) {
    tabpanes[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab-link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(action + "-pane").style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
