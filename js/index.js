

window.onload = () => {
}


var map;
var markers = [];
var infoWindow;


function initMap() {
    var losAngeles = {
        lat: 34.063380,
            lng: -118.358080
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}


function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode) {
        for(var store of stores){
            var postal = store['address']['postalCode'].substring(0,5);
            if(postal == zipCode){
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}


function clearLocations() {
    infoWindow.close();
    for( var i =0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function() {
            new google.maps.event.trigger(markers[index], 'click')

        })
    })
}


function displayStores(stores) {
    var storesHtml = '';
    for( var [index, store] of stores.entries()) {
        var address = store['addressLines'];
        var phone = store['phoneNumber'];

        storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]}</span> 
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>
                    </div>
                </div>
            </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }    
}


function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for( var [index, store] of stores.entries()) {
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]
        );
        var name = store["name"];
        var address = store["addressLines"][0];
        var opentill = store["openStatusText"];
        var phone = store["phoneNumber"];
        bounds.extend(latlng);
        createMarker(name, address, latlng, index+1, opentill, phone);
    }
    map.fitBounds(bounds);
}

function createMarker(name, address, latlng, index, opentill, phone) {
    var html = `
        <div class="marker-info">
            <div class="info-top">
                <b style= 
                'font-size: 21px;
                 color: rgb(0,0,0, 0.87)' >  ${name}  </b>
                <br/> 
                    <div style='
                    color: #B5ADAD;
                    font-size: 16px;
                    margin-bottom: 5px;'> 
                        ${opentill}  
                    </div>
            </div>
            <div class="info-bottom">
                <div>
                    <i class="fas fa-location-arrow"></i> ${address}
                </div>
                <div>
                    <i class="fas fa-phone-alt"></i>${phone}
                </div>
            </div>
        </div>
    `
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: index.toString()
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}