const express = require('express');
const app = express();
app.use(express.json());

// app.use('/');

app.get('/', (req, res) => res.send('Welcome to Make REST API Calls In Express!'))

//config map
let config = {
    minZoom: 10,
    maxZoom: 15,
  };
  const zoom = 15;
  const lat = 30.222296;
  const lng = -97.617134;
  
  const map = L.map("map", [30.222296, -97.617134]).setView([lat, lng], zoom);
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',}).addTo(map);
  
  // const object = new L.marker([30.222296, -97.617134], { draggable: true });
  // object.addTo(map);
  
  const apiUrl = 'http://localhost:5000/api/getAll'
  
  async function getMarkers() {
      fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const object = new L.marker([30.222296, -97.617134], { draggable: true });
  object.addTo(map);
      })
      res.forEach(object => {
          const marker = L.marker(object.location, { draggable: true }).addTo(map);
      })
  }
  
  // async function getMarkers() {
  //   app.get("/api/getAll", function(req, res){
  //     Item
  //   }
  // }
  
  getMarkers();
  
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
  
  
  // document.getElementById("defaultOpen").click();
  
  
  app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
  })