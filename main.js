let map;
let markers = [];
let currentPosition;
let currentMarker;
const inputDestination = document.getElementById("destination");
const inputOrigin = document.getElementById("origin");


const checkDestination = document.getElementById("checkDestination");
const checkOrigin = document.getElementById("checkOrigin");

function initMap(){
    const mapElement = document.getElementById("map");
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            // console.log(position)
            currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
          // console.log(currentPosition);
            map = new google.maps.Map(mapElement,{
                center: currentPosition,
                zoom: 15
            });
            currentMarker = new google.maps.Marker({
                position: currentPosition,
                map: map,
                title: "Localização Atual",
                icon: "/images/panda.png",
            });
        });
    }

    initAutoComplete();
    const btnSubmit = document.getElementById("btnSubmit");
    const btnClear = document.getElementById("btnClear");

    btnSubmit.addEventListener("click", renderRoute);
    
    function renderRoute(e) {
        e.preventDefault();
        // console.log(event)
        
        //pegar as instancias de limites dos markers
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
        
        //DirectionsServices
        const directionsService = new google.maps.DirectionsService();
        const directionsDisplay = new google.maps.DirectionsRenderer();
        
        //Setar mapa com direções renderizadas, associa o display ao mapa
        directionsDisplay.setMap(map);
        
        const origin = markers[0].getPosition();
        const destination = markers[1].getPosition();
        
        
        const travelMode = document.getElementById("travelMode");
        const request = {
            //origin = origin,
            origin,
            // destination=destination,
            destination,
            travelMode: travelMode.value,
        }
        
        travelMode.onchange = ()=>{
            directionsDisplay.setMap(null);
            renderRoute(e);
            
        }
        directionsService.route(request,(result, status) => {
            if(status == "OK"){
                directionsDisplay.setDirections(result);
            }else {
                window.alert("Wrong Direction" + status);
            }
        })
        btnClear.onclick = (e) => {
            e.preventDefault();
            console.log("aqui");
            directionsDisplay.setMap(null);
            destinationMarker=null;
            markers.forEach(marker => marker.setMap(null));
            markers=[];
        }
    }
    
}

//Criando autoComplete no Input
function initAutoComplete(){
    const options = {
        types: ["(cities)"],
    };
    // const inputOrigin = document.getElementById("origin");
    
    let autoCompleteOrigin = new google.maps.places.Autocomplete(inputOrigin, options);

    autoCompleteOrigin.addListener("place_changed", () =>{
        const place = autoCompleteOrigin.getPlace();
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const origin = {lat,lng};
        const originMarker = new google.maps.Marker({
            position: origin,
            map: map,
            icon: "/images/bear.svg",
            title: "Origin",
        });

        markers.push(originMarker);
        map.setCenter(origin);
    });


    // const inputDestination = document.getElementById("destination");


    let autoCompleteDestination = new google.maps.places.Autocomplete(inputDestination, options);
    autoCompleteDestination.addListener("place_changed", () =>{
        const place = autoCompleteDestination.getPlace();
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const destination = {lat,lng};
        const destinationMarker = new google.maps.Marker({
            position: destination,
            map: map,
            title: "Destination",
            icon: "https://images.vexels.com/media/users/3/203579/isolated/lists/17ef0dee527904176a89e31489d58dd9-icone-de-bambu-verde-claro-com-tres-curvas-de-distancia.png",
        });

        markers.push(destinationMarker);
        map.setCenter(destination);
    });

    
    
}    

checkDestination.addEventListener("change",()=>{
    if(checkDestination.checked){
        inputDestination.setAttribute("disabled", false );
        markers[1]=currentMarker;

    }else{

        inputDestination.disabled=false;
    }   
    });

checkOrigin.addEventListener("change",()=>{
    if(checkOrigin.checked){
        inputOrigin.setAttribute("disabled", false );
        markers[0]=currentMarker;

    }else{
        inputOrigin.disabled=false;
    }
    });