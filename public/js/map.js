// Popup remove function for older browsers
/* This will let you use the .remove() function later on */
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

// Name of Boroughs
let boroughNames = ["Manhatton South", "Manhatton North", "Bronx", "Brooklyn South", "Brooklyn North", "Queens South", "Queens North", "Staten Island"];

let borough0 = ["16 Ericsson Place", "19 Elizabeth Street", "233 West 10 Street", "19 1/2 Pitt Street", "321 East 5 Street", "230 West 20th Street", "230 East 21st Street", "357 West 35th Street", "167 East 51st Street", "306 West 54th Street"];

let borough1 = ["153 East 67th Street", "120 West 82nd Street", "86th St & Transverse Road", "164 East 102nd Street", "151 West 100th Street", "120 East 119th Street", "520 West 126th Street", "2271-89 8th Avenue", "451 West 151st Street", "250 West 135th Street", "2207 Amsterdam Avenue", "4295 Broadway"];

let borough2 = ["257 Alexander Avenue", "1035 Longwood Avenue", "	830 Washington Avenue", "900 Fteley Avenue", "2 East 169th Street", "2877 Barkley Avenue", "2120 Ryer Avenue", "4111 Laconia Avenue", "450 Cross Bronx Expressway", "2121 Eastchester Road", "3450 Kingsbridge Avenue", "3016 Webster Avenue"];

let borough3 = ["2951 West 8th Street", "2575 Coney Island Avenue", "1925 Bath Avenue", "1844 Brooklyn Avenue", "5822 16th Avenue", "2820 Snyder Avenue", "333 65th Street", "9720 Foster Avenue", "154 Lawrence Avenue", "421 Empire Boulevard", "830 4th Avenue", "191 Union Street", "65 6th Avenue"];

let borough4 = ["1470 East New York Avenue", "1000 Sutter Avenue", "127 Utica Avenue", "263 Tompkins Avenue", "30 Ralph Avenue", "480 Knickerbocker Avenue", "301 Gold Street", "298 Classon Avenue", "211 Union Avenue", "100 Meserole Avenue"];

let borough5 = ["92-24 Rockaway Beach Boulevard", "16-12 Mott Avenue", "87-34 118th Street", "168-02 P.O Edward Byrne Ave", "92-08 222nd Street", "103-53 101st Street", "71-01 Parsons Boulevard", "167-02 Baisley Boulevard"];

let borough6 = ["64-2 Catalpa Avenue", "5-47 50th Avenue", "37-05 Union Street", "94-41 43rd Avenue", "45-06 215th Street", "68-40 Austin Street", "34-16 Astoria Boulevard", "92-15 Northern Boulevard"];

let borough7 = ["78 Richmond Terrace", "970 Richmond Avenue", "2320 Hylan Boulevard", "116 Main Street"];

let boroughs = [borough0, borough1, borough2, borough3, borough4, borough5, borough6, borough7];

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zaWV3aWxsaWFtcyIsImEiOiJja2s4YnFiNHcwbTRpMnRueWUzcHVoaXMzIn0.CDH_0YEV8Y30zS2ZmaAUQg';

const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/josiewilliams/ckb8do48p08t61iqfy7a7xuec', //replace this with your style URL
    center: [-73.903, 40.709],
    zoom: 9.83
});

// *********************** Code to be added here *****************************
/* Adding Markers Start*/
// Geojson data
// Fetch incidents from API
var incidentsTotal = {
    type: 'FeatureCollection',
    features: []
};

var incidents = {
    type: 'FeatureCollection',
    features: []
};
async function getIncidents() {
    const res = await fetch('/api/v1/incidents');
    const data = await res.json();

    incidentsTotal.features = data.data.map(incident => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [incident.location.coordinates[0], incident.location.coordinates[1]]
            },
            properties: {
                title: incident.identifiers,
                description: incident.incidentdesc,
                borough: boroughNames[parseInt(incident.borough)],
                address: boroughs[parseInt(incident.borough)][parseInt(incident.address)],
                incidentDate: incident.incidentDate
            }
        }
    });
    incidents.features = incidentsTotal.features;
    loadMap();
}
/*
var incidents = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-73.903, 40.709]
        },
        properties: {
            title: 'Mapbox',
            description: 'Washington, D.C.'
        }
    },
    {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-73.77937994488394, 40.7268537567339]
        },
        properties: {
            title: 'Mapbox',
            description: 'San Francisco, California'
        }
    }]
};
*/
// add markers to map
// changed to {incidentsTotal} from {incidents} on {2021-02-24}
incidentsTotal.features.forEach(function (incident, i) {
    incident.properties.id = i;
    // Custom Marker
    /*
    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';
  
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat(incident.geometry.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + incident.properties.title + '</h3><p>' + incident.properties.description + '</p>'))
      .addTo(map);
    */
});

function loadMap1() {
    map.getSource('places').setData(incidents);
    /*map.addSource('places', {
        type: 'geojson',
        data: incidents
    });*/
    addMarkers();
}

// loading of map will be done when this function is called
function loadMap() {
    map.addSource('places', {
        type: 'geojson',
        data: incidents
    });
    addMarkers();
}
// Showing marker on load
//will be placed inside loadMap() function


// Zoom on the clicked marker
function flyToIncident(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15
    });
}

// Create popup for clicked marker
function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popUps[0]) popUps[0].remove();

    var popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>' + currentFeature.properties.title + '</h3>' +
            '<h4>' + currentFeature.properties.description + '</h4>')
        .addTo(map);
    popup.on('close', function () {
        console.log('popup was closed');
        map.flyTo({
            center: [-73.903, 40.709],
            zoom: 9.83
        });
    });
}
let markers = [];
//Removing Markers
function removeMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].remove();
    }
}

// Adding Markers to each Incident
function addMarkers() {
    /* For each feature in the GeoJSON object above: */
    incidents.features.forEach(function (marker) {
        /* Create a div element for the marker. */
        var el = document.createElement('div');
        /* Assign a unique `id` to the marker. */
        el.id = "marker-" + marker.properties.id;
        /* Assign the `marker` class to each marker for styling. */
        el.className = 'marker';

        /**
         * Create a marker using the div element
         * defined above and add it to the map.
        **/
        var marker1 = new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
        markers.push(marker1);
        el.addEventListener('click', function (e) {
            /* Fly to the point */
            flyToIncident(marker);
            /* Close all other popups and display popup for clicked store */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            /*
            var activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            var listing = document.getElementById('listing-' + marker.properties.id);
            listing.classList.add('active');
            */
        });
    });
}
/*
map.on('click', function(e) {
    // Determine if a feature in the "locations" layer exists at that point. 
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['locations']
    });
    
    // If yes, then:
    if (features.length) {
      var clickedPoint = features[0];
      
      // Fly to the point 
      flyToIncident(clickedPoint);
      
      // Close all other popups and display popup for clicked store 
      createPopUp(clickedPoint);
      
      // Highlight listing in sidebar (and remove highlight for all other listings) 
      
      //var activeItem = document.getElementsByClassName('active');
      //if (activeItem[0]) {
       // activeItem[0].classList.remove('active');
      //}
      //var listing = document.getElementById('listing-' + clickedPoint.properties.id);
      //listing.classList.add('active');
    }
});
*/

getIncidents();
/* Adding Markers End*/

map.on('mousemove', function (e) {
    var precincts = map.queryRenderedFeatures(e.point, {
        layers: ['nypd-precinct-tileset']
    });

    if (precincts.length > 0) {
        //Tooltip to guide to ad information:



        document.getElementById('pd').innerHTML = '<h3><strong> Precinct #' + precincts[0].properties.precinct + '</strong></h3>' +

            //BASIC PRECINCT INFORMATION
            '<p><em> Commanding Officer: <strong>' + precincts[0].properties.commanding_officer + '</strong></em></p>' +

            //TODO: Commanding Officer Photo
            //<img src= precincts[0].properties.precinct + ".jpg" alt="commanding officer" style="width:40px;height:60px;"> +

            '<p><em> Precinct Phone Number: <strong>' + precincts[0].properties.precinct_number + '</strong></em></p>' +

            //USE OF FORCE:
            '<hr><h3><u>Total Use of Force</u>: ' + precincts[0].properties.use_of_force_total + '</h3>' +
            '<p><em> Physical Force: <strong>' + precincts[0].properties.use_of_force_phys + '</strong></em></p>' +
            '<p><em> Firearm: <strong>' + precincts[0].properties.use_of_force_firearm + '</strong></em></p>' +
            '<p><em> Eletrical Weapon: <strong>' + precincts[0].properties.use_of_force_elec + '</strong></em></p>' +
            '<p><em> Impact Weapon: <strong>' + precincts[0].properties.use_of_force_impact + '</strong></em></p>' +
            '<p><em> OC Spray: <strong>' + precincts[0].properties.use_of_force_oc_spray + '</strong></em></p>' +
            '<p><em> Mesh Blanket: <strong>' + precincts[0].properties.use_of_force_mesh + '</strong></em></p>' +
            '<p><em> Canine: <strong>' + precincts[0].properties.use_of_force_canine + '</strong></em></p>' +

            //SUBJECT INJURIES:
            '<hr><h3><u>Total Subject Injuries</u>: ' + precincts[0].properties.subject_injuries_total + '</h3>' +
            '<p><em>Serious Injuries: <strong>' + precincts[0].properties.subject_injuries_serious + '</strong></em></p>' +
            '<p><em>Substantial Injuries: <strong>' + precincts[0].properties.subject_injuries_substantial + '</strong></em></p>' +
            '<p><em>Physical Injuries: <strong>' + precincts[0].properties.subject_injuries_phys + '</strong></em></p>';

    } else {
        document.getElementById('pd').innerHTML = '<p>Hover over a precinct</p>';
    }
});

// Added By Asad Mujumder
// Get the SideNavButton
var modal = document.getElementById('sideNavButton').addEventListener("click", displaySideNav);

// Added By Asad Mujumder
// Will display the side Nav Bar to add data
function displaySideNav() {
    if (screen.width < 768) {
        document.getElementById("mySidenav").style.width = '330px';
    } else {
        document.getElementById("mySidenav").style.width = '630px';
    }
}

// Added By Asad Mujumder
let coords;

// Added By Asad Mujumder
// The `click` event is an example of a `MapMouseEvent`.
// Set up an event listener on the map.
map.on('click', function (e) {
    // The event object (e) contains information like the
    // coordinates of the point on the map that was clicked.
    coords = e.lngLat;
});


let boroughSelect = document.querySelector('#borough');
let addressSelect = document.querySelector('#address');

boroughSelect.addEventListener("change", function () {
    displayAddress(boroughSelect.value);
});

function displayAddress(borough) {
    // delete the current set of <option> elements out of the
    // day <select>, ready for the next set to be injected
    addressSelect.removeAttribute("disabled");
    while (addressSelect.firstChild) {
        addressSelect.removeChild(addressSelect.firstChild);
    }

    var option = document.createElement('option');
    option.textContent = "Address";
    option.setAttribute("selected", "selected");
    option.setAttribute("disabled", "disabled");
    option.value = "";

    addressSelect.appendChild(option);

    var i;
    for (i = 0; i < boroughs[borough].length; i++) {
        var option = document.createElement('option');
        option.textContent = boroughs[borough][i];
        option.value = i;
        addressSelect.appendChild(option);
    }
}

let injuredSelectYes = document.querySelector('#injuredYes');
let injuredSelectNo = document.querySelector('#injuredNo');

injuredSelectYes.addEventListener("click", displayInjuredYes);
injuredSelectNo.addEventListener("click", displayInjuredNo);

function displayInjuredYes() {
    document.querySelector('#injureddesc').removeAttribute("disabled");
}
function displayInjuredNo() {
    document.querySelector('#injureddesc').setAttribute("disabled", "disabled");
    document.querySelector('#injureddesc').value = "";
    document.querySelector('#injureddesc').textContent = "";
}

let treatmentSelectYes = document.querySelector('#treatmentYes');
let treatmentSelectNo = document.querySelector('#treatmentNo');
let treatmentSelectRefused = document.querySelector('#treatmentRefused');

treatmentSelectYes.addEventListener('click', displayWhereYes);
treatmentSelectNo.addEventListener('click', displayWhereNo);
treatmentSelectRefused.addEventListener('click', displayWhereNo);

function displayWhereYes() {
    document.querySelector('#treatmentPlaceOn').removeAttribute("disabled");
    document.querySelector('#treatmentPlaceRoom').removeAttribute("disabled");
    document.querySelector('#treatmentPlaceOther').removeAttribute("disabled");
}
function displayWhereNo() {
    document.querySelector('#treatmentPlaceOn').setAttribute("disabled", "disabled");
    document.querySelector('#treatmentPlaceOn').checked = false;
    document.querySelector('#treatmentPlaceRoom').setAttribute("disabled", "disabled");
    document.querySelector('#treatmentPlaceRoom').checked = false;
    document.querySelector('#treatmentPlaceOther').setAttribute("disabled", "disabled");
    document.querySelector('#treatmentPlaceOther').checked = false;
}

var requiredFields = document.getElementsByClassName('required');

var j;
for (j = 0; j < requiredFields.length; j++) {
    requiredFields[j].addEventListener('focusin', restore);
    requiredFields[j].addEventListener('focusout', validate);
    requiredFields[j].addEventListener('change', remove);
}

/*let radiovalidationlist = ["resident", "notified", "witness", "injured", "treatment"];
var form = document.forms[0];
for(var n = 0;n < radiovalidationlist.length;n++){
    var x = form[radiovalidationlist[n]];
    console.log(x);
    document.getElementById(radiovalidationlist[n]+"Yes").addEventListener('change',remove);
}*/

document.getElementById('residentYes').addEventListener('click', remove);
document.getElementById('residentNo').addEventListener('click', remove);
document.getElementById('notifiedYes').addEventListener('click', remove);
document.getElementById('notifiedNo').addEventListener('click', remove);
document.getElementById('witnessYes').addEventListener('click', remove);
document.getElementById('witnessNo').addEventListener('click', remove);
document.getElementById('injuredYes').addEventListener('click', remove);
document.getElementById('injuredNo').addEventListener('click', remove);
document.getElementById('treatmentYes').addEventListener('click', remove);
document.getElementById('treatmentNo').addEventListener('click', remove);
document.getElementById('treatmentRefused').addEventListener('click', remove);

function restore() {
    this.style.border = '1px solid #ccc';
}

function validate() {
    var e = this.getAttribute("name") + "Error";
    if (this.value == "") {
        this.style.border = '1px solid red';
        document.getElementById(e).style.display = "block";
    }
    else if (this.getAttribute("id") == "identifiers") {
        var identifiers = this.value.split(',');
        if (identifiers.length < 2) {
            this.style.border = '1px solid red';
            document.getElementById("identifiersError").style.display = 'block';
            return false;
        }

        var i;
        for (i = 0; i < identifiers.length; i++) {
            var k = identifiers[i].trim();
            if ((k.charAt(0) != '#' || k.length < 2) && i < 2) {
                this.style.border = '1px solid red';
                document.getElementById("identifiersError").style.display = 'block';
                return false;
            }
        }
        this.style.border = '1px solid #ccc';
        document.getElementById("identifiersError").style.display = 'none';
    }
    else {
        this.style.border = '1px solid #ccc';
        document.getElementById(e).style.display = "none";
    }
}

function remove() {
    var e = this.getAttribute("name") + "Error";
    document.getElementById(e).style.display = "none";
}

document.getElementById("myForm").addEventListener("submit", validateForm);

let validationlist = ["incidentDate", "borough", "address", "resident", "notified", "identifiers", "incidentdesc", "witness", "injured", "treatment"];

let list = ["incidentDate", "hour", "minute", "meridiem", "borough", "address", "resident", "notified", "crossStreet", "identifiers", "incidentdesc", "witness", "injured", "injureddesc", "treatment", "treatmentPlace", "officersName", "officersBadge", "officersCar"];
function validateForm(event) {
    event.preventDefault();
    var form = document.forms['myForm'];
    var send = true;

    var i;
    for (i = 0; i < validationlist.length; i++) {
        var x = form[validationlist[i]];
        if (x.value == "") {
            var e = validationlist[i] + "Error";
            document.getElementById(e).style.display = "block";
            if (i == 0 || i == 1 || i == 2 || i == 5 || i == 6) {
                x.style.border = "1px solid red";
            }
            event.stopPropagation();
            send = false;
            //return false;
        } else if (i == 5) {
            var identifiers = x.value.split(',');
            if (identifiers.length < 2) {
                x.style.border = '1px solid red';
                document.getElementById("identifiersError").style.display = 'block';
                event.stopPropagation();
                send = false;
                //return false;
            }

            var m;
            for (m = 0; m < identifiers.length; m++) {
                var k = identifiers[m].trim();
                if ((k.charAt(0) != '#' || k.length < 2) && m < 2) {
                    x.style.border = '1px solid red';
                    document.getElementById("identifiersError").style.display = 'block';
                    event.stopPropagation();
                    send = false;
                    //return false;
                }
            }
            x.style.border = '1px solid #ccc';
            document.getElementById("identifiersError").style.display = 'none';
        }
    }
    //console.log(coords.lng,coords.lat);
    //Submition of Form
    if (coords && send) {
        let data = {
            longitude: coords.lng,
            latitude: coords.lat
        };
        coords = null;
        form["identifiers"].value = form["identifiers"].value.toLowerCase().trim();
        form["incidentdesc"].value = form["incidentdesc"].value.trim();
        if (form["injureddesc"]) {
            form["injureddesc"].value = form["injureddesc"].value.trim();
        }
        if (form["officersName"]) {
            form["officersName"].value = form["officersName"].value.trim();
        }
        if (form["officersBadge"]) {
            form["officersBadge"].value = form["officersBadge"].value.trim();
        }
        if (form["officersCar"]) {
            form["officersCar"].value = form["officersCar"].value.trim();
        }
        for (var i = 0; i < list.length; i++) {
            var x = form[list[i]];
            if (x.value != "") {
                data[list[i]] = x.value;
            }
        }
        addIncident(data);
    } else if (!coords) {
        alert("Please click on the place or precinct where the incident happened.")
    }
}

//Send Post to API to add data
async function addIncident(data) {
    //need to be fixed

    try {
        const res = await fetch('/api/v1/incidents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        /*
        if(res.status === 400){
            throw Error('Store already exists');
        }*/
        closeNav();
        alert('Your data is added.');
        window.location.href = '/index.html';
    } catch (error) {
        alert(error);
        return;
    }
}

// Added By Asad Mujumder
// Get the SideNavButton
var modal = document.getElementById('sideNavButton').addEventListener("click", displaySideNav);

// Added By Asad Mujumder
// Will display the side Nav Bar to add data
function displaySideNav() {
    if (screen.width < 768) {
        document.getElementById("mySidenav").style.width = '330px';
    } else {
        document.getElementById("mySidenav").style.width = '630px';
    }
}
// Added By Asad Mujumder
// Get the SideNavButton
document.getElementById('closeNavButton').addEventListener("click", closeNav);

// Added By Asad Mujumder
/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// For Search Side Bar

let boroughSearchSelect = document.querySelector('#boroughSearch');
let addressSearchSelect = document.querySelector('#addressSearch');

boroughSearchSelect.addEventListener("change", function () {
    displayAddressSearch(boroughSearchSelect.value);
});

function displayAddressSearch(borough) {
    // delete the current set of <option> elements out of the
    // day <select>, ready for the next set to be injected
    addressSearchSelect.removeAttribute("disabled");
    while (addressSearchSelect.firstChild) {
        addressSearchSelect.removeChild(addressSearchSelect.firstChild);
    }

    var option = document.createElement('option');
    option.textContent = "Address";
    option.setAttribute("selected", "selected");
    option.setAttribute("disabled", "disabled");
    option.value = "";

    addressSearchSelect.appendChild(option);

    var i;
    for (i = 0; i < boroughs[borough].length; i++) {
        var option = document.createElement('option');
        option.textContent = boroughs[borough][i];
        option.value = i;
        addressSearchSelect.appendChild(option);
    }
}

// Searching:
function filterData(event) {
    event.preventDefault();
    event.stopPropagation();
    //Extract search form data and filter data based on that
    /* ***************** Need to be done ****************** */
    var incidentsSearched = {
        type: 'FeatureCollection',
        features: []
    };
    //incidentsSearched.features = incidentsTotal.features;
    var identifiersSearch = document.getElementById("identifiersSearch");
    var dateSearch = document.getElementById("incidentDateSearch");
    var boroughSearch = document.getElementById("boroughSearch");
    var addressSearch = document.getElementById("addressSearch");

    if (identifiersSearch.value != "") {
        var identifiers = identifiersSearch.value.split(',');
        var i;
        for (i = 0; i < identifiers.length; i++) {
            var iValue = identifiers[i].toLowerCase().trim();
            incidentsTotal.features.forEach(function (incident) {
                var iTValue = incident.properties.title;

                if (iTValue.search(iValue) != -1) {
                    incidentsSearched.features.push(incident);
                }
            });
        }
    }

    if (dateSearch.value != "") {
        var date = dateSearch.value;
        if (incidentsSearched.features.length != 0) {
            for (var i = 0; i < incidentsSearched.features.length; i++) {
                var dTValue = incidentsSearched.features[i].properties.incidentDate;
                if (dTValue != date) {
                    incidentsSearched.features.splice(i, 1);
                }
            }
        } else {
            incidentsTotal.features.forEach(function (incident) {
                var dTValue = incident.properties.incidentDate;
                if (dTValue == date) {
                    incidentsSearched.features.push(incident);
                }
            });
        }
    }

    if (boroughSearch.value != "") {
        var b = boroughNames[parseInt(boroughSearch.value)];
        if (incidentsSearched.features.length != 0) {
            for (var i = 0; i < incidentsSearched.features.length; i++) {
                var bTValue = incidentsSearched.features[i].properties.borough;
                if (bTValue != b) {
                    incidentsSearched.features.splice(i, 1);
                }
            }
        } else {
            incidentsTotal.features.forEach(function (incident) {
                var bTValue = incident.properties.borough;
                if (bTValue == b) {
                    incidentsSearched.features.push(incident);
                }
            });
        }
    }

    // 
    if (addressSearch.value != "") {
        var a = boroughs[parseInt(boroughSearch.value)][parseInt(addressSearch.value)];
        if (incidentsSearched.features.length != 0) {
            for (var i = 0; i < incidentsSearched.features.length; i++) {
                var aTValue = incidentsSearched.features[i].properties.address;
                if (aTValue != a) {
                    incidentsSearched.features.splice(i, 1);
                }
            }
        } else {
            incidentsTotal.features.forEach(function (incident) {
                var aTValue = incident.properties.address;
                if (aTValue == a) {
                    incidentsSearched.features.push(incident);
                }
            });
        }
    }

    if (incidentsSearched.features.length > 0) {
        identifiersSearch.value = "";
        dateSearch.value = "";
        boroughSearch.value = "";
        addressSearch.value = "";
        addressSearch.setAttribute('disabled','disabled');
        // Remove Search element
        var removeSearchEl = document.createElement('div');
        removeSearchEl.id = "removeSearch";
        removeSearchEl.innerHTML = "&times; Remove Search";

        removeSearchEl.addEventListener('click', function () {
            removeMarkers();
            incidents.features = incidentsTotal.features;
            loadMap1();
            document.body.removeChild(this);
        });

        document.body.appendChild(removeSearchEl);
        removeMarkers();
        closeSearchNav();
        incidents.features = incidentsSearched.features;
        loadMap1();
    } else {
        alert("No incident found for this search");
    }
}

document.getElementById('searchbutton').addEventListener('click', filterData);

// Added By Asad Mujumder
// Get the SideNavButton
document.getElementById('sideSearchButton').addEventListener("click", displaySearchNav);

// Added By Asad Mujumder
// Will display the side Nav Bar to add data
function displaySearchNav() {
    if (screen.width < 768) {
        document.getElementById('offsetaddressSearch').display = 'none';
        document.getElementById("searchSideNav").style.width = '330px';
    } else {
        document.getElementById('offsetaddressSearch').display = 'block';
        document.getElementById("searchSideNav").style.width = '480px';
    }
}


// Added By Asad Mujumder
// Get the SideNavButton
document.getElementById('closeSearchButton').addEventListener("click", closeSearchNav);

// Added By Asad Mujumder
/* Set the width of the side navigation to 0 */
function closeSearchNav() {
    document.getElementById("searchSideNav").style.width = "0";
}